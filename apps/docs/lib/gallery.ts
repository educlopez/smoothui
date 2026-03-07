import metaJson from "@docs/content/docs/components/meta.json";
import { source } from "@docs/lib/source";

export type GalleryComponentMeta = {
  slug: string;
  title: string;
  description: string;
  icon?: string;
  category: string;
  installer?: string;
  href: string;
};

/**
 * Section separator pattern in meta.json pages array.
 * e.g. "---Basic UI ---", "---Button---", "---Others---"
 */
const SECTION_SEPARATOR_REGEX = /^---(.+)---$/;

/**
 * Parse meta.json pages array to build a slug-to-category map.
 * Section separators like "---Basic UI ---" define category boundaries.
 */
const buildCategoryMap = (
  pages: readonly string[]
): Map<string, string> => {
  const map = new Map<string, string>();
  let currentCategory = "Others";

  for (const entry of pages) {
    const match = SECTION_SEPARATOR_REGEX.exec(entry);
    if (match) {
      currentCategory = match[1].trim();
    } else if (entry !== "index") {
      map.set(entry, currentCategory);
    }
  }

  return map;
};

/**
 * Extract ordered category list from meta.json pages array.
 * Returns categories in their defined order, excluding "Guide".
 */
export const getCategories = (): string[] => {
  const categories: string[] = [];

  for (const entry of metaJson.pages) {
    const match = SECTION_SEPARATOR_REGEX.exec(entry);
    if (match) {
      const name = match[1].trim();
      if (name !== "Guide") {
        categories.push(name);
      }
    }
  }

  return categories;
};

/**
 * Get all gallery component metadata from Fumadocs source.
 * Filters to component pages only (excludes index, blocks, etc.).
 * Returns sorted array of component metadata with category assignments.
 */
export const getGalleryComponents = (): GalleryComponentMeta[] => {
  const pages = source.getPages();
  const categoryMap = buildCategoryMap(metaJson.pages);

  const components: GalleryComponentMeta[] = [];

  for (const page of pages) {
    // Only include component pages (not blocks, not index pages, not other sections)
    if (!page.data.info.path.startsWith("components/")) {
      continue;
    }

    // Skip the index page itself
    const slug = page.slugs.at(-1);
    if (!slug || page.slugs.length < 2) {
      continue;
    }

    const category = categoryMap.get(slug) ?? "Others";

    components.push({
      slug,
      title: page.data.title,
      description: page.data.description ?? "A SmoothUI component",
      icon: page.data.icon as string | undefined,
      category,
      installer: page.data.installer as string | undefined,
      href: page.url,
    });
  }

  // Sort alphabetically by title
  components.sort((a, b) => a.title.localeCompare(b.title));

  return components;
};
