import { getComponentCatalog } from "@docs/lib/component-catalog";
import type {
  AnimationType,
  Complexity,
  ComponentCategory,
  ComponentListResponse,
  ComponentMeta,
} from "@smoothui/data";
import type { NextRequest } from "next/server";
import { jsonResponse } from "../_shared";

export { OPTIONS } from "../_shared";

export const revalidate = false;

const VALID_CATEGORIES: ReadonlySet<string> = new Set<ComponentCategory>([
  "basic-ui",
  "button",
  "text",
  "ai",
  "layout",
  "feedback",
  "data-display",
  "navigation",
  "other",
]);

const VALID_COMPLEXITIES: ReadonlySet<string> = new Set<Complexity>([
  "simple",
  "moderate",
  "complex",
]);

const VALID_ANIMATION_TYPES: ReadonlySet<string> = new Set<AnimationType>([
  "spring",
  "tween",
  "gesture",
  "scroll",
  "none",
]);

const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 100;

export const GET = async (request: NextRequest): Promise<Response> => {
  const { searchParams } = request.nextUrl;

  const category = searchParams.get("category");
  const complexity = searchParams.get("complexity");
  const animationType = searchParams.get("animationType");
  const tag = searchParams.get("tag");
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(
      1,
      Number(searchParams.get("pageSize") ?? String(DEFAULT_PAGE_SIZE))
    )
  );

  let components: ComponentMeta[] = await getComponentCatalog();

  // Apply filters
  if (category && VALID_CATEGORIES.has(category)) {
    components = components.filter((c) => c.category === category);
  }

  if (complexity && VALID_COMPLEXITIES.has(complexity)) {
    components = components.filter((c) => c.complexity === complexity);
  }

  if (animationType && VALID_ANIMATION_TYPES.has(animationType)) {
    components = components.filter((c) => c.animationType === animationType);
  }

  if (tag) {
    const lowerTag = tag.toLowerCase();
    components = components.filter((c) =>
      c.tags.some((t) => t.toLowerCase() === lowerTag)
    );
  }

  // Paginate
  const total = components.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const data = components.slice(start, start + pageSize);

  const response: ComponentListResponse = {
    data,
    total,
    page,
    pageSize,
    totalPages,
  };

  return jsonResponse(response);
};
