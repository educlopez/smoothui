import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { PRIMITIVES_INVENTORY } from "../apps/docs/lib/primitives-inventory";
import { SHARED_UTILITIES } from "../apps/docs/lib/registry-tokens";

const ROOT = path.resolve(import.meta.dirname, "..");
const COMPONENTS = path.join(ROOT, "packages/smoothui/components");
const css = readFileSync(path.join(ROOT, "apps/docs/app/smoothui.css"), "utf8");

/** Every file that carried the 3px focus recipe when the utility was introduced. */
const RING_CONSUMERS = [
  "checkbox-group/checkbox-group.base.tsx",
  "checkbox-group/checkbox-group.radix.tsx",
  "checkbox/checkbox.base.tsx",
  "checkbox/checkbox.radix.tsx",
  "field/index.tsx",
  "input/index.tsx",
  "number-field/number-field.base.tsx",
  "number-field/number-field.radix.tsx",
  "otp-field/otp-field.base.tsx",
  "otp-field/otp-field.radix.tsx",
  "radio-group/radio-group.base.tsx",
  "radio-group/radio-group.radix.tsx",
  "select/index.tsx",
  "slider/slider.radix.tsx",
  "switch/switch.base.tsx",
  "switch/switch.radix.tsx",
  "textarea/index.tsx",
  "toast/index.tsx",
  "toggle-group/toggle-group.radix.tsx",
  "toggle/toggle.base.tsx",
  "toggle/toggle.radix.tsx",
  "toolbar/toolbar.base.tsx",
  "toolbar/toolbar.radix.tsx",
] as const;

/** Source files of every primitive in the inventory. */
const primitiveSources = (): string[] =>
  PRIMITIVES_INVENTORY.flatMap((item) => {
    try {
      return readdirSync(path.join(COMPONENTS, item.slug))
        .filter((name) => name.endsWith(".tsx"))
        .map((name) => `${item.slug}/${name}`);
    } catch {
      return [];
    }
  });

/** The slider Base thumb owns a nested focusable, so it uses the `-within` form. */
const RING_WITHIN_CONSUMERS = ["slider/slider.base.tsx"] as const;

const LITERAL_RECIPE = /focus-visible:ring-\[3px\]/;
const WITHIN_RECIPE = /has-\[:focus-visible\]:ring-\[3px\]/;

const read = (file: string) =>
  readFileSync(path.join(COMPONENTS, file), "utf8");

const utilityBlock = (name: string): string => {
  const start = css.indexOf(`@utility ${name} {`);
  if (start === -1) {
    throw new Error(`@utility ${name} not found`);
  }
  return css.slice(start, css.indexOf("\n}", start));
};

describe("shared focus ring utility", () => {
  it("leaves no primitive with the literal 3px recipe", () => {
    const sources = primitiveSources();
    expect(sources.length).toBeGreaterThan(40);
    const offenders = sources.filter((file) => LITERAL_RECIPE.test(read(file)));
    expect(offenders).toEqual([]);
  });

  it("defines the utility in the theme css and in the registry item", () => {
    expect(css).toContain("@utility focus-ring {");
    expect(css).toContain("@utility focus-ring-within {");
    expect(SHARED_UTILITIES["focus-ring"]).toBeDefined();
    expect(SHARED_UTILITIES["focus-ring-within"]).toBeDefined();
  });

  it("keeps the registry definition in step with the css definition", () => {
    const registry = JSON.stringify(SHARED_UTILITIES["focus-ring"]);
    const alpha = utilityBlock("focus-ring").match(/ring-ring\/(\d+)/)?.[1];
    expect(alpha).toBeDefined();
    expect(registry).toContain(`ring-ring/${alpha}`);
    expect(registry).toContain("ring-[3px]");
  });

  it.each(RING_CONSUMERS)(
    "%s uses the utility, not the literal recipe",
    (file) => {
      const source = read(file);
      expect(source).toMatch(/(?<![\w-])focus-ring(?![\w-])/);
      expect(source).not.toMatch(LITERAL_RECIPE);
    }
  );

  it.each(RING_WITHIN_CONSUMERS)("%s uses the within form", (file) => {
    const source = read(file);
    expect(source).toContain("focus-ring-within");
    expect(source).not.toMatch(WITHIN_RECIPE);
    expect(source).not.toMatch(LITERAL_RECIPE);
  });
});

// Ring contrast against the page background, after alpha blending. Ring and
// page tokens are achromatic, so luminance is lightness cubed and the browser
// composites in gamma-encoded sRGB.
const MIN_NON_TEXT_CONTRAST = 3;

const ruleBody = (selector: string): string => {
  const start = css.indexOf(`\n${selector} {`);
  return css.slice(start, css.indexOf("\n}", start));
};

const lightness = (body: string, token: string): number => {
  const match = body.match(
    new RegExp(`--color-${token}:\\s*oklch\\(\\s*([\\d.]+)\\s+0\\s+0\\s*\\)`)
  );
  if (!match?.[1]) {
    throw new Error(`${token} is not an achromatic oklch value`);
  }
  return Number(match[1]);
};

const encode = (linear: number): number =>
  linear <= 0.003_130_8 ? 12.92 * linear : 1.055 * linear ** (1 / 2.4) - 0.055;
const decode = (channel: number): number =>
  channel <= 0.040_45 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;

const blendedContrast = (
  ringLightness: number,
  pageLightness: number,
  alpha: number
): number => {
  const ring = encode(ringLightness ** 3);
  const page = encode(pageLightness ** 3);
  const blended = decode(alpha * ring + (1 - alpha) * page);
  const pageLuminance = pageLightness ** 3;
  const [high, low] =
    blended > pageLuminance
      ? [blended, pageLuminance]
      : [pageLuminance, blended];
  return (high + 0.05) / (low + 0.05);
};

describe("focus ring contrast over the page background", () => {
  const alpha =
    Number(utilityBlock("focus-ring").match(/ring-ring\/(\d+)/)?.[1]) / 100;

  it.each([
    [":root", "light"],
    [".dark", "dark"],
  ])("reaches 3:1 in %s (%s)", (selector) => {
    const body = ruleBody(selector);
    const ratio = blendedContrast(
      lightness(body, "ring"),
      lightness(body, "smooth-50"),
      alpha
    );
    expect(ratio).toBeGreaterThanOrEqual(MIN_NON_TEXT_CONTRAST);
  });

  it("would fail at the old 50% alpha, so the raise is what fixes it", () => {
    const light = ruleBody(":root");
    const old = blendedContrast(
      lightness(light, "ring"),
      lightness(light, "smooth-50"),
      0.5
    );
    expect(old).toBeLessThan(MIN_NON_TEXT_CONTRAST);
  });

  it("applies the same alpha to the within form", () => {
    expect(utilityBlock("focus-ring-within")).toContain(
      `ring-ring/${Math.round(alpha * 100)}`
    );
  });
});
