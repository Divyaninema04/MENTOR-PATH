import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ExternalLink,
  MapPin,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Check,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import {
  RAW_INDUSTRY_VALIDATIONS,
  type IndustryValidationRecord,
} from "@/data/training-alignment-demo-data";
import {
  RAW_EXTENDED_COMPANY_DEMANDS,
  type ExtendedCompanySkillDemand,
} from "@/data/industry-validation-demo-data";

export const Route = createFileRoute("/_authenticated/companies/$slug")({
  head: ({ loaderData }) => ({
    meta: [{ title: `${(loaderData as { name?: string } | undefined)?.name ?? "Company"} — PlacementPilot` }],
  }),
  component: CompanyDetailPage,
  errorComponent: ({ error }) => (
    <div className="p-6 text-sm text-destructive">Failed to load: {error.message}</div>
  ),
  notFoundComponent: () => <div className="p-6 text-sm text-muted-foreground">Company not found.</div>,
});

function CompanyDetailPage() {
  const { slug } = Route.useParams();
  const q = useQuery({
    queryKey: ["company", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("companies").select("*").eq("slug", slug).maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return data;
    },
  });

  const profile = useQuery({
    queryKey: ["profile-full"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return null;
      const { data } = await supabase.from("profiles").select("*").eq("id", u.user.id).maybeSingle();
      return data;
    },
  });

  if (q.isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (!q.data) return <p className="text-sm text-muted-foreground">Not found.</p>;

  const c = q.data;
  const elig = computeEligibility(c, profile.data ?? null);

  const extendedDemand = RAW_EXTENDED_COMPANY_DEMANDS.find(
    (d: ExtendedCompanySkillDemand) =>
      d.slug === c.slug ||
      d.companyName.toLowerCase().includes(c.name.toLowerCase()) ||
      c.name.toLowerCase().includes(d.companyName.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link to="/companies" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All companies
      </Link>

      <EligibilityBanner result={elig} />

      <div className="bento-card">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
          <div className="min-w-0">
            <h1 className="truncate font-display text-3xl font-bold tracking-tight">{c.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{c.industry}</p>
            <p className="mt-4 text-sm leading-relaxed">{c.description}</p>
          </div>
          {c.careers_url && (
            <a href={c.careers_url} target="_blank" rel="noreferrer">
              <Button variant="outline" className="gap-2">Careers <ExternalLink className="h-3.5 w-3.5" /></Button>
            </a>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Min CGPA" value={c.min_cgpa ?? "—"} icon={GraduationCap} />
          <Stat label="HQ" value={c.hq_location ?? "—"} icon={MapPin} />
          <Stat label="Package (LPA)" value={c.salary_min && c.salary_max ? `${c.salary_min}–${c.salary_max}` : "—"} icon={Briefcase} />
          <Stat label="Season" value={c.hiring_season ?? "—"} icon={Briefcase} />
        </div>
      </div>

      {/* SECTION 12: EXTENDED COMPANY SKILL DEMAND & ROLE MATRIX */}
      {extendedDemand && (
        <div className="bento-card border-primary/20 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-border pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" />
                <h3 className="font-display text-lg font-bold text-foreground">
                  Role-Wise Skill Requisitions & Hiring Criteria
                </h3>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Recruiter verified skill specifications, experience expectations, and assessment methods.
              </p>
            </div>

            <div>
              {extendedDemand.isDirectEmployerValidated ? (
                <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px] gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Direct Employer Validated
                </Badge>
              ) : (
                <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px] gap-1">
                  <AlertTriangle className="h-3 w-3" /> Pending Direct Employer Validation
                </Badge>
              )}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 text-xs">
            <div className="rounded-lg bg-background p-2.5 border border-border">
              <span className="text-muted-foreground block text-[10px]">Hiring Locations:</span>
              <span className="font-semibold text-foreground">{extendedDemand.locations.join(", ")}</span>
            </div>
            <div className="rounded-lg bg-background p-2.5 border border-border">
              <span className="text-muted-foreground block text-[10px]">Experience Level:</span>
              <span className="font-semibold text-foreground">{extendedDemand.experienceRequirements}</span>
            </div>
            <div className="rounded-lg bg-background p-2.5 border border-border">
              <span className="text-muted-foreground block text-[10px]">Hiring Trend:</span>
              <span className="font-semibold text-emerald-600">{extendedDemand.overallHiringTrend}</span>
            </div>
          </div>

          {/* Role Cards */}
          <div className="space-y-4 pt-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Active Target Roles & Technical Specifications:
            </span>
            <div className="grid gap-4">
              {extendedDemand.roles.map((role) => (
                <div
                  key={role.roleTitle}
                  className="rounded-xl border border-border bg-background/80 p-4 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-2">
                    <div>
                      <h4 className="font-display font-bold text-sm text-foreground">
                        {role.roleTitle}
                      </h4>
                      <span className="text-[11px] text-muted-foreground">
                        Bracket: {role.experienceLevel}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                        {role.hiringTrend}
                      </Badge>
                      {role.openingsCount && (
                        <span className="font-mono text-xs font-bold text-foreground">
                          {role.openingsCount} Vacancies
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 text-xs">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                        <Check className="h-3 w-3" /> Mandatory Required Skills:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {role.requiredSkills.map((sk) => (
                          <Badge
                            key={sk}
                            className="bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 border-emerald-500/30 text-xs font-medium py-0.5 px-2"
                          >
                            {sk}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1">
                        <Sparkles className="h-3 w-3" /> Preferred Skills:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {role.preferredSkills.map((sk) => (
                          <Badge
                            key={sk}
                            variant="outline"
                            className="border-amber-500/40 text-amber-900 dark:text-amber-200 bg-amber-500/5 text-xs font-medium py-0.5 px-2"
                          >
                            {sk}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-muted/40 p-2.5 text-[11px] text-muted-foreground border-t border-border/60">
                    <span className="font-semibold text-foreground mr-1">
                      Screening Mechanism:
                    </span>
                    {role.typicalAssessmentMethod}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-muted-foreground border-t border-border pt-2 flex items-center justify-between">
            <span>
              <strong>Data Provenance:</strong> {extendedDemand.validationProvenance}
            </span>
            <Link to="/company-skill-demand">
              <span className="text-primary hover:underline font-semibold">
                Compare All Companies →
              </span>
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Section title="Recruitment process">
          {c.process_steps?.length ? (
            <ol className="space-y-2">
              {c.process_steps.map((s: string, i: number) => (
                <li key={s} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{i + 1}</span>
                  <span className="text-sm">{s}</span>
                </li>
              ))}
            </ol>
          ) : <Empty />}
        </Section>

        <Section title="Allowed branches">
          <BadgeList items={c.allowed_branches ?? []} />
        </Section>

        <Section title="Tech stack">
          <BadgeList items={c.tech_stack ?? []} />
        </Section>

        <Section title="Frequent DSA topics">
          <BadgeList items={c.dsa_topics ?? []} />
        </Section>

        <Section title="CS subjects to prep">
          <BadgeList items={c.cs_subjects ?? []} />
        </Section>

        {/* Layer C: Industry Validation Card */}
        {(() => {
          const partner = RAW_INDUSTRY_VALIDATIONS.find(
            (p: IndustryValidationRecord) => p.slug === c.slug || p.companyName.toLowerCase() === c.name.toLowerCase()
          );
          if (!partner) return null;
          return (
            <div className="bento-card border-emerald-500/30 bg-emerald-500/5 space-y-3 md:col-span-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <h3 className="font-display text-base font-bold text-foreground">
                    Verified Industry Partner & Curriculum Endorsement
                  </h3>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 text-[10px]">
                  {partner.mouStatus}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {partner.provenanceStatement}
              </p>

              <div className="grid gap-3 sm:grid-cols-3 pt-2 text-xs">
                <div className="rounded-lg bg-background p-2.5 border border-border">
                  <span className="text-muted-foreground block text-[10px]">Verified Demand:</span>
                  <span className="font-mono font-bold text-foreground">{partner.verifiedHiringSignalsCount} Campus Openings</span>
                </div>
                <div className="rounded-lg bg-background p-2.5 border border-border">
                  <span className="text-muted-foreground block text-[10px]">NSQF Qualification:</span>
                  <span className="font-mono font-bold text-foreground">Level {partner.nsqfAlignmentLevel} Alignment</span>
                </div>
                <div className="rounded-lg bg-background p-2.5 border border-border">
                  <span className="text-muted-foreground block text-[10px]">Hiring Confidence:</span>
                  <span className="font-mono font-bold text-emerald-600">{partner.hiringConfidenceScore}%</span>
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-500/20">
                <span className="text-[11px] font-bold text-foreground block mb-1.5">
                  Co-Developed Syllabus Modules (Recommended for Placement):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {partner.coDevelopedModules.map((mod: string) => (
                    <Badge key={mod} variant="outline" className="bg-background border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs">
                      {mod}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: React.ReactNode; icon: React.ElementType }) {
  return (
    <div className="rounded-lg border border-border bg-mist/40 p-3">
      <div className="flex items-center gap-1 text-xs text-muted-foreground"><Icon className="h-3 w-3" /> {label}</div>
      <div className="mt-1 font-display text-lg font-semibold">{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bento-card">
      <h3 className="font-display text-base font-semibold">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function BadgeList({ items }: { items: string[] }) {
  if (!items.length) return <Empty />;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((t) => (
        <Badge key={t} variant="secondary">{t}</Badge>
      ))}
    </div>
  );
}

function Empty() {
  return <p className="text-sm text-muted-foreground">Not listed yet.</p>;
}

type Company = {
  min_cgpa: number | null;
  allowed_branches: string[] | null;
  name: string;
};
type Profile = {
  cgpa: number | null;
  branch: string | null;
} | null;

type Eligibility = {
  status: "eligible" | "ineligible" | "unknown" | "no-profile";
  reasons: string[];
  passes: string[];
};

function computeEligibility(c: Company, p: Profile): Eligibility {
  if (!p) return { status: "no-profile", reasons: [], passes: [] };
  if (p.cgpa == null && !p.branch) return { status: "no-profile", reasons: [], passes: [] };

  const reasons: string[] = [];
  const passes: string[] = [];

  if (c.min_cgpa != null) {
    if (p.cgpa == null) {
      reasons.push("Add your CGPA to check the cutoff.");
    } else if (p.cgpa < c.min_cgpa) {
      reasons.push(`CGPA ${p.cgpa} is below the ${c.min_cgpa} cutoff.`);
    } else {
      passes.push(`CGPA ${p.cgpa} meets the ${c.min_cgpa} cutoff.`);
    }
  }

  if (c.allowed_branches && c.allowed_branches.length > 0) {
    if (!p.branch) {
      reasons.push("Add your branch to check eligibility.");
    } else {
      const norm = (s: string) => s.toUpperCase().replace(/[^A-Z]/g, "");
      const allowed = c.allowed_branches.map(norm);
      if (allowed.includes(norm(p.branch))) {
        passes.push(`Branch ${p.branch} is allowed.`);
      } else {
        reasons.push(`Branch ${p.branch} not in ${c.allowed_branches.join(", ")}.`);
      }
    }
  }

  if (reasons.length === 0 && passes.length === 0) return { status: "unknown", reasons, passes };
  const blocking = reasons.some((r) => /below|not in/i.test(r));
  return { status: blocking ? "ineligible" : "eligible", reasons, passes };
}

function EligibilityBanner({ result }: { result: Eligibility }) {
  if (result.status === "no-profile") {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-border bg-mist/40 p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 text-muted-foreground" />
        <div className="text-sm">
          <p className="font-medium">Complete your profile to check eligibility</p>
          <Link to="/profile" className="text-primary hover:underline">Go to profile →</Link>
        </div>
      </div>
    );
  }
  if (result.status === "unknown") return null;
  const good = result.status === "eligible";
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border p-4 ${
        good
          ? "border-emerald-500/30 bg-emerald-500/10"
          : "border-destructive/30 bg-destructive/10"
      }`}
    >
      {good ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-700" />
      ) : (
        <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
      )}
      <div className="text-sm">
        <p className="font-medium">
          {good ? "You're eligible based on the listed criteria" : "You may not be eligible"}
        </p>
        <ul className="mt-1 list-disc space-y-0.5 pl-4 text-muted-foreground">
          {result.passes.map((p) => (
            <li key={p}>{p}</li>
          ))}
          {result.reasons.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}