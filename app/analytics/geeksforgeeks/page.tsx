"use client";

import React from "react";
import { useAnalytics } from "../context";
import AnalyticsEmptyState from "@/components/AnalyticsEmptyState";
import MetricCard from "@/components/analytics/MetricCard";
import { GraduationCap } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function GfgAnalytics() {
  const { stats, profile } = useAnalytics();
  if (!profile?.geeksforgeeks || !stats?.geeksforgeeks?.solved) {
    return <AnalyticsEmptyState platformName="GeeksforGeeks" />;
  }
  const gfg = stats.geeksforgeeks as Record<string, unknown>;
  const topicStrengths = (gfg.topicStrengths as { name: string; value: number }[]) || [];

  return (
    <div className="space-y-8 font-sans">
      <div className="border-b border-zinc-900 pb-5">
        <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
          <GraduationCap className="w-3.5 h-3.5" /> GFG Telemetry
        </span>
        <h2 className="text-3xl font-black text-white mt-1.5">GeeksforGeeks Analytics</h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Coding Score" value={gfg.codingScore as number} color="text-cyan-400" />
        <MetricCard label="Institution Rank" value={`#${gfg.institutionRank}`} color="text-amber-400" />
        <MetricCard label="Problems Solved" value={gfg.solved as number} color="text-emerald-400" />
        <MetricCard label="Streak" value={`${gfg.streak} Days`} color="text-red-400" />
      </div>
      {topicStrengths.length > 0 ? (
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6">
          <h3 className="text-xs font-mono uppercase text-zinc-400 mb-5">Topic Strengths</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicStrengths}>
                <CartesianGrid strokeDasharray="3 3" stroke="#141414" />
                <XAxis dataKey="name" stroke="#444" tick={{ fontSize: 8 }} />
                <YAxis stroke="#444" tick={{ fontSize: 9 }} />
                <Tooltip contentStyle={{ backgroundColor: "#09090b", borderColor: "#18181b" }} />
                <Bar dataKey="value" fill="#00e5ff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <p className="text-xs font-mono text-zinc-500 uppercase">No topic strength data available</p>
      )}
    </div>
  );
}
