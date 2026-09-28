import { blogArtwork } from "./blog-artwork";

export type BlogCoverKind =
  | "audit"
  | "libraries"
  | "tabs"
  | "magnetic"
  | "numbers"
  | "popover"
  | "scramble"
  | "social"
  | "account"
  | "motion"
  | "craft"
  | "hover"
  | "shadcn"
  | "keyframes"
  | "components"
  | "notes";

export interface BlogCoverDirection {
  kind: BlogCoverKind;
  pattern: "none" | "squares" | "contours";
}

/** One illustration per post — subject, not date. */
export const blogCoverDirections: Record<string, BlogCoverDirection> = {
  "ai-design-slop": { kind: "audit", pattern: "squares" },
  "best-react-animation-libraries": { kind: "libraries", pattern: "contours" },
  "building-animated-tabs": { kind: "tabs", pattern: "squares" },
  "building-magnetic-button": { kind: "magnetic", pattern: "contours" },
  "building-number-flow": { kind: "numbers", pattern: "squares" },
  "building-rich-popover": { kind: "popover", pattern: "contours" },
  "building-scramble-hover": { kind: "scramble", pattern: "squares" },
  "building-social-selector": { kind: "social", pattern: "contours" },
  "building-user-account-avatar": { kind: "account", pattern: "squares" },
  "framer-motion-tutorial": { kind: "motion", pattern: "contours" },
  "introducing-ui-craft": { kind: "craft", pattern: "squares" },
  "react-hover-effects": { kind: "hover", pattern: "contours" },
  "shadcn-ui-animated-components": { kind: "shadcn", pattern: "squares" },
  "tailwind-css-animation-react": { kind: "keyframes", pattern: "contours" },
  "tailwind-css-components-react": { kind: "components", pattern: "squares" },
};

export function blogCover(url: string): BlogCoverDirection {
  const slug = url.split("/").filter(Boolean).at(-1) ?? url;
  return (
    blogCoverDirections[slug] ?? {
      kind: "notes",
      pattern: "squares",
    }
  );
}

/** Shared-element name for index ↔ article cover morph. */
export function blogCoverTransitionName(url: string) {
  const slug = url.split("/").filter(Boolean).at(-1) ?? url;
  return `blog-cover-${slug}`;
}

export function blogCoverImage(url: string) {
  const slug = url.split("/").filter(Boolean).at(-1) ?? url;
  const background = blogArtwork(url)?.src;
  return background
    ? `${background}?tr=f-png,w-1200,h-630`
    : `https://smoothui.dev/og/blog/${encodeURIComponent(slug)}/image.png`;
}
