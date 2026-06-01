import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { connection } from "next/server";

export async function GET(req: NextRequest) {
  await connection();
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    if (!session || role !== "ADMIN") {
      return NextResponse.json({ error: "Access Denied" }, { status: 403 });
    }

    const posts = await db.post.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ success: true, posts });
  } catch (e: any) {
    console.error("GET /api/admin/blogs error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connection();
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    if (!session || role !== "ADMIN") {
      return NextResponse.json({ error: "Access Denied" }, { status: 403 });
    }

    const body = await req.json();
    const { title, slug, content, summary, published, tags, category, readTime, featuredImage, seoTitle, seoDesc } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
    }

    // Verify slug uniqueness
    const existing = await db.post.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Slug must be unique" }, { status: 400 });
    }

    const post = await db.post.create({
      data: {
        title,
        slug,
        content,
        summary: summary || "",
        published: !!published,
        tags: Array.isArray(tags) ? tags : [],
        category: category || "Development",
        readTime: Number(readTime) || 5,
        featuredImage: featuredImage || null,
        seoTitle: seoTitle || title,
        seoDesc: seoDesc || summary || "",
      }
    });

    return NextResponse.json({ success: true, post });
  } catch (e: any) {
    console.error("POST /api/admin/blogs error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  await connection();
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    if (!session || role !== "ADMIN") {
      return NextResponse.json({ error: "Access Denied" }, { status: 403 });
    }

    const body = await req.json();
    const { id, title, slug, content, summary, published, tags, category, readTime, featuredImage, seoTitle, seoDesc } = body;

    if (!id) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    const post = await db.post.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        summary: summary || "",
        published: !!published,
        tags: Array.isArray(tags) ? tags : [],
        category: category || "Development",
        readTime: Number(readTime) || 5,
        featuredImage: featuredImage || null,
        seoTitle: seoTitle || title,
        seoDesc: seoDesc || summary || "",
      }
    });

    return NextResponse.json({ success: true, post });
  } catch (e: any) {
    console.error("PUT /api/admin/blogs error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await connection();
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    if (!session || role !== "ADMIN") {
      return NextResponse.json({ error: "Access Denied" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    await db.post.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("DELETE /api/admin/blogs error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
