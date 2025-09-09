import type { MetadataRoute } from "next"

import { basicComponents } from "@/app/doc/data/basicComponents"
import { heroBlocks } from "@/app/doc/data/block-hero"
import { pricingBlocks } from "@/app/doc/data/block-pricing"
import { testimonialBlocks } from "@/app/doc/data/block-testimonials"
import { components } from "@/app/doc/data/components"
import { textComponents } from "@/app/doc/data/textComponentes"
import { getAllTags } from "@/app/utils/componentUtils"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://smoothui.dev"

  // Generate URLs for all component pages
  const componentUrls = components.map((component) => ({
    url: `${baseUrl}/doc/components/${component.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))
  // Generate URLs for all basic component pages
  const basicComponentUrls = basicComponents.map((component) => ({
    url: `${baseUrl}/doc/basic/${component.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))
  // Generate URLs for all text component pages
  const textComponentUrls = textComponents.map((component) => ({
    url: `${baseUrl}/doc/text/${component.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  // Generate URLs for all block pages

  const blockGroups = [
    { group: "hero", blocks: heroBlocks },
    { group: "pricing", blocks: pricingBlocks },
    { group: "testimonial", blocks: testimonialBlocks },
  ]

  // Add group listing URLs for blocks
  const blockGroupUrls = blockGroups.map(({ group }) => ({
    url: `${baseUrl}/doc/blocks/${group}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }))

  // Generate URLs for tag pages
  const allTags = getAllTags()
  const tagUrls = allTags.map((tag) => ({
    url: `${baseUrl}/doc/tags/${tag.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  // Add tags overview page
  const tagsOverviewUrl = {
    url: `${baseUrl}/doc/tags`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }

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
    tagsOverviewUrl,
    ...componentUrls,
    ...basicComponentUrls,
    ...textComponentUrls,
    ...blockGroupUrls,
    ...tagUrls,
  ]
}
