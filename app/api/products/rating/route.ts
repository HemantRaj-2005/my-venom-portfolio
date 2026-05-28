import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, rating, comment, author } = body;

    // Simple Validation
    if (!productId || !rating || !author) {
      return NextResponse.json(
        { error: "Missing required details. Product ID, rating, and author name are mandatory." },
        { status: 400 }
      );
    }

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return NextResponse.json({ error: "Rating must be an integer between 1 and 5." }, { status: 400 });
    }

    const newRating = await db.rating.create({
      data: {
        productId,
        rating: numericRating,
        comment: comment || "",
        author,
      },
    });

    return NextResponse.json({ success: true, rating: newRating });
  } catch (e) {
    console.error("Failed to post product review:", e);
    return NextResponse.json(
      { error: "Database transaction failed. Please retry." },
      { status: 500 }
    );
  }
}
