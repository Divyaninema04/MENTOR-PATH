import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users,
  Award,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Download,
  BookOpen,
  Filter,
  Sparkles,
  Info,
  Calendar,
  Layers,
  GraduationCap,
  ShieldCheck,
  Check,
  Send,
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
  RAW_TRAINER_INTELLIGENCE,
  type TrainerSkillPlanningItem,
} from "@/data/trainer-infrastructure-data";

export const Route = createFileRoute("/_authenticated/trainer-intelligence")({
  head: () => ({
    meta: [
      { title: "Trainer Intelligence & Faculty Planning | PlacementPilot" },
      {
        name: "description",
        content:
          "Faculty capacity planning across technical skills: Current trainer availability, required capacity, deficits, and recommended upskilling roadmaps.",
      },
    ],
  }),
  component: TrainerIntelligencePage,
});

export default function TrainerIntelligencePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredItems = useMemo(() => {
    return RAW_TRAINER_INTELLIGENCE.filter((item) => {
      const matchesCategory =
        selectedCategory === "ALL" || item.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        item.skillName.toLowerCase().includes(q) ||
        item.recommendedUpskillingAreas.some((a) => a.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Telemetry aggregates
  const totalCurrent = useMemo(
    () => RAW_TRAINER_INTELLIGENCE.reduce((s, i) => s + i.currentTrainersCount, 0),
    []
  );
  const totalRequired = useMemo(
    () => RAW_TRAINER_INTELLIGENCE.reduce((s, i) => s + i.requiredTrainersCount, 0),
    []
  );
  const totalGap = totalCurrent - totalRequired;
  const overallDeficitPct = Math.round((Math.abs(totalGap) / totalRequired) * 100);

  const handleLaunchToT = (skill: string) => {
    toast.success(`Scheduled Train-the-Trainer (ToT) certification cohort for ${skill}.`);
  };

  const handleExportReport = () => {
    toast.success("Exporting State Faculty Development & Trainer Intelligence Brief (PDF).");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Institutional Training Alignment
          </div>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight">
            Trainer Intelligence & Faculty Planning
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Regional faculty capacity planning across technical domains: evaluating current trainer availability vs. required instructional capacity, detecting deficits, and scheduling faculty development cohorts.
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
            Export FDP Plan (PDF)
          </Button>
          <Link to="/infrastructure-planning">
            <Button size="sm" className="gap-1.5 text-xs h-9 bg-primary text-primary-foreground">
              Infrastructure Planning <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* PROTOTYPE DATA DISCLOSURE BANNER */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Info className="h-4 w-4 shrink-0 text-amber-600" />
          <span>
            <strong>Prototype Data Notice:</strong> Faculty availability and required capacity models represent calibrated benchmark simulations based on AICTE faculty-student cadre ratios (1:20) and regional college surveys.
          </span>
        </div>
        <Badge variant="outline" className="text-[10px] font-mono border-amber-500/40 text-amber-700 dark:text-amber-300 shrink-0">
          Prototype Planning Dataset
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Current Trainer Availability"
          value={`${totalCurrent} Certified`}
          icon={Users}
          hint="Active qualified instructors across regional institutes"
        />
        <StatCard
          label="Required Trainer Capacity"
          value={`${totalRequired} Faculty`}
          icon={GraduationCap}
          hint="Required to satisfy 2026-27 student enrollment"
        />
        <StatCard
          label="Total Instructional Deficit"
          value={`${totalGap} Trainers`}
          icon={AlertTriangle}
          hint={`${overallDeficitPct}% net capacity shortfall across skills`}
        />
        <StatCard
          label="ToT Cohorts Needed"
          value="24 Cohorts"
          icon={Calendar}
          hint="4-week Train-the-Trainer fast-track programs"
        />
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground">Filter Category:</span>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-52 h-9 text-xs bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-xs">All Skill Categories</SelectItem>
              <SelectItem value="Core Technical" className="text-xs">Core Technical</SelectItem>
              <SelectItem value="Analytical & BI" className="text-xs">Analytical & BI</SelectItem>
              <SelectItem value="Cloud & Infrastructure" className="text-xs">Cloud & Infrastructure</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-xs text-muted-foreground">
          Showing <strong>{filteredItems.length}</strong> technical skill planning areas
        </div>
      </div>

      {/* SKILL-BY-SKILL TRAINER CAPACITY & GAP CARDS */}
      <div className="space-y-4">
        {filteredItems.map((item) => {
          const isCritical = item.urgencyLevel === "Critical Deficit";
          const ratioCoverage = Math.round(
            (item.currentTrainersCount / item.requiredTrainersCount) * 100
          );

          return (
            <div
              key={item.id}
              className={`rounded-2xl border bg-card p-6 shadow-xs space-y-5 transition-all ${
                isCritical ? "border-rose-500/30 hover:border-rose-500/50" : "border-border hover:border-primary/40"
              }`}
            >
              {/* Top Row: Skill & Capacity Telemetry */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-xl font-bold text-foreground">
                      {item.skillName}
                    </h3>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {item.category}
                    </Badge>
                    <Badge
                      className={`text-[10px] ${
                        isCritical
                          ? "bg-rose-500 text-white"
                          : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
                      }`}
                    >
                      {item.urgencyLevel}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Target Sector: <strong>{item.sector}</strong> • Ratio: ~{item.projectedStudentsPerTrainer} students per certified trainer
                  </p>
                </div>

                {/* Example format: SQL -> Current trainers: X | Required trainers: Y | Gap: Z */}
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border border-border bg-background p-3 text-center min-w-[100px]">
                    <span className="text-[10px] text-muted-foreground block">Current Trainers</span>
                    <span className="font-display text-xl font-bold text-foreground">
                      {item.currentTrainersCount}
                    </span>
                  </div>

                  <div className="rounded-xl border border-border bg-background p-3 text-center min-w-[100px]">
                    <span className="text-[10px] text-muted-foreground block">Required Capacity</span>
                    <span className="font-display text-xl font-bold text-primary">
                      {item.requiredTrainersCount}
                    </span>
                  </div>

                  <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-3 text-center min-w-[100px]">
                    <span className="text-[10px] text-rose-700 dark:text-rose-400 font-semibold block">
                      Capacity Gap
                    </span>
                    <span className="font-display text-xl font-extrabold text-rose-600">
                      {item.trainerGap}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleLaunchToT(item.skillName)}
                    className="h-9 text-xs gap-1.5 shrink-0 ml-2"
                  >
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    Launch ToT ({item.totDurationWeeks}w)
                  </Button>
                </div>
              </div>

              {/* Capacity Coverage Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    Instructional Readiness: <strong>{item.currentTrainersCount} of {item.requiredTrainersCount} trainers available</strong>
                  </span>
                  <span className="font-mono font-bold text-primary">
                    {ratioCoverage}% Capacity Covered ({item.deficitPercentage}% Shortfall)
                  </span>
                </div>
                <Progress value={ratioCoverage} className="h-2 bg-muted" />
              </div>

              {/* Recommended Upskilling Areas & Mandatory Certifications */}
              <div className="grid gap-4 md:grid-cols-2 pt-1">
                {/* Recommended Upskilling Areas */}
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" /> Recommended Faculty Upskilling Areas:
                  </span>
                  <ul className="space-y-1.5 pt-1">
                    {item.recommendedUpskillingAreas.map((area) => (
                      <li key={area} className="flex items-start gap-2 text-xs text-foreground">
                        <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mandatory Industry Certifications */}
                <div className="rounded-xl border border-border bg-background p-4 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-emerald-600" /> Mandatory Industry Certifications:
                  </span>
                  <ul className="space-y-1.5 pt-1">
                    {item.mandatoryCertifications.map((cert) => (
                      <li key={cert} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-medium text-foreground">{cert}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="text-[10px] text-muted-foreground pt-1 border-t border-border mt-2">
                    Requires <strong>{item.totCohortsNeeded} Train-the-Trainer (ToT) cohorts</strong> of {item.totDurationWeeks} weeks duration.
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
