import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { connection } from "next/server";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session || role !== "ADMIN") return null;
  return session;
}

// GET — list all experiences
export async function GET() {
  await connection();
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const experiences = await db.experience.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ success: true, experiences });
  } catch (e) {
    return NextResponse.json({ success: false, error: "Fetch failed." }, { status: 500 });
  }
}

// POST — create a new experience
export async function POST(req: NextRequest) {
  await connection();
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { year, title, description, order } = await req.json();
    if (!year || !title || !description) {
      return NextResponse.json({ success: false, error: "year, title, and description are required." }, { status: 400 });
    }
    const experience = await db.experience.create({
      data: { year, title, description, order: order ?? 0 },
    });
    return NextResponse.json({ success: true, experience });
  } catch (e) {
    return NextResponse.json({ success: false, error: "Create failed." }, { status: 500 });
  }
}

// PUT — update an existing experience
export async function PUT(req: NextRequest) {
  await connection();
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, year, title, description, order } = await req.json();
    if (!id) return NextResponse.json({ success: false, error: "id is required." }, { status: 400 });
    const experience = await db.experience.update({
      where: { id },
      data: { year, title, description, order: order ?? 0 },
    });
    return NextResponse.json({ success: true, experience });
  } catch (e) {
    return NextResponse.json({ success: false, error: "Update failed." }, { status: 500 });
  }
}

// DELETE — remove an experience by id
export async function DELETE(req: NextRequest) {
  await connection();
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "id query param required." }, { status: 400 });
    await db.experience.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: "Delete failed." }, { status: 500 });
  }
}
