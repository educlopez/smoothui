import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = join(import.meta.dirname, "..");

const readJson = (relative: string): Record<string, unknown> =>
  JSON.parse(readFileSync(join(ROOT, relative), "utf-8")) as Record<
    string,
    unknown
  >;

const SEMVER = /^\d+\.\d+\.\d+$/;

describe("release-please", () => {
  it("lists each package with a semver so release-please can bump them independently", () => {
    const manifest = readJson(".release-please-manifest.json");
    const names = Object.keys(manifest).toSorted();

    expect(names).toEqual(["packages/cli", "packages/smoothui"]);
    for (const name of names) {
      expect(manifest[name], name).toMatch(SEMVER);
    }
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

  it("keeps component-specific release branches without changing tag names", () => {
    const config = readJson("release-please-config.json");
    const packages = config.packages as Record<string, Record<string, unknown>>;

    // The shared release branch loses the component when only SmoothUI is due
    // (PR #226). A component-specific branch lets Release Please find it again
    // after merge, without adding a component prefix to the public tag.
    expect(config["separate-pull-requests"]).toBe(true);
    expect(config["include-component-in-tag"]).toBe(false);
    expect(config["include-v-in-tag"]).toBe(true);
    expect(
      packages["packages/smoothui"]?.["include-component-in-tag"]
    ).toBeUndefined();
    expect(packages["packages/smoothui"]?.["separate-pull-requests"]).not.toBe(
      false
    );
    expect(packages["packages/cli"]).toMatchObject({
      component: "cli",
      "include-component-in-tag": true,
    });
  });
});
