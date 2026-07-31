import {
  BLOCK_CATEGORY_COUNT,
  BLOCK_COUNT,
  COMPONENT_COUNT,
  TEMPLATE_COUNT,
} from "./generated/counts";

const TOKENS: Record<string, number> = {
  blockCategories: BLOCK_CATEGORY_COUNT,
  blocks: BLOCK_COUNT,
  components: COMPONENT_COUNT,
  templates: TEMPLATE_COUNT,
};

const TOKEN_PATTERN = /\{\{(components|blocks|blockCategories|templates)\}\}/g;

/**
 * Substitutes `{{components}}`-style tokens with the generated counts.
 *
 * MDX frontmatter is parsed before any JavaScript runs, so a description cannot
 * import a constant the way the body can — and frontmatter descriptions are
 * exactly where a stale number does the most damage, since that is the text
 * Google shows. Tokens plus this transform are the only way to keep them
 * accurate without hand-editing every file at each release.
 *
 * In the body of an MDX file, import the constant and interpolate it instead:
 * that keeps the source readable as MDX rather than as a template.
 */
export const substituteCounts = (value: string): string =>
  value.replace(TOKEN_PATTERN, (_match, token: string) =>
    String(TOKENS[token] ?? "")
  );
