export type StarterKit = {
  id: string;
  label: string;
  description: string;
  /** Registry slugs added when the kit is loaded. */
  slugs: string[];
};

export const STARTER_KITS: StarterKit[] = [
  {
    description: "Hero-ready motion and flair",
    id: "landing",
    label: "Landing page",
    slugs: [
      "scramble-hover",
      "number-flow",
      "animated-tags",
      "expandable-cards",
      "siri-orb",
      "button-copy",
    ],
  },
  {
    description: "Apple-style interactions",
    id: "ios",
    label: "iOS feel",
    slugs: [
      "dynamic-island",
      "apple-invites",
      "power-off-slide",
      "photo-stack",
      "phototab",
    ],
  },
  {
    description: "Data display and inputs",
    id: "dashboard",
    label: "Dashboard",
    slugs: [
      "number-flow",
      "price-flow",
      "animated-stepper",
      "searchable-dropdown",
      "combobox",
      "user-account-avatar",
    ],
  },
];
