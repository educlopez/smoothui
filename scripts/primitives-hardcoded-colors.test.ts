import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { PRIMITIVES_INVENTORY } from "../apps/docs/lib/primitives-inventory";

const COMPONENTS = path.resolve(
  import.meta.dirname,
  "../packages/smoothui/components"
);

/** Hardcoded colours that bypass the design tokens. */
const FORBIDDEN: readonly [string, RegExp][] = [
  ["hex colour", /#[0-9a-fA-F]{3,8}\b/],
  ["rgb/rgba function", /\brgba?\(/],
  ["bg-white", /(?<![\w-])(?:[\w[\]:-]+:)?bg-white\b/],
  ["text-white", /(?<![\w-])(?:[\w[\]:-]+:)?text-white\b/],
  ["border-white", /(?<![\w-])(?:[\w[\]:-]+:)?border-white\b/],
];

/**
 * Files allowed to carry a hardcoded colour, each with the reason. Keep it
 * short: a new entry needs a sentence a reviewer can disagree with.
 */
const ALLOWLIST: Record<string, string> = {};

const primitiveSources = (): string[] =>
  PRIMITIVES_INVENTORY.flatMap((item) => {
    const dir = path.join(COMPONENTS, item.slug);
    try {
      return readdirSync(dir)
        .filter((name) => name.endsWith(".tsx"))
        .map((name) => `${item.slug}/${name}`);
    } catch {
      return [];
    }
  });

/** Lines of a source file outside comments, with their 1-based numbers. */
const codeLines = (source: string): [number, string][] =>
  source
    .split("\n")
    .map((line, index): [number, string] => [index + 1, line])
    .filter(
      ([, line]) =>
        !(
          line.trim().startsWith("//") ||
          line.trim().startsWith("*") ||
          line.trim().startsWith("/*")
        )
    );

export const findHardcodedColors = (source: string): string[] =>
  codeLines(source).flatMap(([line, text]) =>
    FORBIDDEN.filter(([, pattern]) => pattern.test(text)).map(
      ([label]) => `line ${line}: ${label}`
    )
  );

describe("hardcoded colours in primitives", () => {
  const sources = primitiveSources();

  it("scans the primitives it should", () => {
    expect(sources.length).toBeGreaterThan(40);
    expect(sources).toContain("smooth-button/smooth-button.base.tsx");
    expect(sources).toContain("switch/switch.radix.tsx");
  });

  it("detects each forbidden form (the guard fails when a hex is added)", () => {
    expect(findHardcodedColors('const c = "bg-[#fd4b4e]";')).not.toEqual([]);
    expect(findHardcodedColors('const c = "shadow-[0_0_#000]";')).not.toEqual(
      []
    );
    expect(findHardcodedColors('const c = "rgba(0,0,0,0.4)";')).not.toEqual([]);
    expect(findHardcodedColors('const c = "dark:bg-white";')).not.toEqual([]);
    expect(findHardcodedColors('const c = "text-white";')).not.toEqual([]);
    expect(findHardcodedColors('const c = "border-white/25";')).not.toEqual([]);
    expect(findHardcodedColors('const c = "bg-thumb text-on-brand";')).toEqual(
      []
    );
  });

  it("keeps every allowlist entry justified and in use", () => {
    for (const [file, reason] of Object.entries(ALLOWLIST)) {
      expect(reason.length).toBeGreaterThan(10);
      expect(sources).toContain(file);
    }
  });

  it.each(sources)("%s has no hardcoded colour", (file) => {
    if (ALLOWLIST[file]) {
      return;
    }
    const found = findHardcodedColors(
      readFileSync(path.join(COMPONENTS, file), "utf8")
    );
    expect(found).toEqual([]);
  });
});
