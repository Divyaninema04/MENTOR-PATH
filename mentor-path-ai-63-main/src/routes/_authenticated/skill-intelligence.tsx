import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Brain,
  Layers,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Search,
  ArrowRight,
  Filter,
  ShieldAlert,
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, Cell } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SectionHeader, StatCard, WidgetCard } from "@/components/widgets";
import { supabase } from "@/integrations/supabase/client";
import {
  RAW_DEMANDED_SKILLS,
  DATASET_PROVENANCE,
  type DemandedSkill,
} from "@/data/market-intelligence-demo-data";

export const Route = createFileRoute("/_authenticated/skill-intelligence")({
  head: () => ({
    meta: [
      { title: "Skill Intelligence — PlacementPilot" },
      {
        name: "description",
        content: "Deep analysis of demanded competencies, curriculum alignment gaps, and proficiency distributions across industry roles.",
      },
    ],
  }),
  component: SkillIntelligencePage,
});

export default function SkillIntelligencePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const profileQuery = useQuery({
    queryKey: ["profile", "skill-intelligence"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return null;
      const { data } = await supabase.from("profiles").select("skills").eq("id", u.user.id).maybeSingle();
      return data;
    },
  });

  const studentSkills = useMemo(() => {
    return new Set((profileQuery.data?.skills ?? ["Python", "SQL", "React"]).map((s) => s.toLowerCase()));
  }, [profileQuery.data]);

  const categories = useMemo(() => {
    const set = new Set(RAW_DEMANDED_SKILLS.map((s) => s.category));
    return ["All", ...Array.from(set)];
  }, []);

  const filteredSkills = useMemo(() => {
    return RAW_DEMANDED_SKILLS.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || s.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const severeGapCount = RAW_DEMANDED_SKILLS.filter((s) => s.curriculumStatus === "Severe Curriculum Gap").length;

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <span className="flex h-2 w-2 rounded-full bg-primary" />
            Market Intelligence
          </div>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight">
            Skill Intelligence & Competency Mapping
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Evidence-backed skill demand signals, proficiency ladders, and curriculum coverage metrics.
          </p>
        </div>
        <Link to="/labour-market">
          <Button variant="outline" size="sm" className="gap-2 text-xs">
            Back to Labour Dashboard <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      {/* Prototype notice */}
      <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-800 dark:text-amber-200">
        <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <span>
          <strong>Prototype Data Layer:</strong> Sourced from {DATASET_PROVENANCE.datasetName}. Replaced dynamically when verified API feeds are connected.
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Tracked Skill Signals" value={RAW_DEMANDED_SKILLS.length} icon={Brain} hint="Core technical competencies actively monitored" />
        <StatCard label="Severe Curriculum Gaps" value={severeGapCount} icon={AlertCircle} hint="Skills with high demand but absent from standard curricula" />
        <StatCard label="Top Demand Share" value="32.3%" icon={TrendingUp} hint="Data Structures & Algorithmic Problem Solving" />
        <StatCard label="Fastest Surging Skill" value="+47.8%" icon={Sparkles} hint="Go (Golang) for cloud native & microservices" />
      </div>

      {/* Search and Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between rounded-xl border border-border bg-card p-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search skills, frameworks, tools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="text-xs h-8"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <WidgetCard
        title="Comprehensive Skill Demand & Curriculum Lag Matrix"
        icon={Layers}
        footnote="Source: Simulated LMI Q3 2026. Student match status derived from your profile's listed skills."
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead>Skill Name</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead className="text-right">Market Postings</TableHead>
                <TableHead className="text-right">Share %</TableHead>
                <TableHead className="text-right">YoY Velocity</TableHead>
                <TableHead>Curriculum Status</TableHead>
                <TableHead>Your Profile Match</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {filteredSkills.map((skill) => {
                const isMatched = studentSkills.has(skill.name.toLowerCase());
                return (
                  <TableRow key={skill.name}>
                    <TableCell className="font-semibold text-foreground">
                      {skill.name}
                      <span className="block text-[11px] text-muted-foreground font-normal">
                        Associated with: {skill.associatedRoles.slice(0, 2).join(", ")}
                      </span>
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
                    <TableCell>
                      {isMatched ? (
                        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px]">
                          ✓ Tracked
                        </Badge>
                      ) : (
                        <Link to="/career">
                          <Button size="sm" variant="ghost" className="h-6 text-[10px] text-primary p-0">
                            + Add to Roadmap
                          </Button>
                        </Link>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </WidgetCard>
    </div>
  );
}
