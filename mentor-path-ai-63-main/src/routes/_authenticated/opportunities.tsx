import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Bookmark,
  BookmarkCheck,
  CalendarClock,
  ExternalLink,
  MapPin,
  Search,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Briefcase,
  Plus,
  Target,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EligibilityBadge, EligibilityReasons } from "@/components/eligibility-badge";
import { SourceBadge } from "@/components/source-badge";
import { EmptyState, SectionHeader } from "@/components/widgets";
import { supabase } from "@/integrations/supabase/client";
import { fetchVerifiedOpportunities } from "@/lib/ai.functions";
import { OPPORTUNITY_CATEGORIES } from "@/lib/career";
import { evaluateEligibility } from "@/lib/eligibility";
import { evaluateOpportunitySkillMatch } from "@/data/placement-outcomes-mentor-data";

export const Route = createFileRoute("/_authenticated/opportunities")({
  head: () => ({
    meta: [
      { title: "Opportunities — PlacementPilot" },
      {
        name: "description",
        content: "Verified jobs, internships, hackathons, exams and scholarships with sources, deadlines and eligibility checks.",
      },
      { property: "og:title", content: "Opportunities — PlacementPilot" },
      { property: "og:description", content: "Verified student opportunities with source links and eligibility reasons." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OpportunitiesPage,
});

type Opportunity = {
  id: string;
  title: string;
  organization: string;
  category: string;
  description: string | null;
  eligibility_text: string | null;
  deadline: string | null;
  location: string | null;
  state: string | null;
  education_level: string | null;
  branches: string[] | null;
  min_cgpa: number | null;
  graduation_years: number[] | null;
  apply_url: string | null;
  source_name: string | null;
  source_url: string | null;
  last_verified_at: string | null;
  verification_status: string | null;
};

function OpportunitiesPage() {
  const qc = useQueryClient();
  const [category, setCategory] = useState<string>(OPPORTUNITY_CATEGORIES[0]);
  const [q, setQ] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [eligibleOnly, setEligibleOnly] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const [skillMatchOnly, setSkillMatchOnly] = useState(false);
  const [open, setOpen] = useState(false);
  const [fetchQuery, setFetchQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const ingest = useServerFn(fetchVerifiedOpportunities);

  const profile = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("cgpa, branch, state, graduation_year, degree, skills")
        .maybeSingle();
      return data;
    },
  });

  const listings = useQuery({
    queryKey: ["opportunities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Opportunity[];
    },
  });

  const saved = useQuery({
    queryKey: ["saved_opportunities"],
    queryFn: async () => {
      const { data } = await supabase.from("saved_opportunities").select("id, opportunity_id");
      return data ?? [];
    },
  });
  const savedMap = new Map((saved.data ?? []).map((s) => [s.opportunity_id, s.id]));

  const states = useMemo(
    () => Array.from(new Set((listings.data ?? []).map((l) => l.state).filter(Boolean) as string[])).sort(),
    [listings.data],
  );

  const studentSkills = useMemo(() => {
    return ((profile.data?.skills ?? []) as string[]).length
      ? ((profile.data?.skills ?? []) as string[])
      : ["Python", "Relational Databases", "Excel", "SQL"];
  }, [profile.data?.skills]);

  const student = {
    cgpa: profile.data?.cgpa ?? null,
    branch: profile.data?.branch ?? null,
    state: profile.data?.state ?? null,
    graduation_year: profile.data?.graduation_year ?? null,
    degree: profile.data?.degree ?? null,
  };

  const rows = (listings.data ?? [])
    .filter((l) => l.category === category)
    .filter((l) =>
      (l.title + " " + l.organization + " " + (l.description ?? "")).toLowerCase().includes(q.toLowerCase()),
    )
    .filter((l) => stateFilter === "all" || l.state === stateFilter)
    .filter((l) => !savedOnly || savedMap.has(l.id))
    .map((l) => {
      const skillMatch = evaluateOpportunitySkillMatch(l.title, l.category, studentSkills);
      return {
        row: l,
        skillMatch,
        result: evaluateEligibility(student, {
          min_cgpa: l.min_cgpa,
          branches: l.branches,
          state: l.state,
          graduation_years: l.graduation_years,
          education_level: l.education_level,
        }),
      };
    })
    .filter((x) => !eligibleOnly || x.result.verdict !== "not_eligible")
    .filter((x) => !skillMatchOnly || x.skillMatch.matchPercentage >= 50);

  async function trackInApplications(
    row: Opportunity,
    skillMatch: ReturnType<typeof evaluateOpportunitySkillMatch>
  ) {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return toast.error("Please log in to track applications");

    const notes = `[Opportunity ID: ${row.id}] Match: ${skillMatch.matchPercentage}%. Required: ${skillMatch.requiredSkills.map((s) => s.skill).join(", ")}. Missing: ${skillMatch.missingSkills.map((s) => s.skill).join(", ") || "None"}.`;

    const { error } = await supabase.from("applications").insert({
      user_id: u.user.id,
      company_name: row.organization,
      role: row.title,
      status: "applied",
      location: row.location || null,
      notes,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`Tracked "${row.title}" at ${row.organization} into Applications!`);
      qc.invalidateQueries({ queryKey: ["applications"] });
    }
  }

  async function onFetch() {
    setBusy(true);
    try {
      const res = await ingest({ data: { category, query: fetchQuery.trim() } });
      toast.success(`Added ${res.added} verified ${category.toLowerCase()} listing(s)`);
      setOpen(false);
      setFetchQuery("");
      qc.invalidateQueries({ queryKey: ["opportunities"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not fetch listings");
    } finally {
      setBusy(false);
    }
  }

  async function toggleSave(id: string) {
    const existing = savedMap.get(id);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    if (existing) await supabase.from("saved_opportunities").delete().eq("id", existing);
    else await supabase.from("saved_opportunities").insert({ user_id: u.user.id, opportunity_id: id });
    qc.invalidateQueries({ queryKey: ["saved_opportunities"] });
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <SectionHeader
        title="Opportunities"
        description="Every listing is pulled from a live source and shows where it came from. Unstated details stay blank rather than guessed."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1.5">
                <Sparkles className="h-4 w-4" /> Fetch verified listings
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Fetch {category.toLowerCase()}</DialogTitle>
                <DialogDescription>
                  We search the live web and keep only listings we can attach a source link to.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <Label>Narrow the search (optional)</Label>
                <Input
                  autoFocus
                  value={fetchQuery}
                  onChange={(e) => setFetchQuery(e.target.value)}
                  placeholder="e.g. summer internship data science Madhya Pradesh"
                />
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpen(false)} disabled={busy}>
                  Cancel
                </Button>
                <Button onClick={onFetch} disabled={busy}>
                  {busy ? "Searching…" : "Fetch"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Tabs value={category} onValueChange={setCategory}>
        <TabsList className="flex-wrap">
          {OPPORTUNITY_CATEGORIES.map((c) => (
            <TabsTrigger key={c} value={c}>
              {c}
            </TabsTrigger>
          ))}
        </TabsList>

        {OPPORTUNITY_CATEGORIES.map((c) => (
          <TabsContent key={c} value={c} className="space-y-4 pt-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[220px] flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={`Search ${c.toLowerCase()}…`}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger className="w-[190px]">
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All states</SelectItem>
                  {states.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant={eligibleOnly ? "default" : "outline"} onClick={() => setEligibleOnly((v) => !v)}>
                Hide not eligible
              </Button>
              <Button
                variant={savedOnly ? "default" : "outline"}
                className="gap-1.5"
                onClick={() => setSavedOnly((v) => !v)}
              >
                <BookmarkCheck className="h-4 w-4" /> Saved only
              </Button>
              <Button
                variant={skillMatchOnly ? "default" : "outline"}
                className="gap-1.5"
                onClick={() => setSkillMatchOnly((v) => !v)}
              >
                <Target className="h-4 w-4" /> High Skill Match (≥50%)
              </Button>
            </div>

            {listings.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading listings…</p>
            ) : rows.length === 0 ? (
              <EmptyState
                title={`No ${c.toLowerCase()} yet`}
                description="Fetch verified listings to fill this category. Nothing is pre-seeded, so what you see here is always sourced."
              />
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {rows.map(({ row, skillMatch, result }) => (
                  <div key={row.id} className="bento-card space-y-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-display text-lg font-semibold leading-tight">{row.title}</h3>
                        <p className="text-sm text-muted-foreground">{row.organization}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={savedMap.has(row.id) ? "Remove from saved" : "Save"}
                        onClick={() => toggleSave(row.id)}
                      >
                        {savedMap.has(row.id) ? (
                          <BookmarkCheck className="h-4 w-4 text-primary" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {row.description ? (
                      <p className="line-clamp-2 text-xs text-muted-foreground">{row.description}</p>
                    ) : null}

                    {/* SECTION 20: SKILL MATCHING PANEL */}
                    <div className="rounded-xl border border-primary/20 bg-muted/30 p-3 space-y-2.5 text-xs">
                      <div className="flex items-center justify-between border-b border-border/80 pb-2">
                        <div className="flex items-center gap-1.5">
                          <Target className="h-4 w-4 text-primary" />
                          <span className="font-bold text-foreground">Skill Matching</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Badge
                            className={`text-[10px] font-bold ${
                              skillMatch.matchPercentage >= 70
                                ? "bg-emerald-600 text-white"
                                : skillMatch.matchPercentage >= 40
                                ? "bg-blue-600 text-white"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {skillMatch.matchPercentage}% Match
                          </Badge>
                          <Badge variant="outline" className="text-[9px] font-mono">
                            {skillMatch.matchTier}
                          </Badge>
                        </div>
                      </div>

                      {/* Required Skills */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                          Required Skills ({skillMatch.requiredSkills.length}):
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {skillMatch.requiredSkills.map((req) => {
                            const isPossessed = skillMatch.matchingSkills.includes(req.skill);
                            return (
                              <span
                                key={req.skill}
                                className={`rounded px-1.5 py-0.5 text-[10px] font-medium border flex items-center gap-1 ${
                                  isPossessed
                                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                                    : "bg-background text-muted-foreground border-border"
                                }`}
                              >
                                {isPossessed ? <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" /> : null}
                                {req.skill}
                                <span className="text-[8px] opacity-70 font-mono">({req.importance})</span>
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* Missing Skills Alert */}
                      {skillMatch.missingSkills.length > 0 ? (
                        <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2 flex items-start gap-1.5 text-amber-800 dark:text-amber-300">
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-600" />
                          <span className="text-[10px] leading-tight">
                            <strong>Missing skills:</strong> {skillMatch.missingSkills.map((s) => s.skill).join(", ")}
                          </span>
                        </div>
                      ) : (
                        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-1.5 flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          <span className="text-[10px] font-medium">All core technical competencies matched!</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <EligibilityBadge result={result} />
                      {row.deadline ? (
                        <span className="inline-flex items-center gap-1">
                          <CalendarClock className="h-3 w-3" /> {new Date(row.deadline).toLocaleDateString()}
                        </span>
                      ) : null}
                      {row.location ? (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {row.location}
                        </span>
                      ) : null}
                      {row.min_cgpa != null ? <Badge variant="secondary">CGPA ≥ {row.min_cgpa}</Badge> : null}
                    </div>

                    <EligibilityReasons result={result} />

                    {row.eligibility_text ? (
                      <p className="rounded-md bg-mist/60 p-2 text-xs text-muted-foreground">{row.eligibility_text}</p>
                    ) : null}

                    <SourceBadge
                      sourceName={row.source_name}
                      sourceUrl={row.source_url}
                      lastVerifiedAt={row.last_verified_at}
                      status={row.verification_status}
                    />

                    {/* Action Buttons: Track in Applications & Apply */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => trackInApplications(row, skillMatch)}
                        className="gap-1.5 text-xs h-8"
                      >
                        <Briefcase className="h-3.5 w-3.5 text-primary" />
                        Track in Applications
                      </Button>

                      {row.apply_url ? (
                        <Button asChild size="sm" className="gap-1.5 text-xs h-8">
                          <a href={row.apply_url} target="_blank" rel="noreferrer noopener">
                            Apply <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
