import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const projects = await db.project.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ success: true, projects });
  } catch (e) {
    console.error("Failed to query projects database:", e);
    return NextResponse.json(
      { error: "Database transaction failed." },
      { status: 500 }
    );
  }
}
