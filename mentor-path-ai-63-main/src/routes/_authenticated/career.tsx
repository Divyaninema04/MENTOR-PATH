import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Rocket,
  Target,
  Sparkles,
  Building2,
  TrendingUp,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  PlusCircle,
  Check,
  Zap,
  Info,
  RefreshCw,
  BarChart3,
  Layers,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Award,
  FileText,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState, ProgressRing, SectionHeader, StatCard, WidgetCard } from "@/components/widgets";
import { supabase } from "@/integrations/supabase/client";
import { ROADMAP_STAGES, stageProgress, type RoadmapStage } from "@/lib/career";
import { evaluateEligibility } from "@/lib/eligibility";
import {
  RAW_STUDENT_SKILL_ALIGNMENTS,
  type StudentSkillGapBreakdown,
} from "@/data/training-alignment-demo-data";
import {
  evaluateStudentSkillGap,
  generateMarketAwareRoadmap,
  type StudentSkillGapEvaluation,
  type MarketAwareRoadmapPipelineStage,
} from "@/data/trainer-infrastructure-data";

export const Route = createFileRoute("/_authenticated/career")({
  head: () => ({
    meta: [
      { title: "Career Roadmap & Market Alignment | PlacementPilot" },
      {
        name: "description",
        content:
          "Track your personalized placement roadmap, bridge institutional curriculum gaps with market intelligence recommendations, and feed outcomes back into the hiring index.",
      },
    ],
  }),
  component: CareerPage,
});

type ProgressRow = {
  id: string;
  stage_key: string;
  status: string;
  progress: number;
  completed_milestones: string[] | null;
};

export default function CareerPage() {
  const qc = useQueryClient();
  const [selectedTargetRole, setSelectedTargetRole] = useState<string>("Data Analyst");
  const [roadmapMode, setRoadmapMode] = useState<"pipeline" | "traditional">("pipeline");
  const [expandedGapSkill, setExpandedGapSkill] = useState<string | null>("SQL");
  const [pipelineTasksCompleted, setPipelineTasksCompleted] = useState<Record<string, boolean>>({
    "task-1-0": true,
    "task-1-1": true,
    "task-1-2": true,
  });
  const [adoptedMilestones, setAdoptedMilestones] = useState<Record<string, string[]>>({
    projects: [],
    cs_core: [],
    foundation: [],
  });

  const profile = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select(
          "branch, current_semester, year_of_study, skills, preferred_roles, dream_companies, cgpa, graduation_year, state, degree"
        )
        .maybeSingle();
      return data;
    },
  });

  const rows = useQuery({
    queryKey: ["roadmap_progress"],
    queryFn: async () => {
      const { data, error } = await supabase.from("roadmap_progress").select("*");
      if (error) throw error;
      return (data ?? []) as ProgressRow[];
    },
  });

  const companies = useQuery({
    queryKey: ["companies", "career"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("companies")
        .select(
          "id, name, min_cgpa, allowed_branches, tech_stack, dsa_topics, cs_subjects, process_steps, salary_min, salary_max"
        )
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const byKey = new Map((rows.data ?? []).map((r) => [r.stage_key, r]));

  // Dynamic skill alignment data for the selected role
  const currentAlignmentData = useMemo<StudentSkillGapBreakdown>(() => {
    return (
      RAW_STUDENT_SKILL_ALIGNMENTS[selectedTargetRole] ??
      RAW_STUDENT_SKILL_ALIGNMENTS["Data Analyst"]
    );
  }, [selectedTargetRole]);

  // Section 17: Multi-Factor (8 factors) Student Skill Gap evaluation
  const evaluatedSkillGaps = useMemo<StudentSkillGapEvaluation[]>(() => {
    const userSkills = (profile.data?.skills ?? []) as string[];
    return evaluateStudentSkillGap(selectedTargetRole, userSkills);
  }, [selectedTargetRole, profile.data?.skills]);

  // Section 18: Market-Aware 7-Stage Pipeline
  const marketAwarePipelineStages = useMemo<MarketAwareRoadmapPipelineStage[]>(() => {
    return generateMarketAwareRoadmap(selectedTargetRole);
  }, [selectedTargetRole]);

  // Combined Roadmap Stages including any adopted curriculum interventions
  const dynamicRoadmapStages = useMemo(() => {
    return ROADMAP_STAGES.map((stage) => {
      const extra = adoptedMilestones[stage.key] ?? [];
      if (!extra.length) return stage;
      return {
        ...stage,
        milestones: [...stage.milestones, ...extra],
      };
    });
  }, [adoptedMilestones]);

  async function toggleMilestone(stageKey: string, milestone: string, checked: boolean) {
    const stage = dynamicRoadmapStages.find((s) => s.key === stageKey)!;
    const existing = byKey.get(stageKey);
    const current = existing?.completed_milestones ?? [];
    const next = checked
      ? Array.from(new Set([...current, milestone]))
      : current.filter((m) => m !== milestone);
    const progress = stageProgress(next, stage);
    const status =
      progress === 0 ? "not_started" : progress === 100 ? "completed" : "in_progress";

    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;

    const { error } = existing
      ? await supabase
          .from("roadmap_progress")
          .update({ completed_milestones: next, progress, status })
          .eq("id", existing.id)
      : await supabase.from("roadmap_progress").insert({
          user_id: u.user.id,
          stage_key: stageKey,
          completed_milestones: next,
          progress,
          status,
        });

    if (error) toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["roadmap_progress"] });
  }

  const handleAdoptIntervention = (
    stageKey: string,
    milestoneText: string,
    skillName: string
  ) => {
    setAdoptedMilestones((prev) => {
      const currentList = prev[stageKey] ?? [];
      if (currentList.includes(milestoneText)) {
        toast.info(`Intervention "${skillName}" is already in your roadmap.`);
        return prev;
      }
      toast.success(
        `Adopted "${skillName}" intervention directly into your Career Roadmap!`
      );
      return {
        ...prev,
        [stageKey]: [...currentList, milestoneText],
      };
    });
  };

  const overall = Math.round(
    dynamicRoadmapStages.reduce(
      (sum, s) => sum + stageProgress(byKey.get(s.key)?.completed_milestones, s),
      0
    ) / dynamicRoadmapStages.length
  );
  const nextStage = dynamicRoadmapStages.find(
    (s) => stageProgress(byKey.get(s.key)?.completed_milestones, s) < 100
  );
  const completedStages = dynamicRoadmapStages.filter(
    (s) => stageProgress(byKey.get(s.key)?.completed_milestones, s) === 100
  ).length;

  const skills = (profile.data?.skills ?? []) as string[];
  const roles = (profile.data?.preferred_roles ?? []) as string[];

  const companyList = companies.data ?? [];
  const student = {
    cgpa: profile.data?.cgpa ?? null,
    branch: profile.data?.branch ?? null,
    state: profile.data?.state ?? null,
    graduation_year: profile.data?.graduation_year ?? null,
    degree: profile.data?.degree ?? null,
  };
  const verdicts = companyList.map((c) => ({
    company: c,
    result: evaluateEligibility(student, {
      min_cgpa: c.min_cgpa,
      allowed_branches: c.allowed_branches,
    }),
  }));
  const eligibleCount = verdicts.filter((v) => v.result.verdict === "eligible").length;
  const checkCount = verdicts.filter((v) => v.result.verdict === "check").length;

  const stageStats = (key: string) => {
    if (!companyList.length) return null;
    const top = (values: (string[] | null)[], limit = 8) => {
      const counts = new Map<string, number>();
      for (const arr of values) for (const v of arr ?? []) counts.set(v, (counts.get(v) ?? 0) + 1);
      return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
    };
    if (key === "dsa")
      return {
        title: "Most-asked DSA topics across your saved companies",
        items: top(companyList.map((c) => c.dsa_topics)),
      };
    if (key === "cs_core")
      return {
        title: "CS subjects your saved companies test",
        items: top(companyList.map((c) => c.cs_subjects)),
      };
    if (key === "projects" || key === "foundation")
      return {
        title: "Tech stacks your saved companies use",
        items: top(companyList.map((c) => c.tech_stack)),
      };
    if (key === "interview")
      return {
        title: "Interview rounds your saved companies run",
        items: top(companyList.map((c) => c.process_steps)),
      };
    return null;
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-16">
      <SectionHeader
        title="Career Roadmap & Employability Loop"
        description="Your personalized preparation journey. Directly connected to Labour Market Intelligence and institutional Curriculum Gaps."
        action={
          <div className="flex items-center gap-2">
            <Link to="/curriculum-alignment">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <BookOpen className="h-3.5 w-3.5 text-primary" />
                Curriculum Gaps
              </Button>
            </Link>
            <Link to="/labour-market">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <TrendingUp className="h-3.5 w-3.5 text-primary" />
                Market Signals
              </Button>
            </Link>
          </div>
        }
      />

      {/* CLOSED LOOP ARCHITECTURE BANNER */}
      <div className="rounded-xl border border-primary/25 bg-gradient-to-r from-primary/5 via-accent/20 to-transparent p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs text-xs">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold uppercase tracking-wider text-primary">
                End-to-End Closed Loop Active
              </span>
              <Badge variant="outline" className="text-[10px] font-mono border-primary/30">
                LMI × Curriculum × Student
              </Badge>
            </div>
            <p className="text-muted-foreground mt-0.5">
              Identified market skill gaps and curriculum recommendations can be directly adopted into your roadmap milestones. Completing them updates your verified employability index.
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="roadmap">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          <TabsTrigger value="alignment">Market & Skill Gap Loop</TabsTrigger>
          <TabsTrigger value="skills">Profile Skills</TabsTrigger>
        </TabsList>

        {/* TAB 1: ROADMAP */}
        <TabsContent value="roadmap" className="space-y-4 pt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bento-card flex items-center gap-4">
              <ProgressRing value={overall} label="overall" />
              <div>
                <p className="font-display text-lg font-semibold">Roadmap progress</p>
                <p className="text-xs text-muted-foreground">
                  {completedStages} of {dynamicRoadmapStages.length} stages complete
                </p>
              </div>
            </div>
            <StatCard
              label="Next stage"
              value={nextStage ? nextStage.title : "All done"}
              icon={Rocket}
              hint={nextStage?.description}
            />
            <StatCard
              label="Target roles"
              value={roles.length ? roles.length : "—"}
              icon={Target}
              hint={roles.length ? roles.join(", ") : "Add preferred roles in Profile."}
            />
            <StatCard
              label="Companies you qualify for"
              value={companyList.length ? `${eligibleCount} of ${companyList.length}` : "—"}
              icon={Building2}
              hint={
                companyList.length
                  ? `${checkCount} need more details`
                  : "Add company data in Manage company data."
              }
            />
          </div>

          {/* VIEW TOGGLE: 7-STAGE MARKET-AWARE PIPELINE vs TRADITIONAL MILESTONES */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-card shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                <Rocket className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground">
                    Roadmap Architecture
                  </span>
                  <Badge variant="outline" className="text-[10px] font-mono text-primary border-primary/30">
                    Market-Aware Pipeline
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Connects: CURRENT SKILL GAP → LEARNING → PRACTICE → PROJECT → ASSESSMENT → EVIDENCE → OPPORTUNITY.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-lg border border-border">
              <Button
                variant={roadmapMode === "pipeline" ? "default" : "ghost"}
                size="sm"
                onClick={() => setRoadmapMode("pipeline")}
                className="text-xs h-7 gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" />
                7-Stage Market Pipeline
              </Button>
              <Button
                variant={roadmapMode === "traditional" ? "default" : "ghost"}
                size="sm"
                onClick={() => setRoadmapMode("traditional")}
                className="text-xs h-7 gap-1.5"
              >
                <Layers className="h-3.5 w-3.5" />
                Traditional Milestones ({dynamicRoadmapStages.length})
              </Button>
            </div>
          </div>

          {roadmapMode === "pipeline" ? (
            <div className="space-y-5">
              {/* Pipeline Flow Indicator */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      7-Stage Sequential Market Pipeline
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-medium">
                    Target Role: <strong className="text-foreground">{selectedTargetRole}</strong>
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {marketAwarePipelineStages.map((stage) => {
                    const isAllDone = stage.actionableTasks.every(
                      (_, idx) => pipelineTasksCompleted[`task-${stage.stageNumber}-${idx}`]
                    );
                    return (
                      <div
                        key={stage.stageNumber}
                        className={`rounded-lg border p-2 text-center transition-all ${
                          isAllDone
                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                            : "border-border bg-background text-foreground"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1 text-[10px] font-bold font-mono">
                          {isAllDone ? (
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <span className="inline-block h-4 w-4 rounded-full bg-primary/10 text-primary leading-4 text-center">
                              {stage.stageNumber}
                            </span>
                          )}
                          <span className="truncate">{stage.stageName}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sequential Stage Cards */}
              <div className="space-y-4">
                {marketAwarePipelineStages.map((stage) => {
                  const isDone = stage.actionableTasks.every(
                    (_, taskIdx) => pipelineTasksCompleted[`task-${stage.stageNumber}-${taskIdx}`]
                  );
                  const completedCount = stage.actionableTasks.filter(
                    (_, tIdx) => pipelineTasksCompleted[`task-${stage.stageNumber}-${tIdx}`]
                  ).length;

                  return (
                    <div
                      key={stage.stageNumber}
                      className="rounded-2xl border border-border bg-card p-5 shadow-xs transition-all hover:border-primary/40 space-y-4"
                    >
                      {/* Stage Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl font-display font-bold text-sm ${
                              isDone
                                ? "bg-emerald-500 text-white"
                                : "bg-primary text-primary-foreground"
                            }`}
                          >
                            {isDone ? <Check className="h-5 w-5" /> : stage.stageNumber}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="font-mono text-[9px] uppercase tracking-wider">
                                STAGE {stage.stageNumber}: {stage.stageName}
                              </Badge>
                              {stage.completionBadge && (
                                <Badge className="bg-emerald-600/10 text-emerald-700 border-emerald-600/20 text-[9px]">
                                  {stage.completionBadge}
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-display text-base font-bold text-foreground mt-0.5">
                              {stage.title}
                            </h3>
                          </div>
                        </div>

                        {/* Status / Tasks Count */}
                        <div className="text-right">
                          <span className="text-[11px] font-medium text-muted-foreground">
                            {completedCount} of {stage.actionableTasks.length} tasks completed
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {stage.description}
                      </p>

                      {/* Connected to Market Demand Signal */}
                      <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-start gap-2.5 text-xs">
                        <TrendingUp className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-primary block text-[11px] uppercase tracking-wider">
                            Live Market & Recruiter Demand Linkage
                          </span>
                          <span className="text-muted-foreground text-[11px]">
                            {stage.marketDemandContext}
                          </span>
                        </div>
                      </div>

                      {/* Actionable Tasks Checklist */}
                      <div className="space-y-2 pt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                          Stage Requirements & Drills
                        </span>
                        <div className="space-y-2">
                          {stage.actionableTasks.map((taskText, taskIdx) => {
                            const taskId = `task-${stage.stageNumber}-${taskIdx}`;
                            const isChecked = !!pipelineTasksCompleted[taskId];
                            return (
                              <div
                                key={taskIdx}
                                className={`flex items-start gap-2.5 p-2.5 rounded-lg border transition-all ${
                                  isChecked
                                    ? "border-emerald-500/20 bg-emerald-500/5 text-muted-foreground"
                                    : "border-border bg-background text-foreground"
                                }`}
                              >
                                <Checkbox
                                  id={taskId}
                                  checked={isChecked}
                                  onCheckedChange={(checked) => {
                                    setPipelineTasksCompleted((prev) => ({
                                      ...prev,
                                      [taskId]: checked === true,
                                    }));
                                  }}
                                  className="mt-0.5"
                                />
                                <label
                                  htmlFor={taskId}
                                  className={`text-xs cursor-pointer select-none leading-tight ${
                                    isChecked ? "line-through text-muted-foreground" : "font-medium"
                                  }`}
                                >
                                  {taskText}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Stage 7 Special: Direct Placement Opportunities */}
                      {stage.directOpportunityLink && (
                        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-emerald-600" />
                              <span className="font-bold text-xs text-foreground">
                                Active Recruiter Requisition Matched
                              </span>
                            </div>
                            <Badge className="bg-emerald-600 text-white text-[10px]">
                              MoU Fast-Track Active
                            </Badge>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-background p-3 rounded-lg border border-border">
                            <div>
                              <span className="font-bold text-sm text-foreground block">
                                {stage.directOpportunityLink.companyName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {stage.directOpportunityLink.role} • CTC: <strong className="text-emerald-600">{stage.directOpportunityLink.packageLpa}</strong>
                              </span>
                            </div>
                            <Link to="/opportunities">
                              <Button size="sm" className="gap-1.5 text-xs">
                                Apply via Campus Pool <ArrowRight className="h-3.5 w-3.5" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Traditional Milestones List */
            <div className="space-y-4">
              {dynamicRoadmapStages.map((stage, i) => {
                const row = byKey.get(stage.key);
                const pct = stageProgress(row?.completed_milestones, stage);
                const done = row?.completed_milestones ?? [];
                const extraAdopted = adoptedMilestones[stage.key] ?? [];

                return (
                  <WidgetCard key={stage.key}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent font-display text-sm font-bold text-primary">
                          {i + 1}
                        </div>
                        <div>
                          <h3 className="font-display text-lg font-semibold">{stage.title}</h3>
                          <p className="text-sm text-muted-foreground">{stage.description}</p>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={pct === 100 ? "bg-emerald-500/10 text-emerald-700" : ""}
                      >
                        {pct}%
                      </Badge>
                    </div>
                    <Progress value={pct} className="mt-3 h-1.5" />

                    <ul className="mt-4 space-y-2">
                      {stage.milestones.map((m) => {
                        const checked = done.includes(m);
                        const isAdoptedIntervention = extraAdopted.includes(m);

                        return (
                          <li key={m} className="flex items-start gap-2.5">
                            <Checkbox
                              id={`${stage.key}-${m}`}
                              checked={checked}
                              onCheckedChange={(v) =>
                                toggleMilestone(stage.key, m, v === true)
                              }
                              className="mt-0.5"
                            />
                            <div className="flex flex-wrap items-center gap-2">
                              <label
                                htmlFor={`${stage.key}-${m}`}
                                className={`text-sm ${
                                  checked ? "text-muted-foreground line-through" : ""
                                }`}
                              >
                                {m}
                              </label>
                              {isAdoptedIntervention && (
                                <Badge
                                  variant="outline"
                                  className="text-[9px] bg-primary/10 text-primary border-primary/30 px-1.5 py-0"
                                >
                                  Curriculum Intervention
                                </Badge>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>

                    {(() => {
                      const stats = stageStats(stage.key);
                      if (!stats || !stats.items.length) return null;
                      return (
                        <div className="mt-4 rounded-lg border border-border bg-mist/50 p-3">
                          <p className="text-xs font-medium text-muted-foreground">{stats.title}</p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {stats.items.map(([name, count]) => (
                              <span
                                key={name}
                                className="rounded-full bg-accent px-2 py-0.5 text-xs text-primary"
                              >
                                {name} · {count}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </WidgetCard>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* TAB 2: MARKET & SKILL GAP LOOP */}
        <TabsContent value="alignment" className="space-y-6 pt-4">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Select Target Placement Role
                </label>
                <div className="mt-1 flex items-center gap-3">
                  <Select
                    value={selectedTargetRole}
                    onValueChange={setSelectedTargetRole}
                  >
                    <SelectTrigger className="w-64 h-9 font-bold text-xs bg-background">
                      <SelectValue placeholder="Select target role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Data Analyst" className="text-xs font-semibold">
                        Data Analyst (Standard Benchmark)
                      </SelectItem>
                      <SelectItem value="Full Stack Developer" className="text-xs font-semibold">
                        Full Stack Developer
                      </SelectItem>
                      <SelectItem value="Cloud & DevOps Engineer" className="text-xs font-semibold">
                        Cloud & DevOps Engineer
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {currentAlignmentData.sector}
                  </Badge>
                </div>
              </div>

              {/* Role Alignment Metrics */}
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-border bg-background p-3 text-right">
                  <span className="text-[10px] text-muted-foreground block">Role Skill Match:</span>
                  <span className="font-display text-xl font-bold text-primary">
                    {currentAlignmentData.overallMatchPct}%
                  </span>
                </div>
                <div className="rounded-xl border border-border bg-background p-3 text-right">
                  <span className="text-[10px] text-muted-foreground block">Salary Premium:</span>
                  <span className="font-mono text-xs font-bold text-emerald-600">
                    {currentAlignmentData.feedbackTelemetry.regionalMedianCtcDelta.split(" ")[0]}
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION 17: EMPIRICAL 8-FACTOR STUDENT SKILL GAP ENGINE */}
            <div className="space-y-4 rounded-xl border border-primary/25 bg-gradient-to-br from-primary/5 via-card to-background p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <h3 className="font-display text-base font-bold text-foreground">
                      Empirical 8-Factor Student Skill Gap Engine
                    </h3>
                    <Badge variant="outline" className="text-[9px] font-mono text-primary border-primary/30">
                      8-Factor Evaluated
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Comprehensive skill evaluation synthesized across 8 empirical dimensions to establish your exact placement clearance gaps.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                  <span>Target: <strong className="text-foreground">{selectedTargetRole}</strong></span>
                </div>
              </div>

              {/* 8-Factor Architecture Strip */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  8 Evaluated Data Dimensions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "1. Student Profile",
                    "2. Resume Signals",
                    "3. Academic Coursework",
                    "4. Existing Skills",
                    "5. Target Role Benchmark",
                    "6. Current Market Demand",
                    "7. Required Proficiency",
                    "8. Relevant Industry Validation",
                  ].map((factor) => (
                    <span
                      key={factor}
                      className="rounded-md border border-border bg-background px-2 py-0.5 text-[10px] font-medium text-foreground shadow-2xs"
                    >
                      {factor}
                    </span>
                  ))}
                </div>
              </div>

              {/* MARKET REQUIREMENT vs STUDENT CURRENT LEVEL List */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Market Requirement vs. Student Current Level
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Click any skill to inspect the 8-factor evaluation matrix
                  </span>
                </div>

                <div className="space-y-3">
                  {evaluatedSkillGaps.map((gapItem) => {
                    const isExpanded = expandedGapSkill === gapItem.skillName;
                    const isAdopted = (adoptedMilestones["projects"] ?? []).includes(
                      gapItem.actionableRoadmapStep
                    );

                    const gapBadgeStyle =
                      gapItem.gapSeverity === "Critical"
                        ? "bg-red-600 text-white"
                        : gapItem.gapSeverity === "High"
                        ? "bg-amber-600 text-white"
                        : gapItem.gapSeverity === "Moderate"
                        ? "bg-yellow-500 text-black"
                        : gapItem.gapSeverity === "Low"
                        ? "bg-emerald-600 text-white"
                        : "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";

                    return (
                      <div
                        key={gapItem.skillName}
                        className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs transition-all hover:border-primary/40"
                      >
                        {/* Skill Row Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="font-display font-bold text-sm text-foreground">
                              {gapItem.skillName}
                            </span>
                            <Badge variant="outline" className="text-[9px] font-mono">
                              {gapItem.category}
                            </Badge>
                          </div>

                          {/* MARKET REQUIREMENT vs STUDENT CURRENT LEVEL Comparison Badges */}
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <div className="flex items-center gap-1 rounded-md bg-muted/60 px-2 py-1 border border-border">
                              <span className="text-[10px] text-muted-foreground uppercase">Market:</span>
                              <strong className="text-foreground font-mono">{gapItem.marketRequirement}</strong>
                            </div>
                            <span className="text-muted-foreground font-bold text-xs">vs.</span>
                            <div className="flex items-center gap-1 rounded-md bg-muted/60 px-2 py-1 border border-border">
                              <span className="text-[10px] text-muted-foreground uppercase">Student:</span>
                              <strong className="text-foreground font-mono">{gapItem.studentCurrentLevel}</strong>
                            </div>
                            <span className="text-muted-foreground font-bold text-xs">→</span>
                            <Badge className={`text-[10px] font-bold px-2 py-0.5 ${gapBadgeStyle}`}>
                              {gapItem.gapSeverity} Gap
                            </Badge>
                          </div>
                        </div>

                        {/* Rationale & Action Step */}
                        <div className="grid gap-2 sm:grid-cols-2 text-xs pt-1">
                          <div className="rounded-lg border border-border/80 bg-muted/20 p-2.5 space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                              Diagnostic Rationale
                            </span>
                            <p className="text-muted-foreground text-[11px] leading-relaxed">
                              {gapItem.gapRationale}
                            </p>
                          </div>

                          <div className="rounded-lg border border-primary/20 bg-primary/5 p-2.5 space-y-2 flex flex-col justify-between">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">
                                Actionable Roadmap Step
                              </span>
                              <p className="text-foreground text-[11px] font-medium leading-relaxed mt-0.5">
                                {gapItem.actionableRoadmapStep}
                              </p>
                            </div>
                            <div className="pt-1 flex items-center justify-between">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  setExpandedGapSkill(isExpanded ? null : gapItem.skillName)
                                }
                                className="h-6 text-[10px] px-1.5 gap-1 text-muted-foreground hover:text-foreground"
                              >
                                {isExpanded ? (
                                  <>
                                    <ChevronUp className="h-3 w-3" /> Hide 8 Factors
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="h-3 w-3" /> View 8 Factors
                                  </>
                                )}
                              </Button>

                              <Button
                                size="sm"
                                variant={isAdopted ? "outline" : "default"}
                                disabled={isAdopted}
                                onClick={() =>
                                  handleAdoptIntervention(
                                    "projects",
                                    gapItem.actionableRoadmapStep,
                                    gapItem.skillName
                                  )
                                }
                                className="h-6 text-[10px] px-2 gap-1"
                              >
                                {isAdopted ? (
                                  <>
                                    <Check className="h-3 w-3 text-emerald-600" /> In Roadmap
                                  </>
                                ) : (
                                  <>
                                    <PlusCircle className="h-3 w-3" /> Adopt into Roadmap
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Collapsible 8-Factor Matrix Breakdown */}
                        {isExpanded && (
                          <div className="mt-3 rounded-lg border border-border bg-muted/40 p-3 space-y-2 text-xs animate-in fade-in">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground block border-b border-border pb-1">
                              Empirical 8-Factor Breakdown for {gapItem.skillName}:
                            </span>
                            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 pt-1">
                              <div className="rounded-md border border-border/80 bg-background p-2 space-y-0.5">
                                <span className="text-[9px] font-bold uppercase text-muted-foreground block">
                                  1. Student Profile
                                </span>
                                <p className="text-[10px] text-foreground leading-tight">
                                  {gapItem.factors.studentProfile}
                                </p>
                              </div>
                              <div className="rounded-md border border-border/80 bg-background p-2 space-y-0.5">
                                <span className="text-[9px] font-bold uppercase text-muted-foreground block">
                                  2. Resume Signals
                                </span>
                                <p className="text-[10px] text-foreground leading-tight">
                                  {gapItem.factors.resumeEvidence}
                                </p>
                              </div>
                              <div className="rounded-md border border-border/80 bg-background p-2 space-y-0.5">
                                <span className="text-[9px] font-bold uppercase text-muted-foreground block">
                                  3. Academic Coursework
                                </span>
                                <p className="text-[10px] text-foreground leading-tight">
                                  {gapItem.factors.academicCoursework}
                                </p>
                              </div>
                              <div className="rounded-md border border-border/80 bg-background p-2 space-y-0.5">
                                <span className="text-[9px] font-bold uppercase text-muted-foreground block">
                                  4. Existing Skills
                                </span>
                                <p className="text-[10px] text-foreground leading-tight">
                                  {gapItem.factors.existingSkillDeclared}
                                </p>
                              </div>
                              <div className="rounded-md border border-border/80 bg-background p-2 space-y-0.5">
                                <span className="text-[9px] font-bold uppercase text-muted-foreground block">
                                  5. Target Role Demand
                                </span>
                                <p className="text-[10px] text-foreground leading-tight">
                                  {gapItem.factors.targetRoleDemand}
                                </p>
                              </div>
                              <div className="rounded-md border border-border/80 bg-background p-2 space-y-0.5">
                                <span className="text-[9px] font-bold uppercase text-muted-foreground block">
                                  6. Live Market Demand
                                </span>
                                <p className="text-[10px] text-foreground leading-tight">
                                  {gapItem.factors.currentMarketDemand}
                                </p>
                              </div>
                              <div className="rounded-md border border-border/80 bg-background p-2 space-y-0.5">
                                <span className="text-[9px] font-bold uppercase text-muted-foreground block">
                                  7. Required Proficiency
                                </span>
                                <p className="text-[10px] text-foreground leading-tight">
                                  {gapItem.factors.requiredProficiency}
                                </p>
                              </div>
                              <div className="rounded-md border border-border/80 bg-background p-2 space-y-0.5">
                                <span className="text-[9px] font-bold uppercase text-muted-foreground block">
                                  8. Industry Validation
                                </span>
                                <p className="text-[10px] text-foreground leading-tight">
                                  {gapItem.factors.relevantIndustryValidation}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* THREE-WAY SKILL TRIANGLE MATRIX */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Column 1: Curriculum Covered */}
              <div className="rounded-xl border border-border bg-background p-4 space-y-3">
                <div className="flex items-center gap-2 text-foreground">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <h4 className="font-display font-bold text-sm">
                    1. Covered in Syllabus
                  </h4>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Topics already incorporated into institutional degree coursework.
                </p>

                <div className="space-y-2 pt-1">
                  {currentAlignmentData.curriculumCoveredSkills.map((sk) => (
                    <div
                      key={sk.skill}
                      className="rounded-lg border border-border/80 bg-muted/20 p-2.5 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">{sk.skill}</span>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      </div>
                      <span className="text-[10px] text-muted-foreground block">
                        {sk.coveredInCourse}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: Personally Mastered */}
              <div className="rounded-xl border border-border bg-background p-4 space-y-3">
                <div className="flex items-center gap-2 text-foreground">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  <h4 className="font-display font-bold text-sm">
                    2. Personally Mastered
                  </h4>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Skills you have self-attested or completed via personal projects.
                </p>

                <div className="space-y-2 pt-1">
                  {currentAlignmentData.personalAcquiredSkills.map((sk) => (
                    <div
                      key={sk.skill}
                      className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">{sk.skill}</span>
                        <Badge
                          variant="outline"
                          className="text-[9px] border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                        >
                          {sk.proficiency}
                        </Badge>
                      </div>
                      <span className="text-[10px] text-muted-foreground block">
                        {sk.verified ? "Profile Verified" : "Self-Attested"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 3: Critical Market Gaps (Actionable Bridge!) */}
              <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    <h4 className="font-display font-bold text-sm">
                      3. Critical Gaps to Bridge
                    </h4>
                  </div>
                  <Badge className="bg-red-600 text-white text-[9px]">
                    Action Required
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  High-demand employer requirements missing from current syllabus.
                </p>

                <div className="space-y-2.5 pt-1">
                  {currentAlignmentData.criticalMarketGaps.map((gap) => {
                    const isAlreadyAdopted = (
                      adoptedMilestones["projects"] ?? []
                    ).includes(gap.recommendedModule);

                    return (
                      <div
                        key={gap.skill}
                        className="rounded-lg border border-border bg-card p-3 space-y-2 text-xs shadow-xs"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="font-bold text-foreground">{gap.skill}</span>
                          <Badge
                            className={`text-[9px] ${
                              gap.priority === "Immediate"
                                ? "bg-red-600 text-white"
                                : "bg-amber-500 text-white"
                            }`}
                          >
                            {gap.priority}
                          </Badge>
                        </div>

                        <p className="text-[11px] text-muted-foreground font-medium">
                          {gap.recommendedModule}
                        </p>

                        <div className="pt-1 flex items-center justify-between">
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {gap.suggestedContactHours} contact hrs
                          </span>
                          <Button
                            size="sm"
                            variant={isAlreadyAdopted ? "outline" : "default"}
                            disabled={isAlreadyAdopted}
                            onClick={() =>
                              handleAdoptIntervention(
                                "projects",
                                gap.recommendedModule,
                                gap.skill
                              )
                            }
                            className="h-7 text-[10px] px-2 gap-1"
                          >
                            {isAlreadyAdopted ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-600" /> In Roadmap
                              </>
                            ) : (
                              <>
                                <PlusCircle className="h-3 w-3" /> Adopt into Roadmap
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* CLOSED-LOOP FEEDBACK TELEMETRY NOTE */}
            <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <span className="font-bold text-foreground">
                  Institutional Feedback Loopback:
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                When you adopt and complete these recommended interventions, your student readiness score updates automatically. In aggregate, student completion data feeds back into the <strong>Course Health System</strong> (raising institutional syllabus alignment) and <strong>Industry Validation</strong> (signaling placement readiness to campus recruiters).
              </p>
              <div className="pt-1 flex flex-wrap gap-2 text-[11px] text-foreground font-mono">
                <span>• Interview Conversion Velocity: <strong>{currentAlignmentData.feedbackTelemetry.projectedInterviewConversionRate}%</strong></span>
                <span>• Regional CTC Premium: <strong>{currentAlignmentData.feedbackTelemetry.regionalMedianCtcDelta}</strong></span>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* TAB 3: PROFILE SKILLS */}
        <TabsContent value="skills" className="space-y-4 pt-4">
          <WidgetCard title="Skills on your profile" icon={Sparkles}>
            {skills.length ? (
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <span key={s} className="rounded-full bg-mist px-2.5 py-1 text-xs text-ink">
                    {s}
                  </span>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No skills added yet"
                description="Add your skills in Profile and they show up here."
              />
            )}
          </WidgetCard>

          <WidgetCard
            title="Interview topics from your subjects"
            footnote="These come from the interview topics you mapped on your subjects in Academics."
          >
            <SubjectTopics />
          </WidgetCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SubjectTopics() {
  const subjects = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const { data } = await supabase.from("subjects").select("name, interview_topics");
      return data ?? [];
    },
  });

  const withTopics = (subjects.data ?? []).filter(
    (s) => (s.interview_topics ?? []).length
  );
  if (subjects.isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (!withTopics.length)
    return (
      <EmptyState
        title="No interview topics mapped"
        description="Add interview topics to your subjects in Academics."
      />
    );

  return (
    <div className="space-y-3">
      {withTopics.map((s) => (
        <div key={s.name}>
          <p className="text-sm font-medium">{s.name}</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {(s.interview_topics ?? []).map((t: string) => (
              <span key={t} className="rounded-full bg-accent px-2 py-0.5 text-xs text-primary">
                {t}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
