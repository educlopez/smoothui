import {
  getAllPackageNameMapping,
  getAllPackageNames,
  getPackage,
} from "@docs/lib/package";
import { SKILL_ITEM_NAME } from "@docs/lib/registry-skill";
import { TOKENS_ITEM_NAME } from "@docs/lib/registry-tokens";
import { notFound } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";

interface StyleRegistryParams {
  /** First segment is the consumer `style` (e.g. base-nova); shares the
   *  `[name]` folder with the plain `/r/{name}.json` route. */
  params: Promise<{ name: string; component: string }>;
}

const filteredPackages = ["shadcn-ui", "typescript-config", "patterns"];

/**
 * Style-aware registry: `/r/{style}/{name}.json`
 * `base-*` → Base UI twin; anything else → Radix twin.
 */
export const GET = async (_: NextRequest, { params }: StyleRegistryParams) => {
  const { name: style, component } = await params;

  if (!component.endsWith(".json")) {
    return NextResponse.json(
      { error: "Component must end with .json" },
      { status: 400 }
    );
  }

  const shortName = component.replace(".json", "");

  if (filteredPackages.includes(shortName)) {
    notFound();
  }

  // Themes / skill / tokens stay on the flat URL — no style variants.
  if (
    shortName === SKILL_ITEM_NAME ||
    shortName === TOKENS_ITEM_NAME ||
    shortName.startsWith("theme-")
  ) {
    notFound();
  }

  try {
    const mapping = await getAllPackageNameMapping();
    const fullPackageName = mapping.get(shortName);

    if (!fullPackageName) {
      notFound();
    }

    const pkg = await getPackage(fullPackageName, style);

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
  const styles = ["base-nova", "radix-nova", "new-york"];

  return styles.flatMap((style) =>
    allPackageNames.map((packageName) => ({
      component: packageName.split("/").at(-1) || packageName,
      name: style,
    }))
  );
};
