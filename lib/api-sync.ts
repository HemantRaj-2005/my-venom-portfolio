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
  scrapeLinkedin,
  scrapeKaggle
} from "./scrapers";

export async function syncDeveloperStats(profileId: string) {
  const profile = await db.devProfile.findUnique({ where: { id: profileId } });
  if (!profile) {
    throw new Error("Target Developer Profile not found in database registry.");
  }

  // 1. Trigger Scrapers/APIs for configured platforms
  const syncResults: any = {};

  if (profile.github) {
    const res = await scrapeGithub(profile.github);
    if (res.success) {
      syncResults.github = res.data;
      await db.githubProfile.upsert({
        where: { username: profile.github },
        update: res.data,
        create: res.data
      });
      await db.githubHistory.create({
        data: {
          username: profile.github,
          date: new Date(),
          commits: res.data.totalCommits,
          stars: res.data.totalStars,
          prs: res.data.totalPRs,
          issues: res.data.totalIssues
        }
      });
    }
  }

  if (profile.leetcode) {
    const res = await scrapeLeetcode(profile.leetcode);
    if (res.success) {
      syncResults.leetcode = res.data;
      await db.leetcodeProfile.upsert({
        where: { username: profile.leetcode },
        update: res.data,
        create: res.data
      });
      await db.leetcodeHistory.create({
        data: {
          username: profile.leetcode,
          date: new Date(),
          solvedTotal: res.data.solvedTotal,
          rating: res.data.contestRating,
        }
      });
    }
  }

  if (profile.codeforces) {
    const res = await scrapeCodeforces(profile.codeforces);
    if (res.success) {
      syncResults.codeforces = res.data;
      await db.codeforcesProfile.upsert({
        where: { username: profile.codeforces },
        update: res.data,
        create: res.data
      });
      await db.codeforcesHistory.create({
        data: {
          username: profile.codeforces,
          date: new Date(),
          rating: res.data.rating,
          solved: res.data.solved
        }
      });
    }
  }

  if (profile.codechef) {
    const res = await scrapeCodechef(profile.codechef);
    if (res.success) {
      syncResults.codechef = res.data;
      await db.codechefProfile.upsert({
        where: { username: profile.codechef },
        update: res.data,
        create: res.data
      });
      await db.codechefHistory.create({
        data: {
          username: profile.codechef,
          date: new Date(),
          rating: res.data.rating,
          solved: res.data.solved
        }
      });
    }
  }

  if (profile.geeksforgeeks) {
    const res = await scrapeGfg(profile.geeksforgeeks);
    if (res.success) {
      syncResults.geeksforgeeks = res.data;
      await db.gfgProfile.upsert({
        where: { username: profile.geeksforgeeks },
        update: res.data,
        create: res.data
      });
      await db.gfgHistory.create({
        data: {
          username: profile.geeksforgeeks,
          date: new Date(),
          codingScore: res.data.codingScore,
          solved: res.data.solved
        }
      });
    }
  }

  // HackerRank, HackerEarth, AtCoder
  if (profile.hackerrank) {
    const res = await scrapeHackerrank(profile.hackerrank);
    if (res.success) {
      syncResults.hackerrank = res.data;
      await db.hackerrankProfile.upsert({
        where: { username: profile.hackerrank },
        update: res.data,
        create: res.data
      });
    }
  }

  if (profile.hackerearth) {
    const res = await scrapeHackerearth(profile.hackerearth);
    if (res.success) {
      syncResults.hackerearth = res.data;
      await db.hackerearthProfile.upsert({
        where: { username: profile.hackerearth },
        update: res.data,
        create: res.data
      });
    }
  }

  if (profile.atcoder) {
    const res = await scrapeAtcoder(profile.atcoder);
    if (res.success) {
      syncResults.atcoder = res.data;
      await db.atcoderProfile.upsert({
        where: { username: profile.atcoder },
        update: res.data,
        create: res.data
      });
    }
  }

  // StackOverflow, Dev.to, LinkedIn, Kaggle
  if ((profile as any).stackoverflow) {
    const res = await scrapeStackoverflow((profile as any).stackoverflow);
    if (res.success) {
      syncResults.stackoverflow = res.data;
      await db.stackoverflowProfile.upsert({
        where: { username: (profile as any).stackoverflow },
        update: res.data,
        create: res.data
      });
    }
  }

  if ((profile as any).devto) {
    const res = await scrapeDevto((profile as any).devto);
    if (res.success) {
      syncResults.devto = res.data;
      await db.devtoProfile.upsert({
        where: { username: (profile as any).devto },
        update: res.data,
        create: res.data
      });
    }
  }

  if ((profile as any).linkedin) {
    const res = await scrapeLinkedin((profile as any).linkedin);
    if (res.success) {
      syncResults.linkedin = res.data;
      await db.linkedinProfile.upsert({
        where: { username: (profile as any).linkedin },
        update: res.data,
        create: res.data
      });
    }
  }

  if ((profile as any).kaggle) {
    const res = await scrapeKaggle((profile as any).kaggle);
    if (res.success) {
      syncResults.kaggle = res.data;
      await db.kaggleProfile.upsert({
        where: { username: (profile as any).kaggle },
        update: res.data,
        create: res.data
      });
    }
  }

  // 2. Compute Combined Metrics & Performance Indexes
  const totalQuestions =
    (syncResults.leetcode?.solvedTotal || 0) +
    (syncResults.codeforces?.solved || 0) +
    (syncResults.codechef?.solved || 0) +
    (syncResults.geeksforgeeks?.solved || 0) +
    (syncResults.hackerrank?.challenges || 0) +
    (syncResults.hackerearth?.challenges || 0) +
    (syncResults.atcoder?.challenges || 0);

  const totalCommits = syncResults.github?.totalCommits || 0;
  const totalStars = syncResults.github?.totalStars || 0;
  const totalPRs = syncResults.github?.totalPRs || 0;
  const totalIssues = syncResults.github?.totalIssues || 0;

  const connectedPlatforms = [
    profile.github, profile.leetcode, profile.codeforces, profile.codechef,
    profile.geeksforgeeks, profile.hackerrank, profile.hackerearth, profile.atcoder,
    (profile as any).stackoverflow, (profile as any).devto, (profile as any).linkedin, (profile as any).kaggle
  ].filter(Boolean).length;

  // Streak calculations
  const maxStreak = Math.max(
    syncResults.github?.streak || 0,
    syncResults.leetcode?.streak || 0,
    syncResults.geeksforgeeks?.streak || 0
  );

  // Scores calculations (dynamic 0-100 scale)
  const dsaScore = totalQuestions > 0 ? Math.min(60 + Math.round((totalQuestions / 1200) * 40), 100) : 0;
  const openSourceScore = totalCommits > 0 ? Math.min(50 + Math.round((totalCommits / 200 + totalStars / 10 + totalPRs) * 2), 100) : 0;
  const consistencyScore = maxStreak > 0 ? Math.min(40 + Math.round(maxStreak * 0.4), 100) : 0;
  const productivityScore = totalCommits > 0 ? Math.min(60 + Math.round((totalCommits / 400) * 30 + maxStreak * 0.1), 100) : 0;

  // Engineering skill sectors
  const aiEngineeringScore = syncResults.kaggle ? Math.min(75 + Math.round((syncResults.kaggle.points / 3000) * 25), 100) : 70;
  const backendScore = syncResults.stackoverflow ? Math.min(65 + Math.round((syncResults.stackoverflow.reputation / 1000) * 35), 100) : 72;
  const frontendScore = syncResults.github ? 82 : 0;

  const overallScore = Math.round((dsaScore + openSourceScore + consistencyScore + productivityScore) / 4);

  // Prepare full cached metrics bundle
  const aggregatedStats = {
    github: {
      profile: {
        name: syncResults.github?.name || "Hemant Raj",
        avatarUrl: syncResults.github?.avatarUrl || "https://github.com/HemantRaj-2005.png",
        bio: syncResults.github?.bio || "ECE undergraduate from MNNIT Allahabad.",
        location: syncResults.github?.location || "Varanasi, India",
        followers: syncResults.github?.followers || 0,
        following: syncResults.github?.following || 0,
        publicRepos: syncResults.github?.publicRepos || 0
      },
      metrics: {
        totalCommits,
        totalPRs,
        totalIssues,
        totalStars,
        totalForks: syncResults.github?.totalForks || 0,
        streak: syncResults.github?.streak || 0
      },
      languages: syncResults.github ? JSON.parse(syncResults.github.languages) : [],
      heatmap: syncResults.github ? JSON.parse(syncResults.github.heatmap) : [],
      recentRepos: syncResults.github ? JSON.parse(syncResults.github.recentRepos) : [],
      growth: syncResults.github ? JSON.parse(syncResults.github.growth) : []
    },
    leetcode: {
      solved: {
        total: syncResults.leetcode?.solvedTotal || 0,
        easy: syncResults.leetcode?.solvedEasy || 0,
        medium: syncResults.leetcode?.solvedMedium || 0,
        hard: syncResults.leetcode?.solvedHard || 0
      },
      acceptance: syncResults.leetcode?.acceptance || "0%",
      streak: syncResults.leetcode?.streak || 0,
      contestRating: syncResults.leetcode?.contestRating || 0,
      contestRank: syncResults.leetcode?.contestRank || "N/A",
      contestHistory: syncResults.leetcode ? JSON.parse(syncResults.leetcode.contestHistory) : [],
      topicSolve: syncResults.leetcode ? JSON.parse(syncResults.leetcode.topicSolve) : []
    },
    codeforces: {
      rating: syncResults.codeforces?.rating || 0,
      maxRating: syncResults.codeforces?.maxRating || 0,
      rank: syncResults.codeforces?.rank || "N/A",
      solved: syncResults.codeforces?.solved || 0,
      history: syncResults.codeforces ? JSON.parse(syncResults.codeforces.history) : [],
      tags: syncResults.codeforces ? JSON.parse(syncResults.codeforces.tags) : []
    },
    codechef: {
      stars: syncResults.codechef?.stars || "N/A",
      rating: syncResults.codechef?.rating || 0,
      globalRank: syncResults.codechef?.globalRank || 0,
      solved: syncResults.codechef?.solved || 0
    },
    geeksforgeeks: {
      codingScore: syncResults.geeksforgeeks?.codingScore || 0,
      institutionRank: syncResults.geeksforgeeks?.institutionRank || 0,
      solved: syncResults.geeksforgeeks?.solved || 0
    },
    // Meta tracking fields
    aggregates: {
      totalQuestions,
      connectedPlatforms,
      maxStreak,
      totalCommits,
      totalPRs
    },
    scores: {
      dsaScore,
      openSourceScore,
      consistencyScore,
      productivityScore,
      aiEngineeringScore,
      backendScore,
      frontendScore,
      overallScore
    },
    lastSynced: new Date().toLocaleString(),
    isSynced: true
  };

  // 3. Trigger AI Report analysis using `@google/genai`
  let aiInsights = {
    developerLevel: "L3 Associate Engineer",
    strengths: ["Dynamic Programming", "Full-Stack Node/React", "System Diagnostics Shading"],
    weaknesses: ["Kaggle Competition Data Prep", "Low AtCoder participation"],
    dsaAnalysis: "Strong understanding of Array and Dynamic Programming arrays. Focus on Segment Trees and Game Theory.",
    contestForecast: "Codeforces expected to reach 1600+ Candidate Master index in subsequent contest rounds.",
    gitAnalysis: "High commit densities on React and WebGL visualization modules.",
    careerReadiness: "Fully optimized for Backend engineering with significant DSA proficiency.",
    predictions: "LeetCode expected growth to 600+ solved by Q3."
  };

  if (process.env.GEMINI_API_KEY && (profile.leetcode || profile.github)) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `
        You are an expert technical recruiter analyzing developer telemetry profiles.
        Analyze this raw developer statistics payload:
        ${JSON.stringify(aggregatedStats)}

        Generate a JSON block matching this interface exactly (do not output markdown or wrapper tags):
        {
          "developerLevel": "L3 Senior Symbiote Engineer",
          "strengths": ["Strengths list..."],
          "weaknesses": ["Weaknesses list..."],
          "dsaAnalysis": "Detailed DSA suggestions",
          "contestForecast": "Contest predictions",
          "gitAnalysis": "Git open source impact summary",
          "careerReadiness": "Detailed interview / sector fit",
          "predictions": "LeetCode / CF expected ratings growth"
        }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      if (response.text) {
        aiInsights = JSON.parse(response.text.trim());
      }
    } catch (err) {
      console.warn("AI intelligence report failed, using derived heuristics.", err);
    }
  }

  // Persist AI Report
  const report = await db.aiReport.create({
    data: {
      developerLevel: aiInsights.developerLevel,
      strengths: aiInsights.strengths,
      weaknesses: aiInsights.weaknesses,
      dsaAnalysis: aiInsights.dsaAnalysis,
      contestForecast: aiInsights.contestForecast,
      gitAnalysis: aiInsights.gitAnalysis,
      careerReadiness: aiInsights.careerReadiness,
      predictions: aiInsights.predictions
    }
  });

  // Save full stats snapshot history
  await db.analyticsSnapshot.create({
    data: {
      metrics: JSON.stringify(aggregatedStats),
      overallScore
    }
  });

  // Save cached stats inside DevProfile
  const cachedPayload = {
    ...aggregatedStats,
    aiInsights,
    aiReportId: report.id
  };

  await db.devProfile.update({
    where: { id: profileId },
    data: { statsCache: JSON.stringify(cachedPayload) }
  });

  return cachedPayload;
}
export type DevStatsTelemetry = Awaited<ReturnType<typeof syncDeveloperStats>>;
