import React, { useState } from "react";
import {
  ShieldCheck,
  Building2,
  Cpu,
  FlaskConical,
  Sparkles,
  Info,
  ExternalLink,
  Calendar,
  MapPin,
  FileCheck2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type DataTrustTier =
  | "verified_external"
  | "employer_validated"
  | "platform_calculated"
  | "demo_prototype"
  | "ai_recommended";

export interface DataTrustMetadata {
  tier: DataTrustTier;
  source: string;
  sourceUrl?: string;
  collectionDate: string;
  lastUpdated: string;
  geographicCoverage: string;
  dataType: string;
  verificationStatus: string;
  confidenceScore?: number;
  notes?: string;
}

export const DATA_TRUST_CONFIG: Record<
  DataTrustTier,
  {
    label: string;
    shortLabel: string;
    description: string;
    badgeStyle: string;
    textStyle: string;
    borderStyle: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  verified_external: {
    label: "Benchmark Reference Data",
    shortLabel: "Reference Data",
    description: "Published institutional benchmarks and public employment registries.",
    badgeStyle: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
    textStyle: "text-emerald-700 dark:text-emerald-400",
    borderStyle: "border-emerald-500/25",
    icon: ShieldCheck,
  },
  employer_validated: {
    label: "Employer Endorsed",
    shortLabel: "Employer Endorsed",
    description: "Skill requirement feedback and consensus submitted by hiring partners.",
    badgeStyle: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/25",
    textStyle: "text-sky-700 dark:text-sky-400",
    borderStyle: "border-sky-500/25",
    icon: Building2,
  },
  platform_calculated: {
    label: "Platform Analysis",
    shortLabel: "Platform Estimate",
    description: "Algorithmic synthesis, readiness scoring, and skill matching index.",
    badgeStyle: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25",
    textStyle: "text-amber-700 dark:text-amber-400",
    borderStyle: "border-amber-500/25",
    icon: Cpu,
  },
  demo_prototype: {
    label: "Sample / Prototype Data",
    shortLabel: "Prototype Data",
    description: "Sample records and simulations where live production streams are compiling.",
    badgeStyle: "bg-muted text-muted-foreground border-border",
    textStyle: "text-muted-foreground",
    borderStyle: "border-border",
    icon: FlaskConical,
  },
  ai_recommended: {
    label: "AI Recommendation",
    shortLabel: "AI Recommendation",
    description: "Contextual advice synthesized from profile and market indicators.",
    badgeStyle: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/25",
    textStyle: "text-purple-700 dark:text-purple-400",
    borderStyle: "border-purple-500/25",
    icon: Sparkles,
  },
};

interface DataTrustBadgeProps {
  metadata?: Partial<DataTrustMetadata>;
  tier?: DataTrustTier;
  showModalOnClick?: boolean;
  className?: string;
  compact?: boolean;
}

export function DataTrustBadge({
  metadata,
  tier = metadata?.tier || "platform_calculated",
  showModalOnClick = true,
  className = "",
  compact = false,
}: DataTrustBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const cfg = DATA_TRUST_CONFIG[tier] || DATA_TRUST_CONFIG.platform_calculated;
  const Icon = cfg.icon;

  const fullMeta: DataTrustMetadata = {
    tier,
    source: metadata?.source || "PlacementPilot Intelligence Core",
    sourceUrl: metadata?.sourceUrl,
    collectionDate: metadata?.collectionDate || "2026-08-01",
    lastUpdated: metadata?.lastUpdated || "2026-09-18",
    geographicCoverage: metadata?.geographicCoverage || "Maharashtra (State-wide)",
    dataType: metadata?.dataType || "Analytical Metric",
    verificationStatus: metadata?.verificationStatus || "Platform Computed",
    confidenceScore: metadata?.confidenceScore || 95,
    notes: metadata?.notes,
  };

  return (
    <>
      <span
        onClick={(e) => {
          if (showModalOnClick) {
            e.stopPropagation();
            setIsOpen(true);
          }
        }}
        role={showModalOnClick ? "button" : undefined}
        tabIndex={showModalOnClick ? 0 : undefined}
        title={`Data Trust: ${cfg.label} (Click for audit metadata)`}
        className={`inline-flex items-center gap-1 font-mono text-[10px] font-medium tracking-tight rounded-md px-2 py-0.5 border cursor-pointer select-none transition-all hover:opacity-90 active:scale-95 ${cfg.badgeStyle} ${className}`}
      >
        <Icon className="h-3 w-3 shrink-0" />
        <span>{compact ? cfg.shortLabel : cfg.label}</span>
        {showModalOnClick && <Info className="h-2.5 w-2.5 opacity-60 ml-0.5" />}
      </span>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in-0"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${cfg.badgeStyle}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base">{cfg.label}</h3>
                  <p className="text-xs text-muted-foreground">{cfg.description}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg bg-muted/40 p-3 border border-border/50">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground flex items-center gap-1">
                  <FileCheck2 className="h-3 w-3 text-primary" /> Primary Source
                </span>
                <p className="font-medium mt-1 text-foreground">{fullMeta.source}</p>
                {fullMeta.sourceUrl && (
                  <a
                    href={fullMeta.sourceUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline mt-1"
                  >
                    View source registry <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              <div className="rounded-lg bg-muted/40 p-3 border border-border/50">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-500" /> Verification Status
                </span>
                <p className="font-medium mt-1 text-foreground">{fullMeta.verificationStatus}</p>
                {fullMeta.confidenceScore && (
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Confidence index: {fullMeta.confidenceScore}%
                  </p>
                )}
              </div>

              <div className="rounded-lg bg-muted/40 p-3 border border-border/50">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-amber-500" /> Geographic Coverage
                </span>
                <p className="font-medium mt-1 text-foreground">{fullMeta.geographicCoverage}</p>
              </div>

              <div className="rounded-lg bg-muted/40 p-3 border border-border/50">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-sky-500" /> Collection & Freshness
                </span>
                <p className="font-medium mt-1 text-foreground">Collected: {fullMeta.collectionDate}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Audited: {fullMeta.lastUpdated}</p>
              </div>
            </div>

            {fullMeta.notes && (
              <div className="rounded-lg bg-primary/5 p-3 border border-primary/20 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Provenance Note: </span>
                {fullMeta.notes}
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t text-[11px] text-muted-foreground">
              <span>PlacementPilot Data Trust Protocol v2.4</span>
              <Button size="sm" variant="outline" onClick={() => setIsOpen(false)}>
                Close Audit
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function DataTrustBanner({
  tier,
  source,
  description,
}: {
  tier: DataTrustTier;
  source: string;
  description: string;
}) {
  const cfg = DATA_TRUST_CONFIG[tier];
  const Icon = cfg.icon;

  return (
    <div className={`rounded-lg border p-3 flex items-start gap-3 text-xs ${cfg.badgeStyle}`}>
      <Icon className="h-4 w-4 mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{cfg.label}</span>
          <span className="text-muted-foreground">· Source: {source}</span>
        </div>
        <p className="mt-0.5 opacity-90">{description}</p>
      </div>
    </div>
  );
}
