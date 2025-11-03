import { readdir } from "node:fs/promises";
import { join } from "node:path";

import { type NextRequest, NextResponse } from "next/server";
import type { Registry } from "shadcn/schema";
import { getPackage } from "../../../lib/package";

const filteredPackages = ["shadcn-ui", "typescript-config", "patterns"];

export const GET = async (_: NextRequest) => {
  const response: Registry = {
    name: "SmoothUI Registry",
    homepage: "https://smoothui.dev/",
    items: [],
  };

  const packagesDir = join(process.cwd(), "..", "..", "packages");
  const packageDirectories = await readdir(packagesDir, {
    withFileTypes: true,
  });

  const packageNames = packageDirectories
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .filter((name) => !filteredPackages.includes(name));

  for (const name of packageNames) {
    try {
      const pkg = await getPackage(name);

      response.items.push(pkg);
    } catch {
      // skip packages that fail
    }
  }

  return NextResponse.json(response);
};
