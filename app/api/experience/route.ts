import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { connection } from "next/server";

export async function GET() {
  await connection();
  try {
    const experiences = await db.experience.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ success: true, experiences });
  } catch (e) {
    console.error("Experience fetch error:", e);
    return NextResponse.json({ success: false, error: "Failed to fetch experience records." }, { status: 500 });
  }
}
