import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { cache } from "react";
import type {
  BlockMeta,
  BlockType,
  ComponentMeta,
  SmoothUIPackageMeta,
} from "@smoothui/data";
import { parseSmoothUIMeta } from "@smoothui/data";

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
  category: "other",
  tags: [],
  complexity: "moderate",
  animationType: "spring",
  useCases: [],
  compositionHints: [],
  hasReducedMotion: false,
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

/** List all component directory names (excluding hidden/non-component dirs) */
const listComponentDirs = async (): Promise<string[]> => {
  const entries = await readdir(COMPONENTS_DIR, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory() && !e.name.startsWith("."))
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
    (dep) =>
      !dep.startsWith("@repo/") &&
      dep !== "react" &&
      dep !== "react-dom"
  );

  // Extract registry dependencies (other smoothui components)
  const registryDeps = Object.keys(deps)
    .filter((dep) => dep.startsWith("@repo/") && dep !== "@repo/shadcn-ui")
    .map((dep) => dep.replace("@repo/", ""));

  const propsCount = await countProps(dir);

  return {
    name,
    displayName: toPascalCase(name),
    description: (pkg.description as string) ?? "",
    category: meta.category,
    tags: meta.tags,
    useCases: meta.useCases,
    compositionHints: meta.compositionHints,
    complexity: meta.complexity,
    animationType: meta.animationType,
    dependencies: filteredDeps,
    registryDependencies: registryDeps,
    hasReducedMotion: meta.hasReducedMotion,
    propsCount,
    installCommand: `npx shadcn@latest add ${BASE_URL}/r/${name}.json`,
    docUrl: `${BASE_URL}/docs/components/${name}`,
    registryUrl: `${BASE_URL}/r/${name}.json`,
  };
};

/**
 * Get the full component catalog. Results are cached per-request via
 * `React.cache()` so multiple consumers (API routes, llms.txt) share
 * the same data within a single render pass.
 */
export const getComponentCatalog = cache(
  async (): Promise<ComponentMeta[]> => {
    const dirs = await listComponentDirs();
    const results = await Promise.all(dirs.map(buildComponentMeta));

    return results
      .filter((r): r is ComponentMeta => r !== null)
      .sort((a, b) => a.name.localeCompare(b.name));
  }
);

// ---------------------------------------------------------------------------
// Block catalog
// ---------------------------------------------------------------------------

/** List all block directory names (excluding shared/hidden dirs) */
const listBlockDirs = async (): Promise<string[]> => {
  const entries = await readdir(BLOCKS_DIR, { withFileTypes: true });
  return entries
    .filter(
      (e) =>
        e.isDirectory() && !e.name.startsWith(".") && e.name !== "shared"
    )
    .map((e) => e.name);
};

/** Infer block type from the directory name prefix */
const inferBlockType = (name: string): BlockType => {
  const prefix = name.split("-")[0];
  const mapping: Record<string, BlockType> = {
    header: "header",
    hero: "hero",
    footer: "footer",
    pricing: "pricing",
    testimonials: "testimonials",
    team: "other",
    stats: "other",
    faq: "other",
    logo: "other",
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
const buildBlockMeta = async (name: string): Promise<BlockMeta | null> => {
  const dir = join(BLOCKS_DIR, name);
  const pkg = await readPackageJson(dir);
  if (!pkg) {
    return null;
  }

  const parsed = parseSmoothUIMeta(pkg.smoothui);
  const meta: SmoothUIPackageMeta = parsed.success ? parsed.data : DEFAULT_META;

  const deps = (pkg.dependencies ?? {}) as Record<string, string>;
  const filteredDeps = Object.keys(deps).filter(
    (dep) =>
      !dep.startsWith("@repo/") &&
      dep !== "react" &&
      dep !== "react-dom"
  );

  const components = await detectBlockComponents(dir);

  return {
    name,
    displayName: toPascalCase(name),
    description: (pkg.description as string) ?? "",
    blockType: inferBlockType(name),
    components,
    category: meta.category,
    tags: meta.tags,
    useCases: meta.useCases,
    complexity: meta.complexity,
    animationType: meta.animationType,
    dependencies: filteredDeps,
    hasReducedMotion: meta.hasReducedMotion,
    installCommand: `npx shadcn@latest add ${BASE_URL}/r/${name}.json`,
    docUrl: `${BASE_URL}/docs/blocks/${name}`,
    registryUrl: `${BASE_URL}/r/${name}.json`,
  };
};

/**
 * Get the full block catalog. Cached per-request via `React.cache()`.
 */
export const getBlockCatalog = cache(async (): Promise<BlockMeta[]> => {
  const dirs = await listBlockDirs();
  const results = await Promise.all(dirs.map(buildBlockMeta));

  return results
    .filter((r): r is BlockMeta => r !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
});
