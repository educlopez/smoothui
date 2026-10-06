import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  DECLARED_TOKENS,
  getTokensItem,
  SHARED_UTILITIES,
} from "../apps/docs/lib/registry-tokens";

const THEME_CSS = path.resolve(
  import.meta.dirname,
  "../apps/docs/app/smoothui.css"
);
const css = readFileSync(THEME_CSS, "utf8");

/** Body of the first top-level rule that starts with `selector {`. */
const ruleBody = (selector: string): string => {
  const start = css.indexOf(`\n${selector} {`);
  if (start === -1) {
    throw new Error(`rule ${selector} not found`);
  }
  return css.slice(start, css.indexOf("\n}", start));
};

const ROOT = ruleBody(":root");
const DARK = ruleBody(".dark");
const THEME_BLOCK = css.slice(
  css.indexOf("@theme inline"),
  css.indexOf(":root {")
);

const declares = (body: string, token: string): boolean =>
  new RegExp(`\\n\\s*--color-${token}:`).test(body);

/** Tokens introduced for primitives: name and the value they must resolve to. */
const NEW_TOKENS = [
  ["on-brand", "#fff"],
  ["destructive-fg", "#fff"],
  ["destructive-top", "#fd4b4e"],
  ["destructive-edge", "#f61418"],
  ["btn-drop", "rgb(0 0 0 / 0.4)"],
  ["btn-sheen", "rgb(255 255 255 / 0.2)"],
  ["thumb", "#fff"],
] as const;

const tokenValue = (body: string, token: string): string | undefined =>
  body
    .match(new RegExp(`--color-${token}:\\s*([^;]+);`))?.[1]
    ?.replace(/\s+/g, " ")
    .trim();

describe("primitive tokens in the theme css", () => {
  it.each(NEW_TOKENS)("%s keeps today's value in :root", (token, value) => {
    expect(tokenValue(ROOT, token)).toBe(value);
  });

  it("registers every new token with the Tailwind theme", () => {
    for (const [token] of NEW_TOKENS) {
      expect(THEME_BLOCK).toContain(`--color-${token}: var(--color-${token})`);
    }
    expect(THEME_BLOCK).toContain("--color-destructive-hover:");
  });

  it("defines on-brand and destructive-fg for light and, via :root, for dark", () => {
    // The dark block overrides only what differs; both must resolve in dark.
    for (const token of ["on-brand", "destructive-fg"]) {
      expect(declares(ROOT, token)).toBe(true);
      expect(declares(DARK, token) || declares(ROOT, token)).toBe(true);
    }
    expect(declares(DARK, "thumb")).toBe(true);
  });

  it("derives the destructive hover with color-mix on the destructive token", () => {
    const value = tokenValue(ROOT, "destructive-hover") ?? "";
    expect(value).toContain("color-mix(");
    expect(value).toContain("var(--color-destructive)");
  });
});

describe("primitive tokens in the registry tokens item", () => {
  const item = getTokensItem();
  const theme = item.cssVars?.theme ?? {};

  it.each(NEW_TOKENS)("declares %s with the same value", (token, value) => {
    expect(DECLARED_TOKENS).toContain(token);
    const themeValue = theme[`color-${token}`] ?? "";
    // Constant tokens are `var(--name, literal)`; mode tokens indirect to a raw
    // var whose light and dark values carry the literal.
    const literal =
      themeValue.match(/^var\(--[a-z-]+,\s*(.+)\)$/)?.[1] ??
      item.cssVars?.light?.[token];
    expect(literal).toBe(value);
  });

  it("declares thumb for light and dark", () => {
    expect(item.cssVars?.light?.thumb).toBe("#fff");
    expect(item.cssVars?.dark?.thumb).toBe("#fff");
  });

  it("derives the destructive hover with color-mix", () => {
    expect(theme["color-destructive-hover"]).toContain("color-mix(");
    expect(theme["color-destructive-hover"]).toContain(
      "var(--color-destructive)"
    );
  });

  it("ships the shared utilities in the item css", () => {
    for (const name of Object.keys(SHARED_UTILITIES)) {
      expect(item.css?.[`@utility ${name}`]).toBeDefined();
      expect(css).toContain(`@utility ${name} {`);
    }
  });
});

// Contrast of the foreground tokens over their fills. White on the brand pink
// is a deliberate brand decision: the ratios are PINNED, not held to
// AA, so a silent change of either side fails here until the decision is
// revisited. The destructive pair is pinned for the same reason.
const OKLCH = /oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/;

const linearLuminance = (value: string): number => {
  if (value === "#fff") {
    return 1;
  }
  const match = value.match(OKLCH);
  if (!match) {
    throw new Error(`unsupported colour ${value}`);
  }
  const [lightness, chroma, hue] = match.slice(1).map(Number) as [
    number,
    number,
    number,
  ];
  const a = chroma * Math.cos((hue * Math.PI) / 180);
  const b = chroma * Math.sin((hue * Math.PI) / 180);
  const l = (lightness + 0.396_337_777_4 * a + 0.215_803_757_3 * b) ** 3;
  const m = (lightness - 0.105_561_345_8 * a - 0.063_854_172_8 * b) ** 3;
  const s = (lightness - 0.089_484_177_5 * a - 1.291_485_548 * b) ** 3;
  const clamp = (x: number) => Math.min(1, Math.max(0, x));
  const r = clamp(
    4.076_741_662_1 * l - 3.307_711_591_3 * m + 0.230_969_929_2 * s
  );
  const g = clamp(
    -1.268_438_004_6 * l + 2.609_757_401_1 * m - 0.341_319_396_5 * s
  );
  const bl = clamp(
    -0.004_196_086_3 * l - 0.703_418_614_7 * m + 1.707_614_701 * s
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
};

const contrast = (a: number, b: number): number => {
  const [light, dark] = a > b ? [a, b] : [b, a];
  return (light + 0.05) / (dark + 0.05);
};

const PIN_TOLERANCE = 0.05;

describe("foreground over fill (pinned by the brand decision, not an AA target)", () => {
  const fg = (body: string, token: string) =>
    tokenValue(body, token) ?? tokenValue(ROOT, token) ?? "";

  it.each([
    ["on-brand over brand (light)", ROOT, "on-brand", "brand", 2.74],
    ["on-brand over brand (dark)", DARK, "on-brand", "brand", 2.74],
    [
      "on-brand over brand-secondary (light)",
      ROOT,
      "on-brand",
      "brand-secondary",
      3.47,
    ],
    [
      "on-brand over brand-secondary (dark)",
      DARK,
      "on-brand",
      "brand-secondary",
      3.47,
    ],
  ])("%s stays at the accepted ratio", (_label, body, fgToken, fill, ratio) => {
    const measured = contrast(
      linearLuminance(fg(body, fgToken)),
      linearLuminance(fg(body, fill))
    );
    expect(Math.abs(measured - ratio)).toBeLessThan(PIN_TOLERANCE);
  });

  it("destructive-fg over destructive keeps today's pairing in both modes", () => {
    const light = contrast(
      linearLuminance(fg(ROOT, "destructive-fg")),
      linearLuminance(tokenValueRaw(ROOT, "--destructive"))
    );
    const dark = contrast(
      linearLuminance(fg(DARK, "destructive-fg")),
      linearLuminance(tokenValueRaw(DARK, "--destructive"))
    );
    expect(Math.abs(light - 4.76)).toBeLessThan(PIN_TOLERANCE);
    expect(Math.abs(dark - 2.89)).toBeLessThan(PIN_TOLERANCE);
  });
});

function tokenValueRaw(body: string, name: string): string {
  const value = body.match(new RegExp(`${name}:\\s*([^;]+);`))?.[1];
  if (!value) {
    throw new Error(`${name} not found`);
  }
  return value.trim();
}
