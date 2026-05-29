import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { connection } from "next/server";

export async function GET() {
  await connection();

  try {
    const report = await db.aiReport.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!report) {
      return NextResponse.json({
        success: true,
        aiInsights: null,
        generatedAt: null,
        message: "Analytics are being generated. Connect platforms and sync from admin.",
      });
    }

    return NextResponse.json({
      success: true,
      aiInsights: {
        developerLevel: report.developerLevel,
        strengths: report.strengths,
        weaknesses: report.weaknesses,
        dsaAnalysis: report.dsaAnalysis,
        contestForecast: report.contestForecast,
        gitAnalysis: report.gitAnalysis,
        careerReadiness: report.careerReadiness,
        predictions: report.predictions,
      },
      generatedAt: report.createdAt.toISOString(),
      reportId: report.id,
    });
  } catch (e) {
    console.error("AI insights API error:", e);
    return NextResponse.json({ error: "Failed to fetch AI insights" }, { status: 500 });
  }
}
