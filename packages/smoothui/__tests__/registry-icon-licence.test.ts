import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Nucleo is licensed to us, not to the people who install our components.
 *
 * Anything that reaches the shadcn registry — components, blocks, templates —
 * must import its icons from a library the installer can legally resolve, which
 * today means `lucide-react`. Nucleo is fine in the docs app and the landing,
 * neither of which ships to anyone.
 */
const PACKAGE_ROOT = join(import.meta.dirname, "..");
const SHIPPED_DIRS = ["components", "blocks", "templates", "hooks", "lib"];
const SOURCE_EXTENSIONS = new Set([".ts", ".tsx"]);
const SKIP_DIRS = new Set(["node_modules", "__tests__", "dist"]);

/** Icon packages that would break, or legally cannot be resolved, on install. */
const FORBIDDEN_ICON_PACKAGES = [
  "nucleo-core-fill-24",
  "nucleo-social-media",
  "nucleo",
];

const collectSourceFiles = (dir: string): string[] => {
  let entries: ReturnType<typeof readdirSync>;
  try {
    entries = readdirSync(dir);
  } catch {
    return [];
  }

  const files: string[] = [];
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry)) {
      continue;
    }
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...collectSourceFiles(full));
    } else if (SOURCE_EXTENSIONS.has(extname(entry))) {
      files.push(full);
    }
  }
  return files;
};

const IMPORT_SOURCE_REGEX = /from\s+["']([^"']+)["']/g;

describe("registry icon licensing", () => {
  const files = SHIPPED_DIRS.flatMap((dir) =>
    collectSourceFiles(join(PACKAGE_ROOT, dir))
  );

  it("finds the shipped sources it is supposed to be guarding", () => {
    // A silent zero here would make every assertion below vacuous.
    expect(files.length).toBeGreaterThan(100);
  });

  it("imports no Nucleo icons anywhere that ships to the registry", () => {
    const offenders: string[] = [];

    for (const file of files) {
      const source = readFileSync(file, "utf-8");
      for (const match of source.matchAll(IMPORT_SOURCE_REGEX)) {
        const specifier = match[1];
        if (
          FORBIDDEN_ICON_PACKAGES.some(
            (pkg) => specifier === pkg || specifier.startsWith(`${pkg}/`)
          )
        ) {
          offenders.push(`${file.replace(PACKAGE_ROOT, "")} → ${specifier}`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });

  it("declares no Nucleo dependency in a shipped package.json", () => {
    const manifests = SHIPPED_DIRS.flatMap((dir) =>
      collectManifests(join(PACKAGE_ROOT, dir))
    );

    const offenders = manifests.filter((manifest) => {
      const parsed = JSON.parse(readFileSync(manifest, "utf-8")) as {
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
      };
      const declared = [
        ...Object.keys(parsed.dependencies ?? {}),
        ...Object.keys(parsed.devDependencies ?? {}),
      ];
      return declared.some((name) =>
        FORBIDDEN_ICON_PACKAGES.some(
          (pkg) => name === pkg || name.startsWith(`${pkg}/`)
        )
      );
    });

    expect(offenders).toEqual([]);
  });
});

const collectManifests = (dir: string): string[] => {
  let entries: ReturnType<typeof readdirSync>;
  try {
    entries = readdirSync(dir);
  } catch {
    return [];
  }

  const manifests: string[] = [];
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry)) {
      continue;
    }
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      manifests.push(...collectManifests(full));
    } else if (entry === "package.json") {
      manifests.push(full);
    }
  }
  return manifests;
};
