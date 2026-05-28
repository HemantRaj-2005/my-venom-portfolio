import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, budget, timeline, requirements, projectType, preferredTime } = body;

    // Simple Validation
    if (!name || !email || !projectType) {
      return NextResponse.json(
        { error: "Missing required details. Name, email, and project type are mandatory." },
        { status: 400 }
      );
    }

    const newLead = await db.lead.create({
      data: {
        name,
        email: email.toLowerCase(),
        company: company || "",
        budget: budget || "",
        timeline: timeline || "",
        requirements: requirements || "",
        projectType,
        preferredTime: preferredTime || "",
        status: "PENDING"
      }
    });

    return NextResponse.json({ success: true, lead: newLead });
  } catch (e) {
    console.error("Failed to store CRM Lead:", e);
    return NextResponse.json(
      { error: "Database transaction failed. Please try again." },
      { status: 500 }
    );
  }
}
