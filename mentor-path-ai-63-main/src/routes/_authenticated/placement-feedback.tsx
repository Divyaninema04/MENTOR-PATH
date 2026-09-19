import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  TrendingUp,
  GitMerge,
  ArrowRight,
  ShieldAlert,
  GraduationCap,
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Layers,
  Sparkles,
  BookOpen,
  Building2,
  Calendar,
  Zap,
  Info,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionHeader, StatCard, WidgetCard } from "@/components/widgets";
import {
  OUTCOME_SKILL_CORRELATIONS,
  TRAINING_PROGRAMME_EFFICACY,
  DIFFICULT_SKILL_ACQUISITIONS,
  SHIFTING_ROLE_REQUIREMENTS,
} from "@/data/placement-outcomes-mentor-data";

export const Route = createFileRoute("/_authenticated/placement-feedback")({
  head: () => ({
    meta: [
      { title: "Placement Outcome Feedback Loop | PlacementPilot" },
      {
        name: "description",
        content:
          "Closed-loop analytics connecting Market Demand → Training → Student → Opportunity → Application → Outcome to refine curriculum, identify skill correlations, and monitor changing role requirements.",
      },
    ],
  }),
  component: PlacementFeedbackPage,
});

const FLOW_STEPS = [
  { step: 1, title: "Market Demand", layer: "Market", desc: "42k+ active job postings & employer requisitions" },
  { step: 2, title: "Training", layer: "Curriculum", desc: "Curriculum delivery & institutional lab contact hours" },
  { step: 3, title: "Student", layer: "Candidate", desc: "8-factor skill gap diagnostics & verified milestones" },
  { step: 4, title: "Opportunity", layer: "Opportunities", desc: "Verified corporate MoUs, jobs & skill matching" },
  { step: 5, title: "Application", layer: "Pipeline", desc: "Linked requisitions, required skills & gap snapshots" },
  { step: 6, title: "Outcome", layer: "Telemetry", desc: "Shortlist, interview, offer, and rejection telemetry" },
];

export default function PlacementFeedbackPage() {
  const [selectedRole, setSelectedRole] = useState("Data Analyst");

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16">
      {/* Header */}
      <SectionHeader
        title="Placement Outcome Feedback Loop"
        description="Translating student application and hiring outcomes back into institutional curriculum alignment, faculty upskilling, and predictive employability models."
        action={
          <div className="flex items-center gap-2">
            <Link to="/applications">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Briefcase className="h-3.5 w-3.5 text-primary" />
                Applications
              </Button>
            </Link>
            <Link to="/curriculum-recommendations">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <BookOpen className="h-3.5 w-3.5 text-primary" />
                Curriculum Updates
              </Button>
            </Link>
          </div>
        }
      />

      {/* STATISTICAL RIGOR NOTICE (Section 22 Mandate: Do NOT claim causal relationships) */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200 shadow-2xs">
        <div className="flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                Non-Causal Statistical Rigor Protocol Active
              </span>
              <Badge variant="outline" className="text-[9px] font-mono border-amber-500/40 text-amber-700 dark:text-amber-300">
                Statistical Rigor Verified
              </Badge>
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              All metrics below reflect <strong>empirical correlations</strong> observed across verified student placement cycles (sample size: 4,160 candidates). Correlational associations indicate predictive co-occurrence and are not claimed as single-variable causal proof.
            </p>
          </div>
        </div>
      </div>

      {/* THE 6-STEP CLOSED LOOP FLOW (Section 22 Core Architecture) */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <GitMerge className="h-4 w-4 text-primary" />
            <h3 className="font-display font-bold text-sm text-foreground">
              End-to-End Closed Loop Architecture
            </h3>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground">
            Market Demand → Training → Student → Opportunity → Application → Outcome
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {FLOW_STEPS.map((s, idx) => (
            <div
              key={s.step}
              className="rounded-xl border border-border bg-muted/20 p-3 space-y-2 relative transition-all hover:border-primary/40 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[10px]">
                  {s.step}
                </span>
                <Badge variant="outline" className="text-[8px] font-mono px-1 py-0">
                  {s.layer}
                </Badge>
              </div>

              <div>
                <h4 className="font-bold text-xs text-foreground">{s.title}</h4>
                <p className="text-[10px] text-muted-foreground leading-tight mt-1">
                  {s.desc}
                </p>
              </div>

              {idx < FLOW_STEPS.length - 1 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-muted-foreground">
                  <ArrowRight className="h-3 w-3" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* KPI STAT CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Tracked Placements"
          value="4,160"
          icon={Briefcase}
          hint="Regional student applications analyzed across 2025-2026 hiring loops"
        />
        <StatCard
          label="Top Correlated Skill"
          value="SQL Windowing"
          icon={TrendingUp}
          hint="+54.2% shortlist correlation delta (3.2x multiplier)"
        />
        <StatCard
          label="Top Training Efficacy"
          value="88.5%"
          icon={GraduationCap}
          hint="PG Certificate in Applied Analytics placement clearance rate"
        />
        <StatCard
          label="Shifting Requirements"
          value="+114% YoY"
          icon={Sparkles}
          hint="Surge in Cloud BI (Power BI/Snowflake) vs -62% in legacy Excel VBA"
        />
      </div>

      {/* 4 CORE ANALYTICAL PANELS (Section 22 Mandates) */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* PANEL 1: Skills Correlating with Successful Applications */}
        <WidgetCard
          title="1. Skills Correlating with Successful Applications"
          icon={TrendingUp}
          footnote="Statistical Note: Reflects shortlist and interview pass rates for candidates possessing verifiable repository or lab credentials in each skill."
        >
          <div className="space-y-3.5">
            {OUTCOME_SKILL_CORRELATIONS.map((c) => (
              <div
                key={c.skillName}
                className="rounded-xl border border-border bg-background p-3.5 space-y-2.5 text-xs shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className="font-bold text-foreground text-sm block">
                      {c.skillName}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      Category: {c.category} • Sample: {c.sampleCohortSize} students
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge className="bg-emerald-600 text-white text-[10px] font-bold">
                      {c.interviewConversionMultiplier} Shortlist Rate
                    </Badge>
                    <Badge variant="outline" className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 border-emerald-500/30">
                      +{c.correlationDelta}% Delta
                    </Badge>
                  </div>
                </div>

                {/* Comparison Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">With Verifiable Competency:</span>
                    <strong className="text-emerald-600 font-mono">{c.withSkillShortlistRatePct}%</strong>
                  </div>
                  <Progress value={c.withSkillShortlistRatePct} className="h-1.5 bg-muted" />

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-muted-foreground">Without Verifiable Competency:</span>
                    <span className="text-muted-foreground font-mono">{c.withoutSkillShortlistRatePct}%</span>
                  </div>
                  <Progress value={c.withoutSkillShortlistRatePct} className="h-1.5 bg-muted" />
                </div>

                <div className="rounded-lg bg-muted/40 p-2 text-[10px] text-muted-foreground leading-relaxed">
                  <strong>Caveat:</strong> {c.statisticalCaveat}
                </div>
              </div>
            ))}
          </div>
        </WidgetCard>

        {/* PANEL 2: Training Programmes Producing Relevant Skills */}
        <WidgetCard
          title="2. Training Programmes Producing Relevant Skills"
          icon={GraduationCap}
          footnote="Compares syllabus alignment scores against real-world campus hiring conversion across training providers."
        >
          <div className="space-y-3.5">
            {TRAINING_PROGRAMME_EFFICACY.map((prog) => (
              <div
                key={prog.programmeName}
                className="rounded-xl border border-border bg-background p-3.5 space-y-2.5 text-xs shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h4 className="font-bold text-sm text-foreground">
                      {prog.programmeName}
                    </h4>
                    <span className="text-[10px] text-muted-foreground">
                      {prog.provider} • Intake: {prog.intakeGraduates} graduates
                    </span>
                  </div>
                  <Badge
                    className={`text-[10px] font-bold ${
                      prog.placementClearanceRatePct >= 80
                        ? "bg-emerald-600 text-white"
                        : "bg-amber-600 text-white"
                    }`}
                  >
                    {prog.placementClearanceRatePct}% Placement Rate
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-muted/30 p-2 rounded-lg">
                  <div>
                    <span className="text-muted-foreground block text-[9px] uppercase">
                      Syllabus Alignment:
                    </span>
                    <strong className="text-primary">{prog.syllabusAlignmentScorePct}%</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[9px] uppercase">
                      Avg Starting Package:
                    </span>
                    <strong className="text-emerald-600">₹{prog.averageStartingCtcLpa} LPA</strong>
                  </div>
                </div>

                <div className="text-[11px] text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Pedagogical Strength:</strong> {prog.keyStrengths}
                </div>

                <div className="flex flex-wrap items-center gap-1 text-[10px]">
                  <span className="text-muted-foreground font-semibold">Top Hiring Partners:</span>
                  {prog.topRecruitersHiring.map((rec) => (
                    <Badge key={rec} variant="outline" className="text-[9px] px-1.5 py-0 font-medium">
                      {rec}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </WidgetCard>

        {/* PANEL 3: Skills Remaining Difficult to Acquire */}
        <WidgetCard
          title="3. Skills Remaining Difficult to Acquire"
          icon={AlertTriangle}
          footnote="Pinpoints root conceptual bottlenecks causing student failure in campus technical assessments."
        >
          <div className="space-y-3.5">
            {DIFFICULT_SKILL_ACQUISITIONS.map((diff) => (
              <div
                key={diff.skillName}
                className="rounded-xl border border-red-500/20 bg-background p-3.5 space-y-2.5 text-xs shadow-2xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-foreground">
                      {diff.skillName}
                    </h4>
                    <span className="text-[10px] text-muted-foreground">
                      Category: {diff.category} • Required Time: ~{diff.avgHoursToCompetency} lab hours
                    </span>
                  </div>
                  <Badge className="bg-red-600 text-white text-[10px] font-bold shrink-0">
                    {diff.initialFailureRatePct}% Initial Failure Rate
                  </Badge>
                </div>

                <div className="rounded-lg bg-red-500/5 border border-red-500/20 p-2.5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 dark:text-red-300 block">
                    Observed Student Stumbling Block:
                  </span>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {diff.primaryStudentStumblingBlock}
                  </p>
                </div>

                <div className="rounded-lg bg-primary/5 border border-primary/20 p-2.5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">
                    Recommended Pedagogical Intervention:
                  </span>
                  <p className="text-[11px] text-foreground font-medium leading-relaxed">
                    {diff.recommendedPedagogy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </WidgetCard>

        {/* PANEL 4: Roles with Changing Requirements */}
        <WidgetCard
          title="4. Roles with Changing Requirements"
          icon={BarChart3}
          footnote="Longitudinal shift in employer JD keywords over the last 24 months across Maharashtra tech corridors."
        >
          <div className="space-y-4">
            {SHIFTING_ROLE_REQUIREMENTS.map((shift) => (
              <div
                key={shift.roleName}
                className="rounded-xl border border-border bg-background p-4 space-y-3 text-xs shadow-2xs"
              >
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <div>
                    <h4 className="font-bold text-sm text-foreground">
                      Role: {shift.roleName}
                    </h4>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      Sector: {shift.sector}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[9px] font-mono border-primary/30 text-primary">
                    Dynamic Taxonomy
                  </Badge>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {/* Rising Skills */}
                  <div className="space-y-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" /> Rising Demand
                    </span>
                    <ul className="space-y-1.5 pt-1">
                      {shift.risingSkills.map((r) => (
                        <li key={r.skill} className="space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-foreground text-[11px]">{r.skill}</span>
                            <span className="font-mono text-emerald-600 font-bold text-[10px]">+{r.growthPct}%</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground">{r.driver}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Declining Skills */}
                  <div className="space-y-2 rounded-lg bg-red-500/5 border border-red-500/20 p-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 dark:text-red-300 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Declining Requisitions
                    </span>
                    <ul className="space-y-1.5 pt-1">
                      {shift.decliningSkills.map((d) => (
                        <li key={d.skill} className="space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-foreground text-[11px] line-through opacity-80">{d.skill}</span>
                            <span className="font-mono text-red-600 font-bold text-[10px]">{d.dropPct}%</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground">{d.driver}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="rounded-lg bg-muted/40 p-2.5 text-[11px] text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Board of Studies Action:</strong> {shift.strategicImplication}
                </div>
              </div>
            ))}
          </div>
        </WidgetCard>
      </div>
    </div>
  );
}
