import type { MetadataRoute } from "next"

import { components } from "@/app/doc/data/components"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://smoothui.dev"

  // Generate URLs for all component pages
  const componentUrls = components.map((component) => ({
    url: `${baseUrl}/doc/${component.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/doc`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...componentUrls,
  ]
}
