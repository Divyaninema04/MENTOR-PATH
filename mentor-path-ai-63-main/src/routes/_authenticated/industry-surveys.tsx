import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ClipboardCheck,
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
  Download,
  BarChart3,
  Calendar,
  Layers,
  Sparkles,
  Info,
  Check,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Plus,
  Send,
  SlidersHorizontal,
  Wrench,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  Award,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatCard } from "@/components/widgets";
import {
  RAW_INDUSTRY_SURVEYS,
  RAW_STRUCTURED_SURVEY_SUBMISSIONS,
  computeSurveyAnalytics,
  type IndustrySurveyCampaign,
  type StructuredSurveySubmission,
  type ExpectedProficiency,
} from "@/data/industry-validation-demo-data";

export const Route = createFileRoute("/_authenticated/industry-surveys")({
  head: () => ({
    meta: [
      { title: "Industry Skill Surveys & Admin Analytics — Industry Section" },
      {
        name: "description",
        content:
          "Structured empirical employer surveys assessing required, emerging, and declining skills, expected proficiency levels, and entry-level role demand.",
      },
    ],
  }),
  component: IndustrySurveysPage,
});

// Standard presets for interactive survey selection
const PRESET_REQUIRED_SKILLS = [
  "SQL Querying & Aggregations",
  "Python (Data Structures / Scripting)",
  "Relational Database Design (PostgreSQL / MySQL)",
  "Data Structures & Algorithms",
  "Linux CLI & Shell Basics",
  "TypeScript / Modern JavaScript",
  "Core Java / OOP",
  "Golang Concurrency",
  "Advanced Excel (Pivots & Formulas)",
  "RESTful API Integration",
];

const PRESET_EMERGING_SKILLS = [
  "Agentic AI Orchestration (LangGraph / CrewAI)",
  "Vector Databases & RAG Pipelines",
  "Power BI & Modern BI",
  "Snowflake / Databricks Warehousing",
  "Terraform / Infrastructure as Code",
  "Apache Kafka Event Streaming",
  "Docker Containerization",
  "Applied Inferential Statistics",
  "eBPF Linux Observability",
  "Prompt Engineering & LLM APIs",
];

const PRESET_DECLINING_SKILLS = [
  "Manual Regression QA / Waterfall Testing",
  "Legacy SOAP / XML Web Services",
  "AngularJS 1.x",
  "jQuery DOM Manipulation",
  "Subversion (SVN) / CVS",
  "JSP / Servlets / Struts",
  "Desktop WinForms / MFC",
  "On-Premise Physical Server Setup",
  "Perl CGI Scripting",
];

const PRESET_ENTRY_ROLES = [
  "Data Analyst",
  "Associate Software Engineer",
  "Cloud Support Associate",
  "Full Stack Developer",
  "DevOps / Infrastructure Engineer",
  "AI / Machine Learning Associate",
  "Digital Systems Engineer",
  "Backend Software Engineer",
];

const PRESET_TOOLS = [
  "Git / GitHub",
  "Docker",
  "PostgreSQL",
  "VS Code",
  "Postman",
  "Linux Terminal",
  "AWS CLI / Cloud Console",
  "Playwright / Jest",
  "Grafana / Prometheus",
  "Jira / Linear",
];

export default function IndustrySurveysPage() {
  const [activeTab, setActiveTab] = useState<"analytics" | "form" | "campaigns">("analytics");
  const [submissions, setSubmissions] = useState<StructuredSurveySubmission[]>(
    RAW_STRUCTURED_SURVEY_SUBMISSIONS
  );
  const [tierFilter, setTierFilter] = useState<string>("ALL");

  // Survey Form State
  const [formOrgName, setFormOrgName] = useState("");
  const [formIndustry, setFormIndustry] = useState("IT & Software Services");
  const [formTier, setFormTier] = useState<StructuredSurveySubmission["companyTier"]>(
    "Global Capability Center (GCC)"
  );
  const [formTitle, setFormTitle] = useState("");
  const [selectedReqSkills, setSelectedReqSkills] = useState<string[]>([
    "SQL Querying & Aggregations",
    "Python (Data Structures / Scripting)",
  ]);
  const [customReqInput, setCustomReqInput] = useState("");

  const [selectedEmergingSkills, setSelectedEmergingSkills] = useState<string[]>([
    "Power BI & Modern BI",
    "Agentic AI Orchestration (LangGraph / CrewAI)",
  ]);
  const [customEmergingInput, setCustomEmergingInput] = useState("");

  const [selectedDecliningSkills, setSelectedDecliningSkills] = useState<string[]>([
    "Manual Regression QA / Waterfall Testing",
  ]);
  const [customDecliningInput, setCustomDecliningInput] = useState("");

  const [selectedProficiency, setSelectedProficiency] = useState<ExpectedProficiency>(
    "Working / Production-Ready"
  );

  const [selectedRoles, setSelectedRoles] = useState<string[]>([
    "Data Analyst",
    "Associate Software Engineer",
  ]);
  const [customRoleInput, setCustomRoleInput] = useState("");

  const [selectedTools, setSelectedTools] = useState<string[]>([
    "Git / GitHub",
    "Docker",
    "VS Code",
  ]);
  const [customToolInput, setCustomToolInput] = useState("");

  const [formComments, setFormComments] = useState("");

  // Campaign Reports State
  const [campaigns] = useState<IndustrySurveyCampaign[]>(RAW_INDUSTRY_SURVEYS);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("survey-2026-q3");
  const activeCampaign = campaigns.find((c) => c.id === selectedCampaignId) ?? campaigns[0];

  // Filtered Submissions for Admin Analytics
  const filteredSubmissions = useMemo(() => {
    if (tierFilter === "ALL") return submissions;
    return submissions.filter((s) => s.companyTier === tierFilter);
  }, [submissions, tierFilter]);

  // Dynamic Aggregates across the 6 Questions
  const analytics = useMemo(() => {
    return computeSurveyAnalytics(filteredSubmissions);
  }, [filteredSubmissions]);

  // Helpers for chip selection toggles
  const toggleItem = (list: string[], setList: (l: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const addCustomItem = (
    list: string[],
    setList: (l: string[]) => void,
    val: string,
    clearVal: () => void
  ) => {
    if (!val.trim()) return;
    if (!list.includes(val.trim())) {
      setList([...list, val.trim()]);
    }
    clearVal();
  };

  // Form Submit Handler
  const handleSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formOrgName.trim()) {
      toast.error("Please enter your organization name.");
      return;
    }
    if (selectedReqSkills.length === 0) {
      toast.error("Please specify at least one currently required skill.");
      return;
    }

    const newSubmission: StructuredSurveySubmission = {
      id: `subm-${Date.now()}`,
      companyName: formOrgName.trim(),
      industry: formIndustry,
      companyTier: formTier,
      respondentTitle: formTitle.trim() || "Technical Hiring Lead",
      submittedAt: new Date().toISOString().split("T")[0],
      currentlyRequiredSkills: selectedReqSkills,
      skillsBecomingImportant: selectedEmergingSkills,
      skillsDeclining: selectedDecliningSkills,
      expectedProficiency: selectedProficiency,
      growingEntryLevelRoles: selectedRoles,
      expectedTools: selectedTools,
      additionalComments: formComments.trim() || undefined,
    };

    setSubmissions([newSubmission, ...submissions]);
    toast.success(
      `Survey response from ${formOrgName} registered! Live Admin Analytics updated.`
    );
    // Reset inputs
    setFormOrgName("");
    setFormTitle("");
    setFormComments("");
    // Switch to analytics dashboard to see updated stats
    setActiveTab("analytics");
  };

  const handleExportPDF = () => {
    toast.success("Exporting Industry Skill Survey Analytics Executive Dossier (PDF)");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Industry Telemetry & Surveys
          </div>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight">
            Industry Skill Surveys & Admin Analytics
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Structured enterprise survey telemetry capturing currently required skills, emerging demands, declining technologies, expected proficiencies, and entry-level role growth.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            className="gap-1.5 text-xs h-9"
          >
            <Download className="h-3.5 w-3.5" />
            Export Survey Report (PDF)
          </Button>
          <Link to="/employer-validation">
            <Button size="sm" className="gap-1.5 text-xs h-9 bg-primary text-primary-foreground">
              Employer Validation <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Provenance Disclosure Banner */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Info className="h-4 w-4 shrink-0 text-primary" />
          <span>
            <strong>Survey Methodology:</strong> Direct multi-dimensional telemetry gathered from Engineering Heads, Talent Acquisition Directors, and Lead Technical Interviewers across surveyed enterprises.
          </span>
        </div>
        <Badge variant="outline" className="text-[10px] font-mono border-primary/30 shrink-0">
          Cohort Sample: {analytics.totalResponses} Validated Employers
        </Badge>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as "analytics" | "form" | "campaigns")}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-3">
          <TabsList className="bg-muted/60 p-1">
            <TabsTrigger value="analytics" className="gap-1.5 text-xs font-semibold">
              <BarChart3 className="h-3.5 w-3.5" />
              Admin Analytics Dashboard
            </TabsTrigger>
            <TabsTrigger value="form" className="gap-1.5 text-xs font-semibold">
              <ClipboardCheck className="h-3.5 w-3.5" />
              Submit Employer Survey (6 Questions)
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="gap-1.5 text-xs font-semibold">
              <Calendar className="h-3.5 w-3.5" />
              Historical Campaign Reports
            </TabsTrigger>
          </TabsList>

          {activeTab === "analytics" && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <SlidersHorizontal className="h-3 w-3" /> Filter Tier:
              </span>
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger className="h-8 text-xs w-48">
                  <SelectValue placeholder="All Employer Tiers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Employer Tiers ({submissions.length})</SelectItem>
                  <SelectItem value="Global Capability Center (GCC)">GCCs & MNCs</SelectItem>
                  <SelectItem value="Tier 1 IT & Consulting">Tier-1 IT & Consulting</SelectItem>
                  <SelectItem value="High-Growth Product Unicorn">High-Growth Unicorns</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* TAB 1: ADMIN ANALYTICS DASHBOARD (6 SURVEY DIMENSIONS) */}
        {/* ======================================================== */}
        <TabsContent value="analytics" className="space-y-6 mt-0">
          {/* Key KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Validated Submissions"
              value={`${analytics.totalResponses} Employers`}
              icon={Building2}
              hint="Spanning GCCs, Tier-1 IT, and Unicorns"
            />
            <StatCard
              label="Top Required Skill"
              value={analytics.currentlyRequiredSkills[0]?.name?.split(" ")[0] ?? "SQL"}
              icon={CheckCircle2}
              hint={`${analytics.currentlyRequiredSkills[0]?.percentage ?? 100}% employer consensus`}
            />
            <StatCard
              label="Top Emerging Demand"
              value={analytics.skillsBecomingImportant[0]?.name?.split(" ")[0] ?? "Power BI"}
              icon={TrendingUp}
              hint="Fastest growing curriculum gap"
            />
            <StatCard
              label="Dominant Expected Standard"
              value="Production-Ready"
              icon={Award}
              hint={`${analytics.expectedProficiencyBreakdown.find((p) => p.level.startsWith("Working"))?.percentage ?? 80}% demand hands-on lab code`}
            />
          </div>

          {/* Grid of the 6 Structured Survey Dimensions */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* 1. WHICH SKILLS ARE CURRENTLY REQUIRED? */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    1
                  </span>
                  <h3 className="font-display text-base font-bold text-foreground">
                    Currently Required Technical Skills
                  </h3>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono border-primary/30">
                  Prerequisite Baseline
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground">
                Percentage of surveyed employers validating these skills as mandatory for Day-1 technical onboarding:
              </p>

              <div className="space-y-3 pt-1">
                {analytics.currentlyRequiredSkills.slice(0, 6).map((item, idx) => (
                  <div key={item.name} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-foreground flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        {item.name}
                      </span>
                      <span className="font-mono font-bold text-primary">
                        {item.percentage}% ({item.count}/{analytics.totalResponses})
                      </span>
                    </div>
                    <Progress value={item.percentage} className="h-2 bg-muted" />
                  </div>
                ))}
              </div>
            </div>

            {/* 2. WHICH SKILLS WILL BECOME IMPORTANT? */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-600">
                    2
                  </span>
                  <h3 className="font-display text-base font-bold text-foreground">
                    Skills Becoming Important (Emerging Horizon)
                  </h3>
                </div>
                <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px]">
                  Upcoming Requisitions
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground">
                Employer-forecasted technical competencies projected to dominate campus evaluations within 6-18 months:
              </p>

              <div className="space-y-3 pt-1">
                {analytics.skillsBecomingImportant.slice(0, 6).map((item) => (
                  <div key={item.name} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-foreground flex items-center gap-1.5">
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                        {item.name}
                      </span>
                      <span className="font-mono font-bold text-emerald-600">
                        +{item.percentage}% Surge
                      </span>
                    </div>
                    <Progress value={item.percentage} className="h-2 bg-muted [&>div]:bg-emerald-500" />
                  </div>
                ))}
              </div>
            </div>

            {/* 3. WHICH SKILLS ARE DECLINING? */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/15 text-xs font-bold text-amber-600">
                    3
                  </span>
                  <h3 className="font-display text-base font-bold text-foreground">
                    Skills Declining in Industry Relevance
                  </h3>
                </div>
                <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-500/30 bg-amber-500/10">
                  Deprecation Alert
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground">
                Legacy technologies identified by employers as redundant or eliminated from active hiring filters:
              </p>

              <div className="space-y-3 pt-1">
                {analytics.skillsDeclining.slice(0, 5).map((item) => (
                  <div key={item.name} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-foreground flex items-center gap-1.5">
                        <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
                        {item.name}
                      </span>
                      <span className="font-mono font-semibold text-rose-600">
                        {item.percentage}% marked declining
                      </span>
                    </div>
                    <Progress value={item.percentage} className="h-2 bg-muted [&>div]:bg-rose-500" />
                  </div>
                ))}
              </div>
            </div>

            {/* 4. WHAT PROFICIENCY IS EXPECTED? */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/15 text-xs font-bold text-indigo-600">
                    4
                  </span>
                  <h3 className="font-display text-base font-bold text-foreground">
                    Expected Proficiency Standard for Freshers
                  </h3>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono border-indigo-500/30">
                  Graduation Threshold
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground">
                Employers specify the depth of mastery required during technical machine rounds:
              </p>

              <div className="grid gap-3 sm:grid-cols-3 pt-1">
                {analytics.expectedProficiencyBreakdown.map((item) => {
                  const isDominant = item.level.startsWith("Working");
                  return (
                    <div
                      key={item.level}
                      className={`rounded-xl border p-3.5 text-center space-y-2 flex flex-col justify-between ${
                        isDominant
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "border-border bg-background"
                      }`}
                    >
                      <span className="font-display text-2xl font-black text-foreground">
                        {item.percentage}%
                      </span>
                      <span className="font-semibold text-xs text-foreground block leading-tight">
                        {item.level.split("(")[0]}
                      </span>
                      <span className="text-[10px] text-muted-foreground block">
                        {item.level.includes("(") ? `(${item.level.split("(")[1]}` : ""}
                      </span>
                      <Badge
                        variant="secondary"
                        className={`text-[9px] mx-auto ${
                          isDominant ? "bg-primary text-primary-foreground" : ""
                        }`}
                      >
                        {item.count} Employers
                      </Badge>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-lg bg-muted/40 p-3 text-[11px] text-muted-foreground">
                <strong>Consensus Takeaway:</strong> 80%+ of recruiters expect <em>"Working / Production-Ready"</em> fluency—meaning students can write executable code, test edge cases, and debug stack traces independently without syntax lookups.
              </div>
            </div>

            {/* 5. WHAT ENTRY-LEVEL ROLES ARE GROWING? */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/15 text-xs font-bold text-cyan-600">
                    5
                  </span>
                  <h3 className="font-display text-base font-bold text-foreground">
                    Growing Entry-Level Roles
                  </h3>
                </div>
                <Badge className="bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30 text-[10px]">
                  Hiring Intake Volume
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground">
                Designations witnessing highest requisition expansion for campus batch 2026-27:
              </p>

              <div className="space-y-2.5 pt-1">
                {analytics.growingEntryLevelRoles.slice(0, 5).map((r, idx) => (
                  <div
                    key={r.role}
                    className="rounded-xl border border-border bg-background p-3 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-muted-foreground w-4">
                        #{idx + 1}
                      </span>
                      <Briefcase className="h-4 w-4 text-primary shrink-0" />
                      <span className="font-semibold text-foreground">{r.role}</span>
                    </div>
                    <Badge variant="secondary" className="font-mono text-[10px]">
                      {r.percentage}% of Surveys
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. WHAT TOOLS / TECHNOLOGIES ARE EXPECTED? */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/15 text-xs font-bold text-violet-600">
                    6
                  </span>
                  <h3 className="font-display text-base font-bold text-foreground">
                    Expected Developer Tools & Environments
                  </h3>
                </div>
                <Badge className="bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/30 text-[10px]">
                  Tooling Mastery
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground">
                Software tools and workflows interview candidates are expected to operate natively:
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {analytics.expectedTools.map((t) => (
                  <div
                    key={t.tool}
                    className="rounded-lg border border-border bg-background px-3 py-2 flex items-center gap-2 text-xs"
                  >
                    <Wrench className="h-3.5 w-3.5 text-primary" />
                    <span className="font-medium text-foreground">{t.tool}</span>
                    <Badge variant="outline" className="text-[10px] font-mono bg-muted/50 ml-1">
                      {t.percentage}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AUDIT LOG: RECENT SURVEY SUBMISSIONS */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-bold text-foreground">
                  Recent Structured Employer Submissions ({filteredSubmissions.length})
                </h3>
                <p className="text-xs text-muted-foreground">
                  Individual verified employer inputs feeding into the aggregate analytics above.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("form")}
                className="gap-1.5 text-xs h-8"
              >
                <Plus className="h-3.5 w-3.5" /> Submit Response
              </Button>
            </div>

            <div className="space-y-3">
              {filteredSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="rounded-xl border border-border bg-background p-4 space-y-3 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-primary" />
                      <span className="font-bold text-foreground text-sm">{sub.companyName}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {sub.companyTier}
                      </Badge>
                      <span className="text-muted-foreground">({sub.industry})</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground font-mono text-[11px]">
                      <span>{sub.respondentTitle}</span>
                      <span>•</span>
                      <span>{sub.submittedAt}</span>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Required Skills:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {sub.currentlyRequiredSkills.map((s) => (
                          <Badge key={s} variant="secondary" className="text-[10px]">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Emerging / Becoming Important:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {sub.skillsBecomingImportant.map((s) => (
                          <Badge key={s} className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px]">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Declining Technologies:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {sub.skillsDeclining.map((s) => (
                          <Badge key={s} variant="outline" className="text-[10px] text-rose-600 border-rose-500/30 bg-rose-500/5">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {sub.additionalComments && (
                    <div className="rounded-lg bg-muted/40 p-2.5 text-[11px] text-muted-foreground italic border-l-2 border-primary">
                      "{sub.additionalComments}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ======================================================== */}
        {/* TAB 2: INTERACTIVE EMPLOYER SURVEY FORM (6 DIMENSIONS)  */}
        {/* ======================================================== */}
        <TabsContent value="form" className="space-y-6 mt-0">
          <form onSubmit={handleSurveySubmit} className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-5">
              <div className="border-b border-border pb-4">
                <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
                  Structured Industry Skill Survey Questionnaire
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Please complete the 6 core assessment dimensions below. Responses are aggregated in real time to calibrate university curricula against active industry requisition criteria.
                </p>
              </div>

              {/* Employer Profile Metadata */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1.5">
                  <Label htmlFor="orgName" className="text-xs">
                    Company / Organization Name <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="orgName"
                    placeholder="e.g. Cisco Systems, Infosys, Razorpay"
                    value={formOrgName}
                    onChange={(e) => setFormOrgName(e.target.value)}
                    required
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="industry" className="text-xs">
                    Industry Domain
                  </Label>
                  <Input
                    id="industry"
                    placeholder="e.g. FinTech, Cloud, Consumer Tech"
                    value={formIndustry}
                    onChange={(e) => setFormIndustry(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Organization Tier</Label>
                  <Select
                    value={formTier}
                    onValueChange={(v) => setFormTier(v as StructuredSurveySubmission["companyTier"])}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Global Capability Center (GCC)">
                        Global Capability Center (GCC)
                      </SelectItem>
                      <SelectItem value="Tier 1 IT & Consulting">
                        Tier-1 IT & Consulting
                      </SelectItem>
                      <SelectItem value="High-Growth Product Unicorn">
                        High-Growth Product Unicorn
                      </SelectItem>
                      <SelectItem value="Enterprise Tech">Enterprise Tech</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="title" className="text-xs">
                    Your Title / Role
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g. Engineering Lead, Campus Director"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* THE 6 CORE QUESTIONS */}
            <div className="space-y-6">
              {/* QUESTION 1 */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    1
                  </span>
                  <h3 className="font-display text-base font-bold text-foreground">
                    Which skills are currently required? <span className="text-rose-500">*</span>
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Select non-negotiable skills freshers must possess to pass technical interviews at your organization:
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {PRESET_REQUIRED_SKILLS.map((skill) => {
                    const isSelected = selectedReqSkills.includes(skill);
                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => toggleItem(selectedReqSkills, setSelectedReqSkills, skill)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary shadow-xs"
                            : "bg-background text-foreground border-border hover:border-primary/40"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {skill}
                      </button>
                    );
                  })}
                </div>

                {/* Custom write-in */}
                <div className="flex gap-2 max-w-md pt-2">
                  <Input
                    placeholder="Add other required skill..."
                    value={customReqInput}
                    onChange={(e) => setCustomReqInput(e.target.value)}
                    className="h-8 text-xs"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomItem(
                          selectedReqSkills,
                          setSelectedReqSkills,
                          customReqInput,
                          () => setCustomReqInput("")
                        );
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs shrink-0"
                    onClick={() =>
                      addCustomItem(
                        selectedReqSkills,
                        setSelectedReqSkills,
                        customReqInput,
                        () => setCustomReqInput("")
                      )
                    }
                  >
                    Add
                  </Button>
                </div>
              </div>

              {/* QUESTION 2 */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-600">
                    2
                  </span>
                  <h3 className="font-display text-base font-bold text-foreground">
                    Which skills will become important?
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Select emerging technologies you project to incorporate into entry-level hiring rubrics over the next 6-18 months:
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {PRESET_EMERGING_SKILLS.map((skill) => {
                    const isSelected = selectedEmergingSkills.includes(skill);
                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() =>
                          toggleItem(selectedEmergingSkills, setSelectedEmergingSkills, skill)
                        }
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                            : "bg-background text-foreground border-border hover:border-emerald-500/40"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {skill}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2 max-w-md pt-2">
                  <Input
                    placeholder="Add other emerging skill..."
                    value={customEmergingInput}
                    onChange={(e) => setCustomEmergingInput(e.target.value)}
                    className="h-8 text-xs"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomItem(
                          selectedEmergingSkills,
                          setSelectedEmergingSkills,
                          customEmergingInput,
                          () => setCustomEmergingInput("")
                        );
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs shrink-0"
                    onClick={() =>
                      addCustomItem(
                        selectedEmergingSkills,
                        setSelectedEmergingSkills,
                        customEmergingInput,
                        () => setCustomEmergingInput("")
                      )
                    }
                  >
                    Add
                  </Button>
                </div>
              </div>

              {/* QUESTION 3 */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500/15 text-xs font-bold text-rose-600">
                    3
                  </span>
                  <h3 className="font-display text-base font-bold text-foreground">
                    Which skills are declining?
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Select legacy or commoditized technologies that universities should phase out from core syllabi:
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {PRESET_DECLINING_SKILLS.map((skill) => {
                    const isSelected = selectedDecliningSkills.includes(skill);
                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() =>
                          toggleItem(selectedDecliningSkills, setSelectedDecliningSkills, skill)
                        }
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                            : "bg-background text-foreground border-border hover:border-rose-500/40"
                        }`}
                      >
                        {isSelected ? "✓ " : "- "}
                        {skill}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2 max-w-md pt-2">
                  <Input
                    placeholder="Add other declining skill..."
                    value={customDecliningInput}
                    onChange={(e) => setCustomDecliningInput(e.target.value)}
                    className="h-8 text-xs"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomItem(
                          selectedDecliningSkills,
                          setSelectedDecliningSkills,
                          customDecliningInput,
                          () => setCustomDecliningInput("")
                        );
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs shrink-0"
                    onClick={() =>
                      addCustomItem(
                        selectedDecliningSkills,
                        setSelectedDecliningSkills,
                        customDecliningInput,
                        () => setCustomDecliningInput("")
                      )
                    }
                  >
                    Add
                  </Button>
                </div>
              </div>

              {/* QUESTION 4 */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/15 text-xs font-bold text-indigo-600">
                    4
                  </span>
                  <h3 className="font-display text-base font-bold text-foreground">
                    What proficiency is expected? <span className="text-rose-500">*</span>
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Select the minimum practical depth required for freshers during your interview loops:
                </p>

                <div className="grid gap-3 sm:grid-cols-3 pt-1">
                  {(
                    [
                      "Foundational (Theory & Syntax)",
                      "Working / Production-Ready",
                      "Advanced (Architecture & Scale)",
                    ] as ExpectedProficiency[]
                  ).map((lvl) => {
                    const isChosen = selectedProficiency === lvl;
                    return (
                      <div
                        key={lvl}
                        onClick={() => setSelectedProficiency(lvl)}
                        className={`rounded-xl border p-4 cursor-pointer transition-all space-y-1.5 ${
                          isChosen
                            ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                            : "border-border bg-background hover:border-primary/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-foreground">
                            {lvl.split("(")[0]}
                          </span>
                          {isChosen && <CheckCircle2 className="h-4 w-4 text-primary" />}
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          {lvl.includes("(") ? `(${lvl.split("(")[1]}` : ""}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* QUESTION 5 */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/15 text-xs font-bold text-cyan-600">
                    5
                  </span>
                  <h3 className="font-display text-base font-bold text-foreground">
                    What entry-level roles are growing?
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Select the campus roles currently expanding in intake headcount at your company:
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {PRESET_ENTRY_ROLES.map((role) => {
                    const isSelected = selectedRoles.includes(role);
                    return (
                      <button
                        type="button"
                        key={role}
                        onClick={() => toggleItem(selectedRoles, setSelectedRoles, role)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-cyan-600 text-white border-cyan-600 shadow-xs"
                            : "bg-background text-foreground border-border hover:border-cyan-500/40"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {role}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2 max-w-md pt-2">
                  <Input
                    placeholder="Add other growing role..."
                    value={customRoleInput}
                    onChange={(e) => setCustomRoleInput(e.target.value)}
                    className="h-8 text-xs"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomItem(
                          selectedRoles,
                          setSelectedRoles,
                          customRoleInput,
                          () => setCustomRoleInput("")
                        );
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs shrink-0"
                    onClick={() =>
                      addCustomItem(
                        selectedRoles,
                        setSelectedRoles,
                        customRoleInput,
                        () => setCustomRoleInput("")
                      )
                    }
                  >
                    Add
                  </Button>
                </div>
              </div>

              {/* QUESTION 6 */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/15 text-xs font-bold text-violet-600">
                    6
                  </span>
                  <h3 className="font-display text-base font-bold text-foreground">
                    What tools / technologies are expected?
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Select software tools, environments, and CLIs freshers are expected to operate:
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {PRESET_TOOLS.map((tool) => {
                    const isSelected = selectedTools.includes(tool);
                    return (
                      <button
                        type="button"
                        key={tool}
                        onClick={() => toggleItem(selectedTools, setSelectedTools, tool)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-violet-600 text-white border-violet-600 shadow-xs"
                            : "bg-background text-foreground border-border hover:border-violet-500/40"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {tool}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2 max-w-md pt-2">
                  <Input
                    placeholder="Add other expected tool..."
                    value={customToolInput}
                    onChange={(e) => setCustomToolInput(e.target.value)}
                    className="h-8 text-xs"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomItem(
                          selectedTools,
                          setSelectedTools,
                          customToolInput,
                          () => setCustomToolInput("")
                        );
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs shrink-0"
                    onClick={() =>
                      addCustomItem(
                        selectedTools,
                        setSelectedTools,
                        customToolInput,
                        () => setCustomToolInput("")
                      )
                    }
                  >
                    Add
                  </Button>
                </div>
              </div>

              {/* OPTIONAL QUALITATIVE ADVICE */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-3">
                <Label htmlFor="comments" className="font-display text-sm font-bold text-foreground">
                  Additional Qualitative Advice / Interview Filter Notes
                </Label>
                <Textarea
                  id="comments"
                  placeholder="e.g. Please emphasize relational schema design, SQL window functions, and unit testing rather than generic chatbot tutorials."
                  value={formComments}
                  onChange={(e) => setFormComments(e.target.value)}
                  rows={3}
                  className="text-xs resize-none"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setActiveTab("analytics")}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" className="gap-2 text-xs bg-primary text-primary-foreground">
                <Send className="h-3.5 w-3.5" /> Submit Survey to Curriculum Alignment Board
              </Button>
            </div>
          </form>
        </TabsContent>

        {/* ======================================================== */}
        {/* TAB 3: HISTORICAL CAMPAIGN REPORTS                      */}
        {/* ======================================================== */}
        <TabsContent value="campaigns" className="space-y-6 mt-0">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column: Campaigns List */}
            <div className="space-y-3">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Survey Campaigns
              </h3>

              {campaigns.map((survey) => {
                const isSelected = survey.id === activeCampaign.id;
                return (
                  <div
                    key={survey.id}
                    onClick={() => setSelectedCampaignId(survey.id)}
                    className={`rounded-2xl border p-5 cursor-pointer transition-all shadow-xs space-y-3 ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <Badge
                        className={`text-[10px] ${
                          survey.status === "Active"
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {survey.status}
                      </Badge>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {survey.publicationDate}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-display font-bold text-sm text-foreground leading-snug">
                        {survey.title}
                      </h4>
                      <span className="text-[11px] text-muted-foreground block mt-1">
                        {survey.sector}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-muted-foreground">Sample Progress:</span>
                        <span className="font-mono font-bold">
                          {survey.responsesCount} / {survey.targetSampleSize}
                        </span>
                      </div>
                      <Progress value={survey.completionRatePct} className="h-1.5" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Detailed Survey Findings */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs font-mono">
                        {activeCampaign.sector}
                      </Badge>
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                        {activeCampaign.responsesCount} Validated Employers
                      </Badge>
                    </div>
                    <h2 className="font-display text-xl font-bold tracking-tight text-foreground mt-2">
                      {activeCampaign.title}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {activeCampaign.summary}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.success(`Exporting "${activeCampaign.title}" (PDF)`)}
                    className="gap-1.5 text-xs shrink-0 self-start"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Export Findings (PDF)
                  </Button>
                </div>

                {/* Respondent Distribution Breakdown */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Respondent Organization Profile:
                  </span>
                  <div className="grid grid-cols-3 gap-3 text-center text-xs">
                    <div className="rounded-xl border border-border bg-background p-3">
                      <span className="font-display text-xl font-bold text-foreground block">
                        {activeCampaign.respondentBreakdown.gccProductMncPct}%
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        GCCs & Global Product MNCs
                      </span>
                    </div>
                    <div className="rounded-xl border border-border bg-background p-3">
                      <span className="font-display text-xl font-bold text-primary block">
                        {activeCampaign.respondentBreakdown.itServicesTier1Pct}%
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Tier-1 Enterprise IT & Consulting
                      </span>
                    </div>
                    <div className="rounded-xl border border-border bg-background p-3">
                      <span className="font-display text-xl font-bold text-emerald-600 block">
                        {activeCampaign.respondentBreakdown.growthStartupsPct}%
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        High-Growth Tech Unicorns
                      </span>
                    </div>
                  </div>
                </div>

                {/* Key Consensus Findings Checklist */}
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Major Empirical Consensus Takeaways:
                  </span>
                  <div className="space-y-2.5">
                    {activeCampaign.keyConsensusFindings.map((finding, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 flex items-start gap-3 text-xs"
                      >
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                        <p className="text-foreground leading-snug">{finding}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Card: Feed into Curriculum Alignment */}
                <div className="rounded-xl border border-border bg-muted/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-foreground block">
                      Actionable Policy Impact:
                    </span>
                    <p className="text-muted-foreground">
                      These survey consensus points feed directly into the Curriculum Recommendation Engine to propose immediate syllabus updates.
                    </p>
                  </div>
                  <Link to="/curriculum-recommendations">
                    <Button size="sm" className="gap-1.5 text-xs whitespace-nowrap">
                      View Recommendations <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
