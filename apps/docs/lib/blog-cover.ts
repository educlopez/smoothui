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
  detail: string;
  kind: BlogCoverKind;
  label: string;
  pattern: "none" | "squares" | "contours";
}

/** Editorial art direction follows each article's actual subject, not its date. */
export const blogCoverDirections: Record<string, BlogCoverDirection> = {
  "ai-design-slop": {
    detail: "Review · refine · repeat",
    kind: "audit",
    label: "Beyond design slop",
    pattern: "squares",
  },
  "best-react-animation-libraries": {
    detail: "A React library field guide",
    kind: "libraries",
    label: "Choose your motion",
    pattern: "none",
  },
  "building-animated-tabs": {
    detail: "Shared layout animation",
    kind: "tabs",
    label: "One indicator. Every tab.",
    pattern: "contours",
  },
  "building-magnetic-button": {
    detail: "Cursor physics · spring response",
    kind: "magnetic",
    label: "A little magnetic pull",
    pattern: "none",
  },
  "building-number-flow": {
    detail: "Direction-aware digits",
    kind: "numbers",
    label: "Make numbers move",
    pattern: "squares",
  },
  "building-rich-popover": {
    detail: "Scale · blur · spring",
    kind: "popover",
    label: "More than a tooltip",
    pattern: "none",
  },
  "building-scramble-hover": {
    detail: "Text scramble in React",
    kind: "scramble",
    label: "Decode the hover",
    pattern: "squares",
  },
  "building-social-selector": {
    detail: "A sliding social selector",
    kind: "social",
    label: "Switch with a spring",
    pattern: "none",
  },
  "building-user-account-avatar": {
    detail: "Accessible account menus",
    kind: "account",
    label: "A profile, unfolded",
    pattern: "contours",
  },
  "framer-motion-tutorial": {
    detail: "Transitions · gestures · layout",
    kind: "motion",
    label: "From state to motion",
    pattern: "contours",
  },
  "introducing-ui-craft": {
    detail: "Introducing UI Craft",
    kind: "craft",
    label: "Give your agent taste",
    pattern: "squares",
  },
  "react-hover-effects": {
    detail: "Ten small interaction studies",
    kind: "hover",
    label: "Hover with intention",
    pattern: "none",
  },
  "shadcn-ui-animated-components": {
    detail: "Animated shadcn/ui components",
    kind: "shadcn",
    label: "Familiar parts. More motion.",
    pattern: "squares",
  },
  "tailwind-css-animation-react": {
    detail: "From keyframes to springs",
    kind: "keyframes",
    label: "Utilities, meet motion",
    pattern: "contours",
  },
  "tailwind-css-components-react": {
    detail: "The Tailwind + React landscape",
    kind: "components",
    label: "Build your component kit",
    pattern: "none",
  },
};

export function blogCover(url: string): BlogCoverDirection {
  const slug = url.split("/").filter(Boolean).at(-1) ?? url;
  return (
    blogCoverDirections[slug] ?? {
      detail: "From the SmoothUI journal",
      kind: "notes",
      label: "Design notes",
      pattern: "none",
    }
  );
}

export function blogCoverImage(url: string) {
  const slug = url.split("/").filter(Boolean).at(-1) ?? url;
  const background = blogArtwork(url)?.src;
  return background
    ? `${background}?tr=f-png,w-1200,h-630`
    : `https://smoothui.dev/og/blog/${encodeURIComponent(slug)}/image.png`;
}
