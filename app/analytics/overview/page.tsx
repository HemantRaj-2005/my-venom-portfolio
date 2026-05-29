"use client";

import React from "react";
import { useAnalytics } from "../layout";
import MetricCard from "@/components/analytics/MetricCard";
import UnifiedHeatmap from "@/components/analytics/UnifiedHeatmap";
import ScoreRadar from "@/components/analytics/ScoreRadar";
import { Flame, Cpu, Activity } from "lucide-react";

export default function AnalyticsOverview() {
  const { stats } = useAnalytics();
  if (!stats) return null;

  const agg = stats.aggregates as Record<string, unknown> | undefined;
  const heatmapData =
    (agg?.unifiedHeatmap as { date: string; count: number }[] | undefined) ||
    (stats.github as { heatmap?: { date: string; count: number }[] })?.heatmap ||
    [];

  const scoreEntries = [
    { name: "DSA Score", key: "dsaScore" },
    { name: "Open Source Score", key: "openSourceScore" },
    { name: "Consistency Score", key: "consistencyScore" },
    { name: "Productivity Score", key: "productivityScore" },
    { name: "Interview Readiness", key: "interviewReadinessScore" },
    { name: "Learning Velocity", key: "learningVelocityScore" },
    { name: "Community Contribution", key: "communityContributionScore" },
    { name: "System Design Readiness", key: "systemDesignReadinessScore" },
  ];

  return (
    <div className="space-y-8 font-sans">
      <div className="border-b border-zinc-900 pb-5">
        <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 animate-pulse" /> Master Developer Intelligence
        </span>
        <h2 className="text-3xl font-black text-white mt-1.5 tracking-tight">Unified Analytics Dashboard</h2>
        <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mt-1.5">
          Aggregated telemetry from {(agg?.connectedPlatforms as number) || 0} connected platforms
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Questions Solved" value={(agg?.totalQuestions as number) || 0} description="Across all platforms" color="text-cyan-400" />
        <MetricCard label="Total Stars" value={(stats.github as { metrics?: { totalStars?: number } })?.metrics?.totalStars || 0} description="Open source validation" color="text-amber-400" />
        <MetricCard label="Active Coding Days" value={(agg?.activeDays as number) || 0} description="Unique active days" color="text-emerald-400" />
        <MetricCard label="Current Streak" value={(agg?.currentStreak as number) || (agg?.maxStreak as number) || 0} description="Consecutive active days" color="text-red-400" icon={<Flame className="w-4 h-4 text-red-500 fill-current animate-pulse" />} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Total Commits" value={(agg?.totalCommits as number) || 0} color="text-cyan-400" />
        <MetricCard label="Pull Requests" value={(agg?.totalPRs as number) || 0} color="text-purple-400" />
        <MetricCard label="Issues Resolved" value={(agg?.totalIssues as number) || 0} color="text-emerald-400" />
        <MetricCard label="Platforms Connected" value={(agg?.connectedPlatforms as number) || 0} color="text-amber-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-5 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-cyan-400" /> Advanced Engineering Scores
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            {scoreEntries.map(({ name, key }) => {
              const value = (stats.scores as Record<string, number | null>)?.[key];
              if (value === null || value === undefined) return null;
              return (
                <div key={key} className="border border-zinc-900 bg-zinc-950/80 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between text-[10px] uppercase font-bold text-zinc-300">
                    <span>{name}</span>
                    <span className="text-cyan-400">{value}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${value}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <ScoreRadar scores={(stats.scores as Record<string, number | null>) || {}} />
      </div>

      <UnifiedHeatmap
        data={heatmapData}
        longestStreak={(stats.heatmapStats as { longestStreak?: number })?.longestStreak || (agg?.maxStreak as number) || 0}
        totalActivity={(agg?.totalCommits as number) || 0}
      />
    </div>
  );
}
