import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Clock,
  ShieldAlert,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Search,
  Filter,
  BarChart3,
  ExternalLink,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Legend,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SectionHeader, StatCard, WidgetCard } from "@/components/widgets";
import {
  SKILL_TREND_DATASET,
  DATASET_PROVENANCE,
  type SkillClassification,
  type SkillEvidenceItem,
} from "@/data/market-intelligence-demo-data";

export const Route = createFileRoute("/_authenticated/emerging-skills")({
  head: () => ({
    meta: [
      { title: "Emerging Skills & Job Trends — PlacementPilot Intelligence" },
      {
        name: "description",
        content:
          "Evidence-based longitudinal skill trajectories: Emerging, Growing, Stable, and Declining observed demand trends with empirical evidence panels.",
      },
    ],
  }),
  component: EmergingSkillsJobTrendsPage,
});

export default function EmergingSkillsJobTrendsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkillForEvidence, setSelectedSkillForEvidence] = useState<SkillEvidenceItem | null>(null);

  // Filter skills
  const filteredSkills = useMemo(() => {
    return SKILL_TREND_DATASET.filter((skill) => {
      const matchesCategory =
        activeCategory === "All" || skill.classification === activeCategory;
      const matchesSearch =
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  // Aggregate trend trajectory over quarters across classifications
  const aggregateTrendChartData = useMemo(() => {
    const quarters = ["Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025", "Q1 2026", "Q2 2026", "Q3 2026"];
    return quarters.map((q) => {
      const emergingAvg = Math.round(
        SKILL_TREND_DATASET.filter((s) => s.classification === "Emerging")
          .map((s) => s.trendTimeline.find((t) => t.quarter === q)?.postings ?? 0)
          .reduce((a, b) => a + b, 0) / 4,
      );
      const growingAvg = Math.round(
        SKILL_TREND_DATASET.filter((s) => s.classification === "Growing")
          .map((s) => s.trendTimeline.find((t) => t.quarter === q)?.postings ?? 0)
          .reduce((a, b) => a + b, 0) / 4,
      );
      const stableAvg = Math.round(
        SKILL_TREND_DATASET.filter((s) => s.classification === "Stable")
          .map((s) => s.trendTimeline.find((t) => t.quarter === q)?.postings ?? 0)
          .reduce((a, b) => a + b, 0) / 3,
      );
      const decliningAvg = Math.round(
        SKILL_TREND_DATASET.filter((s) => s.classification === "Declining / Low observed demand")
          .map((s) => s.trendTimeline.find((t) => t.quarter === q)?.postings ?? 0)
          .reduce((a, b) => a + b, 0) / 5,
      );

      return {
        quarter: q,
        Emerging: emergingAvg,
        Growing: growingAvg,
        Stable: stableAvg,
        "Declining / Low Demand": decliningAvg,
      };
    });
  }, []);

  const countsByClass = useMemo(() => {
    return {
      emerging: SKILL_TREND_DATASET.filter((s) => s.classification === "Emerging").length,
      growing: SKILL_TREND_DATASET.filter((s) => s.classification === "Growing").length,
      stable: SKILL_TREND_DATASET.filter((s) => s.classification === "Stable").length,
      declining: SKILL_TREND_DATASET.filter((s) => s.classification === "Declining / Low observed demand").length,
    };
  }, []);

  // Badge styler based on evidence labels
  const getEvidenceBadge = (label: SkillEvidenceItem["evidenceLabel"]) => {
    switch (label) {
      case "Emerging":
        return <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px] font-mono">Emerging (+QoQ Surge)</Badge>;
      case "Growing":
        return <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30 text-[10px] font-mono">Growing (High Volume)</Badge>;
      case "Stable":
        return <Badge variant="outline" className="text-muted-foreground border-border text-[10px] font-mono">Stable (Bedrock)</Badge>;
      case "Declining observed demand":
        return <Badge variant="outline" className="border-amber-500/40 text-amber-700 dark:text-amber-300 bg-amber-500/10 text-[10px] font-mono">Declining observed demand</Badge>;
      case "Low observed demand":
        return <Badge variant="outline" className="border-orange-500/40 text-orange-700 dark:text-orange-300 bg-orange-500/10 text-[10px] font-mono">Low observed demand</Badge>;
      case "Curriculum review recommended":
        return <Badge variant="outline" className="border-red-500/40 text-red-700 dark:text-red-300 bg-red-500/10 text-[10px] font-mono">Curriculum review recommended</Badge>;
      default:
        return <Badge variant="secondary" className="text-[10px]">{label}</Badge>;
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-16">
      {/* 1. Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <span className="flex h-2 w-2 rounded-full bg-primary" />
            Market Intelligence
          </div>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Emerging Skills & Job Trends
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-3xl">
            Evidence-based longitudinal skill trajectories. Skills are classified strictly according to empirical
            recruitment requisitions rather than unverified assumptions.
          </p>
        </div>

        <Link to="/labour-market">
          <Button variant="outline" size="sm" className="gap-2 text-xs">
            Back to Labour Dashboard <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      {/* 2. Strict Evidence-Based Methodology Banner */}
      <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Info className="h-4 w-4 text-primary" />
          <span>Evidence-Based Classification Standards</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Technologies are <strong>never classified as &quot;obsolete&quot;</strong> based on subjective or AI-generated assumptions.
          Instead, we employ rigorously substantiated labels: <span className="font-semibold text-foreground">&quot;Low observed demand&quot;</span>,{" "}
          <span className="font-semibold text-foreground">&quot;Declining observed demand&quot;</span>, or{" "}
          <span className="font-semibold text-foreground">&quot;Curriculum review recommended&quot;</span>, backed by verifiable posting volumes,
          transition pathways, and quarterly hiring velocities.
        </p>
      </div>

      {/* 3. Summary Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Emerging Skills"
          value={countsByClass.emerging}
          icon={Sparkles}
          hint="Rapid inflection (+60% to +142% QoQ velocity)"
        />
        <StatCard
          label="Growing Competencies"
          value={countsByClass.growing}
          icon={TrendingUp}
          hint="Expanding mainstream demand (+20% to +45% YoY)"
        />
        <StatCard
          label="Stable Foundation Skills"
          value={countsByClass.stable}
          icon={CheckCircle2}
          hint="High-volume bedrock skills with steady replacement hiring"
        />
        <StatCard
          label="Declining / Low Demand"
          value={countsByClass.declining}
          icon={AlertTriangle}
          hint="Substantiated contractions with transition recommendations"
        />
      </div>

      {/* 4. Longitudinal Trend Charts Over Time */}
      <WidgetCard
        title="Skill Demand Trajectories Over Time (Quarterly Postings Index)"
        icon={TrendingUp}
        footnote="Source: Simulated LMI Q3 2026. Demonstrates relative normalized posting velocity across the 4 classification buckets from Q1 2025 to Q3 2026."
      >
        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={aggregateTrendChartData} margin={{ top: 10, right: 30, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
              <XAxis dataKey="quarter" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <RechartsTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border border-border bg-card p-3 shadow-md text-xs space-y-1">
                        <p className="font-bold border-b pb-1 text-foreground">{label} — Average Postings per Skill</p>
                        {payload.map((entry) => (
                          <div key={entry.name} className="flex justify-between gap-4">
                            <span style={{ color: entry.color }}>{entry.name}:</span>
                            <span className="font-mono font-semibold">{entry.value?.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
              <Line type="monotone" dataKey="Emerging" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="Growing" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Stable" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 2 }} />
              <Line type="monotone" dataKey="Declining / Low Demand" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </WidgetCard>

      {/* 5. Classification Filter Tabs & Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Classification Tabs */}
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full sm:w-auto">
            <TabsList className="h-auto flex-wrap justify-start gap-1 p-1 bg-muted/60">
              <TabsTrigger value="All" className="text-xs">
                All Skills ({SKILL_TREND_DATASET.length})
              </TabsTrigger>
              <TabsTrigger value="Emerging" className="text-xs data-[state=active]:text-emerald-700 dark:data-[state=active]:text-emerald-300">
                Emerging ({countsByClass.emerging})
              </TabsTrigger>
              <TabsTrigger value="Growing" className="text-xs data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-300">
                Growing ({countsByClass.growing})
              </TabsTrigger>
              <TabsTrigger value="Stable" className="text-xs data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-300">
                Stable ({countsByClass.stable})
              </TabsTrigger>
              <TabsTrigger value="Declining / Low observed demand" className="text-xs data-[state=active]:text-amber-700 dark:data-[state=active]:text-amber-300">
                Declining / Low Demand ({countsByClass.declining})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter by skill or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
        </div>

        {/* 6. Skills Grid with Explanation / Evidence Buttons */}
        <div className="grid gap-4 md:grid-cols-2">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs hover:border-primary/40 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {skill.category}
                      </Badge>
                      {getEvidenceBadge(skill.evidenceLabel)}
                    </div>
                    <h3 className="mt-2 font-display text-lg font-bold text-foreground">
                      {skill.name}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-sm font-bold text-foreground">
                      {skill.currentPostings.toLocaleString()}
                    </span>
                    <span className="block text-[10px] text-muted-foreground">observed postings</span>
                    <span className={`block font-mono text-xs font-semibold ${skill.yoyGrowthPct >= 0 ? "text-emerald-600" : "text-amber-600"}`}>
                      {skill.yoyGrowthPct >= 0 ? `+${skill.yoyGrowthPct}%` : `${skill.yoyGrowthPct}%`} YoY
                    </span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {skill.evidenceSummary}
                </p>

                {/* Replacement / Modern Transition Guidance */}
                {skill.replacementOrComplement && (
                  <div className="rounded-lg bg-muted/60 p-2.5 text-xs space-y-0.5">
                    <span className="font-semibold text-foreground text-[11px]">Recommended Modern Path:</span>
                    <p className="text-primary font-medium text-xs">{skill.replacementOrComplement}</p>
                  </div>
                )}
              </div>

              {/* Action: Open Evidence & Explanation Modal */}
              <div className="pt-3 border-t border-border flex items-center justify-between">
                <div className="text-[11px] text-muted-foreground">
                  Hiring: {skill.hiringSectors.map((s) => s.sector.split("&")[0]).slice(0, 2).join(", ")}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedSkillForEvidence(skill)}
                  className="h-7 text-xs gap-1 border-primary/30 text-primary hover:bg-primary/10"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  View Evidence Panel
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Dedicated Evidence & Explanation Panel (Modal/Dialog) */}
      <Dialog open={!!selectedSkillForEvidence} onOpenChange={(open) => !open && setSelectedSkillForEvidence(null)}>
        <DialogContent className="max-w-2xl">
          {selectedSkillForEvidence && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {selectedSkillForEvidence.category}
                  </Badge>
                  {getEvidenceBadge(selectedSkillForEvidence.evidenceLabel)}
                </div>
                <DialogTitle className="font-display text-2xl font-bold mt-2">
                  {selectedSkillForEvidence.name}
                </DialogTitle>
                <DialogDescription>
                  Empirical recruitment evidence, sectoral hiring distributions, and institutional recommendations.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 text-xs mt-2">
                {/* Quantitative Evidence Snapshot */}
                <div className="grid grid-cols-3 gap-3 rounded-xl border border-border bg-muted/30 p-3 text-center">
                  <div>
                    <span className="text-[11px] text-muted-foreground">Observed Requisitions</span>
                    <div className="font-display text-lg font-bold text-foreground mt-0.5">
                      {selectedSkillForEvidence.currentPostings.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground">YoY Trajectory</span>
                    <div className={`font-display text-lg font-bold mt-0.5 ${selectedSkillForEvidence.yoyGrowthPct >= 0 ? "text-emerald-600" : "text-amber-600"}`}>
                      {selectedSkillForEvidence.yoyGrowthPct >= 0 ? `+${selectedSkillForEvidence.yoyGrowthPct}%` : `${selectedSkillForEvidence.yoyGrowthPct}%`}
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground">Classification</span>
                    <div className="font-semibold text-foreground mt-1 truncate">
                      {selectedSkillForEvidence.classification}
                    </div>
                  </div>
                </div>

                {/* Direct Empirical Evidence Points */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-primary" /> Key Empirical Evidence Findings
                  </h4>
                  <ul className="space-y-1.5 list-disc pl-4 text-muted-foreground">
                    {selectedSkillForEvidence.evidencePoints.map((pt, idx) => (
                      <li key={idx}>{pt}</li>
                    ))}
                  </ul>
                </div>

                {/* Sectoral Distribution */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-foreground">Sectoral Hiring Distribution</h4>
                  <div className="space-y-1.5">
                    {selectedSkillForEvidence.hiringSectors.map((sec) => (
                      <div key={sec.sector} className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span>{sec.sector}</span>
                          <span className="font-semibold">{sec.pct}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div style={{ width: `${sec.pct}%` }} className="h-full bg-primary" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Curriculum / Learning Recommendation */}
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 space-y-1">
                  <div className="font-semibold text-primary">Academic Curriculum Action Note:</div>
                  <p className="text-muted-foreground">{selectedSkillForEvidence.curriculumAdvice}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
