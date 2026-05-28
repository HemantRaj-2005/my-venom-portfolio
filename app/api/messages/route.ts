import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, name, email, phone, timeSlot, subject, message } = body;

    if (!type) {
      return NextResponse.json({ error: "Missing submission action type." }, { status: 400 });
    }

    if (type === "newsletter") {
      if (!email) {
        return NextResponse.json({ error: "Email address is required." }, { status: 400 });
      }
      
      try {
        await db.newsletterSubscriber.create({
          data: { email: email.toLowerCase() }
        });
      } catch (err: any) {
        // If unique index fails (already subscribed), return success anyway to keep flow smooth
        if (err?.code !== "P2002") {
          throw err;
        }
      }
      
      return NextResponse.json({ success: true, message: "Subscription activated." });
    }

    if (type === "callback") {
      if (!name || !email || !phone) {
        return NextResponse.json({ error: "Name, email, and phone number are required." }, { status: 400 });
      }

      const callback = await db.callbackRequest.create({
        data: {
          name,
          email: email.toLowerCase(),
          phone,
          timeSlot: timeSlot || "Anytime",
          message: message || "",
          status: "PENDING"
        }
      });

      return NextResponse.json({ success: true, callback });
    }

    if (type === "message") {
      if (!name || !email || !message) {
        return NextResponse.json({ error: "Name, email, and message body are required." }, { status: 400 });
      }

      const contactMsg = await db.contactMessage.create({
        data: {
          name,
          email: email.toLowerCase(),
          subject: subject || "General Inquiry",
          message,
          status: "UNREAD"
        }
      });

      return NextResponse.json({ success: true, message: contactMsg });
    }

    return NextResponse.json({ error: "Invalid request action parameter." }, { status: 400 });
  } catch (e) {
    console.error("Failed to process message transaction:", e);
    return NextResponse.json({ error: "Database transaction failed. Please retry." }, { status: 500 });
  }
}
