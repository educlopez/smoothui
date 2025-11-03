import { notFound } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";
import { getAllPackageNames, getPackage } from "../../../lib/package";

type RegistryParams = {
  params: Promise<{ component: string }>;
};

const filteredPackages = ["shadcn-ui", "typescript-config", "patterns"];

export const GET = async (_: NextRequest, { params }: RegistryParams) => {
  const { component } = await params;

  if (!component.endsWith(".json")) {
    return NextResponse.json(
      { error: "Component must end with .json" },
      { status: 400 }
    );
  }

  const packageName = component.replace(".json", "");

  if (filteredPackages.includes(packageName)) {
    notFound();
  }

  try {
    const pkg = await getPackage(packageName);

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

  return allPackageNames.map((name) => ({ component: name }));
};
