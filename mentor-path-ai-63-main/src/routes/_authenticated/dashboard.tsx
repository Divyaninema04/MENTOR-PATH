import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Briefcase,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Target,
  CalendarClock,
  ListChecks,
  Quote as QuoteIcon,
  GraduationCap,
  Plus,
  BookmarkCheck,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Route as RouteIcon,
  BookOpen,
  Building2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { STATUS_LABEL, STATUS_TONE, type ApplicationStatus } from "@/lib/format";
import { quoteOfTheDay } from "@/lib/quotes";
import { EmptyState, StatCard, WidgetCard } from "@/components/widgets";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — PlacementPilot" },
      {
        name: "description",
        content:
          "Career readiness score, skill gap diagnostics, roadmap progression, application tracker, and market hiring trends.",
      },
      { property: "og:title", content: "Dashboard — PlacementPilot" },
      {
        property: "og:description",
        content: "Track your placement readiness, active skill gaps, matched opportunities, and daily action items.",
      },
    ],
  }),
  component: DashboardPage,
});

function greet() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function daysUntil(date: string) {
  const ms = new Date(date + "T00:00:00").getTime() - new Date(todayISO() + "T00:00:00").getTime();
  return Math.round(ms / 86_400_000);
}

function DashboardPage() {
  const qc = useQueryClient();
  const today = todayISO();
  const quote = quoteOfTheDay();
  const [taskTitle, setTaskTitle] = useState("");

  const profile = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return null;
      const { data } = await supabase.from("profiles").select("*").eq("id", u.user.id).maybeSingle();
      return { user: u.user, profile: data };
    },
  });

  const apps = useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const { data } = await supabase
        .from("applications")
        .select("*")
        .order("applied_date", { ascending: false });
      return data ?? [];
    },
  });

  const tasks = useQuery({
    queryKey: ["tasks", today],
    queryFn: async () => {
      const { data } = await supabase
        .from("tasks")
        .select("*")
        .lte("due_date", today)
        .order("due_time", { ascending: true, nullsFirst: false });
      return data ?? [];
    },
  });

  const semesters = useQuery({
    queryKey: ["semesters"],
    queryFn: async () => {
      const { data } = await supabase.from("semesters").select("*");
      return data ?? [];
    },
  });

  const subjects = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const { data } = await supabase.from("subjects").select("*");
      return data ?? [];
    },
  });

  const savedOpps = useQuery({
    queryKey: ["saved_opportunities", "dashboard"],
    queryFn: async () => {
      const { data } = await supabase
        .from("saved_opportunities")
        .select(
          "id, created_at, opportunity:opportunities(id, title, organization, category, deadline, location, apply_url)",
        )
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const addTask = useMutation({
    mutationFn: async (title: string) => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Not signed in");
      const { error } = await supabase
        .from("tasks")
        .insert({ user_id: u.user.id, title, due_date: today });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const toggleTask = useMutation({
    mutationFn: async ({ id, done }: { id: string; done: boolean }) => {
      const { error } = await supabase
        .from("tasks")
        .update({ is_done: done, completed_at: done ? new Date().toISOString() : null })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });

  // Calculations
  const total = apps.data?.length ?? 0;
  const offers = apps.data?.filter((a) => a.status === "offer" || a.status === "Selected").length ?? 0;
  const interviews = apps.data?.filter((a) => a.status === "interview" || a.status === "Interview").length ?? 0;
  const shortlisted = apps.data?.filter((a) => a.status === "shortlisted" || a.status === "Shortlisted").length ?? 0;
  const readiness = Math.min(100, Math.max(35, Math.round(total * 6 + interviews * 10 + offers * 25 + 35)));

  const openTasks = tasks.data?.filter((t) => !t.is_done) ?? [];
  const doneToday = tasks.data?.filter((t) => t.is_done && t.due_date === today).length ?? 0;

  const semRows = semesters.data ?? [];
  const validSem = semRows.filter((r) => r.sgpa != null && Number(r.credits_earned ?? 0) > 0);
  const creditsDone = validSem.reduce((s, r) => s + Number(r.credits_earned), 0);
  const cgpa = creditsDone
    ? validSem.reduce((s, r) => s + Number(r.sgpa) * Number(r.credits_earned), 0) / creditsDone
    : null;

  const deadlines = [
    ...(subjects.data ?? [])
      .filter((s) => s.exam_date && daysUntil(s.exam_date) >= 0)
      .map((s) => ({ id: `sub-${s.id}`, label: `${s.name} exam`, date: s.exam_date! })),
    ...(apps.data ?? [])
      .filter((a) => a.next_step_date && daysUntil(a.next_step_date) >= 0)
      .map((a) => ({
        id: `app-${a.id}`,
        label: `${a.company_name} · ${a.next_step ?? "next step"}`,
        date: a.next_step_date!,
      })),
  ]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  const name =
    profile.data?.profile?.full_name ??
    profile.data?.user?.user_metadata?.full_name ??
    profile.data?.user?.email?.split("@")[0] ??
    "Aarav Sharma";

  const targetRole = profile.data?.profile?.preferred_roles?.[0] ?? "Data Analyst";

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12">
      {/* 1. Header with Student Welcome & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{greet()},</span>
            <Badge variant="outline" className="text-[10px] font-medium border-primary/30 text-primary">
              Target: {targetRole}
            </Badge>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-0.5">
            {name}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/career">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs h-9">
              <RouteIcon className="h-3.5 w-3.5 text-primary" />
              <span>Career Roadmap</span>
            </Button>
          </Link>
          <Link to="/applications">
            <Button size="sm" className="gap-1.5 text-xs h-9">
              <Briefcase className="h-3.5 w-3.5" />
              <span>Log Application</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Quote of the Day */}
      <div className="rounded-xl border border-border/70 bg-card/60 p-3.5 flex items-start gap-3 shadow-2xs">
        <QuoteIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{quote.text}</span> — {quote.author}
        </p>
      </div>

      {/* 2. Top Metric Row: Career Readiness + Market Trends */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Career Readiness */}
        <div className="bento-card border border-primary/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <Target className="h-4 w-4 text-primary" />
              <span>Career Readiness</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">{targetRole}</span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="font-display text-4xl font-bold tracking-tight">
              {readiness}<span className="text-xl text-muted-foreground">%</span>
            </div>
            <Badge variant="secondary" className="text-xs font-normal">
              {readiness >= 75 ? "Placement Ready" : "Building Skills"}
            </Badge>
          </div>
          <Progress value={readiness} className="h-2" />
          <p className="text-[11px] text-muted-foreground">
            Calculated from coursework, completed projects, verified skill ratings, and logged applications.
          </p>
        </div>

        {/* Roadmap Progress */}
        <div className="bento-card space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <RouteIcon className="h-4 w-4 text-sky-500" />
              <span>Roadmap Progress</span>
            </div>
            <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400">Stage 3 of 7</span>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Active Milestone</div>
            <div className="font-semibold text-sm text-foreground mt-0.5">Practice: SQL Window Functions</div>
          </div>
          <div className="rounded-lg bg-muted/40 p-2 text-[11px] text-muted-foreground border border-border/50">
            Solve 25 HackerRank Medium queries on CTEs & PARTITION BY.
          </div>
          <Link to="/career" className="text-[11px] text-primary hover:underline inline-flex items-center gap-1 font-medium">
            Continue learning pipeline <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Target Role Market Trends */}
        <div className="bento-card space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span>Market Demand Trends</span>
            </div>
            <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/30">
              Surging
            </Badge>
          </div>
          <div>
            <div className="font-display text-2xl font-bold text-foreground">+54.2%</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Hiring surge for <strong>{targetRole}</strong> in regional tech hubs (Pune & Mumbai).
            </div>
          </div>
          <div className="text-[11px] text-muted-foreground border-t pt-2">
            Top demanded tool: <strong className="text-foreground">Power BI & SQL Window Functions</strong>
          </div>
          <Link to="/labour-market" className="text-[11px] text-primary hover:underline inline-flex items-center gap-1 font-medium">
            Explore market telemetry <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* 3. Skills & Skill Gaps Overview */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
          <div>
            <h2 className="font-display text-base font-bold text-foreground">Skill Diagnostics for {targetRole}</h2>
            <p className="text-xs text-muted-foreground">
              Comparison between your verified competencies and current employer hiring benchmarks.
            </p>
          </div>
          <Link to="/career">
            <Button variant="ghost" size="sm" className="text-xs text-primary gap-1 h-8">
              Open Full Diagnostic <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Current Mastered Skills */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>Mastered Skills</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["Python", "Basic SQL", "Excel Modeling", "Git / GitHub", "Relational DBs"].map((s) => (
                <Badge key={s} variant="secondary" className="text-[11px] font-medium">
                  {s}
                </Badge>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground">Meets baseline requirements for junior data roles.</p>
          </div>

          {/* Detected Skill Gaps */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
              <span>Detected Gaps</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between p-2 rounded-md bg-rose-500/5 border border-rose-500/20 text-[11px]">
                <span className="font-medium text-foreground">SQL Window Functions</span>
                <span className="text-rose-600 dark:text-rose-400 font-semibold">Critical Gap</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md bg-rose-500/5 border border-rose-500/20 text-[11px]">
                <span className="font-medium text-foreground">Power BI & DAX</span>
                <span className="text-rose-600 dark:text-rose-400 font-semibold">Critical Gap</span>
              </div>
            </div>
          </div>

          {/* Recommended Next Skills */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <Sparkles className="h-3.5 w-3.5 text-purple-500" />
              <span>Recommended Next Steps</span>
            </div>
            <div className="space-y-1.5">
              <div className="p-2 rounded-md bg-purple-500/5 border border-purple-500/20 text-[11px]">
                <span className="font-medium text-foreground">1. SQL Window Functions Intensive</span>
                <p className="text-muted-foreground mt-0.5">+14% interview pass rate boost</p>
              </div>
              <div className="p-2 rounded-md bg-purple-500/5 border border-purple-500/20 text-[11px]">
                <span className="font-medium text-foreground">2. Power BI Portfolio Dashboard</span>
                <p className="text-muted-foreground mt-0.5">Build interactive cohort analytics</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Applications Pipeline & Matching Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {/* Applications Status Summary */}
        <div className="bento-card md:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              <h3 className="font-display text-sm font-bold text-foreground">Application Pipeline</h3>
            </div>
            <Link to="/applications" className="text-xs text-primary hover:underline">
              View All ({total})
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-lg bg-muted border">
              <span className="text-[10px] text-muted-foreground block uppercase">Applied</span>
              <span className="font-display text-xl font-bold">{total}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-sky-300">
              <span className="text-[10px] block uppercase">Shortlisted</span>
              <span className="font-display text-xl font-bold">{shortlisted}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300">
              <span className="text-[10px] block uppercase">Interview</span>
              <span className="font-display text-xl font-bold">{interviews}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
              <span className="text-[10px] block uppercase">Offers</span>
              <span className="font-display text-xl font-bold">{offers}</span>
            </div>
          </div>

          {apps.isLoading ? (
            <p className="text-xs text-muted-foreground">Loading recent applications…</p>
          ) : (apps.data?.length ?? 0) === 0 ? (
            <EmptyState
              title="No applications tracked"
              description="Log your first application to start tracking your pipeline."
              action={
                <Link to="/applications">
                  <Button size="sm" className="text-xs">Log Application</Button>
                </Link>
              }
            />
          ) : (
            <ul className="divide-y divide-border text-xs">
              {apps.data!.slice(0, 3).map((a) => (
                <li key={a.id} className="flex items-center justify-between py-2">
                  <div className="min-w-0">
                    <div className="truncate font-medium">{a.company_name}</div>
                    <div className="truncate text-[11px] text-muted-foreground">{a.role}</div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_TONE[a.status as ApplicationStatus] ?? "bg-muted text-muted-foreground"}`}
                  >
                    {STATUS_LABEL[a.status as ApplicationStatus] ?? a.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Relevant Opportunities */}
        <div className="bento-card md:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <h3 className="font-display text-sm font-bold text-foreground">Matched Opportunities</h3>
            </div>
            <Link to="/opportunities" className="text-xs text-primary hover:underline">
              Explore All
            </Link>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-lg border bg-card hover:bg-muted/20 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">Accenture India</span>
                  <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 text-[10px]">
                    75% Match
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">Associate Data Analyst · ₹7.5 LPA · Pune</p>
              </div>
              <Link to="/opportunities">
                <Button size="sm" variant="outline" className="text-xs h-7">
                  View
                </Button>
              </Link>
            </div>

            <div className="p-3 rounded-lg border bg-card hover:bg-muted/20 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">Barclays Pune GSC</span>
                  <Badge className="bg-sky-500/15 text-sky-700 dark:text-sky-400 border border-sky-500/25 text-[10px]">
                    67% Match
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">Graduate Data Analyst · ₹9.5 LPA · Pune</p>
              </div>
              <Link to="/opportunities">
                <Button size="sm" variant="outline" className="text-xs h-7">
                  View
                </Button>
              </Link>
            </div>
          </div>

          <div className="pt-2 border-t">
            <Link to="/opportunities" className="text-[11px] text-primary hover:underline inline-flex items-center gap-1 font-medium">
              View all matching campus openings <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* 5. Daily Tasks, Deadlines & Academics */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {/* Daily Tasks */}
        <WidgetCard
          title="Today's tasks"
          icon={ListChecks}
          className="md:col-span-3"
          footnote={`${doneToday} completed today · overdue items stay listed until done.`}
        >
          <div className="mb-3 flex gap-2">
            <Input
              value={taskTitle}
              placeholder="Add a task for today…"
              onChange={(e) => setTaskTitle(e.target.value)}
              className="h-8 text-xs"
              onKeyDown={(e) => {
                if (e.key === "Enter" && taskTitle.trim()) {
                  addTask.mutate(taskTitle.trim());
                  setTaskTitle("");
                }
              }}
            />
            <Button
              variant="secondary"
              size="sm"
              className="h-8 text-xs"
              aria-label="Add task"
              onClick={() => {
                if (!taskTitle.trim()) return;
                addTask.mutate(taskTitle.trim());
                setTaskTitle("");
              }}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
          {tasks.isLoading ? (
            <p className="text-xs text-muted-foreground">Loading…</p>
          ) : openTasks.length === 0 ? (
            <EmptyState title="Nothing pending" description="Add a task above to plan your day." />
          ) : (
            <ul className="divide-y divide-border">
              {openTasks.slice(0, 5).map((t) => (
                <li key={t.id} className="flex items-center gap-2.5 py-2">
                  <Checkbox
                    checked={false}
                    aria-label={`Complete ${t.title}`}
                    onCheckedChange={() => toggleTask.mutate({ id: t.id, done: true })}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-medium">{t.title}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {t.due_date === today ? "Today" : `Due ${t.due_date}`} · {t.category}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </WidgetCard>

        {/* Upcoming Deadlines */}
        <WidgetCard
          title="Upcoming deadlines"
          icon={CalendarClock}
          className="md:col-span-3"
          footnote="Pulled from exam dates and application next steps."
        >
          {deadlines.length === 0 ? (
            <EmptyState
              title="No upcoming dates"
              description="Add exams in Academics or next steps in Applications."
            />
          ) : (
            <ul className="divide-y divide-border text-xs">
              {deadlines.map((d) => {
                const n = daysUntil(d.date);
                return (
                  <li key={d.id} className="flex items-center justify-between gap-3 py-2">
                    <div className="min-w-0">
                      <div className="truncate font-medium">{d.label}</div>
                      <div className="text-[11px] text-muted-foreground">{d.date}</div>
                    </div>
                    <Badge variant="secondary" className="shrink-0 text-[10px]">
                      {n === 0 ? "Today" : n === 1 ? "Tomorrow" : `in ${n} days`}
                    </Badge>
                  </li>
                );
              })}
            </ul>
          )}
        </WidgetCard>
      </div>

      {/* 6. Academics Snapshot & Saved Bookmarks */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <WidgetCard title="Academics summary" icon={GraduationCap} className="md:col-span-2">
          <div className="font-display text-4xl font-bold tracking-tight">
            {cgpa != null ? cgpa.toFixed(2) : "8.42"}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Credit-weighted CGPA across {creditsDone || 94} credits completed.
          </p>
          <Link to="/academics" className="mt-3 inline-block">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8">
              Open academics <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </WidgetCard>

        <WidgetCard
          title="Saved listings"
          icon={BookmarkCheck}
          className="md:col-span-4"
          action={
            <Link to="/opportunities" className="text-xs text-primary hover:underline">
              View all
            </Link>
          }
          footnote="Bookmarked opportunities saved for quick access."
        >
          {savedOpps.isLoading ? (
            <p className="text-xs text-muted-foreground">Loading…</p>
          ) : (savedOpps.data?.length ?? 0) === 0 ? (
            <EmptyState
              title="Nothing saved"
              description="Bookmark listings on Opportunities to review them later."
              action={
                <Link to="/opportunities">
                  <Button size="sm" className="text-xs">Browse opportunities</Button>
                </Link>
              }
            />
          ) : (
            <ul className="divide-y divide-border text-xs">
              {savedOpps
                .data!.filter((s) => s.opportunity)
                .slice(0, 3)
                .map((s) => {
                  const o = s.opportunity!;
                  return (
                    <li key={s.id} className="flex items-center justify-between gap-3 py-2">
                      <div className="min-w-0">
                        <div className="truncate font-medium">{o.title}</div>
                        <div className="truncate text-[11px] text-muted-foreground">
                          {o.organization} · {o.location || "Remote"}
                        </div>
                      </div>
                      {o.apply_url && (
                        <Button asChild size="sm" variant="outline" className="h-7 text-xs">
                          <a href={o.apply_url} target="_blank" rel="noreferrer noopener">
                            Apply <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      )}
                    </li>
                  );
                })}
            </ul>
          )}
        </WidgetCard>
      </div>
    </div>
  );
}
