import { type InferPageType, loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { docs } from "@/.source";
import { siteConfig } from "./config";
import { getModificationLabel, isRecentlyModified } from "./recent-modified";

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, "image.png"];

  return {
    segments,
    url: `/og/docs/${segments.join("/")}`,
  };
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText("processed");

  return `# ${page.data.title} (${page.url})

${processed}`;
}

/**
 * Check if a page is recently modified based on configured threshold
 */
export function isPageRecentlyModified(
  page: InferPageType<typeof source>
): boolean {
  const lastModified = (page.data as { lastModified?: number }).lastModified;
  return isRecentlyModified(lastModified, siteConfig.recentModifiedThreshold);
}

/**
 * Get all recently modified page URLs for quick lookup in sidebar
 */
export function getRecentlyModifiedPages(): Set<string> {
  const recentPages = new Set<string>();

  const processPages = () => {
    for (const page of source.getPages()) {
      if (isPageRecentlyModified(page)) {
        recentPages.add(page.url);
      }
    }
  };

  processPages();
  return recentPages;
}

/**
 * Get recently modified pages with their modification labels
 * Returns a plain object (not Map) for proper serialization to client components
 */
export function getRecentlyModifiedPagesWithLabels(): Record<string, string> {
  const recentPagesMap: Record<string, string> = {};

  for (const page of source.getPages()) {
    if (isPageRecentlyModified(page)) {
      const lastModified = (page.data as { lastModified?: number })
        .lastModified;
      if (lastModified) {
        const label = getModificationLabel(lastModified);
        recentPagesMap[page.url] = label;
      } else {
        recentPagesMap[page.url] = "Recently updated";
      }
    }
  }

  return recentPagesMap;
}
