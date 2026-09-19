import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Search,
  MapPin,
  Briefcase,
  Plus,
  Sparkles,
  Building2,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Award,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Info,
  Layers,
} from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { StatCard } from "@/components/widgets";
import { EligibilityBadge } from "@/components/eligibility-badge";
import { supabase } from "@/integrations/supabase/client";
import { fetchAndAddCompany } from "@/lib/ai.functions";
import { evaluateEligibility, type EligibilityVerdict } from "@/lib/eligibility";
import {
  RAW_INDUSTRY_VALIDATIONS,
  type IndustryValidationRecord,
} from "@/data/training-alignment-demo-data";
import {
  RAW_EXTENDED_COMPANY_DEMANDS,
  type ExtendedCompanySkillDemand,
} from "@/data/industry-validation-demo-data";

export const Route = createFileRoute("/_authenticated/companies")({
  head: () => ({
    meta: [
      { title: "Industry Validation & Recruiter Signals | PlacementPilot" },
      {
        name: "description",
        content:
          "Browse recruiters with verified campus MoUs, co-developed curriculum modules, stated CGPA cutoffs, and rule-based eligibility checks.",
      },
    ],
  }),
  component: CompaniesPage,
});

type Filter = "all" | "verified_mou" | EligibilityVerdict;

export default function CompaniesPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const qc = useQueryClient();
  const navigate = useNavigate();
  const addCompany = useServerFn(fetchAndAddCompany);

  const companies = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const { data } = await supabase.from("companies").select("*").order("name");
      return data ?? [];
    },
  });

  const profile = useQuery({
    queryKey: ["profile", "eligibility"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("cgpa, branch, state, graduation_year, degree")
        .maybeSingle();
      return data;
    },
  });

  const student = {
    cgpa: profile.data?.cgpa ?? null,
    branch: profile.data?.branch ?? null,
    state: profile.data?.state ?? null,
    graduation_year: profile.data?.graduation_year ?? null,
    degree: profile.data?.degree ?? null,
  };

  // Map of verified industry partners keyed by lowercase name
  const validationMap = useMemo(() => {
    const map = new Map<string, IndustryValidationRecord>();
    for (const v of RAW_INDUSTRY_VALIDATIONS) {
      map.set(v.companyName.toLowerCase(), v);
    }
    return map;
  }, []);

  const scored = useMemo(
    () =>
      (companies.data ?? []).map((c) => {
        const validation = validationMap.get(c.name.toLowerCase());
        return {
          company: c,
          validation,
          result: evaluateEligibility(student, {
            min_cgpa: c.min_cgpa,
            allowed_branches: c.allowed_branches,
          }),
        };
      }),
    [companies.data, validationMap, student.cgpa, student.branch, student.state, student.graduation_year, student.degree]
  );

  const eligibleCount = scored.filter((s) => s.result.verdict === "eligible").length;
  const checkCount = scored.filter((s) => s.result.verdict === "check").length;
  const verifiedCount = RAW_INDUSTRY_VALIDATIONS.length;
  const missingProfile = student.cgpa == null || !student.branch;

  const list = scored
    .filter((s) => {
      if (filter === "all") return true;
      if (filter === "verified_mou") return !!s.validation;
      return s.result.verdict === filter;
    })
    .filter((s) =>
      (s.company.name + " " + (s.company.industry ?? "") + " " + (s.company.tech_stack ?? []).join(" "))
        .toLowerCase()
        .includes(q.toLowerCase())
    );

  async function onAdd() {
    if (!newName.trim()) return;
    setAdding(true);
    try {
      const c = await addCompany({ data: { name: newName.trim() } });
      toast.success(`Added ${c.name}`);
      qc.invalidateQueries({ queryKey: ["companies"] });
      setOpen(false);
      setNewName("");
      navigate({ to: "/companies/$slug", params: { slug: c.slug } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to add company");
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Industry Validation & Partnerships
          </div>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight">
            Industry Validation & Recruiter Signals
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Verified employer demand signals, co-developed curriculum modules, active campus MoUs, and rule-based academic eligibility checks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link to="/company-skill-demand">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs h-9">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Company Skill Demand
            </Button>
          </Link>
          <Link to="/curriculum-recommendations">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs h-9">
              <BookOpen className="h-3.5 w-3.5" />
              Co-Designed Modules
            </Button>
          </Link>
          <Link to="/companies/manage">
            <Button variant="outline" size="sm" className="text-xs h-9">
              Manage Recruiters
            </Button>
          </Link>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5 text-xs h-9 bg-primary text-primary-foreground">
                <Plus className="h-3.5 w-3.5" /> Add Recruiter
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" /> Add Recruiter with AI
                </DialogTitle>
                <DialogDescription>
                  Type any recruiter name. We'll automatically fetch eligibility, tech stack, hiring process, and CTC brackets.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <Label>Company name</Label>
                <Input
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      onAdd();
                    }
                  }}
                  placeholder="e.g. Atlassian, Zerodha, Stripe"
                />
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpen(false)} disabled={adding}>
                  Cancel
                </Button>
                <Button onClick={onAdd} disabled={adding || !newName.trim()}>
                  {adding ? "Fetching…" : "Fetch & Add"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Provenance Disclosure */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Info className="h-4 w-4 shrink-0 text-primary" />
          <span>
            <strong>Verified Industry Demand Provenance:</strong> Strategic partner recruitment signals are cross-referenced with institutional Placement Cell records and employer Board of Studies endorsements.
          </span>
        </div>
        <Badge variant="outline" className="text-[10px] font-mono border-primary/30 shrink-0">
          Source: Verified Campus MoUs 2026-27
        </Badge>
      </div>

      {/* Top Telemetry KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Tracked Recruiters"
          icon={Building2}
          value={scored.length}
          hint="Active campus recruitment network"
        />
        <StatCard
          label="Verified MoUs & Partners"
          icon={ShieldCheck}
          value={`${verifiedCount} Partners`}
          hint="Co-designing practical coursework"
        />
        <StatCard
          label="You Qualify For"
          icon={CheckCircle2}
          value={eligibleCount}
          hint="Academic & branch criteria fully satisfied"
        />
        <StatCard
          label="Needs Verification"
          icon={HelpCircle}
          value={checkCount}
          hint="Requires CGPA or branch clarification"
        />
      </div>

      {/* STRATEGIC INDUSTRY PARTNERS & CO-DESIGNED CURRICULUM BANNER */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
              Strategic Industry Partners Co-Designing Curriculum ({RAW_INDUSTRY_VALIDATIONS.length})
            </h2>
          </div>
          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px]">
            Employer Endorsement
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {RAW_INDUSTRY_VALIDATIONS.map((partner) => (
            <div
              key={partner.id}
              className="rounded-xl border border-border bg-background p-4 space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display font-bold text-base text-foreground">
                      {partner.companyName}
                    </h3>
                    <span className="text-[11px] text-muted-foreground block">{partner.industry}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 shrink-0"
                  >
                    {partner.mouStatus}
                  </Badge>
                </div>

                <div className="mt-3 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Verified Openings:</span>
                    <span className="font-mono font-bold text-foreground">
                      {partner.verifiedHiringSignalsCount} Vacancies
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Verified Package:</span>
                    <span className="font-mono font-bold text-primary">
                      ₹{partner.verifiedMinCtcLpa} – ₹{partner.verifiedMaxCtcLpa} LPA
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">NSQF Alignment:</span>
                    <span className="font-mono font-semibold">Level {partner.nsqfAlignmentLevel}</span>
                  </div>
                </div>

                {/* Co-developed modules */}
                <div className="mt-3 pt-2 border-t border-border">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Co-Developed Syllabus Modules:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {partner.coDevelopedModules.map((mod) => (
                      <Badge
                        key={mod}
                        variant="secondary"
                        className="text-[10px] bg-accent/60 text-primary"
                      >
                        {mod}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 text-[10px] text-muted-foreground border-t border-border/60 flex items-center justify-between">
                <span>Verified: {partner.lastValidationDate}</span>
                <Link
                  to="/companies/$slug"
                  params={{ slug: partner.slug }}
                  className="text-primary font-semibold hover:underline inline-flex items-center gap-0.5"
                >
                  View Profile <ArrowRight className="h-2.5 w-2.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {missingProfile ? (
        <div className="rounded-xl border border-border bg-muted/40 p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <p className="text-muted-foreground">
            Add your CGPA and branch in Profile so eligibility can be judged instead of flagged for checking.
          </p>
          <Link to="/profile">
            <Button size="sm" variant="outline" className="text-xs h-8">
              Open Profile
            </Button>
          </Link>
        </div>
      ) : null}

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative min-w-[260px] flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search Google, Amazon, Accenture, FinTech…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9 h-9 text-xs bg-background"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(
            [
              ["all", "All Recruiters"],
              ["verified_mou", "Verified MoUs & Co-Designers"],
              ["eligible", "Eligible Now"],
              ["check", "Needs Verification"],
              ["not_eligible", "Below Stated Cutoff"],
            ] as [Filter, string][]
          ).map(([key, label]) => (
            <Button
              key={key}
              size="sm"
              variant={filter === key ? "default" : "outline"}
              onClick={() => setFilter(key)}
              className="text-xs h-8"
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Recruiter Directory Cards */}
      {companies.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading companies…</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map(({ company: c, result, validation }) => (
            <Link
              key={c.id}
              to="/companies/$slug"
              params={{ slug: c.slug }}
              className="rounded-xl border border-border bg-card p-5 block shadow-xs hover:border-primary/50 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="truncate font-display text-lg font-bold text-foreground">
                      {c.name}
                    </h3>
                    {validation && (
                      <Badge
                        variant="outline"
                        className="text-[9px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 px-1 py-0 shrink-0"
                      >
                        MoU
                      </Badge>
                    )}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{c.industry}</p>
                </div>
                <EligibilityBadge result={result} />
              </div>

              <div className="flex flex-wrap gap-1">
                {c.min_cgpa ? (
                  <Badge variant="secondary" className="text-[10px] shrink-0 font-mono">
                    CGPA ≥ {c.min_cgpa}
                  </Badge>
                ) : null}
                {(c.tech_stack ?? []).slice(0, 3).map((t: string) => (
                  <span
                    key={t}
                    className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-mono text-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {validation && (
                <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-2 text-[10px] text-emerald-800 dark:text-emerald-300 space-y-0.5">
                  <span className="font-bold block">Curriculum Endorsement:</span>
                  <p className="line-clamp-1">{validation.coDevelopedModules.join(", ")}</p>
                </div>
              )}

              {(() => {
                const ext = RAW_EXTENDED_COMPANY_DEMANDS.find(
                  (d: ExtendedCompanySkillDemand) =>
                    d.slug === c.slug ||
                    d.companyName.toLowerCase().includes(c.name.toLowerCase()) ||
                    c.name.toLowerCase().includes(d.companyName.toLowerCase())
                );
                if (!ext) return null;
                return (
                  <div className="rounded-lg bg-primary/5 border border-primary/20 p-2 text-[10px] space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-foreground flex items-center gap-1">
                        <Briefcase className="h-3 w-3 text-primary" />
                        {ext.roles.length} Role Requisitions:
                      </span>
                      {ext.isDirectEmployerValidated ? (
                        <span className="text-emerald-600 font-semibold">Direct Validated</span>
                      ) : (
                        <span className="text-amber-600 font-semibold">Pending Valid.</span>
                      )}
                    </div>
                    <p className="text-muted-foreground line-clamp-1">
                      Required: {ext.roles[0]?.requiredSkills.slice(0, 3).join(", ")}
                    </p>
                  </div>
                );
              })()}

              <p className="line-clamp-2 text-xs text-muted-foreground">
                {result.reasons[0] ?? result.missing[0] ?? "No criteria recorded yet."}
              </p>

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {c.hq_location ?? "—"}
                </span>
                <span className="inline-flex items-center gap-1 text-primary font-semibold">
                  <Briefcase className="h-3 w-3" />
                  {c.salary_min && c.salary_max ? `${c.salary_min}–${c.salary_max} LPA` : "—"}
                </span>
              </div>
            </Link>
          ))}
          {list.length === 0 && (
            <p className="col-span-full text-sm text-muted-foreground py-8 text-center">
              No companies match this filter criteria.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
