import { getBlockCatalog } from "@docs/lib/component-catalog";
import { getAllPackageNameMapping, getPackage } from "@docs/lib/package";
import type { BlockDetailResponse } from "@smoothui/data";
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

  const catalog = await getBlockCatalog();
  const block = catalog.find((b) => b.name === name);

  if (!block) {
    return errorResponse(`Block "${name}" not found`, 404);
  }

  const response: BlockDetailResponse = { block };

  if (includeSource) {
    try {
      const mapping = await getAllPackageNameMapping();
      const fullPackageName = mapping.get(name);

      if (fullPackageName) {
        const pkg = await getPackage(fullPackageName);
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
  const catalog = await getBlockCatalog();
  return catalog.map((b) => ({ name: b.name }));
};
