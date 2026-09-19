import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Save, Sparkles, Trash2, Download, FileText } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState, WidgetCard } from "@/components/widgets";
import { supabase } from "@/integrations/supabase/client";
import { suggestResumeSections } from "@/lib/ai.functions";

type Sections = {
  summary?: string;
  skills?: string[];
  project_bullets?: string[];
  achievement_bullets?: string[];
  education?: string;
  contact?: string;
};

type Version = {
  id: string;
  label: string;
  target_role: string | null;
  sections: Sections;
  ai_suggested: Record<string, unknown>;
  updated_at: string;
};

const lines = (s: string) =>
  s
    .split("\n")
    .map((v) => v.trim())
    .filter(Boolean);

function escapeHtml(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);
}

function exportPdf(v: Version, name: string) {
  const s = v.sections ?? {};
  const block = (title: string, items: string[]) =>
    items.length
      ? `<section><h2>${escapeHtml(title)}</h2><ul>${items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul></section>`
      : "";
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(name || v.label)} — ${escapeHtml(v.label)}</title>
<style>
  @page { margin: 16mm; }
  body { font-family: Figtree, Helvetica, Arial, sans-serif; color:#111; line-height:1.45; }
  h1 { font-size: 24px; margin:0 0 2px; letter-spacing:-0.02em; }
  .role { color:#555; font-size:13px; margin-bottom:2px; }
  .contact { color:#555; font-size:12px; }
  h2 { font-size:12px; text-transform:uppercase; letter-spacing:.08em; margin:18px 0 6px; border-bottom:1px solid #ddd; padding-bottom:3px; }
  p, li { font-size:13px; }
  ul { margin:0; padding-left:18px; }
  .skills { font-size:13px; }
</style></head><body>
<h1>${escapeHtml(name || v.label)}</h1>
${v.target_role ? `<div class="role">${escapeHtml(v.target_role)}</div>` : ""}
${s.contact ? `<div class="contact">${escapeHtml(s.contact)}</div>` : ""}
${s.summary ? `<section><h2>Summary</h2><p>${escapeHtml(s.summary)}</p></section>` : ""}
${s.education ? `<section><h2>Education</h2><p>${escapeHtml(s.education)}</p></section>` : ""}
${(s.skills ?? []).length ? `<section><h2>Skills</h2><div class="skills">${escapeHtml((s.skills ?? []).join(" · "))}</div></section>` : ""}
${block("Projects", s.project_bullets ?? [])}
${block("Achievements", s.achievement_bullets ?? [])}
</body></html>`;

  const w = window.open("", "_blank");
  if (!w) return toast.error("Allow pop-ups to export the PDF");
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 400);
}

export function ResumeStudio() {
  const qc = useQueryClient();
  const suggest = useServerFn(suggestResumeSections);
  const [selected, setSelected] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState("");
  const [newRole, setNewRole] = useState("");
  const [busy, setBusy] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const [form, setForm] = useState({
    label: "",
    target_role: "",
    contact: "",
    summary: "",
    education: "",
    skills: "",
    projects: "",
    achievements: "",
  });
  const [notes, setNotes] = useState<string[]>([]);

  const profile = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("full_name, email").maybeSingle();
      return data;
    },
  });

  const versions = useQuery({
    queryKey: ["resume_versions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resume_versions")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Version[];
    },
  });

  const current = (versions.data ?? []).find((v) => v.id === selected) ?? null;

  useEffect(() => {
    if (!current) return;
    const s = current.sections ?? {};
    setForm({
      label: current.label,
      target_role: current.target_role ?? "",
      contact: s.contact ?? "",
      summary: s.summary ?? "",
      education: s.education ?? "",
      skills: (s.skills ?? []).join(", "),
      projects: (s.project_bullets ?? []).join("\n"),
      achievements: (s.achievement_bullets ?? []).join("\n"),
    });
    setNotes([]);
  }, [current?.id]);

  async function createVersion() {
    if (!newLabel.trim()) return;
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    setBusy(true);
    const { data, error } = await supabase
      .from("resume_versions")
      .insert({
        user_id: u.user.id,
        label: newLabel.trim(),
        target_role: newRole.trim() || null,
        sections: {},
      })
      .select("id")
      .single();
    setBusy(false);
    if (error) return toast.error(error.message);
    setNewLabel("");
    setNewRole("");
    setSelected(data.id);
    qc.invalidateQueries({ queryKey: ["resume_versions"] });
    toast.success("Version created");
  }

  async function save() {
    if (!current) return;
    setBusy(true);
    const { error } = await supabase
      .from("resume_versions")
      .update({
        label: form.label.trim() || current.label,
        target_role: form.target_role.trim() || null,
        sections: {
          contact: form.contact.trim(),
          summary: form.summary.trim(),
          education: form.education.trim(),
          skills: form.skills
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean),
          project_bullets: lines(form.projects),
          achievement_bullets: lines(form.achievements),
        },
      })
      .eq("id", current.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["resume_versions"] });
  }

  async function removeVersion(v: Version) {
    const { error } = await supabase.from("resume_versions").delete().eq("id", v.id);
    if (error) return toast.error(error.message);
    if (selected === v.id) setSelected(null);
    qc.invalidateQueries({ queryKey: ["resume_versions"] });
  }

  async function runAi() {
    if (!current) return;
    setAiBusy(true);
    try {
      const res = await suggest({ data: { targetRole: form.target_role || current.target_role || "" } });
      setForm((f) => ({
        ...f,
        summary: res.summary || f.summary,
        skills: res.skills.length ? res.skills.join(", ") : f.skills,
        projects: res.project_bullets.length ? res.project_bullets.join("\n") : f.projects,
        achievements: res.achievement_bullets.length ? res.achievement_bullets.join("\n") : f.achievements,
      }));
      setNotes(res.notes ?? []);
      await supabase.from("resume_versions").update({ ai_suggested: res as never }).eq("id", current.id);
      toast.success("Wording suggested from your profile — review, then save");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not suggest wording");
    } finally {
      setAiBusy(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
      <div className="space-y-4">
        <WidgetCard title="New version" icon={Plus}>
          <div className="space-y-2">
            <Input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Label e.g. SDE — product" />
            <Input value={newRole} onChange={(e) => setNewRole(e.target.value)} placeholder="Target role (optional)" />
            <Button className="w-full" onClick={createVersion} disabled={busy || !newLabel.trim()}>
              Create
            </Button>
          </div>
        </WidgetCard>

        <WidgetCard title="Your versions" icon={FileText}>
          {versions.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (versions.data?.length ?? 0) === 0 ? (
            <EmptyState title="No versions yet" description="Create one tailored version per target role." />
          ) : (
            <ul className="space-y-1.5">
              {versions.data!.map((v) => (
                <li key={v.id} className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelected(v.id)}
                    className={`min-w-0 flex-1 rounded-md px-2.5 py-2 text-left text-sm ${
                      selected === v.id ? "bg-accent text-accent-foreground" : "hover:bg-mist"
                    }`}
                  >
                    <span className="block truncate font-medium">{v.label}</span>
                    <span className="block truncate text-xs text-muted-foreground">{v.target_role ?? "no role set"}</span>
                  </button>
                  <Button variant="ghost" size="icon" aria-label={`Delete ${v.label}`} onClick={() => removeVersion(v)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </WidgetCard>
      </div>

      {!current ? (
        <EmptyState
          title="Pick a version to edit"
          description="Each version keeps its own summary, skills and bullets so you can tailor per company."
        />
      ) : (
        <div className="space-y-4">
          <WidgetCard
            title="Edit content"
            action={
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1.5" onClick={runAi} disabled={aiBusy}>
                  <Sparkles className="h-3.5 w-3.5" /> {aiBusy ? "Thinking…" : "Suggest wording"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => exportPdf(current, profile.data?.full_name ?? "")}
                >
                  <Download className="h-3.5 w-3.5" /> PDF
                </Button>
                <Button size="sm" className="gap-1.5" onClick={save} disabled={busy}>
                  <Save className="h-3.5 w-3.5" /> {busy ? "Saving…" : "Save"}
                </Button>
              </div>
            }
            footnote="Suggestions only rearrange and phrase facts already in your Profile — nothing is invented."
          >
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Version label</Label>
                  <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Target role</Label>
                  <Input
                    value={form.target_role}
                    onChange={(e) => setForm({ ...form, target_role: e.target.value })}
                    placeholder="Backend Engineer"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Contact line</Label>
                <Input
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  placeholder="email · phone · github.com/you"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Summary</Label>
                <Textarea rows={3} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Education</Label>
                <Textarea
                  rows={2}
                  value={form.education}
                  onChange={(e) => setForm({ ...form, education: e.target.value })}
                  placeholder="B.Tech CSE, University — CGPA 8.1 (2027)"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Skills (comma separated)</Label>
                <Input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Project bullets (one per line)</Label>
                <Textarea rows={5} value={form.projects} onChange={(e) => setForm({ ...form, projects: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Achievement bullets (one per line)</Label>
                <Textarea
                  rows={4}
                  value={form.achievements}
                  onChange={(e) => setForm({ ...form, achievements: e.target.value })}
                />
              </div>
            </div>
          </WidgetCard>

          {notes.length ? (
            <WidgetCard title="What would make this stronger">
              <ul className="space-y-1 text-sm text-muted-foreground">
                {notes.map((n) => (
                  <li key={n}>· {n}</li>
                ))}
              </ul>
            </WidgetCard>
          ) : null}
        </div>
      )}
    </div>
  );
}
