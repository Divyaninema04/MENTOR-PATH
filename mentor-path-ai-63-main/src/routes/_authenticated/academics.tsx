import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { GraduationCap, BookOpen, Target, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { EmptyState, ProgressRing, SectionHeader, StatCard, WidgetCard } from "@/components/widgets";

export const Route = createFileRoute("/_authenticated/academics")({
  head: () => ({
    meta: [
      { title: "Academics Hub — PlacementPilot" },
      {
        name: "description",
        content:
          "Track your CGPA and SGPA semester by semester, plan the marks you need, and follow subject-wise study progress.",
      },
      { property: "og:title", content: "Academics Hub — PlacementPilot" },
      {
        property: "og:description",
        content: "Semester-wise CGPA tracking, target planning and subject progress in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AcademicsPage,
});

function num(v: string) {
  const n = Number(v);
  return v.trim() === "" || Number.isNaN(n) ? null : n;
}

function AcademicsPage() {
  const qc = useQueryClient();

  const profile = useQuery({
    queryKey: ["profile-full"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return null;
      const { data } = await supabase.from("profiles").select("*").eq("id", u.user.id).maybeSingle();
      return data;
    },
  });

  const semesters = useQuery({
    queryKey: ["semesters"],
    queryFn: async () => {
      const { data } = await supabase
        .from("semesters")
        .select("*")
        .order("semester_number", { ascending: true });
      return data ?? [];
    },
  });

  const subjects = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const { data } = await supabase
        .from("subjects")
        .select("*")
        .order("semester_number", { ascending: true });
      return data ?? [];
    },
  });

  const rows = semesters.data ?? [];

  const cgpa = useMemo(() => {
    const valid = rows.filter((r) => r.sgpa != null && (r.credits_earned ?? 0) > 0);
    if (!valid.length) return null;
    const credits = valid.reduce((s, r) => s + Number(r.credits_earned), 0);
    const weighted = valid.reduce((s, r) => s + Number(r.sgpa) * Number(r.credits_earned), 0);
    return credits > 0 ? weighted / credits : null;
  }, [rows]);

  const creditsDone = rows.reduce((s, r) => s + Number(r.credits_earned ?? 0), 0);
  const target = profile.data?.target_cgpa != null ? Number(profile.data.target_cgpa) : null;
  const remainingCredits = rows.reduce(
    (s, r) => s + Math.max(0, Number(r.total_credits ?? 0) - Number(r.credits_earned ?? 0)),
    0,
  );

  const requiredSgpa =
    target != null && cgpa != null && remainingCredits > 0
      ? (target * (creditsDone + remainingCredits) - cgpa * creditsDone) / remainingCredits
      : null;

  const upsertSemester = useMutation({
    mutationFn: async (input: {
      id?: string;
      semester_number: number;
      sgpa: number | null;
      credits_earned: number | null;
      total_credits: number | null;
    }) => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Not signed in");
      const { error } = await supabase.from("semesters").upsert({ ...input, user_id: u.user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["semesters"] });
      toast.success("Semester saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const removeSemester = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("semesters").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["semesters"] }),
  });

  const addSubject = useMutation({
    mutationFn: async (input: {
      name: string;
      code: string | null;
      semester_number: number | null;
      credits: number | null;
      exam_date: string | null;
    }) => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Not signed in");
      const { error } = await supabase.from("subjects").insert({ ...input, user_id: u.user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subjects"] });
      toast.success("Subject added");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const setProgress = useMutation({
    mutationFn: async ({ id, progress }: { id: string; progress: number }) => {
      const { error } = await supabase.from("subjects").update({ progress }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subjects"] }),
  });

  const removeSubject = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("subjects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subjects"] }),
  });

  const [newSem, setNewSem] = useState({ semester_number: "", sgpa: "", credits_earned: "", total_credits: "" });
  const [newSub, setNewSub] = useState({ name: "", code: "", semester_number: "", credits: "", exam_date: "" });

  const avgSubjectProgress = subjects.data?.length
    ? subjects.data.reduce((s, x) => s + Number(x.progress ?? 0), 0) / subjects.data.length
    : 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <SectionHeader
        title="Academics hub"
        description="Your semester results, CGPA target planning, and subject-wise study progress."
        action={
          <Link to="/skill-intelligence">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              Curriculum Skill Alignment
            </Button>
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Current CGPA"
          icon={GraduationCap}
          value={cgpa != null ? cgpa.toFixed(2) : "—"}
          hint={cgpa != null ? `Weighted across ${creditsDone} credits` : "Add a semester with SGPA and credits"}
        />
        <StatCard
          label="Target CGPA"
          icon={Target}
          value={target != null ? target.toFixed(2) : "—"}
          hint={
            requiredSgpa != null
              ? `Need about ${requiredSgpa.toFixed(2)} SGPA across the remaining ${remainingCredits} credits`
              : "Set a target on your profile to see what you need"
          }
        />
        <StatCard
          label="Subjects tracked"
          icon={BookOpen}
          value={subjects.data?.length ?? 0}
          hint={`Average study progress ${Math.round(avgSubjectProgress)}%`}
        />
      </div>

      <Tabs defaultValue="cgpa">
        <TabsList>
          <TabsTrigger value="cgpa">CGPA & semesters</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
        </TabsList>

        <TabsContent value="cgpa" className="mt-4 space-y-4">
          <WidgetCard
            title="Add or update a semester"
            icon={Plus}
            footnote="CGPA is calculated as a credit-weighted average of the SGPA values you enter. Nothing is estimated."
          >
            <div className="grid gap-3 sm:grid-cols-5">
              <LabeledInput
                label="Semester"
                type="number"
                value={newSem.semester_number}
                onChange={(v) => setNewSem((s) => ({ ...s, semester_number: v }))}
                placeholder="1"
              />
              <LabeledInput
                label="SGPA"
                type="number"
                step="0.01"
                value={newSem.sgpa}
                onChange={(v) => setNewSem((s) => ({ ...s, sgpa: v }))}
                placeholder="8.4"
              />
              <LabeledInput
                label="Credits earned"
                type="number"
                step="0.5"
                value={newSem.credits_earned}
                onChange={(v) => setNewSem((s) => ({ ...s, credits_earned: v }))}
                placeholder="22"
              />
              <LabeledInput
                label="Total credits"
                type="number"
                step="0.5"
                value={newSem.total_credits}
                onChange={(v) => setNewSem((s) => ({ ...s, total_credits: v }))}
                placeholder="24"
              />
              <div className="flex items-end">
                <Button
                  className="w-full"
                  disabled={upsertSemester.isPending}
                  onClick={() => {
                    const n = num(newSem.semester_number);
                    if (n == null) {
                      toast.error("Enter a semester number");
                      return;
                    }
                    const existing = rows.find((r) => r.semester_number === n);
                    upsertSemester.mutate({
                      ...(existing ? { id: existing.id } : {}),
                      semester_number: n,
                      sgpa: num(newSem.sgpa),
                      credits_earned: num(newSem.credits_earned),
                      total_credits: num(newSem.total_credits),
                    });
                    setNewSem({ semester_number: "", sgpa: "", credits_earned: "", total_credits: "" });
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          </WidgetCard>

          <WidgetCard title="Semester record" icon={GraduationCap}>
            {semesters.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : rows.length === 0 ? (
              <EmptyState
                title="No semesters yet"
                description="Add your first semester above to start tracking your CGPA."
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Semester</TableHead>
                    <TableHead>SGPA</TableHead>
                    <TableHead>Credits earned</TableHead>
                    <TableHead>Total credits</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">Sem {r.semester_number}</TableCell>
                      <TableCell>{r.sgpa != null ? Number(r.sgpa).toFixed(2) : "—"}</TableCell>
                      <TableCell>{r.credits_earned ?? "—"}</TableCell>
                      <TableCell>{r.total_credits ?? "—"}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Delete semester ${r.semester_number}`}
                          onClick={() => removeSemester.mutate(r.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </WidgetCard>
        </TabsContent>

        <TabsContent value="subjects" className="mt-4 space-y-4">
          <WidgetCard title="Add a subject" icon={Plus}>
            <div className="grid gap-3 sm:grid-cols-5">
              <LabeledInput
                label="Subject name"
                value={newSub.name}
                onChange={(v) => setNewSub((s) => ({ ...s, name: v }))}
                placeholder="Operating Systems"
              />
              <LabeledInput
                label="Code"
                value={newSub.code}
                onChange={(v) => setNewSub((s) => ({ ...s, code: v }))}
                placeholder="CS304"
              />
              <LabeledInput
                label="Semester"
                type="number"
                value={newSub.semester_number}
                onChange={(v) => setNewSub((s) => ({ ...s, semester_number: v }))}
                placeholder="5"
              />
              <LabeledInput
                label="Credits"
                type="number"
                step="0.5"
                value={newSub.credits}
                onChange={(v) => setNewSub((s) => ({ ...s, credits: v }))}
                placeholder="4"
              />
              <LabeledInput
                label="Exam date"
                type="date"
                value={newSub.exam_date}
                onChange={(v) => setNewSub((s) => ({ ...s, exam_date: v }))}
              />
            </div>
            <div className="mt-3 flex justify-end">
              <Button
                disabled={addSubject.isPending}
                onClick={() => {
                  if (!newSub.name.trim()) {
                    toast.error("Enter a subject name");
                    return;
                  }
                  addSubject.mutate({
                    name: newSub.name.trim(),
                    code: newSub.code.trim() || null,
                    semester_number: num(newSub.semester_number),
                    credits: num(newSub.credits),
                    exam_date: newSub.exam_date || null,
                  });
                  setNewSub({ name: "", code: "", semester_number: "", credits: "", exam_date: "" });
                }}
              >
                Add subject
              </Button>
            </div>
          </WidgetCard>

          {subjects.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (subjects.data?.length ?? 0) === 0 ? (
            <EmptyState
              title="No subjects yet"
              description="Add the subjects you're studying this semester to track progress and exam dates."
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {subjects.data!.map((s) => (
                <div key={s.id} className="bento-card">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate font-display text-lg font-semibold">{s.name}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                        {s.code ? <Badge variant="secondary">{s.code}</Badge> : null}
                        {s.semester_number ? <Badge variant="secondary">Sem {s.semester_number}</Badge> : null}
                        {s.credits ? <Badge variant="secondary">{s.credits} credits</Badge> : null}
                        {s.exam_date ? <span>Exam {s.exam_date}</span> : null}
                      </div>
                    </div>
                    <ProgressRing value={Number(s.progress ?? 0)} size={64} />
                  </div>
                  <Progress value={Number(s.progress ?? 0)} className="mt-4" />
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="flex gap-1.5">
                      {[25, 50, 75, 100].map((p) => (
                        <Button
                          key={p}
                          size="sm"
                          variant="outline"
                          onClick={() => setProgress.mutate({ id: s.id, progress: p })}
                        >
                          {p}%
                        </Button>
                      ))}
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Delete ${s.name}`}
                      onClick={() => removeSubject.mutate(s.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  step?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} {...rest} />
    </div>
  );
}
