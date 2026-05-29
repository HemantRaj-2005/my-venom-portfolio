export interface DeveloperScores {
  dsaScore: number | null;
  openSourceScore: number | null;
  consistencyScore: number | null;
  productivityScore: number | null;
  aiEngineeringScore: number | null;
  backendScore: number | null;
  frontendScore: number | null;
  learningVelocityScore: number | null;
  interviewReadinessScore: number | null;
  developerGrowthScore: number | null;
  communityContributionScore: number | null;
  problemSolvingScore: number | null;
  systemDesignReadinessScore: number | null;
  overallScore: number | null;
}

interface SyncData {
  leetcode?: { solvedTotal?: number; solvedHard?: number; contestRating?: number };
  codeforces?: { solved?: number; rating?: number };
  codechef?: { solved?: number; rating?: number };
  geeksforgeeks?: { solved?: number };
  hackerrank?: { challenges?: number };
  hackerearth?: { challenges?: number };
  atcoder?: { challenges?: number; rating?: number };
  github?: {
    totalCommits?: number;
    totalStars?: number;
    totalPRs?: number;
    totalForks?: number;
    streak?: number;
    activeDays?: number;
    languages?: string;
  };
  stackoverflow?: { reputation?: number };
  kaggle?: { points?: number };
  devto?: { articles?: number };
}

function clamp(val: number, max = 100): number {
  return Math.min(Math.max(Math.round(val), 0), max);
}

export function computeDeveloperScores(
  syncResults: SyncData,
  heatmapStats: { currentStreak: number; activeDays: number; longestStreak: number }
): DeveloperScores {
  const totalQuestions =
    (syncResults.leetcode?.solvedTotal || 0) +
    (syncResults.codeforces?.solved || 0) +
    (syncResults.codechef?.solved || 0) +
    (syncResults.geeksforgeeks?.solved || 0) +
    (syncResults.hackerrank?.challenges || 0) +
    (syncResults.hackerearth?.challenges || 0) +
    (syncResults.atcoder?.challenges || 0);

  const hardWeight = syncResults.leetcode?.solvedHard || 0;
  const totalCommits = syncResults.github?.totalCommits || 0;
  const totalStars = syncResults.github?.totalStars || 0;
  const totalPRs = syncResults.github?.totalPRs || 0;
  const maxStreak = Math.max(
    heatmapStats.longestStreak,
    syncResults.github?.streak || 0
  );

  const dsaScore =
    totalQuestions > 0
      ? clamp(40 + (totalQuestions / 800) * 40 + (hardWeight / 100) * 20)
      : null;

  const openSourceScore =
    totalCommits > 0
      ? clamp(30 + (totalCommits / 300) * 30 + (totalStars / 20) * 20 + totalPRs * 2)
      : null;

  const consistencyScore =
    heatmapStats.activeDays > 0
      ? clamp(30 + (heatmapStats.activeDays / 365) * 40 + maxStreak * 0.3)
      : null;

  const productivityScore =
    totalCommits > 0
      ? clamp(40 + (totalCommits / 400) * 35 + maxStreak * 0.15)
      : null;

  const aiEngineeringScore = syncResults.kaggle?.points
    ? clamp(50 + (syncResults.kaggle.points / 2000) * 50)
    : null;

  const backendScore = syncResults.stackoverflow?.reputation
    ? clamp(40 + (syncResults.stackoverflow.reputation / 2000) * 60)
    : syncResults.github?.totalCommits
      ? clamp(40 + (syncResults.github.totalCommits / 500) * 40)
      : null;

  let frontendScore: number | null = null;
  if (syncResults.github?.languages) {
    try {
      const langs = JSON.parse(syncResults.github.languages) as { name: string; percent: number }[];
      const fe = langs.find((l) =>
        ["TypeScript", "JavaScript", "HTML", "CSS", "React"].includes(l.name)
      );
      if (fe) frontendScore = clamp(40 + fe.percent * 0.6);
    } catch {
      /* skip */
    }
  }

  const contestRatings = [
    syncResults.leetcode?.contestRating,
    syncResults.codeforces?.rating,
    syncResults.codechef?.rating,
    syncResults.atcoder?.rating,
  ].filter((r): r is number => !!r && r > 0);

  const avgContestRating =
    contestRatings.length > 0
      ? contestRatings.reduce((a, b) => a + b, 0) / contestRatings.length
      : 0;

  const learningVelocityScore =
    totalQuestions > 0 && heatmapStats.activeDays > 0
      ? clamp((totalQuestions / heatmapStats.activeDays) * 10 + 30)
      : null;

  const problemSolvingScore = dsaScore;

  const interviewReadinessScore =
    dsaScore !== null && consistencyScore !== null
      ? clamp(
          (dsaScore * 0.4 +
            (consistencyScore || 0) * 0.2 +
            (avgContestRating > 0 ? (avgContestRating / 2400) * 100 * 0.25 : 0) +
            (openSourceScore || 0) * 0.15)
        )
      : null;

  const communityContributionScore =
    (syncResults.stackoverflow?.reputation || 0) > 0 ||
    (syncResults.devto?.articles || 0) > 0 ||
    totalPRs > 0
      ? clamp(
          ((syncResults.stackoverflow?.reputation || 0) / 1000) * 30 +
            (syncResults.devto?.articles || 0) * 5 +
            totalPRs * 3 +
            20
        )
      : null;

  const systemDesignReadinessScore =
    totalStars > 10 && totalCommits > 100
      ? clamp(40 + (totalStars / 50) * 30 + (totalCommits / 500) * 30)
      : null;

  const developerGrowthScore =
    dsaScore !== null && productivityScore !== null
      ? clamp((dsaScore + productivityScore + (learningVelocityScore || 0)) / 3)
      : null;

  const scoreValues = [
    dsaScore,
    openSourceScore,
    consistencyScore,
    productivityScore,
  ].filter((s): s is number => s !== null);

  const overallScore =
    scoreValues.length > 0
      ? clamp(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length)
      : null;

  return {
    dsaScore,
    openSourceScore,
    consistencyScore,
    productivityScore,
    aiEngineeringScore,
    backendScore,
    frontendScore,
    learningVelocityScore,
    interviewReadinessScore,
    developerGrowthScore,
    communityContributionScore,
    problemSolvingScore,
    systemDesignReadinessScore,
    overallScore,
  };
}
