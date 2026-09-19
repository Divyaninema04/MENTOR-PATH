import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Layers,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Award,
  ArrowRight,
  Search,
  SlidersHorizontal,
  Sparkles,
  Download,
  BookOpen,
  Info,
  ShieldAlert,
  Building2,
  MapPin,
  Briefcase,
  GraduationCap,
  RefreshCw,
  Check,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { StatCard } from "@/components/widgets";
import {
  ALIGNMENT_COURSES,
  ALIGNMENT_PROGRAMMES,
  ALIGNMENT_SECTORS,
  ALIGNMENT_ROLES,
  ALIGNMENT_DISTRICTS,
  evaluateCurriculumAlignment,
  type SkillAlignmentItem,
  type AlignmentGapStatus,
} from "@/data/training-alignment-demo-data";

export const Route = createFileRoute("/_authenticated/curriculum-alignment")({
  head: () => ({
    meta: [
      { title: "Curriculum Alignment Engine — Training Alignment" },
      {
        name: "description",
        content:
          "Administrator & training provider engine comparing live labor market skill demands against current institutional curriculum coverage to identify critical gaps.",
      },
    ],
  }),
  component: CurriculumAlignmentEnginePage,
});

export default function CurriculumAlignmentEnginePage() {
  // 5 Selector Dimensions for Administrator / Training Provider
  const [selectedCourse, setSelectedCourse] = useState<string>("Data Analytics");
  const [selectedProgramme, setSelectedProgramme] = useState<string>("B.Tech Computer Science (4-Year)");
  const [selectedSector, setSelectedSector] = useState<string>("IT & Software Services");
  const [selectedRole, setSelectedRole] = useState<string>("Data Analyst");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Bengaluru Urban (Karnataka)");

  // Filter & Search state for the comparison matrix
  const [activeGapTab, setActiveGapTab] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkillModal, setSelectedSkillModal] = useState<SkillAlignmentItem | null>(null);

  // Evaluate dynamic alignment result based on selection
  const alignmentResult = useMemo(() => {
    return evaluateCurriculumAlignment(
      selectedCourse,
      selectedProgramme,
      selectedSector,
      selectedRole,
      selectedDistrict
    );
  }, [selectedCourse, selectedProgramme, selectedSector, selectedRole, selectedDistrict]);

  // Filtered skills in matrix table
  const filteredSkills = useMemo(() => {
    return alignmentResult.skills.filter((item) => {
      const matchesSearch =
        item.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.syllabusNotes.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTab =
        activeGapTab === "ALL" ||
        (activeGapTab === "CRITICAL" && item.gapStatus === "CRITICAL GAP") ||
        (activeGapTab === "MODERATE" && item.gapStatus === "MODERATE GAP") ||
        (activeGapTab === "ALIGNED" && item.gapStatus === "ALIGNED");

      return matchesSearch && matchesTab;
    });
  }, [alignmentResult.skills, searchQuery, activeGapTab]);

  // Chart data formatting
  const chartData = useMemo(() => {
    return alignmentResult.skills.map((s) => ({
      name: s.skill,
      "Market Demand Score": s.marketDemandScore,
      "Curriculum Coverage": s.curriculumCoverageScore,
      gapStatus: s.gapStatus,
      demandLevel: s.marketDemand,
      coverageLevel: s.curriculumCoverage,
      postings: s.jobPostingsCount,
    }));
  }, [alignmentResult.skills]);

  // Reset to default benchmark
  const handleResetToBenchmark = () => {
    setSelectedCourse("Data Analytics");
    setSelectedProgramme("B.Tech Computer Science (4-Year)");
    setSelectedSector("IT & Software Services");
    setSelectedRole("Data Analyst");
    setSelectedDistrict("Bengaluru Urban (Karnataka)");
    toast.info("Reset to standard Data Analytics benchmark.");
  };

  const handleExportDossier = () => {
    toast.success(`Exported Curriculum Alignment Dossier for ${selectedCourse} (${selectedRole})`);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Curriculum & Training Alignment
          </div>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight">
            Curriculum Alignment Engine
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Systematic cross-examination of university curriculum coverage against live labour market skill demand signals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetToBenchmark}
            className="gap-1.5 text-xs h-9"
          >
            <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
            Reset Benchmark
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportDossier}
            className="gap-1.5 text-xs h-9"
          >
            <Download className="h-3.5 w-3.5" />
            Export Dossier
          </Button>
          <Link to="/curriculum-recommendations">
            <Button size="sm" className="gap-1.5 text-xs h-9 bg-primary text-primary-foreground">
              Recommendations <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Provenance Alert */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Info className="h-4 w-4 shrink-0 text-primary" />
          <span>
            <strong>Provenance & Methodology:</strong> Simulated LMI Q3 2026 enterprise requisitions cross-referenced against AICTE Model Curricula & Academic Board of Studies benchmarks.
          </span>
        </div>
        <Badge variant="outline" className="text-[10px] font-mono border-primary/30 shrink-0">
          Source: Simulated LMI Q3 2026
        </Badge>
      </div>

      {/* 5-DIMENSION ADMINISTRATOR FILTER BAR */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            Administrator & Training Provider Parameters
          </div>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Select course parameters to evaluate curriculum coverage against regional market demand
          </span>
        </div>

        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          {/* 1. Course */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-primary" /> Course
            </label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {ALIGNMENT_COURSES.map((c) => (
                  <SelectItem key={c} value={c} className="text-xs">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 2. Training Programme */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5 text-primary" /> Training Programme
            </label>
            <Select value={selectedProgramme} onValueChange={setSelectedProgramme}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select programme" />
              </SelectTrigger>
              <SelectContent>
                {ALIGNMENT_PROGRAMMES.map((p) => (
                  <SelectItem key={p} value={p} className="text-xs">
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 3. Sector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-primary" /> Sector
            </label>
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select sector" />
              </SelectTrigger>
              <SelectContent>
                {ALIGNMENT_SECTORS.map((s) => (
                  <SelectItem key={s} value={s} className="text-xs">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 4. Role */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-primary" /> Target Role
            </label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select target role" />
              </SelectTrigger>
              <SelectContent>
                {ALIGNMENT_ROLES.map((r) => (
                  <SelectItem key={r} value={r} className="text-xs">
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 5. District */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary" /> District / Cluster
            </label>
            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                {ALIGNMENT_DISTRICTS.map((d) => (
                  <SelectItem key={d} value={d} className="text-xs">
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* KPI HIGHLIGHT CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Curriculum Alignment Index"
          value={`${alignmentResult.overallAlignmentIndex}%`}
          icon={Award}
          hint={`${selectedCourse} vs ${selectedRole} demand profile`}
        />
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-red-600">
            <span>Critical Gaps Detected</span>
            <ShieldAlert className="h-4 w-4" />
          </div>
          <div className="my-2">
            <span className="font-display text-2xl font-bold text-red-600">
              {alignmentResult.criticalGapsCount} Skills
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            High / Very High demand skills missing from syllabus
          </p>
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-600">
            <span>Moderate Gaps</span>
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div className="my-2">
            <span className="font-display text-2xl font-bold text-amber-600">
              {alignmentResult.moderateGapsCount} Skills
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Partially covered competencies needing practical lab expansion
          </p>
        </div>

        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-600">
            <span>Fully Aligned Skills</span>
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div className="my-2">
            <span className="font-display text-2xl font-bold text-emerald-600">
              {alignmentResult.alignedCount} Skills
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Syllabus meets or exceeds current industry requirements
          </p>
        </div>
      </div>

      {/* VISUAL "MARKET DEMAND VS CURRICULUM COVERAGE" COMPARISON */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
          <div>
            <h2 className="font-display text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Visual Comparison: Market Demand vs Curriculum Coverage
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Direct comparison of industry hiring index (0–100) against institutional syllabus depth (0–100) across required competencies.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-xs bg-sky-500 inline-block" />
              <span className="font-medium text-foreground">Market Demand Index</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-xs bg-emerald-500 inline-block" />
              <span className="font-medium text-foreground">Curriculum Coverage Score</span>
            </div>
          </div>
        </div>

        {/* Dual Bar Chart */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 25 }}
              barGap={6}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.6} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                interval={0}
                angle={-15}
                textAnchor="end"
                height={45}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                unit="%"
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-xl border border-border bg-popover/95 p-3.5 shadow-xl backdrop-blur text-xs space-y-1.5 min-w-[220px]">
                        <p className="font-bold text-foreground text-sm border-b border-border pb-1">
                          {label}
                        </p>
                        <div className="flex justify-between items-center text-sky-600">
                          <span>Market Demand:</span>
                          <span className="font-semibold">{data["Market Demand Score"]}% ({data.demandLevel})</span>
                        </div>
                        <div className="flex justify-between items-center text-emerald-600">
                          <span>Curriculum Depth:</span>
                          <span className="font-semibold">{data["Curriculum Coverage"]}% ({data.coverageLevel})</span>
                        </div>
                        <div className="flex justify-between items-center text-muted-foreground pt-1 border-t border-border">
                          <span>Regional Postings:</span>
                          <span className="font-mono">{data.postings.toLocaleString()} jobs</span>
                        </div>
                        <div className="pt-1">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                              data.gapStatus === "CRITICAL GAP"
                                ? "bg-red-500/10 text-red-600 border border-red-500/20"
                                : data.gapStatus === "MODERATE GAP"
                                ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                                : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            }`}
                          >
                            {data.gapStatus}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="Market Demand Score" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={32} />
              <Bar dataKey="Curriculum Coverage" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={32}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.gapStatus === "CRITICAL GAP"
                        ? "#f43f5e"
                        : entry.gapStatus === "MODERATE GAP"
                        ? "#f59e0b"
                        : "#10b981"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend Notice */}
        <div className="rounded-xl border border-border bg-muted/30 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">Gap Status Legend:</span>
            <Badge className="bg-red-500/10 text-red-600 border-red-500/20 font-semibold">
              CRITICAL GAP: Demand High/Very High & Coverage Missing
            </Badge>
            <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 font-semibold">
              MODERATE GAP: Partial Coverage or Medium Demand Missing
            </Badge>
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-semibold">
              ALIGNED: Fully Covered
            </Badge>
          </div>
          <span className="text-muted-foreground text-[11px]">
            {alignmentResult.theoryToLabRatio}
          </span>
        </div>
      </div>

      {/* INTERACTIVE SKILL GAP MATRIX TABLE */}
      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        {/* Table Filter Bar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            <Button
              variant={activeGapTab === "ALL" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveGapTab("ALL")}
              className="text-xs h-8"
            >
              All Skills ({alignmentResult.skills.length})
            </Button>
            <Button
              variant={activeGapTab === "CRITICAL" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveGapTab("CRITICAL")}
              className="text-xs h-8 border-red-500/30 text-red-600 hover:bg-red-500/10"
            >
              🚨 Critical Gaps ({alignmentResult.criticalGapsCount})
            </Button>
            <Button
              variant={activeGapTab === "MODERATE" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveGapTab("MODERATE")}
              className="text-xs h-8 border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
            >
              ⚠️ Moderate Gaps ({alignmentResult.moderateGapsCount})
            </Button>
            <Button
              variant={activeGapTab === "ALIGNED" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveGapTab("ALIGNED")}
              className="text-xs h-8 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
            >
              ✅ Aligned ({alignmentResult.alignedCount})
            </Button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Filter by skill, category, or note..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
          </div>
        </div>

        {/* The Matrix Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40 text-xs">
                <TableHead className="font-bold">Required Competency</TableHead>
                <TableHead className="font-bold">Category</TableHead>
                <TableHead className="font-bold">Market Demand</TableHead>
                <TableHead className="font-bold">Curriculum Coverage</TableHead>
                <TableHead className="font-bold">Gap Status</TableHead>
                <TableHead className="font-bold">Syllabus Observation</TableHead>
                <TableHead className="font-bold text-right">Intervention</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSkills.map((item) => {
                const isCritical = item.gapStatus === "CRITICAL GAP";
                const isModerate = item.gapStatus === "MODERATE GAP";
                const isAligned = item.gapStatus === "ALIGNED";

                return (
                  <TableRow
                    key={item.skill}
                    className={`text-xs cursor-pointer transition-colors ${
                      isCritical
                        ? "hover:bg-red-500/5 bg-red-500/[0.02]"
                        : isModerate
                        ? "hover:bg-amber-500/5 bg-amber-500/[0.02]"
                        : "hover:bg-muted/40"
                    }`}
                    onClick={() => setSelectedSkillModal(item)}
                  >
                    <TableCell className="font-semibold text-foreground py-3">
                      <div className="flex items-center gap-2">
                        <span>{item.skill}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground block">
                        {item.jobPostingsCount.toLocaleString()} regional postings
                      </span>
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      <Badge variant="outline" className="text-[10px] font-normal">
                        {item.category}
                      </Badge>
                    </TableCell>

                    {/* Market Demand Column */}
                    <TableCell>
                      <div className="space-y-1">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-semibold ${
                            item.marketDemand === "Very High"
                              ? "border-sky-500/40 text-sky-600 bg-sky-500/10"
                              : item.marketDemand === "High"
                              ? "border-blue-500/30 text-blue-600 bg-blue-500/10"
                              : item.marketDemand === "Medium"
                              ? "border-slate-500/30 text-slate-600 bg-slate-500/10"
                              : "border-muted-foreground/30 text-muted-foreground"
                          }`}
                        >
                          {item.marketDemand} ({item.marketDemandScore}%)
                        </Badge>
                      </div>
                    </TableCell>

                    {/* Curriculum Coverage Column */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold ${
                          item.curriculumCoverage === "Covered"
                            ? "border-emerald-500/30 text-emerald-600 bg-emerald-500/10"
                            : item.curriculumCoverage === "Partial"
                            ? "border-amber-500/30 text-amber-600 bg-amber-500/10"
                            : "border-red-500/30 text-red-600 bg-red-500/10"
                        }`}
                      >
                        {item.curriculumCoverage} ({item.curriculumCoverageScore}%)
                      </Badge>
                    </TableCell>

                    {/* Evaluated Gap Status */}
                    <TableCell>
                      <Badge
                        className={`text-[10px] font-extrabold tracking-wide uppercase px-2.5 py-1 ${
                          isCritical
                            ? "bg-red-600 text-white shadow-xs"
                            : isModerate
                            ? "bg-amber-500 text-slate-900 shadow-xs"
                            : "bg-emerald-600 text-white shadow-xs"
                        }`}
                      >
                        {item.gapStatus}
                      </Badge>
                    </TableCell>

                    {/* Syllabus Observation */}
                    <TableCell className="max-w-xs text-muted-foreground truncate">
                      {item.syllabusNotes}
                    </TableCell>

                    {/* Action */}
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSkillModal(item);
                        }}
                        className="h-7 text-[11px] gap-1 text-primary hover:text-primary"
                      >
                        View Plan <ArrowRight className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Footer Summary Notice */}
        <div className="p-4 bg-muted/20 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-muted-foreground">
            Showing <strong>{filteredSkills.length}</strong> of <strong>{alignmentResult.skills.length}</strong> evaluated competencies for {selectedCourse}.
          </div>
          <div className="flex items-center gap-2">
            <Link to="/curriculum-recommendations">
              <Button size="sm" variant="outline" className="text-xs h-8 gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                View Board Recommendations
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* SKILL INTERVENTION DETAIL MODAL */}
      <Dialog open={!!selectedSkillModal} onOpenChange={() => setSelectedSkillModal(null)}>
        {selectedSkillModal && (
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  className={`text-[10px] font-bold uppercase ${
                    selectedSkillModal.gapStatus === "CRITICAL GAP"
                      ? "bg-red-600 text-white"
                      : selectedSkillModal.gapStatus === "MODERATE GAP"
                      ? "bg-amber-500 text-slate-900"
                      : "bg-emerald-600 text-white"
                  }`}
                >
                  {selectedSkillModal.gapStatus}
                </Badge>
                <span className="text-xs text-muted-foreground">{selectedSkillModal.category}</span>
              </div>
              <DialogTitle className="font-display text-xl">
                {selectedSkillModal.skill} — Syllabus Gap Diagnostic
              </DialogTitle>
              <DialogDescription className="text-xs">
                Curriculum alignment telemetry for {selectedCourse} ({selectedRole}) in {selectedDistrict}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2 text-xs">
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-muted/40 border border-border">
                <div>
                  <span className="text-[11px] text-muted-foreground block">Market Demand Level</span>
                  <strong className="text-sm text-foreground">{selectedSkillModal.marketDemand} ({selectedSkillModal.marketDemandScore}%)</strong>
                  <span className="text-[10px] text-muted-foreground block">{selectedSkillModal.jobPostingsCount.toLocaleString()} regional postings</span>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground block">Curriculum Coverage Level</span>
                  <strong className="text-sm text-foreground">{selectedSkillModal.curriculumCoverage} ({selectedSkillModal.curriculumCoverageScore}%)</strong>
                  <span className="text-[10px] text-muted-foreground block">University Model Syllabus</span>
                </div>
              </div>

              {/* Syllabus Observation */}
              <div className="space-y-1">
                <span className="font-semibold text-foreground block">Current Syllabus Observation</span>
                <p className="text-muted-foreground leading-relaxed bg-card p-3 rounded-lg border border-border">
                  {selectedSkillModal.syllabusNotes}
                </p>
              </div>

              {/* Recommended Action */}
              <div className="space-y-1">
                <span className="font-semibold text-primary block">Recommended Board of Studies Intervention</span>
                <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 text-foreground leading-relaxed">
                  {selectedSkillModal.suggestedAction}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedSkillModal(null)}
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    toast.success(`Action item added to Board of Studies Agenda for ${selectedSkillModal.skill}`);
                    setSelectedSkillModal(null);
                  }}
                  className="gap-1.5"
                >
                  <Check className="h-3.5 w-3.5" />
                  Add to Board Agenda
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
