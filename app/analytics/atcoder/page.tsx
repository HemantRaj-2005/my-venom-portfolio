"use client";

import React from "react";
import { useAnalytics } from "../layout";
import AnalyticsEmptyState from "@/components/AnalyticsEmptyState";
import MetricCard from "@/components/analytics/MetricCard";
import { Shield } from "lucide-react";

export default function AtCoderAnalytics() {
  const { stats, profile } = useAnalytics();
  const ac = stats?.atcoder as Record<string, unknown> | undefined;
  if (!profile?.atcoder || !ac?.rating) {
    return <AnalyticsEmptyState platformName="AtCoder" />;
  }

  return (
    <div className="space-y-8 font-sans">
      <div className="border-b border-zinc-900 pb-5">
        <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" /> AtCoder Telemetry
        </span>
        <h2 className="text-3xl font-black text-white mt-1.5">AtCoder Analytics</h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Rating" value={ac.rating as number} color="text-cyan-400" />
        <MetricCard label="Max Rating" value={(ac.maxRating as number) || (ac.rating as number)} color="text-amber-400" />
        <MetricCard label="Rank" value={ac.rank as number} color="text-purple-400" />
        <MetricCard label="Challenges" value={ac.challenges as number} color="text-emerald-400" />
      </div>
    </div>
  );
}
