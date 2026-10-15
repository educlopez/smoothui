import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const COMPONENTS = path.resolve(
  import.meta.dirname,
  "../packages/smoothui/components"
);
const read = (file: string) =>
  readFileSync(path.join(COMPONENTS, file), "utf8");

/** The four looping consumers and the preset members each one must use. */
const CONSUMERS = [
  ["skeleton/index.tsx", ["loopTransition", "useLoopInView", "LOOP_CLASS"]],
  ["spinner/index.tsx", ["loopTransition", "useLoopInView", "LOOP_CLASS"]],
  [
    "progress/progress.base.tsx",
    ["loopTransition", "useLoopInView", "LOOP_CLASS"],
  ],
  [
    "progress/progress.radix.tsx",
    ["loopTransition", "useLoopInView", "LOOP_CLASS"],
  ],
  ["badge/index.tsx", ["loopTransition", "useLoopInView", "LOOP_CLASS"]],
] as const;

const preset = readFileSync(
  path.resolve(import.meta.dirname, "../packages/smoothui/lib/animation.ts"),
  "utf8"
);

describe("shared infinite animation preset", () => {
  it("defines the preset once in lib/animation.ts", () => {
    expect(preset).toContain(
      'export const LOOP_CLASS = "will-change-transform"'
    );
    expect(preset).toContain("export const LOOP_REPEAT_DELAY");
    expect(preset).toContain("export const loopTransition");
    expect(preset).toContain("export const useLoopInView");
    expect(preset).toContain("repeatDelay");
    expect(preset).toContain("Number.POSITIVE_INFINITY");
  });

  it("keeps no string easing in the preset", () => {
    expect(preset).not.toMatch(/ease:\s*"/);
  });

  it.each(CONSUMERS)("%s imports the preset", (file, members) => {
    const source = read(file);
    expect(source).toMatch(/from "\.\.\/\.\.\/lib\/animation"/);
    for (const member of members) {
      expect(source).toContain(member);
    }
  });

  it.each(CONSUMERS)("%s has no other infinite repeat", (file) => {
    const source = read(file);
    expect(source).not.toContain("Number.POSITIVE_INFINITY");
    expect(source).not.toMatch(
      /repeat:\s*(?:Infinity|Number\.POSITIVE_INFINITY)/
    );
    expect(source).not.toMatch(/ease:\s*"linear"/);
  });
});
