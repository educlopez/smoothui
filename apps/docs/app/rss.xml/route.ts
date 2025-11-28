import { generateRegistryRssFeed } from "@wandry/analytics-sdk";
import type { NextRequest } from "next/server";

// Map individual block names to their category pages
const blockCategoryMap: Record<string, string> = {
  "faq-1": "faqs",
  "faq-2": "faqs",
  "footer-1": "footer",
  "footer-2": "footer",
  "header-1": "hero",
  "header-2": "hero",
  "header-3": "hero",
  "logo-cloud-1": "logo-clouds",
  "logo-cloud-2": "logo-clouds",
  "pricing-1": "pricing",
  "pricing-2": "pricing",
  "pricing-3": "pricing",
  "stats-1": "stats",
  "stats-2": "stats",
  "team-1": "team-sections",
  "team-2": "team-sections",
  "testimonials-1": "testimonial",
  "testimonials-2": "testimonial",
  "testimonials-3": "testimonial",
};

// Blocks that should be excluded from RSS (like shared components)
const excludedBlocks = ["shared"];

function fixRssUrls(rssXml: string, baseUrl: string): string {
  let fixedXml = rssXml;

  // First, fix blocks that are incorrectly categorized as components
  // Pattern: /docs/components/block-name -> /docs/blocks/category-name
  for (const [blockName, categoryName] of Object.entries(blockCategoryMap)) {
    const escapedBlockName = blockName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Match /docs/components/block-name and replace with /docs/blocks/category-name
    const regex = new RegExp(
      `${baseUrl}/docs/components/${escapedBlockName}([^<"\\s]*)`,
      "g"
    );
    fixedXml = fixedXml.replace(
      regex,
      `${baseUrl}/docs/blocks/${categoryName}$1`
    );
  }

  // Fix component URLs: /components/... -> /docs/components/...
  // (in case the SDK doesn't use the componentsUrl config)
  // But exclude blocks that we just fixed
  const blockNames = Object.keys(blockCategoryMap).join("|");
  fixedXml = fixedXml.replace(
    new RegExp(`${baseUrl}/components/(?!${blockNames})([^<"\\s]+)`, "g"),
    `${baseUrl}/docs/components/$1`
  );

  // Fix block URLs: map individual blocks to category pages
  // Pattern: /docs/blocks/block-name -> /docs/blocks/category-name
  for (const [blockName, categoryName] of Object.entries(blockCategoryMap)) {
    const escapedBlockName = blockName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Match /docs/blocks/block-name and /blocks/block-name
    const patterns = [
      new RegExp(`${baseUrl}/docs/blocks/${escapedBlockName}([^<"\\s]*)`, "g"),
      new RegExp(`${baseUrl}/blocks/${escapedBlockName}([^<"\\s]*)`, "g"),
    ];
    for (const regex of patterns) {
      fixedXml = fixedXml.replace(
        regex,
        `${baseUrl}/docs/blocks/${categoryName}$1`
      );
    }
  }

  // Fix any remaining /blocks/ URLs that don't match the map
  // These should still get the /docs/ prefix
  fixedXml = fixedXml.replace(
    new RegExp(`${baseUrl}/blocks/([^<"\\s]+)`, "g"),
    `${baseUrl}/docs/blocks/$1`
  );

  return fixedXml;
}

function removeExcludedItems(rssXml: string): string {
  let cleanedXml = rssXml;

  // Remove RSS items for excluded blocks
  for (const excludedName of excludedBlocks) {
    // Remove entire <item> blocks for excluded items
    // Match <item>...</item> that contains the excluded name in link or guid
    const escapedName = excludedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const itemRegex = new RegExp(
      `<item>[\\s\\S]*?<(?:link|guid)>[^<]*/${escapedName}[^<]*</(?:link|guid)>[\\s\\S]*?</item>`,
      "g"
    );
    cleanedXml = cleanedXml.replace(itemRegex, "");
  }

  // Clean up any double newlines that might result from removal
  cleanedXml = cleanedXml.replace(/\n\s*\n\s*\n/g, "\n\n");

  return cleanedXml;
}

export async function GET(request: NextRequest) {
  const baseUrl = new URL(request.url).origin;

  const rssXml = await generateRegistryRssFeed({
    baseUrl,
    componentsUrl: "docs/components",
    blocksUrl: "docs/blocks",
    rss: {
      title: "SmoothUI",
      description:
        "SmoothUI is a collection of beautifully designed components with smooth animations built with React, Tailwind CSS, and Motion",
      link: "https://smoothui.dev",
      pubDateStrategy: "githubLastEdit",
    },
    registry: {
      path: "r/registry.json",
    },
    github: {
      owner: "educlopez",
      repo: "smoothui",
      token: process.env.GITHUB_TOKEN,
    },
  });

  if (!rssXml) {
    return new Response("RSS feed not available", {
      status: 404,
      headers: { "Content-Type": "text/plain" },
    });
  }

  // Fix URLs in the RSS feed
  let fixedRssXml = fixRssUrls(rssXml, baseUrl);

  // Remove excluded items
  fixedRssXml = removeExcludedItems(fixedRssXml);

  return new Response(fixedRssXml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
