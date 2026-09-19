import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Briefcase,
  TrendingUp,
  ArrowRight,
  ShieldAlert,
  ArrowUpRight,
  CheckCircle2,
  DollarSign,
  MapPin,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SectionHeader, StatCard, WidgetCard } from "@/components/widgets";
import {
  RAW_GROWING_ROLES,
  DATASET_PROVENANCE,
} from "@/data/market-intelligence-demo-data";

export const Route = createFileRoute("/_authenticated/role-demand")({
  head: () => ({
    meta: [
      { title: "Role Demand Analysis — PlacementPilot" },
      {
        name: "description",
        content: "Track expanding job roles, salary brackets in LPA, hiring tech stacks, and campus eligibility.",
      },
    ],
  }),
  component: RoleDemandPage,
});

export default function RoleDemandPage() {
  const [selectedRole, setSelectedRole] = useState(RAW_GROWING_ROLES[0]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <span className="flex h-2 w-2 rounded-full bg-primary" />
            Market Intelligence
          </div>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight">
            Role Demand & Salary Intelligence
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Analysis of high-growth technical job roles, CTC brackets in LPA, and hiring density.
          </p>
        </div>
        <Link to="/labour-market">
          <Button variant="outline" size="sm" className="gap-2 text-xs">
            Back to Labour Dashboard <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      {/* Prototype notice */}
      <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-800 dark:text-amber-200">
        <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <span>
          <strong>Prototype Data Layer:</strong> Compensation benchmarks and posting volumes sourced from {DATASET_PROVENANCE.datasetName}.
        </span>
      </div>

      {/* Overview Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Role List */}
        <div className="space-y-3 lg:col-span-1">
          <h3 className="text-sm font-semibold text-foreground px-1">Tracked Job Roles</h3>
          <div className="space-y-2">
            {RAW_GROWING_ROLES.map((r) => {
              const active = selectedRole.role === r.role;
              return (
                <div
                  key={r.role}
                  onClick={() => setSelectedRole(r)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${
                    active
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-border bg-card hover:border-border/80 hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-sm text-foreground">{r.role}</h4>
                      <p className="text-xs text-muted-foreground">{r.sector}</p>
                    </div>
                    <Badge variant="outline" className="text-emerald-600 font-mono text-[10px]">
                      +{r.yoyGrowthPct}%
                    </Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{r.demandVolume.toLocaleString()} postings</span>
                    <span className="font-semibold text-foreground">₹{r.salaryRangeLPA.entryMin}-{r.salaryRangeLPA.entryMax} LPA</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Role Detailed Breakdown */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-5">
              <div>
                <Badge className="mb-2 bg-primary/15 text-primary border-primary/20 text-xs">
                  {selectedRole.sector}
                </Badge>
                <h2 className="font-display text-2xl font-bold text-foreground">
                  {selectedRole.role}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Demand surge: <strong className="text-emerald-600">+{selectedRole.yoyGrowthPct}% year-over-year</strong>
                </p>
              </div>

              <Link to="/opportunities">
                <Button className="gap-2 text-xs">
                  Find Matching Opportunities <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            {/* Compensation Brackets */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" /> Verified Compensation Benchmarks (LPA)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-border bg-muted/40 p-3.5">
                  <div className="text-xs text-muted-foreground">Fresher Minimum</div>
                  <div className="mt-1 font-display text-xl font-bold text-foreground">
                    ₹{selectedRole.salaryRangeLPA.entryMin} LPA
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Tier 2/3 engineering colleges</div>
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-3.5">
                  <div className="text-xs text-muted-foreground">Fresher Top Bracket</div>
                  <div className="mt-1 font-display text-xl font-bold text-foreground">
                    ₹{selectedRole.salaryRangeLPA.entryMax} LPA
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Tier 1 & Product firms</div>
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-3.5">
                  <div className="text-xs text-muted-foreground">Median Experienced (3-5y)</div>
                  <div className="mt-1 font-display text-xl font-bold text-primary">
                    ₹{selectedRole.salaryRangeLPA.medianExperienced} LPA
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Standard market progression</div>
                </div>
              </div>
            </div>

            {/* Required Skills */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" /> Required Core Skill Competencies
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedRole.keyRequiredSkills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1 text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Primary Hiring Districts */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> Primary Regional Hiring Clusters
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedRole.primaryHiringDistricts.map((dist) => (
                  <div key={dist} className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {dist}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
