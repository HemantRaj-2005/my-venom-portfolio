"use client";

import React, { useState } from "react";
import { getHeatmapColor } from "@/lib/analytics/heatmap";

interface HeatmapCell {
  date: string;
  count: number;
}

interface UnifiedHeatmapProps {
  data: HeatmapCell[];
  title?: string;
  longestStreak?: number;
  totalActivity?: number;
}

export default function UnifiedHeatmap({
  data,
  title = "Unified Developer Heatmap",
  longestStreak = 0,
  totalActivity = 0,
}: UnifiedHeatmapProps) {
  const [view, setView] = useState<"daily" | "weekly" | "monthly">("daily");

  if (!data || data.length === 0) {
    return (
      <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6">
        <p className="text-xs font-mono text-zinc-500 uppercase">No data available</p>
      </div>
    );
  }

  const weeklyMap = new Map<string, number>();
  data.forEach(({ date, count }) => {
    const d = new Date(date);
    const start = new Date(d);
    start.setDate(d.getDate() - d.getDay());
    const key = start.toISOString().split("T")[0];
    weeklyMap.set(key, (weeklyMap.get(key) || 0) + count);
  });

  const monthlyMap = new Map<string, number>();
  data.forEach(({ date, count }) => {
    const d = new Date(date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthlyMap.set(key, (monthlyMap.get(key) || 0) + count);
  });

  return (
    <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-zinc-900 pb-3 mb-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400">{title}</h3>
        <div className="flex items-center gap-3">
          {(["daily", "weekly", "monthly"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`text-[9px] font-mono uppercase px-2 py-1 rounded border transition-colors ${
                view === v
                  ? "border-cyan-500/40 text-cyan-400 bg-cyan-950/20"
                  : "border-zinc-800 text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {view === "daily" && (
        <div className="overflow-x-auto pr-2">
          <div className="flex gap-1 h-24 min-w-[640px] items-center">
            {Array.from({ length: 53 }).map((_, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1">
                {Array.from({ length: 7 }).map((_, dIdx) => {
                  const cellIdx = wIdx * 7 + dIdx;
                  const cell = data[cellIdx] || { count: 0, date: "" };
                  return (
                    <div
                      key={dIdx}
                      title={`${cell.count} actions on ${cell.date}`}
                      className={`w-2.5 h-2.5 rounded-sm border ${getHeatmapColor(cell.count)} transition-all duration-300 hover:scale-125 hover:border-cyan-400`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "weekly" && (
        <div className="flex flex-wrap gap-1">
          {Array.from(weeklyMap.entries())
            .slice(-52)
            .map(([week, count]) => (
              <div
                key={week}
                title={`${count} actions week of ${week}`}
                className={`w-3 h-8 rounded-sm border ${getHeatmapColor(Math.min(count, 7))}`}
              />
            ))}
        </div>
      )}

      {view === "monthly" && (
        <div className="flex flex-wrap gap-2">
          {Array.from(monthlyMap.entries()).map(([month, count]) => (
            <div key={month} className="text-center">
              <div
                className={`w-8 h-8 rounded-sm border mx-auto ${getHeatmapColor(Math.min(Math.round(count / 5), 7))}`}
                title={`${count} actions in ${month}`}
              />
              <span className="text-[8px] font-mono text-zinc-600 mt-1 block">{month.slice(5)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mt-4 text-[9px] font-mono text-zinc-500 uppercase">
        <span>Longest Streak: {longestStreak} Days</span>
        <span>Total Activity: {totalActivity}</span>
      </div>
    </div>
  );
}
