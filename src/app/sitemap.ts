import type { MetadataRoute } from "next"

import { basicComponents } from "@/app/doc/data/basicComponents"
import { faqsBlocks } from "@/app/doc/data/block-faqs"
import { footerBlocks } from "@/app/doc/data/block-footer"
import { heroBlocks } from "@/app/doc/data/block-hero"
import { logoCloudBlocks } from "@/app/doc/data/block-logo-cloud"
import { pricingBlocks } from "@/app/doc/data/block-pricing"
import { statsBlocks } from "@/app/doc/data/block-stats"
import { teamBlocks } from "@/app/doc/data/block-team"
import { testimonialBlocks } from "@/app/doc/data/block-testimonials"
import { components } from "@/app/doc/data/components"
import { textComponents } from "@/app/doc/data/textComponentes"

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
  function toKebabCase(str: string) {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const blockGroups = [
    { group: "hero", blocks: heroBlocks },
    { group: "pricing", blocks: pricingBlocks },
    { group: "testimonial", blocks: testimonialBlocks },
    { group: "logo-cloud", blocks: logoCloudBlocks },
    { group: "stats", blocks: statsBlocks },
    { group: "team", blocks: teamBlocks },
    { group: "footer", blocks: footerBlocks },
    { group: "faqs", blocks: faqsBlocks },
  ]

  // Add group listing URLs for blocks
  const blockGroupUrls = blockGroups.map(({ group }) => ({
    url: `${baseUrl}/doc/blocks/${group}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.85,
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
    ...basicComponentUrls,
    ...textComponentUrls,
    ...blockGroupUrls,
  ]
}
