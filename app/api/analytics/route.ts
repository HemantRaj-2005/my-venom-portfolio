import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { connection } from "next/server";
import { syncDeveloperStats } from "@/lib/api-sync";

export async function GET() {
  await connection(); // Stop static compilation at build time

  try {
    // Retrieve default profile
    let profile = await db.devProfile.findFirst();

    if (!profile) {
      // Create default mock profile if missing in DB
      profile = await db.devProfile.create({
        data: {
          github: "HemantRaj-2005",
          leetcode: "HemantRaj-2005",
          codeforces: "HemantRaj-2005",
          codechef: "hemant_2005",
          geeksforgeeks: "hemantraj2005",
          hackerrank: "hemant_2005",
          atcoder: "hemant_2005",
          hackerearth: "hemant_2005",
        }
      });
    }

    let stats;
    if (profile.statsCache) {
      stats = JSON.parse(profile.statsCache);
    } else {
      // Trigger dynamic sync if cache is empty
      stats = await syncDeveloperStats(profile.id);
    }

    return NextResponse.json({
      success: true,
      profile: {
        github: profile.github,
        leetcode: profile.leetcode,
        codeforces: profile.codeforces,
        codechef: profile.codechef,
        geeksforgeeks: profile.geeksforgeeks,
        hackerrank: profile.hackerrank,
        atcoder: profile.atcoder,
        hackerearth: profile.hackerearth,
        id: profile.id,
      },
      stats
    });
  } catch (e) {
    console.error("Public developer stats query failed:", e);
    return NextResponse.json({ error: "Failed to query stats payload." }, { status: 500 });
  }
}
