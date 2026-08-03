import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

interface ReleasePleaseConfig {
  packages: {
    ".": {
      "exclude-paths": string[];
    };
  };
}

const config = JSON.parse(
  readFileSync("release-please-config.json", "utf8")
) as ReleasePleaseConfig;
const excludePaths = config.packages["."]["exclude-paths"];

const ROOT_CLI_INPUTS = new Set([
  "README.npm.md",
  "tsconfig.cli.json",
  "tsup.config.ts",
]);

const CLI_SCRIPT_DIRECTORIES = [
  "scripts/commands/",
  "scripts/prompts/",
  "scripts/utils/",
];

const CLI_SCRIPT_FILES = new Set([
  "scripts/constants.ts",
  "scripts/index.ts",
  "scripts/pack-cli.mts",
  "scripts/prepare-cli-package.mts",
  "scripts/prepare-cli-package.test.ts",
  "scripts/types.ts",
  "scripts/verify-cli-package.test.ts",
  "scripts/verify-cli-package.ts",
]);

const CLI_SENTINELS = [
  "scripts/commands/add.ts",
  "scripts/commands/list.ts",
  "scripts/constants.ts",
  "scripts/index.ts",
  "scripts/utils/install.ts",
];

// Includes deleted historical paths so the first managed CLI changelog stays scoped.
const NON_CLI_SENTINELS = [
  ".codegraph/index.sqlite",
  ".github/workflows/test.yml",
  ".release-please-manifest.json",
  "CHANGELOG.md",
  "OaUch3qNT5CdTS0N7JyDx/package.json",
  "apps/docs/app/layout.tsx",
  "package.json",
  "packages/smoothui/package.json",
  "pnpm-lock.yaml",
  "scripts/calculate-bundle-sizes.ts",
  "scripts/refresh-action-pins.ts",
  "scripts/validate-lockfile.ts",
  "tsx-501/index.js",
];

const matchesExcludePath = (filePath: string, pattern: string): boolean => {
  if (pattern.endsWith("/**")) {
    const directory = pattern.slice(0, -3);
    return filePath === directory || filePath.startsWith(`${directory}/`);
  }

  return filePath === pattern;
};

const isExcluded = (filePath: string): boolean =>
  excludePaths.some((pattern) => matchesExcludePath(filePath, pattern));

const isCliScript = (filePath: string): boolean =>
  CLI_SCRIPT_FILES.has(filePath) ||
  CLI_SCRIPT_DIRECTORIES.some((directory) => filePath.startsWith(directory));

describe("CLI release scope", () => {
  it("uses auditable exact-file or subtree exclusions", () => {
    for (const pattern of excludePaths) {
      expect(pattern.includes("*") && !pattern.endsWith("/**")).toBe(false);
    }
  });

  it("keeps CLI runtime and build inputs included", () => {
    for (const filePath of [...ROOT_CLI_INPUTS, ...CLI_SENTINELS]) {
      expect(isExcluded(filePath), filePath).toBe(false);
    }
  });

  it("excludes known workspace-only inputs", () => {
    for (const filePath of NON_CLI_SENTINELS) {
      expect(isExcluded(filePath), filePath).toBe(true);
    }
  });

  it("classifies every tracked path", () => {
    const trackedFiles = execFileSync("git", ["ls-files"], {
      encoding: "utf8",
    })
      .trim()
      .split("\n")
      .filter(Boolean);

    const unclassifiedFiles = trackedFiles.filter((filePath) => {
      const isIncludedCliScript =
        isCliScript(filePath) && !isExcluded(filePath);
      return !(
        ROOT_CLI_INPUTS.has(filePath) ||
        isIncludedCliScript ||
        isExcluded(filePath)
      );
    });

    expect(unclassifiedFiles).toEqual([]);
  });
});
