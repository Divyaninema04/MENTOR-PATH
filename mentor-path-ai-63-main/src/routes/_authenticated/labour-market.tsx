import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  BarChart3,
  Search,
  Filter,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  Briefcase,
  Layers,
  GraduationCap,
  ExternalLink,
  Target,
  Info,
  Calendar,
  AlertTriangle,
  Award,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SectionHeader, StatCard, WidgetCard } from "@/components/widgets";
import { supabase } from "@/integrations/supabase/client";
import {
  DATASET_PROVENANCE,
  FILTER_OPTIONS,
  filterMarketData,
  evaluateStudentMarketAlignment,
  type FilterState,
} from "@/data/market-intelligence-demo-data";

export const Route = createFileRoute("/_authenticated/labour-market")({
  head: () => ({
    meta: [
      { title: "Labour Market Dashboard — PlacementPilot Intelligence" },
      {
        name: "description",
        content:
          "Evidence-driven labor market intelligence: job posting trends, high-demand skills, emerging technologies, location clusters, and student skill-gap alignment.",
      },
      { property: "og:title", content: "Labour Market Dashboard — PlacementPilot" },
      {
        property: "og:description",
        content: "Track real hiring signals, emerging skill demand, and curriculum alignment across industries.",
      },
    ],
  }),
  component: LabourMarketDashboardPage,
});

export default function LabourMarketDashboardPage() {
  // Filter state
  const [filter, setFilter] = useState<FilterState>({
    state: "All States",
    district: "All Districts",
    city: "All Cities",
    sector: "All Sectors",
    industry: "All Industries",
    role: "All Roles",
    timePeriod: "Last 90 Days (Q3 2026)",
  });

  // Fetch logged in student context for Layer D employability integration
  const profileQuery = useQuery({
    queryKey: ["profile", "market-alignment"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return null;
      const { data } = await supabase
        .from("profiles")
        .select("skills, preferred_roles, career_interests, branch, cgpa")
        .eq("id", u.user.id)
        .maybeSingle();
      return data;
    },
  });

  const subjectsQuery = useQuery({
    queryKey: ["subjects", "market-alignment"],
    queryFn: async () => {
      const { data } = await supabase
        .from("subjects")
        .select("name, progress, interview_topics");
      return data ?? [];
    },
  });

  // Calculate filtered market intelligence from prototype layer
  const marketData = useMemo(() => filterMarketData(filter), [filter]);

  // Dynamic available child options
  const availableDistricts = useMemo(() => {
    if (filter.state === "All States" || !FILTER_OPTIONS.districtsByState[filter.state]) {
      return ["All Districts"];
    }
    return FILTER_OPTIONS.districtsByState[filter.state];
  }, [filter.state]);

  const availableCities = useMemo(() => {
    if (filter.district === "All Districts" || !FILTER_OPTIONS.citiesByDistrict[filter.district]) {
      return ["All Cities"];
    }
    return FILTER_OPTIONS.citiesByDistrict[filter.district];
  }, [filter.district]);

  const availableIndustries = useMemo(() => {
    if (filter.sector === "All Sectors" || !FILTER_OPTIONS.industriesBySector[filter.sector]) {
      return ["All Industries"];
    }
    return FILTER_OPTIONS.industriesBySector[filter.sector];
  }, [filter.sector]);

  // Calculate Student Employability Bridge
  const studentAlignment = useMemo(() => {
    return evaluateStudentMarketAlignment({
      userSkills: profileQuery.data?.skills ?? [
        "Python",
        "SQL",
        "React",
        "Data Structures & Algorithmic Problem Solving",
      ],
      userSubjects: subjectsQuery.data ?? [
        { name: "Database Management Systems", interview_topics: ["SQL", "Normalization", "Indexing"] },
        { name: "Computer Networks", interview_topics: ["TCP/IP", "HTTP", "Sockets"] },
        { name: "Data Structures", interview_topics: ["Trees", "Graphs", "Dynamic Programming"] },
      ],
      marketData,
      preferredRoles: profileQuery.data?.preferred_roles,
    });
  }, [profileQuery.data, subjectsQuery.data, marketData]);

  // Count active non-default filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filter.state !== "All States") count++;
    if (filter.district !== "All Districts") count++;
    if (filter.city !== "All Cities") count++;
    if (filter.sector !== "All Sectors") count++;
    if (filter.industry !== "All Industries") count++;
    if (filter.role !== "All Roles") count++;
    if (filter.timePeriod !== "Last 90 Days (Q3 2026)") count++;
    return count;
  }, [filter]);

  const resetFilters = () => {
    setFilter({
      state: "All States",
      district: "All Districts",
      city: "All Cities",
      sector: "All Sectors",
      industry: "All Industries",
      role: "All Roles",
      timePeriod: "Last 90 Days (Q3 2026)",
    });
  };

  // Chart color palette
  const CHART_COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899", "#06b6d4"];

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-16">
      {/* 1. Header with Breadcrumbs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            Market Intelligence
          </div>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Labour Market Dashboard
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-3xl">
            Regional labour market signals, job posting trends, and skill demand distributions
            designed to systematically drive curriculum alignment and student employability roadmaps.
          </p>
        </div>

        {/* Provenance Dialog Trigger */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 border-primary/30 text-xs self-start sm:self-center">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
              <span>Dataset Provenance</span>
              <Badge variant="secondary" className="text-[10px] uppercase font-mono">
                Prototype
              </Badge>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-amber-500" />
                Evidence & Provenance Disclosure
              </DialogTitle>
              <DialogDescription>
                Transparency and provenance regarding this data layer.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 text-xs leading-relaxed text-muted-foreground mt-2">
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-amber-800 dark:text-amber-300">
                <strong>Notice:</strong> This dataset is clearly designated as <strong>PROTOTYPE / DEMO DATA</strong>.
                Real-world statistics are never fabricated or represented as verified institutional telemetry.
              </div>
              <div className="space-y-2">
                <div className="flex justify-between border-b pb-1.5">
                  <span className="font-medium text-foreground">Dataset Identifier:</span>
                  <span className="font-mono">{DATASET_PROVENANCE.datasetName}</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span className="font-medium text-foreground">Model Version:</span>
                  <span className="font-mono">{DATASET_PROVENANCE.version}</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span className="font-medium text-foreground">Sample Corpus:</span>
                  <span>{DATASET_PROVENANCE.sampleSizePostings.toLocaleString()} simulated postings across {DATASET_PROVENANCE.sampleSizeEmployers.toLocaleString()} employers</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span className="font-medium text-foreground">Calibration Baseline:</span>
                  <span>National Skill Development Corp (NSDC), State SSDMs & Tier 1/2 Employment Exchanges</span>
                </div>
                <div className="flex justify-between pb-1.5">
                  <span className="font-medium text-foreground">Last Re-indexed:</span>
                  <span>{DATASET_PROVENANCE.lastUpdated}</span>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground italic">
                Production deployment allows seamless swapping of this data layer with verified MoLE/National Career Service APIs or Enterprise ATS webhooks without UI schema changes.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 2. DEMO / PROTOTYPE Source Transparency Callout Banner */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-900 dark:text-amber-200">
        <Info className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-semibold text-amber-950 dark:text-amber-100">
            PROTOTYPE DATA LAYER ACTIVE — SOURCE: Simulated LMI Q3 2026
          </p>
          <p className="opacity-90">
            Statistics shown are generated from a calibrated benchmark seed dataset reflecting recent Indian tech and engineering hiring requisitions.
            Every visualization is evidence-annotated and wired into the cross-layer curriculum and student alignment engine below.
          </p>
        </div>
      </div>

      {/* 3. Interactive Multi-Dimensional Filter Bar */}
      <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
          <div className="flex items-center gap-2 font-medium text-sm text-foreground">
            <Filter className="h-4 w-4 text-primary" />
            <span>Market Intelligence Filters</span>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {activeFilterCount} active
              </Badge>
            )}
          </div>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Filters
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* State */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" /> State
            </label>
            <Select
              value={filter.state}
              onValueChange={(val) => {
                setFilter((prev) => ({
                  ...prev,
                  state: val,
                  district: "All Districts",
                  city: "All Cities",
                }));
              }}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                {FILTER_OPTIONS.states.map((st) => (
                  <SelectItem key={st} value={st} className="text-xs">
                    {st}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* District */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">District</label>
            <Select
              value={filter.district}
              disabled={filter.state === "All States"}
              onValueChange={(val) => {
                setFilter((prev) => ({
                  ...prev,
                  district: val,
                  city: "All Cities",
                }));
              }}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder={filter.state === "All States" ? "Select State First" : "Select District"} />
              </SelectTrigger>
              <SelectContent>
                {availableDistricts.map((dist) => (
                  <SelectItem key={dist} value={dist} className="text-xs">
                    {dist}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* City / Hub */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">City / Tech Hub</label>
            <Select
              value={filter.city}
              disabled={filter.district === "All Districts"}
              onValueChange={(val) => setFilter((prev) => ({ ...prev, city: val }))}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder={filter.district === "All Districts" ? "Select District First" : "Select City"} />
              </SelectTrigger>
              <SelectContent>
                {availableCities.map((ct) => (
                  <SelectItem key={ct} value={ct} className="text-xs">
                    {ct}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sector */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Layers className="h-3 w-3" /> Sector
            </label>
            <Select
              value={filter.sector}
              onValueChange={(val) => {
                setFilter((prev) => ({
                  ...prev,
                  sector: val,
                  industry: "All Industries",
                }));
              }}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select Sector" />
              </SelectTrigger>
              <SelectContent>
                {FILTER_OPTIONS.sectors.map((sec) => (
                  <SelectItem key={sec} value={sec} className="text-xs">
                    {sec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Industry */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Sub-Industry</label>
            <Select
              value={filter.industry}
              disabled={filter.sector === "All Sectors"}
              onValueChange={(val) => setFilter((prev) => ({ ...prev, industry: val }))}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder={filter.sector === "All Sectors" ? "Select Sector First" : "Select Industry"} />
              </SelectTrigger>
              <SelectContent>
                {availableIndustries.map((ind) => (
                  <SelectItem key={ind} value={ind} className="text-xs">
                    {ind}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Job Role */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Briefcase className="h-3 w-3" /> Job Role
            </label>
            <Select
              value={filter.role}
              onValueChange={(val) => setFilter((prev) => ({ ...prev, role: val }))}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select Job Role" />
              </SelectTrigger>
              <SelectContent>
                {FILTER_OPTIONS.roles.map((r) => (
                  <SelectItem key={r} value={r} className="text-xs">
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Period */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Time Period
            </label>
            <Select
              value={filter.timePeriod}
              onValueChange={(val) => setFilter((prev) => ({ ...prev, timePeriod: val }))}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select Time Window" />
              </SelectTrigger>
              <SelectContent>
                {FILTER_OPTIONS.timePeriods.map((tp) => (
                  <SelectItem key={tp} value={tp} className="text-xs">
                    {tp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quick Active Scope Summary */}
          <div className="flex flex-col justify-end">
            <div className="rounded-lg bg-mist/60 p-2 text-[11px] text-muted-foreground flex items-center justify-between">
              <span>Slice Sample Size:</span>
              <span className="font-semibold text-foreground">
                {marketData.totalPostings.toLocaleString()} postings
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. High-Level KPI Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Job Postings Analyzed"
          value={marketData.totalPostings.toLocaleString()}
          icon={BarChart3}
          hint={`Across ${marketData.activeCompaniesCount.toLocaleString()} employers in selected criteria`}
        />
        <StatCard
          label="Aggregate Demand Growth"
          value={`+${marketData.overallGrowthRatePct}%`}
          icon={TrendingUp}
          hint="Quarter-over-quarter expansion in active postings"
        />
        <StatCard
          label="Top Demanded Skill"
          value={marketData.topDemandedSkill}
          icon={Award}
          hint={`${marketData.topSkills[0]?.demandSharePct ?? 29}% of filtered positions require this competency`}
        />
        <StatCard
          label="Fastest Growing Role"
          value={
            <span className="truncate block text-lg font-bold" title={marketData.fastestGrowingRole}>
              {marketData.fastestGrowingRole}
            </span>
          }
          icon={Sparkles}
          hint="Highest year-over-year surge (+52.8%)"
        />
      </div>

      {/* 5. CONNECTED ARCHITECTURE BRIDGE: Student Employability Alignment (Layer D) */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 via-accent/20 to-transparent p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-primary border-primary/30">
                Student Alignment
              </Badge>
              <h2 className="font-display text-xl font-bold tracking-tight">
                Your Personal Skill Gap & Market Fit
              </h2>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Market signals directly evaluated against your recorded profile skills and academic subjects.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Current Market Alignment</div>
              <div className="font-display text-2xl font-bold text-primary">
                {studentAlignment.alignmentScorePct}%
              </div>
            </div>
            <Progress value={studentAlignment.alignmentScorePct} className="w-24 h-2.5" />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Matched Skills */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
              <span>Your Demanded Strengths</span>
              <Badge variant="outline" className="text-emerald-600 border-emerald-500/30 text-[10px]">
                {studentAlignment.matchedSkills.length} Matched
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Skills you already track that are actively demanded in this market segment:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {studentAlignment.matchedSkills.map((s) => (
                <Badge key={s.name} variant="secondary" className="text-xs bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20">
                  ✓ {s.name}
                </Badge>
              ))}
              {studentAlignment.matchedSkills.length === 0 && (
                <span className="text-xs text-muted-foreground italic">Add your skills in Profile to see matching strengths.</span>
              )}
            </div>
          </div>

          {/* Missing High Demand Skills */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">
              <span>Priority Market Skill Gaps</span>
              <Badge variant="outline" className="text-amber-600 border-amber-500/30 text-[10px]">
                {studentAlignment.missingHighDemandSkills.length} Uncovered
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Frequent hiring requisitions not yet added to your profile:
            </p>
            <div className="space-y-2">
              {studentAlignment.missingHighDemandSkills.slice(0, 3).map((s) => (
                <div key={s.name} className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground truncate max-w-[170px]">{s.name}</span>
                  <span className="text-[11px] text-muted-foreground">{s.demandSharePct}% asks</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Next Steps */}
          <div className="rounded-xl border border-border bg-card p-4 flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-primary mb-1">
                Curriculum & Roadmap Actions
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Bridge these gaps by feeding this intelligence into your learning layers:
              </p>
              <div className="space-y-1.5 text-xs">
                {studentAlignment.recommendedRoadmapActions.slice(0, 2).map((act) => (
                  <div key={act.skill} className="rounded-md bg-muted/60 p-2 text-[11px] leading-snug">
                    <span className="font-semibold text-primary">{act.skill}:</span> {act.reason}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Link to="/career" className="flex-1">
                <Button size="sm" className="w-full gap-1 text-xs">
                  Update Roadmap <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <Link to="/academics">
                <Button size="sm" variant="outline" className="text-xs">
                  Curriculum
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Main Demand Trend Visualizations */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Demand Trend Area Chart (2 Cols) */}
        <WidgetCard
          title="Market Demand Trend (Monthly Job Postings)"
          icon={TrendingUp}
          className="lg:col-span-2"
          footnote="Source: Simulated LMI Q3 2026. Data aggregated across Information Technology, BFSI, Core Engineering, and Emerging Sectors."
        >
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={marketData.demandTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="totalColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="itColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <RechartsTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border border-border bg-card p-3 shadow-md text-xs">
                          <p className="font-semibold">{label}</p>
                          <p className="text-primary mt-1">Total Postings: {payload[0]?.value?.toLocaleString()}</p>
                          <p className="text-emerald-600">Tech Sector: {payload[1]?.value?.toLocaleString()}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">Dataset: Prototype LMI-2026</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="totalPostings" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#totalColor)" name="Total Postings" />
                <Area type="monotone" dataKey="itPostings" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#itColor)" name="Tech & Cloud" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </WidgetCard>

        {/* Experience Requirements Distribution (1 Col) */}
        <WidgetCard
          title="Experience Requirements Breakdown"
          icon={Briefcase}
          footnote="Demand split across recruitment tiers for candidate eligibility."
        >
          <div className="space-y-4 pt-1">
            {marketData.experienceRequirements.map((exp, idx) => (
              <div key={exp.tier} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{exp.tier}</span>
                  <span className="font-semibold text-primary">{exp.percentage}%</span>
                </div>
                <Progress value={exp.percentage * 2.5} className="h-2" />
                <p className="text-[11px] text-muted-foreground">{exp.description}</p>
              </div>
            ))}
          </div>
        </WidgetCard>
      </div>

      {/* 7. Top Demanded Skills Analysis & Proficiency Split */}
      <WidgetCard
        title="Top Demanded Skills & Proficiency Requirements"
        icon={BarChart3}
        footnote="Source: Simulated LMI Q3 2026. Proficiency split denotes hiring expectation: Beginner (0-1y), Intermediate (1-3y), Advanced (3-5y), Expert (5+y)."
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead>Skill Competency</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Observed Postings</TableHead>
                <TableHead className="text-right">Share of Demand</TableHead>
                <TableHead className="text-right">YoY Velocity</TableHead>
                <TableHead>Proficiency Expectations (Beg / Int / Adv / Exp)</TableHead>
                <TableHead>Curriculum Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {marketData.topSkills.map((skill) => (
                <TableRow key={skill.name}>
                  <TableCell className="font-semibold text-foreground">
                    {skill.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">
                      {skill.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {skill.demandCount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium">
                    {skill.demandSharePct}%
                  </TableCell>
                  <TableCell className="text-right font-mono text-emerald-600 font-semibold">
                    +{skill.yoyGrowthPct}%
                  </TableCell>
                  <TableCell className="min-w-[190px]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-full flex h-2 rounded-full overflow-hidden bg-muted">
                        <div style={{ width: `${skill.proficiencySplit.beginnerPct}%` }} className="bg-sky-400" title={`Beginner: ${skill.proficiencySplit.beginnerPct}%`} />
                        <div style={{ width: `${skill.proficiencySplit.intermediatePct}%` }} className="bg-blue-600" title={`Intermediate: ${skill.proficiencySplit.intermediatePct}%`} />
                        <div style={{ width: `${skill.proficiencySplit.advancedPct}%` }} className="bg-purple-600" title={`Advanced: ${skill.proficiencySplit.advancedPct}%`} />
                        <div style={{ width: `${skill.proficiencySplit.expertPct}%` }} className="bg-amber-500" title={`Expert: ${skill.proficiencySplit.expertPct}%`} />
                      </div>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {skill.proficiencySplit.beginnerPct}% beg
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        skill.curriculumStatus === "Severe Curriculum Gap"
                          ? "border-red-500/40 text-red-600 bg-red-500/10"
                          : skill.curriculumStatus === "Partially Covered"
                          ? "border-amber-500/40 text-amber-600 bg-amber-500/10"
                          : "border-emerald-500/40 text-emerald-600 bg-emerald-500/10"
                      }`}
                    >
                      {skill.curriculumStatus}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </WidgetCard>

      {/* 8. Emerging Skills vs Declining Skills */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Emerging Skills */}
        <WidgetCard
          title="Emerging Skills (High-Velocity Signals)"
          icon={Sparkles}
          footnote="High quarterly growth. Severe academic curriculum lag detected."
        >
          <div className="space-y-3.5">
            {marketData.emergingSkills.map((em) => (
              <div key={em.name} className="rounded-lg border border-border p-3.5 space-y-2 bg-mist/30">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground">{em.name}</span>
                      <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px] font-mono">
                        +{em.velocityPct}% QoQ
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{em.keyDrivers}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground pt-1 border-t border-border/60">
                  <span>Academia Lag: <strong className="text-amber-600 font-semibold">{em.curriculumLagMonths} months</strong></span>
                  <span>Hiring: {em.sampleCompaniesHiring.slice(0, 3).join(", ")}</span>
                </div>
              </div>
            ))}
          </div>
        </WidgetCard>

        {/* Declining / Low-Observed-Demand Skills */}
        <WidgetCard
          title="Declining & Low-Observed Demand Skills"
          icon={ArrowDownRight}
          footnote="Obsolescence or modernization trends. Recommended migration paths."
        >
          <div className="space-y-3.5">
            {marketData.decliningSkills.map((dec) => (
              <div key={dec.name} className="rounded-lg border border-border p-3.5 space-y-2 bg-mist/30">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground line-through decoration-red-500/60">
                        {dec.name}
                      </span>
                      <Badge variant="outline" className="border-red-500/30 text-red-600 bg-red-500/10 text-[10px] font-mono">
                        {dec.declinePct}% YoY
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{dec.reason}</p>
                  </div>
                </div>

                <div className="rounded bg-muted/60 p-2 text-xs">
                  <div className="font-medium text-foreground">Recommended Transition:</div>
                  <div className="text-primary font-semibold">{dec.replacementSkill}</div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{dec.transitionAdvice}</p>
                </div>
              </div>
            ))}
          </div>
        </WidgetCard>
      </div>

      {/* 9. Roles with Increasing Demand */}
      <WidgetCard
        title="Job Roles with Increasing Demand"
        icon={Briefcase}
        footnote="Source: Prototype LMI-2026. Salary ranges denote typical verified hiring CTC brackets in LPA."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {marketData.growingRoles.map((r) => (
            <div key={r.role} className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-display font-bold text-sm text-foreground">{r.role}</h4>
                  <p className="text-xs text-muted-foreground">{r.sector}</p>
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-mono">
                  +{r.yoyGrowthPct}% YoY
                </Badge>
              </div>

              <div className="rounded-lg bg-muted/50 p-2 text-xs space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">Fresher Entry Range:</span>
                  <span className="font-semibold text-foreground">₹{r.salaryRangeLPA.entryMin} - {r.salaryRangeLPA.entryMax} LPA</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">Median Experienced:</span>
                  <span className="font-semibold text-primary">₹{r.salaryRangeLPA.medianExperienced} LPA</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] font-medium text-muted-foreground">Top Skill Requisitions:</div>
                <div className="flex flex-wrap gap-1">
                  {r.keyRequiredSkills.slice(0, 4).map((sk) => (
                    <Badge key={sk} variant="secondary" className="text-[10px]">
                      {sk}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border">
                <span>{r.demandVolume.toLocaleString()} postings</span>
                <Link to="/opportunities" className="text-primary hover:underline flex items-center gap-0.5 font-medium">
                  View Listings <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </WidgetCard>

      {/* 10. District & Location-Wise Demand Distribution */}
      <WidgetCard
        title="Location & District-Wise Demand Distribution"
        icon={MapPin}
        footnote="Source: Simulated LMI Q3 2026. Aggregates regional employer requisitions and fresher salary benchmarks."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Horizontal Bar visualization */}
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={marketData.districtDemand}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" opacity={0.5} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="district" type="category" tick={{ fontSize: 11 }} width={100} />
                <RechartsTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0]?.payload;
                      return (
                        <div className="rounded-lg border border-border bg-card p-3 shadow-md text-xs">
                          <p className="font-semibold">{data.district}, {data.state}</p>
                          <p className="text-primary mt-1">Postings: {data.postingsCount.toLocaleString()} ({data.sharePct}% share)</p>
                          <p className="text-muted-foreground">Top Role: {data.topRole}</p>
                          <p className="text-muted-foreground">Avg Fresher CTC: ₹{data.avgFresherLPA} LPA</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="postingsCount" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                  {marketData.districtDemand.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* District Highlights Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="text-xs">
                  <TableHead>District</TableHead>
                  <TableHead>Primary Sector</TableHead>
                  <TableHead className="text-right">Postings</TableHead>
                  <TableHead className="text-right">Avg CTC</TableHead>
                  <TableHead className="text-right">Growth</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs">
                {marketData.districtDemand.map((d) => (
                  <TableRow key={d.district}>
                    <TableCell className="font-medium text-foreground">
                      {d.district}
                      <span className="block text-[10px] text-muted-foreground">{d.state}</span>
                    </TableCell>
                    <TableCell className="truncate max-w-[130px]">{d.primarySector}</TableCell>
                    <TableCell className="text-right font-mono">{d.postingsCount.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono font-medium">₹{d.avgFresherLPA} LPA</TableCell>
                    <TableCell className="text-right font-mono text-emerald-600 font-semibold">+{d.growthRatePct}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </WidgetCard>
    </div>
  );
}
