import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { connection } from "next/server";
import { syncDeveloperStats } from "@/lib/api-sync";
import type { AnalyticsProfile, AnalyticsResponse } from "@/types/analytics";

export async function GET() {
  await connection();

  try {
    let profile = await db.devProfile.findFirst();
    if (!profile) {
      profile = await db.devProfile.create({ data: {} });
    }

    let stats = null;
    if (profile.statsCache) {
      stats = JSON.parse(profile.statsCache);
    } else if (
      profile.github ||
      profile.leetcode ||
      profile.codeforces ||
      profile.codechef ||
      profile.geeksforgeeks
    ) {
      stats = await syncDeveloperStats(profile.id);
    }

    const recentLogs = await db.syncLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const platformStatus = [
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
      "code360",
      "interviewbit",
    ].map((platform) => {
      const handle = (profile as Record<string, unknown>)[platform];
      const log = recentLogs.find((l) => l.platform === platform);
      return {
        platform,
        connected: !!handle,
        lastSync: log?.createdAt?.toISOString() || null,
        error: log?.status === "error" ? log.message : null,
      };
    });

    const response: AnalyticsResponse = {
      success: true,
      profile: {
        id: profile.id,
        name: profile.name || null,
        bio: profile.bio || null,
        roles: profile.roles || [],
        github: profile.github || null,
        leetcode: profile.leetcode || null,
        codeforces: profile.codeforces || null,
        codechef: profile.codechef || null,
        geeksforgeeks: profile.geeksforgeeks || null,
        hackerrank: profile.hackerrank || null,
        atcoder: profile.atcoder || null,
        hackerearth: profile.hackerearth || null,
        stackoverflow: profile.stackoverflow || null,
        devto: profile.devto || null,
        kaggle: profile.kaggle || null,
        code360: (profile as Record<string, unknown>).code360 as string || null,
        interviewbit: (profile as Record<string, unknown>).interviewbit as string || null,
        resumeUrl: profile.resumeUrl || null,
      } satisfies AnalyticsProfile,
      stats,
      isSynced: stats?.isSynced === true,
      lastSynced: stats?.lastSynced || null,
      platformStatus,
    };

    return NextResponse.json(response);
  } catch (e) {
    console.error("Public developer stats query failed:", e);
    return NextResponse.json({ error: "Failed to query stats payload." }, { status: 500 });
  }
}
