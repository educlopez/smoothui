import { resolveRegistryName } from "@docs/lib/legacy-registry";
import { getAllPackageNameMapping, getPackage } from "@docs/lib/package";
import { isKnownRegistryStyle } from "@docs/lib/registry-style";
import { NextResponse } from "next/server";

const FILTERED_PACKAGES = new Set([
  "shadcn-ui",
  "typescript-config",
  "patterns",
]);

const notFoundJson = () =>
  NextResponse.json({ error: "Package not found" }, { status: 404 });

/**
 * Resolve a registry short name (including v4 aliases) to a package payload.
 * Unknown names return 404 JSON, never 500.
 */
export const getRegistryPackageResponse = async (
  shortName: string,
  style: string | null
): Promise<NextResponse> => {
  if (style !== null && style !== "" && !isKnownRegistryStyle(style)) {
    return notFoundJson();
  }

  const canonicalName = resolveRegistryName(shortName);

  if (FILTERED_PACKAGES.has(canonicalName) || canonicalName === "index") {
    return notFoundJson();
  }

  const mapping = await getAllPackageNameMapping();
  const fullPackageName = mapping.get(canonicalName);

  if (!fullPackageName) {
    return notFoundJson();
  }

  try {
    const pkg = await getPackage(fullPackageName, style);
    return NextResponse.json(pkg);
  } catch (error) {
    return NextResponse.json(
      { details: error, error: "Failed to get package" },
      { status: 500 }
    );
  }
};
