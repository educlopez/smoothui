import { execFileSync } from "node:child_process";
import { chmodSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { verifyCliPackage } from "./verify-cli-package.js";

const VERSION = "1.2.3";
const BUNDLED_VERSION_ERROR = /bundled CLI version/i;
const RELEASE_TAG_ERROR = /release tag/i;

const createPackedFixture = (bundleVersion = VERSION) => {
  const root = mkdtempSync(path.join(tmpdir(), "smoothui-cli-pack-test-"));
  const packageDirectory = path.join(root, "package-source");
  const artifactDirectory = path.join(root, "artifacts");
  mkdirSync(path.join(packageDirectory, "dist"), { recursive: true });
  mkdirSync(artifactDirectory);

  writeFileSync(path.join(packageDirectory, "LICENSE"), "MIT\n");
  writeFileSync(path.join(packageDirectory, "README.md"), "# smoothui-cli\n");
  writeFileSync(
    path.join(packageDirectory, "dist/index.js"),
    `#!/usr/bin/env node\nconst version = ${JSON.stringify(bundleVersion)};\nif (process.argv.includes("--version")) console.log(version);\nelse console.log("Usage: npx smoothui <command> [options]");\n`
  );
  chmodSync(path.join(packageDirectory, "dist/index.js"), 0o755);

  const packageJson = {
    bin: {
      smoothui: "dist/index.js",
      "smoothui-cli": "dist/index.js",
    },
    engines: { node: ">=22.13.0" },
    files: ["dist/index.js", "README.md", "LICENSE"],
    name: "smoothui-cli",
    type: "module",
    version: VERSION,
  };
  const sourcePackageJsonPath = path.join(root, "package.json");
  writeFileSync(
    sourcePackageJsonPath,
    `${JSON.stringify(packageJson, null, 2)}\n`
  );
  writeFileSync(
    path.join(packageDirectory, "package.json"),
    `${JSON.stringify(packageJson, null, 2)}\n`
  );

  const packOutput = execFileSync(
    "npm",
    [
      "pack",
      "--json",
      "--ignore-scripts",
      "--pack-destination",
      artifactDirectory,
      packageDirectory,
    ],
    { encoding: "utf8" }
  );
  const packJsonPath = path.join(root, "pack.json");
  writeFileSync(packJsonPath, packOutput);

  return {
    artifactDirectory,
    packJsonPath,
    sourcePackageJsonPath,
  };
};

describe("verifyCliPackage", () => {
  it("accepts the exact npm tarball and smoke-runs its bundled CLI", () => {
    const fixture = createPackedFixture();

    const verified = verifyCliPackage({
      ...fixture,
      expectedTag: `cli-v${VERSION}`,
    });

    expect(verified.name).toBe("smoothui-cli");
    expect(verified.version).toBe(VERSION);
    expect(verified.files).toEqual([
      "LICENSE",
      "README.md",
      "dist/index.js",
      "package.json",
    ]);
  });

  it("rejects a tarball whose bundled version is stale", () => {
    const fixture = createPackedFixture("1.2.2");

    expect(() =>
      verifyCliPackage({
        ...fixture,
        expectedTag: `cli-v${VERSION}`,
      })
    ).toThrow(BUNDLED_VERSION_ERROR);
  });

  it("rejects a release tag that does not match the package version", () => {
    const fixture = createPackedFixture();

    expect(() =>
      verifyCliPackage({
        ...fixture,
        expectedTag: "cli-v9.9.9",
      })
    ).toThrow(RELEASE_TAG_ERROR);
  });
});
