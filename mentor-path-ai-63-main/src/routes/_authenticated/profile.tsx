import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — PlacementPilot" },
      {
        name: "description",
        content:
          "Keep your academics, skills, projects, certifications and coding profiles up to date for accurate eligibility checks and mentoring.",
      },
      { property: "og:title", content: "Your Profile — PlacementPilot" },
      {
        property: "og:description",
        content: "Academics, skills, projects and career preferences powering your placement plan.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

type Project = { title: string; description: string; link: string };
type Certification = { name: string; issuer: string; year: string };

type ProfileForm = {
  full_name: string;
  college: string;
  university: string;
  state: string;
  degree: string;
  course: string;
  branch: string;
  year_of_study: string;
  current_semester: string;
  graduation_year: string;
  cgpa: string;
  target_cgpa: string;
  skills: string[];
  career_interests: string[];
  preferred_roles: string[];
  dream_companies: string[];
  achievements: string;
  projects: Project[];
  certifications: Certification[];
  github: string;
  leetcode: string;
  linkedin: string;
};

const EMPTY: ProfileForm = {
  full_name: "",
  college: "",
  university: "",
  state: "",
  degree: "",
  course: "",
  branch: "",
  year_of_study: "",
  current_semester: "",
  graduation_year: "",
  cgpa: "",
  target_cgpa: "",
  skills: [],
  career_interests: [],
  preferred_roles: [],
  dream_companies: [],
  achievements: "",
  projects: [],
  certifications: [],
  github: "",
  leetcode: "",
  linkedin: "",
};

type ChipField = "skills" | "career_interests" | "preferred_roles" | "dream_companies";

function ProfilePage() {
  const qc = useQueryClient();
  const [form, setForm] = useState<ProfileForm>(EMPTY);
  const [chipInputs, setChipInputs] = useState<Record<ChipField, string>>({
    skills: "",
    career_interests: "",
    preferred_roles: "",
    dream_companies: "",
  });
  const [saving, setSaving] = useState(false);

  const q = useQuery({
    queryKey: ["profile-full"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return null;
      const { data } = await supabase.from("profiles").select("*").eq("id", u.user.id).maybeSingle();
      return data;
    },
  });

  useEffect(() => {
    if (!q.data) return;
    const coding = (q.data.coding_profiles ?? {}) as Record<string, string>;
    setForm({
      full_name: q.data.full_name ?? "",
      college: q.data.college ?? "",
      university: q.data.university ?? "",
      state: q.data.state ?? "",
      degree: q.data.degree ?? "",
      course: q.data.course ?? "",
      branch: q.data.branch ?? "",
      year_of_study: q.data.year_of_study?.toString() ?? "",
      current_semester: q.data.current_semester?.toString() ?? "",
      graduation_year: q.data.graduation_year?.toString() ?? "",
      cgpa: q.data.cgpa?.toString() ?? "",
      target_cgpa: q.data.target_cgpa?.toString() ?? "",
      skills: q.data.skills ?? [],
      career_interests: q.data.career_interests ?? [],
      preferred_roles: q.data.preferred_roles ?? [],
      dream_companies: q.data.dream_companies ?? [],
      achievements: q.data.achievements ?? "",
      projects: Array.isArray(q.data.projects) ? (q.data.projects as unknown as Project[]) : [],
      certifications: Array.isArray(q.data.certifications)
        ? (q.data.certifications as unknown as Certification[])
        : [],
      github: coding.github ?? "",
      leetcode: coding.leetcode ?? "",
      linkedin: coding.linkedin ?? "",
    });
  }, [q.data]);

  const setField = <K extends keyof ProfileForm>(k: K, v: ProfileForm[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function onSave() {
    setSaving(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Not signed in");
      const payload = {
        id: u.user.id,
        full_name: form.full_name || null,
        college: form.college || null,
        university: form.university || null,
        state: form.state || null,
        degree: form.degree || null,
        course: form.course || null,
        branch: form.branch || null,
        year_of_study: form.year_of_study ? Number(form.year_of_study) : null,
        current_semester: form.current_semester ? Number(form.current_semester) : null,
        graduation_year: form.graduation_year ? Number(form.graduation_year) : null,
        cgpa: form.cgpa ? Number(form.cgpa) : null,
        target_cgpa: form.target_cgpa ? Number(form.target_cgpa) : null,
        skills: form.skills,
        career_interests: form.career_interests,
        preferred_roles: form.preferred_roles,
        dream_companies: form.dream_companies,
        achievements: form.achievements || null,
        projects: form.projects.filter((p) => p.title.trim()),
        certifications: form.certifications.filter((c) => c.name.trim()),
        coding_profiles: {
          ...(form.github ? { github: form.github } : {}),
          ...(form.leetcode ? { leetcode: form.leetcode } : {}),
          ...(form.linkedin ? { linkedin: form.linkedin } : {}),
        },
      };
      const { error } = await supabase.from("profiles").upsert(payload);
      if (error) throw error;
      toast.success("Profile saved");
      qc.invalidateQueries({ queryKey: ["profile"] });
      qc.invalidateQueries({ queryKey: ["profile-full"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  function addChip(list: ChipField) {
    const v = chipInputs[list].trim();
    if (!v) return;
    setForm((f) => ({ ...f, [list]: Array.from(new Set([...f[list], v])) }));
    setChipInputs((s) => ({ ...s, [list]: "" }));
  }
  function removeChip(list: ChipField, value: string) {
    setForm((f) => ({ ...f, [list]: f[list].filter((x) => x !== value) }));
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Your profile</h1>
        <p className="text-sm text-muted-foreground">
          Everything here powers eligibility checks, your academics hub and tailored mentoring.
        </p>
      </div>

      <div className="bento-card space-y-4">
        <h2 className="font-display text-lg font-semibold">Basics</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name">
            <Input value={form.full_name} onChange={(e) => setField("full_name", e.target.value)} />
          </Field>
          <Field label="College">
            <Input
              value={form.college}
              onChange={(e) => setField("college", e.target.value)}
              placeholder="Your college"
            />
          </Field>
          <Field label="University">
            <Input
              value={form.university}
              onChange={(e) => setField("university", e.target.value)}
              placeholder="Affiliating university"
            />
          </Field>
          <Field label="State">
            <Input
              value={form.state}
              onChange={(e) => setField("state", e.target.value)}
              placeholder="Madhya Pradesh"
            />
          </Field>
        </div>
      </div>

      <div className="bento-card space-y-4">
        <h2 className="font-display text-lg font-semibold">Academics</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Degree">
            <Input
              value={form.degree}
              onChange={(e) => setField("degree", e.target.value)}
              placeholder="B.Tech / M.Tech / BCA"
            />
          </Field>
          <Field label="Course / Program">
            <Input
              value={form.course}
              onChange={(e) => setField("course", e.target.value)}
              placeholder="Computer Science"
            />
          </Field>
          <Field label="Branch">
            <Input value={form.branch} onChange={(e) => setField("branch", e.target.value)} placeholder="CSE" />
          </Field>
          <Field label="Current year">
            <Input
              type="number"
              min={1}
              max={6}
              value={form.year_of_study}
              onChange={(e) => setField("year_of_study", e.target.value)}
              placeholder="3"
            />
          </Field>
          <Field label="Current semester">
            <Input
              type="number"
              min={1}
              max={12}
              value={form.current_semester}
              onChange={(e) => setField("current_semester", e.target.value)}
              placeholder="5"
            />
          </Field>
          <Field label="Graduation year">
            <Input
              type="number"
              value={form.graduation_year}
              onChange={(e) => setField("graduation_year", e.target.value)}
              placeholder="2026"
            />
          </Field>
          <Field label="CGPA">
            <Input
              type="number"
              step="0.01"
              min={0}
              max={10}
              value={form.cgpa}
              onChange={(e) => setField("cgpa", e.target.value)}
              placeholder="8.5"
            />
          </Field>
          <Field label="Target CGPA">
            <Input
              type="number"
              step="0.01"
              min={0}
              max={10}
              value={form.target_cgpa}
              onChange={(e) => setField("target_cgpa", e.target.value)}
              placeholder="9.0"
            />
          </Field>
        </div>
      </div>

      <div className="bento-card space-y-4">
        <h2 className="font-display text-lg font-semibold">Skills</h2>
        <ChipInput
          value={chipInputs.skills}
          onChange={(v) => setChipInputs((s) => ({ ...s, skills: v }))}
          onAdd={() => addChip("skills")}
          placeholder="React, Python, DSA…"
        />
        <ChipList items={form.skills} onRemove={(v) => removeChip("skills", v)} />
      </div>

      <div className="bento-card space-y-4">
        <h2 className="font-display text-lg font-semibold">Career preferences</h2>
        <div className="space-y-2">
          <Label>Interests</Label>
          <ChipInput
            value={chipInputs.career_interests}
            onChange={(v) => setChipInputs((s) => ({ ...s, career_interests: v }))}
            onAdd={() => addChip("career_interests")}
            placeholder="Software engineering, Data science…"
          />
          <ChipList items={form.career_interests} onRemove={(v) => removeChip("career_interests", v)} />
        </div>
        <div className="space-y-2">
          <Label>Preferred roles</Label>
          <ChipInput
            value={chipInputs.preferred_roles}
            onChange={(v) => setChipInputs((s) => ({ ...s, preferred_roles: v }))}
            onAdd={() => addChip("preferred_roles")}
            placeholder="Backend Developer, ML Engineer…"
          />
          <ChipList items={form.preferred_roles} onRemove={(v) => removeChip("preferred_roles", v)} />
        </div>
        <div className="space-y-2">
          <Label>Dream companies</Label>
          <ChipInput
            value={chipInputs.dream_companies}
            onChange={(v) => setChipInputs((s) => ({ ...s, dream_companies: v }))}
            onAdd={() => addChip("dream_companies")}
            placeholder="Google, Stripe…"
          />
          <ChipList items={form.dream_companies} onRemove={(v) => removeChip("dream_companies", v)} />
        </div>
      </div>

      <div className="bento-card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Projects</h2>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() =>
              setField("projects", [...form.projects, { title: "", description: "", link: "" }])
            }
          >
            Add project
          </Button>
        </div>
        {form.projects.length === 0 ? (
          <p className="text-sm text-muted-foreground">No projects added yet.</p>
        ) : (
          form.projects.map((p, i) => (
            <div key={i} className="space-y-2 rounded-lg border border-border p-3">
              <div className="flex gap-2">
                <Input
                  value={p.title}
                  placeholder="Project title"
                  onChange={(e) =>
                    setField(
                      "projects",
                      form.projects.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)),
                    )
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Remove project"
                  onClick={() => setField("projects", form.projects.filter((_, j) => j !== i))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Input
                value={p.link}
                placeholder="Link (GitHub / live demo)"
                onChange={(e) =>
                  setField(
                    "projects",
                    form.projects.map((x, j) => (j === i ? { ...x, link: e.target.value } : x)),
                  )
                }
              />
              <Textarea
                rows={2}
                value={p.description}
                placeholder="What it does and what you built"
                onChange={(e) =>
                  setField(
                    "projects",
                    form.projects.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)),
                  )
                }
              />
            </div>
          ))
        )}
      </div>

      <div className="bento-card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Certifications</h2>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() =>
              setField("certifications", [...form.certifications, { name: "", issuer: "", year: "" }])
            }
          >
            Add certification
          </Button>
        </div>
        {form.certifications.length === 0 ? (
          <p className="text-sm text-muted-foreground">No certifications added yet.</p>
        ) : (
          form.certifications.map((c, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={c.name}
                placeholder="Certification"
                onChange={(e) =>
                  setField(
                    "certifications",
                    form.certifications.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)),
                  )
                }
              />
              <Input
                value={c.issuer}
                placeholder="Issuer"
                onChange={(e) =>
                  setField(
                    "certifications",
                    form.certifications.map((x, j) => (j === i ? { ...x, issuer: e.target.value } : x)),
                  )
                }
              />
              <Input
                className="w-24"
                value={c.year}
                placeholder="Year"
                onChange={(e) =>
                  setField(
                    "certifications",
                    form.certifications.map((x, j) => (j === i ? { ...x, year: e.target.value } : x)),
                  )
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Remove certification"
                onClick={() =>
                  setField("certifications", form.certifications.filter((_, j) => j !== i))
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>

      <div className="bento-card space-y-4">
        <h2 className="font-display text-lg font-semibold">Coding & social profiles</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="GitHub">
            <Input value={form.github} onChange={(e) => setField("github", e.target.value)} placeholder="github.com/you" />
          </Field>
          <Field label="LeetCode">
            <Input
              value={form.leetcode}
              onChange={(e) => setField("leetcode", e.target.value)}
              placeholder="leetcode.com/u/you"
            />
          </Field>
          <Field label="LinkedIn">
            <Input
              value={form.linkedin}
              onChange={(e) => setField("linkedin", e.target.value)}
              placeholder="linkedin.com/in/you"
            />
          </Field>
        </div>
      </div>

      <div className="bento-card space-y-4">
        <h2 className="font-display text-lg font-semibold">Achievements</h2>
        <Textarea
          rows={4}
          value={form.achievements}
          onChange={(e) => setField("achievements", e.target.value)}
          placeholder="Hackathons won, open-source, papers, leadership…"
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={onSave} disabled={saving}>
          {saving ? "Saving…" : "Save profile"}
        </Button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function ChipInput({
  value,
  onChange,
  onAdd,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  onAdd: () => void;
  placeholder?: string;
}) {
  return (
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onAdd();
          }
        }}
        placeholder={placeholder}
      />
      <Button type="button" variant="secondary" onClick={onAdd}>
        Add
      </Button>
    </div>
  );
}

function ChipList({ items, onRemove }: { items: string[]; onRemove: (v: string) => void }) {
  if (!items.length) return <p className="text-sm text-muted-foreground">Nothing added yet.</p>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((s) => (
        <Badge
          key={s}
          variant="secondary"
          className="cursor-pointer gap-1"
          onClick={() => onRemove(s)}
          title="Click to remove"
        >
          {s} <span className="text-muted-foreground">×</span>
        </Badge>
      ))}
    </div>
  );
}
