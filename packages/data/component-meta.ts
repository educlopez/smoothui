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

export type AnimationType = "spring" | "tween" | "gesture" | "scroll" | "none";

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
  /** Dominant animation technique */
  animationType: AnimationType;
  /** Primary UI category */
  category: ComponentCategory;
  /** Rough complexity level */
  complexity: Complexity;
  /** Hints for combining with other components */
  compositionHints: readonly string[];
  /** npm packages required (excluding peer deps) */
  dependencies: readonly string[];
  /** 1-2 sentence human-readable description */
  description: string;
  /** PascalCase display name, e.g. "AnimatedTabs" */
  displayName: string;
  /** Full documentation URL */
  docUrl: string;
  /** Whether the component respects prefers-reduced-motion */
  hasReducedMotion: boolean;
  /** shadcn-style install command */
  installCommand: string;
  /** kebab-case identifier, e.g. "animated-tabs" */
  name: string;
  /** Number of public props */
  propsCount: number;
  /** Other SmoothUI components required */
  registryDependencies: readonly string[];
  /** Registry JSON URL */
  registryUrl: string;
  /** Discoverable tags, e.g. ["animation", "tabs", "navigation"] */
  tags: readonly string[];
  /** Natural-language use-case descriptions */
  useCases: readonly string[];
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
  /** Dominant animation technique */
  animationType: AnimationType;
  /** Block section type */
  blockType: BlockType;
  /** Primary UI category */
  category: ComponentCategory;
  /** Rough complexity level */
  complexity: Complexity;
  /** SmoothUI components used inside this block */
  components: readonly string[];
  /** npm packages required */
  dependencies: readonly string[];
  /** 1-2 sentence description */
  description: string;
  /** PascalCase display name */
  displayName: string;
  /** Full documentation URL */
  docUrl: string;
  /** Whether the block respects prefers-reduced-motion */
  hasReducedMotion: boolean;
  /** shadcn-style install command */
  installCommand: string;
  /** kebab-case identifier */
  name: string;
  /** Registry JSON URL */
  registryUrl: string;
  /** Discoverable tags */
  tags: readonly string[];
  /** Natural-language use-case descriptions */
  useCases: readonly string[];
}

// ---------------------------------------------------------------------------
// API response types
// ---------------------------------------------------------------------------

/**
 * Paginated list response wrapper used by all list endpoints.
 */
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
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
  animationType?: AnimationType;
  category?: ComponentCategory;
  complexity?: Complexity;
  page?: number;
  pageSize?: number;
  search?: string;
  tag?: string;
}

/** Supported filter parameters for block list queries */
export interface BlockQueryParams {
  blockType?: BlockType;
  complexity?: Complexity;
  page?: number;
  pageSize?: number;
  search?: string;
  tag?: string;
}
