import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { connection } from "next/server";
import { generatePeriodReport } from "@/lib/analytics/reports";

export async function GET(req: NextRequest) {
  await connection();

  try {
    const period = req.nextUrl.searchParams.get("period") || "monthly";
    const validPeriods = ["weekly", "monthly", "quarterly", "yearly"];
    if (!validPeriods.includes(period)) {
      return NextResponse.json({ error: "Invalid period" }, { status: 400 });
    }

    const snapshots = await db.analyticsSnapshot.findMany({
      orderBy: { date: "asc" },
      take: 365,
    });

    const report = generatePeriodReport(
      snapshots,
      period as "weekly" | "monthly" | "quarterly" | "yearly"
    );

    return NextResponse.json({
      success: true,
      snapshots: snapshots.map((s) => ({
        id: s.id,
        date: s.date.toISOString(),
        overallScore: s.overallScore,
      })),
      report,
    });
  } catch (e) {
    console.error("History API error:", e);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}
