export interface PeriodReport {
  period: "weekly" | "monthly" | "quarterly" | "yearly";
  startDate: string;
  endDate: string;
  growth: { metric: string; delta: number; percent: number }[];
  achievements: { platform: string; description: string; date: string }[];
  declines: { metric: string; delta: number }[];
}

interface SnapshotMetrics {
  aggregates?: {
    totalQuestions?: number;
    totalCommits?: number;
    maxStreak?: number;
    connectedPlatforms?: number;
  };
  scores?: { overallScore?: number | null; dsaScore?: number | null };
  leetcode?: { solved?: { total?: number }; contestRating?: number };
  codeforces?: { rating?: number; solved?: number };
  github?: { metrics?: { totalStars?: number; totalCommits?: number } };
}

function getPeriodDays(period: PeriodReport["period"]): number {
  switch (period) {
    case "weekly":
      return 7;
    case "monthly":
      return 30;
    case "quarterly":
      return 90;
    case "yearly":
      return 365;
  }
}

function parseMetrics(json: string): SnapshotMetrics {
  try {
    return JSON.parse(json);
  } catch {
    return {};
  }
}

function metricDelta(
  oldVal: number,
  newVal: number,
  name: string
): { metric: string; delta: number; percent: number } | null {
  if (oldVal === newVal) return null;
  const delta = newVal - oldVal;
  const percent = oldVal > 0 ? Math.round((delta / oldVal) * 100) : delta > 0 ? 100 : 0;
  return { metric: name, delta, percent };
}

export function generatePeriodReport(
  snapshots: { date: Date; metrics: string }[],
  period: PeriodReport["period"]
): PeriodReport | null {
  if (snapshots.length < 2) return null;

  const days = getPeriodDays(period);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const inPeriod = snapshots.filter((s) => new Date(s.date) >= cutoff);
  if (inPeriod.length < 2) return null;

  const oldest = parseMetrics(inPeriod[0].metrics);
  const newest = parseMetrics(inPeriod[inPeriod.length - 1].metrics);

  const growth: PeriodReport["growth"] = [];
  const declines: PeriodReport["declines"] = [];
  const achievements: PeriodReport["achievements"] = [];

  const checks = [
    {
      name: "Total Questions Solved",
      old: oldest.aggregates?.totalQuestions || 0,
      new: newest.aggregates?.totalQuestions || 0,
    },
    {
      name: "Total Commits",
      old: oldest.github?.metrics?.totalCommits || 0,
      new: newest.github?.metrics?.totalCommits || 0,
    },
    {
      name: "LeetCode Solved",
      old: oldest.leetcode?.solved?.total || 0,
      new: newest.leetcode?.solved?.total || 0,
    },
    {
      name: "Codeforces Rating",
      old: oldest.codeforces?.rating || 0,
      new: newest.codeforces?.rating || 0,
    },
    {
      name: "GitHub Stars",
      old: oldest.github?.metrics?.totalStars || 0,
      new: newest.github?.metrics?.totalStars || 0,
    },
  ];

  checks.forEach(({ name, old, new: nv }) => {
    const d = metricDelta(old, nv, name);
    if (!d) return;
    if (d.delta > 0) growth.push(d);
    else declines.push({ metric: name, delta: d.delta });
  });

  const lcDelta =
    (newest.leetcode?.solved?.total || 0) - (oldest.leetcode?.solved?.total || 0);
  if (lcDelta >= 50) {
    achievements.push({
      platform: "LeetCode",
      description: `Solved ${lcDelta} new problems in this period`,
      date: inPeriod[inPeriod.length - 1].date.toISOString(),
    });
  }

  const cfNew = newest.codeforces?.rating || 0;
  const cfOld = oldest.codeforces?.rating || 0;
  if (cfNew >= 1600 && cfOld < 1600) {
    achievements.push({
      platform: "Codeforces",
      description: "Reached Candidate Master threshold (1600+)",
      date: inPeriod[inPeriod.length - 1].date.toISOString(),
    });
  }

  return {
    period,
    startDate: inPeriod[0].date.toISOString(),
    endDate: inPeriod[inPeriod.length - 1].date.toISOString(),
    growth,
    achievements,
    declines,
  };
}
