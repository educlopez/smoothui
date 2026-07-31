import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import type {
  BlockMeta,
  BlockType,
  ComponentMeta,
  SmoothUIPackageMeta,
} from "@smoothui/data";
import { parseSmoothUIMeta } from "@smoothui/data";
import { cache } from "react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const BASE_URL = "https://smoothui.dev";

/** Convert kebab-case to PascalCase, e.g. "animated-tabs" -> "AnimatedTabs" */
const toPascalCase = (kebab: string): string =>
  kebab
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");

/** Read and parse a package.json file, returning null on failure */
const readPackageJson = async (
  dir: string
): Promise<Record<string, unknown> | null> => {
  try {
    const raw = await readFile(join(dir, "package.json"), "utf-8");
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
};

/** Count exported props by scanning for `Props` type exports in tsx files */
const countProps = async (dir: string): Promise<number> => {
  try {
    const files = await readdir(dir);
    let total = 0;

    for (const file of files) {
      if (!file.endsWith(".tsx")) {
        continue;
      }

      const content = await readFile(join(dir, file), "utf-8");
      // Count properties in exported Props interfaces/types
      const propsMatch = content.match(
        /(?:export\s+)?(?:interface|type)\s+\w*Props\s*(?:=\s*)?\{([^}]*)\}/
      );
      if (propsMatch?.[1]) {
        const lines = propsMatch[1]
          .split("\n")
          .filter((line) => line.trim() && !line.trim().startsWith("//"));
        total += lines.length;
      }
    }

    return total;
  } catch {
    return 0;
  }
};

/** Default metadata for components missing the smoothui field */
const DEFAULT_META: SmoothUIPackageMeta = {
  animationType: "spring",
  category: "other",
  complexity: "moderate",
  compositionHints: [],
  hasReducedMotion: false,
  tags: [],
  useCases: [],
};

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const PACKAGES_DIR = join(process.cwd(), "..", "..", "packages");
const COMPONENTS_DIR = join(PACKAGES_DIR, "smoothui", "components");
const BLOCKS_DIR = join(PACKAGES_DIR, "smoothui", "blocks");

// ---------------------------------------------------------------------------
// Component catalog
// ---------------------------------------------------------------------------

const MDX_EXTENSION = /\.mdx$/;
const INSTALLER_FIELD = /^installer:\s*(\S+)\s*$/m;

/**
 * Registry names that have a documentation page, which is what "public" means.
 *
 * Keyed on the `installer` frontmatter rather than the filename, because the two
 * can differ: `accordion.mdx` documents the `basic-accordion` package. Matching
 * on filenames alone drops that component from the catalogue.
 */
const listDocumentedComponents = async (): Promise<Set<string>> => {
  const componentsDir = join(process.cwd(), "content", "docs", "components");
  const files = (await readdir(componentsDir)).filter(
    (file) => file.endsWith(".mdx") && file !== "index.mdx"
  );

  const names = await Promise.all(
    files.map(async (file) => {
      const body = await readFile(join(componentsDir, file), "utf-8");

      return INSTALLER_FIELD.exec(body)?.[1] ?? file.replace(MDX_EXTENSION, "");
    })
  );

  return new Set(names);
};

/**
 * Component directories that are actually part of the public catalogue.
 *
 * A package directory is not the same thing as a component: `ai-core` is shared
 * internal state, and `ai-input` is a deprecation shim for the `morph-surface`
 * rename. Both were being advertised in llms.txt and /api/v1 as installable
 * components, which points an agent at a package with no documentation — and at
 * a deprecated alias. Having a doc page is the definition of public, and it also
 * keeps this count in step with the one the marketing copy uses.
 */
const listComponentDirs = async (): Promise<string[]> => {
  const [entries, documented] = await Promise.all([
    readdir(COMPONENTS_DIR, { withFileTypes: true }),
    listDocumentedComponents(),
  ]);

  return entries
    .filter(
      (e) =>
        e.isDirectory() && !e.name.startsWith(".") && documented.has(e.name)
    )
    .map((e) => e.name);
};

/**
 * Build a fully enriched `ComponentMeta` from a component directory.
 * Returns null if the directory does not contain a valid package.json.
 */
const buildComponentMeta = async (
  name: string
): Promise<ComponentMeta | null> => {
  const dir = join(COMPONENTS_DIR, name);
  const pkg = await readPackageJson(dir);
  if (!pkg) {
    return null;
  }

  // Parse the smoothui field (falls back to defaults if missing/invalid)
  const parsed = parseSmoothUIMeta(pkg.smoothui);
  const meta: SmoothUIPackageMeta = parsed.success ? parsed.data : DEFAULT_META;

  // Extract npm dependencies (filter workspace/peer deps)
  const deps = (pkg.dependencies ?? {}) as Record<string, string>;
  const filteredDeps = Object.keys(deps).filter(
    (dep) => !dep.startsWith("@repo/") && dep !== "react" && dep !== "react-dom"
  );

  // Extract registry dependencies (other smoothui components)
  const registryDeps = Object.keys(deps)
    .filter((dep) => dep.startsWith("@repo/") && dep !== "@repo/shadcn-ui")
    .map((dep) => dep.replace("@repo/", ""));

  const propsCount = await countProps(dir);

  return {
    animationType: meta.animationType,
    category: meta.category,
    complexity: meta.complexity,
    compositionHints: meta.compositionHints,
    dependencies: filteredDeps,
    description: (pkg.description as string) ?? "",
    displayName: toPascalCase(name),
    docUrl: `${BASE_URL}/docs/components/${name}`,
    hasReducedMotion: meta.hasReducedMotion,
    installCommand: `npx shadcn@latest add ${BASE_URL}/r/${name}.json`,
    name,
    propsCount,
    registryDependencies: registryDeps,
    registryUrl: `${BASE_URL}/r/${name}.json`,
    tags: meta.tags,
    useCases: meta.useCases,
  };
};

/**
 * Get the full component catalog. Results are cached per-request via
 * `React.cache()` so multiple consumers (API routes, llms.txt) share
 * the same data within a single render pass.
 */
export const getComponentCatalog = cache(async (): Promise<ComponentMeta[]> => {
  const dirs = await listComponentDirs();
  const results = await Promise.all(dirs.map(buildComponentMeta));

  return results
    .filter((r): r is ComponentMeta => r !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
});

// ---------------------------------------------------------------------------
// Block catalog
// ---------------------------------------------------------------------------

const PREVIEW_TAG = /<Preview\s+path="([^"]+)"/g;

/**
 * Which documentation page each block appears on.
 *
 * Blocks are documented per category, and the category directory name does not
 * match the page slug (`ctas/` is documented in `cta.mdx`), so the mapping is
 * read from the `<Preview>` tags instead of guessed.
 */
const listBlockDocPages = async (): Promise<Map<string, string>> => {
  const blocksDir = join(process.cwd(), "content", "docs", "blocks");
  const files = (await readdir(blocksDir)).filter(
    (file) => file.endsWith(".mdx") && file !== "index.mdx"
  );
  const pages = new Map<string, string>();

  await Promise.all(
    files.map(async (file) => {
      const body = await readFile(join(blocksDir, file), "utf-8");
      const slug = file.replace(MDX_EXTENSION, "");

      for (const match of body.matchAll(PREVIEW_TAG)) {
        pages.set(match[1], slug);
      }
    })
  );

  return pages;
};

/**
 * Every block, as a `<category>/<block>` path.
 *
 * Blocks live one level deeper than components — `blocks/pricing/pricing-1/` —
 * so reading only the top level found category directories, none of which has a
 * package.json. Every block was therefore dropped, and `/api/v1/blocks` and the
 * Blocks section of llms.txt have been advertising zero blocks.
 */
const listBlockDirs = async (): Promise<string[]> => {
  const categories = (
    await readdir(BLOCKS_DIR, { withFileTypes: true })
  ).filter(
    (e) => e.isDirectory() && !e.name.startsWith(".") && e.name !== "shared"
  );

  const nested = await Promise.all(
    categories.map(async (category) => {
      const entries = await readdir(join(BLOCKS_DIR, category.name), {
        withFileTypes: true,
      });

      return entries
        .filter((e) => e.isDirectory() && !e.name.startsWith("."))
        .map((e) => join(category.name, e.name));
    })
  );

  return nested.flat();
};

/** Infer block type from the directory name prefix */
const inferBlockType = (name: string): BlockType => {
  const [prefix] = name.split("-");
  const mapping: Record<string, BlockType> = {
    faq: "other",
    footer: "footer",
    header: "header",
    hero: "hero",
    logo: "other",
    pricing: "pricing",
    stats: "other",
    team: "other",
    testimonials: "testimonials",
  };
  return mapping[prefix] ?? "other";
};

/** Detect which smoothui components a block uses by scanning its source */
const detectBlockComponents = async (dir: string): Promise<string[]> => {
  try {
    const files = await readdir(dir);
    const components = new Set<string>();

    for (const file of files) {
      if (!file.endsWith(".tsx")) {
        continue;
      }
      const content = await readFile(join(dir, file), "utf-8");
      // Match imports from relative sibling component dirs: from "../component-name"
      const matches = Array.from(
        content.matchAll(/from\s+["']\.\.\/([a-z-]+)["']/g)
      );
      for (const match of matches) {
        if (match[1]) {
          components.add(match[1]);
        }
      }
    }

    return Array.from(components);
  } catch {
    return [];
  }
};

/**
 * Build a fully enriched `BlockMeta` from a block directory.
 */
const buildBlockMeta = async (
  relativePath: string,
  docPages: Map<string, string>
): Promise<BlockMeta | null> => {
  const dir = join(BLOCKS_DIR, relativePath);
  const pkg = await readPackageJson(dir);
  if (!pkg) {
    return null;
  }

  // The registry serves blocks by their leaf name, not by category path.
  const name = relativePath.split("/").at(-1) as string;
  const docPage = docPages.get(name);

  // Same rule as components: a block is public once it is documented. `header-6`
  // ships in the package and is served by the registry, but no page previews it,
  // so advertising it would point an agent at something with no documentation.
  if (!docPage) {
    return null;
  }

  const parsed = parseSmoothUIMeta(pkg.smoothui);
  const meta: SmoothUIPackageMeta = parsed.success ? parsed.data : DEFAULT_META;

  const deps = (pkg.dependencies ?? {}) as Record<string, string>;
  const filteredDeps = Object.keys(deps).filter(
    (dep) => !dep.startsWith("@repo/") && dep !== "react" && dep !== "react-dom"
  );

  const components = await detectBlockComponents(dir);

  return {
    animationType: meta.animationType,
    blockType: inferBlockType(name),
    category: meta.category,
    complexity: meta.complexity,
    components,
    dependencies: filteredDeps,
    description: (pkg.description as string) ?? "",
    displayName: toPascalCase(name),
    docUrl: docPage
      ? `${BASE_URL}/docs/blocks/${docPage}`
      : `${BASE_URL}/docs/blocks`,
    hasReducedMotion: meta.hasReducedMotion,
    installCommand: `npx shadcn@latest add ${BASE_URL}/r/${name}.json`,
    name,
    registryUrl: `${BASE_URL}/r/${name}.json`,
    tags: meta.tags,
    useCases: meta.useCases,
  };
};

/**
 * Get the full block catalog. Cached per-request via `React.cache()`.
 */
export const getBlockCatalog = cache(async (): Promise<BlockMeta[]> => {
  const [dirs, docPages] = await Promise.all([
    listBlockDirs(),
    listBlockDocPages(),
  ]);
  const results = await Promise.all(
    dirs.map((dir) => buildBlockMeta(dir, docPages))
  );

  return results
    .filter((r): r is BlockMeta => r !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
});
