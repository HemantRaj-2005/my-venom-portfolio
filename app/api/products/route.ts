import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const products = await db.product.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: "desc" },
      include: { ratings: true }
    });

    return NextResponse.json({ success: true, products });
  } catch (e) {
    console.error("Failed to query products database:", e);
    return NextResponse.json(
      { error: "Database transaction failed." },
      { status: 500 }
    );
  }
}
