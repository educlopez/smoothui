import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        allow: "/",
        disallow: ["/api/", "/og/", "/blocks/preview/"],
        userAgent: "*",
      },
    ],
    sitemap: "https://smoothui.dev/sitemap.xml",
  };
}
