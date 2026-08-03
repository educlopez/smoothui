import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { prepareCliPackage } from "./prepare-cli-package.mjs";

const README_ERROR = /missing README\.md/i;
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
    `${JSON.stringify({
      bin: {
        smoothui: "dist/index.js",
        "smoothui-cli": "dist/index.js",
      },
      dependencies: { unsafe: "1.0.0" },
      name: "smoothui-cli",
      publishConfig: { access: "public", provenance: true },
      scripts: { postinstall: "exit 1" },
      version: "1.2.3",
    })}\n`
  );
  writeFileSync(
    path.join(rootDirectory, "dist/index.js"),
    "#!/usr/bin/env node\n"
  );
  if (includeReadme) {
    writeFileSync(path.join(rootDirectory, "README.md"), "# CLI\n");
  }
  if (includeLicense) {
    writeFileSync(path.join(rootDirectory, "LICENSE"), "MIT\n");
  }
  return rootDirectory;
};

describe("prepareCliPackage", () => {
  it("stages only deterministic publish inputs without lifecycle scripts", () => {
    const rootDirectory = createPackageRoot();

    const stageDirectory = prepareCliPackage(rootDirectory);
    const stagedPackage = JSON.parse(
      readFileSync(path.join(stageDirectory, "package.json"), "utf8")
    ) as Record<string, unknown>;

    expect(stagedPackage).toMatchObject({
      bin: {
        smoothui: "dist/index.js",
        "smoothui-cli": "dist/index.js",
      },
      files: ["dist/index.js", "README.md", "LICENSE"],
      name: "smoothui-cli",
      publishConfig: { access: "public", provenance: true },
      version: "1.2.3",
    });
    expect(stagedPackage.dependencies).toBeUndefined();
    expect(stagedPackage.scripts).toBeUndefined();
    expect(
      statSync(path.join(stageDirectory, "dist/index.js"))
        .mode.toString(8)
        .slice(-3)
    ).toBe("755");
  });

  it("rejects a missing npm README before staging", () => {
    const rootDirectory = createPackageRoot({ includeReadme: false });

    expect(() => prepareCliPackage(rootDirectory)).toThrow(README_ERROR);
  });

  it("rejects a missing license before staging", () => {
    const rootDirectory = createPackageRoot({ includeLicense: false });

    expect(() => prepareCliPackage(rootDirectory)).toThrow(LICENSE_ERROR);
  });
});
