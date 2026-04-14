import { getComponentCatalog } from "@docs/lib/component-catalog";
import type { ComponentCategory, ComponentMeta } from "@smoothui/data";
import type { NextRequest } from "next/server";
import { errorResponse, jsonResponse } from "../../_shared";

export { OPTIONS } from "../../_shared";

export const dynamic = "force-dynamic";

/**
 * Simple keyword-based relevance scoring.
 *
 * Matches the query against name, displayName, description, tags, and useCases.
 * Returns 0 if nothing matches (component should be filtered out).
 */
const scoreComponent = (component: ComponentMeta, query: string): number => {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) {
    return 0;
  }

  let score = 0;

  for (const term of terms) {
    // Exact name match is highest signal
    if (
      component.name === term ||
      component.displayName.toLowerCase() === term
    ) {
      score += 10;
    } else if (component.name.includes(term)) {
      score += 6;
    }

    // Tags — high relevance
    if (component.tags.some((t) => t.toLowerCase() === term)) {
      score += 5;
    } else if (component.tags.some((t) => t.toLowerCase().includes(term))) {
      score += 3;
    }

    // Use cases
    if (component.useCases.some((u) => u.toLowerCase().includes(term))) {
      score += 4;
    }

    // Description
    if (component.description.toLowerCase().includes(term)) {
      score += 2;
    }

    // Category
    if (component.category.includes(term)) {
      score += 2;
    }

    // Composition hints
    if (
      component.compositionHints.some((h) => h.toLowerCase().includes(term))
    ) {
      score += 1;
    }
  }

  return score;
};

export const GET = async (request: NextRequest): Promise<Response> => {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q")?.trim() ?? "";
  const category = searchParams.get("category") as ComponentCategory | null;
  const tagsParam = searchParams.get("tags");

  if (!(query || category || tagsParam)) {
    return errorResponse(
      "At least one of 'q', 'category', or 'tags' query parameters is required",
      400
    );
  }

  let components: ComponentMeta[] = await getComponentCatalog();

  // Pre-filter by category if provided
  if (category) {
    components = components.filter((c) => c.category === category);
  }

  // Pre-filter by tags if provided (comma-separated)
  if (tagsParam) {
    const requiredTags = tagsParam
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    if (requiredTags.length > 0) {
      components = components.filter((c) =>
        requiredTags.every((rt) => c.tags.some((t) => t.toLowerCase() === rt))
      );
    }
  }

  // Score and rank by query relevance
  let results: Array<{ component: ComponentMeta; score: number }>;

  if (query) {
    results = components
      .map((component) => ({
        component,
        score: scoreComponent(component, query),
      }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);
  } else {
    // No text query — just return filtered results with equal score
    results = components.map((component) => ({ component, score: 1 }));
  }

  return jsonResponse({
    data: results.map((r) => ({
      ...r.component,
      relevanceScore: r.score,
    })),
    total: results.length,
    query: query || undefined,
    filters: {
      ...(category ? { category } : {}),
      ...(tagsParam ? { tags: tagsParam } : {}),
    },
  });
};
