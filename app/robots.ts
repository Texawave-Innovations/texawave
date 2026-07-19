import type { MetadataRoute } from "next";

const BASE_URL = "https://texawave.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/dashboard", "/hr", "/login", "/profile", "/api"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
