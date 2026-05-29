"use client";

import React from "react";
import { useAnalytics } from "../layout";
import AnalyticsEmptyState from "@/components/AnalyticsEmptyState";
import MetricCard from "@/components/analytics/MetricCard";
import { BookOpen } from "lucide-react";

export default function DevtoAnalytics() {
  const { stats, profile } = useAnalytics();
  const devto = stats?.devto as Record<string, unknown> | undefined;
  if (!profile?.devto || !devto?.articles) {
    return <AnalyticsEmptyState platformName="Dev.to" />;
  }

  return (
    <div className="space-y-8 font-sans">
      <div className="border-b border-zinc-900 pb-5">
        <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" /> Dev.to Telemetry
        </span>
        <h2 className="text-3xl font-black text-white mt-1.5">Dev.to Analytics</h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard label="Articles Published" value={devto.articles as number} color="text-cyan-400" />
        <MetricCard label="Total Reactions" value={devto.reactions as number} color="text-amber-400" />
        <MetricCard label="Followers" value={devto.followers as number} color="text-emerald-400" />
      </div>
    </div>
  );
}
