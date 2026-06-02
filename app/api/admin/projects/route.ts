import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { connection } from "next/server";

// GET: list all projects (admin)
export async function GET() {
  await connection();
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as Record<string, unknown>)?.role;
    if (!session || role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await db.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, projects });
  } catch (e) {
    console.error("Admin projects fetch error:", e);
    return NextResponse.json({ error: "Failed to fetch projects." }, { status: 500 });
  }
}

// POST: create a new project
export async function POST(req: NextRequest) {
  await connection();
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as Record<string, unknown>)?.role;
    if (!session || role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title, slug, overview, features, challenges, architecture,
      techStack, schemaUrl, apiFlow, deployment, gallery,
      demoVideo, liveUrl, githubUrl, performance, seoTitle, seoDesc,
    } = body;

    if (!title || !slug || !overview) {
      return NextResponse.json({ error: "Title, slug, and overview are required." }, { status: 400 });
    }

    const existing = await db.project.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "A project with this slug already exists." }, { status: 400 });
    }

    const project = await db.project.create({
      data: {
        title,
        slug,
        overview,
        features: Array.isArray(features) ? features : [],
        challenges: challenges || null,
        architecture: architecture || null,
        techStack: Array.isArray(techStack) ? techStack : [],
        schemaUrl: schemaUrl || null,
        apiFlow: apiFlow || null,
        deployment: deployment || null,
        gallery: Array.isArray(gallery) ? gallery : [],
        demoVideo: demoVideo || null,
        liveUrl: liveUrl || null,
        githubUrl: githubUrl || null,
        performance: performance ? Number(performance) : null,
        seoTitle: seoTitle || title,
        seoDesc: seoDesc || overview,
      },
    });

    return NextResponse.json({ success: true, project });
  } catch (e) {
    console.error("Admin project create error:", e);
    return NextResponse.json({ error: "Failed to create project." }, { status: 500 });
  }
}

// PUT: update an existing project
export async function PUT(req: NextRequest) {
  await connection();
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as Record<string, unknown>)?.role;
    if (!session || role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      id, title, slug, overview, features, challenges, architecture,
      techStack, schemaUrl, apiFlow, deployment, gallery,
      demoVideo, liveUrl, githubUrl, performance, seoTitle, seoDesc,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Project ID is required." }, { status: 400 });
    }

    const project = await db.project.update({
      where: { id },
      data: {
        title,
        slug,
        overview,
        features: Array.isArray(features) ? features : undefined,
        challenges: challenges !== undefined ? challenges : undefined,
        architecture: architecture !== undefined ? architecture : undefined,
        techStack: Array.isArray(techStack) ? techStack : undefined,
        schemaUrl: schemaUrl !== undefined ? schemaUrl : undefined,
        apiFlow: apiFlow !== undefined ? apiFlow : undefined,
        deployment: deployment !== undefined ? deployment : undefined,
        gallery: Array.isArray(gallery) ? gallery : undefined,
        demoVideo: demoVideo !== undefined ? demoVideo : undefined,
        liveUrl: liveUrl !== undefined ? liveUrl : undefined,
        githubUrl: githubUrl !== undefined ? githubUrl : undefined,
        performance: performance !== undefined ? (performance ? Number(performance) : null) : undefined,
        seoTitle: seoTitle || title,
        seoDesc: seoDesc || overview,
      },
    });

    return NextResponse.json({ success: true, project });
  } catch (e) {
    console.error("Admin project update error:", e);
    return NextResponse.json({ error: "Failed to update project." }, { status: 500 });
  }
}

// DELETE: remove a project
export async function DELETE(req: NextRequest) {
  await connection();
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as Record<string, unknown>)?.role;
    if (!session || role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Project ID is required." }, { status: 400 });
    }

    await db.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Admin project delete error:", e);
    return NextResponse.json({ error: "Failed to delete project." }, { status: 500 });
  }
}
