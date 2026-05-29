import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { connection } from "next/server";

const VALID_PLATFORMS = [
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
];

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  await connection();

  try {
    const { platform } = await params;
    if (!VALID_PLATFORMS.includes(platform)) {
      return NextResponse.json({ error: "Invalid platform" }, { status: 400 });
    }

    const profile = await db.devProfile.findFirst();
    if (!profile) {
      return NextResponse.json({ success: true, data: null });
    }

    const handle = (profile as Record<string, unknown>)[platform] as string | null;
    if (!handle) {
      return NextResponse.json({ success: true, data: null, connected: false });
    }

    let profileData = null;
    let history: unknown[] = [];

    switch (platform) {
      case "github":
        profileData = await db.githubProfile.findUnique({ where: { username: handle } });
        history = await db.githubHistory.findMany({
          where: { username: handle },
          orderBy: { date: "desc" },
          take: 30,
        });
        break;
      case "leetcode":
        profileData = await db.leetcodeProfile.findUnique({ where: { username: handle } });
        history = await db.leetcodeHistory.findMany({
          where: { username: handle },
          orderBy: { date: "desc" },
          take: 30,
        });
        break;
      case "codeforces":
        profileData = await db.codeforcesProfile.findUnique({ where: { username: handle } });
        history = await db.codeforcesHistory.findMany({
          where: { username: handle },
          orderBy: { date: "desc" },
          take: 30,
        });
        break;
      case "codechef":
        profileData = await db.codechefProfile.findUnique({ where: { username: handle } });
        history = await db.codechefHistory.findMany({
          where: { username: handle },
          orderBy: { date: "desc" },
          take: 30,
        });
        break;
      case "geeksforgeeks":
        profileData = await db.gfgProfile.findUnique({ where: { username: handle } });
        history = await db.gfgHistory.findMany({
          where: { username: handle },
          orderBy: { date: "desc" },
          take: 30,
        });
        break;
      case "hackerrank":
        profileData = await db.hackerrankProfile.findUnique({ where: { username: handle } });
        history = await db.hackerrankHistory.findMany({
          where: { username: handle },
          orderBy: { date: "desc" },
          take: 30,
        });
        break;
      case "hackerearth":
        profileData = await db.hackerearthProfile.findUnique({ where: { username: handle } });
        history = await db.hackerearthHistory.findMany({
          where: { username: handle },
          orderBy: { date: "desc" },
          take: 30,
        });
        break;
      case "atcoder":
        profileData = await db.atcoderProfile.findUnique({ where: { username: handle } });
        history = await db.atcoderHistory.findMany({
          where: { username: handle },
          orderBy: { date: "desc" },
          take: 30,
        });
        break;
      case "stackoverflow":
        profileData = await db.stackoverflowProfile.findUnique({ where: { username: handle } });
        history = await db.stackoverflowHistory.findMany({
          where: { username: handle },
          orderBy: { date: "desc" },
          take: 30,
        });
        break;
      case "devto":
        profileData = await db.devtoProfile.findUnique({ where: { username: handle } });
        history = await db.devtoHistory.findMany({
          where: { username: handle },
          orderBy: { date: "desc" },
          take: 30,
        });
        break;
      case "kaggle":
        profileData = await db.kaggleProfile.findUnique({ where: { username: handle } });
        history = await db.kaggleHistory.findMany({
          where: { username: handle },
          orderBy: { date: "desc" },
          take: 30,
        });
        break;
    }

    return NextResponse.json({
      success: true,
      connected: true,
      handle,
      profile: profileData,
      history,
    });
  } catch (e) {
    console.error("Platform API error:", e);
    return NextResponse.json({ error: "Failed to fetch platform data" }, { status: 500 });
  }
}
