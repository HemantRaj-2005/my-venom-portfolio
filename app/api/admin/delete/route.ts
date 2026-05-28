import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    if (!session || role !== "ADMIN") {
      return NextResponse.json({ error: "Access Denied: Unauthorised." }, { status: 403 });
    }

    const { type, id } = await req.json();

    if (!type || !id) {
      return NextResponse.json({ error: "Missing arguments: type and id are required." }, { status: 400 });
    }

    let deletedRecord = null;

    if (type === "lead") {
      deletedRecord = await db.lead.delete({
        where: { id }
      });
    } else if (type === "callback") {
      deletedRecord = await db.callbackRequest.delete({
        where: { id }
      });
    } else if (type === "message") {
      deletedRecord = await db.contactMessage.delete({
        where: { id }
      });
    } else if (type === "subscriber") {
      deletedRecord = await db.newsletterSubscriber.delete({
        where: { id }
      });
    } else {
      return NextResponse.json({ error: "Invalid target entity type." }, { status: 400 });
    }

    return NextResponse.json({ success: true, record: deletedRecord });
  } catch (e) {
    console.error("Failed to delete record:", e);
    return NextResponse.json({ error: "Database transaction failed." }, { status: 500 });
  }
}
