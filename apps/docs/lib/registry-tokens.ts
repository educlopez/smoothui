import type { RegistryItem } from "shadcn/schema";
import { DARK_SCALE, LIGHT_SCALE } from "./registry-themes";

// The SmoothUI design tokens that components and blocks reach for but that no
// shadcn project has: `brand`, the `smooth-*` neutral ramp, and the DS button
// colour families. They live only in apps/docs/app/smoothui.css, which never
// travels with an install, so 36 shipped items were quietly rendering with
// undefined colours in anyone else's project.
//
// Shipped as one shared item that the affected items depend on, rather than
// inlined into each of the 36, so there is a single definition to keep honest.
//
// `brand` stays SmoothUI pink instead of following the host theme on purpose:
// there is no variable that means "accent" in both worlds. Stock shadcn puts the
// action colour in `--primary` (oklch(0.205 0 0), near-black) and uses `--accent`
// as a hover surface; the SmoothUI themes in registry-themes.ts invert that,
// parking the accent in `--accent`/`--ring` and leaving `--primary` a soft
// neutral. Mapping to either one renders near-white for half the audience. So the
// literal ships as the default and `--brand` is the one-line override.

export const TOKENS_ITEM_NAME = "tokens";

/** Same in light and dark, so a single `@theme` entry carries them. */
const CONSTANT_TOKENS: Record<string, string> = {
  brand: "oklch(0.72 0.2 352.53)",
  "brand-light": "oklch(0.78 0.15 352.53)",
  "brand-lighter": "oklch(0.85 0.1 352.53)",
  "brand-secondary": "oklch(0.66 0.21 354.31)",
  // Button drop shadow and inner sheen.
  "btn-drop": "rgb(0 0 0 / 0.4)",
  "btn-sheen": "rgb(255 255 255 / 0.2)",
  "destructive-edge": "#f61418",
  "destructive-fg": "#fff",
  "destructive-hover":
    "color-mix(in oklab, var(--color-destructive) 85%, black)",
  "destructive-top": "#fd4b4e",
  // Foreground on brand and destructive fills. White on the brand pink is about
  // 3:1 and is a deliberate brand decision, so the value is pinned.
  "on-brand": "#fff",
};

const SMOOTH_STEPS = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000,
] as const;

/** Flip between modes, so they need a `:root` / `.dark` pair. */
const MODE_TOKENS: Record<string, { dark: string; light: string }> = {
  amber: { dark: "oklch(0.8 0.15 75)", light: "oklch(0.77 0.16 75)" },
  "amber-fg": { dark: "oklch(0.2 0 0)", light: LIGHT_SCALE[1000] },
  "amber-hover": { dark: "oklch(0.85 0.14 72)", light: "oklch(0.71 0.17 70)" },
  blue: { dark: "oklch(0.66 0.18 256)", light: "oklch(0.62 0.19 256)" },
  "blue-fg": { dark: "#fff", light: "#fff" },
  "blue-hover": { dark: "oklch(0.72 0.16 256)", light: "oklch(0.56 0.2 256)" },
  green: { dark: "oklch(0.73 0.16 152)", light: "oklch(0.7 0.17 152)" },
  "green-fg": { dark: "oklch(0.2 0 0)", light: "#fff" },
  "green-hover": {
    dark: "oklch(0.79 0.15 152)",
    light: "oklch(0.64 0.18 152)",
  },
  // Switch and slider thumb surface.
  thumb: { dark: "#fff", light: "#fff" },
  ...Object.fromEntries(
    SMOOTH_STEPS.map((step) => [
      `smooth-${step}`,
      { dark: DARK_SCALE[step], light: LIGHT_SCALE[step] },
    ])
  ),
};

/**
 * Shared utilities this item ships in its `css` field, so a single installed
 * primitive carries them too. Mirrors the `@utility` blocks in smoothui.css.
 * `focus-ring` is the 3px ring at 80% (3:1 non-text contrast);
 * `hit-area` grows a sub-40px control to a 40px target on coarse pointers;
 * `state-transition` is the shared control transition.
 */
export const SHARED_UTILITIES: Record<string, Record<string, unknown>> = {
  "focus-ring": {
    "&:focus-visible": { "@apply ring-[3px] ring-ring/80": {} },
  },
  "focus-ring-within": {
    "&:has(:focus-visible)": { "@apply ring-[3px] ring-ring/80": {} },
  },
  "hit-area": {
    "&::after": {
      "@apply pointer-coarse:absolute pointer-coarse:top-1/2 pointer-coarse:left-1/2 pointer-coarse:size-full pointer-coarse:min-h-10 pointer-coarse:min-w-10 pointer-coarse:-translate-1/2 pointer-coarse:content-['']":
        {},
    },
  },
  "state-transition": {
    "@apply transition-[background-color,border-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none":
      {},
  },
};

/** Every token this item declares — used by the CI coverage check. */
export const DECLARED_TOKENS: string[] = [
  ...Object.keys(CONSTANT_TOKENS),
  ...Object.keys(MODE_TOKENS),
];

// Tailwind utility prefixes that take a colour token, so `bg-brand` and
// `from-smooth-200` count as usage just as much as a raw `var(--color-brand)`.
const UTILITY_PREFIXES = [
  "accent",
  "bg",
  "border",
  "caret",
  "decoration",
  "divide",
  "fill",
  "from",
  "outline",
  "ring",
  "shadow",
  "stroke",
  "text",
  "to",
  "via",
];

const tokenUsageRegex = (token: string): RegExp =>
  new RegExp(
    `var\\(\\s*--color-${token}\\s*[,)]|(?<![\\w-])(?:${UTILITY_PREFIXES.join("|")})-${token}(?![\\w-])`
  );

// Longest first so `brand-secondary` is not reported as `brand`.
const TOKENS_BY_SPECIFICITY = [...DECLARED_TOKENS].sort(
  (a, b) => b.length - a.length
);

const utilityUsageRegex = (name: string): RegExp =>
  new RegExp(`(?<![\\w-])${name}(?![\\w-])`);

/**
 * Tokens and shared utilities from this item that the given source content
 * actually references. Utilities count, so a primitive that only uses
 * `focus-ring` still pulls the item in.
 */
export const collectUsedTokens = (content: string): string[] => [
  ...TOKENS_BY_SPECIFICITY.filter((token) =>
    tokenUsageRegex(token).test(content)
  ),
  ...Object.keys(SHARED_UTILITIES).filter((name) =>
    utilityUsageRegex(name).test(content)
  ),
];

export const getTokensItem = (): RegistryItem => {
  const theme: Record<string, string> = {};

  // `var(--brand, <literal>)` so defining `--brand` anywhere retints every
  // SmoothUI component at once, without touching the installed files.
  for (const [token, value] of Object.entries(CONSTANT_TOKENS)) {
    theme[`color-${token}`] = `var(--${token}, ${value})`;
  }

  // Tailwind v4 needs the utility registered in `@theme` even when the value
  // itself has to change per mode, hence the indirection through the raw var
  // that `light` and `dark` below define.
  const light: Record<string, string> = {};
  const dark: Record<string, string> = {};

  for (const [token, values] of Object.entries(MODE_TOKENS)) {
    theme[`color-${token}`] = `var(--${token})`;
    light[token] = values.light;
    dark[token] = values.dark;
  }

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    author: "Eduardo Calvo <educlopez93@gmail.com>",
    css: Object.fromEntries(
      Object.entries(SHARED_UTILITIES).map(([name, rules]) => [
        `@utility ${name}`,
        rules,
      ])
    ) as RegistryItem["css"],
    cssVars: { dark, light, theme },
    description:
      "SmoothUI design tokens and shared utilities: the brand accent, the smooth neutral ramp, the button colour families, the focus ring and the state transition that SmoothUI components and blocks reference. Override the accent by defining --brand.",
    name: TOKENS_ITEM_NAME,
    title: "SmoothUI Tokens",
    type: "registry:theme",
  };
};
