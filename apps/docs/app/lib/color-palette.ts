const OKLCH_REGEX = /oklch\(([^)]+)\)/;
const MAX_LIGHTNESS = 1.0;
const LIGHT_ADJUSTMENT = 0.13;
const LIGHTER_ADJUSTMENT = 0.24;
const CHROMA_LIGHT_ADJUSTMENT = 0.06;
const CHROMA_LIGHTER_ADJUSTMENT = 0.14;

export const COLOR_STORAGE_KEY = "smoothui-colors";

interface ColorVariations {
  lightColor: string;
  lighterColor: string;
}

interface ColorPalette {
  primary: string;
  primaryLight: string;
  primaryLighter: string;
  secondary: string;
  secondaryLight: string;
  secondaryLighter: string;
}

function updateShadowCustomCandy(candySecondary: string) {
  if (typeof document === "undefined") {
    return;
  }

  document.body.style.setProperty(
    "--shadow-custom-brand",
    `0px 1px 2px #0006, 0px 0px 0px 1px ${candySecondary}, inset 0px .75px 0px #fff3`
  );
}

// Convert HEX to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  return {
    r: Number.parseInt(result[1], 16),
    g: Number.parseInt(result[2], 16),
    b: Number.parseInt(result[3], 16),
  };
}

// Convert RGB to approximate OKLCH (simplified conversion)
function rgbToOklch(
  r: number,
  g: number,
  b: number
): { l: number; c: number; h: number } {
  // Normalize RGB to 0-1
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;

  // Convert to linear RGB
  const toLinear = (v: number) =>
    v <= 0.040_45 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  const rl = toLinear(rn);
  const gl = toLinear(gn);
  const bl = toLinear(bn);

  // Convert to OKLab (simplified)
  const l_ = 0.412_221_470_8 * rl + 0.536_332_536_3 * gl + 0.051_445_992_9 * bl;
  const m_ = 0.211_903_498_2 * rl + 0.680_699_545_1 * gl + 0.107_396_956_6 * bl;
  const s_ = 0.088_302_461_9 * rl + 0.281_718_837_6 * gl + 0.629_978_700_5 * bl;

  const l = Math.cbrt(l_);
  const m = Math.cbrt(m_);
  const s = Math.cbrt(s_);

  const L = 0.210_454_255_3 * l + 0.793_617_785 * m - 0.004_072_046_8 * s;
  const a = 1.977_998_495_1 * l - 2.428_592_205 * m + 0.450_593_709_9 * s;
  const bVal = 0.025_904_037_1 * l + 0.782_771_766_2 * m - 0.808_675_766 * s;

  // Convert to OKLCH
  const c = Math.sqrt(a * a + bVal * bVal);
  let h = Math.atan2(bVal, a) * (180 / Math.PI);
  if (h < 0) h += 360;

  return { l: L, c, h };
}

// Convert any color to oklch format
function toOklch(color: string): string {
  if (color.startsWith("oklch")) {
    return color;
  }

  if (color.startsWith("#")) {
    const rgb = hexToRgb(color);
    if (rgb) {
      const oklch = rgbToOklch(rgb.r, rgb.g, rgb.b);
      return `oklch(${oklch.l.toFixed(2)} ${oklch.c.toFixed(2)} ${oklch.h.toFixed(2)})`;
    }
  }

  // Return as-is if we can't convert
  return color;
}

function generateColorVariations(baseColor: string): ColorVariations {
  // Convert to oklch if needed
  const oklchColor = toOklch(baseColor);

  if (oklchColor.startsWith("oklch")) {
    const lightColor = oklchColor.replace(OKLCH_REGEX, (_match, values) => {
      const parts = values.split(" ");
      const lightness = Math.min(
        Number.parseFloat(parts[0]) + LIGHT_ADJUSTMENT,
        MAX_LIGHTNESS
      );
      const chroma = Math.max(
        Number.parseFloat(parts[1]) - CHROMA_LIGHT_ADJUSTMENT,
        0
      );
      const hue = parts[2];
      return `oklch(${lightness} ${chroma} ${hue})`;
    });

    const lighterColor = oklchColor.replace(OKLCH_REGEX, (_match, values) => {
      const parts = values.split(" ");
      const lightness = Math.min(
        Number.parseFloat(parts[0]) + LIGHTER_ADJUSTMENT,
        MAX_LIGHTNESS
      );
      const chroma = Math.max(
        Number.parseFloat(parts[1]) - CHROMA_LIGHTER_ADJUSTMENT,
        0
      );
      const hue = parts[2];
      return `oklch(${lightness} ${chroma} ${hue})`;
    });

    return { lightColor, lighterColor };
  }

  // Fallback - shouldn't reach here after conversion
  return { lightColor: baseColor, lighterColor: baseColor };
}

export function generateColorPalette(
  primaryColor: string,
  secondaryColor: string
): ColorPalette {
  const primaryVariations = generateColorVariations(primaryColor);
  const secondaryVariations = generateColorVariations(secondaryColor);

  return {
    primary: primaryColor,
    primaryLight: primaryVariations.lightColor,
    primaryLighter: primaryVariations.lighterColor,
    secondary: secondaryColor,
    secondaryLight: secondaryVariations.lightColor,
    secondaryLighter: secondaryVariations.lighterColor,
  };
}

export function applyColorPalette(
  primaryColor: string,
  secondaryColor: string
) {
  if (typeof document === "undefined") {
    return;
  }

  const palette = generateColorPalette(primaryColor, secondaryColor);
  const body = document.body;

  body.style.setProperty("--color-brand", palette.primary);
  body.style.setProperty("--color-fd-primary", palette.primary);
  body.style.setProperty("--color-brand-light", palette.primaryLight);
  body.style.setProperty("--color-brand-lighter", palette.primaryLighter);
  body.style.setProperty("--color-brand-secondary", palette.secondary);
  body.style.setProperty(
    "--color-brand-secondary-light",
    palette.secondaryLight
  );
  body.style.setProperty(
    "--color-brand-secondary-lighter",
    palette.secondaryLighter
  );

  updateShadowCustomCandy(palette.secondary);
}

export function resetColorPalette() {
  if (typeof document === "undefined") {
    return;
  }

  const body = document.body;
  const variablesToRemove = [
    "--color-brand",
    "--color-fd-primary",
    "--color-brand-light",
    "--color-brand-lighter",
    "--color-brand-secondary",
    "--color-brand-secondary-light",
    "--color-brand-secondary-lighter",
    "--shadow-custom-brand",
  ];

  for (const variable of variablesToRemove) {
    body.style.removeProperty(variable);
  }

  const computedSecondary = getComputedStyle(body)
    .getPropertyValue("--color-brand-secondary")
    .trim();

  if (computedSecondary) {
    updateShadowCustomCandy(computedSecondary);
  }
}

export function persistColorPalette(
  primaryColor: string,
  secondaryColor: string
) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    COLOR_STORAGE_KEY,
    JSON.stringify({ candy: primaryColor, candySecondary: secondaryColor })
  );
}
