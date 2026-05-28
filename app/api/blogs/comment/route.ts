import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { postId, author, email, content } = body;

    // Simple Validation
    if (!postId || !author || !content) {
      return NextResponse.json(
        { error: "Missing required details. Post ID, author name, and comment text are mandatory." },
        { status: 400 }
      );
    }

    const newComment = await db.comment.create({
      data: {
        postId,
        author,
        email: email || "",
        content,
      },
    });

    return NextResponse.json({ success: true, comment: newComment });
  } catch (e) {
    console.error("Failed to store blog comment:", e);
    return NextResponse.json(
      { error: "Database transaction failed. Please retry." },
      { status: 500 }
    );
  }
}
