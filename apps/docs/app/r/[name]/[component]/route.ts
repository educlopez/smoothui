import { LEGACY_REGISTRY_NAMES } from "@docs/lib/legacy-registry";
import { getAllPackageNames } from "@docs/lib/package";
import { getRegistryPackageResponse } from "@docs/lib/registry-response";
import { SKILL_ITEM_NAME } from "@docs/lib/registry-skill";
import {
  isKnownRegistryStyle,
  PRERENDERED_REGISTRY_STYLES,
} from "@docs/lib/registry-style";
import { TOKENS_ITEM_NAME } from "@docs/lib/registry-tokens";
import { type NextRequest, NextResponse } from "next/server";

interface StyleRegistryParams {
  /** First segment is the consumer `style` (e.g. base-nova); shares the
   *  `[name]` folder with the plain `/r/{name}.json` route. */
  params: Promise<{ name: string; component: string }>;
}

/**
 * Style-aware registry: `/r/{style}/{name}.json`
 * `base-*` → Base UI twin; `radix-*`, `aria-*`, `default`, `new-york` → Radix.
 * Anything else 404.
 */
export const GET = async (_: NextRequest, { params }: StyleRegistryParams) => {
  const { name: style, component } = await params;

  if (!isKnownRegistryStyle(style)) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  if (!component.endsWith(".json")) {
    return NextResponse.json(
      { error: "Component must end with .json" },
      { status: 400 }
    );
  }

  const shortName = component.replace(".json", "");

  // Themes / skill / tokens stay on the flat URL — no style variants.
  if (
    shortName === SKILL_ITEM_NAME ||
    shortName === TOKENS_ITEM_NAME ||
    shortName.startsWith("theme-")
  ) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  return getRegistryPackageResponse(shortName, style);
};

export const generateStaticParams = async () => {
  const allPackageNames = await getAllPackageNames();
  const styles = PRERENDERED_REGISTRY_STYLES;
  const names = [
    ...allPackageNames.map(
      (packageName) => packageName.split("/").at(-1) || packageName
    ),
    ...LEGACY_REGISTRY_NAMES,
  ];

  return styles.flatMap((style) =>
    names.map((component) => ({
      component,
      name: style,
    }))
  );
};
