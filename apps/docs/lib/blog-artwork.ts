import { landscapes, sceneById } from "@smoothui/data/scenes";

/**
 * Deliberate landscape covers for every post — same vivid stage language as
 * the landing (blur + heavy saturate in PostCover). Eight catalog landscapes
 * cycle across fifteen posts for color variety.
 */
export const blogArtworkIds: Record<string, string> = {
  "ai-design-slop": "volcanic-coast",
  "best-react-animation-libraries": "turquoise-canyon",
  "building-animated-tabs": "alpine-dawn",
  "building-magnetic-button": "tidal-cove",
  "building-number-flow": "glacial-lagoon",
  "building-rich-popover": "terracotta-dunes",
  "building-scramble-hover": "emerald-terraces",
  "building-social-selector": "emerald-forest",
  "building-user-account-avatar": "volcanic-coast",
  "framer-motion-tutorial": "turquoise-canyon",
  "introducing-ui-craft": "alpine-dawn",
  "react-hover-effects": "tidal-cove",
  "shadcn-ui-animated-components": "glacial-lagoon",
  "tailwind-css-animation-react": "terracotta-dunes",
  "tailwind-css-components-react": "emerald-terraces",
};

export function blogArtwork(url: string) {
  const slug = url.split("/").filter(Boolean).at(-1) ?? url;
  const id = blogArtworkIds[slug];
  if (!id) {
    return;
  }
  const asset = sceneById(id);
  if (!(asset && landscapes.some((scene) => scene.id === id))) {
    return;
  }
  return asset;
}
