import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const SHARED_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const RUNTIME_PEERS = new Set(["react", "react-dom"]);

describe("blocks/shared package.json", () => {
  it("does not list dependencies the sources never import", () => {
    const pkg = JSON.parse(
      readFileSync(path.join(SHARED_DIR, "package.json"), "utf8")
    ) as { dependencies?: Record<string, string> };
    const sources = readdirSync(SHARED_DIR)
      .filter((name) => name.endsWith(".ts") || name.endsWith(".tsx"))
      .map((name) => readFileSync(path.join(SHARED_DIR, name), "utf8"))
      .join("\n");

    const unused = Object.keys(pkg.dependencies ?? {}).filter((dep) => {
      if (RUNTIME_PEERS.has(dep)) {
        return false;
      }
      return !sources.includes(dep);
    });

    expect(unused).toEqual([]);
  });
});
