import { MetadataRoute } from "next";

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
