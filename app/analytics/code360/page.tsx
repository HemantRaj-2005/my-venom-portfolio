"use client";

import React from "react";
import { useAnalytics } from "../context";
import AnalyticsEmptyState from "@/components/AnalyticsEmptyState";
import MetricCard from "@/components/analytics/MetricCard";
import { Code2, TrendingUp, Award, Star } from "lucide-react";

export default function Code360Page() {
  const { stats, profile } = useAnalytics();

  if (!profile?.code360 || !stats?.code360) {
    return <AnalyticsEmptyState platformName="Code360" />;
  }

  const data = stats.code360 as Record<string, unknown>;

  return (
    <div className="space-y-8 font-sans">
      <div className="border-b border-zinc-900 pb-5">
        <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
          <Code2 className="w-3.5 h-3.5" /> Code360 (Naukri) Telemetry
        </span>
        <h2 className="text-3xl font-black text-white mt-1.5">Code360 Dashboard</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Problems Solved" value={String(data.solved || 0)} icon={<Code2 className="w-4 h-4" />} />
        <MetricCard label="Rating" value={String(data.rating || 0)} icon={<TrendingUp className="w-4 h-4" />} color="text-emerald-400" />
        <MetricCard label="Stars" value={String(data.stars || "N/A")} icon={<Star className="w-4 h-4" />} color="text-yellow-400" />
        <MetricCard label="Streak" value={`${data.streak || 0} days`} icon={<Award className="w-4 h-4" />} color="text-amber-400" />
      </div>

      <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6">
        <h3 className="text-xs font-mono uppercase text-zinc-400 mb-4">Platform Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-900/40 rounded-xl p-4 border border-zinc-800">
            <div className="text-[10px] font-mono text-zinc-500 uppercase">Profile Handle</div>
            <div className="text-white font-bold mt-1">{profile.code360}</div>
          </div>
          <div className="bg-zinc-900/40 rounded-xl p-4 border border-zinc-800">
            <div className="text-[10px] font-mono text-zinc-500 uppercase">Star Rating</div>
            <div className="text-yellow-400 font-bold mt-1">{String(data.stars || "N/A")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
