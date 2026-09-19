import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  CircleAlert,
  Compass,
  GraduationCap,
  MapPinned,
  Route as RouteIcon,
  ShieldCheck,
  Target,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState, ProgressRing, SectionHeader, StatCard, WidgetCard } from "@/components/widgets";
import { SourceBadge } from "@/components/source-badge";
import { supabase } from "@/integrations/supabase/client";
import { aggregateIntelligence, type IntelligenceCompany, type IntelligenceOpportunity } from "@/lib/intelligence";

export const Route = createFileRoute("/_authenticated/intelligence")({
  head: () => ({
    meta: [
      { title: "Placement Intelligence — PlacementPilot" },
      { name: "description", content: "Connect job-market signals to curriculum gaps, career preparation, opportunities and placement outcomes." },
      { property: "og:title", content: "Placement Intelligence — PlacementPilot" },
      { property: "og:description", content: "A connected view of market demand, curriculum alignment, industry validation and employability outcomes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IntelligencePage,
});

function IntelligencePage() {
  const profile = useQuery({
    queryKey: ["profile", "intelligence"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("skills, career_interests, preferred_roles").maybeSingle();
      return data;
    },
  });
  const companies = useQuery({
    queryKey: ["companies", "intelligence"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("id, name, industry, tech_stack, dsa_topics, cs_subjects, process_steps, source_name, source_url, last_verified_at, verification_status")
        .order("name");
      if (error) throw error;
      return (data ?? []) as IntelligenceCompany[];
    },
  });
  const opportunities = useQuery({
    queryKey: ["opportunities", "intelligence"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("opportunities")
        .select("id, title, organization, category, location, source_name, source_url, last_verified_at, verification_status")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as IntelligenceOpportunity[];
    },
  });
  const subjects = useQuery({
    queryKey: ["subjects", "intelligence"],
    queryFn: async () => {
      const { data } = await supabase.from("subjects").select("name, progress, interview_topics");
      return data ?? [];
    },
  });
  const applications = useQuery({
    queryKey: ["applications", "intelligence"],
    queryFn: async () => {
      const { data } = await supabase.from("applications").select("status, role, company_name");
      return data ?? [];
    },
  });

  const summary = useMemo(
    () =>
      aggregateIntelligence({
        companies: companies.data ?? [],
        opportunities: opportunities.data ?? [],
        profile: profile.data ?? null,
        subjects: subjects.data ?? [],
        applications: applications.data ?? [],
      }),
    [companies.data, opportunities.data, profile.data, subjects.data, applications.data],
  );
  const loading = companies.isLoading || opportunities.isLoading || subjects.isLoading || applications.isLoading;
  const topSignals = summary.signals.slice(0, 8);
  const topicSignals = summary.signals.filter((signal) => signal.type === "topic").slice(0, 6);
  const companySignals = companies.data?.filter((company) => company.verification_status === "verified").slice(0, 3) ?? [];

  if (loading) return <div className="mx-auto max-w-6xl py-12 text-sm text-muted-foreground">Building your intelligence view…</div>;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <SectionHeader
        title="Placement intelligence"
        description="Market demand flows into your subjects, roadmap, opportunities, and outcomes."
        action={
          <Link to="/opportunities">
            <Button className="gap-2">Explore opportunities <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Market signals" value={summary.signals.length || "—"} icon={BarChart3} hint="Skills, topics and roles found in your current data" />
        <StatCard label="Skill gaps" value={summary.gaps.length || "—"} icon={Target} hint={summary.gaps.length ? "Demand not yet mapped to your profile or subjects" : "Add companies or opportunities to reveal gaps"} />
        <StatCard label="Curriculum coverage" value={`${summary.subjectCoverage}%`} icon={GraduationCap} hint={subjects.data?.length ? "Average progress across tracked subjects" : "Track subjects in Academics"} />
        <StatCard label="Verified sources" value={summary.verifiedSources || "—"} icon={ShieldCheck} hint="Company and opportunity records with provenance" />
      </div>

      {/* Connected Architecture Flow */}
      <div className="rounded-2xl border border-border bg-gradient-to-r from-card via-muted/30 to-card p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
          <div>
            <h3 className="font-display font-bold text-sm tracking-tight text-foreground flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-primary" />
              Integrated Intelligence Architecture
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Evidence flows from raw job market intelligence into curriculum alignment, verified industry records, and personalized student employability.
            </p>
          </div>
          <Link to="/labour-market">
            <Button size="sm" className="gap-1.5 text-xs font-semibold">
              Open Labour Market Dashboard <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <Link to="/labour-market" className="group rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/50">
            <div className="text-[10px] font-semibold text-primary uppercase">Market</div>
            <div className="font-semibold text-foreground group-hover:text-primary mt-0.5">Market Intelligence</div>
            <p className="text-[11px] text-muted-foreground mt-1">142k+ job postings, demand velocities, district clusters</p>
          </Link>

          <Link to="/curriculum-alignment" className="group rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/50">
            <div className="text-[10px] font-semibold text-emerald-600 uppercase">Curriculum</div>
            <div className="font-semibold text-foreground group-hover:text-emerald-600 mt-0.5">Curriculum Alignment</div>
            <p className="text-[11px] text-muted-foreground mt-1">Syllabus topic mapping & academic gap detection</p>
          </Link>

          <Link to="/employer-validation" className="group rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/50">
            <div className="text-[10px] font-semibold text-blue-600 uppercase">Industry</div>
            <div className="font-semibold text-foreground group-hover:text-blue-600 mt-0.5">Industry Validation</div>
            <p className="text-[11px] text-muted-foreground mt-1">Verified hiring tech stacks & interview requirements</p>
          </Link>

          <Link to="/career" className="group rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/50">
            <div className="text-[10px] font-semibold text-purple-600 uppercase">Career</div>
            <div className="font-semibold text-foreground group-hover:text-purple-600 mt-0.5">Student Employability</div>
            <p className="text-[11px] text-muted-foreground mt-1">Personal skill gaps, roadmap milestones, & outcomes</p>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="market" className="space-y-4">
        <TabsList className="flex h-auto flex-wrap justify-start gap-1">
          <TabsTrigger value="market">Market Intelligence</TabsTrigger>
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="industry">Industry</TabsTrigger>
          <TabsTrigger value="employability">Employability</TabsTrigger>
          <TabsTrigger value="feedback">Outcome Feedback Loop</TabsTrigger>
        </TabsList>

        <TabsContent value="market" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <WidgetCard title="What the market is asking for" icon={BarChart3} footnote="Counts come only from company technology, DSA, CS subject and opportunity title fields already in your workspace.">
              {topSignals.length ? (
                <div className="space-y-3">
                  {topSignals.map((signal) => (
                    <div key={`${signal.type}-${signal.name}`} className="space-y-1.5">
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="font-medium">{signal.name}</span>
                        <span className="text-xs text-muted-foreground">{signal.count} signal{signal.count === 1 ? "" : "s"}</span>
                      </div>
                      <Progress value={Math.min(100, signal.count * 18)} className="h-1.5" />
                    </div>
                  ))}
                </div>
              ) : <EmptyState title="No market signals yet" description="Fetch verified companies or opportunities to start reading demand." action={<Link to="/opportunities"><Button variant="outline">Open opportunities</Button></Link>} />}
            </WidgetCard>

            <WidgetCard title="Your current direction" icon={Compass}>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground">Most visible role signal</p>
                  <p className="mt-1 font-display text-2xl font-semibold">{summary.focusRole ?? "Not enough data"}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(profile.data?.preferred_roles ?? []).slice(0, 5).map((role) => <Badge key={role} variant="secondary">{role}</Badge>)}
                  {!profile.data?.preferred_roles?.length ? <span className="text-sm text-muted-foreground">Add preferred roles in Profile to focus this view.</span> : null}
                </div>
                <Link to="/profile"><Button variant="outline" className="w-full gap-2">Update career direction <ArrowRight className="h-4 w-4" /></Button></Link>
              </div>
            </WidgetCard>
          </div>

          <WidgetCard title="Priority skill gaps" icon={CircleAlert}>
            {summary.gaps.length ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {summary.gaps.map((gap) => <GapRow key={gap.name} gap={gap} />)}
              </div>
            ) : <EmptyState title="No uncovered demand detected" description="Your current profile and mapped subjects cover the signals we can see, or there is not enough market data yet." />}
          </WidgetCard>
        </TabsContent>

        <TabsContent value="curriculum" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
            <WidgetCard title="Curriculum alignment" icon={BookOpen}>
              <div className="flex items-center gap-4">
                <ProgressRing value={summary.subjectCoverage} />
                <div><p className="font-display text-lg font-semibold">Academic preparation</p><p className="text-sm text-muted-foreground">Based on progress for the subjects you track.</p></div>
              </div>
              <Link to="/academics"><Button className="mt-5 w-full gap-2" variant="outline">Review subjects <ArrowRight className="h-4 w-4" /></Button></Link>
            </WidgetCard>
            <WidgetCard title="Industry topics mapped to subjects" icon={GraduationCap} footnote="Map interview topics in Academics to turn demand into preparation you can measure.">
              {topicSignals.length ? <div className="grid gap-3 sm:grid-cols-2">{topicSignals.map((signal) => <TopicRow key={signal.name} name={signal.name} mapped={summary.mappedTopics.has(signal.name.toLowerCase())} count={signal.count} />)}</div> : <EmptyState title="No interview topics found" description="Add companies with interview signals, then map their topics to your subjects." />}
            </WidgetCard>
          </div>
          <WidgetCard title="Next learning actions" icon={RouteIcon}>
            <div className="grid gap-3 md:grid-cols-3">
              <ActionCard title="Map a subject topic" description="Connect an interview topic to a subject and make curriculum coverage visible." to="/academics" label="Open Academics" />
              <ActionCard title="Complete a roadmap milestone" description="Convert an uncovered demand signal into a concrete preparation step." to="/career" label="Open Career" />
              <ActionCard title="Ask your mentor" description="Use your live market and curriculum context in a focused conversation." to="/mentor" label="Open AI Mentor" />
            </div>
          </WidgetCard>
        </TabsContent>

        <TabsContent value="industry" className="space-y-4">
          <WidgetCard title="Industry validation" icon={ShieldCheck} footnote="These are stored company records, with verification status and source links preserved.">
            {companySignals.length ? <div className="grid gap-3 md:grid-cols-3">{companySignals.map((company) => <div key={company.id} className="rounded-lg border border-border p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-medium">{company.name}</p><p className="text-xs text-muted-foreground">{company.industry ?? "Industry not recorded"}</p></div><CheckCircle2 className="h-4 w-4 text-emerald-600" /></div><div className="mt-3 flex flex-wrap gap-1.5">{[...(company.tech_stack ?? []), ...(company.dsa_topics ?? [])].slice(0, 5).map((item) => <Badge key={item} variant="secondary">{item}</Badge>)}</div><div className="mt-4"><SourceBadge sourceName={company.source_name} sourceUrl={company.source_url} lastVerifiedAt={company.last_verified_at} status={company.verification_status} /></div></div>)}</div> : <EmptyState title="No verified industry records yet" description="Add a company through Companies to bring real hiring signals into this loop." action={<Link to="/companies"><Button variant="outline">Open Companies</Button></Link>} />}
          </WidgetCard>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Companies tracked" value={summary.companyCount || "—"} icon={BriefcaseBusiness} hint="Industry and interview context" />
            <StatCard label="Opportunities tracked" value={summary.opportunityCount || "—"} icon={Compass} hint="Live listings in your workspace" />
            <StatCard label="Focus location" value={opportunities.data?.find((item) => item.location)?.location ?? "Not recorded"} icon={MapPinned} hint="Taken from stored opportunity locations" />
          </div>
        </TabsContent>

        <TabsContent value="employability" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Applications" value={summary.applicationCount || "—"} icon={BriefcaseBusiness} />
            <StatCard label="Interviews" value={summary.interviewCount || "—"} icon={Target} />
            <StatCard label="Offers" value={summary.offerCount || "—"} icon={CheckCircle2} />
          </div>
          <WidgetCard title="Outcome feedback" icon={Target}>
            {summary.applicationCount ? <div className="space-y-4"><p className="text-sm text-muted-foreground">Your tracked applications are the feedback loop. Keep status and role details current so preparation can respond to what is actually happening.</p><div className="grid gap-3 sm:grid-cols-3"><OutcomeRow label="Progressed to interviews" value={summary.interviewCount} total={summary.applicationCount} /><OutcomeRow label="Converted to offers" value={summary.offerCount} total={summary.applicationCount} /><OutcomeRow label="Market data available" value={summary.signals.length} total={Math.max(1, summary.companyCount + summary.opportunityCount)} /></div><Link to="/applications"><Button className="gap-2">Update application outcomes <ArrowRight className="h-4 w-4" /></Button></Link></div> : <EmptyState title="No placement outcomes yet" description="Log applications and update their status to create feedback for your preparation plan." action={<Link to="/applications"><Button variant="outline">Open Applications</Button></Link>} />}
          </WidgetCard>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
              <div>
                <h3 className="font-display font-bold text-base text-foreground">
                  Placement Outcome Feedback Loop
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Flow: Market demand → Training → Student → Opportunity → Application → Outcome
                </p>
              </div>
              <Link to="/placement-feedback">
                <Button size="sm" className="gap-1.5 text-xs font-semibold">
                  Open Dedicated Feedback Console <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-900 dark:text-amber-200">
              <strong>Non-Causal Statistical Protocol:</strong> Outcome telemetry documents empirical correlations observed in hiring cohorts. Associations do not imply isolated causality.
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 pt-1">
              <div className="rounded-xl border border-border bg-background p-3.5 space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">SQL Window Functions</span>
                <p className="text-lg font-bold text-emerald-600 font-mono">+54.2% Delta</p>
                <p className="text-[11px] text-muted-foreground">3.2x shortlist correlation multiplier</p>
              </div>
              <div className="rounded-xl border border-border bg-background p-3.5 space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Power BI & DAX</span>
                <p className="text-lg font-bold text-emerald-600 font-mono">+52.7% Delta</p>
                <p className="text-[11px] text-muted-foreground">3.8x callback multiplier in GCC analytics</p>
              </div>
              <div className="rounded-xl border border-border bg-background p-3.5 space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Top Programme Efficacy</span>
                <p className="text-lg font-bold text-primary font-mono">88.5% Cleared</p>
                <p className="text-[11px] text-muted-foreground">PG Certificate in Applied Analytics</p>
              </div>
              <div className="rounded-xl border border-border bg-background p-3.5 space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Taxonomy Evolution</span>
                <p className="text-lg font-bold text-blue-600 font-mono">+114% Surge</p>
                <p className="text-[11px] text-muted-foreground">Cloud BI & Automated Python vs -62% VBA</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function GapRow({ gap }: { gap: { name: string; count: number; reason: string } }) {
  return <div className="flex items-start gap-3 rounded-lg border border-border p-3"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><div><p className="text-sm font-medium">{gap.name}</p><p className="mt-0.5 text-xs text-muted-foreground">{gap.reason} · {gap.count} signal{gap.count === 1 ? "" : "s"}</p></div></div>;
}

function TopicRow({ name, mapped, count }: { name: string; mapped: boolean; count: number }) {
  return <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"><div className="flex min-w-0 items-center gap-2"><span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${mapped ? "bg-emerald-500/10 text-emerald-700" : "bg-accent text-primary"}`}>{mapped ? <CheckCircle2 className="h-3.5 w-3.5" /> : <BookOpen className="h-3.5 w-3.5" />}</span><span className="truncate text-sm font-medium">{name}</span></div><span className="text-xs text-muted-foreground">{mapped ? "mapped" : `${count} asks`}</span></div>;
}

function ActionCard({ title, description, to, label }: { title: string; description: string; to: "/academics" | "/career" | "/mentor"; label: string }) {
  return <div className="rounded-lg border border-border p-4"><p className="font-medium">{title}</p><p className="mt-1 text-sm text-muted-foreground">{description}</p><Link to={to}><Button variant="ghost" className="mt-3 h-auto gap-1 px-0 text-primary">{label} <ArrowRight className="h-3.5 w-3.5" /></Button></Link></div>;
}

function OutcomeRow({ label, value, total }: { label: string; value: number; total: number }) {
  const percent = Math.round((value / Math.max(1, total)) * 100);
  return <div><div className="flex justify-between gap-3 text-xs"><span className="text-muted-foreground">{label}</span><span className="font-medium">{value}</span></div><Progress value={percent} className="mt-2 h-1.5" /></div>;
}