import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Layers,
  TrendingUp,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Zap,
  Info,
  SlidersHorizontal,
  Search,
  ExternalLink,
  Download,
  AlertCircle,
  HelpCircle,
  Clock,
  Briefcase,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { StatCard } from "@/components/widgets";
import {
  RAW_COURSE_HEALTH_RECORDS,
  type CourseHealthRecord,
  type CourseHealthStatus,
} from "@/data/training-alignment-demo-data";

export const Route = createFileRoute("/_authenticated/course-health")({
  head: () => ({
    meta: [
      { title: "Course Health System — Training Alignment" },
      {
        name: "description",
        content:
          "Institutional Course Health system assigning explainable industry-alignment statuses to degree programs with complete market evidence, demand trends, and recommendations.",
      },
    ],
  }),
  component: CourseHealthSystemPage,
});

// Helper for status badge styling
function getStatusBadgeProps(status: CourseHealthStatus) {
  switch (status) {
    case "Industry Aligned":
      return {
        className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
        icon: CheckCircle2,
        pillBg: "bg-emerald-500",
      };
    case "Needs Revision":
      return {
        className: "bg-amber-500/10 text-amber-600 border-amber-500/30",
        icon: AlertTriangle,
        pillBg: "bg-amber-500",
      };
    case "Significant Skill Gap":
      return {
        className: "bg-orange-500/10 text-orange-600 border-orange-500/30",
        icon: AlertCircle,
        pillBg: "bg-orange-500",
      };
    case "Low Observed Market Relevance":
      return {
        className: "bg-purple-500/10 text-purple-600 border-purple-500/30",
        icon: Clock,
        pillBg: "bg-purple-500",
      };
    case "Potential Oversupply Risk":
      return {
        className: "bg-rose-500/10 text-rose-600 border-rose-500/30",
        icon: ShieldCheck,
        pillBg: "bg-rose-500",
      };
    default:
      return {
        className: "bg-muted text-muted-foreground",
        icon: Info,
        pillBg: "bg-muted-foreground",
      };
  }
}

export default function CourseHealthSystemPage() {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<CourseHealthRecord>(
    RAW_COURSE_HEALTH_RECORDS[0]
  );
  const [modalCourse, setModalCourse] = useState<CourseHealthRecord | null>(null);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return RAW_COURSE_HEALTH_RECORDS.filter((c) => {
      const matchesStatus =
        selectedStatusFilter === "ALL" || c.status === selectedStatusFilter;
      const matchesSearch =
        c.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.degree.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [selectedStatusFilter, searchQuery]);

  // Aggregate stats
  const avgHealthScore = Math.round(
    RAW_COURSE_HEALTH_RECORDS.reduce((sum, c) => sum + c.healthScore, 0) /
      RAW_COURSE_HEALTH_RECORDS.length
  );

  const avgPlacementVelocity = (
    RAW_COURSE_HEALTH_RECORDS.reduce((sum, c) => sum + c.placementVelocityPct, 0) /
    RAW_COURSE_HEALTH_RECORDS.length
  ).toFixed(1);

  // Chart data
  const chartData = useMemo(() => {
    return RAW_COURSE_HEALTH_RECORDS.map((c) => ({
      name: c.courseName.replace("B.Tech ", "").replace("Bachelor of ", "").replace("B.Sc ", ""),
      fullName: c.courseName,
      "Health Score": c.healthScore,
      "Curriculum Coverage": c.curriculumCoverage.overallCoveragePct,
      "Placement Velocity": Math.round(c.placementVelocityPct),
      status: c.status,
    }));
  }, []);

  const handleExportReport = () => {
    toast.success("Institutional Course Health Audit Report (PDF/Excel) downloaded.");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <span className="flex h-2 w-2 rounded-full bg-primary" />
            Course Health Diagnostics
          </div>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight">
            Course Health System
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Explainable institutional health ratings cross-referencing industry skill signals, syllabus modernization, and graduate placement velocities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportReport}
            className="gap-1.5 text-xs h-9"
          >
            <Download className="h-3.5 w-3.5" />
            Export Health Report
          </Button>
          <Link to="/curriculum-alignment">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs h-9">
              Curriculum Alignment <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <Link to="/curriculum-recommendations">
            <Button size="sm" className="gap-1.5 text-xs h-9 bg-primary text-primary-foreground">
              Recommendations <Sparkles className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Provenance Banner */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Info className="h-4 w-4 shrink-0 text-primary" />
          <span>
            <strong>Explainable Classification Mandate:</strong> Every course status is strictly anchored in observed enterprise job demand, verified skill drags, and graduate placement outcomes. Unexplained labels are strictly prohibited.
          </span>
        </div>
        <Badge variant="outline" className="text-[10px] font-mono border-primary/30 shrink-0">
          Source: Simulated LMI Q3 2026
        </Badge>
      </div>

      {/* KPI STAT CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Institutional Health Index"
          value={`${avgHealthScore}%`}
          icon={Activity}
          hint="Composite average across 6 tracked academic degree programs"
        />
        <StatCard
          label="Placement Velocity Average"
          value={`${avgPlacementVelocity}%`}
          icon={TrendingUp}
          hint="Average cohort placement rate within 6 months of graduation"
        />
        <StatCard
          label="Action Recommended"
          value="4 Programs"
          icon={AlertTriangle}
          hint="Syllabus revisions or capacity rationalizations required"
        />
        <StatCard
          label="Top Performing Track"
          value="AI & Data Science (91%)"
          icon={Zap}
          hint="Strongest employer demand & highest fresher median CTC (₹9.8 LPA)"
        />
      </div>

      {/* STATUS FILTER TABS */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-xs">
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {[
            { id: "ALL", label: "All Programs" },
            { id: "Industry Aligned", label: "Industry Aligned" },
            { id: "Needs Revision", label: "Needs Revision" },
            { id: "Significant Skill Gap", label: "Significant Skill Gap" },
            { id: "Low Observed Market Relevance", label: "Low Observed Market Relevance" },
            { id: "Potential Oversupply Risk", label: "Potential Oversupply Risk" },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={selectedStatusFilter === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatusFilter(tab.id)}
              className="text-xs h-8"
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search degree, department, or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
      </div>

      {/* MASTER DIAGNOSTIC SPLIT VIEW: COURSES LIST & DEEP 5-POINT PANEL */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Course Cards (5 cols) */}
        <div className="space-y-3 lg:col-span-5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Evaluated Degree Programs ({filteredCourses.length})
            </span>
            <span className="text-[11px] text-muted-foreground">
              Click to inspect 5-point evidence
            </span>
          </div>

          <div className="space-y-2.5 max-h-[780px] overflow-y-auto pr-1">
            {filteredCourses.map((course) => {
              const active = selectedCourse.id === course.id;
              const badgeProps = getStatusBadgeProps(course.status);
              const StatusIcon = badgeProps.icon;

              return (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${
                    active
                      ? "border-primary bg-primary/[0.04] shadow-md ring-1 ring-primary/30"
                      : "border-border bg-card hover:border-border/80 hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-bold uppercase tracking-wider gap-1 ${badgeProps.className}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {course.status}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-sm text-foreground truncate">
                        {course.courseName}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {course.department} · {course.enrolledStudents} students
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-display text-xl font-bold text-foreground">
                        {course.healthScore}%
                      </span>
                      <span className="block text-[10px] text-muted-foreground">Health</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-border/60 grid grid-cols-3 gap-2 text-[11px]">
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Placement</span>
                      <strong className="text-foreground">{course.placementVelocityPct}%</strong>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Median CTC</span>
                      <strong className="text-foreground">₹{course.fresherMedianCtcLpa} LPA</strong>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Trend</span>
                      <strong
                        className={
                          course.demandTrend.percentageChange >= 0
                            ? "text-emerald-600"
                            : "text-rose-600"
                        }
                      >
                        {course.demandTrend.percentageChange >= 0 ? "+" : ""}
                        {course.demandTrend.percentageChange}%
                      </strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: 5-POINT MANDATORY EXPLAINABLE TELEMETRY PANEL (7 cols) */}
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6">
            {/* Selected Course Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-5">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge
                    variant="outline"
                    className={`text-xs font-bold uppercase tracking-wider ${
                      getStatusBadgeProps(selectedCourse.status).className
                    }`}
                  >
                    {selectedCourse.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {selectedCourse.degree} · {selectedCourse.graduatingBatch}
                  </span>
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground">
                  {selectedCourse.courseName}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedCourse.department} · {selectedCourse.regionalHiringRatio}
                </p>
              </div>

              <div className="text-right shrink-0">
                <div className="inline-flex flex-col items-center justify-center rounded-2xl bg-muted/50 p-3 border border-border">
                  <span className="font-display text-3xl font-extrabold text-foreground">
                    {selectedCourse.healthScore}%
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Overall Health
                  </span>
                </div>
              </div>
            </div>

            {/* MANDATORY 5-POINT EXPLANATION PANELS */}
            <div className="space-y-5">
              {/* POINT 1: Market Evidence */}
              <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
                  <Briefcase className="h-4 w-4 text-primary" />
                  1. Market Evidence & Hiring Demand Signals
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {selectedCourse.marketEvidence}
                </p>
                <div className="flex flex-wrap gap-3 pt-1 text-[11px]">
                  <span className="text-muted-foreground">
                    Placement Clearance: <strong className="text-foreground">{selectedCourse.placementVelocityPct}%</strong>
                  </span>
                  <span className="text-muted-foreground">
                    Median Fresher Package: <strong className="text-foreground">₹{selectedCourse.fresherMedianCtcLpa} LPA</strong>
                  </span>
                  <span className="text-muted-foreground">
                    Talent Ratio: <strong className="text-foreground">{selectedCourse.regionalHiringRatio}</strong>
                  </span>
                </div>
              </div>

              {/* POINT 2: Skills Causing the Status */}
              <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
                    <Zap className="h-4 w-4 text-primary" />
                    2. Skills Causing the Status
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    Primary drivers elevating or depressing health
                  </span>
                </div>

                <div className="space-y-2">
                  {selectedCourse.skillsCausingStatus.map((driver, idx) => {
                    const isPositive = driver.impact === "Positive Driver";
                    const isSevere = driver.impact === "Severe Drag";
                    const isOversupplied = driver.impact === "Oversupplied";

                    return (
                      <div
                        key={idx}
                        className="rounded-lg border border-border bg-card p-2.5 text-xs flex flex-col sm:flex-row sm:items-start justify-between gap-2"
                      >
                        <div className="space-y-0.5 flex-1">
                          <div className="flex items-center gap-2">
                            <strong className="text-foreground">{driver.skill}</strong>
                            <Badge
                              variant="outline"
                              className={`text-[9px] font-bold uppercase ${
                                isPositive
                                  ? "border-emerald-500/30 text-emerald-600 bg-emerald-500/10"
                                  : isSevere
                                  ? "border-red-500/30 text-red-600 bg-red-500/10"
                                  : isOversupplied
                                  ? "border-rose-500/30 text-rose-600 bg-rose-500/10"
                                  : "border-amber-500/30 text-amber-600 bg-amber-500/10"
                              }`}
                            >
                              {driver.impact}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            {driver.reason}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* POINT 3: Demand Trend */}
              <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    3. Regional Demand Trend Trajectory
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-bold ${
                      selectedCourse.demandTrend.percentageChange >= 0
                        ? "border-emerald-500/30 text-emerald-600 bg-emerald-500/10"
                        : "border-rose-500/30 text-rose-600 bg-rose-500/10"
                    }`}
                  >
                    {selectedCourse.demandTrend.direction} (
                    {selectedCourse.demandTrend.percentageChange >= 0 ? "+" : ""}
                    {selectedCourse.demandTrend.percentageChange}% {selectedCourse.demandTrend.timeframe})
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {selectedCourse.demandTrend.summary}
                </p>
              </div>

              {/* POINT 4: Curriculum Coverage */}
              <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
                    <BookOpen className="h-4 w-4 text-primary" />
                    4. Curriculum Coverage & Syllabus Depth
                  </div>
                  <span className="text-xs font-semibold text-foreground">
                    {selectedCourse.curriculumCoverage.overallCoveragePct}% Aligned · Last Revised:{" "}
                    {selectedCourse.curriculumCoverage.lastRevisedYear}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>Syllabus Modernization Score</span>
                    <span>{selectedCourse.curriculumCoverage.overallCoveragePct}%</span>
                  </div>
                  <Progress value={selectedCourse.curriculumCoverage.overallCoveragePct} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px] pt-1">
                  <div className="space-y-1">
                    <span className="font-semibold text-emerald-600 block">Covered Competencies</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedCourse.curriculumCoverage.keyModulesCovered.map((m, i) => (
                        <Badge key={i} variant="outline" className="text-[10px] border-emerald-500/20 text-emerald-700 bg-emerald-500/5">
                          {m}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="font-semibold text-red-600 block">Missing / Lagging Modules</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedCourse.curriculumCoverage.keyModulesMissing.map((m, i) => (
                        <Badge key={i} variant="outline" className="text-[10px] border-red-500/20 text-red-700 bg-red-500/5">
                          {m}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-muted-foreground pt-1 border-t border-border/60 flex justify-between">
                  <span>Theory Contact Hours: <strong>{selectedCourse.curriculumCoverage.theoryHours}h</strong></span>
                  <span>Lab Hands-on Hours: <strong>{selectedCourse.curriculumCoverage.labPracticalHours}h</strong></span>
                </div>
              </div>

              {/* POINT 5: Recommendation */}
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                    <Sparkles className="h-4 w-4" />
                    5. Actionable Board of Studies Recommendation
                  </div>
                  <Badge className="bg-primary text-primary-foreground text-[10px]">
                    {selectedCourse.recommendation.actionType}
                  </Badge>
                </div>

                <h4 className="font-bold text-sm text-foreground">
                  {selectedCourse.recommendation.title}
                </h4>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {selectedCourse.recommendation.description}
                </p>

                <div className="pt-2 border-t border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                  <span className="text-muted-foreground">
                    Target Timeline: <strong className="text-foreground">{selectedCourse.recommendation.targetTimeline}</strong>
                  </span>
                  <span className="text-primary font-semibold">
                    Impact: {selectedCourse.recommendation.expectedImpact}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-xs text-muted-foreground">
                Program ID: <code className="font-mono">{selectedCourse.id}</code>
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    toast.success(`Intervention draft for ${selectedCourse.courseName} added to Academic Council dossier.`);
                  }}
                  className="text-xs h-8"
                >
                  Save to Academic Dossier
                </Button>
                <Link to="/curriculum-recommendations">
                  <Button size="sm" className="text-xs h-8 gap-1.5">
                    View Full Action Plan <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* INSTITUTIONAL COMPARISON CHART ACROSS ALL 6 COURSES */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Institutional Comparison: Health Score vs Curriculum vs Placement
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Comparative benchmark across all degree programs showing alignment gaps against graduate employment outcomes.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-xs bg-indigo-500 inline-block" />
              <span>Health Score (%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-xs bg-emerald-500 inline-block" />
              <span>Curriculum Coverage (%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-xs bg-amber-500 inline-block" />
              <span>Placement Velocity (%)</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 25 }}
              barGap={4}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.6} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                interval={0}
                angle={-10}
                textAnchor="end"
                height={40}
              />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} unit="%" />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="rounded-xl border border-border bg-popover/95 p-3.5 shadow-xl backdrop-blur text-xs space-y-1 min-w-[220px]">
                        <p className="font-bold text-foreground text-sm border-b border-border pb-1">
                          {d.fullName}
                        </p>
                        <div className="flex justify-between text-indigo-600">
                          <span>Health Score:</span>
                          <span className="font-bold">{d["Health Score"]}%</span>
                        </div>
                        <div className="flex justify-between text-emerald-600">
                          <span>Curriculum Coverage:</span>
                          <span className="font-bold">{d["Curriculum Coverage"]}%</span>
                        </div>
                        <div className="flex justify-between text-amber-600">
                          <span>Placement Velocity:</span>
                          <span className="font-bold">{d["Placement Velocity"]}%</span>
                        </div>
                        <div className="pt-1">
                          <Badge variant="outline" className="text-[10px]">
                            {d.status}
                          </Badge>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="Health Score" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="Curriculum Coverage" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="Placement Velocity" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
