import { source } from "@docs/lib/source";
import type { MetadataRoute } from "next";

export const revalidate = false;

const baseUrl = "https://smoothui.dev";

// Popular components that should have higher priority
const popularComponents = new Set([
  "expandable-cards",
  "dynamic-island",
  "animated-input",
  "scramble-hover",
  "accordion",
  "basic-modal",
  "infinite-slider",
  "number-flow",
  "typewriter-text",
  "button-copy",
]);

// Category landing pages (highest component priority)
const categoryPages = new Set([
  "buttons",
  "text-animations",
  "cards",
  "forms",
  "notifications",
]);

// High-value guide pages
const importantGuides = new Set([
  "installation",
  "shadcn-alternative",
  "animated-components",
  "animation-best-practices",
  "hooks",
  "utilities",
  "index",
]);

const getPriority = (url: string): number => {
  // Index pages for sections
  if (url === "/docs/components" || url === "/docs/blocks") {
    return 0.8;
  }

  // Guide pages
  if (url.startsWith("/docs/guides")) {
    const slug = url.split("/").pop() ?? "";
    return importantGuides.has(slug) ? 0.7 : 0.5;
  }

  // Component pages
  if (url.startsWith("/docs/components/")) {
    const slug = url.split("/").pop() ?? "";
    // Category pages get highest priority
    if (categoryPages.has(slug)) {
      return 0.8;
    }
    return popularComponents.has(slug) ? 0.7 : 0.6;
  }

  // Block pages
  if (url.startsWith("/docs/blocks/")) {
    return 0.6;
  }

  return 0.5;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string): string => new URL(path, baseUrl).toString();

  return [
    {
      url: url("/"),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: url("/docs"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...source.getPages().flatMap((page) => {
      const { lastModified } = page.data;

      return {
        url: url(page.url),
        lastModified: lastModified ? new Date(lastModified) : undefined,
        changeFrequency: "weekly",
        priority: getPriority(page.url),
      } as MetadataRoute.Sitemap[number];
    }),
  ];
}
