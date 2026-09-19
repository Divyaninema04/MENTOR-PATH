import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Cpu,
  Users,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Server,
  Layers,
  Sliders,
  ShieldCheck,
  Award,
  Clock,
  Zap,
  Info,
  Search,
  Check,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Building,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatCard } from "@/components/widgets";
import {
  RAW_TRAINING_CAPACITY,
  RAW_FACULTY_CERTIFICATIONS,
  RAW_COMPUTING_LAB_QUOTAS,
  RAW_BOTTLENECK_ALERTS,
  type ComputingLabQuota,
  type FacultyCertificationRecord,
  type LabBottleneckAlert,
} from "@/data/training-alignment-demo-data";

export const Route = createFileRoute("/_authenticated/training-capacity")({
  head: () => ({
    meta: [
      { title: "Training Capacity & Lab Bandwidth — Training Alignment" },
      {
        name: "description",
        content:
          "Institutional training readiness command center: computing lab bandwidth, GPU sandbox allocations, interactive cohort capacity simulation, and certified faculty mentor ratios.",
      },
    ],
  }),
  component: TrainingCapacityPage,
});

export default function TrainingCapacityPage() {
  // Cohort Simulator State
  const [simulatedCohortSize, setSimulatedCohortSize] = useState<number>(360);
  const [targetLabHoursPerStudent, setTargetLabHoursPerStudent] = useState<number>(8); // hours/week

  // Faculty Filter State
  const [facultySearch, setFacultySearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Acknowledged Alerts
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Record<string, boolean>>({});

  // Calculations for Cohort Simulation
  const totalPhysicalWorkstations = useMemo(
    () => RAW_COMPUTING_LAB_QUOTAS.reduce((sum, lab) => sum + lab.totalWorkstations, 0),
    []
  );

  const totalGpuWorkstations = useMemo(
    () => RAW_COMPUTING_LAB_QUOTAS.reduce((sum, lab) => sum + lab.gpuAcceleratedWorkstations, 0),
    []
  );

  const totalActiveFaculty = useMemo(
    () => RAW_FACULTY_CERTIFICATIONS.filter((f) => f.status === "Active").length,
    []
  );

  // Total student-hours required per week
  const totalRequiredLabHoursWeekly = simulatedCohortSize * targetLabHoursPerStudent;
  // Available weekly capacity (assuming 40 lab operating hours per workstation per week)
  const totalAvailableWorkstationHoursWeekly = totalPhysicalWorkstations * 40;
  const workstationUtilizationPct = Math.min(
    140,
    Math.round((totalRequiredLabHoursWeekly / totalAvailableWorkstationHoursWeekly) * 100)
  );

  // Faculty-to-Student Ratio
  const currentStudentFacultyRatio = Math.round(simulatedCohortSize / (totalActiveFaculty || 1));
  const isFacultyOverloaded = currentStudentFacultyRatio > 20;

  // GPU hours calculation (assuming 40% of cohort takes AI/Data Science tracks)
  const aiCohortStudents = Math.round(simulatedCohortSize * 0.45);
  const requiredGpuWorkstations = Math.ceil(aiCohortStudents / 4); // 4 batch turns
  const gpuWorkstationDeficit = Math.max(0, requiredGpuWorkstations - totalGpuWorkstations);

  // Filtered Faculty
  const filteredFaculty = useMemo(() => {
    return RAW_FACULTY_CERTIFICATIONS.filter((f) => {
      const matchesSearch =
        f.name.toLowerCase().includes(facultySearch.toLowerCase()) ||
        f.domain.toLowerCase().includes(facultySearch.toLowerCase()) ||
        f.credentials.some((c) => c.toLowerCase().includes(facultySearch.toLowerCase()));
      const matchesDept = selectedDept === "ALL" || f.department === selectedDept;
      const matchesStatus = selectedStatus === "ALL" || f.status === selectedStatus;
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [facultySearch, selectedDept, selectedStatus]);

  const handleAcknowledgeAlert = (id: string, labName: string) => {
    setAcknowledgedAlerts((prev) => ({ ...prev, [id]: true }));
    toast.success(`Remediation dispatched for ${labName}. Lab coordinator notified.`);
  };

  const handleExportReadinessReport = () => {
    toast.success("Exported Institutional Infrastructure Readiness Audit (PDF/XLSX)");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Training & Curriculum Intelligence
          </div>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight">
            Training Capacity & Lab Bandwidth
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tracking institutional infrastructure readiness, GPU computing clusters, faculty certification bandwidth, and student batch throughput.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportReadinessReport}
            className="gap-1.5 text-xs h-9"
          >
            <Server className="h-3.5 w-3.5" />
            Export Readiness Audit
          </Button>
          <Link to="/curriculum-alignment">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs h-9">
              Curriculum Matrix <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <Link to="/curriculum-recommendations">
            <Button size="sm" className="gap-1.5 text-xs h-9 bg-primary text-primary-foreground">
              Recommendations <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Provenance Disclosure */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Info className="h-4 w-4 shrink-0 text-primary" />
          <span>
            <strong>Institutional Telemetry Standard:</strong> Benchmarked against AICTE 2026 Model Laboratory Norms, UGC Student-to-Faculty Guidelines (Target 15:1), and cloud developer sandbox allocations.
          </span>
        </div>
        <Badge variant="outline" className="text-[10px] font-mono border-primary/30 shrink-0">
          Simulated LMI Q3 2026
        </Badge>
      </div>

      {/* INSTITUTIONAL READINESS INDEX HERO BANNER */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
        <div className="grid gap-6 lg:grid-cols-4 items-center">
          {/* Main Index Gauge */}
          <div className="lg:col-span-1 rounded-xl bg-gradient-to-br from-emerald-500/10 via-primary/5 to-transparent border border-emerald-500/30 p-5 text-center space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Institutional Readiness Index
            </span>
            <div className="font-display text-5xl font-black text-foreground">
              84<span className="text-2xl font-normal text-muted-foreground">/100</span>
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 text-[10px]">
              Ready for Industry Intake
            </Badge>
            <p className="text-[11px] text-muted-foreground leading-tight pt-1">
              Top 8% percentile among autonomous regional technical institutions.
            </p>
          </div>

          {/* 4 Factor Telemetry Breakdown */}
          <div className="lg:col-span-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-border bg-background p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Computing Hardware</span>
                <Badge variant="outline" className="text-[10px] font-mono">88%</Badge>
              </div>
              <Progress value={88} className="h-1.5" />
              <p className="text-[11px] text-muted-foreground">
                302 total workstations across 4 labs; 113 GPU-equipped.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Cloud Sandboxes</span>
                <Badge variant="outline" className="text-[10px] font-mono">82%</Badge>
              </div>
              <Progress value={82} className="h-1.5" />
              <p className="text-[11px] text-muted-foreground">
                1,450 active student AWS/Azure accounts funded for live projects.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Faculty Certifications</span>
                <Badge variant="outline" className="text-[10px] font-mono text-amber-600">76%</Badge>
              </div>
              <Progress value={76} className="h-1.5" />
              <p className="text-[11px] text-muted-foreground">
                12 active credentials; 3 faculty currently in winter upskilling cohorts.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Mentor Bandwidth</span>
                <Badge variant="outline" className="text-[10px] font-mono">90%</Badge>
              </div>
              <Progress value={90} className="h-1.5" />
              <p className="text-[11px] text-muted-foreground">
                45 active alumni and industry mentors engaged in weekly 1:1 reviews.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE COHORT & BATCH CAPACITY SIMULATOR */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-primary" />
              <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
                Interactive Batch Capacity & Lab Load Simulator
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Simulate student cohort expansion to project physical workstation bottlenecks, GPU deficits, and faculty mentor overload before semester enrollment locks.
            </p>
          </div>
          <Badge variant="secondary" className="font-mono text-xs self-start sm:self-auto">
            Real-Time Model
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Controls */}
          <div className="rounded-xl border border-border bg-background p-5 space-y-5">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Simulated Student Cohort Size
                </label>
                <span className="font-mono font-bold text-sm text-primary">
                  {simulatedCohortSize} Students
                </span>
              </div>
              <Slider
                value={[simulatedCohortSize]}
                min={200}
                max={600}
                step={20}
                onValueChange={(val) => setSimulatedCohortSize(val[0])}
                className="py-2"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1 font-mono">
                <span>200 (Current Min)</span>
                <span>360 (Standard)</span>
                <span>600 (Max Capacity)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Target Lab Hours / Student / Wk
                </label>
                <span className="font-mono font-bold text-sm text-primary">
                  {targetLabHoursPerStudent} hrs
                </span>
              </div>
              <Slider
                value={[targetLabHoursPerStudent]}
                min={4}
                max={14}
                step={2}
                onValueChange={(val) => setTargetLabHoursPerStudent(val[0])}
                className="py-2"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1 font-mono">
                <span>4 hrs (Theory heavy)</span>
                <span>8 hrs (Standard)</span>
                <span>14 hrs (Project intensive)</span>
              </div>
            </div>

            <div className="pt-2 border-t border-border space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Weekly Demand:</span>
                <span className="font-mono font-bold">{totalRequiredLabHoursWeekly} student-hrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Weekly Lab Bandwidth:</span>
                <span className="font-mono font-bold">{totalAvailableWorkstationHoursWeekly} available-hrs</span>
              </div>
            </div>
          </div>

          {/* Simulation Output Cards */}
          <div className="lg:col-span-2 grid gap-4 sm:grid-cols-3">
            {/* Workstation Load Card */}
            <div
              className={`rounded-xl border p-4 space-y-3 flex flex-col justify-between ${
                workstationUtilizationPct > 100
                  ? "border-red-500/40 bg-red-500/5"
                  : workstationUtilizationPct > 85
                  ? "border-amber-500/40 bg-amber-500/5"
                  : "border-emerald-500/40 bg-emerald-500/5"
              }`}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Workstation Utilization
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-black text-foreground">
                    {workstationUtilizationPct}%
                  </span>
                  <span className="text-xs text-muted-foreground">of capacity</span>
                </div>
                <Progress value={Math.min(100, workstationUtilizationPct)} className="h-2 mt-2" />
              </div>

              <div className="text-xs text-muted-foreground">
                {workstationUtilizationPct > 100 ? (
                  <span className="text-red-600 font-semibold flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" /> Deficit: Need evening shift
                  </span>
                ) : (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Optimal throughput
                  </span>
                )}
              </div>
            </div>

            {/* GPU Deficit Card */}
            <div
              className={`rounded-xl border p-4 space-y-3 flex flex-col justify-between ${
                gpuWorkstationDeficit > 0
                  ? "border-amber-500/40 bg-amber-500/5"
                  : "border-emerald-500/40 bg-emerald-500/5"
              }`}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  AI & GPU Workstation Deficit
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-black text-foreground">
                    {gpuWorkstationDeficit > 0 ? `-${gpuWorkstationDeficit}` : "0"}
                  </span>
                  <span className="text-xs text-muted-foreground">units needed</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-2">
                  {aiCohortStudents} students targeting AI/DS electives.
                </p>
              </div>

              <div className="text-xs text-muted-foreground">
                {gpuWorkstationDeficit > 0 ? (
                  <span className="text-amber-600 font-semibold">
                    Offload to Cloud Sandboxes
                  </span>
                ) : (
                  <span className="text-emerald-600 font-semibold">
                    Dedicated hardware sufficient
                  </span>
                )}
              </div>
            </div>

            {/* Student-to-Faculty Ratio Card */}
            <div
              className={`rounded-xl border p-4 space-y-3 flex flex-col justify-between ${
                isFacultyOverloaded
                  ? "border-red-500/40 bg-red-500/5"
                  : "border-emerald-500/40 bg-emerald-500/5"
              }`}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Student : Certified Faculty
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-black text-foreground">
                    {currentStudentFacultyRatio} : 1
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-2">
                  UGC recommendation: ≤ 15:1 for engineering programs.
                </p>
              </div>

              <div className="text-xs text-muted-foreground">
                {isFacultyOverloaded ? (
                  <span className="text-red-600 font-semibold">
                    Mentorship bandwidth exceeded
                  </span>
                ) : (
                  <span className="text-emerald-600 font-semibold">
                    Within regulatory norms
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REAL-TIME BOTTLENECK & SATURATION ALERTS */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
              Active Laboratory Bottleneck Alerts ({RAW_BOTTLENECK_ALERTS.length})
            </h2>
          </div>
          <span className="text-xs text-muted-foreground">
            Auto-detected by campus lab management system
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {RAW_BOTTLENECK_ALERTS.map((alert) => {
            const isAck = acknowledgedAlerts[alert.id];
            return (
              <div
                key={alert.id}
                className={`rounded-xl border p-4 space-y-3 transition-colors ${
                  isAck
                    ? "border-border bg-muted/20 opacity-70"
                    : alert.severity === "Critical"
                    ? "border-red-500/30 bg-red-500/5"
                    : "border-amber-500/30 bg-amber-500/5"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <Badge
                    className={
                      alert.severity === "Critical"
                        ? "bg-red-600 text-white text-[10px]"
                        : "bg-amber-500 text-white text-[10px]"
                    }
                  >
                    {alert.severity} Bottleneck
                  </Badge>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {alert.timeWindow}
                  </span>
                </div>

                <div>
                  <h4 className="font-semibold text-xs text-foreground">
                    {alert.labName}
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground leading-snug">
                    {alert.description}
                  </p>
                </div>

                <div className="rounded-lg bg-background/80 border border-border/80 p-2.5 text-[11px] space-y-1">
                  <span className="font-bold text-foreground block">
                    Recommended Triage:
                  </span>
                  <p className="text-muted-foreground leading-snug">
                    {alert.suggestedRemediation}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {alert.affectedStudentsCount} students impacted
                  </span>
                  <Button
                    size="sm"
                    variant={isAck ? "outline" : "default"}
                    disabled={isAck}
                    onClick={() => handleAcknowledgeAlert(alert.id, alert.labName)}
                    className="h-7 text-[11px] px-2.5 gap-1"
                  >
                    {isAck ? (
                      <>
                        <Check className="h-3 w-3" /> Dispatched
                      </>
                    ) : (
                      "Dispatch Action"
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* COMPUTING LAB BANDWIDTH & CLUSTER ALLOCATION */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
              Computing Infrastructure & Lab Bandwidth Allocation
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live capacity breakdown across specialized engineering laboratories and cloud sandbox pools.
            </p>
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            {totalPhysicalWorkstations} Physical Workstations
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {RAW_COMPUTING_LAB_QUOTAS.map((lab) => (
            <div
              key={lab.id}
              className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {lab.category}
                    </Badge>
                    <Badge
                      className={`text-[10px] ${
                        lab.bottleneckSeverity === "Critical"
                          ? "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30"
                          : lab.bottleneckSeverity === "Constrained"
                          ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
                          : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                      }`}
                    >
                      {lab.bottleneckSeverity}
                    </Badge>
                  </div>
                  <h3 className="mt-2 font-display text-base font-bold text-foreground">
                    {lab.name}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="font-display text-2xl font-black text-foreground">
                    {lab.activeUtilizationPct}%
                  </span>
                  <span className="block text-[10px] text-muted-foreground">Utilization</span>
                </div>
              </div>

              {/* Hardware Specifications */}
              <div className="text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-lg font-mono">
                <span className="font-bold text-foreground block mb-0.5">Specifications:</span>
                {lab.specs}
              </div>

              {/* Workstation & Cloud Quotas */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-lg border border-border p-2">
                  <span className="block font-bold text-foreground">{lab.totalWorkstations}</span>
                  <span className="text-[10px] text-muted-foreground">Workstations</span>
                </div>
                <div className="rounded-lg border border-border p-2">
                  <span className="block font-bold text-primary">{lab.gpuAcceleratedWorkstations}</span>
                  <span className="text-[10px] text-muted-foreground">GPU Accelerated</span>
                </div>
                <div className="rounded-lg border border-border p-2">
                  <span className="block font-bold text-foreground">{lab.cloudSandboxQuota}</span>
                  <span className="text-[10px] text-muted-foreground">Cloud Sandboxes</span>
                </div>
              </div>

              {/* Timeslot Schedule Saturation Bars */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Timeslot Load Distribution:
                </span>
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Morning (8-12)</span>
                      <span className="font-bold">{lab.hourlySchedule.morningSlotPct}%</span>
                    </div>
                    <Progress value={lab.hourlySchedule.morningSlotPct} className="h-1.5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Afternoon (12-4)</span>
                      <span className="font-bold text-red-600">{lab.hourlySchedule.afternoonSlotPct}%</span>
                    </div>
                    <Progress value={lab.hourlySchedule.afternoonSlotPct} className="h-1.5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Evening (4-8)</span>
                      <span className="font-bold">{lab.hourlySchedule.eveningSlotPct}%</span>
                    </div>
                    <Progress value={lab.hourlySchedule.eveningSlotPct} className="h-1.5" />
                  </div>
                </div>
              </div>

              {/* Assigned Degree Courses */}
              <div className="pt-2 border-t border-border flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground font-semibold">Active Programs:</span>
                {lab.activeCourses.map((c) => (
                  <Badge key={c} variant="secondary" className="text-[10px]">
                    {c}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FACULTY CERTIFICATION & TRAIN-THE-TRAINER (TTT) MATRIX */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
              Faculty Certification & Train-the-Trainer (TTT) Matrix
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Certified academic mentors holding active industry cloud, AI, and systems credentials to supervise practical coursework.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-48">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search mentor or skill..."
                value={facultySearch}
                onChange={(e) => setFacultySearch(e.target.value)}
                className="pl-8 h-8 text-xs bg-background"
              />
            </div>

            <Select value={selectedDept} onValueChange={setSelectedDept}>
              <SelectTrigger className="w-36 h-8 text-xs bg-background">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="text-xs">All Departments</SelectItem>
                <SelectItem value="Computer Science & Engineering" className="text-xs">CSE</SelectItem>
                <SelectItem value="Artificial Intelligence & Data Science" className="text-xs">AI & DS</SelectItem>
                <SelectItem value="Information Technology" className="text-xs">IT</SelectItem>
                <SelectItem value="Electronics & Communication" className="text-xs">ECE</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="text-xs font-bold text-foreground">Faculty Member</TableHead>
                <TableHead className="text-xs font-bold text-foreground">Department & Domain</TableHead>
                <TableHead className="text-xs font-bold text-foreground">Industry Credentials</TableHead>
                <TableHead className="text-xs font-bold text-foreground text-center">Status</TableHead>
                <TableHead className="text-xs font-bold text-foreground text-center">Mentee Load</TableHead>
                <TableHead className="text-xs font-bold text-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFaculty.map((f) => (
                <TableRow key={f.id} className="text-xs">
                  <TableCell>
                    <div className="font-bold text-foreground">{f.name}</div>
                    <div className="text-[11px] text-muted-foreground">{f.title}</div>
                    <div className="text-[10px] text-primary font-mono">{f.contactEmail}</div>
                  </TableCell>

                  <TableCell>
                    <div className="font-medium text-foreground">{f.department}</div>
                    <div className="text-[11px] text-muted-foreground">{f.domain}</div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-sm">
                      {f.credentials.map((cred) => (
                        <Badge
                          key={cred}
                          variant="outline"
                          className="text-[10px] border-primary/30 bg-primary/5 text-primary"
                        >
                          <Award className="h-2.5 w-2.5 mr-1" />
                          {cred}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge
                      className={`text-[10px] ${
                        f.status === "Active"
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                          : f.status === "Renewal Pending"
                          ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
                          : "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30"
                      }`}
                    >
                      {f.status}
                    </Badge>
                    <span className="block text-[10px] font-mono text-muted-foreground mt-0.5">
                      Exp: {f.validUntil}
                    </span>
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="font-mono font-bold">
                      {f.activeMentees} / {f.menteeCapacity}
                    </div>
                    <Progress
                      value={(f.activeMentees / f.menteeCapacity) * 100}
                      className="h-1.5 w-20 mx-auto mt-1"
                    />
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        toast.info(`Assigned new capstone cohort to ${f.name}`)
                      }
                      className="text-xs h-7 px-2"
                    >
                      Assign Cohort
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
