export type StarterKit = {
  id: string;
  label: string;
  description: string;
  /** Registry slugs added when the kit is loaded. */
  slugs: string[];
};

export const STARTER_KITS: StarterKit[] = [
  {
    id: "landing",
    label: "Landing page",
    description: "Hero-ready motion and flair",
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
    id: "ios",
    label: "iOS feel",
    description: "Apple-style interactions",
    slugs: [
      "dynamic-island",
      "apple-invites",
      "power-off-slide",
      "photo-stack",
      "phototab",
    ],
  },
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Data display and inputs",
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
