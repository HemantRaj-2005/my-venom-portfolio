import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { connection } from "next/server";
import { syncDeveloperStats } from "@/lib/api-sync";

export async function GET() {
  await connection();

  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!session || role !== "ADMIN") {
    return NextResponse.json({ error: "Access Denied: Unauthorised node credentials." }, { status: 403 });
  }

  try {
    let profile = await db.devProfile.findFirst();
    if (!profile) {
      profile = await db.devProfile.create({ data: {} });
    }

    return NextResponse.json({ success: true, profile });
  } catch (e) {
    console.error("Integrations get error:", e);
    return NextResponse.json({ error: "Failed to retrieve configuration." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connection();

  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!session || role !== "ADMIN") {
    return NextResponse.json({ error: "Access Denied: Unauthorised node credentials." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      name, bio, roles,
      github, leetcode, codeforces, codechef,
      geeksforgeeks, hackerrank, atcoder, hackerearth,
      triggerSync
    } = body;

    let profile = await db.devProfile.findFirst();
    if (!profile) {
      profile = await db.devProfile.create({
        data: { name, bio, roles: roles || [], github, leetcode, codeforces, codechef, geeksforgeeks, hackerrank, atcoder, hackerearth }
      });
    } else {
      profile = await db.devProfile.update({
        where: { id: profile.id },
        data: { name, bio, roles: roles || [], github, leetcode, codeforces, codechef, geeksforgeeks, hackerrank, atcoder, hackerearth }
      });
    }

    let stats = null;
    if (triggerSync && (github || leetcode || codeforces)) {
      stats = await syncDeveloperStats(profile.id);
    } else if (profile.statsCache) {
      stats = JSON.parse(profile.statsCache);
    }

    return NextResponse.json({ success: true, profile, stats });
  } catch (e) {
    console.error("Integrations save error:", e);
    return NextResponse.json({ error: "Failed to update configuration details." }, { status: 500 });
  }
}
