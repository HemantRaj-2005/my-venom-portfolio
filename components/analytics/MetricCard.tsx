"use client";

import React from "react";

interface MetricCardProps {
  label: string;
  value: number | string;
  description?: string;
  color?: string;
  icon?: React.ReactNode;
}

export default function MetricCard({
  label,
  value,
  description,
  color = "text-cyan-400",
  icon,
}: MetricCardProps) {
  return (
    <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-5 relative select-none shadow-sm">
      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">
        {label}
      </span>
      <div className={`text-3xl font-black font-mono ${color} mt-2 flex items-baseline gap-1.5`}>
        {icon}
        {value}
      </div>
      {description && (
        <p className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider mt-1.5">
          {description}
        </p>
      )}
    </div>
  );
}
