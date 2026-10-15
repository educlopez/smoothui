import { LEGACY_REGISTRY_NAMES } from "@docs/lib/legacy-registry";
import { getAllPackageNames } from "@docs/lib/package";
import { getRegistryPackageResponse } from "@docs/lib/registry-response";
import { getSkill, SKILL_ITEM_NAME } from "@docs/lib/registry-skill";
import { getAllThemeNames, getTheme } from "@docs/lib/registry-themes";
import { getTokensItem, TOKENS_ITEM_NAME } from "@docs/lib/registry-tokens";
import { getCustomTheme } from "@docs/lib/studio-preset";
import { type NextRequest, NextResponse } from "next/server";

interface RegistryParams {
  params: Promise<{ name: string }>;
}

const filteredPackages = ["shadcn-ui", "typescript-config", "patterns"];

/**
 * Plain `/r/{name}.json` — Base twin for dual primitives (product default).
 * Style-aware installs use `/r/{style}/{name}.json` (nested under the same
 * `[name]` segment so Next does not see conflicting dynamic slug names).
 */
export const GET = async (_: NextRequest, { params }: RegistryParams) => {
  const { name } = await params;

  if (!name.endsWith(".json")) {
    return NextResponse.json(
      { error: "Component must end with .json" },
      { status: 400 }
    );
  }

  const shortName = name.replace(".json", "");

  if (filteredPackages.includes(shortName)) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  const theme = getTheme(shortName);

  if (theme) {
    return NextResponse.json(theme);
  }

  const customTheme = getCustomTheme(shortName);

  if (customTheme) {
    return NextResponse.json(customTheme);
  }

  if (shortName === SKILL_ITEM_NAME) {
    return NextResponse.json(await getSkill());
  }

  if (shortName === TOKENS_ITEM_NAME) {
    return NextResponse.json(getTokensItem());
  }

  // Plain URL → Base (product default). Pass null so resolvePrimitiveStyle → base.
  return getRegistryPackageResponse(shortName, null);
};

export const generateStaticParams = async () => {
  const allPackageNames = await getAllPackageNames();

  return [
    ...allPackageNames.map((packageName) => ({
      name: packageName.split("/").at(-1) || packageName,
    })),
    ...LEGACY_REGISTRY_NAMES.map((name) => ({ name })),
    ...getAllThemeNames().map((themeName) => ({ name: themeName })),
    { name: SKILL_ITEM_NAME },
  ];
};
