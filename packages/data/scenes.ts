import { castAnimals, castPeople } from "./cast";

/**
 * Curated blurred, saturated, grain-rich demo backgrounds served from ImageKit.
 * Legacy IDs resolve through aliases, but never return retired source artwork.
 * Original registry and URLs are kept in docs/contributing/media-provenance/.
 * Request rendered dimensions with `?tr=w-640,f-auto`.
 */
const BASE = "https://ik.imagekit.io/16u211libb/smoothui/scenes";

export interface Scene {
  /** Descriptive, and usable verbatim as alt text. */
  alt: string;
  /** Slug, and the filename. Stable — safe to use as a React key. */
  id: string;
  /**
   * `photo` has a subject and wants to be seen; `abstract` is texture and is
   * safe to put type on top of. Pick by whether the image is the content or the
   * surface behind it.
   */
  kind: "photo" | "abstract";
  src: string;
  /** Optional editorial title for artwork. */
  title?: string;
  /** Roughly how bright the image is, for choosing overlay and text colour. */
  tone: "light" | "dark";
}

const scene = (
  id: string,
  alt: string,
  tone: Scene["tone"],
  kind: Scene["kind"]
): Scene => ({ alt, id, kind, src: `${BASE}/${id}.webp`, tone });

/** Approved Magnific backgrounds; retired sources live only in provenance files. */
export const approvedAbstracts: Scene[] = [
  scene(
    "amber-violet",
    "Amber and violet abstract color fields",
    "light",
    "abstract"
  ),
  scene(
    "cobalt-pink",
    "Cobalt blue and pink abstract color fields",
    "dark",
    "abstract"
  ),
  scene(
    "coral-lavender",
    "Coral and lavender abstract color fields",
    "light",
    "abstract"
  ),
  scene(
    "cyan-tangerine",
    "Cyan and tangerine abstract color fields",
    "light",
    "abstract"
  ),
  scene(
    "coral-cyan",
    "Coral and cyan heavily blurred color fields with fine grain",
    "light",
    "abstract"
  ),
  scene(
    "violet-tangerine",
    "Violet and tangerine heavily blurred color fields with fine grain",
    "dark",
    "abstract"
  ),
  scene(
    "teal-apricot",
    "Teal and apricot heavily blurred color fields with fine grain",
    "light",
    "abstract"
  ),
  scene(
    "plum-coral",
    "Plum and coral heavily blurred color fields with fine grain",
    "dark",
    "abstract"
  ),
  scene(
    "azure-apricot",
    "Azure and apricot softly blurred color fields with fine grain",
    "light",
    "abstract"
  ),
  scene(
    "sky-peach",
    "Sky blue and peach heavily blurred color fields with fine grain",
    "light",
    "abstract"
  ),
  scene(
    "fuchsia-cobalt",
    "Fuchsia and cobalt heavily blurred color fields with fine grain",
    "dark",
    "abstract"
  ),
  scene(
    "golden-coral",
    "Golden yellow and coral heavily blurred color fields with fine grain",
    "light",
    "abstract"
  ),
];

/** Legacy IDs are lookup-only aliases; retired artwork is archived in docs. */
export const sceneAliases: Record<string, string> = {
  "blue-ridge-night": "fuchsia-cobalt",
  "cloud-meadow": "sky-peach",
  "cobalt-fade": "cobalt-pink",
  "cyan-aurora": "teal-apricot",
  "dune-shadow": "golden-coral",
  "ember-drift": "plum-coral",
  "ember-drift-warm": "amber-violet",
  "ember-streaks": "amber-violet",
  "golden-ridge": "violet-tangerine",
  "lake-camp": "teal-apricot",
  "lilac-bloom": "coral-lavender",
  "linen-texture": "azure-apricot",
  "meadow-haze": "teal-apricot",
  "moonrise-valley": "plum-coral",
  "nebula-canyon": "fuchsia-cobalt",
  "pale-iridescence": "coral-lavender",
  "prism-meadow": "coral-cyan",
  "rust-peak": "golden-coral",
  "silk-waves": "sky-peach",
  "watercolor-grove": "azure-apricot",
};

export const scenes: Scene[] = approvedAbstracts;

/**
 * Card art, for demos where the component is a finish applied over a printed
 * face — holographic foil above all. The artwork carries the whole card, so a
 * demo needs no fake name, HP or rarity block built around it.
 */
const CARD_BASE = "https://ik.imagekit.io/16u211libb/smoothui/cards";

export const cards: Scene[] = [
  {
    alt: "Nymara — Eclipse Guardian: a violet-winged, antlered fantasy creature above a ruined arch, framed as a Moonveil collectible card",
    id: "nymara",
    kind: "photo",
    src: `${CARD_BASE}/nymara.webp`,
    title: "Nymara — Eclipse Guardian",
    tone: "dark",
  },
];

export const landscapes: Scene[] = [
  {
    alt: "AI-generated black-sand coast with foaming surf, green volcanic cliffs and a warm horizon",
    id: "volcanic-coast",
    kind: "photo",
    src: "https://ik.imagekit.io/16u211libb/smoothui/landscapes/volcanic-coast.webp",
    title: "Volcanic coast",
    tone: "dark",
  },
  {
    alt: "AI-generated terracotta dunes with sweeping wind-shaped ridges and distant blue mountains",
    id: "terracotta-dunes",
    kind: "photo",
    src: "https://ik.imagekit.io/16u211libb/smoothui/landscapes/terracotta-dunes.webp",
    title: "Terracotta dunes",
    tone: "dark",
  },
  {
    alt: "AI-generated green rice terraces curving around misty hills in warm morning light",
    id: "emerald-terraces",
    kind: "photo",
    src: "https://ik.imagekit.io/16u211libb/smoothui/landscapes/emerald-terraces.webp",
    title: "Emerald terraces",
    tone: "light",
  },
  {
    alt: "AI-generated turquoise icebergs reflected in a calm lagoon beneath snowy mountains and a pink sky",
    id: "glacial-lagoon",
    kind: "photo",
    src: "https://ik.imagekit.io/16u211libb/smoothui/landscapes/glacial-lagoon.webp",
    title: "Glacial lagoon",
    tone: "light",
  },
  {
    alt: "AI-generated turquoise river winding around a sandstone canyon beneath a clear blue sky",
    id: "turquoise-canyon",
    kind: "photo",
    src: "https://ik.imagekit.io/16u211libb/smoothui/landscapes/turquoise-canyon.webp",
    title: "Turquoise canyon",
    tone: "light",
  },
  {
    alt: "Generated alpine mountain peaks above blue valleys in soft peach dawn light",
    id: "alpine-dawn",
    kind: "photo",
    src: "https://ik.imagekit.io/16u211libb/smoothui/landscapes/alpine-dawn.webp",
    title: "Alpine dawn",
    tone: "light",
  },
  {
    alt: "Generated turquoise sea and white surf between warm rocky coastal cliffs",
    id: "tidal-cove",
    kind: "photo",
    src: "https://ik.imagekit.io/16u211libb/smoothui/landscapes/tidal-cove.webp",
    title: "Tidal cove",
    tone: "light",
  },
  {
    alt: "Generated evergreen forest with moss, turquoise mist and golden sunlight",
    id: "emerald-forest",
    kind: "photo",
    src: "https://ik.imagekit.io/16u211libb/smoothui/landscapes/emerald-forest.webp",
    title: "Emerald forest",
    tone: "dark",
  },
];

export const events: Scene[] = [
  {
    alt: "Generated outdoor cinema in a garden at dusk, with a glowing screen, rows of chairs and string lights",
    id: "open-air-cinema",
    kind: "photo",
    src: "https://ik.imagekit.io/16u211libb/smoothui/events/open-air-cinema.webp",
    title: "Open-Air Cinema",
    tone: "dark",
  },
  {
    alt: "Generated surfers carrying boards toward ocean waves under a peach sunrise",
    id: "dawn-patrol",
    kind: "photo",
    src: "https://ik.imagekit.io/16u211libb/smoothui/events/dawn-patrol.webp",
    title: "Dawn Patrol",
    tone: "light",
  },
  {
    alt: "Generated candlelit supper gathering around a long table in a courtyard",
    id: "supper-club",
    kind: "photo",
    src: "https://ik.imagekit.io/16u211libb/smoothui/events/supper-club.webp",
    title: "Supper Club",
    tone: "dark",
  },
  {
    alt: "Generated group practicing yoga on a terrace overlooking the sea at sunrise",
    id: "sunrise-yoga",
    kind: "photo",
    src: "https://ik.imagekit.io/16u211libb/smoothui/events/sunrise-yoga.webp",
    title: "Sunrise Yoga",
    tone: "dark",
  },
];

export const sceneById = (id: string): Scene | undefined =>
  scenes.find((item) => item.id === (sceneAliases[id] ?? id)) ??
  landscapes.find((item) => item.id === id) ??
  events.find((item) => item.id === id) ??
  cards.find((item) => item.id === id) ??
  castPeople.find((item) => item.id === id) ??
  castAnimals.find((item) => item.id === id);

/** Everything of one kind, for a demo that only wants photos or only texture. */
export const scenesOfKind = (kind: Scene["kind"]): Scene[] =>
  scenes.filter((item) => item.kind === kind);

/**
 * A stable slice, so a gallery renders the same images on every load rather
 * than a fresh random draw.
 */
export const someScenes = (count: number, offset = 0): Scene[] =>
  Array.from(
    { length: Math.min(count, scenes.length) },
    (_, index) => scenes[(offset + index) % scenes.length]
  );
