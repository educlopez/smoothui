import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  DARK_SCALE,
  getAllThemeNames,
  getTheme,
  LIGHT_SCALE,
} from "../registry-themes";

const DECLARATION_REGEX = /(--[\w-]+):\s*([^;]+);/g;
const OKLCH_L_REGEX = /oklch\(([\d.]+)/;

const css = readFileSync(
  join(import.meta.dirname, "../../app/smoothui.css"),
  "utf8"
);

const blockBody = (selector: string): string => {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) {
    throw new Error(`smoothui.css has no "${selector} {" block`);
  }
  const end = css.indexOf("\n}", start);
  return css.slice(start, end);
};

const declarations = (body: string): Map<string, string> => {
  const map = new Map<string, string>();
  for (const match of body.matchAll(DECLARATION_REGEX)) {
    map.set(match[1], match[2].trim());
  }
  return map;
};

const root = declarations(blockBody(":root"));
const dark = declarations(blockBody(".dark"));
const themeInline = declarations(blockBody("@theme inline"));

const ROLES = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
];

describe("neutral ramp", () => {
  it("registry LIGHT_SCALE equals the :root smooth ramp", () => {
    for (const [step, value] of Object.entries(LIGHT_SCALE)) {
      expect(root.get(`--color-smooth-${step}`), `light ${step}`).toBe(value);
    }
  });

  it("registry DARK_SCALE equals the .dark smooth ramp", () => {
    for (const [step, value] of Object.entries(DARK_SCALE)) {
      expect(dark.get(`--color-smooth-${step}`), `dark ${step}`).toBe(value);
    }
  });

  it("is monotonic in lightness", () => {
    const lightness = (value: string): number =>
      Number(value.match(OKLCH_L_REGEX)?.[1]);
    const light = Object.values(LIGHT_SCALE).map(lightness);
    const darkL = Object.values(DARK_SCALE).map(lightness);
    for (let i = 1; i < light.length; i++) {
      expect(light[i]).toBeLessThan(light[i - 1]);
      expect(darkL[i]).toBeGreaterThan(darkL[i - 1]);
    }
  });
});

describe("semantic roles have one value", () => {
  it("@theme inline points each role at its own variable", () => {
    for (const role of ROLES) {
      expect(themeInline.get(`--color-${role}`), role).toBe(
        `var(--color-${role})`
      );
    }
  });

  it("each role is defined in both :root and .dark", () => {
    for (const role of ROLES) {
      expect(root.has(`--color-${role}`), `:root ${role}`).toBe(true);
      expect(dark.has(`--color-${role}`), `.dark ${role}`).toBe(true);
    }
  });
});

describe("installable themes", () => {
  it("default theme input matches the docs input token", () => {
    const theme = getTheme("theme");
    // Same mix; the registry names the shadcn variable (`--foreground`).
    const toRegistry = (value?: string) =>
      value?.replace("var(--color-foreground)", "var(--foreground)");
    expect(theme?.cssVars?.light?.input).toBe(
      toRegistry(root.get("--color-input"))
    );
    expect(theme?.cssVars?.dark?.input).toBe(
      toRegistry(dark.get("--color-input"))
    );
  });

  it("every theme keeps primary as the soft neutral surface", () => {
    for (const name of getAllThemeNames()) {
      const theme = getTheme(name);
      expect(theme?.cssVars?.light?.primary, name).toBe(LIGHT_SCALE[100]);
      expect(theme?.cssVars?.dark?.primary, name).toBe(DARK_SCALE[100]);
    }
  });
});
