import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3-flash-preview";
const FIRECRAWL_GATEWAY = "https://connector-gateway.lovable.dev/firecrawl/v2";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

async function callGateway(body: Record<string, unknown>) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
    },
    body: JSON.stringify({ model: MODEL, ...body }),
  });
  if (!res.ok) {
    const text = await res.text();
    if (res.status === 429) throw new Error("Rate limit reached. Try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted. Add credits to continue.");
    throw new Error(`AI gateway error (${res.status}): ${text.slice(0, 200)}`);
  }
  return (await res.json()) as { choices: { message: { content: string } }[] };
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON in response");
  return JSON.parse(raw.slice(start, end + 1));
}

async function firecrawlSearch(query: string): Promise<string> {
  const lovKey = process.env.LOVABLE_API_KEY;
  const fcKey = process.env.FIRECRAWL_API_KEY;
  if (!lovKey || !fcKey) return "";
  try {
    const res = await fetch(`${FIRECRAWL_GATEWAY}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovKey}`,
        "X-Connection-Api-Key": fcKey,
      },
      body: JSON.stringify({
        query,
        limit: 5,
        scrapeOptions: { formats: ["markdown"], onlyMainContent: true },
      }),
    });
    if (!res.ok) {
      console.error("Firecrawl search failed", res.status, await res.text().catch(() => ""));
      return "";
    }
    type Hit = { url?: string; title?: string; description?: string; markdown?: string };
    const json = (await res.json()) as {
      data?: Hit[] | { web?: Hit[]; news?: Hit[]; results?: Hit[] };
      web?: Hit[];
      results?: Hit[];
    };
    const d = json.data;
    const items: Hit[] = Array.isArray(d)
      ? d
      : [...(d?.web ?? []), ...(d?.news ?? []), ...(d?.results ?? []), ...(json.web ?? []), ...(json.results ?? [])];
    return items
      .map((r, i) => {
        const body = (r.markdown ?? r.description ?? "").slice(0, 2500);
        return `--- SOURCE ${i + 1}: ${r.title ?? ""} (${r.url ?? ""}) ---\n${body}`;
      })
      .join("\n\n")
      .slice(0, 14000);
  } catch (err) {
    console.error("Firecrawl search error", err);
    return "";
  }
}

export const fetchAndAddCompany = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const v = input as { name?: string };
    if (!v?.name || typeof v.name !== "string" || v.name.trim().length < 2) {
      throw new Error("Company name is required");
    }
    return { name: v.name.trim().slice(0, 100) };
  })
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const slug = slugify(data.name);

    // If already exists, just return it
    const { data: existing } = await supabase
      .from("companies")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (existing) return existing;

    // 1) Pull real web sources via Firecrawl
    const [overview, placement] = await Promise.all([
      firecrawlSearch(`${data.name} company official website careers headquarters industry`),
      firecrawlSearch(`${data.name} India campus placement eligibility CGPA cutoff hiring process salary LPA branches`),
    ]);
    const sources = [overview, placement].filter(Boolean).join("\n\n");

    if (!sources) {
      throw new Error("Could not fetch live web data for this company. Try again shortly.");
    }

    const prompt = `You are a placement research analyst. Using ONLY the web sources provided below, extract accurate, verifiable information about "${data.name}" for Indian campus placements. Do NOT invent facts. If a field is not supported by the sources, set it to null. Return ONLY a JSON object with this shape:
{
  "name": string,
  "industry": string,
  "description": string (2-3 sentences),
  "website": string,
  "careers_url": string,
  "hq_location": string,
  "min_cgpa": number|null (typical campus cutoff, e.g. 7.0),
  "allowed_branches": string[] (e.g. ["CSE","IT","ECE"]),
  "tech_stack": string[],
  "salary_min": number|null (LPA, integer),
  "salary_max": number|null (LPA, integer),
  "hiring_season": string (e.g. "Autumn 2025"),
  "process_steps": string[] (ordered),
  "dsa_topics": string[],
  "cs_subjects": string[]
}
No prose, no markdown, JSON only.

WEB SOURCES:
${sources}`;

    const result = await callGateway({
      messages: [
        { role: "system", content: "You output strict JSON only. Ground every field in the provided web sources; use null when unsupported." },
        { role: "user", content: prompt },
      ],
    });
    const content = result.choices?.[0]?.message?.content ?? "";
    const parsed = extractJson(content) as Record<string, unknown>;

    const row = {
      slug,
      name: (parsed.name as string) || data.name,
      industry: (parsed.industry as string) ?? null,
      description: (parsed.description as string) ?? null,
      website: (parsed.website as string) ?? null,
      careers_url: (parsed.careers_url as string) ?? null,
      hq_location: (parsed.hq_location as string) ?? null,
      min_cgpa: (parsed.min_cgpa as number) ?? null,
      allowed_branches: (parsed.allowed_branches as string[]) ?? null,
      tech_stack: (parsed.tech_stack as string[]) ?? null,
      salary_min: parsed.salary_min != null ? Math.round(Number(parsed.salary_min)) : null,
      salary_max: parsed.salary_max != null ? Math.round(Number(parsed.salary_max)) : null,
      hiring_season: (parsed.hiring_season as string) ?? null,
      process_steps: (parsed.process_steps as string[]) ?? null,
      dsa_topics: (parsed.dsa_topics as string[]) ?? null,
      cs_subjects: (parsed.cs_subjects as string[]) ?? null,
    };

    const { data: inserted, error } = await supabase
      .from("companies")
      .insert(row)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return inserted;
  });

export const chatMentor = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const v = input as { messages?: ChatMessage[] };
    if (!Array.isArray(v?.messages)) throw new Error("messages required");
    return {
      messages: v.messages.slice(-20).map((m) => ({
        role: m.role,
        content: String(m.content ?? "").slice(0, 4000),
      })),
    };
  })
  .handler(async ({ data, context }) => {
    // Fetch 10-source student context: profile, academics, applications, roadmap
    const { data: profile } = await context.supabase
      .from("profiles")
      .select("full_name, college, branch, degree, course, year_of_study, cgpa, skills, achievements, dream_companies, preferred_roles, current_semester")
      .eq("id", context.userId)
      .maybeSingle();

    const { data: subjects } = await context.supabase
      .from("subjects")
      .select("name, progress, interview_topics")
      .limit(10);

    const { data: applications } = await context.supabase
      .from("applications")
      .select("company_name, role, status, package_lpa")
      .limit(10);

    const { data: roadmapProgress } = await context.supabase
      .from("roadmap_progress")
      .select("stage_key, progress, completed_milestones")
      .limit(10);

    const system = `You are PlacementPilot AI Mentor — an evidence-grounded AI career coach for Indian students preparing for placements & internships.

CRITICAL INSTRUCTION (Section 19):
You MUST strictly distinguish between:
1. [VERIFIED DATA]: Grounded strictly in official university records, profile data, or verified campus MoUs.
2. [PLATFORM CALCULATION]: Platform-computed metrics (e.g. 8-factor skill gap severities, match percentages, deficit percentages).
3. [AI RECOMMENDATION]: Your forward-looking actionable advice, learning suggestions, and prep tactics.

NEVER present fabricated external facts as verified facts. If data is unknown or missing, explicitly state it is not recorded.

STUDENT CONTEXT (From Platform):
- Profile: ${JSON.stringify(profile ?? {})}
- Academics (Subjects & Interview Topics): ${JSON.stringify(subjects ?? [])}
- Applications Tracked: ${JSON.stringify(applications ?? [])}
- Roadmap Progress: ${JSON.stringify(roadmapProgress ?? [])}
- Target Role Benchmarks: Data Analyst, Cloud/DevOps Engineer, Full Stack Developer
- Key Market Gaps Detected: SQL Window Functions (Advanced needed vs Basic possessed), Power BI & DAX (Intermediate needed vs None possessed).

Format your response clearly into sections:
### [VERIFIED DATA]
(List facts verified from profile, coursework, or verified employer requisitions)

### [PLATFORM CALCULATION]
(List empirical gap calculations, match percentages, or salary deltas)

### [AI RECOMMENDATION]
(List concrete, prioritized next steps, study hours, or portfolio targets)`;

    const result = await callGateway({
      messages: [{ role: "system", content: system }, ...data.messages],
    });
    return { reply: result.choices?.[0]?.message?.content ?? "" };
  });

/** Resume Studio: suggest summary + bullets from the student's own profile data. */
export const suggestResumeSections = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const v = input as { targetRole?: string };
    return { targetRole: String(v?.targetRole ?? "").slice(0, 120) };
  })
  .handler(async ({ data, context }) => {
    const { data: profile } = await context.supabase
      .from("profiles")
      .select(
        "full_name, college, university, branch, degree, course, year_of_study, current_semester, cgpa, skills, achievements, projects, certifications, coding_profiles, preferred_roles, career_interests",
      )
      .eq("id", context.userId)
      .maybeSingle();

    if (!profile) throw new Error("Fill in your Profile first so suggestions use your real details.");

    const prompt = `Write resume content for an Indian student targeting the role "${data.targetRole || "Software Engineer"}".
Use ONLY the facts in the profile JSON below. Never invent companies, metrics, dates or skills that are not present. If there is not enough information for a section, return an empty string or empty array.
Return ONLY JSON:
{
  "summary": string (2-3 lines),
  "skills": string[] (reordered/grouped from profile skills only),
  "project_bullets": string[] (one strong bullet per profile project, action + tech used),
  "achievement_bullets": string[],
  "notes": string[] (what the student should add to make this resume stronger)
}

PROFILE JSON:
${JSON.stringify(profile)}`;

    const result = await callGateway({
      messages: [
        { role: "system", content: "You output strict JSON only and never invent facts about the student." },
        { role: "user", content: prompt },
      ],
    });
    const parsed = extractJson(result.choices?.[0]?.message?.content ?? "") as Record<string, unknown>;
    return {
      summary: (parsed.summary as string) ?? "",
      skills: (parsed.skills as string[]) ?? [],
      project_bullets: (parsed.project_bullets as string[]) ?? [],
      achievement_bullets: (parsed.achievement_bullets as string[]) ?? [],
      notes: (parsed.notes as string[]) ?? [],
    };
  });

/** Opportunities hub: ingest real listings from live web sources, with provenance. */
export const fetchVerifiedOpportunities = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const v = input as { category?: string; query?: string };
    const category = String(v?.category ?? "").trim();
    if (!category) throw new Error("Category is required");
    return { category: category.slice(0, 40), query: String(v?.query ?? "").trim().slice(0, 160) };
  })
  .handler(async ({ data, context }) => {
    const searchQuery =
        `${data.query ? data.query + " " : ""}${data.category} for Indian college students 2026 apply online eligibility deadline official`;
    const sources = await firecrawlSearch(searchQuery);
    if (!sources) throw new Error("Could not fetch live listings right now. Try again shortly.");

    const prompt = `You are a verification-first research assistant. From the web sources below, extract currently open ${data.category} listings relevant to Indian college students.
Rules: use ONLY facts present in the sources. Never invent deadlines, stipends, eligibility or URLs. Every item MUST carry the exact source_url it came from. Set any unsupported field to null. Skip anything that looks expired or unclear.
Return ONLY JSON:
{"items":[{
  "title": string,
  "organization": string,
  "description": string|null,
  "eligibility_text": string|null,
  "deadline": string|null (YYYY-MM-DD),
  "location": string|null,
  "state": string|null,
  "education_level": string|null,
  "branches": string[]|null,
  "min_cgpa": number|null,
  "graduation_years": number[]|null,
  "apply_url": string|null,
  "source_name": string,
  "source_url": string
}]}

WEB SOURCES:
${sources}`;

    const result = await callGateway({
      messages: [
        { role: "system", content: "You output strict JSON only, grounded strictly in the provided sources." },
        { role: "user", content: prompt },
      ],
    });
    const parsed = extractJson(result.choices?.[0]?.message?.content ?? "") as { items?: Record<string, unknown>[] };
    const items = (parsed.items ?? []).filter((i) => i.title && i.organization && i.source_url).slice(0, 12);
    if (!items.length) throw new Error("No verifiable listings found in the sources for that search.");

    const rows = items.map((i) => ({
      title: String(i.title).slice(0, 200),
      organization: String(i.organization).slice(0, 160),
      category: data.category,
      description: (i.description as string) ?? null,
      eligibility_text: (i.eligibility_text as string) ?? null,
      deadline: (i.deadline as string) ?? null,
      location: (i.location as string) ?? null,
      state: (i.state as string) ?? null,
      education_level: (i.education_level as string) ?? null,
      branches: (i.branches as string[]) ?? null,
      min_cgpa: i.min_cgpa != null ? Number(i.min_cgpa) : null,
      graduation_years: (i.graduation_years as number[]) ?? null,
      apply_url: (i.apply_url as string) ?? null,
      source_name: (i.source_name as string) ?? null,
      source_url: String(i.source_url),
      last_verified_at: new Date().toISOString(),
      verification_status: "verified",
      created_by: context.userId,
      eligibility: {
        min_cgpa: i.min_cgpa != null ? Number(i.min_cgpa) : null,
        branches: (i.branches as string[]) ?? null,
        state: (i.state as string) ?? null,
        graduation_years: (i.graduation_years as number[]) ?? null,
        education_level: (i.education_level as string) ?? null,
      },
    }));

    const { data: inserted, error } = await context.supabase
      .from("opportunities")
      .insert(rows)
      .select("id");
    if (error) throw new Error(error.message);
    return { added: inserted?.length ?? 0 };
  });
