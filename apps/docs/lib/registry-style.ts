/**
 * Registry style helpers — mirror shadcn's base-* vs radix-* convention.
 *
 * Plain `/r/{name}.json` defaults to the Base twin.
 * Style-aware `/r/{style}/{name}.json` picks Base when `style` starts with
 * `base-`, otherwise Radix (e.g. `radix-nova`, `new-york`).
 */

export type RegistryPrimitiveStyle = "base" | "radix";

/** Styles whose name starts with `base-` (e.g. base-nova) select Base UI. */
export const isBaseStyle = (style: string | null | undefined): boolean =>
  typeof style === "string" && style.toLowerCase().startsWith("base-");

/**
 * Resolve which twin to ship.
 * - No style (plain `/r/{name}.json`) → base (product default)
 * - Explicit `base-*` → base
 * - Anything else → radix
 */
export const resolvePrimitiveStyle = (
  style: string | null | undefined
): RegistryPrimitiveStyle => {
  if (style === null || style === undefined || style === "") {
    return "base";
  }
  return isBaseStyle(style) ? "base" : "radix";
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
