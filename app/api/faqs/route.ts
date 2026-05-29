import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { connection } from "next/server";

// Public: GET all FAQs sorted by order ascending
export async function GET() {
  await connection();
  try {
    const faqs = await db.faq.findMany({
      orderBy: { order: "asc" }
    });
    return NextResponse.json({ success: true, faqs });
  } catch (e) {
    console.error("Failed to query FAQs:", e);
    return NextResponse.json({ error: "Failed to fetch FAQ logs." }, { status: 500 });
  }
}

// Admin: POST a new FAQ
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    if (!session || role !== "ADMIN") {
      return NextResponse.json({ error: "Access Denied: Unauthorised." }, { status: 403 });
    }

    const { question, answer, order } = await req.json();

    if (!question || !answer) {
      return NextResponse.json({ error: "Question and answer are required parameters." }, { status: 400 });
    }

    const faq = await db.faq.create({
      data: {
        question,
        answer,
        order: parseInt(order) || 0
      }
    });

    return NextResponse.json({ success: true, faq });
  } catch (e) {
    console.error("Failed to create FAQ:", e);
    return NextResponse.json({ error: "Failed to insert FAQ record." }, { status: 500 });
  }
}

// Admin: DELETE an FAQ
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    if (!session || role !== "ADMIN") {
      return NextResponse.json({ error: "Access Denied: Unauthorised." }, { status: 403 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "FAQ ID parameter is required." }, { status: 400 });
    }

    const deletedFaq = await db.faq.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, faq: deletedFaq });
  } catch (e) {
    console.error("Failed to delete FAQ:", e);
    return NextResponse.json({ error: "Failed to remove FAQ record." }, { status: 500 });
  }
}
