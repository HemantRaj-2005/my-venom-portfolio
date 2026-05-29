import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { connection } from "next/server";
import { syncDeveloperStats } from "@/lib/api-sync";

export async function GET() {
  await connection();

  try {
    // Retrieve the first DevProfile — create an empty one if none exists
    let profile = await db.devProfile.findFirst();

    if (!profile) {
      profile = await db.devProfile.create({ data: {} });
    }

    let stats = null;
    if (profile.statsCache) {
      stats = JSON.parse(profile.statsCache);
    } else if (profile.github || profile.leetcode || profile.codeforces) {
      // Only sync if at least one handle is configured
      stats = await syncDeveloperStats(profile.id);
    }

    const isSynced: boolean = stats?.isSynced === true;
    const lastSynced: string | null = stats?.lastSynced || null;

    return NextResponse.json({
      success: true,
      profile: {
        id: profile.id,
        name: (profile as any).name || null,
        bio: (profile as any).bio || null,
        roles: (profile as any).roles || [],
        github: profile.github || null,
        leetcode: profile.leetcode || null,
        codeforces: profile.codeforces || null,
        codechef: profile.codechef || null,
        geeksforgeeks: profile.geeksforgeeks || null,
        hackerrank: profile.hackerrank || null,
        atcoder: profile.atcoder || null,
        hackerearth: profile.hackerearth || null,
        resumeUrl: (profile as any).resumeUrl || null,
      },
      stats,
      isSynced,
      lastSynced,
    });
  } catch (e) {
    console.error("Public developer stats query failed:", e);
    return NextResponse.json({ error: "Failed to query stats payload." }, { status: 500 });
  }
}
