import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  CheckCircle2,
  BookOpen,
  Layers,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  Search,
  SlidersHorizontal,
  Download,
  Info,
  Briefcase,
  Sparkles,
  ChevronRight,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatCard } from "@/components/widgets";
import {
  RAW_ROLE_QUALIFICATION_MAPPINGS,
  type RoleQualificationCourseMapping,
  type TrainingCourseOption,
} from "@/data/training-alignment-demo-data";

export const Route = createFileRoute("/_authenticated/qualification-mapping")({
  head: () => ({
    meta: [
      { title: "Qualification & Course Mapping — Training Alignment" },
      {
        name: "description",
        content:
          "Hierarchical alignment mapping: Role -> Required Skills -> Qualifications -> Training Programmes. Administrators can add and edit occupational standards crosswalks.",
      },
    ],
  }),
  component: QualificationAndCourseMappingPage,
});

export default function QualificationAndCourseMappingPage() {
  const [mappings, setMappings] = useState<RoleQualificationCourseMapping[]>(
    RAW_ROLE_QUALIFICATION_MAPPINGS
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formRole, setFormRole] = useState("");
  const [formCategory, setFormCategory] = useState("Analytics & Business Intelligence");
  const [formSkills, setFormSkills] = useState("");
  const [formQualTitle, setFormQualTitle] = useState("");
  const [formQualCode, setFormQualCode] = useState("");
  const [formNsqfLevel, setFormNsqfLevel] = useState("6");
  const [formAwardingBody, setFormAwardingBody] = useState("IT-ITeS Sector Skills Council (NASSCOM / NSDC)");
  const [formCourses, setFormCourses] = useState<TrainingCourseOption[]>([
    {
      courseName: "PG Diploma in Business Analytics",
      programmeType: "Postgraduate Diploma",
      duration: "1 Year",
      institutionType: "University Department",
      alignmentPct: 90,
    },
  ]);

  // Temporary state for adding a training course in the dialog
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseType, setNewCourseType] = useState("Undergraduate Degree");
  const [newCourseDuration, setNewCourseDuration] = useState("4 Years");
  const [newCourseAlignment, setNewCourseAlignment] = useState(85);

  // Filtered Mappings
  const filteredMappings = useMemo(() => {
    return mappings.filter((m) => {
      const matchesCategory = categoryFilter === "ALL" || m.roleCategory === categoryFilter;
      const matchesSearch =
        m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.qualificationTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.qualificationCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.requiredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        m.trainingCourses.some((c) => c.courseName.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [mappings, searchQuery, categoryFilter]);

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingId(null);
    setFormRole("");
    setFormCategory("Analytics & Business Intelligence");
    setFormSkills("SQL, Python, Statistics, Power BI, Excel");
    setFormQualTitle("Associate Specialist Qualification Pack");
    setFormQualCode("SSC/Q8102");
    setFormNsqfLevel("6");
    setFormAwardingBody("IT-ITeS Sector Skills Council (NASSCOM / NSDC)");
    setFormCourses([
      {
        courseName: "B.Tech Applied Analytics & Computing",
        programmeType: "Undergraduate Degree",
        duration: "4 Years",
        institutionType: "Engineering College",
        alignmentPct: 88,
      },
    ]);
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (mapping: RoleQualificationCourseMapping) => {
    setEditingId(mapping.id);
    setFormRole(mapping.role);
    setFormCategory(mapping.roleCategory);
    setFormSkills(mapping.requiredSkills.join(", "));
    setFormQualTitle(mapping.qualificationTitle);
    setFormQualCode(mapping.qualificationCode);
    setFormNsqfLevel(String(mapping.nsqfLevel));
    setFormAwardingBody(mapping.awardingBody);
    setFormCourses([...mapping.trainingCourses]);
    setIsModalOpen(true);
  };

  // Delete mapping
  const handleDelete = (id: string, role: string) => {
    setMappings((prev) => prev.filter((m) => m.id !== id));
    toast.info(`Deleted mapping for ${role}.`);
  };

  // Add course to form course list
  const handleAddCourseToForm = () => {
    if (!newCourseName.trim()) {
      toast.error("Please enter a training course name.");
      return;
    }
    setFormCourses((prev) => [
      ...prev,
      {
        courseName: newCourseName.trim(),
        programmeType: newCourseType,
        duration: newCourseDuration,
        institutionType: "Academic / Vocational Partner",
        alignmentPct: Number(newCourseAlignment),
      },
    ]);
    setNewCourseName("");
    toast.success("Course added to mapping.");
  };

  // Remove course from form course list
  const handleRemoveCourseFromForm = (index: number) => {
    setFormCourses((prev) => prev.filter((_, i) => i !== index));
  };

  // Save Mapping (Create or Update)
  const handleSaveMapping = () => {
    if (!formRole.trim() || !formQualTitle.trim()) {
      toast.error("Please provide both Role and Qualification Title.");
      return;
    }

    const skillsArray = formSkills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (skillsArray.length === 0) {
      toast.error("Please specify at least one required skill.");
      return;
    }

    if (editingId) {
      // Update
      setMappings((prev) =>
        prev.map((item) => {
          if (item.id === editingId) {
            return {
              ...item,
              role: formRole.trim(),
              roleCategory: formCategory,
              requiredSkills: skillsArray,
              qualificationTitle: formQualTitle.trim(),
              qualificationCode: formQualCode.trim(),
              nsqfLevel: Number(formNsqfLevel),
              awardingBody: formAwardingBody.trim(),
              trainingCourses: formCourses,
              updatedAt: new Date().toISOString().split("T")[0],
            };
          }
          return item;
        })
      );
      toast.success(`Updated mapping for ${formRole}!`);
    } else {
      // Create
      const newMapping: RoleQualificationCourseMapping = {
        id: `map-${Date.now()}`,
        role: formRole.trim(),
        roleCategory: formCategory,
        requiredSkills: skillsArray,
        qualificationTitle: formQualTitle.trim(),
        qualificationCode: formQualCode.trim() || `QP-NEW-${Math.floor(Math.random() * 1000)}`,
        nsqfLevel: Number(formNsqfLevel),
        awardingBody: formAwardingBody.trim(),
        trainingCourses: formCourses,
        minimumEligibility: "Bachelor's Degree or Relevant Professional Diploma",
        updatedAt: new Date().toISOString().split("T")[0],
      };
      setMappings((prev) => [newMapping, ...prev]);
      toast.success(`Created new occupational mapping for ${formRole}!`);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <span className="flex h-2 w-2 rounded-full bg-primary" />
            Occupational & Qualification Frameworks
          </div>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight">
            Qualification & Course Mapping System
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Connects live market roles to required industry skills, National Occupational Standards (NOS), and accredited academic training courses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={handleOpenCreate}
            className="gap-1.5 text-xs h-9 bg-primary text-primary-foreground shadow-sm"
          >
            <Plus className="h-4 w-4" /> Add New Mapping
          </Button>
          <Link to="/curriculum-alignment">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs h-9">
              Curriculum Engine <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* 4-TIER HIERARCHY FLOW INFOGRAPHIC BANNER */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-primary" />
            Standard 4-Tier Mapping Hierarchy
          </span>
          <Badge variant="outline" className="text-[10px] font-mono">
            NSQF & Sector Skill Council Aligned
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 p-3 space-y-1">
            <span className="font-mono text-[10px] text-sky-600 block uppercase font-bold">Tier 1</span>
            <strong className="text-sm text-foreground block">TARGET ROLE</strong>
            <span className="text-[11px] text-muted-foreground block">Industry Job Title & Function</span>
          </div>

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 space-y-1">
            <span className="font-mono text-[10px] text-emerald-600 block uppercase font-bold">Tier 2</span>
            <strong className="text-sm text-foreground block">REQUIRED SKILLS</strong>
            <span className="text-[11px] text-muted-foreground block">Technical Competency Stack</span>
          </div>

          <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-3 space-y-1">
            <span className="font-mono text-[10px] text-purple-600 block uppercase font-bold">Tier 3</span>
            <strong className="text-sm text-foreground block">QUALIFICATIONS</strong>
            <span className="text-[11px] text-muted-foreground block">NSQF Level & Qualification Pack</span>
          </div>

          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 space-y-1">
            <span className="font-mono text-[10px] text-amber-600 block uppercase font-bold">Tier 4</span>
            <strong className="text-sm text-foreground block">TRAINING PROGRAMMES</strong>
            <span className="text-[11px] text-muted-foreground block">University Degrees & Diplomas</span>
          </div>
        </div>
      </div>

      {/* KPI METRICS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Mapped Market Roles"
          value={`${mappings.length} Roles`}
          icon={Briefcase}
          hint="Covering Analytics, Cloud, Software, AI & EV engineering"
        />
        <StatCard
          label="Primary Qualification Standard"
          value="NSQF Level 6 & 7"
          icon={Award}
          hint="Graduate & Professional Master engineering qualifications"
        />
        <StatCard
          label="Average Course Alignment"
          value="87.6%"
          icon={CheckCircle2}
          hint="Syllabus coverage of mandatory occupational standards"
        />
        <StatCard
          label="Accrediting Councils"
          value="NASSCOM / ASDC"
          icon={ShieldCheck}
          hint="Recognized Sector Skill Councils under NSDC"
        />
      </div>

      {/* SEARCH AND CATEGORY FILTER */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between rounded-xl border border-border bg-card p-4 shadow-xs">
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {["ALL", "Analytics & Business Intelligence", "Software Engineering & Architecture", "Cloud Infrastructure & DevOps", "Artificial Intelligence & Cognitive Computing"].map((cat) => (
            <Button
              key={cat}
              variant={categoryFilter === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoryFilter(cat)}
              className="text-xs h-8"
            >
              {cat === "ALL" ? "All Categories" : cat.split(" ")[0]}
            </Button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search role, qualification, or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
      </div>

      {/* MAPPINGS CARDS CONTAINER */}
      <div className="space-y-4">
        {filteredMappings.map((mapping) => (
          <div
            key={mapping.id}
            className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-5 hover:border-border/80 transition-all"
          >
            {/* Tier 1 Header & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-sky-500/10 text-sky-600 border-sky-500/30 text-xs font-bold uppercase">
                    Role: {mapping.role}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {mapping.roleCategory}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">
                    Last updated: {mapping.updatedAt}
                  </span>
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground">
                  {mapping.role}
                </h3>
              </div>

              {/* Edit / Delete Administrator Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(mapping)}
                  className="text-xs h-8 gap-1.5"
                >
                  <Edit2 className="h-3.5 w-3.5 text-primary" /> Edit Mapping
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(mapping.id, mapping.role)}
                  className="text-xs h-8 text-rose-600 hover:text-rose-700 hover:bg-rose-500/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Visual 3-Column Downstream Flow */}
            <div className="grid gap-4 md:grid-cols-3">
              {/* Tier 2: Required Skills */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] p-4 space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5" /> Tier 2: Required Skills
                </span>
                <p className="text-[11px] text-muted-foreground">
                  Non-negotiable industry competencies required for placement qualification.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {mapping.requiredSkills.map((sk) => (
                    <Badge
                      key={sk}
                      className="bg-emerald-600 text-white font-semibold text-[11px] px-2.5 py-0.5 shadow-xs"
                    >
                      {sk}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Tier 3: Qualifications */}
              <div className="rounded-xl border border-purple-500/20 bg-purple-500/[0.03] p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-600 flex items-center gap-1.5">
                    <ChevronRight className="h-3.5 w-3.5" /> Tier 3: Qualifications
                  </span>
                  <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/30 font-mono text-[10px]">
                    NSQF Level {mapping.nsqfLevel}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">
                    {mapping.qualificationTitle}
                  </h4>
                  <span className="font-mono text-xs text-muted-foreground block mt-0.5">
                    Code: {mapping.qualificationCode}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  <strong>Awarding Body:</strong> {mapping.awardingBody}
                </p>
              </div>

              {/* Tier 4: Courses / Training Programmes */}
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.03] p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                    <ChevronRight className="h-3.5 w-3.5" /> Tier 4: Training Programmes
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {mapping.trainingCourses.length} paths
                  </span>
                </div>
                <div className="space-y-2">
                  {mapping.trainingCourses.map((c, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-border bg-card p-2 text-xs flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <strong className="text-foreground text-[11px] block truncate">
                          {c.courseName}
                        </strong>
                        <span className="text-[10px] text-muted-foreground block">
                          {c.programmeType} · {c.duration}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[10px] font-mono border-emerald-500/30 text-emerald-600 bg-emerald-500/5 shrink-0"
                      >
                        {c.alignmentPct}% match
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD / EDIT MAPPING MODAL DIALOG */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingId ? "Edit Occupational Mapping" : "Add New Occupational Mapping"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Define the 4-tier flow: Role → Required Skills → Qualifications → Training Courses.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2 text-xs">
            {/* Tier 1 Fields */}
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-3">
              <span className="font-bold text-foreground uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-primary" /> Tier 1: Target Role
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Role Title</label>
                  <Input
                    placeholder="e.g. Data Analyst, Cloud Architect..."
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Role Category</label>
                  <Input
                    placeholder="e.g. Analytics & Business Intelligence"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Tier 2 Fields */}
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-2">
              <span className="font-bold text-foreground uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Tier 2: Required Skills (Comma-separated)
              </span>
              <Input
                placeholder="e.g. SQL, Python, Statistics, Power BI, Excel..."
                value={formSkills}
                onChange={(e) => setFormSkills(e.target.value)}
                className="h-8 text-xs"
              />
              <span className="text-[10px] text-muted-foreground">
                Separate skills with commas. Example: SQL, Python, Statistics, Power BI, Excel
              </span>
            </div>

            {/* Tier 3 Fields */}
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-3">
              <span className="font-bold text-foreground uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-purple-600" /> Tier 3: Qualification Standard
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Qualification Title</label>
                  <Input
                    placeholder="e.g. Associate Data Analyst QP"
                    value={formQualTitle}
                    onChange={(e) => setFormQualTitle(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Qualification Code</label>
                  <Input
                    placeholder="e.g. SSC/Q8102"
                    value={formQualCode}
                    onChange={(e) => setFormQualCode(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">NSQF Level</label>
                  <Select value={formNsqfLevel} onValueChange={setFormNsqfLevel}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">Level 5 (Diploma)</SelectItem>
                      <SelectItem value="6">Level 6 (Graduate B.Tech/Degree)</SelectItem>
                      <SelectItem value="7">Level 7 (Master / Advanced Postgrad)</SelectItem>
                      <SelectItem value="8">Level 8 (Doctoral / Research)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Awarding Body / Council</label>
                  <Input
                    placeholder="e.g. IT-ITeS Sector Skills Council (NASSCOM / NSDC)"
                    value={formAwardingBody}
                    onChange={(e) => setFormAwardingBody(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Tier 4 Fields */}
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-3">
              <span className="font-bold text-foreground uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-amber-600" /> Tier 4: Training Courses / Programmes
              </span>

              {/* Current List of Courses */}
              <div className="space-y-1.5">
                {formCourses.map((c, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-border bg-card p-2 flex items-center justify-between text-xs"
                  >
                    <div>
                      <strong className="text-foreground">{c.courseName}</strong>
                      <span className="text-[10px] text-muted-foreground block">
                        {c.programmeType} · {c.duration} ({c.alignmentPct}% match)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCourseFromForm(idx)}
                      className="h-6 w-6 p-0 text-rose-500 hover:text-rose-700"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Add a Course mini-form */}
              <div className="p-2.5 rounded-lg border border-dashed border-border bg-background space-y-2">
                <span className="text-[10px] font-bold text-muted-foreground block uppercase">
                  Add a Training Course to Mapping
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Input
                    placeholder="Course name (e.g. B.Tech AI & DS)"
                    value={newCourseName}
                    onChange={(e) => setNewCourseName(e.target.value)}
                    className="h-7 text-xs sm:col-span-2"
                  />
                  <Input
                    placeholder="Duration (e.g. 4 Years)"
                    value={newCourseDuration}
                    onChange={(e) => setNewCourseDuration(e.target.value)}
                    className="h-7 text-xs"
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">Alignment %:</span>
                    <Input
                      type="number"
                      min={10}
                      max={100}
                      value={newCourseAlignment}
                      onChange={(e) => setNewCourseAlignment(Number(e.target.value))}
                      className="h-7 w-16 text-xs"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleAddCourseToForm}
                    className="h-7 text-[11px] gap-1"
                  >
                    <Plus className="h-3 w-3" /> Add Course
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-3 border-t border-border">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveMapping} className="gap-1.5">
              <Check className="h-3.5 w-3.5" />
              {editingId ? "Save Changes" : "Create Mapping"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
