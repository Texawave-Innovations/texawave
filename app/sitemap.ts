import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import { ref, get } from "firebase/database";
import { db } from "@/lib/firebase";
import { MAIN_SERVICES, SUB_SERVICES } from "@/lib/services-v2";

const BASE_URL = "https://texawave.com";

async function getCaseStudySlugs(): Promise<{ slug: string; updatedAt?: string }[]> {
  try {
    const snapshot = await get(ref(db, "caseStudies"));
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data)
        .map(key => ({ id: key, ...data[key] }))
        .filter((s: any) => s.status === "Published")
        .map((s: any) => ({ slug: s.slug || s.id, updatedAt: s.updatedAt }));
    }
  } catch (err) {
    console.error("sitemap: failed to read case studies from Firebase", err);
  }

  // Fallback to the seed file so the sitemap still has entries if Firebase is unreachable
  try {
    const dbPath = path.join(process.cwd(), "lib", "case_studies.json");
    if (fs.existsSync(dbPath)) {
      const studies = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
      return studies
        .filter((s: any) => s.status === "Published")
        .map((s: any) => ({ slug: s.slug || s.id, updatedAt: s.updatedAt }));
    }
  } catch (err) {
    console.error("sitemap: failed to read case studies fallback file", err);
  }

  return [];
}

async function getBlogSlugs(): Promise<{ slug: string; updatedAt?: string }[]> {
  try {
    const snapshot = await get(ref(db, "blogs"));
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data)
        .map(key => ({ id: key, ...data[key] }))
        .filter((p: any) => ["approved", "featured", "intern-spotlight"].includes(p.status))
        .map((p: any) => ({ slug: p.slug || p.id, updatedAt: p.updatedAt || p.createdAt }));
    }
  } catch (err) {
    console.error("sitemap: failed to read blog posts from Firebase", err);
  }

  return [];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "", priority: 1.0, changeFrequency: "weekly" },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" },
    { path: "/case-studies", priority: 0.8, changeFrequency: "weekly" },
    { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
    { path: "/careers", priority: 0.6, changeFrequency: "weekly" },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
  ];

  // Main service hubs (e.g. /software-iot) and their sub-service pages (e.g. /software-iot/custom-erp)
  const serviceRoutes = [
    ...MAIN_SERVICES.map(s => ({ path: `/${s.slug}`, priority: 0.9, changeFrequency: "monthly" as const })),
    ...SUB_SERVICES.map(s => ({ path: `/${s.fullSlug}`, priority: 0.7, changeFrequency: "monthly" as const })),
  ];

  const [caseStudies, blogPosts] = await Promise.all([getCaseStudySlugs(), getBlogSlugs()]);

  return [
    ...[...staticRoutes, ...serviceRoutes].map(({ path: p, priority, changeFrequency }) => ({
      url: `${BASE_URL}${p}`,
      lastModified: now,
      changeFrequency,
      priority,
    })),
    ...caseStudies.map(cs => ({
      url: `${BASE_URL}/case-studies/${cs.slug}`,
      lastModified: cs.updatedAt ? new Date(cs.updatedAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...blogPosts.map(bp => ({
      url: `${BASE_URL}/blog/${bp.slug}`,
      lastModified: bp.updatedAt ? new Date(bp.updatedAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
