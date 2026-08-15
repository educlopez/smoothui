/**
 * Fixtures shared between a component's docs example and its landing-canvas
 * demo.
 *
 * The two demos are authored separately on purpose — the canvas one is smaller,
 * has no controls and self-animates — but they must be recognisably the same
 * thing, because clicking a tile on the landing opens the docs example. When
 * each kept its own copy of the data they drifted: the same component showed
 * different photographs, and in one case an entirely different set of events.
 *
 * So the content lives here once. Layout stays with each demo.
 */

import { somePeople } from "@smoothui/data/people";
import { sceneById } from "@smoothui/data/scenes";

const src = (id: string, tr: string) => `${sceneById(id)?.src}?tr=${tr},f-auto`;

/** Alt text always comes from the picture, never written alongside it. */
export const sceneAlt = (id: string) => sceneById(id)?.alt ?? "";

// ----------------------------------------------------------- apple-invites

export interface InviteFixture {
  badge: string;
  id: number;
  location: string;
  scene: string;
  subtitle: string;
  title: string;
}

export const INVITES: InviteFixture[] = [
  {
    badge: "Hosting",
    id: 1,
    location: "Prospect Park",
    scene: "cloud-meadow",
    subtitle: "Sat, June 14 · 6:00 AM",
    title: "Sunrise Yoga",
  },
  {
    badge: "Going",
    id: 2,
    location: "Rue Léon",
    // An 8pm supper, so warm light rather than a night mountain range.
    scene: "ember-drift-warm",
    subtitle: "Fri, June 20 · 8:00 PM",
    title: "Supper Club",
  },
  {
    badge: "Going",
    id: 3,
    location: "Praia do Amado",
    scene: "golden-ridge",
    subtitle: "Sun, June 22 · 7:30 AM",
    title: "Dawn Patrol",
  },
  {
    badge: "Interested",
    id: 4,
    location: "Rooftop, Bldg 9",
    // A 9pm screening under the sky.
    scene: "moonrise-valley",
    subtitle: "Thu, June 26 · 9:00 PM",
    title: "Open-Air Cinema",
  },
];

/** One host per event, so the same face hosts the same event in both demos. */
export const INVITE_HOSTS = somePeople(INVITES.length, 30);

export const inviteImage = (scene: string, width: number, height: number) =>
  src(scene, `w-${width},h-${height}`);

// ----------------------------------------------------------------- phototab

export const PHOTO_TABS = [
  { name: "Ridge line", scene: "blue-ridge-night" },
  { name: "Lake shore", scene: "lake-camp" },
  { name: "Pale grove", scene: "watercolor-grove" },
];

// ------------------------------------------------- scrollable-card-stack

/** The founder plus two of the cast, in that order, in both demos. */
export const STACK_CAST = somePeople(3, 12);

export const STACK_SCENES = [
  "blue-ridge-night",
  "lake-camp",
  "dune-shadow",
  "cyan-aurora",
];

// ---------------------------------------------------------------- tilt-card

/** The photo the tilt is demonstrated on, in both demos. */
export const TILT_SCENE = "golden-ridge";

/** The caption printed over it — the card is a mountain pass, so it says so. */
export const TILT_CARD = {
  eyebrow: "Ridge pass",
  meta: "Gate 04 · 09:41",
  title: "Northern Traverse",
};

export const sceneSrc = src;
