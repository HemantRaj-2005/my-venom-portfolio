"use client";

import React from "react";
import { useAnalytics } from "../context";
import AnalyticsEmptyState from "@/components/AnalyticsEmptyState";
import MetricCard from "@/components/analytics/MetricCard";
import { Sparkles } from "lucide-react";

export default function KaggleAnalytics() {
  const { stats, profile } = useAnalytics();
  const kg = stats?.kaggle as Record<string, unknown> | undefined;
  if (!profile?.kaggle || !kg) {
    return <AnalyticsEmptyState platformName="Kaggle" />;
  }

  return (
    <div className="space-y-8 font-sans">
      <div className="border-b border-zinc-900 pb-5">
        <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Kaggle Telemetry
        </span>
        <h2 className="text-3xl font-black text-white mt-1.5">Kaggle Analytics</h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard label="Points" value={(kg.points as number) ?? 0} color="text-cyan-400" />
        <MetricCard label="Global Rank" value={(kg.rank as number) ?? 0} color="text-amber-400" />
        <MetricCard label="Tier" value={String(kg.tier || "Novice")} color="text-emerald-400" />
      </div>
    </div>
  );
}
