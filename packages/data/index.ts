// ---------------------------------------------------------------------------
// AI-first metadata types & schema
// ---------------------------------------------------------------------------
export type {
  AnimationType,
  ApiErrorResponse,
  BlockDetailResponse,
  BlockListResponse,
  BlockMeta,
  BlockQueryParams,
  BlockType,
  Complexity,
  ComponentCategory,
  ComponentDetailResponse,
  ComponentListResponse,
  ComponentMeta,
  ComponentQueryParams,
  PaginatedResponse,
} from "./component-meta";

export type {
  ParseFailure,
  ParseResult,
  ParseSuccess,
  SmoothUIPackageMeta,
} from "./smoothui-schema";

export { parseSmoothUIMeta } from "./smoothui-schema";

// ---------------------------------------------------------------------------
// People data
// ---------------------------------------------------------------------------

/**
 * Unified Person interface for all people data
 *
 * This single interface contains all possible fields for people data.
 * Components can use only the fields they need:
 * - Team components: name, role, bio, avatar, location, experience, social, company
 * - Testimonial components: name, role, avatar, stars, content
 * - Mixed components: any combination of fields
 */
/**
 * The one real person in this package. Kept apart from the fictional cast in
 * `./people` so nothing can quietly present an invented user as a real one.
 */
export const founder = {
  avatar:
    "https://ik.imagekit.io/16u211libb/avatar-educalvolpz.jpeg?updatedAt=1765524159631",
  company: "SmoothUI",
  location: "Spain",
  name: "Eduardo Calvo",
  role: "Creator",
  social: {
    github: "https://github.com/educlopez",
    linkedin: "https://linkedin.com/in/educlopez",
    twitter: "https://twitter.com/educalvolpz",
    website: "https://educalvolopez.com",
  },
} as const;

import type { Person } from "./people";
import {
  people,
  somePeople,
  testimonials,
  testimonialsWithPeople,
} from "./people";

export type { Person, Testimonial } from "./people";
/** Fictional people and their quotes now live in `@smoothui/data/people`. */
export {
  people,
  personById,
  somePeople,
  testimonials,
  testimonialsWithPeople,
} from "./people";

// Get people who have testimonials (stars and content)
/**
 * A person joined to what they said. Blocks that render a quote need both on one
 * object, so the join happens here rather than in every block.
 */
export type QuotedPerson = Person & { content: string; stars: number };

export const testimonialsData: QuotedPerson[] = testimonialsWithPeople().map(
  (entry) => ({ ...entry.person, content: entry.quote, stars: entry.stars })
);

interface ImageKitOptions {
  format?: "auto" | "webp" | "jpg" | "jpeg" | "png" | "avif";
  height?: number;
  quality?: number;
  transformations?: string;
  width?: number;
}

/**
 * Build transformation string from options
 */
function buildTransformations(options?: ImageKitOptions): string {
  if (options?.transformations) {
    return options.transformations;
  }

  const parts: string[] = [];

  if (options?.width) {
    parts.push(`w-${options.width}`);
  }
  if (options?.height) {
    parts.push(`h-${options.height}`);
  }

  const quality = options?.quality ?? 80;
  parts.push(`q-${quality}`);

  const format = options?.format ?? "auto";
  parts.push(`f-${format}`);

  return parts.join(",");
}

/**
 * Process full URL and add transformations
 */
function processFullUrl(imagePath: string, transformations: string): string {
  const url = new URL(imagePath);
  url.searchParams.delete("updatedAt");
  const baseUrl = url.origin + url.pathname;

  if (!transformations) {
    return baseUrl;
  }
  return `${baseUrl}?tr=${transformations}`;
}

/**
 * Build local path URL
 */
function buildLocalPathUrl(imagePath: string, transformations: string): string {
  const endpoint =
    process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ||
    process.env.IMAGEKIT_URL_ENDPOINT ||
    "https://ik.imagekit.io/16u211libb";

  const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;

  const imageKitPath = cleanPath.startsWith("images/")
    ? `smoothui/${cleanPath.replace("images/", "")}`
    : `smoothui/${cleanPath}`;

  const baseUrl = `${endpoint}/${imageKitPath}`;

  if (transformations) {
    return `${baseUrl}?tr=${transformations}`;
  }

  return baseUrl;
}

/**
 * Get ImageKit URL for an image with optimized transformations
 * Converts local image paths (/images/...) to ImageKit URLs with bandwidth optimization
 * @param imagePath - Local image path (e.g., "/images/avatar.jpg") or already full URL
 * @param options - Optional transformation options
 * @param options.width - Image width in pixels
 * @param options.height - Image height in pixels
 * @param options.quality - Image quality (1-100, default: 80)
 * @param options.format - Image format (auto, webp, jpg, png, etc.)
 * @param options.transformations - Raw transformation string (overrides other options)
 * @returns Full ImageKit URL with optimized transformations
 */
export function getImageKitUrl(
  imagePath: string,
  options?: ImageKitOptions
): string {
  const transformations = buildTransformations(options);

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return processFullUrl(imagePath, transformations);
  }

  return buildLocalPathUrl(imagePath, transformations);
}

/**
 * Helper function to get avatar URL with optimized size and quality
 * @param avatar - Avatar image path or URL
 * @param size - Avatar size in pixels (default: 40, will be doubled for retina)
 * @returns Optimized ImageKit URL for avatar
 */
export function getAvatarUrl(avatar: string, size = 40): string {
  // Double the size for retina displays, use higher quality for avatars
  const retinaSize = size * 2;
  return getImageKitUrl(avatar, {
    format: "auto",
    height: retinaSize,
    quality: 85, // Higher quality for faces
    width: retinaSize,
  });
}

// Helper function to get team member data (people without testimonials or all people)
export function getTeamMembers(
  count = 4,
  includeTestimonials = false
): Person[] {
  if (includeTestimonials) {
    return somePeople(count);
  }
  // People with nothing to quote, so a team grid and a testimonial wall on the
  // same page do not show the same faces.
  const quoted = new Set(testimonials.map((entry) => entry.personId));
  return people.filter((person) => !quoted.has(person.id)).slice(0, count);
}

// Helper function to get testimonials data
export function getTestimonials(count = 4): QuotedPerson[] {
  return testimonialsData.slice(0, count);
}

// Helper function to get all people data
export function getAllPeople(): Person[] {
  return people;
}

// Helper function to get people by role
export function getPeopleByRole(role: string): Person[] {
  return people.filter((person) =>
    person.role.toLowerCase().includes(role.toLowerCase())
  );
}

// Helper function to get people with testimonials
export function getPeopleWithTestimonials(): QuotedPerson[] {
  return testimonialsData;
}
