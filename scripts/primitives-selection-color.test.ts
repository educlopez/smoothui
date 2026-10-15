import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = path.resolve(import.meta.dirname, "..");
const read = (file: string) =>
  readFileSync(path.join(ROOT, "packages/smoothui/components", file), "utf8");
const rule = readFileSync(
  path.join(ROOT, "docs/contributing/primitives.md"),
  "utf8"
);

/** Selected-state token per component, as named by the "Selection color" rule. */
const RULE = {
  checkbox: "foreground",
  "checkbox-group": "foreground",
  "radio-group": "brand",
  select: "neutral",
  slider: "brand",
  switch: "brand",
} as const;

type Token = (typeof RULE)[keyof typeof RULE];

/** Selected-state class evidence per file, and the token it implies. */
const SELECTED_CLASSES: Record<string, [Token, RegExp][]> = {
  "checkbox-group/checkbox-group.base.tsx": [
    ["foreground", /data-checked:bg-foreground/],
  ],
  "checkbox-group/checkbox-group.radix.tsx": [
    ["foreground", /data-\[state=checked\]:bg-foreground/],
  ],
  "checkbox/checkbox.base.tsx": [["foreground", /data-checked:bg-foreground/]],
  "checkbox/checkbox.radix.tsx": [
    ["foreground", /data-\[state=checked\]:bg-foreground/],
  ],
  "radio-group/radio-group.base.tsx": [
    ["brand", /data-checked:border-brand/],
    ["brand", /rounded-full bg-brand/],
  ],
  "radio-group/radio-group.radix.tsx": [
    ["brand", /data-\[state=checked\]:border-brand/],
    ["brand", /rounded-full bg-brand/],
  ],
  "select/index.tsx": [["neutral", /isFocused && "bg-muted text-foreground"/]],
  "slider/slider.base.tsx": [
    ["brand", /rounded-full bg-brand/],
    ["brand", /border-2 border-brand/],
  ],
  "slider/slider.radix.tsx": [
    ["brand", /rounded-full bg-brand/],
    ["brand", /border-2 border-brand/],
  ],
  "switch/switch.base.tsx": [["brand", /\? "bg-brand"/]],
  "switch/switch.radix.tsx": [["brand", /\? "bg-brand"/]],
};

const slugOf = (file: string) => file.split("/")[0] as keyof typeof RULE;

describe("selection color rule", () => {
  it("is written in the contributing guide and names all five components", () => {
    const start = rule.indexOf("\n## Selection color");
    expect(start).toBeGreaterThan(-1);
    const section = rule.slice(start, rule.indexOf("\n## ", start + 1));
    for (const name of [
      "checkbox",
      "radio-group",
      "switch",
      "slider",
      "select",
    ]) {
      expect(section).toContain(name);
    }
  });

  it.each(Object.entries(SELECTED_CLASSES))(
    "%s marks selection with the token the rule names",
    (file, expectations) => {
      const source = read(file);
      for (const [token, pattern] of expectations) {
        expect(token).toBe(RULE[slugOf(file)]);
        expect(source).toMatch(pattern);
      }
    }
  );

  it("never marks a selected row or fill with the accent token", () => {
    for (const file of Object.keys(SELECTED_CLASSES)) {
      expect(read(file)).not.toMatch(
        /(?:data-checked|data-\[state=checked\]|isSelected[^\n]*):?bg-accent/
      );
    }
    expect(read("select/index.tsx")).not.toContain("bg-accent");
  });
});
