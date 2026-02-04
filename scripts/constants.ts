export const REGISTRY_URL = "https://smoothui.dev";

export const CATEGORIES: Record<string, string[]> = {
  "Basic UI": [
    "accordion",
    "animated-input",
    "animated-progress-bar",
    "animated-tabs",
    "animated-toggle",
    "basic-dropdown",
    "basic-modal",
    "basic-toast",
    "notification-badge",
    "searchable-dropdown",
    "skeleton-loader",
    "tweet-card",
  ],
  Buttons: [
    "button-copy",
    "clip-corners-button",
    "dot-morph-button",
    "magnetic-button",
  ],
  "Text Effects": [
    "wave-text",
    "reveal-text",
    "typewriter-text",
    "scramble-hover",
    "scroll-reveal-paragraph",
  ],
  AI: ["ai-branch", "ai-input"],
  "Cards & Layouts": [
    "expandable-cards",
    "glow-hover-card",
    "scrollable-card-stack",
    "switchboard-card",
    "phototab",
    "job-listing-component",
  ],
  "Loaders & Effects": [
    "grid-loader",
    "siri-orb",
    "cursor-follow",
    "github-stars-animation",
  ],
  Interactive: [
    "animated-o-t-p-input",
    "animated-tags",
    "app-download-stack",
    "apple-invites",
    "contribution-graph",
    "dynamic-island",
    "figma-comment",
    "image-metadata-preview",
    "infinite-slider",
    "interactive-image-selector",
    "number-flow",
    "power-off-slide",
    "price-flow",
    "rich-popover",
    "reviews-carousel",
    "social-selector",
    "user-account-avatar",
  ],
};

export const PATH_PATTERNS = [
  "src/components/ui",
  "components/ui",
  "src/components",
  "components",
  "app/components/ui",
];

export const LOCKFILES: {
  file: string;
  cmd: "bun" | "pnpm" | "yarn" | "npm";
}[] = [
  { file: "bun.lockb", cmd: "bun" },
  { file: "pnpm-lock.yaml", cmd: "pnpm" },
  { file: "yarn.lock", cmd: "yarn" },
  { file: "package-lock.json", cmd: "npm" },
];

export const SYMBOLS = {
  active: "◆",
  done: "◇",
  selected: "●",
  unselected: "○",
  cursor: "❯",
  success: "✓",
  error: "✗",
  bar: "│",
} as const;
