import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

interface PackageJson {
  bin?: Record<string, string>;
  files?: string[];
  name?: string;
  private?: boolean;
  publishConfig?: Record<string, unknown>;
  repository?: { directory?: string };
  version?: string;
}

interface ReleasePleaseConfig {
  packages: Record<string, { component?: string; "package-name"?: string }>;
}

const readJson = <Value>(filePath: string): Value =>
  JSON.parse(
    readFileSync(path.join(repositoryRoot, filePath), "utf8")
  ) as Value;

const repositoryRoot = path.resolve(import.meta.dirname, "../..");
const repositoryPathExists = (filePath: string): boolean =>
  existsSync(path.join(repositoryRoot, filePath));

describe("smoothui-cli workspace isolation", () => {
  it("keeps the repository root private and non-publishable", () => {
    const rootPackage = readJson<PackageJson>("package.json");

    expect(rootPackage.private).toBe(true);
    expect(rootPackage.name).not.toBe("smoothui-cli");
    expect(rootPackage.bin).toBeUndefined();
    expect(rootPackage.publishConfig).toBeUndefined();
    expect(repositoryPathExists("scripts/index.ts")).toBe(false);
  });

  it("owns all publish metadata inside packages/cli", () => {
    const cliPackage = readJson<PackageJson>("packages/cli/package.json");
    const manifest = readJson<Record<string, string>>(
      ".release-please-manifest.json"
    );

    expect(cliPackage).toMatchObject({
      bin: {
        smoothui: "dist/index.js",
        "smoothui-cli": "dist/index.js",
      },
      files: ["dist/index.js", "README.md", "LICENSE"],
      name: "smoothui-cli",
      publishConfig: { access: "public", provenance: true },
      repository: { directory: "packages/cli" },
    });
    expect(cliPackage.version).toBe(manifest["packages/cli"]);
    expect(repositoryPathExists("packages/cli/scripts/index.ts")).toBe(true);
    expect(repositoryPathExists("packages/cli/README.md")).toBe(true);
    expect(repositoryPathExists("packages/cli/LICENSE")).toBe(true);
    expect(
      readFileSync(path.join(repositoryRoot, "packages/cli/LICENSE"))
    ).toEqual(readFileSync(path.join(repositoryRoot, "LICENSE")));
  });

  it("uses workspace paths as the release boundaries", () => {
    const releaseConfig = readJson<ReleasePleaseConfig>(
      "release-please-config.json"
    );
    const manifest = readJson<Record<string, string>>(
      ".release-please-manifest.json"
    );
    const cliPackage = readJson<PackageJson>("packages/cli/package.json");
    const libraryPackage = readJson<PackageJson>(
      "packages/smoothui/package.json"
    );

    expect(releaseConfig.packages).toEqual({
      "packages/cli": {
        component: "cli",
        "include-component-in-tag": true,
        "package-name": "smoothui-cli",
      },
      "packages/smoothui": { "package-name": "smoothui" },
    });
    expect(Object.keys(manifest).sort()).toEqual([
      "packages/cli",
      "packages/smoothui",
    ]);
    expect(manifest["packages/cli"]).toBe(cliPackage.version);
    expect(manifest["packages/smoothui"]).toBe(libraryPackage.version);
  });
});
