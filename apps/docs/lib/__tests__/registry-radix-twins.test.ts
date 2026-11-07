import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { getDualPrimitivePackageNames, getPackage } from "../package";

const DOCS_ROOT = join(fileURLToPath(import.meta.url), "../../..");
const REPO_ROOT = join(DOCS_ROOT, "../..");

// Instances that already shipped `/r/radix-nova/{name}.json` importing a
// sibling `.base` file the payload did not include. Discovery must still
// return these; the class is every dual primitive, not this closed set.
const HISTORICAL_RADIX_NOVA_FAILURES = [
  "smoothui/components/slider",
  "smoothui/components/tabs",
  "smoothui/components/toggle",
  "smoothui/components/toggle-group",
] as const;

const SIBLING_IMPORT_REGEX =
  /(?:from\s+|import\s*\(\s*|require\s*\(\s*)["'](\.\/[^"']+)["']/g;
const SIBLING_PREFIX_REGEX = /^\.\//;
const INSTALL_TYPECHECK_CLEAN_REGEX = /Install typecheck clean/;
// Twenty-six twins plus tsc. Default 5s is enough for the four historical
// names and not for the class. The dedicated CI step has no such cap.
const RADIX_NOVA_INSTALL_TEST_TIMEOUT_MS = 60_000;

const resolutionCandidates = (specifier: string): string[] => {
  const base = specifier.replace(SIBLING_PREFIX_REGEX, "");
  return [
    base,
    ...[".ts", ".tsx", ".js", ".jsx"].flatMap((ext) => [
      `${base}${ext}`,
      `${base}/index${ext}`,
    ]),
  ];
};

const unresolvedSiblingImports = (
  name: string,
  files: Array<{ content?: string; path: string }>
): string[] => {
  const shipped = new Set(files.map((file) => file.path));
  const unresolved: string[] = [];

  for (const file of files) {
    const content = file.content ?? "";
    for (const [, specifier] of content.matchAll(SIBLING_IMPORT_REGEX)) {
      const resolved = resolutionCandidates(specifier).some((candidate) =>
        shipped.has(candidate)
      );
      if (!resolved) {
        unresolved.push(
          `${name} ${file.path} imports ${specifier}, which the item does not ship`
        );
      }
    }
  }

  return unresolved;
};

describe("radix-nova registry twins", () => {
  it("discovers dual primitives from disk, including the historical failures", async () => {
    const previousCwd = process.cwd();
    process.chdir(DOCS_ROOT);
    try {
      const dualNames = await getDualPrimitivePackageNames();
      expect(dualNames.length).toBeGreaterThan(
        HISTORICAL_RADIX_NOVA_FAILURES.length
      );
      for (const name of HISTORICAL_RADIX_NOVA_FAILURES) {
        expect(dualNames).toContain(name);
      }
    } finally {
      process.chdir(previousCwd);
    }
  });

  it("fails on the reconstructed PR 160 payload: a radix file importing ./tabs.base", () => {
    const unresolved = unresolvedSiblingImports("smoothui/components/tabs", [
      {
        content:
          'import type { TabsRootProps } from "./tabs.base";\nexport const TabsRoot = (_props: TabsRootProps) => null;\n',
        path: "index.tsx",
      },
    ]);
    expect(unresolved).toEqual([
      "smoothui/components/tabs index.tsx imports ./tabs.base, which the item does not ship",
    ]);
  });

  it("does not ship a Radix file that imports a missing sibling", async () => {
    const previousCwd = process.cwd();
    process.chdir(DOCS_ROOT);
    try {
      const dualNames = await getDualPrimitivePackageNames();
      const payloads = await Promise.all(
        dualNames.map(async (name) => {
          const item = await getPackage(name, "radix-nova");
          return unresolvedSiblingImports(name, item.files ?? []);
        })
      );

      expect(payloads.flat()).toEqual([]);
    } finally {
      process.chdir(previousCwd);
    }
  });

  it(
    "typechecks an install of every /r/radix-nova dual primitive",
    () => {
      const result = spawnSync(
        join(REPO_ROOT, "node_modules/.bin/tsx"),
        ["scripts/verify-radix-nova-install.mts"],
        {
          cwd: DOCS_ROOT,
          encoding: "utf8",
        }
      );

      const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
      expect(result.status, output).toBe(0);
      expect(output).toMatch(INSTALL_TYPECHECK_CLEAN_REGEX);
    },
    RADIX_NOVA_INSTALL_TEST_TIMEOUT_MS
  );
});
