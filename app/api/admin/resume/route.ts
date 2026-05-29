import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import path from "path";
import fs from "fs";

// GET: return current resume URL
export async function GET() {
  try {
    const profile = await db.devProfile.findFirst();
    const resumeUrl = profile?.resumeUrl || null;
    return NextResponse.json({ success: true, resumeUrl });
  } catch (e) {
    console.error("Resume fetch error:", e);
    return NextResponse.json({ success: false, error: "Failed to fetch resume info." }, { status: 500 });
  }
}

// POST: upload a new resume PDF
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session || role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("resume") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file received." }, { status: 400 });
    }

    if (!file.name.endsWith(".pdf")) {
      return NextResponse.json({ success: false, error: "Only PDF files are accepted." }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "File size exceeds 10 MB limit." }, { status: 400 });
    }

    // Ensure /public/uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const destPath = path.join(uploadsDir, "resume.pdf");

    // Write file buffer to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(destPath, buffer);

    const resumeUrl = "/uploads/resume.pdf";

    // Update the devProfile resumeUrl in DB
    const existing = await db.devProfile.findFirst();
    if (existing) {
      await db.devProfile.update({
        where: { id: existing.id },
        data: { resumeUrl },
      });
    } else {
      await db.devProfile.create({
        data: { resumeUrl },
      });
    }

    return NextResponse.json({ success: true, resumeUrl });
  } catch (e: any) {
    console.error("Resume upload error:", e);
    return NextResponse.json({ success: false, error: e?.message || "Upload failed." }, { status: 500 });
  }
}

// DELETE: remove the uploaded resume
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session || role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const destPath = path.join(process.cwd(), "public", "uploads", "resume.pdf");
    if (fs.existsSync(destPath)) {
      fs.unlinkSync(destPath);
    }

    const existing = await db.devProfile.findFirst();
    if (existing) {
      await db.devProfile.update({
        where: { id: existing.id },
        data: { resumeUrl: null },
      });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("Resume delete error:", e);
    return NextResponse.json({ success: false, error: e?.message || "Delete failed." }, { status: 500 });
  }
}
