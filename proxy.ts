import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// In-memory rate limiting map (IP -> { count, lastResetTime })
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const LIMIT = 5; // 5 requests
const WINDOW = 60 * 1000; // 1 minute

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. IP-Based Rate Limiting for Lead Forms & Callbacks
  if (pathname.startsWith("/api/leads") || pathname.startsWith("/api/messages")) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "127.0.0.1";
    const now = Date.now();
    const rateData = rateLimitMap.get(ip);

    if (!rateData) {
      rateLimitMap.set(ip, { count: 1, lastReset: now });
    } else {
      if (now - rateData.lastReset > WINDOW) {
        // Reset window
        rateLimitMap.set(ip, { count: 1, lastReset: now });
      } else {
        if (rateData.count >= LIMIT) {
          return new NextResponse(
            JSON.stringify({ error: "Too Many Requests: Cybernetic flood protection active. Try again later." }),
            { status: 429, headers: { "Content-Type": "application/json" } }
          );
        }
        rateData.count++;
      }
    }
  }

  // 2. Route Protection for Administrator Dashboard
  if (pathname.startsWith("/admin/dashboard")) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET || "fallback-secret-symbiote-108",
    });

    if (!token || token.role !== "ADMIN") {
      // Redirect unauthorised users to login portal
      const loginUrl = new URL("/admin", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*", "/api/leads", "/api/messages"],
};
