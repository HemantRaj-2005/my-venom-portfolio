import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { connection } from "next/server";

export async function GET(req: NextRequest) {
  await connection();
  try {
    // 1. Authenticate session
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    if (!session || role !== "ADMIN") {
      return NextResponse.json({ error: "Access Denied: Unauthorised clearance token." }, { status: 403 });
    }

    // 2. Query collections (Prisma or local JSON file database wrapper handle this transparently)
    const [leads, callbacks, messages, subscribers, visitors] = await Promise.all([
      db.lead.findMany({ orderBy: { createdAt: "desc" } }),
      db.callbackRequest.findMany({ orderBy: { createdAt: "desc" } }),
      db.contactMessage.findMany({ orderBy: { createdAt: "desc" } }),
      db.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } }),
      db.visitorLog.findMany({ orderBy: { createdAt: "desc" }, take: 100 }), // Cap visitors logs at last 100 entries
    ]);

    return NextResponse.json({
      success: true,
      leads,
      callbacks,
      messages,
      subscribers,
      visitors,
    });
  } catch (e) {
    console.error("Dashboard database fetch error:", e);
    return NextResponse.json(
      { error: "Database transaction failed. Please retry." },
      { status: 500 }
    );
  }
}
