import { getBlockCatalog } from "@docs/lib/component-catalog";
import type {
  BlockListResponse,
  BlockMeta,
  BlockType,
} from "@smoothui/data";
import type { NextRequest } from "next/server";
import { jsonResponse } from "../_shared";

export { OPTIONS } from "../_shared";

export const revalidate = false;

const VALID_BLOCK_TYPES: ReadonlySet<string> = new Set<BlockType>([
  "hero",
  "features",
  "pricing",
  "testimonials",
  "cta",
  "footer",
  "header",
  "other",
]);

const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 100;

export const GET = async (request: NextRequest): Promise<Response> => {
  const { searchParams } = request.nextUrl;

  const blockType = searchParams.get("blockType");
  const tag = searchParams.get("tag");
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, Number(searchParams.get("pageSize") ?? String(DEFAULT_PAGE_SIZE)))
  );

  let blocks: BlockMeta[] = await getBlockCatalog();

  // Apply filters
  if (blockType && VALID_BLOCK_TYPES.has(blockType)) {
    blocks = blocks.filter((b) => b.blockType === blockType);
  }

  if (tag) {
    const lowerTag = tag.toLowerCase();
    blocks = blocks.filter((b) =>
      b.tags.some((t) => t.toLowerCase() === lowerTag)
    );
  }

  // Paginate
  const total = blocks.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const data = blocks.slice(start, start + pageSize);

  const response: BlockListResponse = {
    data,
    total,
    page,
    pageSize,
    totalPages,
  };

  return jsonResponse(response);
};
