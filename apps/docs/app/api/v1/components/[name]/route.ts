import { getComponentCatalog } from "@docs/lib/component-catalog";
import { getAllPackageNameMapping, getPackage } from "@docs/lib/package";
import type { ComponentDetailResponse } from "@smoothui/data";
import type { NextRequest } from "next/server";
import { errorResponse, jsonResponse } from "../../_shared";

export { OPTIONS } from "../../_shared";

export const revalidate = false;

interface RouteParams {
  params: Promise<{ name: string }>;
}

export const GET = async (
  request: NextRequest,
  { params }: RouteParams
): Promise<Response> => {
  const { name } = await params;
  const { searchParams } = request.nextUrl;
  const includeSource = searchParams.get("include") === "source";

  const catalog = await getComponentCatalog();
  const component = catalog.find((c) => c.name === name);

  if (!component) {
    return errorResponse(`Component "${name}" not found`, 404);
  }

  const response: ComponentDetailResponse = { component };

  if (includeSource) {
    try {
      const mapping = await getAllPackageNameMapping();
      const fullPackageName = mapping.get(name);

      if (fullPackageName) {
        const pkg = await getPackage(fullPackageName);
        // Combine all file contents into a single source string
        const source = pkg.files
          ?.map((f) => `// --- ${f.path} ---\n${f.content ?? ""}`)
          .join("\n\n");

        if (source) {
          response.source = source;
        }
      }
    } catch {
      // Source retrieval is best-effort; omit on failure
    }
  }

  return jsonResponse(response);
};

export const generateStaticParams = async (): Promise<{ name: string }[]> => {
  const catalog = await getComponentCatalog();
  return catalog.map((c) => ({ name: c.name }));
};
