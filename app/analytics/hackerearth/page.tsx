"use client";

import React from "react";
import { useAnalytics } from "../layout";
import AnalyticsEmptyState from "@/components/AnalyticsEmptyState";
import MetricCard from "@/components/analytics/MetricCard";
import { Terminal } from "lucide-react";

export default function HackerEarthAnalytics() {
  const { stats, profile } = useAnalytics();
  const he = stats?.hackerearth as Record<string, unknown> | undefined;
  if (!profile?.hackerearth || (!he?.rating && !he?.challenges)) {
    return <AnalyticsEmptyState platformName="HackerEarth" />;
  }

  return (
    <div className="space-y-8 font-sans">
      <div className="border-b border-zinc-900 pb-5">
        <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5" /> HackerEarth Telemetry
        </span>
        <h2 className="text-3xl font-black text-white mt-1.5">HackerEarth Analytics</h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard label="Rating" value={he.rating as number} color="text-cyan-400" />
        <MetricCard label="Global Rank" value={he.rank as number} color="text-amber-400" />
        <MetricCard label="Challenges Solved" value={he.challenges as number} color="text-emerald-400" />
      </div>
    </div>
  );
}
