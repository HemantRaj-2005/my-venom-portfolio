import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const posts = await db.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ success: true, posts });
  } catch (e) {
    console.error("Failed to query blogs database:", e);
    return NextResponse.json(
      { error: "Database transaction failed." },
      { status: 500 }
    );
  }
}
