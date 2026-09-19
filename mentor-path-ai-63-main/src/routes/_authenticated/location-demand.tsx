import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MapPin,
  TrendingUp,
  Building2,
  ArrowRight,
  ShieldAlert,
  Compass,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Cell,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SectionHeader, StatCard, WidgetCard } from "@/components/widgets";
import {
  RAW_DISTRICT_DEMAND,
  DATASET_PROVENANCE,
} from "@/data/market-intelligence-demo-data";

export const Route = createFileRoute("/_authenticated/location-demand")({
  head: () => ({
    meta: [
      { title: "Location Demand Intelligence — PlacementPilot" },
      {
        name: "description",
        content: "District-level job posting density, regional hiring clusters, and location-wise salary benchmarks.",
      },
    ],
  }),
  component: LocationDemandPage,
});

export default function LocationDemandPage() {
  const CHART_COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899", "#06b6d4", "#6366f1", "#14b8a6"];

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <span className="flex h-2 w-2 rounded-full bg-primary" />
            Market Intelligence
          </div>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight">
            Location & District Demand Analytics
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Geographic distribution of technical hiring requisitions, regional hubs, and fresher CTC benchmarks.
          </p>
        </div>
        <Link to="/labour-market">
          <Button variant="outline" size="sm" className="gap-2 text-xs">
            Back to Labour Dashboard <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      {/* Prototype notice */}
      <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-800 dark:text-amber-200">
        <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <span>
          <strong>Prototype Data Layer:</strong> Regional requisitions and benchmarks sourced from {DATASET_PROVENANCE.datasetName}.
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Leading Hiring District" value="Bengaluru Urban (32.8%)" icon={MapPin} hint="46,800+ active observed openings in IT and Cloud" />
        <StatCard label="Highest Growth Cluster" value="Ahmedabad (+31.2%)" icon={TrendingUp} hint="Accelerated by GIFT City FinTech and cybersecurity zones" />
        <StatCard label="Highest Average Fresher CTC" value="₹7.8 LPA" icon={Building2} hint="Bengaluru Urban across tier 1/2 technical requisitions" />
      </div>

      {/* Chart & Table */}
      <WidgetCard
        title="District-Wise Posting Density"
        icon={MapPin}
        footnote="Source: Simulated LMI Q3 2026. Sourced from prototype tech employment exchanges."
      >
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={RAW_DISTRICT_DEMAND}
              margin={{ top: 10, right: 20, left: -20, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
              <XAxis dataKey="district" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" />
              <YAxis tick={{ fontSize: 11 }} />
              <RechartsTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0]?.payload;
                    return (
                      <div className="rounded-lg border border-border bg-card p-3 shadow-md text-xs">
                        <p className="font-semibold">{data.district}, {data.state}</p>
                        <p className="text-primary mt-1">Postings: {data.postingsCount.toLocaleString()}</p>
                        <p className="text-muted-foreground">Share: {data.sharePct}%</p>
                        <p className="text-muted-foreground">Avg Fresher CTC: ₹{data.avgFresherLPA} LPA</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="postingsCount" radius={[4, 4, 0, 0]}>
                {RAW_DISTRICT_DEMAND.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </WidgetCard>

      {/* Detailed District Breakdown Table */}
      <WidgetCard title="District Demand & Compensation Directory" icon={Compass}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead>District & State</TableHead>
                <TableHead>Dominant Sector</TableHead>
                <TableHead>Top In-Demand Role</TableHead>
                <TableHead className="text-right">Active Postings</TableHead>
                <TableHead className="text-right">National Share</TableHead>
                <TableHead className="text-right">Avg Fresher CTC</TableHead>
                <TableHead className="text-right">Growth Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {RAW_DISTRICT_DEMAND.map((d) => (
                <TableRow key={d.district}>
                  <TableCell className="font-semibold text-foreground">
                    {d.district}
                    <span className="block text-[10px] text-muted-foreground font-normal">{d.state}</span>
                  </TableCell>
                  <TableCell>{d.primarySector}</TableCell>
                  <TableCell className="font-medium text-foreground">{d.topRole}</TableCell>
                  <TableCell className="text-right font-mono">{d.postingsCount.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono">{d.sharePct}%</TableCell>
                  <TableCell className="text-right font-mono font-medium">₹{d.avgFresherLPA} LPA</TableCell>
                  <TableCell className="text-right font-mono text-emerald-600 font-semibold">+{d.growthRatePct}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </WidgetCard>
    </div>
  );
}
