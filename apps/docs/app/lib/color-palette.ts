const OKLCH_REGEX = /oklch\(([^)]+)\)/;
const MAX_LIGHTNESS = 1.0;
const LIGHT_ADJUSTMENT = 0.1;
const LIGHTER_ADJUSTMENT = 0.2;
const CHROMA_LIGHT_ADJUSTMENT = 0.05;
const CHROMA_LIGHTER_ADJUSTMENT = 0.1;
const OPACITY_LIGHT = 0.7;
const OPACITY_LIGHTER = 0.5;

export const COLOR_STORAGE_KEY = "smoothui-colors";

type ColorVariations = {
  lightColor: string;
  lighterColor: string;
};

type ColorPalette = {
  primary: string;
  primaryLight: string;
  primaryLighter: string;
  secondary: string;
  secondaryLight: string;
  secondaryLighter: string;
};

function updateShadowCustomCandy(candySecondary: string) {
  if (typeof document === "undefined") {
    return;
  }

  document.body.style.setProperty(
    "--shadow-custom-brand",
    `0px 1px 2px #0006, 0px 0px 0px 1px ${candySecondary}, inset 0px .75px 0px #fff3`
  );
}

function generateColorVariations(baseColor: string): ColorVariations {
  if (baseColor.startsWith("oklch")) {
    const lightColor = baseColor.replace(OKLCH_REGEX, (_match, values) => {
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

    const lighterColor = baseColor.replace(OKLCH_REGEX, (_match, values) => {
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

  const lightColor = baseColor
    .replace(")", ` / ${OPACITY_LIGHT})`)
    .replace("oklch", "oklch");
  const lighterColor = baseColor
    .replace(")", ` / ${OPACITY_LIGHTER})`)
    .replace("oklch", "oklch");

  return { lightColor, lighterColor };
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
  body.style.setProperty("--color-brand-secondary-light", palette.secondaryLight);
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


