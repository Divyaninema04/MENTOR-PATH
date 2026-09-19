import { useState, useMemo } from "react";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import {
  SlidersHorizontal,
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
  Download,
  BookOpen,
  Wrench,
  Server,
  Sparkles,
  Info,
  Check,
  AlertTriangle,
  Lightbulb,
  FileCheck,
  Send,
  GraduationCap,
  Briefcase,
  HelpCircle,
  Clock,
  Laptop,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatCard } from "@/components/widgets";
import {
  DISTRICTS_BY_STATE,
  SECTORS_BY_DISTRICT,
  ROLES_BY_SECTOR,
  generateDistrictTrainingPlan,
  type DistrictTrainingPlan,
} from "@/data/district-skill-intelligence-data";

export const Route = createFileRoute("/_authenticated/district-training-planner")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { district?: string; sector?: string; role?: string } => ({
    district: typeof search.district === "string" ? search.district : "Pune",
    sector: typeof search.sector === "string" ? search.sector : "IT & Software Services",
    role: typeof search.role === "string" ? search.role : "Data Analytics",
  }),
  head: () => ({
    meta: [
      { title: "District Training Planner — Government & Institutional Module" },
      {
        name: "description",
        content:
          "Institutional planning module for government skill development authorities, DTE, and training administrators with capacity gap analysis and explainable policy recommendations.",
      },
    ],
  }),
  component: DistrictTrainingPlannerPage,
});

export default function DistrictTrainingPlannerPage() {
  const searchParams = useSearch({ from: "/_authenticated/district-training-planner" });

  // Input states
  const [selectedDistrict, setSelectedDistrict] = useState<string>(searchParams.district || "Pune");
  const [selectedSector, setSelectedSector] = useState<string>(
    searchParams.sector || "IT & Software Services"
  );
  const [selectedRole, setSelectedRole] = useState<string>(searchParams.role || "Data Analytics");

  // Simulation slider state: Added seats to test capacity expansion
  const [simulatedSeatsAdded, setSimulatedSeatsAdded] = useState<number>(500);

  // Available options
  const maharashtraDistricts = useMemo(() => {
    return DISTRICTS_BY_STATE["Maharashtra"] ?? ["Pune", "Mumbai Suburban", "Nagpur", "Nashik"];
  }, []);

  const availableSectors = useMemo(() => {
    return SECTORS_BY_DISTRICT[selectedDistrict] ?? [
      "IT & Software Services",
      "Banking, Financial Services & FinTech (BFSI)",
      "Automotive, EV & CleanTech",
    ];
  }, [selectedDistrict]);

  const availableRoles = useMemo(() => {
    return ROLES_BY_SECTOR[selectedSector] ?? [
      "Data Analytics",
      "Full Stack Developer",
      "Cloud & DevOps Engineer",
    ];
  }, [selectedSector]);

  // Handle cascading dropdown adjustments
  const handleDistrictChange = (dist: string) => {
    setSelectedDistrict(dist);
    const sectors = SECTORS_BY_DISTRICT[dist] ?? ["IT & Software Services"];
    if (!sectors.includes(selectedSector)) {
      setSelectedSector(sectors[0]);
      const roles = ROLES_BY_SECTOR[sectors[0]] ?? ["Data Analytics"];
      setSelectedRole(roles[0]);
    }
  };

  const handleSectorChange = (sec: string) => {
    setSelectedSector(sec);
    const roles = ROLES_BY_SECTOR[sec] ?? ["Data Analytics"];
    if (!roles.includes(selectedRole)) {
      setSelectedRole(roles[0]);
    }
  };

  // Generate authoritative training plan with explainable reasoning
  const plan: DistrictTrainingPlan = useMemo(() => {
    return generateDistrictTrainingPlan(selectedDistrict, selectedSector, selectedRole);
  }, [selectedDistrict, selectedSector, selectedRole]);

  // Calculate simulation impact
  const simulatedPostGapSeats = Math.max(
    0,
    plan.detectedCapacityGap.netDeficitSeats - simulatedSeatsAdded
  );
  const simulatedShortfallPct = Math.round(
    (simulatedPostGapSeats / plan.detectedCapacityGap.marketRequisitionDemand) * 100
  );

  const handleExportPlan = () => {
    toast.success(
      `Exporting Official District Skill Action Plan for ${selectedDistrict} (${plan.planId}.pdf)`
    );
  };

  const handleSubmitToCommittee = () => {
    toast.success(
      `Dossier transmitted to District Skill Committee (DSDC) for ${selectedDistrict}.`
    );
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <span className="flex h-2 w-2 rounded-full bg-primary" />
            Training & Workforce Planning
          </div>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight">
            District Training Planner & Policy Dossier
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Authoritative planning module for government skill development bodies (MSSDS / NSDC), DTE directorates, and college boards to bridge regional talent deficits with explainable reasoning.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPlan}
            className="gap-1.5 text-xs h-9"
          >
            <Download className="h-3.5 w-3.5" />
            Export Action Plan (PDF)
          </Button>
          <Button
            size="sm"
            onClick={handleSubmitToCommittee}
            className="gap-1.5 text-xs h-9 bg-primary text-primary-foreground"
          >
            <Send className="h-3.5 w-3.5" />
            Submit to DSDC Committee
          </Button>
        </div>
      </div>

      {/* Authority Banner */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Info className="h-4 w-4 shrink-0 text-primary" />
          <span>
            <strong>Statutory Alignment:</strong> Generated in accordance with AICTE model curriculum guidelines, NSQF framework standards, and regional District Skill Committee (DSDC) targets.
          </span>
        </div>
        <Badge variant="outline" className="text-[10px] font-mono border-primary/30 shrink-0">
          Plan ID: {plan.planId}
        </Badge>
      </div>

      {/* ======================================================== */}
      {/* INPUTS PANEL: District, Sector, Role */}
      {/* ======================================================== */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
            Planning Scope Inputs (Government / Institutional Parameters)
          </span>
          <Link to="/district-skill-map">
            <span className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
              View Regional Skill Map <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {/* Input 1: District */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Target District</label>
            <Select value={selectedDistrict} onValueChange={handleDistrictChange}>
              <SelectTrigger className="h-9 text-xs bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {maharashtraDistricts.map((d) => (
                  <SelectItem key={d} value={d} className="text-xs font-medium">
                    {d} (Maharashtra)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Input 2: Sector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Economic Sector</label>
            <Select value={selectedSector} onValueChange={handleSectorChange}>
              <SelectTrigger className="h-9 text-xs bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableSectors.map((s) => (
                  <SelectItem key={s} value={s} className="text-xs font-medium">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Input 3: Role */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Target Employment Role</label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="h-9 text-xs bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((r) => (
                  <SelectItem key={r} value={r} className="text-xs font-medium">
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* KPI METRIC CARDS */}
      {/* ======================================================== */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Market Requisition Volume"
          value={`${plan.detectedCapacityGap.marketRequisitionDemand.toLocaleString()} Hires`}
          icon={Briefcase}
          hint={`Annual employer vacancies in ${selectedDistrict}`}
        />
        <StatCard
          label="Current Qualified Output"
          value={`${plan.detectedCapacityGap.currentQualifiedOutput.toLocaleString()} Grads`}
          icon={GraduationCap}
          hint="Graduates passing practical screening"
        />
        <StatCard
          label="Detected Capacity Shortfall"
          value={`-${plan.detectedCapacityGap.netDeficitSeats.toLocaleString()} Seats`}
          icon={AlertTriangle}
          hint={`${plan.detectedCapacityGap.gapSeverityPct}% unmet hiring deficit`}
        />
        <StatCard
          label="Master Trainers Needed"
          value={`${plan.trainerRequirements.certifiedMasterTrainersNeeded} Instructors`}
          icon={Users}
          hint={`Deficit: ${plan.trainerRequirements.netTrainerDeficit} faculty`}
        />
      </div>

      {/* ======================================================== */}
      {/* OUTPUT 4: DETECTED CAPACITY GAP & SIMULATION SLIDER     */}
      {/* ======================================================== */}
      <div className="rounded-2xl border border-rose-500/30 bg-rose-500/[0.03] p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/20 text-[11px] font-bold text-rose-600">
                4
              </span>
              <h2 className="font-display text-lg font-bold text-foreground">
                Detected Institutional Capacity Gap Analysis
              </h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Quantified deficit between verified district industry requisitions and local work-ready graduate throughput.
            </p>
          </div>
          <Badge className="bg-rose-500 text-white text-xs">
            {plan.detectedCapacityGap.shortfallSeverity}
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2 items-center">
          {/* Baseline Gap Comparison Bars */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Annual Market Requisition Demand:</span>
                <span className="font-mono font-bold text-foreground">
                  {plan.detectedCapacityGap.marketRequisitionDemand.toLocaleString()} Seats (100%)
                </span>
              </div>
              <Progress value={100} className="h-2.5 bg-muted [&>div]:bg-primary" />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Current Work-Ready Institutional Output:</span>
                <span className="font-mono font-bold text-emerald-600">
                  {plan.detectedCapacityGap.currentQualifiedOutput.toLocaleString()} Seats ({(100 - plan.detectedCapacityGap.gapSeverityPct)}%)
                </span>
              </div>
              <Progress value={100 - plan.detectedCapacityGap.gapSeverityPct} className="h-2.5 bg-muted [&>div]:bg-emerald-500" />
            </div>

            <div className="rounded-lg bg-background p-3 border border-border text-xs flex justify-between items-center">
              <span className="font-semibold text-rose-700 dark:text-rose-400">
                Net Annual Regional Deficit:
              </span>
              <span className="font-mono font-extrabold text-rose-600 text-sm">
                -{plan.detectedCapacityGap.netDeficitSeats.toLocaleString()} Graduates Short
              </span>
            </div>
          </div>

          {/* Interactive Capacity Expansion Simulator */}
          <div className="rounded-xl border border-border bg-background p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> Capacity Expansion Simulator
              </span>
              <Badge variant="outline" className="text-[10px] font-mono">
                Policy Modeling
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Simulate launching new NSQF-aligned cohorts in {selectedDistrict} to observe deficit reduction:
            </p>

            <div className="flex items-center gap-2 pt-1">
              {[250, 500, 1000, 1500].map((seats) => (
                <Button
                  key={seats}
                  type="button"
                  size="sm"
                  variant={simulatedSeatsAdded === seats ? "default" : "outline"}
                  onClick={() => setSimulatedSeatsAdded(seats)}
                  className="text-xs h-7 flex-1"
                >
                  +{seats} Seats
                </Button>
              ))}
            </div>

            <div className="pt-2 border-t border-border space-y-1.5 text-xs">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">Residual Deficit After Intervention:</span>
                <span className="font-mono font-bold text-primary">
                  -{simulatedPostGapSeats.toLocaleString()} Seats ({simulatedShortfallPct}%)
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">Deficit Reduction Achieved:</span>
                <span className="font-mono font-bold text-emerald-600">
                  +{Math.round((simulatedSeatsAdded / plan.detectedCapacityGap.netDeficitSeats) * 100)}% Closed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* EXPLAINABLE REASONING: WHY EACH RECOMMENDATION GENERATED */}
      {/* ======================================================== */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              <h2 className="font-display text-lg font-bold text-foreground">
                Explainable Policy Reasoning Engine
              </h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Empirical justification explaining WHY each intervention, curriculum adjustment, and trainer headcount was computed.
            </p>
          </div>
          <Badge className="bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30 text-[10px]">
            AI Decision Explainability Active
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {plan.explainableReasoning.map((item) => (
            <div
              key={item.dimension}
              className="rounded-xl border border-border bg-background p-4 space-y-2.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2">
                  <span className="font-bold text-xs text-primary flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    Pillar: {item.dimension}
                  </span>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    Empirical Evidence
                  </Badge>
                </div>

                <div className="mt-2 rounded-lg bg-muted/40 p-2.5 text-[11px] font-mono text-foreground leading-snug">
                  <strong>Evidence:</strong> {item.metricEvidence}
                </div>

                <div className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground block text-[11px] mb-0.5">
                    Why This Recommendation Was Generated:
                  </strong>
                  {item.whyThisRecommendationGenerated}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* OUTPUT 1: RECOMMENDED TRAINING PROGRAMMES                */}
      {/* ======================================================== */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
              1
            </span>
            <h2 className="font-display text-lg font-bold text-foreground">
              Recommended Training Programmes for Immediate Launch
            </h2>
          </div>
          <Badge variant="secondary" className="text-xs">
            {plan.recommendedProgrammes.length} Priority Curricula
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {plan.recommendedProgrammes.map((prog) => (
            <div
              key={prog.id}
              className="rounded-xl border border-border bg-background p-4 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                    {prog.level}
                  </Badge>
                  <span className="font-mono text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {prog.recommendedDuration}
                  </span>
                </div>

                <h3 className="font-display font-bold text-sm text-foreground leading-snug">
                  {prog.title}
                </h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {prog.rationale}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-border/70 text-xs">
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">Target Intake:</span>
                  <span className="font-mono font-bold text-foreground">
                    {prog.targetAnnualIntake} Seats / Yr
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">Target Placement Rate:</span>
                  <span className="font-mono font-bold text-emerald-600">
                    {prog.expectedPlacementRatePct}% Target
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground bg-muted/40 p-2 rounded-lg">
                  <strong>Audience:</strong> {prog.targetAudience}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* OUTPUT 2: REQUIRED SKILLS MATRIX                         */}
      {/* ======================================================== */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
              2
            </span>
            <h2 className="font-display text-lg font-bold text-foreground">
              Required Skills Rubric & NSQF Mapped Standards
            </h2>
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            NSQF Level 6/7
          </Badge>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {plan.requiredSkills.map((sk) => (
            <div
              key={sk.skillName}
              className="rounded-xl border border-border bg-background p-4 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-foreground flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  {sk.skillName}
                </span>
                <Badge variant="secondary" className="font-mono text-[10px]">
                  {sk.recommendedHours} Lab Hours
                </Badge>
              </div>

              <div className="text-[11px] text-muted-foreground">
                <strong className="text-foreground">Required Standard:</strong> {sk.proficiencyStandard}
              </div>

              <div className="rounded-lg bg-muted/40 p-2 text-[10px] text-muted-foreground">
                <strong>Evaluation:</strong> {sk.evaluationMethod}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* OUTPUT 5: SUGGESTED COURSE UPDATES                       */}
      {/* ======================================================== */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
              5
            </span>
            <h2 className="font-display text-lg font-bold text-foreground">
              Actionable College Syllabus Revisions (Board of Studies Directives)
            </h2>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
            Curriculum Modernization
          </Badge>
        </div>

        <div className="space-y-3">
          {plan.suggestedCourseUpdates.map((upd) => (
            <div
              key={upd.courseCode}
              className="rounded-xl border border-border bg-background p-4 space-y-2.5 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-border/70 pb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {upd.courseCode}
                  </Badge>
                  <span className="font-bold text-sm text-foreground">{upd.courseTitle}</span>
                </div>
                <span className="font-mono font-bold text-primary text-[11px]">
                  +{upd.practicalLabHoursToAdd} Practical Lab Hours Mandated
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 pt-1">
                <div className="rounded-lg bg-rose-500/5 border border-rose-500/20 p-2.5 text-[11px]">
                  <span className="font-bold text-rose-700 dark:text-rose-400 block mb-0.5">
                    Current Syllabus Deficiency:
                  </span>
                  <p className="text-muted-foreground">{upd.currentObsolescence}</p>
                </div>

                <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-2.5 text-[11px]">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">
                    Recommended Policy Modernization:
                  </span>
                  <p className="text-muted-foreground">{upd.recommendedAction}</p>
                </div>
              </div>

              <div className="text-[10px] text-muted-foreground pt-1 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span><strong>Target Graduation Competency:</strong> {upd.expectedOutcome}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* OUTPUT 6 & 7: TRAINER & INFRASTRUCTURE REQUIREMENTS     */}
      {/* ======================================================== */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* OUTPUT 6: TRAINER REQUIREMENTS */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                  6
                </span>
                <h3 className="font-display font-bold text-base text-foreground">
                  Master Trainer Requirements
                </h3>
              </div>
              <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px]">
                Deficit: {plan.trainerRequirements.netTrainerDeficit} Faculty
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center text-xs">
              <div className="rounded-xl border border-border bg-background p-3">
                <span className="font-display text-2xl font-bold text-foreground block">
                  {plan.trainerRequirements.certifiedMasterTrainersNeeded}
                </span>
                <span className="text-[11px] text-muted-foreground">Certified Trainers Needed</span>
              </div>
              <div className="rounded-xl border border-border bg-background p-3">
                <span className="font-display text-2xl font-bold text-emerald-600 block">
                  {plan.trainerRequirements.currentlyAvailableTrainers}
                </span>
                <span className="text-[11px] text-muted-foreground">Active Qualified Faculty</span>
              </div>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <span className="font-bold text-foreground text-[11px] block">
                Mandatory Faculty Certifications:
              </span>
              <ul className="space-y-1.5">
                {plan.trainerRequirements.mandatoryCertifications.map((cert) => (
                  <li key={cert} className="flex items-center gap-2 text-muted-foreground text-[11px]">
                    <Check className="h-3 w-3 text-primary shrink-0" />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-lg bg-muted/40 p-2.5 text-[10px] text-muted-foreground border-t border-border mt-3">
            <strong>Capacity Ramp:</strong> {plan.trainerRequirements.trainTheTrainerCohortsNeeded} Train-the-Trainer (ToT) cohorts ({plan.trainerRequirements.totDurationWeeks} weeks duration) required to certify regional college instructors.
          </div>
        </div>

        {/* OUTPUT 7: INFRASTRUCTURE & SOFTWARE */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                  7
                </span>
                <h3 className="font-display font-bold text-base text-foreground">
                  Infrastructure & Lab Software
                </h3>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                {plan.infrastructureRequirements.estimatedCapExPerLabInr}
              </Badge>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-foreground text-[11px] block flex items-center gap-1.5">
                <Laptop className="h-3.5 w-3.5 text-primary" /> Hardware Standards (Per 30-Seat Lab):
              </span>
              <ul className="space-y-1">
                {plan.infrastructureRequirements.hardwareSpecifications.map((hw) => (
                  <li key={hw} className="flex items-start gap-1.5 text-muted-foreground text-[11px]">
                    <Check className="h-3 w-3 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{hw}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <span className="font-bold text-foreground text-[11px] block flex items-center gap-1.5">
                <Wrench className="h-3.5 w-3.5 text-primary" /> Required Software & Cloud Licensing:
              </span>
              <ul className="space-y-1">
                {plan.infrastructureRequirements.softwareLicensesNeeded.map((sw) => (
                  <li key={sw} className="flex items-start gap-1.5 text-muted-foreground text-[11px]">
                    <Check className="h-3 w-3 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{sw}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-lg bg-primary/5 border border-primary/20 p-2.5 text-[10px] text-foreground border-t border-border mt-3 flex items-center justify-between">
            <span><strong>Cloud Education Grant:</strong> ${plan.infrastructureRequirements.cloudGrantPerStudentUsd} USD / Student</span>
            <span className="font-mono text-primary font-semibold">AICTE AWS / Azure MoUs</span>
          </div>
        </div>
      </div>
    </div>
  );
}
