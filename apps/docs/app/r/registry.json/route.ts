import { getAllPackageNames, getPackage } from "@docs/lib/package";
import { getSkill } from "@docs/lib/registry-skill";
import { getAllThemeNames, getTheme } from "@docs/lib/registry-themes";
import { NextResponse } from "next/server";
import type { Registry } from "shadcn/schema";

// Build at deploy time only — registry only changes on deploy
export const dynamic = "force-static";
export const revalidate = false;

export const GET = async () => {
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

  for (const themeName of getAllThemeNames()) {
    const theme = getTheme(themeName);

    if (theme) {
      response.items.push(theme);
    }
  }

  response.items.push(await getSkill());

  return NextResponse.json(response);
};
