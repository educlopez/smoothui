import { getAllPackageNames, getPackage } from "@docs/lib/package";
import { type NextRequest, NextResponse } from "next/server";
import type { Registry } from "shadcn/schema";

export const GET = async (_: NextRequest) => {
  const response: Registry = {
    name: "SmoothUI Registry",
    homepage: "https://smoothui.dev/",
    items: [],
  };

  const allPackageNames = await getAllPackageNames();

  for (const name of allPackageNames) {
    try {
      const pkg = await getPackage(name);

      // Skip packages without any files or CSS
      if (
        (!pkg.files || pkg.files.length === 0) &&
        (!pkg.css || Object.keys(pkg.css).length === 0)
      ) {
        continue;
      }

      response.items.push(pkg);
    } catch {
      // skip packages that fail
    }
  }

  return NextResponse.json(response);
};
