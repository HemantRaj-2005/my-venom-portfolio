"use client";

import React, { useState, useRef } from "react";
import { getHeatmapColor, getDsaHeatmapColor } from "@/lib/analytics/heatmap";

interface HeatmapCell {
  date: string;
  count: number;
}

interface UnifiedHeatmapProps {
  data: HeatmapCell[];
  title?: string;
  longestStreak?: number;
  totalActivity?: number;
  variant?: "github" | "dsa";
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(dateStr: string): { day: string; date: number; month: string; year: string; weekday: string } {
  const d = new Date(dateStr + "T00:00:00");
  return {
    day: DAYS[d.getDay()],
    date: d.getDate(),
    month: MONTHS[d.getMonth()],
    year: String(d.getFullYear()),
    weekday: DAYS[d.getDay()],
  };
}

function HeatmapTooltip({ cell, variant, position }: { cell: HeatmapCell; variant: "github" | "dsa"; position: { x: number; y: number } }) {
  const f = formatDate(cell.date);
  const label = variant === "dsa" ? "problems solved" : "contributions";

  return (
    <div
      className="fixed z-[9999] pointer-events-none"
      style={{ left: position.x, top: position.y, transform: "translate(-50%, -100%) translateY(-8px)" }}
    >
      <div className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 shadow-xl shadow-black/50 whitespace-nowrap">
        <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
          {f.weekday}, {f.month} {f.date}, {f.year}
        </div>
        <div className={`text-sm font-bold ${variant === "dsa" ? "text-purple-400" : "text-cyan-400"}`}>
          {cell.count} {label}
        </div>
      </div>
      <div className="flex justify-center">
        <div className={`w-2 h-2 rotate-45 border-b border-r ${variant === "dsa" ? "bg-zinc-950 border-zinc-700" : "bg-zinc-950 border-zinc-700"}`} style={{ marginTop: -4 }} />
      </div>
    </div>
  );
}

export default function UnifiedHeatmap({
  data,
  title = "Unified Developer Heatmap",
  longestStreak = 0,
  totalActivity = 0,
  variant = "github",
}: UnifiedHeatmapProps) {
  const [view, setView] = useState<"daily" | "weekly" | "monthly">("daily");
  const [hoveredCell, setHoveredCell] = useState<{ cell: HeatmapCell; x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!data || data.length === 0) {
    return (
      <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6">
        <p className="text-xs font-mono text-zinc-500 uppercase">No data available</p>
      </div>
    );
  }

  const getColor = variant === "dsa" ? getDsaHeatmapColor : getHeatmapColor;

  // Build date-indexed map for daily view
  const dateMap = new Map<string, HeatmapCell>();
  data.forEach((cell) => dateMap.set(cell.date, cell));

  // Generate a full year grid (53 weeks x 7 days)
  const today = new Date();
  const endDate = new Date(today);
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 364); // Last 365 days

  // Adjust to start on Sunday
  const dayOfWeek = startDate.getDay();
  startDate.setDate(startDate.getDate() - dayOfWeek);

  const fullYearCells: (HeatmapCell & { isEmpty?: boolean })[] = [];
  const cursor = new Date(startDate);
  while (cursor <= endDate || cursor.getDay() !== 0) {
    const dateStr = cursor.toISOString().split("T")[0];
    const existing = dateMap.get(dateStr);
    fullYearCells.push({
      date: dateStr,
      count: existing?.count || 0,
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  // Group by weeks
  const weeks: (HeatmapCell & { isEmpty?: boolean })[][] = [];
  for (let i = 0; i < fullYearCells.length; i += 7) {
    weeks.push(fullYearCells.slice(i, i + 7));
  }

  // Monthly aggregation
  const monthlyMap = new Map<string, number>();
  data.forEach(({ date, count }) => {
    const d = new Date(date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthlyMap.set(key, (monthlyMap.get(key) || 0) + count);
  });

  // Weekly aggregation
  const weeklyMap = new Map<string, number>();
  data.forEach(({ date, count }) => {
    const d = new Date(date);
    const start = new Date(d);
    start.setDate(d.getDate() - d.getDay());
    const key = start.toISOString().split("T")[0];
    weeklyMap.set(key, (weeklyMap.get(key) || 0) + count);
  });

  const handleMouseEnter = (cell: HeatmapCell, e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setHoveredCell({
      cell,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  const handleMouseLeave = () => {
    setHoveredCell(null);
  };

  // Get month labels with positions
  const monthLabels: { label: string; weekIndex: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, wIdx) => {
    if (week.length > 0) {
      const d = new Date(week[0].date + "T00:00:00");
      const m = d.getMonth();
      if (m !== lastMonth) {
        monthLabels.push({ label: MONTHS[m], weekIndex: wIdx });
        lastMonth = m;
      }
    }
  });

  return (
    <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-zinc-900 pb-3 mb-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400">{title}</h3>
        <div className="flex items-center gap-3">
          {(["daily", "weekly", "monthly"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`text-[9px] font-mono uppercase px-2 py-1 rounded border transition-colors cursor-pointer ${
                view === v
                  ? variant === "dsa"
                    ? "border-purple-500/40 text-purple-400 bg-purple-950/20"
                    : "border-cyan-500/40 text-cyan-400 bg-cyan-950/20"
                  : "border-zinc-800 text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {view === "daily" && (
        <div ref={containerRef} className="overflow-x-auto pr-2">
          {/* Month labels */}
          <div className="flex gap-[3px] mb-1 ml-8 min-w-[640px]">
            {monthLabels.map(({ label, weekIndex }) => (
              <span
                key={`${label}-${weekIndex}`}
                className="text-[8px] font-mono text-zinc-600"
                style={{ position: "absolute", left: `${8 + weekIndex * 13}px` }}
              >
                {label}
              </span>
            ))}
          </div>

          <div className="flex gap-[3px] min-w-[640px]">
            {/* Day labels */}
            <div className="flex flex-col gap-[3px] mr-1 shrink-0">
              {DAYS.map((day, i) => (
                <div key={day} className="h-[11px] flex items-center">
                  {i % 2 === 1 && (
                    <span className="text-[8px] font-mono text-zinc-600 w-7 text-right pr-1">{day}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Weeks grid */}
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-[3px]">
                {Array.from({ length: 7 }).map((_, dIdx) => {
                  const cell = week[dIdx];
                  if (!cell) {
                    return <div key={dIdx} className="w-[11px] h-[11px]" />;
                  }
                  return (
                    <div
                      key={dIdx}
                      onMouseEnter={(e) => handleMouseEnter(cell, e)}
                      onMouseLeave={handleMouseLeave}
                      className={`w-[11px] h-[11px] rounded-[2px] border ${getColor(cell.count)} transition-all duration-150 hover:scale-150 hover:border-white/40 cursor-pointer`}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-1.5 mt-3">
            <span className="text-[8px] font-mono text-zinc-600 mr-1">Less</span>
            {[0, 1, 3, 5, 7].map((level) => (
              <div key={level} className={`w-[11px] h-[11px] rounded-[2px] border ${getColor(level)}`} />
            ))}
            <span className="text-[8px] font-mono text-zinc-600 ml-1">More</span>
          </div>
        </div>
      )}

      {view === "weekly" && (
        <div className="flex flex-wrap gap-1">
          {Array.from(weeklyMap.entries())
            .slice(-52)
            .map(([week, count]) => {
              const f = formatDate(week);
              return (
                <div
                  key={week}
                  title={`${count} activity — Week of ${f.month} ${f.date}, ${f.year}`}
                  className={`w-3 h-8 rounded-sm border ${getColor(Math.min(count, 7))} transition-all hover:scale-110 cursor-pointer`}
                />
              );
            })}
        </div>
      )}

      {view === "monthly" && (
        <div className="flex flex-wrap gap-2">
          {Array.from(monthlyMap.entries()).map(([month, count]) => {
            const [y, m] = month.split("-");
            return (
              <div key={month} className="text-center">
                <div
                  title={`${count} activity in ${MONTHS[parseInt(m, 10) - 1]} ${y}`}
                  className={`w-8 h-8 rounded-sm border mx-auto ${getColor(Math.min(Math.round(count / 5), 7))} transition-all hover:scale-110 cursor-pointer`}
                />
                <span className="text-[8px] font-mono text-zinc-600 mt-1 block">{MONTHS[parseInt(m, 10) - 1]}</span>
                <span className="text-[7px] font-mono text-zinc-700 block">{y}</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-between items-center mt-4 text-[9px] font-mono text-zinc-500 uppercase">
        <span>Longest Streak: {longestStreak} Days</span>
        <span>Total Activity: {totalActivity}</span>
      </div>

      {/* Floating tooltip */}
      {hoveredCell && (
        <HeatmapTooltip
          cell={hoveredCell.cell}
          variant={variant}
          position={{ x: hoveredCell.x, y: hoveredCell.y }}
        />
      )}
    </div>
  );
}
