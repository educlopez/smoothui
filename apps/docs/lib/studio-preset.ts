import {
  DARK_SCALE,
  getTheme,
  LIGHT_SCALE,
  THEME_PALETTES,
} from "@docs/lib/registry-themes";
import type { RegistryItem } from "shadcn/schema";

// SmoothUI's own preset system. Unlike shadcn/create presets (limited to
// their catalog enums), these codes carry the full studio state — exact
// palette, continuous radius, accent lightness shift, font and neutral
// tint — and decode both in the studio (shareable URLs) and in the
// registry route, where they become installable registry:theme items:
//   npx shadcn@latest add https://smoothui.dev/r/theme-custom-<code>.json

export const FONT_OPTIONS = [
  { id: "sans", label: "Sans", stack: "Inter, ui-sans-serif, sans-serif" },
  { id: "serif", label: "Serif", stack: "Georgia, ui-serif, serif" },
  {
    id: "mono",
    label: "Mono",
    stack: '"Geist Mono", ui-monospace, monospace',
  },
] as const;

export type FontId = (typeof FONT_OPTIONS)[number]["id"];

export const TINT_OPTIONS = [
  { id: "neutral", label: "Neutral", hue: 0, chroma: 0 },
  { id: "warm", label: "Warm", hue: 75, chroma: 0.009 },
  { id: "cool", label: "Cool", hue: 255, chroma: 0.009 },
] as const;

export type TintId = (typeof TINT_OPTIONS)[number]["id"];

export interface StudioPresetState {
  accent: number;
  font: FontId;
  palette: string;
  radius: number;
  tint: TintId;
}

export const DEFAULT_STUDIO_STATE: StudioPresetState = {
  accent: 0,
  font: "sans",
  palette: "candy",
  radius: 10,
  tint: "neutral",
};

export const fontStack = (font: FontId): string =>
  FONT_OPTIONS.find((option) => option.id === font)?.stack ??
  FONT_OPTIONS[0].stack;

const OKLCH_REGEX = /oklch\((\S+) (\S+) (\S+)\)/;

/** Shift an oklch color's lightness by a percentage-point delta. */
export const shiftLightness = (color: string, delta: number): string => {
  const match = color.match(OKLCH_REGEX);
  if (!match) {
    return color;
  }
  const lightness = Math.min(
    1,
    Math.max(0, Number.parseFloat(match[1]) + delta / 100)
  );
  return `oklch(${Number(lightness.toFixed(3))} ${match[2]} ${match[3]})`;
};

/** Re-tint an achromatic oklch scale value with a subtle hue/chroma. */
const tintColor = (color: string, tint: TintId): string => {
  const option = TINT_OPTIONS.find((entry) => entry.id === tint);
  if (!option || option.chroma === 0) {
    return color;
  }
  const match = color.match(OKLCH_REGEX);
  if (!match) {
    return color;
  }
  return `oklch(${match[1]} ${option.chroma} ${option.hue})`;
};

export const tintScale = (
  scale: Record<string, string>,
  tint: TintId
): Record<string, string> => {
  const next: Record<string, string> = {};
  for (const [stop, value] of Object.entries(scale)) {
    next[stop] = tintColor(value, tint);
  }
  return next;
};

// ---------------------------------------------------------------------------
// Encoding: compact, URL-safe, versioned ("s1").
// Format: s1.<palette>.<radius>.<accent+15>.<font>.<tint>
// ---------------------------------------------------------------------------

const CODE_VERSION = "s1";
const ACCENT_OFFSET = 15;

export const encodeStudioPreset = (state: StudioPresetState): string =>
  [
    CODE_VERSION,
    state.palette,
    state.radius,
    state.accent + ACCENT_OFFSET,
    state.font,
    state.tint,
  ].join(".");

export const decodeStudioPreset = (
  code: string
): StudioPresetState | undefined => {
  const [version, palette, radius, accent, font, tint] = code.split(".");
  if (version !== CODE_VERSION) {
    return;
  }
  if (!THEME_PALETTES.some((entry) => entry.name === palette)) {
    return;
  }
  const radiusPx = Number.parseInt(radius, 10);
  const accentDelta = Number.parseInt(accent, 10) - ACCENT_OFFSET;
  if (
    !(Number.isFinite(radiusPx) && Number.isFinite(accentDelta)) ||
    radiusPx < 0 ||
    radiusPx > 24 ||
    accentDelta < -ACCENT_OFFSET ||
    accentDelta > ACCENT_OFFSET
  ) {
    return;
  }
  if (!FONT_OPTIONS.some((option) => option.id === font)) {
    return;
  }
  if (!TINT_OPTIONS.some((option) => option.id === tint)) {
    return;
  }
  return {
    accent: accentDelta,
    font: font as FontId,
    palette,
    radius: radiusPx,
    tint: tint as TintId,
  };
};

// ---------------------------------------------------------------------------
// Custom theme registry item built from a preset code
// ---------------------------------------------------------------------------

const PX_PER_REM = 16;

// cssVars keys that carry the brand accent and must follow accent shifts
const ACCENT_KEYS = [
  "accent",
  "ring",
  "chart-1",
  "sidebar-primary",
  "sidebar-ring",
];
const SECONDARY_KEYS = ["chart-2"];

export const applyAccent = (
  vars: Record<string, string>,
  delta: number
): Record<string, string> => {
  if (delta === 0) {
    return vars;
  }
  const next = { ...vars };
  for (const key of [...ACCENT_KEYS, ...SECONDARY_KEYS]) {
    if (next[key]) {
      next[key] = shiftLightness(next[key], delta);
    }
  }
  return next;
};

const applyTintToVars = (
  vars: Record<string, string>,
  scale: Record<string, string>,
  tinted: Record<string, string>
): Record<string, string> => {
  const byValue = new Map(
    Object.entries(scale).map(([stop, value]) => [value, tinted[stop]])
  );
  const next: Record<string, string> = {};
  for (const [key, value] of Object.entries(vars)) {
    next[key] = byValue.get(value) ?? value;
  }
  return next;
};

export const buildStudioCssVars = (
  state: StudioPresetState
): RegistryItem["cssVars"] | undefined => {
  const theme = getTheme(`theme-${state.palette}`);
  if (!(theme?.cssVars?.light && theme.cssVars.dark)) {
    return;
  }
  const lightTinted = tintScale(LIGHT_SCALE, state.tint);
  const darkTinted = tintScale(DARK_SCALE, state.tint);
  const light = applyAccent(
    applyTintToVars(theme.cssVars.light, LIGHT_SCALE, lightTinted),
    state.accent
  );
  const dark = applyAccent(
    applyTintToVars(theme.cssVars.dark, DARK_SCALE, darkTinted),
    state.accent
  );
  return {
    theme: { "font-sans": fontStack(state.font) },
    light: { ...light, radius: `${state.radius / PX_PER_REM}rem` },
    dark,
  };
};

export const CUSTOM_THEME_PREFIX = "theme-custom-";

export const getCustomTheme = (itemName: string): RegistryItem | undefined => {
  if (!itemName.startsWith(CUSTOM_THEME_PREFIX)) {
    return;
  }
  const code = itemName.slice(CUSTOM_THEME_PREFIX.length);
  const state = decodeStudioPreset(code);
  if (!state) {
    return;
  }
  const cssVars = buildStudioCssVars(state);
  if (!cssVars) {
    return;
  }
  const palette = THEME_PALETTES.find((entry) => entry.name === state.palette);
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: itemName,
    type: "registry:theme",
    title: `SmoothUI ${palette?.label ?? state.palette} (custom)`,
    description: `Custom SmoothUI ${state.palette} theme from the Theme Studio: radius ${state.radius}px, accent ${state.accent >= 0 ? "+" : ""}${state.accent}, ${state.font} font, ${state.tint} neutrals.`,
    author: "Eduardo Calvo <educlopez93@gmail.com>",
    cssVars,
  };
};
