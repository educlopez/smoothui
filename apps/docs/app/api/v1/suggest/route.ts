import {
  getBlockCatalog,
  getComponentCatalog,
} from "@docs/lib/component-catalog";
import type { BlockMeta, ComponentMeta } from "@smoothui/data";
import type { NextRequest } from "next/server";
import { errorResponse, jsonResponse } from "../_shared";

export { OPTIONS } from "../_shared";

export const dynamic = "force-dynamic";

const MAX_SUGGESTIONS = 10;

/** Shared fields used for scoring both components and blocks */
interface Scoreable {
  name: string;
  description: string;
  tags: readonly string[];
  useCases: readonly string[];
  category: string;
}

/**
 * Score an item against a natural-language need description.
 * Pure keyword matching — no AI/LLM dependency.
 */
const scoreItem = (item: Scoreable, terms: string[]): number => {
  let score = 0;

  for (const term of terms) {
    // Name match
    if (item.name === term) {
      score += 10;
    } else if (item.name.includes(term)) {
      score += 5;
    }

    // Tags — high relevance
    if (item.tags.some((t) => t.toLowerCase() === term)) {
      score += 6;
    } else if (item.tags.some((t) => t.toLowerCase().includes(term))) {
      score += 3;
    }

    // Use cases — natural language, good signal
    if (item.useCases.some((u) => u.toLowerCase().includes(term))) {
      score += 5;
    }

    // Description
    if (item.description.toLowerCase().includes(term)) {
      score += 2;
    }

    // Category
    if (item.category.includes(term)) {
      score += 2;
    }
  }

  return score;
};

interface Suggestion {
  type: "component" | "block";
  name: string;
  displayName: string;
  description: string;
  category: string;
  relevanceScore: number;
  installCommand: string;
  docUrl: string;
  registryUrl: string;
}

const toSuggestion = (
  item: ComponentMeta | BlockMeta,
  type: "component" | "block",
  score: number
): Suggestion => ({
  type,
  name: item.name,
  displayName: item.displayName,
  description: item.description,
  category: item.category,
  relevanceScore: score,
  installCommand: item.installCommand,
  docUrl: item.docUrl,
  registryUrl: item.registryUrl,
});

export const GET = async (request: NextRequest): Promise<Response> => {
  const need = request.nextUrl.searchParams.get("need")?.trim() ?? "";

  if (!need) {
    return errorResponse("'need' query parameter is required", 400);
  }

  const terms = need
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 1); // ignore single-char noise

  if (terms.length === 0) {
    return errorResponse("'need' must contain meaningful keywords", 400);
  }

  const [components, blocks] = await Promise.all([
    getComponentCatalog(),
    getBlockCatalog(),
  ]);

  const scored: Suggestion[] = [];

  for (const component of components) {
    const score = scoreItem(component, terms);
    if (score > 0) {
      scored.push(toSuggestion(component, "component", score));
    }
  }

  for (const block of blocks) {
    const score = scoreItem(block, terms);
    if (score > 0) {
      scored.push(toSuggestion(block, "block", score));
    }
  }

  // Sort by relevance (descending) and take top N
  scored.sort((a, b) => b.relevanceScore - a.relevanceScore);
  const suggestions = scored.slice(0, MAX_SUGGESTIONS);

  return jsonResponse({
    need,
    suggestions,
    total: suggestions.length,
  });
};
