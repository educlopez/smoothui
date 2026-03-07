/**
 * Schema definition and validation for the `smoothui` field in component
 * package.json files.
 *
 * Each component's package.json may include a `smoothui` object with
 * machine-readable metadata. This module provides the TypeScript type for
 * that field and a runtime validation/parsing function.
 *
 * @example package.json
 * ```json
 * {
 *   "name": "@repo/animated-tabs",
 *   "description": "Animated tabs component with sliding indicator",
 *   "smoothui": {
 *     "category": "navigation",
 *     "tags": ["animation", "tabs", "navigation"],
 *     "complexity": "moderate",
 *     "animationType": "spring",
 *     "useCases": [
 *       "Tab navigation with smooth transitions",
 *       "Section switcher with animated indicator"
 *     ],
 *     "compositionHints": [
 *       "Combine with animated-tooltip for rich tab headers"
 *     ],
 *     "hasReducedMotion": true
 *   }
 * }
 * ```
 */

import type {
  AnimationType,
  Complexity,
  ComponentCategory,
} from "./component-meta";

// ---------------------------------------------------------------------------
// Schema type
// ---------------------------------------------------------------------------

/**
 * Shape of the `smoothui` field inside a component's package.json.
 * Only includes metadata that is authored by hand — derived fields
 * (name, displayName, dependencies, URLs) are computed at build time.
 */
export interface SmoothUIPackageMeta {
  /** Primary UI category */
  category: ComponentCategory;
  /** Discoverable tags */
  tags: string[];
  /** Rough complexity level */
  complexity: Complexity;
  /** Dominant animation technique */
  animationType: AnimationType;
  /** Natural-language use-case descriptions */
  useCases: string[];
  /** Hints for combining with other components */
  compositionHints: string[];
  /** Whether the component respects prefers-reduced-motion */
  hasReducedMotion: boolean;
}

// ---------------------------------------------------------------------------
// Validation constants
// ---------------------------------------------------------------------------

const VALID_CATEGORIES: readonly ComponentCategory[] = [
  "basic-ui",
  "button",
  "text",
  "ai",
  "layout",
  "feedback",
  "data-display",
  "navigation",
  "other",
];

const VALID_COMPLEXITIES: readonly Complexity[] = [
  "simple",
  "moderate",
  "complex",
];

const VALID_ANIMATION_TYPES: readonly AnimationType[] = [
  "spring",
  "tween",
  "gesture",
  "scroll",
  "none",
];

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

interface ValidationError {
  field: string;
  message: string;
}

const isString = (value: unknown): value is string => typeof value === "string";

const isBoolean = (value: unknown): value is boolean =>
  typeof value === "boolean";

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every(isString);

const isOneOf = <T extends string>(
  value: unknown,
  allowed: readonly T[]
): value is T => isString(value) && (allowed as readonly string[]).includes(value);

// ---------------------------------------------------------------------------
// Parse result
// ---------------------------------------------------------------------------

export interface ParseSuccess {
  success: true;
  data: SmoothUIPackageMeta;
}

export interface ParseFailure {
  success: false;
  errors: ValidationError[];
}

export type ParseResult = ParseSuccess | ParseFailure;

// ---------------------------------------------------------------------------
// Parser
// ---------------------------------------------------------------------------

/**
 * Validate and parse a raw `smoothui` field from a component package.json.
 *
 * Returns a discriminated union so callers can handle errors explicitly.
 *
 * @param raw - The unknown value read from `packageJson.smoothui`
 * @returns A `ParseResult` with either typed data or a list of errors
 */
export const parseSmoothUIMeta = (raw: unknown): ParseResult => {
  const errors: ValidationError[] = [];

  if (raw === null || raw === undefined || typeof raw !== "object") {
    return {
      success: false,
      errors: [{ field: "smoothui", message: "Must be a non-null object" }],
    };
  }

  const obj = raw as Record<string, unknown>;

  // category — required
  if (!isOneOf(obj.category, VALID_CATEGORIES)) {
    errors.push({
      field: "category",
      message: `Must be one of: ${VALID_CATEGORIES.join(", ")}`,
    });
  }

  // tags — required string[]
  if (!isStringArray(obj.tags)) {
    errors.push({
      field: "tags",
      message: "Must be an array of strings",
    });
  }

  // complexity — required
  if (!isOneOf(obj.complexity, VALID_COMPLEXITIES)) {
    errors.push({
      field: "complexity",
      message: `Must be one of: ${VALID_COMPLEXITIES.join(", ")}`,
    });
  }

  // animationType — required
  if (!isOneOf(obj.animationType, VALID_ANIMATION_TYPES)) {
    errors.push({
      field: "animationType",
      message: `Must be one of: ${VALID_ANIMATION_TYPES.join(", ")}`,
    });
  }

  // useCases — required string[]
  if (!isStringArray(obj.useCases)) {
    errors.push({
      field: "useCases",
      message: "Must be an array of strings",
    });
  }

  // compositionHints — required string[]
  if (!isStringArray(obj.compositionHints)) {
    errors.push({
      field: "compositionHints",
      message: "Must be an array of strings",
    });
  }

  // hasReducedMotion — required boolean
  if (!isBoolean(obj.hasReducedMotion)) {
    errors.push({
      field: "hasReducedMotion",
      message: "Must be a boolean",
    });
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      category: obj.category as ComponentCategory,
      tags: obj.tags as string[],
      complexity: obj.complexity as Complexity,
      animationType: obj.animationType as AnimationType,
      useCases: obj.useCases as string[],
      compositionHints: obj.compositionHints as string[],
      hasReducedMotion: obj.hasReducedMotion as boolean,
    },
  };
};
