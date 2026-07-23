import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.texawave.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin/",
        "/dashboard",
        "/dashboard/",
        "/login",
        "/login/",
        "/hr",
        "/hr/",
        "/profile",
        "/profile/",
        "/api",
        "/api/",
      ],
    },
    sitemap: "https://www.texawave.com/sitemap.xml",
  };
}
