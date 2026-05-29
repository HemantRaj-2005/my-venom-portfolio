export interface HeatmapCell {
  date: string;
  count: number;
}

export interface UnifiedHeatmapCell {
  date: string;
  count: number;
  breakdown: Record<string, number>;
}

export interface HeatmapStats {
  currentStreak: number;
  longestStreak: number;
  activeDays: number;
  inactiveDays: number;
  daily: UnifiedHeatmapCell[];
  weekly: { week: string; count: number }[];
  monthly: { month: string; count: number }[];
  yearly: { year: string; count: number }[];
}

function mergePlatformHeatmaps(
  platforms: { name: string; data: HeatmapCell[] }[]
): UnifiedHeatmapCell[] {
  const map = new Map<string, UnifiedHeatmapCell>();

  platforms.forEach(({ name, data }) => {
    data.forEach(({ date, count }) => {
      if (!map.has(date)) {
        map.set(date, { date, count: 0, breakdown: {} });
      }
      const cell = map.get(date)!;
      cell.count += count;
      cell.breakdown[name] = (cell.breakdown[name] || 0) + count;
    });
  });

  return Array.from(map.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

function computeStreaks(cells: UnifiedHeatmapCell[]): {
  currentStreak: number;
  longestStreak: number;
} {
  if (cells.length === 0) return { currentStreak: 0, longestStreak: 0 };

  const sorted = [...cells].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let currentStreak = 0;
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].count > 0) currentStreak++;
    else if (i === 0 || sorted[i - 1]?.count > 0) break;
  }

  let longestStreak = 0;
  let run = 0;
  const asc = [...cells].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  asc.forEach((cell) => {
    if (cell.count > 0) {
      run++;
      longestStreak = Math.max(longestStreak, run);
    } else {
      run = 0;
    }
  });

  return { currentStreak, longestStreak };
}

function aggregateByPeriod(
  cells: UnifiedHeatmapCell[],
  period: "week" | "month" | "year"
): { label: string; count: number }[] {
  const map = new Map<string, number>();

  cells.forEach(({ date, count }) => {
    const d = new Date(date);
    let key: string;
    if (period === "week") {
      const start = new Date(d);
      start.setDate(d.getDate() - d.getDay());
      key = start.toISOString().split("T")[0];
    } else if (period === "month") {
      key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    } else {
      key = String(d.getFullYear());
    }
    map.set(key, (map.get(key) || 0) + count);
  });

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, count]) => ({ label, count }));
}

export function buildUnifiedHeatmap(
  syncResults: Record<string, unknown>
): HeatmapStats {
  const platformHeatmaps: { name: string; data: HeatmapCell[] }[] = [];

  const gh = syncResults.github as { heatmap?: string } | undefined;
  if (gh?.heatmap) {
    try {
      platformHeatmaps.push({ name: "github", data: JSON.parse(gh.heatmap) });
    } catch {
      /* skip */
    }
  }

  const daily = mergePlatformHeatmaps(platformHeatmaps);
  const { currentStreak, longestStreak } = computeStreaks(daily);
  const activeDays = daily.filter((c) => c.count > 0).length;
  const inactiveDays = daily.filter((c) => c.count === 0).length;

  return {
    currentStreak,
    longestStreak,
    activeDays,
    inactiveDays,
    daily,
    weekly: aggregateByPeriod(daily, "week").map(({ label, count }) => ({
      week: label,
      count,
    })),
    monthly: aggregateByPeriod(daily, "month").map(({ label, count }) => ({
      month: label,
      count,
    })),
    yearly: aggregateByPeriod(daily, "year").map(({ label, count }) => ({
      year: label,
      count,
    })),
  };
}

export function getHeatmapColor(count: number): string {
  if (count === 0) return "bg-zinc-950 border-zinc-950/60";
  if (count <= 2) return "bg-[#0b2838] border-cyan-950/10";
  if (count <= 4) return "bg-[#0f4b62] border-cyan-800/20";
  if (count <= 6) return "bg-[#147a96] border-cyan-600/20";
  return "bg-cyan-400 border-cyan-300/30";
}
