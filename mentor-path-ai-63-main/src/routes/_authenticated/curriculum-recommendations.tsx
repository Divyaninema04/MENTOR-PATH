import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Sparkles,
  Building2,
  Clock,
  Download,
  Target,
  FileCheck,
  Zap,
  Info,
  ChevronDown,
  ChevronUp,
  Brain,
  ShieldCheck,
  Check,
  Filter,
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
  RAW_EXPLAINABLE_RECOMMENDATIONS,
  type ExplainableCurriculumRecommendation,
} from "@/data/training-alignment-demo-data";

export const Route = createFileRoute("/_authenticated/curriculum-recommendations")({
  head: () => ({
    meta: [
      { title: "Curriculum Recommendation Engine — Training Alignment" },
      {
        name: "description",
        content:
          "AI-synthesized actionable syllabus interventions generated automatically when skill gaps are detected, equipped with deep cognitive reasoning, market evidence, and assessment strategies.",
      },
    ],
  }),
  component: CurriculumRecommendationsEnginePage,
});

export default function CurriculumRecommendationsEnginePage() {
  const [selectedCourseName, setSelectedCourseName] = useState<string>("Data Analytics");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [expandedId, setExpandedId] = useState<string | null>("rec-da-001");
  const [adoptedRecommendations, setAdoptedRecommendations] = useState<Record<string, boolean>>({});

  // Filter recommendations by selected course
  const courseRecommendations = useMemo(() => {
    return RAW_EXPLAINABLE_RECOMMENDATIONS.filter(
      (r) => r.courseName === selectedCourseName
    );
  }, [selectedCourseName]);

  // Distinct detected gaps for the current course
  const currentDetectedGaps = useMemo(() => {
    if (courseRecommendations.length > 0) {
      return courseRecommendations[0].detectedGaps;
    }
    return ["SQL", "Power BI", "Applied Statistics"];
  }, [courseRecommendations]);

  // Apply priority filter
  const filteredRecommendations = useMemo(() => {
    return courseRecommendations.filter((r) => {
      if (priorityFilter === "ALL") return true;
      return r.priority.includes(priorityFilter);
    });
  }, [courseRecommendations, priorityFilter]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleAdopt = (id: string, title: string) => {
    setAdoptedRecommendations((prev) => ({ ...prev, [id]: !prev[id] }));
    if (!adoptedRecommendations[id]) {
      toast.success(`Intervention "${title}" adopted into Board of Studies Draft.`);
    } else {
      toast.info(`Intervention removed from Board draft.`);
    }
  };

  const handleExportPaper = () => {
    toast.success(`Exported Curriculum Action Paper for ${selectedCourseName} (PDF/DOCX)`);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <span className="flex h-2 w-2 rounded-full bg-primary" />
            Curriculum & Training Alignment
          </div>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight">
            Curriculum Recommendation Engine
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Automatic synthesis of actionable, evidence-driven syllabus interventions generated when market skill gaps are detected.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPaper}
            className="gap-1.5 text-xs h-9"
          >
            <Download className="h-3.5 w-3.5" />
            Export Action Paper
          </Button>
          <Link to="/curriculum-alignment">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs h-9">
              Curriculum Matrix <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <Link to="/course-health">
            <Button size="sm" className="gap-1.5 text-xs h-9 bg-primary text-primary-foreground">
              Course Health <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Provenance Disclosure */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Info className="h-4 w-4 shrink-0 text-primary" />
          <span>
            <strong>AI Pedagogical Explainer:</strong> Recommendations detail the causal educational rationale, market posting citations, and suggested learning rubrics to ensure full academic defensibility before Boards of Studies.
          </span>
        </div>
        <Badge variant="outline" className="text-[10px] font-mono border-primary/30 shrink-0">
          Source: Simulated LMI Q3 2026
        </Badge>
      </div>

      {/* COURSE SELECTOR & DETECTED GAPS BANNER */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
              Select Evaluated Course
            </label>
            <div className="flex items-center gap-3">
              <Select value={selectedCourseName} onValueChange={setSelectedCourseName}>
                <SelectTrigger className="w-72 h-10 font-bold text-sm bg-background">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Data Analytics" className="text-xs font-semibold">
                    Data Analytics (Standard Benchmark)
                  </SelectItem>
                  <SelectItem value="Full-Stack Software Engineering" className="text-xs font-semibold">
                    Full-Stack Software Engineering
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Detected Gaps Box (User's exact example requirement!) */}
          <div className="flex-1 max-w-xl rounded-xl border border-red-500/30 bg-red-500/5 p-3.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" /> Detected Syllabus Gaps
              </span>
              <span className="text-[10px] text-muted-foreground">
                Triggering automatic recommendations
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {currentDetectedGaps.map((gap) => (
                <Badge
                  key={gap}
                  className="bg-red-600 text-white font-mono text-[11px] px-2.5 py-0.5 shadow-xs"
                >
                  {gap} (Severe Deficit)
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* KPI METRICS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Generated Recommendations"
          value={`${courseRecommendations.length} Interventions`}
          icon={Lightbulb}
          hint={`Synthesized for ${selectedCourseName}`}
        />
        <StatCard
          label="Immediate Priorities"
          value="3 Interventions"
          icon={Sparkles}
          hint="Must adopt before next semester commences"
        />
        <StatCard
          label="Total Contact Hours"
          value="70 Hours"
          icon={Clock}
          hint="Hands-on laboratory practicals & capstone sessions"
        />
        <StatCard
          label="Advocating Tech Employers"
          value="18+ Recruiters"
          icon={Building2}
          hint="Requisitions explicitly confirming these competencies"
        />
      </div>

      {/* FILTER & ADOPTION PROGRESS BAR */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between rounded-xl border border-border bg-card p-4 shadow-xs">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-bold text-foreground">Filter Priority:</span>
          <div className="flex flex-wrap gap-1">
            {["ALL", "Immediate", "High", "Medium-Term"].map((p) => (
              <Button
                key={p}
                variant={priorityFilter === p ? "default" : "outline"}
                size="sm"
                onClick={() => setPriorityFilter(p)}
                className="text-xs h-7 px-2.5"
              >
                {p}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-muted-foreground">
            Adopted in Academic Dossier:{" "}
            <strong className="text-primary">
              {Object.values(adoptedRecommendations).filter(Boolean).length} of{" "}
              {courseRecommendations.length}
            </strong>
          </span>
        </div>
      </div>

      {/* ACTIONABLE RECOMMENDATIONS LIST (WITH EXPLANATION ACCORDIONS) */}
      <div className="space-y-4">
        {filteredRecommendations.map((rec, index) => {
          const isExpanded = expandedId === rec.id;
          const isAdopted = !!adoptedRecommendations[rec.id];

          return (
            <div
              key={rec.id}
              className={`rounded-2xl border transition-all shadow-xs ${
                isAdopted
                  ? "border-primary/50 bg-primary/[0.02]"
                  : "border-border bg-card hover:border-border/80"
              }`}
            >
              {/* Main Card Header */}
              <div
                className="p-5 sm:p-6 cursor-pointer space-y-3"
                onClick={() => toggleExpand(rec.id)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        rec.priority.includes("Immediate")
                          ? "bg-red-500/10 text-red-600 border-red-500/30"
                          : "bg-amber-500/10 text-amber-600 border-amber-500/30"
                      }`}
                    >
                      {rec.priority}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {rec.recommendationType}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Contact: <strong>{rec.suggestedContactHours} hours</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant={isAdopted ? "default" : "outline"}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAdopt(rec.id, rec.title);
                      }}
                      className="text-xs h-7 gap-1 px-3"
                    >
                      {isAdopted ? (
                        <>
                          <Check className="h-3.5 w-3.5" /> Adopted in Dossier
                        </>
                      ) : (
                        "Adopt into Dossier"
                      )}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">
                    {rec.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                    <strong>Reason:</strong> {rec.reason}
                  </p>
                </div>
              </div>

              {/* EXPANDED DEEP EXPLANATION & DETAIL ACCORDION */}
              {isExpanded && (
                <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-border/60 space-y-4 text-xs">
                  {/* AI Deep Explanation Callout */}
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                      <Brain className="h-4 w-4" />
                      AI Pedagogical Reasoning & Explanation
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 text-xs">
                      <div>
                        <span className="font-semibold text-foreground block mb-0.5">
                          Pedagogical Rationale:
                        </span>
                        <p className="text-muted-foreground leading-relaxed">
                          {rec.aiExplanation.pedagogicalRationale}
                        </p>
                      </div>
                      <div>
                        <span className="font-semibold text-foreground block mb-0.5">
                          Industry Deficit Context:
                        </span>
                        <p className="text-muted-foreground leading-relaxed">
                          {rec.aiExplanation.industryDeficitContext}
                        </p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-primary/20">
                      <span className="text-primary font-semibold block">
                        Implementation Contact Hours Roadmap:
                      </span>
                      <p className="text-muted-foreground mt-0.5">
                        {rec.aiExplanation.implementationRoadmap}
                      </p>
                    </div>
                  </div>

                  {/* Supporting Evidence & Related Roles */}
                  <div className="grid gap-3 sm:grid-cols-2 rounded-xl bg-muted/30 p-4">
                    <div>
                      <span className="font-semibold text-foreground block mb-1">
                        Supporting Labour Market Evidence:
                      </span>
                      <p className="text-primary font-medium leading-relaxed">
                        {rec.supportingMarketEvidence}
                      </p>
                    </div>

                    <div>
                      <span className="font-semibold text-foreground block mb-1">
                        Related Target Industry Roles:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {rec.relatedRoles.map((role) => (
                          <Badge key={role} variant="outline" className="text-[10px] bg-background">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Suggested Learning Outcome & Assessment Strategy */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-border bg-card p-3.5 space-y-1">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <Target className="h-3.5 w-3.5 text-primary" /> Suggested Learning Outcome
                      </span>
                      <p className="text-muted-foreground text-[11px] leading-relaxed">
                        {rec.suggestedLearningOutcome}
                      </p>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-3.5 space-y-1">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <FileCheck className="h-3.5 w-3.5 text-primary" /> Suggested Practical Assessment Strategy
                      </span>
                      <p className="text-muted-foreground text-[11px] leading-relaxed">
                        {rec.suggestedAssessment}
                      </p>
                    </div>
                  </div>

                  {/* Advocating Employers */}
                  <div className="pt-2 border-t border-border flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-muted-foreground">Advocating Employers:</span>
                      {rec.advocatingEmployers.map((emp) => (
                        <Badge key={emp} variant="secondary" className="text-[10px]">
                          {emp}
                        </Badge>
                      ))}
                    </div>
                    <span className="font-mono text-muted-foreground">
                      Dossier ID: {rec.id}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
