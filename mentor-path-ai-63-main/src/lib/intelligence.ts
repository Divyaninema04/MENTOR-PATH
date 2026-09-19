export type IntelligenceCompany = {
  id: string;
  name: string;
  industry: string | null;
  tech_stack: string[] | null;
  dsa_topics: string[] | null;
  cs_subjects: string[] | null;
  process_steps: string[] | null;
  source_name: string | null;
  source_url: string | null;
  last_verified_at: string | null;
  verification_status: string | null;
};

export type IntelligenceOpportunity = {
  id: string;
  title: string;
  organization: string;
  category: string;
  location: string | null;
  source_name: string | null;
  source_url: string | null;
  last_verified_at: string | null;
  verification_status: string | null;
};

export type IntelligenceProfile = {
  skills: string[] | null;
  career_interests: string[] | null;
  preferred_roles: string[] | null;
};

export type IntelligenceSubject = {
  name: string;
  progress: number;
  interview_topics: string[] | null;
};

export type IntelligenceApplication = {
  status: string;
  role: string;
  company_name: string;
};

export type DemandSignal = {
  name: string;
  count: number;
  sourceCount: number;
  type: "skill" | "topic" | "role";
};

export type SkillGap = DemandSignal & {
  reason: string;
};

export type IntelligenceSummary = {
  signals: DemandSignal[];
  gaps: SkillGap[];
  mappedTopics: Set<string>;
  ownedSkills: Set<string>;
  subjectCoverage: number;
  verifiedSources: number;
  companyCount: number;
  opportunityCount: number;
  applicationCount: number;
  interviewCount: number;
  offerCount: number;
  focusRole: string | null;
};

function clean(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function key(value: string) {
  return clean(value).toLowerCase();
}

function addSignal(
  map: Map<string, DemandSignal>,
  name: string,
  type: DemandSignal["type"],
  sourceCount: number,
) {
  const label = clean(name);
  if (!label) return;
  const normalized = key(label);
  const existing = map.get(normalized);
  map.set(normalized, {
    name: existing?.name ?? label,
    count: (existing?.count ?? 0) + 1,
    sourceCount: Math.max(existing?.sourceCount ?? 0, sourceCount),
    type,
  });
}

function list(values: string[] | null | undefined) {
  return (values ?? []).map(clean).filter(Boolean);
}

export function aggregateIntelligence({
  companies,
  opportunities,
  profile,
  subjects,
  applications,
}: {
  companies: IntelligenceCompany[];
  opportunities: IntelligenceOpportunity[];
  profile: IntelligenceProfile | null;
  subjects: IntelligenceSubject[];
  applications: IntelligenceApplication[];
}): IntelligenceSummary {
  const map = new Map<string, DemandSignal>();

  companies.forEach((company) => {
    list(company.tech_stack).forEach((signal) => addSignal(map, signal, "skill", 1));
    list(company.dsa_topics).forEach((signal) => addSignal(map, signal, "topic", 1));
    list(company.cs_subjects).forEach((signal) => addSignal(map, signal, "topic", 1));
  });

  opportunities.forEach((opportunity) => {
    const role = clean(opportunity.title);
    if (role) addSignal(map, role, "role", 1);
  });

  const signals = [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  const ownedSkills = new Set(list(profile?.skills).map(key));
  const mappedTopics = new Set(subjects.flatMap((subject) => list(subject.interview_topics).map(key)));
  const gaps = signals
    .filter((signal) => signal.type !== "role")
    .filter((signal) => !ownedSkills.has(key(signal.name)) && !mappedTopics.has(key(signal.name)))
    .slice(0, 8)
    .map((signal) => ({
      ...signal,
      reason: signal.type === "topic" ? "Requested in industry interview signals" : "Present in company technology demand",
    }));

  const subjectCoverage = subjects.length
    ? Math.round(subjects.reduce((sum, subject) => sum + Math.max(0, Math.min(100, Number(subject.progress) || 0)), 0) / subjects.length)
    : 0;
  const verifiedSources = [
    ...companies.filter((company) => company.verification_status === "verified"),
    ...opportunities.filter((opportunity) => opportunity.verification_status === "verified"),
  ].length;
  const roleCounts = new Map<string, number>();
  [...(profile?.preferred_roles ?? []), ...opportunities.map((opportunity) => opportunity.title)]
    .map(clean)
    .filter(Boolean)
    .forEach((role) => roleCounts.set(role, (roleCounts.get(role) ?? 0) + 1));
  const focusRole = [...roleCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  return {
    signals,
    gaps,
    mappedTopics,
    ownedSkills,
    subjectCoverage,
    verifiedSources,
    companyCount: companies.length,
    opportunityCount: opportunities.length,
    applicationCount: applications.length,
    interviewCount: applications.filter((application) => application.status === "interview").length,
    offerCount: applications.filter((application) => application.status === "offer").length,
    focusRole,
  };
}