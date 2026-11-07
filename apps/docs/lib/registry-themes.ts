import type { RegistryItem } from "shadcn/schema";

// Installable SmoothUI themes (registry:theme). Each theme maps the SmoothUI
// design tokens (smooth neutral scale + brand accent from the docs theme
// settings) onto the standard shadcn CSS variable names, so `shadcn add`
// injects them into any shadcn project — Radix or Base UI based.
// Palette values are the source of truth for ColorPickerFloatNav.

export interface ThemePalette {
  /**
   * Text on `primary` fills (`accent-foreground`). Dark ink unless white clears
   * 4.5:1. Candy keeps white: about 2.7:1 on the brand pink, a deliberate brand
   * decision that matches `--color-on-brand` in app/smoothui.css.
   */
  accentForeground: string;
  label: string;
  name: string;
  /** Closest shadcn/create preset (catalog enums can't carry exact oklch) */
  presetCode: string;
  primary: string;
  secondary: string;
}

export const THEME_PALETTES: ThemePalette[] = [
  {
    accentForeground: "oklch(1 0 0)",
    label: "Candy",
    name: "candy",
    presetCode: "b3gmgq",
    primary: "oklch(0.72 0.2 352.53)",
    secondary: "oklch(0.66 0.21 354.31)",
  },
  {
    accentForeground: "oklch(0.16 0 0)",
    label: "Indigo",
    name: "indigo",
    presetCode: "b2pzIe",
    primary: "oklch(0.65 0.22 300.21)",
    secondary: "oklch(0.54 0.23 286.53)",
  },
  {
    accentForeground: "oklch(0.16 0 0)",
    label: "Blue",
    name: "blue",
    presetCode: "b1PzeK",
    primary: "oklch(0.67 0.17 257.78)",
    secondary: "oklch(0.59 0.21 258.02)",
  },
  {
    accentForeground: "oklch(0.16 0 0)",
    label: "Red",
    name: "red",
    presetCode: "b4Fywy",
    primary: "oklch(0.67 0.21 24.28)",
    secondary: "oklch(0.62 0.25 28.23)",
  },
  {
    accentForeground: "oklch(0.16 0 0)",
    label: "Orange",
    name: "orange",
    presetCode: "b3PBYm",
    primary: "oklch(0.75 0.17 47.65)",
    secondary: "oklch(0.68 0.21 40.59)",
  },
  {
    accentForeground: "oklch(0.16 0 0)",
    label: "Green",
    name: "green",
    presetCode: "b2YOAa",
    primary: "oklch(0.70 0.15 162.48)",
    secondary: "oklch(0.60 0.13 163.23)",
  },
];

// Perceptually uniform neutral ramp. Must equal the `--color-smooth-*` values
// in app/smoothui.css; lib/__tests__/registry-themes.test.ts enforces it, so
// installed themes render on the same ramp as the docs preview.
export const LIGHT_SCALE = {
  50: "oklch(0.985 0 0)",
  100: "oklch(0.972 0 0)",
  200: "oklch(0.955 0 0)",
  300: "oklch(0.91 0 0)",
  400: "oklch(0.865 0 0)",
  500: "oklch(0.81 0 0)",
  600: "oklch(0.74 0 0)",
  700: "oklch(0.66 0 0)",
  800: "oklch(0.56 0 0)",
  900: "oklch(0.47 0 0)",
  950: "oklch(0.34 0 0)",
  1000: "oklch(0.16 0 0)",
} as const;

export const DARK_SCALE = {
  50: "oklch(0.16 0 0)",
  100: "oklch(0.21 0 0)",
  200: "oklch(0.25 0 0)",
  300: "oklch(0.3 0 0)",
  400: "oklch(0.36 0 0)",
  500: "oklch(0.41 0 0)",
  600: "oklch(0.47 0 0)",
  700: "oklch(0.55 0 0)",
  800: "oklch(0.66 0 0)",
  900: "oklch(0.74 0 0)",
  950: "oklch(0.85 0 0)",
  1000: "oklch(0.96 0 0)",
} as const;

const WHITE = "oklch(1 0 0)";

// Control boundaries: the same 25% foreground edge as `--color-input` in
// app/smoothui.css and the `border-foreground/25` form primitives.
const INPUT = "color-mix(in oklch, var(--foreground) 25%, transparent)";

type Mode = "light" | "dark";

const SCALES = { dark: DARK_SCALE, light: LIGHT_SCALE } as const;

// Neutral roles, identical to the `:root` / `.dark` roles in app/smoothui.css.
// `primary` is SmoothUI's soft neutral surface (the library uses `bg-primary`
// as a light wash), not shadcn's near-black action colour. Cards and popovers
// are white in light mode so they lift off the 0.985 canvas.
const neutralRoles = (mode: Mode): Record<string, string> => {
  const scale = SCALES[mode];
  const surface = mode === "light" ? WHITE : scale[100];
  return {
    background: scale[50],
    // Dividers are decorative (WCAG-exempt); keep them subtle. Control
    // boundaries that need 3:1 live in `input`, not here.
    border: scale[300],
    card: surface,
    "card-foreground": scale[1000],
    foreground: scale[1000],
    input: INPUT,
    muted: scale[200],
    "muted-foreground": scale[950],
    popover: surface,
    "popover-foreground": scale[1000],
    primary: scale[100],
    "primary-foreground": scale[950],
    ring: scale[800],
    secondary: scale[200],
    "secondary-foreground": scale[900],
  };
};

const DESTRUCTIVE = {
  dark: "oklch(0.704 0.191 22.216)",
  light: "oklch(0.577 0.245 27.325)",
} as const;

const paletteRoles = (
  mode: Mode,
  palette: ThemePalette
): Record<string, string> => {
  const scale = SCALES[mode];
  return {
    ...neutralRoles(mode),
    accent: palette.primary,
    "accent-foreground": palette.accentForeground,
    "chart-1": palette.primary,
    "chart-2": palette.secondary,
    "chart-3": scale[800],
    "chart-4": scale[600],
    "chart-5": scale[400],
    destructive: DESTRUCTIVE[mode],
    ring: palette.primary,
    sidebar: scale[100],
    "sidebar-accent": scale[200],
    "sidebar-accent-foreground": scale[900],
    "sidebar-border": scale[400],
    "sidebar-foreground": scale[1000],
    "sidebar-primary": palette.primary,
    "sidebar-primary-foreground": palette.accentForeground,
    "sidebar-ring": palette.primary,
  };
};

const themeItemName = (paletteName: string): string => `theme-${paletteName}`;

const DEFAULT_THEME_NAME = "theme";

export const getAllThemeNames = (): string[] => [
  ...THEME_PALETTES.map((palette) => themeItemName(palette.name)),
  DEFAULT_THEME_NAME,
];

export const getTheme = (itemName: string): RegistryItem | undefined => {
  if (itemName === DEFAULT_THEME_NAME) {
    return {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      author: "Eduardo Calvo <edu@smoothui.dev>",
      cssVars: {
        dark: neutralRoles("dark"),
        light: {
          ...neutralRoles("light"),
          radius: "0.625rem",
        },
        theme: {
          "font-sans": "Inter, sans-serif",
        },
      },
      description:
        "SmoothUI theme: the docs neutrals, white cards on a soft gray canvas, hairline borders, light and dark mode included.",
      name: DEFAULT_THEME_NAME,
      title: "SmoothUI",
      type: "registry:theme",
    };
  }

  const palette = THEME_PALETTES.find(
    (entry) => themeItemName(entry.name) === itemName
  );

  if (!palette) {
    return;
  }

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    author: "Eduardo Calvo <edu@smoothui.dev>",
    cssVars: {
      dark: paletteRoles("dark", palette),
      light: {
        ...paletteRoles("light", palette),
        radius: "0.625rem",
      },
      theme: {
        // SmoothUI brand font; falls back gracefully when Inter isn't loaded.
        "font-sans": "Inter, sans-serif",
      },
    },
    description: `SmoothUI ${palette.label} theme: smooth neutral scale with a ${palette.label.toLowerCase()} accent, light and dark mode included.`,
    name: itemName,
    title: `SmoothUI ${palette.label}`,
    type: "registry:theme",
  };
};
