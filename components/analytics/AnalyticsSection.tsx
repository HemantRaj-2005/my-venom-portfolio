"use client";

import React from "react";

interface AnalyticsSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  empty?: boolean;
  emptyMessage?: string;
}

export default function AnalyticsSection({
  title,
  icon,
  children,
  empty = false,
  emptyMessage = "No data available",
}: AnalyticsSectionProps) {
  return (
    <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6">
      <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-5 flex items-center gap-1.5">
        {icon}
        {title}
      </h3>
      {empty ? (
        <p className="text-xs font-mono text-zinc-500 uppercase">{emptyMessage}</p>
      ) : (
        children
      )}
    </div>
  );
}
