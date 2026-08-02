import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { prepareCliPackage } from "./prepare-cli-package.mjs";

const README_ERROR = /missing README\.npm\.md/i;
const LICENSE_ERROR = /missing LICENSE/i;

const createPackageRoot = ({
  includeLicense = true,
  includeReadme = true,
}: {
  includeLicense?: boolean;
  includeReadme?: boolean;
} = {}): string => {
  const rootDirectory = mkdtempSync(
    path.join(tmpdir(), "smoothui-cli-prepare-test-")
  );
  mkdirSync(path.join(rootDirectory, "dist"));
  writeFileSync(
    path.join(rootDirectory, "package.json"),
    `${JSON.stringify({ name: "smoothui-cli", version: "1.2.3" })}\n`
  );
  writeFileSync(
    path.join(rootDirectory, "dist/index.js"),
    "#!/usr/bin/env node\n"
  );
  if (includeReadme) {
    writeFileSync(path.join(rootDirectory, "README.npm.md"), "# CLI\n");
  }
  if (includeLicense) {
    writeFileSync(path.join(rootDirectory, "LICENSE"), "MIT\n");
  }
  return rootDirectory;
};

describe("prepareCliPackage", () => {
  it("rejects a missing npm README before staging", () => {
    const rootDirectory = createPackageRoot({ includeReadme: false });

    expect(() => prepareCliPackage(rootDirectory)).toThrow(README_ERROR);
  });

  it("rejects a missing license before staging", () => {
    const rootDirectory = createPackageRoot({ includeLicense: false });

    expect(() => prepareCliPackage(rootDirectory)).toThrow(LICENSE_ERROR);
  });
});
