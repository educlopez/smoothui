/**
 * Component metadata types for AI-first developer experience.
 *
 * These types define structured, machine-readable metadata for SmoothUI
 * components and blocks, enabling AI agents to discover, filter, and
 * understand components without reading source code.
 */

// ---------------------------------------------------------------------------
// Category types
// ---------------------------------------------------------------------------

export type ComponentCategory =
  | "basic-ui"
  | "button"
  | "text"
  | "ai"
  | "layout"
  | "feedback"
  | "data-display"
  | "navigation"
  | "other";

export type AnimationType =
  | "spring"
  | "tween"
  | "gesture"
  | "scroll"
  | "none";

export type Complexity = "simple" | "moderate" | "complex";

// ---------------------------------------------------------------------------
// Component metadata
// ---------------------------------------------------------------------------

/**
 * Full metadata for a single SmoothUI component.
 *
 * Combines data from two sources:
 * - `smoothui` field in the component's package.json (authored by hand)
 * - MDX frontmatter and registry info (derived at build time)
 */
export interface ComponentMeta {
  /** kebab-case identifier, e.g. "animated-tabs" */
  name: string;
  /** PascalCase display name, e.g. "AnimatedTabs" */
  displayName: string;
  /** 1-2 sentence human-readable description */
  description: string;
  /** Primary UI category */
  category: ComponentCategory;
  /** Discoverable tags, e.g. ["animation", "tabs", "navigation"] */
  tags: readonly string[];
  /** Natural-language use-case descriptions */
  useCases: readonly string[];
  /** Hints for combining with other components */
  compositionHints: readonly string[];
  /** Rough complexity level */
  complexity: Complexity;
  /** Dominant animation technique */
  animationType: AnimationType;
  /** npm packages required (excluding peer deps) */
  dependencies: readonly string[];
  /** Other SmoothUI components required */
  registryDependencies: readonly string[];
  /** Whether the component respects prefers-reduced-motion */
  hasReducedMotion: boolean;
  /** Number of public props */
  propsCount: number;
  /** shadcn-style install command */
  installCommand: string;
  /** Full documentation URL */
  docUrl: string;
  /** Registry JSON URL */
  registryUrl: string;
}

// ---------------------------------------------------------------------------
// Block metadata
// ---------------------------------------------------------------------------

export type BlockType =
  | "hero"
  | "features"
  | "pricing"
  | "testimonials"
  | "cta"
  | "footer"
  | "header"
  | "other";

/**
 * Full metadata for a pre-built page block (section).
 */
export interface BlockMeta {
  /** kebab-case identifier */
  name: string;
  /** PascalCase display name */
  displayName: string;
  /** 1-2 sentence description */
  description: string;
  /** Block section type */
  blockType: BlockType;
  /** SmoothUI components used inside this block */
  components: readonly string[];
  /** Primary UI category */
  category: ComponentCategory;
  /** Discoverable tags */
  tags: readonly string[];
  /** Natural-language use-case descriptions */
  useCases: readonly string[];
  /** Rough complexity level */
  complexity: Complexity;
  /** Dominant animation technique */
  animationType: AnimationType;
  /** npm packages required */
  dependencies: readonly string[];
  /** Whether the block respects prefers-reduced-motion */
  hasReducedMotion: boolean;
  /** shadcn-style install command */
  installCommand: string;
  /** Full documentation URL */
  docUrl: string;
  /** Registry JSON URL */
  registryUrl: string;
}

// ---------------------------------------------------------------------------
// API response types
// ---------------------------------------------------------------------------

/**
 * Paginated list response wrapper used by all list endpoints.
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** GET /api/components */
export type ComponentListResponse = PaginatedResponse<ComponentMeta>;

/** GET /api/components/:name */
export interface ComponentDetailResponse {
  component: ComponentMeta;
  /** Raw source code (optional, included when ?include=source) */
  source?: string;
}

/** GET /api/blocks */
export type BlockListResponse = PaginatedResponse<BlockMeta>;

/** GET /api/blocks/:name */
export interface BlockDetailResponse {
  block: BlockMeta;
  source?: string;
}

/** Standard error envelope returned by API routes */
export interface ApiErrorResponse {
  error: string;
  status: number;
}

// ---------------------------------------------------------------------------
// Query / filter helpers
// ---------------------------------------------------------------------------

/** Supported filter parameters for component list queries */
export interface ComponentQueryParams {
  category?: ComponentCategory;
  complexity?: Complexity;
  animationType?: AnimationType;
  tag?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

/** Supported filter parameters for block list queries */
export interface BlockQueryParams {
  blockType?: BlockType;
  complexity?: Complexity;
  tag?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}
