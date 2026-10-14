import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const DOCS_ROOT = join(import.meta.dirname, "../../content/docs");

const walkMarkdown = (dir: string): string[] => {
  const files: string[] = [];

  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      files.push(...walkMarkdown(fullPath));
      continue;
    }
    if (entry.endsWith(".md") || entry.endsWith(".mdx")) {
      files.push(fullPath);
    }
  }

  return files;
};

describe("docs package references", () => {
  it("does not tell people to install packages that are not in the registry", () => {
    const forbidden = ["@smoothui/hero-section", "@smoothui/lib"];
    const hits: string[] = [];

    for (const file of walkMarkdown(DOCS_ROOT)) {
      const source = readFileSync(file, "utf-8");
      for (const name of forbidden) {
        if (source.includes(name)) {
          hits.push(`${file}: ${name}`);
        }
      }
    }

    expect(hits).toEqual([]);
  });
});
