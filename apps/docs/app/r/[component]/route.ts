import {
  getAllPackageNameMapping,
  getAllPackageNames,
  getPackage,
} from "@docs/lib/package";
import { notFound } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";

interface RegistryParams {
  params: Promise<{ component: string }>;
}

const filteredPackages = ["shadcn-ui", "typescript-config", "patterns"];

export const GET = async (_: NextRequest, { params }: RegistryParams) => {
  const { component } = await params;

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

  try {
    // Get the mapping and find the full path for this short name
    const mapping = await getAllPackageNameMapping();
    const fullPackageName = mapping.get(shortName);

    if (!fullPackageName) {
      notFound();
    }

    const pkg = await getPackage(fullPackageName);

    return NextResponse.json(pkg);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get package", details: error },
      { status: 500 }
    );
  }
};

export const generateStaticParams = async () => {
  const allPackageNames = await getAllPackageNames();

  // Return only the short names for the URL
  return allPackageNames.map((name) => ({
    component: name.split("/").at(-1) || name,
  }));
};
