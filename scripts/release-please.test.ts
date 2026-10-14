import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = join(import.meta.dirname, "..");

const readJson = (relative: string): Record<string, unknown> =>
  JSON.parse(readFileSync(join(ROOT, relative), "utf-8")) as Record<
    string,
    unknown
  >;

describe("release-please", () => {
  it("keeps the manifest at the last published versions until release-please bumps them", () => {
    const manifest = readJson(".release-please-manifest.json");

    expect(manifest).toEqual({
      "packages/cli": "1.1.3",
      "packages/smoothui": "3.9.1",
    });
  });

  it("versions smoothui and the CLI as separate packages", () => {
    const config = readJson("release-please-config.json");
    const packages = config.packages as Record<
      string,
      { "package-name": string }
    >;

    expect(Object.keys(packages)).toEqual([
      "packages/cli",
      "packages/smoothui",
    ]);
    expect(packages["packages/cli"]?.["package-name"]).toBe("smoothui-cli");
    expect(packages["packages/smoothui"]?.["package-name"]).toBe("smoothui");
    expect(config["release-type"]).toBe("node");
  });
});
