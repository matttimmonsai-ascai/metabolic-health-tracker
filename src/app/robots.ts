import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/articles", "/articles/"],
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: "https://metabolic-health-tracker.vercel.app/sitemap.xml",
  };
}
