import componentsMeta from "@docs/content/docs/components/meta.json";
import primitivesMeta from "@docs/content/docs/primitives/meta.json";
import { getBundleSize } from "@docs/lib/bundle-size";
import {
  PRIMITIVE_CATEGORY_ORDER,
  PRIMITIVES_INVENTORY,
} from "@docs/lib/primitives-inventory";
import { source } from "@docs/lib/source";

export type GalleryComponentMeta = {
  slug: string;
  title: string;
  description: string;
  icon?: string;
  category: string;
  installer?: string;
  href: string;
  /** available = docs + install; planned = listed but disabled in gallery */
  status?: "available" | "planned";
  bundleSize?: {
    minified: number;
    gzipped: number;
  };
};

/**
 * Section separator pattern in meta.json pages array.
 * e.g. "---Patterns---", "---Button---", "---Others---"
 */
const SECTION_SEPARATOR_REGEX = /^---(.+)---$/;

/**
 * Parse meta.json pages array to build a slug-to-category map.
 * Section separators like "---Patterns---" define category boundaries.
 */
const buildCategoryMap = (pages: readonly string[]): Map<string, string> => {
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
 * Extract ordered category list from a meta.json pages array.
 * Returns categories in their defined order, excluding "Guide".
 */
const getCategoriesFromPages = (pages: readonly string[]): string[] => {
  const categories: string[] = [];

  for (const entry of pages) {
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

export const getCategories = (): string[] =>
  getCategoriesFromPages(componentsMeta.pages);

/** Full primitive categories including planned Base UI coverage. */
export const getPrimitiveCategories = (): string[] => [
  ...PRIMITIVE_CATEGORY_ORDER,
];

const getGalleryForSection = (
  sectionPrefix: "components/" | "primitives/",
  pages: readonly string[],
  fallbackDescription: string
): GalleryComponentMeta[] => {
  const allPages = source.getPages();
  const categoryMap = buildCategoryMap(pages);
  const items: GalleryComponentMeta[] = [];

  for (const page of allPages) {
    if (!page.data.info.path.startsWith(sectionPrefix)) {
      continue;
    }

    const slug = page.slugs.at(-1);
    if (!slug || page.slugs.length < 2) {
      continue;
    }

    const category = categoryMap.get(slug) ?? "Others";
    const size = getBundleSize(slug);

    items.push({
      bundleSize: size ?? undefined,
      category,
      description: page.data.description ?? fallbackDescription,
      href: page.url,
      icon: page.data.icon as string | undefined,
      installer: page.data.installer as string | undefined,
      slug,
      status: "available",
      title: page.data.title,
    });
  }

  items.sort((a, b) => a.title.localeCompare(b.title));
  return items;
};

/**
 * Get all gallery component metadata from Fumadocs source.
 * Filters to component pages only (excludes index, blocks, etc.).
 */
export const getGalleryComponents = (): GalleryComponentMeta[] =>
  getGalleryForSection(
    "components/",
    componentsMeta.pages,
    "A SmoothUI component"
  );

/**
 * Owned primitives under /docs/primitives, plus planned Base UI entries
 * shown as disabled cards so the full catalog is visible.
 */
export const getGalleryPrimitives = (): GalleryComponentMeta[] => {
  const shipped = getGalleryForSection(
    "primitives/",
    primitivesMeta.pages,
    "A SmoothUI primitive"
  );
  const shippedSlugs = new Set(shipped.map((item) => item.slug));

  const planned: GalleryComponentMeta[] = PRIMITIVES_INVENTORY.filter(
    (item) => item.status === "planned" && !shippedSlugs.has(item.slug)
  ).map((item) => ({
    category: item.category,
    description: item.description,
    href: `/docs/primitives/${item.slug}`,
    slug: item.slug,
    status: "planned" as const,
    title: item.title,
  }));

  const inventoryBySlug = new Map(
    PRIMITIVES_INVENTORY.map((item) => [item.slug, item])
  );
  const merged = shipped.map((item) => {
    const inv = inventoryBySlug.get(item.slug);
    return inv
      ? { ...item, category: inv.category, status: "available" as const }
      : item;
  });

  return [...merged, ...planned].sort((a, b) => a.title.localeCompare(b.title));
};
