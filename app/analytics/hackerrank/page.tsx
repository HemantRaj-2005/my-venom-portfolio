"use client";

import React from "react";
import { useAnalytics } from "../context";
import AnalyticsEmptyState from "@/components/AnalyticsEmptyState";
import MetricCard from "@/components/analytics/MetricCard";
import { Layers } from "lucide-react";

export default function HackerRankAnalytics() {
  const { stats, profile } = useAnalytics();
  const hr = stats?.hackerrank as Record<string, unknown> | undefined;
  if (!profile?.hackerrank || !hr) {
    return <AnalyticsEmptyState platformName="HackerRank" />;
  }

  const badges = (hr.badges as string[]) || [];
  const certifications = (hr.certifications as string[]) || [];

  return (
    <div className="space-y-8 font-sans">
      <div className="border-b border-zinc-900 pb-5">
        <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5" /> HackerRank Telemetry
        </span>
        <h2 className="text-3xl font-black text-white mt-1.5">HackerRank Analytics</h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard label="Rating" value={(hr.rating as number) ?? 0} color="text-cyan-400" />
        <MetricCard label="Rank" value={(hr.rank as number) ?? 0} color="text-amber-400" />
        <MetricCard label="Challenges Solved" value={(hr.challenges as number) ?? 0} color="text-emerald-400" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6">
          <h3 className="text-xs font-mono uppercase text-zinc-400 mb-4">Badges</h3>
          {badges.length === 0 ? (
            <p className="text-xs text-zinc-500">No badges data available</p>
          ) : (
            <ul className="space-y-2">{badges.map((b, i) => <li key={i} className="text-sm text-zinc-300">{b}</li>)}</ul>
          )}
        </div>
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6">
          <h3 className="text-xs font-mono uppercase text-zinc-400 mb-4">Certifications</h3>
          {certifications.length === 0 ? (
            <p className="text-xs text-zinc-500">No certifications data available</p>
          ) : (
            <ul className="space-y-2">{certifications.map((c, i) => <li key={i} className="text-sm text-zinc-300">{c}</li>)}</ul>
          )}
        </div>
      </div>
    </div>
  );
}
