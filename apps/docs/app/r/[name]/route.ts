import {
  getAllPackageNameMapping,
  getAllPackageNames,
  getPackage,
} from "@docs/lib/package";
import { getSkill, SKILL_ITEM_NAME } from "@docs/lib/registry-skill";
import { getAllThemeNames, getTheme } from "@docs/lib/registry-themes";
import { getTokensItem, TOKENS_ITEM_NAME } from "@docs/lib/registry-tokens";
import { getCustomTheme } from "@docs/lib/studio-preset";
import { notFound } from "next/navigation";
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
    notFound();
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

  try {
    const mapping = await getAllPackageNameMapping();
    const fullPackageName = mapping.get(shortName);

    if (!fullPackageName) {
      notFound();
    }

    // Plain URL → Base (product default). Pass null so resolvePrimitiveStyle → base.
    const pkg = await getPackage(fullPackageName, null);

    return NextResponse.json(pkg);
  } catch (error) {
    return NextResponse.json(
      { details: error, error: "Failed to get package" },
      { status: 500 }
    );
  }
};

export const generateStaticParams = async () => {
  const allPackageNames = await getAllPackageNames();

  return [
    ...allPackageNames.map((packageName) => ({
      name: packageName.split("/").at(-1) || packageName,
    })),
    ...getAllThemeNames().map((themeName) => ({ name: themeName })),
    { name: SKILL_ITEM_NAME },
  ];
};
