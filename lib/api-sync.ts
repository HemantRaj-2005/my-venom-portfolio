import { db } from "./db";
import { GoogleGenAI } from "@google/genai";
import {
  scrapeGithub,
  scrapeLeetcode,
  scrapeCodeforces,
  scrapeCodechef,
  scrapeGfg,
  scrapeHackerrank,
  scrapeHackerearth,
  scrapeAtcoder,
  scrapeStackoverflow,
  scrapeDevto,
  scrapeKaggle,
} from "./scrapers";
import { buildUnifiedHeatmap } from "./analytics/heatmap";
import { computeDeveloperScores } from "./analytics/scores";

type ScrapeResult = { success: boolean; data?: Record<string, unknown>; error?: string };

const PLATFORMS = [
  "github",
  "leetcode",
  "codeforces",
  "codechef",
  "geeksforgeeks",
  "hackerrank",
  "hackerearth",
  "atcoder",
  "stackoverflow",
  "devto",
  "kaggle",
] as const;

type Platform = (typeof PLATFORMS)[number];

async function logSync(platform: string, status: string, message?: string, duration?: number) {
  await db.syncLog.create({
    data: { platform, status, message: message || null, duration: duration || null },
  });
}

async function syncPlatform(
  platform: Platform,
  username: string
): Promise<{ platform: Platform; result: ScrapeResult }> {
  const start = Date.now();
  let result: ScrapeResult;

  switch (platform) {
    case "github":
      result = await scrapeGithub(username);
      break;
    case "leetcode":
      result = await scrapeLeetcode(username);
      break;
    case "codeforces":
      result = await scrapeCodeforces(username);
      break;
    case "codechef":
      result = await scrapeCodechef(username);
      break;
    case "geeksforgeeks":
      result = await scrapeGfg(username);
      break;
    case "hackerrank":
      result = await scrapeHackerrank(username);
      break;
    case "hackerearth":
      result = await scrapeHackerearth(username);
      break;
    case "atcoder":
      result = await scrapeAtcoder(username);
      break;
    case "stackoverflow":
      result = await scrapeStackoverflow(username);
      break;
    case "devto":
      result = await scrapeDevto(username);
      break;
    case "kaggle":
      result = await scrapeKaggle(username);
      break;
    default:
      result = { success: false, error: "Unknown platform" };
  }

  const duration = Date.now() - start;
  await logSync(
    platform,
    result.success ? "success" : "error",
    result.success ? undefined : result.error,
    duration
  );

  return { platform, result };
}

async function persistPlatformData(platform: Platform, data: Record<string, unknown>) {
  const now = new Date();
  const record = data as never;

  switch (platform) {
    case "github":
      await db.githubProfile.upsert({
        where: { username: data.username as string },
        update: record,
        create: record,
      });
      await db.githubHistory.create({
        data: {
          username: data.username as string,
          date: now,
          commits: (data.totalCommits as number) || 0,
          stars: (data.totalStars as number) || 0,
          prs: (data.totalPRs as number) || 0,
          issues: (data.totalIssues as number) || 0,
        },
      });
      if (data.heatmap) {
        try {
          const heatmap = JSON.parse(data.heatmap as string) as { date: string; count: number }[];
          for (const cell of heatmap.filter((c) => c.count > 0).slice(-30)) {
            await db.activityHistory.create({
              data: {
                platform: "github",
                date: new Date(cell.date),
                count: cell.count,
                details: "commits",
              },
            });
          }
        } catch {
          /* skip activity writes */
        }
      }
      break;

    case "leetcode":
      await db.leetcodeProfile.upsert({
        where: { username: data.username as string },
        update: record,
        create: record,
      });
      await db.leetcodeHistory.create({
        data: {
          username: data.username as string,
          date: now,
          solvedTotal: (data.solvedTotal as number) || 0,
          rating: (data.contestRating as number) || 0,
        },
      });
      if (data.contestHistory) {
        try {
          const contests = JSON.parse(data.contestHistory as string) as {
            name: string;
            rating: number;
            rank: number;
            date?: string;
          }[];
          for (const c of contests.slice(-5)) {
            await db.contestHistory.create({
              data: {
                platform: "LeetCode",
                contestId: c.name,
                name: c.name,
                date: c.date ? new Date(c.date) : now,
                rating: c.rating,
                rank: c.rank,
              },
            });
          }
        } catch {
          /* skip */
        }
      }
      break;

    case "codeforces":
      await db.codeforcesProfile.upsert({
        where: { username: data.username as string },
        update: record,
        create: record,
      });
      await db.codeforcesHistory.create({
        data: {
          username: data.username as string,
          date: now,
          rating: (data.rating as number) || 0,
          solved: (data.solved as number) || 0,
        },
      });
      if (data.history) {
        try {
          const history = JSON.parse(data.history as string) as {
            contest: string;
            rating: number;
            rank: string;
            date?: string;
          }[];
          for (const c of history.slice(-5)) {
            await db.contestHistory.create({
              data: {
                platform: "Codeforces",
                contestId: c.contest,
                name: c.contest,
                date: c.date ? new Date(c.date) : now,
                rating: c.rating,
                rank: parseInt(String(c.rank).replace(/\D/g, ""), 10) || 0,
              },
            });
          }
        } catch {
          /* skip */
        }
      }
      break;

    case "codechef":
      await db.codechefProfile.upsert({
        where: { username: data.username as string },
        update: record,
        create: record,
      });
      await db.codechefHistory.create({
        data: {
          username: data.username as string,
          date: now,
          rating: (data.rating as number) || 0,
          solved: (data.solved as number) || 0,
        },
      });
      break;

    case "geeksforgeeks":
      await db.gfgProfile.upsert({
        where: { username: data.username as string },
        update: record,
        create: record,
      });
      await db.gfgHistory.create({
        data: {
          username: data.username as string,
          date: now,
          codingScore: (data.codingScore as number) || 0,
          solved: (data.solved as number) || 0,
        },
      });
      break;

    case "hackerrank":
      await db.hackerrankProfile.upsert({
        where: { username: data.username as string },
        update: record,
        create: record,
      });
      await db.hackerrankHistory.create({
        data: {
          username: data.username as string,
          date: now,
          rating: (data.rating as number) || 0,
          challenges: (data.challenges as number) || 0,
        },
      });
      break;

    case "hackerearth":
      await db.hackerearthProfile.upsert({
        where: { username: data.username as string },
        update: record,
        create: record,
      });
      await db.hackerearthHistory.create({
        data: {
          username: data.username as string,
          date: now,
          rating: (data.rating as number) || 0,
          challenges: (data.challenges as number) || 0,
        },
      });
      break;

    case "atcoder":
      await db.atcoderProfile.upsert({
        where: { username: data.username as string },
        update: record,
        create: record,
      });
      await db.atcoderHistory.create({
        data: {
          username: data.username as string,
          date: now,
          rating: (data.rating as number) || 0,
        },
      });
      break;

    case "stackoverflow":
      await db.stackoverflowProfile.upsert({
        where: { username: data.username as string },
        update: record,
        create: record,
      });
      await db.stackoverflowHistory.create({
        data: {
          username: data.username as string,
          date: now,
          reputation: (data.reputation as number) || 0,
        },
      });
      break;

    case "devto":
      await db.devtoProfile.upsert({
        where: { username: data.username as string },
        update: record,
        create: record,
      });
      await db.devtoHistory.create({
        data: {
          username: data.username as string,
          date: now,
          articles: (data.articles as number) || 0,
          reactions: (data.reactions as number) || 0,
        },
      });
      break;

    case "kaggle":
      await db.kaggleProfile.upsert({
        where: { username: data.username as string },
        update: record,
        create: record,
      });
      await db.kaggleHistory.create({
        data: {
          username: data.username as string,
          date: now,
          points: (data.points as number) || 0,
          rank: (data.rank as number) || 0,
        },
      });
      break;
  }
}

function getProfileHandle(
  profile: Record<string, unknown>,
  platform: Platform
): string | null {
  const val = profile[platform];
  return typeof val === "string" && val.length > 0 ? val : null;
}

export async function syncDeveloperStats(
  profileId: string,
  singlePlatform?: Platform
) {
  const profile = await db.devProfile.findUnique({ where: { id: profileId } });
  if (!profile) {
    throw new Error("Target Developer Profile not found in database registry.");
  }

  const profileRecord = profile as Record<string, unknown>;
  const platformsToSync = singlePlatform
    ? [singlePlatform]
    : PLATFORMS.filter((p) => getProfileHandle(profileRecord, p));

  const syncResults: Record<string, Record<string, unknown>> = {};

  if (profile.statsCache) {
    try {
      const cached = JSON.parse(profile.statsCache);
      Object.keys(cached).forEach((key) => {
        if (PLATFORMS.includes(key as Platform) && cached[key]) {
          syncResults[key] = cached[key];
        }
      });
    } catch {
      /* start fresh */
    }
  }

  for (const platform of platformsToSync) {
    const handle = getProfileHandle(profileRecord, platform);
    if (!handle) continue;

    const { result } = await syncPlatform(platform, handle);
    if (result.success && result.data) {
      syncResults[platform] = result.data;
      await persistPlatformData(platform, result.data);
    }
  }

  const totalQuestions =
    ((syncResults.leetcode?.solvedTotal as number) || 0) +
    ((syncResults.codeforces?.solved as number) || 0) +
    ((syncResults.codechef?.solved as number) || 0) +
    ((syncResults.geeksforgeeks?.solved as number) || 0) +
    ((syncResults.hackerrank?.challenges as number) || 0) +
    ((syncResults.hackerearth?.challenges as number) || 0) +
    ((syncResults.atcoder?.challenges as number) || 0);

  const recalcTotal = totalQuestions;

  const totalCommits = (syncResults.github?.totalCommits as number) || 0;
  const totalStars = (syncResults.github?.totalStars as number) || 0;
  const totalPRs = (syncResults.github?.totalPRs as number) || 0;
  const totalIssues = (syncResults.github?.totalIssues as number) || 0;
  const activeDays = (syncResults.github?.activeDays as number) || 0;

  const connectedPlatforms = PLATFORMS.filter((p) =>
    getProfileHandle(profileRecord, p)
  ).length;

  const heatmapStats = buildUnifiedHeatmap(syncResults);
  const scores = computeDeveloperScores(syncResults, heatmapStats);

  const maxStreak = Math.max(
    heatmapStats.longestStreak,
    (syncResults.github?.streak as number) || 0,
    (syncResults.leetcode?.streak as number) || 0,
    (syncResults.geeksforgeeks?.streak as number) || 0
  );

  const aggregatedStats: Record<string, unknown> = {
    github: syncResults.github
      ? {
          profile: {
            name: syncResults.github.name || "",
            avatarUrl: syncResults.github.avatarUrl || "",
            bio: syncResults.github.bio || "",
            location: syncResults.github.location || "",
            followers: syncResults.github.followers || 0,
            following: syncResults.github.following || 0,
            publicRepos: syncResults.github.publicRepos || 0,
            privateRepos: syncResults.github.privateRepos || 0,
            archivedRepos: syncResults.github.archivedRepos || 0,
            forkedRepos: syncResults.github.forkedRepos || 0,
          },
          metrics: {
            totalCommits,
            totalPRs,
            totalIssues,
            totalStars,
            totalForks: syncResults.github.totalForks || 0,
            streak: syncResults.github.streak || 0,
            activeDays,
          },
          languages: syncResults.github.languages
            ? JSON.parse(syncResults.github.languages as string)
            : [],
          heatmap: syncResults.github.heatmap
            ? JSON.parse(syncResults.github.heatmap as string)
            : [],
          recentRepos: syncResults.github.recentRepos
            ? JSON.parse(syncResults.github.recentRepos as string)
            : [],
          growth: syncResults.github.growth
            ? JSON.parse(syncResults.github.growth as string)
            : [],
        }
      : null,
    leetcode: syncResults.leetcode
      ? {
          solved: {
            total: syncResults.leetcode.solvedTotal || 0,
            easy: syncResults.leetcode.solvedEasy || 0,
            medium: syncResults.leetcode.solvedMedium || 0,
            hard: syncResults.leetcode.solvedHard || 0,
          },
          acceptance: syncResults.leetcode.acceptance || "0%",
          streak: syncResults.leetcode.streak || 0,
          ranking: syncResults.leetcode.ranking || 0,
          contestRating: syncResults.leetcode.contestRating || 0,
          contestRank: syncResults.leetcode.contestRank || "N/A",
          contestHistory: syncResults.leetcode.contestHistory
            ? JSON.parse(syncResults.leetcode.contestHistory as string)
            : [],
          topicSolve: syncResults.leetcode.topicSolve
            ? JSON.parse(syncResults.leetcode.topicSolve as string)
            : [],
        }
      : null,
    codeforces: syncResults.codeforces
      ? {
          rating: syncResults.codeforces.rating || 0,
          maxRating: syncResults.codeforces.maxRating || 0,
          rank: syncResults.codeforces.rank || "N/A",
          maxRank: syncResults.codeforces.maxRank || "N/A",
          solved: syncResults.codeforces.solved || 0,
          history: syncResults.codeforces.history
            ? JSON.parse(syncResults.codeforces.history as string)
            : [],
          tags: syncResults.codeforces.tags
            ? JSON.parse(syncResults.codeforces.tags as string)
            : [],
        }
      : null,
    codechef: syncResults.codechef
      ? {
          stars: syncResults.codechef.stars || "N/A",
          rating: syncResults.codechef.rating || 0,
          maxRating: syncResults.codechef.maxRating || 0,
          globalRank: syncResults.codechef.globalRank || 0,
          countryRank: syncResults.codechef.countryRank || 0,
          solved: syncResults.codechef.solved || 0,
          history: syncResults.codechef.history
            ? JSON.parse(syncResults.codechef.history as string)
            : [],
        }
      : null,
    geeksforgeeks: syncResults.geeksforgeeks
      ? {
          codingScore: syncResults.geeksforgeeks.codingScore || 0,
          institutionRank: syncResults.geeksforgeeks.institutionRank || 0,
          solved: syncResults.geeksforgeeks.solved || 0,
          streak: syncResults.geeksforgeeks.streak || 0,
          practiceHistory: syncResults.geeksforgeeks.practiceHistory
            ? JSON.parse(syncResults.geeksforgeeks.practiceHistory as string)
            : [],
          topicStrengths: syncResults.geeksforgeeks.topicStrengths
            ? JSON.parse(syncResults.geeksforgeeks.topicStrengths as string)
            : [],
        }
      : null,
    hackerrank: syncResults.hackerrank || null,
    hackerearth: syncResults.hackerearth || null,
    atcoder: syncResults.atcoder || null,
    stackoverflow: syncResults.stackoverflow || null,
    devto: syncResults.devto || null,
    kaggle: syncResults.kaggle || null,
    aggregates: {
      totalQuestions: recalcTotal,
      connectedPlatforms,
      maxStreak,
      currentStreak: heatmapStats.currentStreak,
      totalCommits,
      totalPRs,
      totalIssues,
      totalStars,
      activeDays: heatmapStats.activeDays,
      unifiedHeatmap: heatmapStats.daily,
    },
    heatmapStats,
    scores,
    lastSynced: new Date().toISOString(),
    isSynced: Object.keys(syncResults).length > 0,
  };

  let aiInsights: {
    developerLevel: string;
    strengths: string[];
    weaknesses: string[];
    dsaAnalysis: string;
    contestForecast: string;
    gitAnalysis: string;
    careerReadiness: string;
    predictions: string;
  } | null = null;
  let aiReportId: string | null = null;

  if (
    profile.aiInsightsEnabled !== false &&
    process.env.GEMINI_API_KEY &&
    Object.keys(syncResults).length > 0
  ) {
    try {
      const recentSnapshots = await db.analyticsSnapshot.findMany({
        orderBy: { date: "desc" },
        take: 30,
      });

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `You are an expert technical recruiter analyzing developer telemetry.
Analyze ONLY the data provided below. If a field is missing, state "insufficient data" for that section.
Do NOT invent statistics.

Developer Data:
${JSON.stringify(aggregatedStats)}

Recent Snapshots:
${JSON.stringify(recentSnapshots.map((s) => ({ date: s.date, overallScore: s.overallScore })))}

Return JSON matching this interface exactly:
{
  "developerLevel": "string",
  "strengths": ["string"],
  "weaknesses": ["string"],
  "dsaAnalysis": "string",
  "contestForecast": "string",
  "gitAnalysis": "string",
  "careerReadiness": "string",
  "predictions": "string"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" },
      });

      if (response.text) {
        aiInsights = JSON.parse(response.text.trim());
        const report = await db.aiReport.create({
          data: {
            developerLevel: aiInsights.developerLevel,
            strengths: aiInsights.strengths,
            weaknesses: aiInsights.weaknesses,
            dsaAnalysis: aiInsights.dsaAnalysis,
            contestForecast: aiInsights.contestForecast,
            gitAnalysis: aiInsights.gitAnalysis,
            careerReadiness: aiInsights.careerReadiness,
            predictions: aiInsights.predictions,
            rawSummary: JSON.stringify(aggregatedStats),
          },
        });
        aiReportId = report.id;
      }
    } catch (err) {
      console.warn("AI intelligence report failed:", err);
    }
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const existingSnapshot = await db.analyticsSnapshot.findFirst({
    where: { date: { gte: today } },
    orderBy: { date: "desc" },
  });

  const overallScore = scores.overallScore ?? 0;
  if (existingSnapshot) {
    await db.analyticsSnapshot.update({
      where: { id: existingSnapshot.id },
      data: {
        metrics: JSON.stringify(aggregatedStats),
        overallScore,
      },
    });
  } else {
    await db.analyticsSnapshot.create({
      data: {
        metrics: JSON.stringify(aggregatedStats),
        overallScore,
      },
    });
  }

  const cachedPayload = {
    ...aggregatedStats,
    aiInsights,
    aiReportId,
  };

  await db.devProfile.update({
    where: { id: profileId },
    data: { statsCache: JSON.stringify(cachedPayload) },
  });

  return cachedPayload;
}

export type DevStatsTelemetry = Awaited<ReturnType<typeof syncDeveloperStats>>;
export { PLATFORMS };
export type { Platform };
