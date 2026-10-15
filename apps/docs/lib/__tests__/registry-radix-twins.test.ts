import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { getPackage } from "../package";

const DOCS_ROOT = join(fileURLToPath(import.meta.url), "../../..");
const REPO_ROOT = join(DOCS_ROOT, "../..");

const RADIX_NOVA_ITEMS = [
  "smoothui/components/tabs",
  "smoothui/components/slider",
  "smoothui/components/toggle",
  "smoothui/components/toggle-group",
] as const;

const SIBLING_IMPORT_REGEX =
  /(?:from\s+|import\s*\(\s*|require\s*\(\s*)["'](\.\/[^"']+)["']/g;

const resolutionCandidates = (specifier: string): string[] => {
  const base = specifier.replace(/^\.\//, "");
  return [
    base,
    ...[".ts", ".tsx", ".js", ".jsx"].flatMap((ext) => [
      `${base}${ext}`,
      `${base}/index${ext}`,
    ]),
  ];
};

describe("radix-nova registry twins", () => {
  it("does not ship a Radix file that imports a missing .base sibling", async () => {
    const previousCwd = process.cwd();
    process.chdir(DOCS_ROOT);
    try {
      const unresolved: string[] = [];

      for (const name of RADIX_NOVA_ITEMS) {
        const item = await getPackage(name, "radix-nova");
        const shipped = new Set((item.files ?? []).map((file) => file.path));

        for (const file of item.files ?? []) {
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
      }

      expect(unresolved).toEqual([]);
    } finally {
      process.chdir(previousCwd);
    }
  });

  it("typechecks an install of /r/radix-nova/{tabs,slider,toggle,toggle-group}.json", () => {
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
    expect(output).toMatch(/Install typecheck clean/);
  });
});
