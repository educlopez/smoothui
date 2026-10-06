import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { SHARED_UTILITIES } from "../apps/docs/lib/registry-tokens";

const ROOT = path.resolve(import.meta.dirname, "..");
const read = (file: string) =>
  readFileSync(path.join(ROOT, "packages/smoothui/components", file), "utf8");
const css = readFileSync(path.join(ROOT, "apps/docs/app/smoothui.css"), "utf8");

/**
 * Stateful form controls. toggle-group Base has no item class of its own: its
 * items are Toggle, so it inherits the utility (asserted in the toggle-group
 * parity test through render, and here through the Toggle source).
 */
const CONTROLS = [
  "checkbox-group/checkbox-group.base.tsx",
  "checkbox-group/checkbox-group.radix.tsx",
  "checkbox/checkbox.base.tsx",
  "checkbox/checkbox.radix.tsx",
  "field/index.tsx",
  "input-group/index.tsx",
  "input/index.tsx",
  "number-field/number-field.base.tsx",
  "number-field/number-field.radix.tsx",
  "otp-field/otp-field.base.tsx",
  "otp-field/otp-field.radix.tsx",
  "otp-slots/index.tsx",
  "radio-group/radio-group.base.tsx",
  "radio-group/radio-group.radix.tsx",
  "select/index.tsx",
  "switch/switch.base.tsx",
  "switch/switch.radix.tsx",
  "textarea/index.tsx",
  "toggle-group/toggle-group.radix.tsx",
  "toggle/toggle.base.tsx",
  "toggle/toggle.radix.tsx",
] as const;

const utilityBlock = (): string => {
  const start = css.indexOf("@utility state-transition {");
  if (start === -1) {
    throw new Error("@utility state-transition not found");
  }
  return css.slice(start, css.indexOf("\n}", start));
};

describe("shared state transition utility", () => {
  it("is defined with reduced motion off, ease-out and 150ms", () => {
    const block = utilityBlock();
    expect(block).toContain("motion-reduce:transition-none");
    expect(block).toContain("duration-150");
    expect(block).toContain("ease-out");
    expect(block).toContain(
      "transition-[background-color,border-color,color,box-shadow]"
    );
  });

  it("has no ease-in and no string easing, in css or in the registry item", () => {
    const registry = JSON.stringify(SHARED_UTILITIES["state-transition"]);
    for (const text of [utilityBlock(), registry]) {
      expect(text).not.toMatch(/ease-in(?!-out)/);
      expect(text).not.toMatch(/ease-in-out/);
      expect(text).not.toMatch(/easeIn|easeOut|easeInOut/);
    }
    expect(registry).toContain("motion-reduce:transition-none");
    expect(registry).toContain("ease-out");
  });

  it.each(CONTROLS)("%s uses the utility", (file) => {
    expect(read(file)).toMatch(/(?<![\w-])state-transition(?![\w-])/);
  });

  it.each(CONTROLS)(
    "%s keeps no competing transition-property class on the control",
    (file) => {
      const source = read(file);
      // `transition-none` and `transition-opacity`-style helpers on other nodes
      // are fine; the old per-control recipes are what the utility replaced.
      expect(source).not.toMatch(/ transition-\[color,box-shadow\]/);
      expect(source).not.toMatch(/ transition-shadow /);
    }
  );
});
