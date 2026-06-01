import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { connection } from "next/server";
import { syncDeveloperStats, PLATFORMS, type Platform } from "@/lib/api-sync";

export async function GET(req: NextRequest) {
  await connection();

  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;

  if (!session || role !== "ADMIN") {
    return NextResponse.json({ error: "Access Denied: Unauthorised node credentials." }, { status: 403 });
  }

  try {
    let profile = await db.devProfile.findFirst();
    if (!profile) {
      profile = await db.devProfile.create({ data: {} });
    }

    const syncLogs = await db.syncLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    const envStatus = {
      githubToken: !!process.env.GITHUB_TOKEN,
      geminiKey: !!process.env.GEMINI_API_KEY,
      stackexchangeKey: !!process.env.STACKEXCHANGE_KEY,
      kaggleKeys: !!(process.env.KAGGLE_USERNAME && process.env.KAGGLE_KEY),
    };

    return NextResponse.json({ success: true, profile, syncLogs, envStatus });
  } catch (e) {
    console.error("Integrations get error:", e);
    return NextResponse.json({ error: "Failed to retrieve configuration." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connection();

  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;

  if (!session || role !== "ADMIN") {
    return NextResponse.json({ error: "Access Denied: Unauthorised node credentials." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      name,
      bio,
      roles,
      github,
      leetcode,
      codeforces,
      codechef,
      geeksforgeeks,
      hackerrank,
      atcoder,
      hackerearth,
      stackoverflow,
      devto,
      kaggle,
      code360,
      interviewbit,
      platformVisibility,
      aiInsightsEnabled,
      triggerSync,
      syncPlatform: singlePlatform,
    } = body;

    let profile = await db.devProfile.findFirst();
    const data = {
      name,
      bio,
      roles: roles || [],
      github,
      leetcode,
      codeforces,
      codechef,
      geeksforgeeks,
      hackerrank,
      atcoder,
      hackerearth,
      stackoverflow,
      devto,
      kaggle,
      code360,
      interviewbit,
      platformVisibility: platformVisibility
        ? JSON.stringify(platformVisibility)
        : undefined,
      aiInsightsEnabled: aiInsightsEnabled !== undefined ? aiInsightsEnabled : undefined,
    };

    if (!profile) {
      profile = await db.devProfile.create({ data });
    } else {
      profile = await db.devProfile.update({
        where: { id: profile.id },
        data,
      });
    }

    let stats = null;
    const hasHandles =
      github ||
      leetcode ||
      codeforces ||
      codechef ||
      geeksforgeeks ||
      hackerrank ||
      atcoder ||
      hackerearth ||
      stackoverflow ||
      devto ||
      kaggle ||
      code360 ||
      interviewbit;

    if (triggerSync && hasHandles) {
      if (singlePlatform && PLATFORMS.includes(singlePlatform as Platform)) {
        stats = await syncDeveloperStats(profile.id, singlePlatform as Platform);
      } else {
        stats = await syncDeveloperStats(profile.id);
      }
    } else if (profile.statsCache) {
      stats = JSON.parse(profile.statsCache);
    }

    return NextResponse.json({ success: true, profile, stats });
  } catch (e) {
    console.error("Integrations save error:", e);
    return NextResponse.json({ error: "Failed to update configuration details." }, { status: 500 });
  }
}
