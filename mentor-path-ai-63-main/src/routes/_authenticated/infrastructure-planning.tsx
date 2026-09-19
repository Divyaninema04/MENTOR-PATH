import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Laptop,
  Server,
  Wrench,
  Database,
  KeyRound,
  Download,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Info,
  Layers,
  Building2,
  DollarSign,
  ShieldCheck,
  Check,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatCard } from "@/components/widgets";
import {
  RAW_PROGRAMME_INFRASTRUCTURE_PLANS,
  type ProgrammeInfrastructurePlan,
  type EquipmentCategoryComparison,
} from "@/data/trainer-infrastructure-data";

export const Route = createFileRoute("/_authenticated/infrastructure-planning")({
  head: () => ({
    meta: [
      { title: "Infrastructure & Equipment Planning | PlacementPilot" },
      {
        name: "description",
        content:
          "Institutional lab hardware, software, cloud and database planning: Current infrastructure vs Recommended standards with explainable gap analysis.",
      },
    ],
  }),
  component: InfrastructurePlanningPage,
});

const PROGRAMME_OPTIONS = [
  "Data Analytics",
  "Cloud & DevOps Engineering",
  "Full-Stack Software Engineering",
];

export default function InfrastructurePlanningPage() {
  const [selectedProgramme, setSelectedProgramme] = useState<string>("Data Analytics");

  const plan: ProgrammeInfrastructurePlan = useMemo(() => {
    return (
      RAW_PROGRAMME_INFRASTRUCTURE_PLANS[selectedProgramme] ??
      RAW_PROGRAMME_INFRASTRUCTURE_PLANS["Data Analytics"]
    );
  }, [selectedProgramme]);

  const handleExportDPR = () => {
    toast.success(
      `Exporting Detailed Project Report (DPR) for ${plan.programmeName} Modernization (PDF).`
    );
  };

  const getCategoryIcon = (cat: EquipmentCategoryComparison["category"]) => {
    switch (cat) {
      case "Computer systems":
        return <Laptop className="h-4 w-4 text-primary" />;
      case "Software":
        return <Wrench className="h-4 w-4 text-emerald-600" />;
      case "Cloud labs":
        return <Server className="h-4 w-4 text-cyan-600" />;
      case "Database environments":
        return <Database className="h-4 w-4 text-indigo-600" />;
      case "Required licenses/tools":
        return <KeyRound className="h-4 w-4 text-amber-600" />;
      default:
        return <Laptop className="h-4 w-4 text-primary" />;
    }
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
            Infrastructure & Lab Equipment Planning
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Rigorous comparative analysis of physical laboratory computing environments: Current Infrastructure vs. Recommended Industry Standards across 5 core equipment categories with explainable gap diagnostics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportDPR}
            className="gap-1.5 text-xs h-9"
          >
            <Download className="h-3.5 w-3.5" />
            Export DPR Proposal (PDF)
          </Button>
          <Link to="/trainer-intelligence">
            <Button size="sm" className="gap-1.5 text-xs h-9 bg-primary text-primary-foreground">
              Trainer Intelligence <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Authority Banner */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Info className="h-4 w-4 shrink-0 text-primary" />
          <span>
            <strong>AICTE Lab Standards:</strong> Specifications calibrated against AICTE Model Curriculum Lab Manuals and Tier-1 employer campus screening benchmarks.
          </span>
        </div>
        <Badge variant="outline" className="text-[10px] font-mono border-primary/30 shrink-0">
          NSQF Level {plan.nsqfLevel} Laboratory Model
        </Badge>
      </div>

      {/* Programme Selector Bar */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            Target Training Programme
          </span>
          <div className="flex items-center gap-3">
            <Select value={selectedProgramme} onValueChange={setSelectedProgramme}>
              <SelectTrigger className="w-72 h-9 font-bold text-xs bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROGRAMME_OPTIONS.map((p) => (
                  <SelectItem key={p} value={p} className="text-xs font-semibold">
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge variant="outline" className="text-xs font-mono">
              Batch: {plan.typicalBatchSize} Workstations
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-border bg-background p-3 text-right">
            <span className="text-[10px] text-muted-foreground block">Estimated CapEx (30-Seat Lab):</span>
            <span className="font-display text-lg font-bold text-primary">
              {plan.totalEstimatedCapExInr}
            </span>
          </div>
          <div className="rounded-xl border border-border bg-background p-3 text-right">
            <span className="text-[10px] text-muted-foreground block">Annual Cloud & OpEx:</span>
            <span className="font-mono text-xs font-bold text-emerald-600">
              {plan.totalEstimatedOpExAnnualInr}
            </span>
          </div>
        </div>
      </div>

      {/* EXPLAINABLE INFRASTRUCTURE GAP CARD */}
      <div className="rounded-2xl border border-rose-500/30 bg-rose-500/[0.03] p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-600" />
            <h2 className="font-display text-base font-bold text-foreground">
              Explainable Infrastructure Gap Diagnostic
            </h2>
          </div>
          <Badge className="bg-rose-500 text-white text-[10px]">
            Pedagogical Impediment
          </Badge>
        </div>
        <p className="text-xs text-foreground leading-relaxed">
          {plan.explainableInfrastructureGap}
        </p>
      </div>

      {/* 5 CATEGORIES COMPARISON MATRIX: CURRENT VS RECOMMENDED */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            Infrastructure Comparison: Current vs. Recommended ({plan.categories.length} Categories)
          </h2>
          <span className="text-xs text-muted-foreground font-mono">
            Direct Equipment Mapping
          </span>
        </div>

        <div className="grid gap-5">
          {plan.categories.map((item, idx) => (
            <div
              key={item.category}
              className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4"
            >
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {idx + 1}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {getCategoryIcon(item.category)}
                    <h3 className="font-display font-bold text-base text-foreground">
                      {item.category}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={`text-[10px] ${
                      item.gapSeverity === "Critical Deficiency"
                        ? "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30"
                        : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
                    }`}
                  >
                    {item.gapSeverity}
                  </Badge>
                  <span className="font-mono text-xs font-bold text-foreground bg-muted/50 px-2 py-0.5 rounded border border-border">
                    {item.estimatedCostInr}
                  </span>
                </div>
              </div>

              {/* Side-by-Side: Current vs Recommended */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* CURRENT INFRASTRUCTURE */}
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 space-y-2 text-xs">
                  <span className="font-bold text-rose-700 dark:text-rose-400 block uppercase tracking-wider text-[10px]">
                    Current Laboratory Setup:
                  </span>
                  <p className="font-medium text-foreground">{item.currentInfrastructure}</p>
                  <div className="pt-2 border-t border-rose-500/20 text-[11px] text-muted-foreground">
                    <strong className="text-rose-600 block mb-0.5">Deficit Bottleneck:</strong>
                    {item.deficitDescription}
                  </div>
                </div>

                {/* RECOMMENDED INFRASTRUCTURE */}
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2 text-xs">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 block uppercase tracking-wider text-[10px]">
                    Recommended Industry Specification:
                  </span>
                  <p className="font-medium text-foreground">{item.recommendedInfrastructure}</p>
                  <div className="pt-2 border-t border-emerald-500/20 text-[11px] text-muted-foreground">
                    <strong className="text-emerald-600 block mb-0.5">Pedagogical Benefit:</strong>
                    {item.impactOnPedagogy}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
