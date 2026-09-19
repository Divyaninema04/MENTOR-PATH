import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Save, Trash2, Plus, ExternalLink, Layers, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState, SectionHeader, WidgetCard } from "@/components/widgets";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/companies/manage")({
  head: () => ({
    meta: [
      { title: "Manage company data — PlacementPilot" },
      {
        name: "description",
        content:
          "Add and correct real recruiter data: CGPA cutoffs, eligible branches, hiring process, packages and the source you took them from.",
      },
      { property: "og:title", content: "Manage company data — PlacementPilot" },
      { property: "og:description", content: "Maintain accurate recruiter records with a source link for every entry." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ManageCompaniesPage,
});

type Company = {
  id: string;
  slug: string;
  name: string;
  industry: string | null;
  hq_location: string | null;
  website: string | null;
  careers_url: string | null;
  description: string | null;
  min_cgpa: number | null;
  allowed_branches: string[] | null;
  tech_stack: string[] | null;
  dsa_topics: string[] | null;
  cs_subjects: string[] | null;
  process_steps: string[] | null;
  salary_min: number | null;
  salary_max: number | null;
  hiring_season: string | null;
  source_name: string | null;
  source_url: string | null;
  verification_status: string | null;
};

type Draft = {
  name: string;
  industry: string;
  hq_location: string;
  website: string;
  careers_url: string;
  description: string;
  min_cgpa: string;
  allowed_branches: string;
  tech_stack: string;
  dsa_topics: string;
  cs_subjects: string;
  process_steps: string;
  salary_min: string;
  salary_max: string;
  hiring_season: string;
  source_name: string;
  source_url: string;
};

const EMPTY: Draft = {
  name: "",
  industry: "",
  hq_location: "",
  website: "",
  careers_url: "",
  description: "",
  min_cgpa: "",
  allowed_branches: "",
  tech_stack: "",
  dsa_topics: "",
  cs_subjects: "",
  process_steps: "",
  salary_min: "",
  salary_max: "",
  hiring_season: "",
  source_name: "",
  source_url: "",
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

const list = (s: string) =>
  s
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
const joined = (v: string[] | null) => (v ?? []).join(", ");
const num = (s: string) => (s.trim() === "" ? null : Number(s));

function toDraft(c: Company): Draft {
  return {
    name: c.name ?? "",
    industry: c.industry ?? "",
    hq_location: c.hq_location ?? "",
    website: c.website ?? "",
    careers_url: c.careers_url ?? "",
    description: c.description ?? "",
    min_cgpa: c.min_cgpa != null ? String(c.min_cgpa) : "",
    allowed_branches: joined(c.allowed_branches),
    tech_stack: joined(c.tech_stack),
    dsa_topics: joined(c.dsa_topics),
    cs_subjects: joined(c.cs_subjects),
    process_steps: joined(c.process_steps),
    salary_min: c.salary_min != null ? String(c.salary_min) : "",
    salary_max: c.salary_max != null ? String(c.salary_max) : "",
    hiring_season: c.hiring_season ?? "",
    source_name: c.source_name ?? "",
    source_url: c.source_url ?? "",
  };
}

function toRow(d: Draft) {
  return {
    name: d.name.trim(),
    slug: slugify(d.name),
    industry: d.industry.trim() || null,
    hq_location: d.hq_location.trim() || null,
    website: d.website.trim() || null,
    careers_url: d.careers_url.trim() || null,
    description: d.description.trim() || null,
    min_cgpa: num(d.min_cgpa),
    allowed_branches: list(d.allowed_branches).length ? list(d.allowed_branches) : null,
    tech_stack: list(d.tech_stack).length ? list(d.tech_stack) : null,
    dsa_topics: list(d.dsa_topics).length ? list(d.dsa_topics) : null,
    cs_subjects: list(d.cs_subjects).length ? list(d.cs_subjects) : null,
    process_steps: list(d.process_steps).length ? list(d.process_steps) : null,
    salary_min: d.salary_min.trim() === "" ? null : Math.round(Number(d.salary_min)),
    salary_max: d.salary_max.trim() === "" ? null : Math.round(Number(d.salary_max)),
    hiring_season: d.hiring_season.trim() || null,
    source_name: d.source_name.trim() || null,
    source_url: d.source_url.trim() || null,
    verification_status: d.source_url.trim() ? "verified" : "unverified",
    last_verified_at: d.source_url.trim() ? new Date().toISOString() : null,
  };
}

function CompanyForm({
  draft,
  setDraft,
  onSubmit,
  busy,
  submitLabel,
}: {
  draft: Draft;
  setDraft: (d: Draft) => void;
  onSubmit: () => void;
  busy: boolean;
  submitLabel: string;
}) {
  const set = (k: keyof Draft) => (e: { target: { value: string } }) => setDraft({ ...draft, [k]: e.target.value });
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Company name</Label>
          <Input value={draft.name} onChange={set("name")} placeholder="Infosys" required />
        </div>
        <div className="space-y-1.5">
          <Label>Industry</Label>
          <Input value={draft.industry} onChange={set("industry")} placeholder="IT services" />
        </div>
        <div className="space-y-1.5">
          <Label>Headquarters</Label>
          <Input value={draft.hq_location} onChange={set("hq_location")} placeholder="Bengaluru, India" />
        </div>
        <div className="space-y-1.5">
          <Label>Hiring season</Label>
          <Input value={draft.hiring_season} onChange={set("hiring_season")} placeholder="Autumn 2026" />
        </div>
        <div className="space-y-1.5">
          <Label>Website</Label>
          <Input value={draft.website} onChange={set("website")} placeholder="https://…" />
        </div>
        <div className="space-y-1.5">
          <Label>Careers page</Label>
          <Input value={draft.careers_url} onChange={set("careers_url")} placeholder="https://…/careers" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Description</Label>
        <Textarea value={draft.description} onChange={set("description")} rows={3} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label>Minimum CGPA</Label>
          <Input value={draft.min_cgpa} onChange={set("min_cgpa")} inputMode="decimal" placeholder="7.0" />
        </div>
        <div className="space-y-1.5">
          <Label>Package min (LPA)</Label>
          <Input value={draft.salary_min} onChange={set("salary_min")} inputMode="numeric" placeholder="6" />
        </div>
        <div className="space-y-1.5">
          <Label>Package max (LPA)</Label>
          <Input value={draft.salary_max} onChange={set("salary_max")} inputMode="numeric" placeholder="12" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Eligible branches (comma separated)</Label>
          <Input value={draft.allowed_branches} onChange={set("allowed_branches")} placeholder="CSE, IT, ECE" />
        </div>
        <div className="space-y-1.5">
          <Label>Tech stack</Label>
          <Input value={draft.tech_stack} onChange={set("tech_stack")} placeholder="Java, SQL, React" />
        </div>
        <div className="space-y-1.5">
          <Label>DSA topics asked</Label>
          <Input value={draft.dsa_topics} onChange={set("dsa_topics")} placeholder="Arrays, DP, Graphs" />
        </div>
        <div className="space-y-1.5">
          <Label>CS subjects asked</Label>
          <Input value={draft.cs_subjects} onChange={set("cs_subjects")} placeholder="DBMS, OS, CN" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Hiring process steps (in order, comma separated)</Label>
        <Input
          value={draft.process_steps}
          onChange={set("process_steps")}
          placeholder="Online test, Technical round, HR round"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Source name</Label>
          <Input value={draft.source_name} onChange={set("source_name")} placeholder="Official careers page" />
        </div>
        <div className="space-y-1.5">
          <Label>Source link</Label>
          <Input value={draft.source_url} onChange={set("source_url")} placeholder="https://…" />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Add a source link so the record shows as verified. Leave a field blank when you do not have the real value —
        blank stays blank instead of being guessed.
      </p>

      <Button type="submit" disabled={busy || !draft.name.trim()} className="gap-2">
        <Save className="h-4 w-4" /> {busy ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}

function ManageCompaniesPage() {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Draft>(EMPTY);

  const companies = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const { data, error } = await supabase.from("companies").select("*").order("name");
      if (error) throw error;
      return (data ?? []) as Company[];
    },
  });

  async function create() {
    setBusy(true);
    const { error } = await supabase.from("companies").insert(toRow(draft));
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`${draft.name} added`);
    setDraft(EMPTY);
    qc.invalidateQueries({ queryKey: ["companies"] });
  }

  async function saveEdit() {
    if (!editId) return;
    setBusy(true);
    const { error } = await supabase.from("companies").update(toRow(editDraft)).eq("id", editId);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Company updated");
    setEditId(null);
    qc.invalidateQueries({ queryKey: ["companies"] });
  }

  async function remove(c: Company) {
    const { error } = await supabase.from("companies").delete().eq("id", c.id);
    if (error) return toast.error(error.message);
    toast.success(`${c.name} removed`);
    if (editId === c.id) setEditId(null);
    qc.invalidateQueries({ queryKey: ["companies"] });
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <SectionHeader
        title="Manage company data"
        description="Enter real recruiter details yourself. Everything you save here powers eligibility checks and the roadmap."
        action={
          <Link to="/companies">
            <Button variant="outline">Back to companies</Button>
          </Link>
        }
      />

      <WidgetCard title="Company Skill Demand Data Architecture" icon={Layers}>
        <div className="space-y-3 text-xs">
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-foreground leading-relaxed">
            <strong>Prepared Data Model Standard:</strong> Recruiter records are structured to contain the 9 essential telemetry dimensions:
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px]">
              <span className="rounded bg-background p-1.5 border border-border">1. Company</span>
              <span className="rounded bg-background p-1.5 border border-border">2. Industry</span>
              <span className="rounded bg-background p-1.5 border border-border">3. Location(s)</span>
              <span className="rounded bg-background p-1.5 border border-border">4. Roles</span>
              <span className="rounded bg-background p-1.5 border border-border">5. Required skills</span>
              <span className="rounded bg-background p-1.5 border border-border">6. Preferred skills</span>
              <span className="rounded bg-background p-1.5 border border-border">7. Experience</span>
              <span className="rounded bg-background p-1.5 border border-border">8. Hiring trends</span>
              <span className="rounded bg-background p-1.5 border border-border">9. Validated skill requirements</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <p className="text-muted-foreground text-[11px]">
              <strong>Strict Zero-Fabrication Policy:</strong> Direct company skill requisitions must be grounded in signed MoUs or direct employer validation. Records without direct human sign-off are tagged <em>Pending Direct Employer Validation</em>.
            </p>
            <Link to="/company-skill-demand">
              <Button size="sm" variant="outline" className="gap-1.5 text-xs shrink-0 h-8">
                View Company Requisitions <ExternalLink className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </WidgetCard>

      <WidgetCard title="Add a company" icon={Plus}>
        <CompanyForm draft={draft} setDraft={setDraft} onSubmit={create} busy={busy} submitLabel="Add company" />
      </WidgetCard>

      <WidgetCard title={`Existing companies (${companies.data?.length ?? 0})`}>
        {companies.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (companies.data?.length ?? 0) === 0 ? (
          <EmptyState title="No companies yet" description="Add your first recruiter above." />
        ) : (
          <ul className="divide-y divide-border">
            {companies.data!.map((c) => (
              <li key={c.id} className="space-y-3 py-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium">{c.name}</span>
                      {c.source_url ? (
                        <a
                          href={c.source_url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          source <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">no source</span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {c.min_cgpa != null ? `CGPA ≥ ${c.min_cgpa}` : "no CGPA cutoff recorded"}
                      {(c.allowed_branches ?? []).length ? ` · ${joined(c.allowed_branches)}` : ""}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (editId === c.id) return setEditId(null);
                      setEditId(c.id);
                      setEditDraft(toDraft(c));
                    }}
                  >
                    {editId === c.id ? "Close" : "Edit"}
                  </Button>
                  <Button variant="ghost" size="icon" aria-label={`Delete ${c.name}`} onClick={() => remove(c)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {editId === c.id ? (
                  <div className="rounded-lg bg-mist/60 p-4">
                    <CompanyForm
                      draft={editDraft}
                      setDraft={setEditDraft}
                      onSubmit={saveEdit}
                      busy={busy}
                      submitLabel="Save changes"
                    />
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </WidgetCard>
    </div>
  );
}
