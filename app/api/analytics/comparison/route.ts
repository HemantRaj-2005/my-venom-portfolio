import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { connection } from "next/server";

export async function GET() {
  await connection();

  try {
    const profile = await db.devProfile.findFirst();
    if (!profile?.statsCache) {
      return NextResponse.json({ success: true, comparison: null });
    }

    const stats = JSON.parse(profile.statsCache);

    const platforms = [
      {
        name: "LeetCode",
        solved: stats.leetcode?.solved?.total || 0,
        rating: stats.leetcode?.contestRating || 0,
        activity: stats.leetcode?.streak || 0,
      },
      {
        name: "Codeforces",
        solved: stats.codeforces?.solved || 0,
        rating: stats.codeforces?.rating || 0,
        activity: stats.codeforces?.history?.length || 0,
      },
      {
        name: "CodeChef",
        solved: stats.codechef?.solved || 0,
        rating: stats.codechef?.rating || 0,
        activity: 0,
      },
      {
        name: "GeeksforGeeks",
        solved: stats.geeksforgeeks?.solved || 0,
        rating: stats.geeksforgeeks?.codingScore || 0,
        activity: stats.geeksforgeeks?.streak || 0,
      },
      {
        name: "HackerRank",
        solved: stats.hackerrank?.challenges || 0,
        rating: stats.hackerrank?.rating || 0,
        activity: 0,
      },
      {
        name: "HackerEarth",
        solved: stats.hackerearth?.challenges || 0,
        rating: stats.hackerearth?.rating || 0,
        activity: 0,
      },
      {
        name: "AtCoder",
        solved: stats.atcoder?.challenges || 0,
        rating: stats.atcoder?.rating || 0,
        activity: 0,
      },
      {
        name: "Code360",
        solved: stats.code360?.solved || 0,
        rating: stats.code360?.rating || 0,
        activity: stats.code360?.streak || 0,
      },
      {
        name: "InterviewBit",
        solved: stats.interviewbit?.solved || 0,
        rating: stats.interviewbit?.score || 0,
        activity: stats.interviewbit?.streak || 0,
      },
    ].filter((p) => p.solved > 0 || p.rating > 0);

    return NextResponse.json({
      success: true,
      comparison: {
        platforms,
        scores: stats.scores || {},
        aggregates: stats.aggregates || {},
      },
    });
  } catch (e) {
    console.error("Comparison API error:", e);
    return NextResponse.json({ error: "Failed to fetch comparison" }, { status: 500 });
  }
}
