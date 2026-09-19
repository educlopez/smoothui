import {
  METADATA_SCENE,
  PHOTO_TABS,
  STACK_SCENES,
} from "@docs/examples/shared/demo-fixtures";
import { castAnimals, castPeople } from "@smoothui/data/cast";
import { somePeople } from "@smoothui/data/people";
import { productImages } from "@smoothui/data/products";
import {
  approvedAbstracts,
  cards,
  events,
  landscapes,
  type Scene,
} from "@smoothui/data/scenes";
import { landingBackgrounds } from "./landing-backgrounds";

export interface MediaAsset {
  alt: string;
  approved: boolean;
  category: string;
  code: string;
  gender?: "female" | "male" | "nonbinary" | "unspecified";
  id: string;
  species?: string;
  src: string;
  title?: string;
  usage: string[];
}

// Direct component-demo references (canvas and docs share one destination).
const demoUsage: Record<string, string[]> = {
  "amber-violet": [
    "coverflow-carousel",
    "cursor-image-trail",
    "dither-image",
    "dock",
    "image-generation-panel",
    "orbital-image-wheel",
    "parallax-layers",
    "svg-clip-mask",
    "time-machine-stack",
    "video-modal",
  ],
  "azure-apricot": [],
  "bay-star": ["hover-expand"],
  "cobalt-pink": [
    "coverflow-carousel",
    "cursor-image-trail",
    "dither-image",
    "glass-card",
    "image-generation-panel",
    "orbital-image-wheel",
    "parallax-layers",
    "svg-clip-mask",
    "time-machine-stack",
  ],
  "coral-cyan": ["orbital-image-wheel"],
  "coral-lavender": [
    "coverflow-carousel",
    "cursor-image-trail",
    "image-generation-panel",
    "orbital-image-wheel",
    "scroll-progress",
    "skeleton-loader",
  ],
  "cyan-tangerine": [
    "coverflow-carousel",
    "cursor-image-trail",
    "glass-card",
    "image-generation-panel",
    "orbital-image-wheel",
  ],
  "fuchsia-cobalt": ["scroll-image-reveal"],
  "golden-coral": ["scroll-image-reveal"],
  "hana-park": [
    "card-swipe-deck",
    "hover-image-list",
    "interactive-image-selector",
  ],
  headphones: ["product-card"],
  "ines-moreau": ["card-swipe-deck"],
  "jun-park": ["interactive-image-selector"],
  "leaf-veiled": ["hover-expand"],
  "luca-moretti": [
    "ascii-render",
    "card-swipe-deck",
    "cursor-follow",
    "dither-image",
    "hover-image-list",
    "interactive-image-selector",
    "photo-stack",
    "time-machine-stack",
  ],
  "mango-tabby": ["hover-expand", "time-machine-stack"],
  "maple-golden": [
    "ascii-render",
    "hover-expand",
    "photo-stack",
    "scroll-image-reveal",
    "time-machine-stack",
  ],
  "maya-solis": [
    "card-swipe-deck",
    "cursor-follow",
    "hover-image-list",
    "interactive-image-selector",
    "photo-stack",
    "time-machine-stack",
  ],
  nymara: ["holographic-foil"],
  "plum-coral": ["orbital-image-wheel"],
  "rio-macaw": ["hover-expand"],
  "sasha-kim": ["card-swipe-deck", "photo-stack", "time-machine-stack"],
  "sky-peach": ["scroll-image-reveal"],
  sneaker: ["product-card"],
  "teal-apricot": ["orbital-image-wheel"],
  "violet-tangerine": [
    "orbital-image-wheel",
    "scroll-image-reveal",
    "tilt-card",
  ],
  "zara-ndiaye": ["hover-image-list", "interactive-image-selector"],
};

// Consumers of the shared fictional identity pool retain source names and faces.
for (const tab of PHOTO_TABS) {
  demoUsage[tab.scene] = ["phototab"];
}
for (const id of STACK_SCENES) {
  demoUsage[id] = ["scrollable-card-stack"];
}
demoUsage[METADATA_SCENE.id] = ["image-metadata-preview", "landing"];
for (const item of events) {
  demoUsage[item.id] = ["apple-invites", "expandable-cards"];
}

const avatarConsumers: [string, number, number][] = [
  ["animated-avatar-group", 8, 0],
  ["animated-list", 6, 60],
  ["apple-invites", 4, 30],
  ["expandable-cards", 4, 30],
  ["figma-comment", 1, 11],
  ["inline-testimonials", 3, 20],
  ["scrollable-card-stack", 3, 12],
  ["skeleton-loader", 1, 3],
  ["social-hover-card", 1, 47],
  ["user-account-avatar", 1, 7],
  ["wallet-card", 7, 40],
];
for (const [demo, count, offset] of avatarConsumers) {
  for (const person of somePeople(count, offset)) {
    demoUsage[person.id] ??= [];
    demoUsage[person.id].push(demo);
  }
}

const landingBackgroundIds = new Set(
  Object.values(landingBackgrounds).map((asset) => asset.id)
);

function fromCatalog(items: Scene[], category: string): MediaAsset[] {
  return items.map((item) => ({
    ...item,
    approved: approvedAbstracts.some((asset) => asset.id === item.id),
    category,
    code: `sceneById("${item.id}")`,
    usage: [
      ...new Set([
        ...(demoUsage[item.id] ?? []),
        ...(landingBackgroundIds.has(item.id) ? ["landing"] : []),
      ]),
    ].sort(),
  }));
}

const products: MediaAsset[] = productImages.map((item) => ({
  ...item,
  approved: false,
  category: "Products",
  code: JSON.stringify(item.src),
  usage: demoUsage[item.id] ?? [],
}));

export const mediaCatalog: MediaAsset[] = [
  ...fromCatalog(approvedAbstracts, "Backgrounds"),
  ...fromCatalog(landscapes, "Landscapes"),
  ...fromCatalog(events, "Events"),
  ...fromCatalog(castPeople, "People"),
  ...fromCatalog(castAnimals, "Animals"),
  ...fromCatalog(cards, "Card art"),
  ...products,
];
