import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { path: routePath, referrer } = await req.json();

    const userAgent = req.headers.get("user-agent") || "";
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "127.0.0.1";

    // Simple device parsing
    let device = "Desktop";
    if (/Mobi|Android|iPhone/i.test(userAgent)) {
      device = "Mobile";
    } else if (/Tablet|iPad/i.test(userAgent)) {
      device = "Tablet";
    }

    // Simple browser parsing
    let browser = "Other";
    if (/Chrome/i.test(userAgent)) browser = "Chrome";
    else if (/Firefox/i.test(userAgent)) browser = "Firefox";
    else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) browser = "Safari";
    else if (/Edge/i.test(userAgent)) browser = "Edge";

    // Simple OS parsing
    let os = "Other";
    if (/Windows/i.test(userAgent)) os = "Windows";
    else if (/Macintosh|Mac OS X/i.test(userAgent)) os = "macOS";
    else if (/Android/i.test(userAgent)) os = "Android";
    else if (/iPhone|iPad/i.test(userAgent)) os = "iOS";
    else if (/Linux/i.test(userAgent)) os = "Linux";

    // Save visitor log
    await db.visitorLog.create({
      data: {
        ip,
        userAgent,
        device,
        browser,
        os,
        path: routePath || "/",
        referrer: referrer || "",
      },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Failed to log visitor access:", e);
    // Silent fail to prevent user blocking
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
