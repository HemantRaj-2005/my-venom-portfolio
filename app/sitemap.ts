import { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  let projectUrls: any[] = [];
  let postUrls: any[] = [];
  let productUrls: any[] = [];

  try {
    const [projects, posts, products] = await Promise.all([
      db.project.findMany(),
      db.post.findMany({ where: { published: true } }),
      db.product.findMany({ where: { isApproved: true } })
    ]);

    projectUrls = (projects as any[]).map((p: any) => ({
      url: `${baseUrl}/projects/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    postUrls = (posts as any[]).map((p: any) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    productUrls = (products as any[]).map((p: any) => ({
      url: `${baseUrl}/marketplace/${p.id}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch (e) {
    console.warn("Failed to retrieve sitemap dynamic links:", e);
  }

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/marketplace`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  return [...staticUrls, ...projectUrls, ...postUrls, ...productUrls];
}
