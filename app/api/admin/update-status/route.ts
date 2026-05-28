import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    if (!session || role !== "ADMIN") {
      return NextResponse.json({ error: "Access Denied: Unauthorised." }, { status: 403 });
    }

    const { type, id, status } = await req.json();

    if (!type || !id || !status) {
      return NextResponse.json({ error: "Missing arguments: type, id, and status are required." }, { status: 400 });
    }

    let updatedRecord = null;

    if (type === "lead") {
      updatedRecord = await db.lead.update({
        where: { id },
        data: { status }
      });
    } else if (type === "callback") {
      updatedRecord = await db.callbackRequest.update({
        where: { id },
        data: { status }
      });
    } else if (type === "message") {
      updatedRecord = await db.contactMessage.update({
        where: { id },
        data: { status }
      });
    } else {
      return NextResponse.json({ error: "Invalid entity type specified." }, { status: 400 });
    }

    return NextResponse.json({ success: true, record: updatedRecord });
  } catch (e) {
    console.error("Failed to update status flags:", e);
    return NextResponse.json({ error: "Database transaction failed." }, { status: 500 });
  }
}
