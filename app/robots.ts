import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/admin/", "/api/leads/", "/api/messages/"],
      },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "ClaudeBot", "Google-Extended", "PerplexityBot"],
        allow: "/",
        disallow: ["/admin/", "/api/admin/"],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
