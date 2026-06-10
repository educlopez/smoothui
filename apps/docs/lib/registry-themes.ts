import type { RegistryItem } from "shadcn/schema";

// Installable SmoothUI themes (registry:theme). Each theme maps the SmoothUI
// design tokens (smooth neutral scale + brand accent from the docs color
// picker) onto the standard shadcn CSS variable names, so `shadcn add`
// injects them into any shadcn project — Radix or Base UI based.
// Palette values mirror PALETTES in components/color-picker-float-nav.tsx
// and the scales in app/smoothui.css.

export interface ThemePalette {
  label: string;
  name: string;
  primary: string;
  secondary: string;
}

export const THEME_PALETTES: ThemePalette[] = [
  {
    name: "candy",
    label: "Candy",
    primary: "oklch(0.72 0.2 352.53)",
    secondary: "oklch(0.66 0.21 354.31)",
  },
  {
    name: "indigo",
    label: "Indigo",
    primary: "oklch(0.65 0.22 300.21)",
    secondary: "oklch(0.54 0.23 286.53)",
  },
  {
    name: "blue",
    label: "Blue",
    primary: "oklch(0.67 0.17 257.78)",
    secondary: "oklch(0.59 0.21 258.02)",
  },
  {
    name: "red",
    label: "Red",
    primary: "oklch(0.67 0.21 24.28)",
    secondary: "oklch(0.62 0.25 28.23)",
  },
  {
    name: "orange",
    label: "Orange",
    primary: "oklch(0.75 0.17 47.65)",
    secondary: "oklch(0.68 0.21 40.59)",
  },
  {
    name: "green",
    label: "Green",
    primary: "oklch(0.70 0.15 162.48)",
    secondary: "oklch(0.60 0.13 163.23)",
  },
];

const LIGHT_SCALE = {
  50: "oklch(0.99 0 0)",
  100: "oklch(0.98 0 0)",
  200: "oklch(0.96 0 0)",
  400: "oklch(0.93 0 0)",
  500: "oklch(0.91 0 0)",
  600: "oklch(0.89 0 0)",
  800: "oklch(0.65 0 0)",
  900: "oklch(0.62 0 0)",
  950: "oklch(0.54 0 0)",
  1000: "oklch(0.2 0 0)",
} as const;

const DARK_SCALE = {
  50: "oklch(0.2002 0 0)",
  100: "oklch(0.2264 0 0)",
  200: "oklch(0.2562 0 0)",
  400: "oklch(0.3012 0 0)",
  500: "oklch(0.325 0 0)",
  600: "oklch(0.3639 0 0)",
  700: "oklch(0.4313 0 0)",
  800: "oklch(0.5452 0 0)",
  900: "oklch(0.5931 0 0)",
  950: "oklch(0.7058 0 0)",
  1000: "oklch(0.9461 0 0)",
} as const;

const WHITE = "oklch(1 0 0)";

const buildModeVars = (
  scale: typeof LIGHT_SCALE | typeof DARK_SCALE,
  primary: string,
  secondary: string,
  input: string,
  destructive: string
): Record<string, string> => ({
  background: scale[50],
  foreground: scale[1000],
  card: scale[50],
  "card-foreground": scale[1000],
  popover: scale[50],
  "popover-foreground": scale[1000],
  primary: scale[100],
  "primary-foreground": scale[950],
  secondary: scale[200],
  "secondary-foreground": scale[900],
  muted: scale[200],
  "muted-foreground": scale[800],
  accent: primary,
  "accent-foreground": WHITE,
  destructive,
  border: scale[500],
  input,
  ring: primary,
  "chart-1": primary,
  "chart-2": secondary,
  "chart-3": scale[800],
  "chart-4": scale[600],
  "chart-5": scale[400],
  sidebar: scale[100],
  "sidebar-foreground": scale[1000],
  "sidebar-primary": primary,
  "sidebar-primary-foreground": WHITE,
  "sidebar-accent": scale[200],
  "sidebar-accent-foreground": scale[900],
  "sidebar-border": scale[400],
  "sidebar-ring": primary,
});

const themeItemName = (paletteName: string): string => `theme-${paletteName}`;

export const getAllThemeNames = (): string[] =>
  THEME_PALETTES.map((palette) => themeItemName(palette.name));

export const getTheme = (itemName: string): RegistryItem | undefined => {
  const palette = THEME_PALETTES.find(
    (entry) => themeItemName(entry.name) === itemName
  );

  if (!palette) {
    return;
  }

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: itemName,
    type: "registry:theme",
    title: `SmoothUI ${palette.label}`,
    description: `SmoothUI ${palette.label} theme: smooth neutral scale with a ${palette.label.toLowerCase()} accent, light and dark mode included.`,
    author: "Eduardo Calvo <educlopez93@gmail.com>",
    cssVars: {
      theme: {
        // SmoothUI brand font; falls back gracefully when Inter isn't loaded.
        "font-sans": "Inter, sans-serif",
      },
      light: {
        ...buildModeVars(
          LIGHT_SCALE,
          palette.primary,
          palette.secondary,
          LIGHT_SCALE[600],
          "oklch(0.577 0.245 27.325)"
        ),
        radius: "0.625rem",
      },
      dark: buildModeVars(
        DARK_SCALE,
        palette.primary,
        palette.secondary,
        DARK_SCALE[700],
        "oklch(0.704 0.191 22.216)"
      ),
    },
  };
};
