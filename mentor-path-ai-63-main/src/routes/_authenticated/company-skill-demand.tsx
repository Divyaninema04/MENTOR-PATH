import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2,
  Briefcase,
  Search,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Award,
  Layers,
  Info,
  Filter,
  MapPin,
  Clock,
  TrendingUp,
  AlertTriangle,
  FileCheck,
  Check,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatCard } from "@/components/widgets";
import {
  RAW_EXTENDED_COMPANY_DEMANDS,
  type ExtendedCompanySkillDemand,
  type CompanyRoleDemand,
} from "@/data/industry-validation-demo-data";

export const Route = createFileRoute("/_authenticated/company-skill-demand")({
  head: () => ({
    meta: [
      { title: "Company Skill Demand & Role Requirements — Industry Section" },
      {
        name: "description",
        content:
          "Enterprise company skill demands, role-by-role required vs preferred competencies, experience levels, hiring trends, and validated requisitions.",
      },
    ],
  }),
  component: CompanySkillDemandPage,
});

export default function CompanySkillDemandPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // Filtered dataset
  const filteredCompanies = useMemo(() => {
    return RAW_EXTENDED_COMPANY_DEMANDS.filter((c) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        c.companyName.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        c.locations.some((loc) => loc.toLowerCase().includes(q)) ||
        c.roles.some(
          (r) =>
            r.roleTitle.toLowerCase().includes(q) ||
            r.requiredSkills.some((s) => s.toLowerCase().includes(q)) ||
            r.preferredSkills.some((s) => s.toLowerCase().includes(q))
        );

      const matchesIndustry = selectedIndustry === "ALL" || c.industry === selectedIndustry;

      const matchesStatus =
        selectedStatus === "ALL" ||
        (selectedStatus === "validated" && c.isDirectEmployerValidated) ||
        (selectedStatus === "pending" && !c.isDirectEmployerValidated);

      return matchesSearch && matchesIndustry && matchesStatus;
    });
  }, [searchQuery, selectedIndustry, selectedStatus]);

  // Aggregate telemetry
  const totalRoles = useMemo(
    () => RAW_EXTENDED_COMPANY_DEMANDS.reduce((sum, c) => sum + c.roles.length, 0),
    []
  );

  const totalValidated = useMemo(
    () => RAW_EXTENDED_COMPANY_DEMANDS.filter((c) => c.isDirectEmployerValidated).length,
    []
  );

  const pendingCount = RAW_EXTENDED_COMPANY_DEMANDS.length - totalValidated;

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Industry Requirements & Requisitions
          </div>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight">
            Company Skill Demand & Role Requirements
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Structured enterprise requisitions detailing multi-role required vs preferred skills, experience brackets, hiring trends, and strict validation provenance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link to="/employer-validation">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs h-9">
              <ShieldCheck className="h-3.5 w-3.5" />
              Employer Validation
            </Button>
          </Link>
          <Link to="/industry-surveys">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs h-9">
              Industry Surveys
            </Button>
          </Link>
          <Link to="/companies">
            <Button size="sm" className="gap-1.5 text-xs h-9 bg-primary text-primary-foreground">
              All Recruiters <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Provenance & Zero-Fabrication Disclosure */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Info className="h-4 w-4 shrink-0 text-primary" />
          <span>
            <strong>Zero-Fabrication Data Policy:</strong> Company requirements are sourced from direct employer agreements and placement cell MoUs. Records without human sign-off are strictly tagged <em>"Pending Direct Employer Validation"</em>.
          </span>
        </div>
        <Badge variant="outline" className="text-[10px] font-mono border-primary/30 shrink-0">
          Strict Provenance Active
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Tracked Enterprises"
          value={`${RAW_EXTENDED_COMPANY_DEMANDS.length} Organizations`}
          icon={Building2}
          hint="Prepared data models across tech hubs"
        />
        <StatCard
          label="Total Active Roles"
          value={`${totalRoles} Profile Types`}
          icon={Briefcase}
          hint="Role-specific skill requisition matrices"
        />
        <StatCard
          label="Direct Employer Validated"
          value={`${totalValidated} Companies`}
          icon={ShieldCheck}
          hint="Signed MoUs or engineering lead verified"
        />
        <StatCard
          label="Pending Direct Validation"
          value={`${pendingCount} Unverified`}
          icon={AlertTriangle}
          hint="Marked with transparent provenance disclaimers"
        />
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
        <div className="relative w-72">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search company, location, role or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9 text-xs bg-background"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger className="w-52 h-9 text-xs bg-background">
              <SelectValue placeholder="Filter by Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-xs">All Industries</SelectItem>
              <SelectItem value="IT & Technology Consulting" className="text-xs">
                IT & Technology Consulting
              </SelectItem>
              <SelectItem value="Enterprise Software & Cloud Platforms" className="text-xs">
                Enterprise Cloud & Platforms
              </SelectItem>
              <SelectItem value="Consumer Internet & Quick Commerce" className="text-xs">
                Consumer Internet / E-Commerce
              </SelectItem>
              <SelectItem value="Cloud Platforms & Infrastructure" className="text-xs">
                Cloud Platforms & Infrastructure
              </SelectItem>
              <SelectItem value="IT Services & Solutions" className="text-xs">
                IT Services & Solutions
              </SelectItem>
              <SelectItem value="Banking & Financial Technology" className="text-xs">
                Banking & FinTech
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-48 h-9 text-xs bg-background">
              <SelectValue placeholder="Validation Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-xs">All Validation States</SelectItem>
              <SelectItem value="validated" className="text-xs">Direct Validated Only</SelectItem>
              <SelectItem value="pending" className="text-xs">Pending Validation Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* EXTENDED COMPANY SKILL DEMAND CARDS */}
      <div className="space-y-6">
        {filteredCompanies.map((company) => {
          return (
            <div
              key={company.slug}
              className={`rounded-2xl border bg-card p-6 shadow-xs space-y-5 transition-all ${
                company.isDirectEmployerValidated
                  ? "border-border hover:border-primary/40"
                  : "border-amber-500/30 bg-amber-500/[0.02]"
              }`}
            >
              {/* Company Header Row */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-border pb-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-2xl font-bold text-foreground">
                      {company.companyName}
                    </h2>
                    <Badge variant="outline" className="text-xs font-mono">
                      {company.industry}
                    </Badge>
                    {company.isDirectEmployerValidated ? (
                      <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px] gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Direct Employer Validated
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px] gap-1">
                        <AlertTriangle className="h-3 w-3" /> Pending Direct Employer Validation
                      </Badge>
                    )}
                  </div>

                  {/* Locations & Experience Summary */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      <strong>Locations:</strong> {company.locations.join(", ")}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      <strong>Experience:</strong> {company.experienceRequirements}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-semibold text-foreground">
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                      {company.overallHiringTrend}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link to="/companies/$slug" params={{ slug: company.slug }}>
                    <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                      Company Profile <ExternalLink className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Provenance note */}
              <div className="text-[11px] text-muted-foreground flex items-center justify-between">
                <span>
                  <strong>Telemetry Source:</strong> {company.validationProvenance}
                </span>
                {!company.isDirectEmployerValidated && (
                  <span className="text-amber-600 font-semibold text-[10px]">
                    Zero Fabrication: Baseline campus notification only
                  </span>
                )}
              </div>

              {/* Role-by-Role Requirements Matrix */}
              <div className="space-y-4 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Role-Wise Skill Requisitions ({company.roles.length} Active Profiles)
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {company.roles.map((role) => (
                    <div
                      key={role.roleTitle}
                      className="rounded-xl border border-border bg-background p-4 space-y-3.5 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        {/* Role Header */}
                        <div className="flex items-start justify-between gap-2 border-b border-border/70 pb-2">
                          <div>
                            <h3 className="font-display font-bold text-base text-foreground leading-tight">
                              {role.roleTitle}
                            </h3>
                            <span className="text-[11px] text-muted-foreground block mt-0.5">
                              Exp: {role.experienceLevel}
                            </span>
                          </div>
                          <div className="text-right">
                            <Badge
                              className={`text-[9px] ${
                                role.hiringTrend.includes("Surging")
                                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                                  : "bg-primary/10 text-primary border-primary/20"
                              }`}
                            >
                              {role.hiringTrend}
                            </Badge>
                            {role.openingsCount && (
                              <span className="block font-mono text-[10px] text-muted-foreground mt-0.5">
                                {role.openingsCount} Vacancies
                              </span>
                            )}
                          </div>
                        </div>

                        {/* REQUIRED SKILLS */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                            <Check className="h-3 w-3" /> Mandatory Required Skills:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {role.requiredSkills.map((sk) => (
                              <Badge
                                key={sk}
                                className="bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 border-emerald-500/30 text-xs font-medium py-0.5 px-2"
                              >
                                {sk}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* PREFERRED SKILLS */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1">
                            <Sparkles className="h-3 w-3" /> Preferred Skills:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {role.preferredSkills.map((sk) => (
                              <Badge
                                key={sk}
                                variant="outline"
                                className="border-amber-500/40 text-amber-900 dark:text-amber-200 bg-amber-500/5 text-xs font-medium py-0.5 px-2"
                              >
                                {sk}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Typical Assessment Method */}
                      <div className="rounded-lg bg-muted/40 p-2.5 text-[11px] text-muted-foreground border-t border-border/70 mt-2">
                        <span className="font-semibold text-foreground mr-1">
                          Assessment Loop:
                        </span>
                        {role.typicalAssessmentMethod}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {filteredCompanies.length === 0 && (
          <p className="text-center py-12 text-sm text-muted-foreground">
            No company profiles match your current search or filters.
          </p>
        )}
      </div>
    </div>
  );
}
