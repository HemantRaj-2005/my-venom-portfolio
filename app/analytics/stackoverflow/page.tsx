"use client";

import React from "react";
import { useAnalytics } from "../context";
import AnalyticsEmptyState from "@/components/AnalyticsEmptyState";
import MetricCard from "@/components/analytics/MetricCard";
import { HelpCircle } from "lucide-react";

export default function StackOverflowAnalytics() {
  const { stats, profile } = useAnalytics();
  const so = stats?.stackoverflow as Record<string, unknown> | undefined;
  if (!profile?.stackoverflow || !so?.reputation) {
    return <AnalyticsEmptyState platformName="StackOverflow" />;
  }

  return (
    <div className="space-y-8 font-sans">
      <div className="border-b border-zinc-900 pb-5">
        <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5" /> StackOverflow Telemetry
        </span>
        <h2 className="text-3xl font-black text-white mt-1.5">StackOverflow Analytics</h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Reputation" value={so.reputation as number} color="text-cyan-400" />
        <MetricCard label="Gold Badges" value={so.badgesGold as number} color="text-amber-400" />
        <MetricCard label="Silver Badges" value={so.badgesSilver as number} color="text-zinc-300" />
        <MetricCard label="Bronze Badges" value={so.badgesBronze as number} color="text-orange-400" />
      </div>
    </div>
  );
}
