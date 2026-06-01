import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadToCloudinary, deleteFromCloudinary, getCloudinaryPublicId } from "@/lib/cloudinary";

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
    const role = (session?.user as Record<string, unknown>)?.role;
    if (!session || role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("resume") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file received. Please select a PDF file." }, { status: 400 });
    }

    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      return NextResponse.json({ success: false, error: "Only PDF files are accepted. Received: " + file.type }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "File size exceeds 10 MB limit. Current size: " + Math.round(file.size / 1024 / 1024) + " MB" }, { status: 400 });
    }

    // Delete old resume from Cloudinary if exists
    const existing = await db.devProfile.findFirst();
    if (existing?.resumeUrl) {
      const oldPublicId = getCloudinaryPublicId(existing.resumeUrl);
      if (oldPublicId) {
        try {
          await deleteFromCloudinary(oldPublicId);
        } catch (e) {
          console.warn("Failed to delete old resume from Cloudinary:", e);
        }
      }
    }

    // Upload to Cloudinary
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadToCloudinary(buffer, {
      folder: "resumes",
      resourceType: "raw",
    });

    if (!result.success || !result.url) {
      return NextResponse.json({ success: false, error: result.error || "Cloudinary upload failed." }, { status: 500 });
    }

    // Update the devProfile resumeUrl in DB
    if (existing) {
      await db.devProfile.update({
        where: { id: existing.id },
        data: { resumeUrl: result.url },
      });
    } else {
      await db.devProfile.create({
        data: { resumeUrl: result.url },
      });
    }

    return NextResponse.json({ success: true, resumeUrl: result.url });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Upload failed.";
    console.error("Resume upload error:", e);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// DELETE: remove the uploaded resume
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as Record<string, unknown>)?.role;
    if (!session || role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const existing = await db.devProfile.findFirst();
    if (existing?.resumeUrl) {
      const publicId = getCloudinaryPublicId(existing.resumeUrl);
      if (publicId) {
        try {
          await deleteFromCloudinary(publicId);
        } catch (e) {
          console.warn("Failed to delete resume from Cloudinary:", e);
        }
      }

      await db.devProfile.update({
        where: { id: existing.id },
        data: { resumeUrl: null },
      });
    }

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Delete failed.";
    console.error("Resume delete error:", e);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
