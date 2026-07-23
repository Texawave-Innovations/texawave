import { MetadataRoute } from "next";
import { ref, get } from "firebase/database";
import { db } from "@/lib/firebase";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.texawave.com";

async function getBlogSlugs(): Promise<string[]> {
  try {
    const snapshot = await get(ref(db, "blogs"));
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data)
        .map((key) => {
          const post = data[key];
          return {
            slug: post.slug || key,
            status: post.status || "pending",
          };
        })
        .filter(
          (p) =>
            p.status === "approved" ||
            p.status === "featured" ||
            p.status === "intern-spotlight"
        )
        .map((p) => p.slug);
    }
  } catch (error) {
    console.error("Error fetching blog slugs for sitemap:", error);
  }
  return [];
}

async function getCaseStudySlugs(): Promise<string[]> {
  try {
    const csRef = ref(db, "caseStudies");
    const snapshot = await get(csRef);
    let studies: any[] = [];
    if (snapshot.exists()) {
      const data = snapshot.val();
      studies = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
    } else {
      const dbPath = path.join(process.cwd(), "lib", "case_studies.json");
      if (fs.existsSync(dbPath)) {
        const fileContent = fs.readFileSync(dbPath, "utf-8");
        studies = JSON.parse(fileContent);
      }
    }
    return studies
      .filter((s) => s.status === "Published")
      .map((s) => s.slug || s.id);
  } catch (error) {
    console.error("Error fetching case study slugs for sitemap:", error);
    // Fallback to local file
    try {
      const dbPath = path.join(process.cwd(), "lib", "case_studies.json");
      if (fs.existsSync(dbPath)) {
        const fileContent = fs.readFileSync(dbPath, "utf-8");
        const studies = JSON.parse(fileContent);
        return studies
          .filter((s: any) => s.status === "Published")
          .map((s: any) => s.slug || s.id);
      }
    } catch (fileErr) {
      console.error("Error reading fallback for case studies sitemap:", fileErr);
    }
  }
  return [];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/about",
    "/blog",
    "/case-studies",
    "/careers",
    "/contact",
    "/services",
    "/product-engineering",
    "/manufacturing-support",
    "/procurement",
    "/software-iot",
  ];

  const blogSlugs = await getBlogSlugs();
  const caseStudySlugs = await getCaseStudySlugs();

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add static routes
  for (const route of staticRoutes) {
    sitemapEntries.push({
      url: `${BASE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? "daily" : "weekly",
      priority: route === "" ? 1.0 : 0.8,
    });
  }

  // Add dynamic blog posts
  for (const slug of blogSlugs) {
    sitemapEntries.push({
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  // Add dynamic case studies
  for (const slug of caseStudySlugs) {
    sitemapEntries.push({
      url: `${BASE_URL}/case-studies/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  return sitemapEntries;
}
