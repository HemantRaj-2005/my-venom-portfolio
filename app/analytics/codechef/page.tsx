"use client";

import React from "react";
import { useAnalytics } from "../layout";
import AnalyticsEmptyState from "@/components/AnalyticsEmptyState";
import MetricCard from "@/components/analytics/MetricCard";
import RatingTimeline from "@/components/analytics/RatingTimeline";
import { Zap } from "lucide-react";

export default function CodeChefAnalytics() {
  const { stats, profile } = useAnalytics();
  if (!profile?.codechef || !stats?.codechef?.rating) {
    return <AnalyticsEmptyState platformName="CodeChef" />;
  }
  const cc = stats.codechef as Record<string, unknown>;
  const history = (cc.history as { contest: string; rating: number; rank: number }[]) || [];

  return (
    <div className="space-y-8 font-sans">
      <div className="border-b border-zinc-900 pb-5">
        <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5" /> CodeChef Telemetry
        </span>
        <h2 className="text-3xl font-black text-white mt-1.5">CodeChef Analytics</h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Rating" value={cc.rating as number} color="text-cyan-400" />
        <MetricCard label="Max Rating" value={cc.maxRating as number} color="text-amber-400" />
        <MetricCard label="Stars" value={String(cc.stars)} color="text-yellow-400" />
        <MetricCard label="Problems Solved" value={cc.solved as number} color="text-emerald-400" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <MetricCard label="Global Rank" value={cc.globalRank as number} color="text-purple-400" />
        <MetricCard label="Country Rank" value={cc.countryRank as number} color="text-red-400" />
      </div>
      <RatingTimeline data={history} title="Rating Growth" />
    </div>
  );
}
