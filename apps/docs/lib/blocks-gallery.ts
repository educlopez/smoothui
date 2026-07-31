import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

import { source } from "@docs/lib/source";

export type BlockCategoryMeta = {
  count: number;
  description: string;
  href: string;
  slug: string;
  title: string;
};

const PREVIEW_TAG = /<Preview\s+path="([^"]+)"/g;
const MDX_EXTENSION = /\.mdx$/;
const BLOCKS_DIR = join(process.cwd(), "content", "docs", "blocks");

/**
 * Every block category, with the count and the cover its card needs.
 *
 * Counts come from the MDX rather than a hand-kept number, so adding a
 * `<Preview>` to a category page updates the index by itself.
 */
export const getBlockCategories = async (): Promise<BlockCategoryMeta[]> => {
  const files = await readdir(BLOCKS_DIR);
  const categories: BlockCategoryMeta[] = [];

  for (const file of files) {
    if (!file.endsWith(".mdx") || file === "index.mdx") {
      continue;
    }

    const slug = file.replace(MDX_EXTENSION, "");
    const page = source.getPage(["blocks", slug]);

    if (!page) {
      continue;
    }

    const body = await readFile(join(BLOCKS_DIR, file), "utf-8");
    const blocks = [...body.matchAll(PREVIEW_TAG)].map((match) => match[1]);

    if (blocks.length === 0) {
      continue;
    }

    categories.push({
      count: blocks.length,
      description: page.data.description ?? "",
      href: page.url,
      slug,
      title: page.data.title,
    });
  }

  return categories.sort((a, b) => a.title.localeCompare(b.title));
};
