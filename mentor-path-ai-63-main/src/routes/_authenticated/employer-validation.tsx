import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plus,
  Sparkles,
  Building2,
  HelpCircle,
  BarChart3,
  ThumbsUp,
  MessageSquare,
  Send,
  Info,
  Clock,
  ExternalLink,
  Layers,
  Lightbulb,
  Check,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  RAW_EMPLOYER_ROLE_VALIDATIONS,
  RAW_EMERGING_SKILL_SUGGESTIONS,
  type SkillImportance,
  type EmployerSkillValidationItem,
  type EmergingSkillSuggestion,
} from "@/data/industry-validation-demo-data";

export const Route = createFileRoute("/_authenticated/employer-validation")({
  head: () => ({
    meta: [
      { title: "Employer Validation — Industry Section" },
      {
        name: "description",
        content:
          "Direct employer validation portal: validate essential vs preferred role competencies, add missing skills, suggest emerging frontier skills, and analyze Market Observation vs Employer Validation divergence.",
      },
    ],
  }),
  component: EmployerValidationPage,
});

export default function EmployerValidationPage() {
  const [selectedRole, setSelectedRole] = useState<string>("Data Analyst");
  const [employerCompany, setEmployerCompany] = useState<string>("Accenture Data & AI");
  const [activeTab, setActiveTab] = useState<"validation" | "comparison">("validation");

  // Local state for role validations (allows live modifications by the user)
  const [rolesData, setRolesData] = useState(RAW_EMPLOYER_ROLE_VALIDATIONS);
  const [emergingSkills, setEmergingSkills] = useState<EmergingSkillSuggestion[]>(
    RAW_EMERGING_SKILL_SUGGESTIONS
  );

  // User input states for modals
  const [isAddMissingOpen, setIsAddMissingOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState<EmployerSkillValidationItem["category"]>("Core Technical");
  const [newSkillImportance, setNewSkillImportance] = useState<SkillImportance>("Essential");
  const [newSkillRationale, setNewSkillRationale] = useState("");

  const [isSuggestEmergingOpen, setIsSuggestEmergingOpen] = useState(false);
  const [emergingSkillName, setEmergingSkillName] = useState("");
  const [emergingTimeframe, setEmergingTimeframe] = useState<EmergingSkillSuggestion["timeframe"]>("Short-Term (6-12 mo)");
  const [emergingImpact, setEmergingImpact] = useState("");

  // Comment state
  const [newComment, setNewComment] = useState("");

  const currentRoleRecord = useMemo(() => {
    return rolesData[selectedRole] ?? rolesData["Data Analyst"];
  }, [rolesData, selectedRole]);

  // Handle skill importance rating change
  const handleRatingChange = (skillId: string, newImportance: SkillImportance) => {
    setRolesData((prev) => {
      const roleCopy = { ...prev[selectedRole] };
      const updatedSkills = roleCopy.skills.map((s) => {
        if (s.id !== skillId) return s;
        // Adjust simulated employer percentage
        const essentialPct = newImportance === "Essential" ? 95 : newImportance === "Preferred" ? 25 : 5;
        const preferredPct = newImportance === "Preferred" ? 70 : newImportance === "Essential" ? 5 : 10;
        const notRelPct = 100 - essentialPct - preferredPct;
        return {
          ...s,
          defaultImportance: newImportance,
          employerEssentialPct: essentialPct,
          employerPreferredPct: preferredPct,
          employerNotRelevantPct: notRelPct,
        };
      });
      return {
        ...prev,
        [selectedRole]: {
          ...roleCopy,
          skills: updatedSkills,
        },
      };
    });
    toast.success(`Updated validation for this skill to "${newImportance}".`);
  };

  // Add missing skill
  const handleAddMissingSkill = () => {
    if (!newSkillName.trim()) {
      toast.error("Please enter a skill name.");
      return;
    }

    const newSkill: EmployerSkillValidationItem = {
      id: `custom-sk-${Date.now()}`,
      skillName: newSkillName.trim(),
      category: newSkillCategory,
      defaultImportance: newSkillImportance,
      marketObservationPct: 72,
      marketObservationDemand: "Medium",
      employerEssentialPct: newSkillImportance === "Essential" ? 85 : 30,
      employerPreferredPct: newSkillImportance === "Preferred" ? 65 : 15,
      employerNotRelevantPct: 5,
      employerSampleCount: currentRoleRecord.totalValidatedEmployers + 1,
      divergenceFlag: "Newly contributed by validating employer.",
      rationale: newSkillRationale.trim() || "Added during direct employer technical validation.",
    };

    setRolesData((prev) => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        skills: [...prev[selectedRole].skills, newSkill],
      },
    }));

    setIsAddMissingOpen(false);
    setNewSkillName("");
    setNewSkillRationale("");
    toast.success(`Added missing skill "${newSkill.skillName}" to ${selectedRole} template.`);
  };

  // Suggest emerging skill
  const handleSuggestEmerging = () => {
    if (!emergingSkillName.trim()) {
      toast.error("Please enter the emerging skill name.");
      return;
    }

    const newEmerging: EmergingSkillSuggestion = {
      id: `es-custom-${Date.now()}`,
      skillName: emergingSkillName.trim(),
      suggestedByCompany: employerCompany,
      timeframe: emergingTimeframe,
      anticipatedImpact: emergingImpact.trim() || "Frontier technical capability observed in recent production stacks.",
      suggestedRole: selectedRole,
      votesCount: 1,
    };

    setEmergingSkills((prev) => [newEmerging, ...prev]);
    setIsSuggestEmergingOpen(false);
    setEmergingSkillName("");
    setEmergingImpact("");
    toast.success(`Emerging skill "${newEmerging.skillName}" registered into national consensus log.`);
  };

  // Submit qualitative comment
  const handleSubmitComment = () => {
    if (!newComment.trim()) {
      toast.error("Please write a comment before submitting.");
      return;
    }

    const commentObj = {
      id: `comment-${Date.now()}`,
      company: employerCompany,
      reviewerTitle: "Technical Hiring Panel",
      comment: newComment.trim(),
      date: "Just now",
    };

    setRolesData((prev) => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        commonComments: [commentObj, ...prev[selectedRole].commonComments],
      },
    }));

    setNewComment("");
    toast.success("Validation feedback and qualitative comments saved successfully.");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Industry Validation & Endorsement
          </div>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight">
            Employer Validation Engine
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Direct human employer validation of required role skills, distinguishing empirical market job postings from hiring manager ground truth.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link to="/industry-surveys">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs h-9">
              <BarChart3 className="h-3.5 w-3.5" />
              Industry Surveys
            </Button>
          </Link>
          <Link to="/company-skill-demand">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs h-9">
              <Briefcase className="h-3.5 w-3.5" />
              Company Skill Demand
            </Button>
          </Link>
          <Link to="/curriculum-alignment">
            <Button size="sm" className="gap-1.5 text-xs h-9 bg-primary text-primary-foreground">
              Curriculum Matrix <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Provenance Disclosure */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Info className="h-4 w-4 shrink-0 text-primary" />
          <span>
            <strong>Human Validation Provenance:</strong> Employer ratings are collected directly from enterprise campus hiring leads, separating verified candidate clearance criteria from automated job board keyword scraping.
          </span>
        </div>
        <Badge variant="outline" className="text-[10px] font-mono border-primary/30 shrink-0">
          Source: Verified Recruiter Panels 2026
        </Badge>
      </div>

      {/* ROLE SELECTOR & EMPLOYER CONTEXT BAR */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              1. Select Job Role to Validate
            </label>
            <div className="flex items-center gap-3">
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-72 h-10 font-bold text-sm bg-background">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Data Analyst" className="text-xs font-semibold">
                    Data Analyst (Standard User Benchmark)
                  </SelectItem>
                  <SelectItem value="Full Stack Developer" className="text-xs font-semibold">
                    Full Stack Developer
                  </SelectItem>
                  <SelectItem value="Cloud & DevOps Engineer" className="text-xs font-semibold">
                    Cloud & DevOps Engineer
                  </SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="outline" className="text-xs font-mono">
                {currentRoleRecord.sector}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              {currentRoleRecord.description}
            </p>
          </div>

          {/* Validating Persona Selector */}
          <div className="rounded-xl border border-border bg-background p-3.5 space-y-1 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Validating as Employer:
            </span>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              <Select value={employerCompany} onValueChange={setEmployerCompany}>
                <SelectTrigger className="w-56 h-8 text-xs font-semibold bg-background">
                  <SelectValue placeholder="Employer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Accenture Data & AI" className="text-xs">Accenture Data & AI</SelectItem>
                  <SelectItem value="Microsoft IDC" className="text-xs">Microsoft IDC</SelectItem>
                  <SelectItem value="Swiggy Tech Recruitment" className="text-xs">Swiggy Tech Recruitment</SelectItem>
                  <SelectItem value="Amazon AWS Cloud" className="text-xs">Amazon AWS Cloud</SelectItem>
                  <SelectItem value="TCS Digital Hiring Panel" className="text-xs">TCS Digital Hiring Panel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW TOGGLE TABS */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={activeTab === "validation" ? "default" : "outline"}
            onClick={() => setActiveTab("validation")}
            className="text-xs h-8 gap-1.5"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Employer Skill Validation Form
          </Button>
          <Button
            size="sm"
            variant={activeTab === "comparison" ? "default" : "outline"}
            onClick={() => setActiveTab("comparison")}
            className="text-xs h-8 gap-1.5"
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Market Observation vs. Employer Validation
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* Add Missing Skill Modal */}
          <Dialog open={isAddMissingOpen} onOpenChange={setIsAddMissingOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="text-xs h-8 gap-1">
                <Plus className="h-3 w-3" /> Add Missing Skill
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Plus className="h-4 w-4 text-primary" /> Add Missing Skill to {selectedRole}
                </DialogTitle>
                <DialogDescription>
                  Suggest a technical skill or tool missing from this role's standard validation checklist.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Skill Name</label>
                  <Input
                    placeholder="e.g. DuckDB, DBT, FastAPI, Apache Spark"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold block mb-1">Category</label>
                    <Select
                      value={newSkillCategory}
                      onValueChange={(val) => setNewSkillCategory(val as EmployerSkillValidationItem["category"])}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Core Technical" className="text-xs">Core Technical</SelectItem>
                        <SelectItem value="Analytical" className="text-xs">Analytical</SelectItem>
                        <SelectItem value="Tools & BI" className="text-xs">Tools & BI</SelectItem>
                        <SelectItem value="Domain & Methods" className="text-xs">Domain & Methods</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Importance</label>
                    <Select
                      value={newSkillImportance}
                      onValueChange={(val) => setNewSkillImportance(val as SkillImportance)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Essential" className="text-xs">Essential</SelectItem>
                        <SelectItem value="Preferred" className="text-xs">Preferred</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Hiring Rationale / Context</label>
                  <Textarea
                    placeholder="Explain why this skill is needed in entry-level hiring..."
                    value={newSkillRationale}
                    onChange={(e) => setNewSkillRationale(e.target.value)}
                    rows={3}
                    className="text-xs"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" size="sm" onClick={() => setIsAddMissingOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleAddMissingSkill}>
                  Add Skill to Template
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Suggest Emerging Skill Modal */}
          <Dialog open={isSuggestEmergingOpen} onOpenChange={setIsSuggestEmergingOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="text-xs h-8 gap-1 border-primary/40 text-primary">
                <Sparkles className="h-3 w-3" /> Suggest Emerging Skill
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" /> Suggest Emerging / Frontier Skill
                </DialogTitle>
                <DialogDescription>
                  Nominate a breakthrough technology or emerging methodology arriving in industry.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Emerging Skill Name</label>
                  <Input
                    placeholder="e.g. Agentic Workflows, Vector Embeddings, eBPF"
                    value={emergingSkillName}
                    onChange={(e) => setEmergingSkillName(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Adoption Timeframe</label>
                  <Select
                    value={emergingTimeframe}
                    onValueChange={(val) => setEmergingTimeframe(val as EmergingSkillSuggestion["timeframe"])}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Immediate (0-6 mo)" className="text-xs">Immediate (0-6 mo)</SelectItem>
                      <SelectItem value="Short-Term (6-12 mo)" className="text-xs">Short-Term (6-12 mo)</SelectItem>
                      <SelectItem value="Medium-Term (1-2 yrs)" className="text-xs">Medium-Term (1-2 yrs)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Anticipated Hiring Impact</label>
                  <Textarea
                    placeholder="How will this frontier skill transform junior engineering requisitions?"
                    value={emergingImpact}
                    onChange={(e) => setEmergingImpact(e.target.value)}
                    rows={3}
                    className="text-xs"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" size="sm" onClick={() => setIsSuggestEmergingOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSuggestEmerging}>
                  Submit Suggestion
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* TAB 1: EMPLOYER SKILL VALIDATION FORM */}
      {activeTab === "validation" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">
                  Skill Importance Validation for {selectedRole}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Validate each skill as <strong>Essential</strong> (mandatory interview elimination filter), <strong>Preferred</strong> (valuable plus), or <strong>Not Relevant</strong>.
                </p>
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                {currentRoleRecord.skills.length} skills in template
              </span>
            </div>

            {/* Validation Checklist Cards */}
            <div className="space-y-3">
              {currentRoleRecord.skills.map((skill) => (
                <div
                  key={skill.id}
                  className={`rounded-xl border p-4 transition-all ${
                    skill.defaultImportance === "Essential"
                      ? "border-emerald-500/40 bg-emerald-500/5"
                      : skill.defaultImportance === "Preferred"
                      ? "border-amber-500/40 bg-amber-500/5"
                      : "border-border bg-muted/20"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-base text-foreground">
                          {skill.skillName}
                        </span>
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {skill.category}
                        </Badge>
                        {skill.divergenceFlag && (
                          <Badge
                            variant="secondary"
                            className="text-[9px] bg-primary/10 text-primary border border-primary/20 hidden md:inline-flex"
                          >
                            Divergence Note
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground max-w-2xl leading-snug">
                        {skill.rationale}
                      </p>
                    </div>

                    {/* Radio-Style Rating Toggles */}
                    <div className="flex items-center gap-1.5 shrink-0 bg-background/90 p-1.5 rounded-xl border border-border">
                      <Button
                        size="sm"
                        variant={skill.defaultImportance === "Essential" ? "default" : "ghost"}
                        onClick={() => handleRatingChange(skill.id, "Essential")}
                        className={`h-7 text-xs px-2.5 ${
                          skill.defaultImportance === "Essential"
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                            : "text-muted-foreground"
                        }`}
                      >
                        {skill.defaultImportance === "Essential" && (
                          <Check className="h-3 w-3 mr-1" />
                        )}
                        Essential
                      </Button>

                      <Button
                        size="sm"
                        variant={skill.defaultImportance === "Preferred" ? "default" : "ghost"}
                        onClick={() => handleRatingChange(skill.id, "Preferred")}
                        className={`h-7 text-xs px-2.5 ${
                          skill.defaultImportance === "Preferred"
                            ? "bg-amber-600 hover:bg-amber-700 text-white font-bold"
                            : "text-muted-foreground"
                        }`}
                      >
                        {skill.defaultImportance === "Preferred" && (
                          <Check className="h-3 w-3 mr-1" />
                        )}
                        Preferred
                      </Button>

                      <Button
                        size="sm"
                        variant={skill.defaultImportance === "Not Relevant" ? "default" : "ghost"}
                        onClick={() => handleRatingChange(skill.id, "Not Relevant")}
                        className={`h-7 text-xs px-2.5 ${
                          skill.defaultImportance === "Not Relevant"
                            ? "bg-muted-foreground text-white font-bold"
                            : "text-muted-foreground"
                        }`}
                      >
                        Not Relevant
                      </Button>
                    </div>
                  </div>

                  {/* Telemetry Footnote */}
                  <div className="mt-3 pt-2.5 border-t border-border/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
                    <span className="font-mono">
                      Market Observation: <strong>{skill.marketObservationPct}% of postings</strong> ({skill.marketObservationDemand} demand)
                    </span>
                    <span className="font-mono">
                      Employer Validation: <strong>{skill.employerEssentialPct}% Essential</strong> · {skill.employerPreferredPct}% Preferred ({skill.employerSampleCount} employers)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* QUALITATIVE EMPLOYER COMMENTS & PITFALL ADVISORY */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Provide Comments Form */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <h3 className="font-display text-base font-bold text-foreground">
                  Provide Technical Feedback for {selectedRole}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Share practical observations on student code quality, interview performance, or specific curriculum adjustments your hiring panel recommends.
              </p>

              <Textarea
                placeholder="e.g. Candidates struggle with writing efficient SQL queries involving CTEs and window functions on large datasets..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
                className="text-xs"
              />

              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground font-mono">
                  Posting as: <strong>{employerCompany}</strong>
                </span>
                <Button size="sm" onClick={handleSubmitComment} className="gap-1.5 text-xs h-8">
                  <Send className="h-3 w-3" /> Submit Feedback
                </Button>
              </div>
            </div>

            {/* Verified Recruiter Observations */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-foreground">
                  Verified Hiring Manager Observations ({currentRoleRecord.commonComments.length})
                </h3>
                <Badge variant="outline" className="text-[10px] font-mono">
                  Recruiter Ground Truth
                </Badge>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-64 pr-1">
                {currentRoleRecord.commonComments.map((comment) => (
                  <div key={comment.id} className="rounded-xl border border-border bg-muted/20 p-3 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">{comment.company}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{comment.date}</span>
                    </div>
                    <span className="text-[10px] text-primary block">{comment.reviewerTitle}</span>
                    <p className="text-muted-foreground leading-snug pt-1">
                      "{comment.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RECENT EMERGING SKILL SUGGESTIONS FROM EMPLOYERS */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="font-display text-base font-bold text-foreground">
                  Emerging Skills Suggested by Employers ({emergingSkills.length})
                </h3>
              </div>
              <Badge className="bg-primary/15 text-primary border-primary/30 text-[10px]">
                Frontier Competencies
              </Badge>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {emergingSkills.map((es) => (
                <div key={es.id} className="rounded-xl border border-border bg-background p-3.5 space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-bold text-foreground">{es.skillName}</span>
                    <Badge variant="outline" className="text-[9px] font-mono">
                      {es.timeframe}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    {es.anticipatedImpact}
                  </p>
                  <div className="pt-1.5 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>By: {es.suggestedByCompany}</span>
                    <span className="font-mono text-primary font-bold">
                      {es.votesCount} Employer Endorsements
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STRICT SEPARATION: MARKET OBSERVATION vs. EMPLOYER VALIDATION */}
      {activeTab === "comparison" && (
        <div className="space-y-6">
          {/* Executive Contrast Callout */}
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 space-y-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h3 className="font-display text-lg font-bold text-foreground">
                Rigorous Telemetry Distinction: Market Observation vs. Employer Validation
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>MARKET OBSERVATION</strong> captures keyword density and posting volume scraped from 142k+ job descriptions. In contrast, <strong>EMPLOYER VALIDATION</strong> captures direct human hiring decisions from technical recruiters and engineering managers regarding which skills are genuine elimination gates versus on-the-job preferences.
            </p>
          </div>

          {/* DIVERGENCE HIGHLIGHTS BANNER */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" />
                Key Telemetry Divergence Analysis ({selectedRole})
              </span>
              <Badge variant="outline" className="text-[10px] border-amber-500/40 text-amber-700 dark:text-amber-300">
                Critical Board of Studies Guidance
              </Badge>
            </div>
            <p className="text-xs text-foreground leading-relaxed">
              {currentRoleRecord.divergenceSummary}
            </p>
          </div>

          {/* DUAL TELEMETRY COMPARISON TABLE */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">
                  Skill Breakdown: Market Observation vs. Employer Validation
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Side-by-side comparison for <strong>{selectedRole}</strong>.
                </p>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                Sample: {currentRoleRecord.totalValidatedEmployers} Verified Employers
              </Badge>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="text-xs font-bold text-foreground">Skill Name</TableHead>
                    <TableHead className="text-xs font-bold text-foreground">Category</TableHead>
                    <TableHead className="text-xs font-bold text-foreground">
                      Market Observation (Job Postings)
                    </TableHead>
                    <TableHead className="text-xs font-bold text-foreground">
                      Employer Validation (Human Review)
                    </TableHead>
                    <TableHead className="text-xs font-bold text-foreground">
                      Divergence & Hiring Takeaway
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentRoleRecord.skills.map((s) => (
                    <TableRow key={s.id} className="text-xs">
                      <TableCell className="font-bold text-foreground">
                        {s.skillName}
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {s.category}
                        </Badge>
                      </TableCell>

                      {/* Market Observation Column */}
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex justify-between font-mono text-[11px]">
                            <span>{s.marketObservationPct}% of postings</span>
                            <Badge
                              className={`text-[9px] ${
                                s.marketObservationDemand === "Very High"
                                  ? "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30"
                                  : s.marketObservationDemand === "High"
                                  ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
                                  : "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30"
                              }`}
                            >
                              {s.marketObservationDemand}
                            </Badge>
                          </div>
                          <Progress value={s.marketObservationPct} className="h-1.5" />
                        </div>
                      </TableCell>

                      {/* Employer Validation Column */}
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex justify-between font-mono text-[11px]">
                            <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                              {s.employerEssentialPct}% Essential
                            </span>
                            <span className="text-muted-foreground">
                              {s.employerPreferredPct}% Preferred
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden flex">
                            <div
                              className="bg-emerald-600 h-full"
                              style={{ width: `${s.employerEssentialPct}%` }}
                            />
                            <div
                              className="bg-amber-500 h-full"
                              style={{ width: `${s.employerPreferredPct}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>

                      {/* Divergence Notes */}
                      <TableCell className="max-w-md">
                        <p className="text-muted-foreground leading-snug text-[11px]">
                          {s.divergenceFlag || "Market frequency aligns directly with employer validation."}
                        </p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
