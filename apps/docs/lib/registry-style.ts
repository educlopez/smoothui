/**
 * Registry style helpers — mirror shadcn's base-* vs radix-* convention.
 *
 * Plain `/r/{name}.json` defaults to the Base twin.
 * Style-aware `/r/{style}/{name}.json` picks Base for `base-*` styles and
 * Radix for the other known styles (`radix-nova`, `new-york`). Unknown
 * styles 404; they are not treated as Radix.
 */

export type RegistryPrimitiveStyle = "base" | "radix";

/** Styles the registry actually serves under `/r/{style}/{name}.json`. */
export const KNOWN_REGISTRY_STYLES = [
  "base-nova",
  "radix-nova",
  "new-york",
] as const;

export type KnownRegistryStyle = (typeof KNOWN_REGISTRY_STYLES)[number];

export const isKnownRegistryStyle = (
  style: string
): style is KnownRegistryStyle =>
  (KNOWN_REGISTRY_STYLES as readonly string[]).includes(style);

/** Styles whose name starts with `base-` (e.g. base-nova) select Base UI. */
export const isBaseStyle = (style: string | null | undefined): boolean =>
  typeof style === "string" && style.toLowerCase().startsWith("base-");

/**
 * Resolve which twin to ship.
 * - No style (plain `/r/{name}.json`) → base (product default)
 * - Explicit `base-*` → base
 * - Known non-base styles (`radix-nova`, `new-york`) → radix
 */
export const resolvePrimitiveStyle = (
  style: string | null | undefined
): RegistryPrimitiveStyle => {
  if (style === null || style === undefined || style === "") {
    return "base";
  }
  return isBaseStyle(style) ? "base" : "radix";
};

const REGISTRY_ORIGIN = "https://smoothui.dev/r";

/** Shared items that have no style twin — always the flat URL. */
const STYLELESS_REGISTRY_ITEMS = new Set(["data", "tokens"]);

/**
 * Registry dependency URL for a package short name.
 * Component deps follow the request style (`/r/{style}/{dep}.json`).
 * `data` and `tokens` stay on the flat `/r/{name}.json` URL.
 */
export const registryDependencyUrl = (
  name: string,
  style?: string | null
): string => {
  if (
    STYLELESS_REGISTRY_ITEMS.has(name) ||
    style === null ||
    style === undefined ||
    style === ""
  ) {
    return `${REGISTRY_ORIGIN}/${name}.json`;
  }

  return `${REGISTRY_ORIGIN}/${style}/${name}.json`;
};

/** Twin source file for a package slug, e.g. checkbox.base.tsx */
export const twinFileName = (
  slug: string,
  primitiveStyle: RegistryPrimitiveStyle
): string => `${slug}.${primitiveStyle}.tsx`;

/** Detect whether a package dir uses the dual-primitive layout. */
export const isDualPrimitivePackage = (fileNames: string[]): boolean => {
  const hasBase = fileNames.some((name) => name.endsWith(".base.tsx"));
  const hasRadix = fileNames.some((name) => name.endsWith(".radix.tsx"));
  return hasBase && hasRadix;
};
