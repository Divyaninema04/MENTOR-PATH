import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MapPin,
  TrendingUp,
  Building2,
  Briefcase,
  ShieldCheck,
  Award,
  BookOpen,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Search,
  SlidersHorizontal,
  Layers,
  Info,
  Sparkles,
  Compass,
  Check,
  Clock,
  ChevronRight,
  ExternalLink,
  GraduationCap,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatCard } from "@/components/widgets";
import {
  STATE_OPTIONS,
  DISTRICTS_BY_STATE,
  SECTORS_BY_DISTRICT,
  ROLES_BY_SECTOR,
  MAHARASHTRA_DISTRICT_MAP,
  getDistrictSkillIntelligence,
  type DistrictGeoPoint,
} from "@/data/district-skill-intelligence-data";

export const Route = createFileRoute("/_authenticated/district-skill-map")({
  head: () => ({
    meta: [
      { title: "District Skill Map — Regional LMI & Institutional Intelligence" },
      {
        name: "description",
        content:
          "Granular district-level labour market intelligence: Demand, Top skills, Emerging skills, Available courses, Capacity, Curriculum gaps, Employer validation, and Skill shortages.",
      },
    ],
  }),
  component: DistrictSkillMapPage,
});

export default function DistrictSkillMapPage() {
  // 4-Step Hierarchical Drilldown State (Default benchmark: Maharashtra -> Pune -> IT -> Data Analytics)
  const [selectedState, setSelectedState] = useState<string>("Maharashtra");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Pune");
  const [selectedSector, setSelectedSector] = useState<string>("IT & Software Services");
  const [selectedRole, setSelectedRole] = useState<string>("Data Analytics");

  // Hover state for interactive SVG map
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictGeoPoint | null>(null);

  // Compute available districts based on state
  const availableDistricts = useMemo(() => {
    return DISTRICTS_BY_STATE[selectedState] ?? ["Pune", "Mumbai Suburban"];
  }, [selectedState]);

  // Compute available sectors based on district
  const availableSectors = useMemo(() => {
    return SECTORS_BY_DISTRICT[selectedDistrict] ?? [
      "IT & Software Services",
      "Banking, Financial Services & FinTech (BFSI)",
      "Automotive, EV & CleanTech",
    ];
  }, [selectedDistrict]);

  // Compute available roles based on sector
  const availableRoles = useMemo(() => {
    return ROLES_BY_SECTOR[selectedSector] ?? [
      "Data Analytics",
      "Full Stack Developer",
      "Cloud & DevOps Engineer",
    ];
  }, [selectedSector]);

  // Handle cascading state changes
  const handleStateChange = (st: string) => {
    setSelectedState(st);
    const firstDistrict = (DISTRICTS_BY_STATE[st] ?? ["Pune"])[0];
    setSelectedDistrict(firstDistrict);
    const firstSector = (SECTORS_BY_DISTRICT[firstDistrict] ?? ["IT & Software Services"])[0];
    setSelectedSector(firstSector);
    const firstRole = (ROLES_BY_SECTOR[firstSector] ?? ["Data Analytics"])[0];
    setSelectedRole(firstRole);
  };

  const handleDistrictChange = (dist: string) => {
    setSelectedDistrict(dist);
    const available = SECTORS_BY_DISTRICT[dist] ?? ["IT & Software Services"];
    if (!available.includes(selectedSector)) {
      setSelectedSector(available[0]);
      const roles = ROLES_BY_SECTOR[available[0]] ?? ["Data Analytics"];
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

  // Fetch full 8-dimensional intelligence record
  const intel = useMemo(() => {
    return getDistrictSkillIntelligence(
      selectedState,
      selectedDistrict,
      selectedSector,
      selectedRole
    );
  }, [selectedState, selectedDistrict, selectedSector, selectedRole]);

  // Quick reset to benchmark
  const handleResetToBenchmark = () => {
    setSelectedState("Maharashtra");
    setSelectedDistrict("Pune");
    setSelectedSector("IT & Software Services");
    setSelectedRole("Data Analytics");
    toast.success("Loaded benchmark: Maharashtra → Pune → IT → Data Analytics");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <span className="flex h-2 w-2 rounded-full bg-primary" />
            District Intelligence
          </div>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight">
            District Skill Map & Talent Intelligence
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Granular district intelligence analyzing localized demand velocity, curriculum coverage, institutional capacity, and employer-validated skill shortages.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetToBenchmark}
            className="gap-1.5 text-xs h-9"
          >
            <Compass className="h-3.5 w-3.5" />
            Load Pune Data Analytics Benchmark
          </Button>
          <Link
            to="/district-training-planner"
            search={{ district: selectedDistrict, sector: selectedSector, role: selectedRole }}
          >
            <Button size="sm" className="gap-1.5 text-xs h-9 bg-primary text-primary-foreground">
              District Training Planner <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Provenance Disclosure Banner */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Info className="h-4 w-4 shrink-0 text-primary" />
          <span>
            <strong>Regional Intelligence Methodology:</strong> Synthesizes real-time district vacancy telemetry, AICTE & DTE annual capacity statistics, university syllabus audits, and local employer consortium validation.
          </span>
        </div>
        <Badge variant="outline" className="text-[10px] font-mono border-primary/30 shrink-0">
          State LMI Census Q3 2026
        </Badge>
      </div>

      {/* ======================================================== */}
      {/* HIERARCHICAL DRILLDOWN TOOLBAR: State -> District -> Sector -> Role */}
      {/* ======================================================== */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
            Hierarchical Drilldown Selector
          </span>
          <div className="flex items-center gap-1 font-mono text-[11px] text-primary bg-primary/10 px-2.5 py-0.5 rounded-full font-bold">
            <span>{selectedState}</span>
            <ChevronRight className="h-3 w-3" />
            <span>{selectedDistrict}</span>
            <ChevronRight className="h-3 w-3" />
            <span>{selectedSector.split(" ")[0]}</span>
            <ChevronRight className="h-3 w-3" />
            <span>{selectedRole}</span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* 1. STATE */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">1. State</label>
            <Select value={selectedState} onValueChange={handleStateChange}>
              <SelectTrigger className="h-9 text-xs bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATE_OPTIONS.map((st) => (
                  <SelectItem key={st} value={st} className="text-xs font-medium">
                    {st}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 2. DISTRICT */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">2. District</label>
            <Select value={selectedDistrict} onValueChange={handleDistrictChange}>
              <SelectTrigger className="h-9 text-xs bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableDistricts.map((dst) => (
                  <SelectItem key={dst} value={dst} className="text-xs font-medium">
                    {dst}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 3. SECTOR */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">3. Sector</label>
            <Select value={selectedSector} onValueChange={handleSectorChange}>
              <SelectTrigger className="h-9 text-xs bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableSectors.map((sec) => (
                  <SelectItem key={sec} value={sec} className="text-xs font-medium">
                    {sec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 4. ROLE */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">4. Role</label>
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
      {/* INTERACTIVE MAHARASHTRA DISTRICT MAP & SUMMARY */}
      {/* ======================================================== */}
      {selectedState === "Maharashtra" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <h2 className="font-display text-lg font-bold text-foreground">
                  Interactive Maharashtra Regional Skill Map
                </h2>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Click any district on the map to immediately recalibrate local demand, curriculum gaps, and training capacity.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                <span className="text-[11px] text-muted-foreground">Severe Shortage (&gt;70%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                <span className="text-[11px] text-muted-foreground">High Shortage (40-70%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] text-muted-foreground">Balanced</span>
              </span>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 items-center">
            {/* SVG Visual Map */}
            <div className="lg:col-span-2 relative bg-background/50 rounded-xl border border-border p-4 flex items-center justify-center">
              <svg
                viewBox="120 80 540 420"
                className="w-full h-80 max-h-[380px] drop-shadow-sm select-none"
              >
                {/* SVG Districts */}
                {MAHARASHTRA_DISTRICT_MAP.map((geo) => {
                  const isSelected = selectedDistrict.toLowerCase().includes(geo.name.toLowerCase());
                  const isHovered = hoveredDistrict?.id === geo.id;

                  // District shortage coloring
                  const isHighDemand = geo.name === "Pune" || geo.name.includes("Mumbai");
                  const fillClass = isSelected
                    ? "fill-primary stroke-primary stroke-2"
                    : isHighDemand
                    ? "fill-rose-500/25 stroke-rose-500/70 hover:fill-rose-500/40"
                    : "fill-amber-500/20 stroke-amber-500/60 hover:fill-amber-500/35";

                  return (
                    <g
                      key={geo.id}
                      className="cursor-pointer transition-all duration-200"
                      onClick={() => handleDistrictChange(geo.name)}
                      onMouseEnter={() => setHoveredDistrict(geo)}
                      onMouseLeave={() => setHoveredDistrict(null)}
                    >
                      <path
                        d={geo.svgPath}
                        className={`${fillClass} stroke-1 transition-all`}
                      />
                      <text
                        x={geo.cx}
                        y={geo.cy}
                        textAnchor="middle"
                        className={`text-[10px] font-sans font-bold pointer-events-none ${
                          isSelected
                            ? "fill-primary-foreground font-black"
                            : "fill-foreground/80 dark:fill-white/80"
                        }`}
                      >
                        {geo.name}
                      </text>
                      <text
                        x={geo.cx}
                        y={geo.cy + 11}
                        textAnchor="middle"
                        className={`text-[8px] pointer-events-none ${
                          isSelected
                            ? "fill-primary-foreground/80"
                            : "fill-muted-foreground"
                        }`}
                      >
                        {geo.marathiName}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Hover Overlay Card */}
              {hoveredDistrict && (
                <div className="absolute bottom-3 left-3 bg-card/95 border border-border backdrop-blur-md rounded-xl p-3 shadow-lg text-xs space-y-1 max-w-[240px] pointer-events-none animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">{hoveredDistrict.name}</span>
                    <Badge variant="outline" className="text-[9px]">
                      {hoveredDistrict.region}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Hubs: {hoveredDistrict.primaryHubs.slice(0, 2).join(", ")}
                  </p>
                  <span className="text-[10px] text-primary font-semibold block">
                    Click to load full intelligence
                  </span>
                </div>
              )}
            </div>

            {/* Selected District Quick Profile */}
            <div className="space-y-3.5 bg-background rounded-xl border border-border p-4 text-xs">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Selected Administrative District:
                  </span>
                  <h3 className="font-display text-2xl font-black text-foreground">
                    {selectedDistrict}
                  </h3>
                  <span className="text-muted-foreground">
                    State of {selectedState} • {intel.sector}
                  </span>
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                  {intel.skillShortages.shortageLevel}
                </Badge>
              </div>

              <div className="space-y-2 pt-1 border-t border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Role Postings:</span>
                  <span className="font-mono font-bold text-foreground">
                    {intel.demand.activePostingsCount.toLocaleString()} Vacancies
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">YoY Growth Velocity:</span>
                  <span className="font-mono font-bold text-emerald-600">
                    +{intel.demand.yoyGrowthRatePct}% YoY
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Annual Institutional Deficit:</span>
                  <span className="font-mono font-bold text-rose-600">
                    {intel.skillShortages.netDeficitCount.toLocaleString()} Seats
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shortage Index:</span>
                  <span className="font-mono font-bold text-primary">
                    {intel.skillShortages.shortageIndexPct}% Deficit
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Primary Regional Employment Corridors:
                </span>
                <div className="flex flex-wrap gap-1">
                  {intel.demand.topHiringHubs.map((hub) => (
                    <Badge key={hub} variant="secondary" className="text-[10px]">
                      {hub}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 8 CORE TELEMETRY INDICATORS BENTO GRID */}
      {/* ======================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            District Telemetry: {selectedDistrict} ({selectedRole})
          </h2>
          <span className="text-xs text-muted-foreground font-mono">
            Last Evaluated: {intel.lastUpdated}
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* 1. DEMAND */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                    1
                  </span>
                  <h3 className="font-display font-bold text-sm text-foreground">
                    Market Demand
                  </h3>
                </div>
                <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px]">
                  +{intel.demand.yoyGrowthRatePct}% YoY
                </Badge>
              </div>

              <div className="pt-1">
                <span className="font-display text-3xl font-black text-foreground block">
                  {intel.demand.activePostingsCount.toLocaleString()}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Active {selectedRole} Postings in {selectedDistrict}
                </span>
              </div>

              <div className="space-y-1.5 text-xs pt-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fresher Salary:</span>
                  <span className="font-mono font-bold text-primary">
                    ₹{intel.demand.avgFresherSalaryLpa} LPA Avg
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border text-[11px] text-muted-foreground">
              <span className="font-semibold text-foreground block mb-0.5">Top Recruiters:</span>
              <p className="line-clamp-2">{intel.demand.topRecruiters.join(", ")}</p>
            </div>
          </div>

          {/* 2. TOP SKILLS */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                    2
                  </span>
                  <h3 className="font-display font-bold text-sm text-foreground">
                    Top Required Skills
                  </h3>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  Core Filters
                </Badge>
              </div>

              <div className="space-y-2 pt-1">
                {intel.topSkills.slice(0, 3).map((sk) => (
                  <div key={sk.skill} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-foreground truncate max-w-[170px]">
                        {sk.skill}
                      </span>
                      <span className="font-mono font-bold text-primary">
                        {sk.marketWeightPct}%
                      </span>
                    </div>
                    <Progress value={sk.marketWeightPct} className="h-1.5" />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-border text-[10px] text-muted-foreground">
              <strong>Consensus:</strong> {intel.topSkills[0]?.employerConsensusPct}% of local recruiters test {intel.topSkills[0]?.skill.split(" ")[0]} in Round 1.
            </div>
          </div>

          {/* 3. EMERGING SKILLS */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-[11px] font-bold text-emerald-600">
                    3
                  </span>
                  <h3 className="font-display font-bold text-sm text-foreground">
                    Emerging Skills
                  </h3>
                </div>
                <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px]">
                  Surging
                </Badge>
              </div>

              <div className="space-y-2 pt-1">
                {intel.emergingSkills.slice(0, 2).map((em) => (
                  <div key={em.skill} className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-2 space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-foreground text-[11px]">{em.skill}</span>
                      <span className="font-mono font-bold text-emerald-600 text-[11px]">
                        +{em.growthSurgePct}%
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground block line-clamp-1">
                      {em.driver}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-border text-[10px] text-muted-foreground">
              <strong>Horizon:</strong> Projected to enter core interview filters in 6-12 months.
            </div>
          </div>

          {/* 4. TRAINING CAPACITY */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                    4
                  </span>
                  <h3 className="font-display font-bold text-sm text-foreground">
                    Training Capacity
                  </h3>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {intel.trainingCapacity.totalInstitutesCount} Colleges
                </Badge>
              </div>

              <div className="pt-1">
                <span className="font-display text-3xl font-black text-foreground block">
                  {intel.trainingCapacity.annualIntakeSeats.toLocaleString()}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Annual Accredited Intake Seats
                </span>
              </div>

              <div className="space-y-1 text-xs pt-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Work-Ready Graduates:</span>
                  <span className="font-mono font-bold text-foreground">
                    {intel.trainingCapacity.annualWorkReadyGraduates.toLocaleString()} / Yr
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Capacity Utilization:</span>
                  <span className="font-mono font-bold text-emerald-600">
                    {intel.trainingCapacity.capacityUtilizationPct}%
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border text-[10px] text-muted-foreground">
              DTE & AICTE verified enrollment quota across {selectedDistrict}.
            </div>
          </div>
        </div>

        {/* SECOND ROW OF 4 TELEMETRY CARDS */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* 5. AVAILABLE COURSES */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                    5
                  </span>
                  <h3 className="font-display font-bold text-sm text-foreground">
                    Available Courses
                  </h3>
                </div>
                <Badge variant="secondary" className="text-[10px]">
                  {intel.availableCourses.length} Degree / Diplomas
                </Badge>
              </div>

              <div className="space-y-2 pt-1">
                {intel.availableCourses.slice(0, 3).map((crs) => (
                  <div key={crs.id} className="rounded-lg bg-background border border-border p-2 space-y-0.5 text-xs">
                    <span className="font-bold text-foreground block truncate">
                      {crs.courseName}
                    </span>
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span className="truncate max-w-[130px]">{crs.institution}</span>
                      <span className="font-mono font-semibold text-primary">{crs.placementClearanceRatePct}% Place</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-border text-[10px] text-muted-foreground">
              Accredited universities and autonomous colleges in {selectedDistrict}.
            </div>
          </div>

          {/* 6. CURRICULUM GAPS */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/15 text-[11px] font-bold text-rose-600">
                    6
                  </span>
                  <h3 className="font-display font-bold text-sm text-foreground">
                    Curriculum Gaps
                  </h3>
                </div>
                <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30 text-[10px]">
                  {intel.curriculumGaps[0]?.gapSeverity ?? "Critical"}
                </Badge>
              </div>

              <div className="space-y-2 pt-1 text-xs">
                {intel.curriculumGaps.slice(0, 2).map((gap) => (
                  <div key={gap.skill} className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-2 space-y-1">
                    <span className="font-bold text-rose-700 dark:text-rose-400 block text-[11px]">
                      {gap.skill}
                    </span>
                    <p className="text-[10px] text-muted-foreground line-clamp-2">
                      {gap.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-border text-[10px] text-muted-foreground">
              Syllabus deficit detected against active recruitment rubrics.
            </div>
          </div>

          {/* 7. EMPLOYER VALIDATION */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                    7
                  </span>
                  <h3 className="font-display font-bold text-sm text-foreground">
                    Employer Validation
                  </h3>
                </div>
                <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px]">
                  {intel.employerValidation.consensusRatePct}% Consensus
                </Badge>
              </div>

              <div className="pt-1">
                <span className="font-display text-3xl font-black text-foreground block">
                  {intel.employerValidation.validatedEmployersCount}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Vetted Employers Validating Skills in {selectedDistrict}
                </span>
              </div>

              <div className="space-y-1 text-xs pt-1">
                <span className="font-bold text-foreground block text-[11px]">
                  Mandatory Prerequisite:
                </span>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  "{intel.employerValidation.topValidatedPrerequisite}"
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-border text-[10px] text-muted-foreground">
              Direct telemetry from regional campus recruitment panels.
            </div>
          </div>

          {/* 8. SKILL SHORTAGES */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/15 text-[11px] font-bold text-rose-600">
                    8
                  </span>
                  <h3 className="font-display font-bold text-sm text-foreground">
                    Skill Shortage Deficit
                  </h3>
                </div>
                <Badge className="bg-rose-500 text-white text-[10px]">
                  {intel.skillShortages.shortageIndexPct}% Deficit
                </Badge>
              </div>

              <div className="pt-1">
                <span className="font-display text-3xl font-black text-rose-600 block">
                  -{intel.skillShortages.netDeficitCount.toLocaleString()}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Annual Qualified Candidate Shortfall
                </span>
              </div>

              <div className="space-y-1 text-xs pt-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Annual Demand:</span>
                  <span className="font-mono font-bold text-foreground">
                    {intel.skillShortages.annualMarketRequisitions.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Qualified Supply:</span>
                  <span className="font-mono font-bold text-emerald-600">
                    {intel.skillShortages.annualQualifiedGraduates.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border text-[10px] text-muted-foreground">
              Market deficit calculated against verified graduate placement clearance.
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* PROFESSIONAL DISTRICT SELECTOR & COMPARATIVE TABLE */}
      {/* ======================================================== */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
          <div>
            <h3 className="font-display text-base font-bold text-foreground">
              Maharashtra Regional District Skill Shortage Benchmark ({MAHARASHTRA_DISTRICT_MAP.length} Districts)
            </h3>
            <p className="text-xs text-muted-foreground">
              Comparative analysis of technical hiring velocity, institutional intake capacity, and net graduate deficits across Maharashtra.
            </p>
          </div>
          <Link
            to="/district-training-planner"
            search={{ district: selectedDistrict, sector: selectedSector, role: selectedRole }}
          >
            <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8">
              Open Training Planner <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="text-xs font-bold">District</TableHead>
                <TableHead className="text-xs font-bold">Region</TableHead>
                <TableHead className="text-xs font-bold text-right">Active Postings</TableHead>
                <TableHead className="text-xs font-bold text-right">Hiring Growth</TableHead>
                <TableHead className="text-xs font-bold text-right">College Capacity</TableHead>
                <TableHead className="text-xs font-bold text-right">Net Deficit</TableHead>
                <TableHead className="text-xs font-bold">Shortage Status</TableHead>
                <TableHead className="text-xs font-bold text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MAHARASHTRA_DISTRICT_MAP.map((geo) => {
                const distIntel = getDistrictSkillIntelligence(
                  "Maharashtra",
                  geo.name,
                  selectedSector,
                  selectedRole
                );
                const isCurrent = selectedDistrict.toLowerCase().includes(geo.name.toLowerCase());

                return (
                  <TableRow
                    key={geo.id}
                    className={`cursor-pointer transition-colors ${
                      isCurrent ? "bg-primary/5 font-semibold" : "hover:bg-muted/30"
                    }`}
                    onClick={() => handleDistrictChange(geo.name)}
                  >
                    <TableCell className="text-xs font-bold text-foreground">
                      <div className="flex items-center gap-1.5">
                        <MapPin className={`h-3.5 w-3.5 ${isCurrent ? "text-primary" : "text-muted-foreground"}`} />
                        <span>{geo.name}</span>
                        <span className="text-[10px] text-muted-foreground font-normal">
                          ({geo.marathiName})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {geo.region}
                    </TableCell>
                    <TableCell className="text-xs font-mono font-bold text-right">
                      {distIntel.demand.activePostingsCount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-xs font-mono text-emerald-600 font-bold text-right">
                      +{distIntel.demand.yoyGrowthRatePct}%
                    </TableCell>
                    <TableCell className="text-xs font-mono text-right text-muted-foreground">
                      {distIntel.trainingCapacity.annualIntakeSeats.toLocaleString()} seats
                    </TableCell>
                    <TableCell className="text-xs font-mono font-bold text-rose-600 text-right">
                      -{distIntel.skillShortages.netDeficitCount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-xs">
                      <Badge
                        className={`text-[9px] ${
                          distIntel.skillShortages.shortageIndexPct > 70
                            ? "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30"
                            : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
                        }`}
                      >
                        {distIntel.skillShortages.shortageLevel}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant={isCurrent ? "default" : "ghost"}
                        className="h-7 text-[11px] px-2.5"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDistrictChange(geo.name);
                        }}
                      >
                        {isCurrent ? "Active" : "Inspect"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
