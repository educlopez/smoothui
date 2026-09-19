import { sceneById } from "@smoothui/data/scenes";

/** Deliberate, stable cover assignments; original editorial files remain archived. */
export const blogArtworkIds: Record<string, string> = {
  "ai-design-slop": "amber-violet",
  "best-react-animation-libraries": "cobalt-pink",
  "building-animated-tabs": "coral-lavender",
  "building-magnetic-button": "cyan-tangerine",
  "building-number-flow": "coral-cyan",
  "building-rich-popover": "violet-tangerine",
  "building-scramble-hover": "teal-apricot",
  "building-social-selector": "plum-coral",
  "building-user-account-avatar": "azure-apricot",
  "framer-motion-tutorial": "sky-peach",
  "introducing-ui-craft": "fuchsia-cobalt",
  "react-hover-effects": "golden-coral",
  "shadcn-ui-animated-components": "amber-violet",
  "tailwind-css-animation-react": "cobalt-pink",
  "tailwind-css-components-react": "coral-lavender",
};

export function blogArtwork(url: string) {
  const slug = url.split("/").filter(Boolean).at(-1) ?? url;
  const id = blogArtworkIds[slug];
  return id ? sceneById(id) : undefined;
}
