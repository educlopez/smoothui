/**
 * Background and decorative imagery for demos — the Super Visuals backgrounds
 * library, served from ImageKit.
 *
 * This replaced the random `picsum.photos` seeds. Random stock made every
 * gallery, carousel and card look like a different product; one curated set with
 * a consistent grade makes the docs read as one thing.
 *
 * Request the size you render: `?tr=w-640,f-auto`. Sources are ~1600px wide.
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
  /** Roughly how bright the image is, for choosing overlay and text colour. */
  tone: "light" | "dark";
}

const scene = (
  id: string,
  alt: string,
  tone: Scene["tone"],
  kind: Scene["kind"]
): Scene => ({ alt, id, kind, src: `${BASE}/${id}.webp`, tone });

export const scenes: Scene[] = [
  scene(
    "cloud-meadow",
    "A wildflower meadow under towering cumulus",
    "light",
    "photo"
  ),
  scene(
    "rust-peak",
    "A rust-red mountain against a pale sky",
    "light",
    "photo"
  ),
  scene(
    "blue-ridge-night",
    "Blue mountain ridges receding into night",
    "dark",
    "photo"
  ),
  scene(
    "moonrise-valley",
    "A huge moon rising over a forested valley",
    "dark",
    "photo"
  ),
  scene(
    "lake-camp",
    "A lit tent beside a still lake under peaks",
    "dark",
    "photo"
  ),
  scene(
    "prism-meadow",
    "A meadow under a rainbow and drifting sparks",
    "light",
    "photo"
  ),
  scene(
    "golden-ridge",
    "A mountainside catching low golden light",
    "dark",
    "photo"
  ),
  scene(
    "nebula-canyon",
    "A canyon under a churning violet nebula",
    "dark",
    "photo"
  ),
  scene(
    "dune-shadow",
    "A single pale dune crest in deep shadow",
    "dark",
    "photo"
  ),
  scene(
    "watercolor-grove",
    "A watercolour grove fading into white",
    "light",
    "photo"
  ),

  scene(
    "ember-drift",
    "Soft bands of ember red drifting into violet",
    "dark",
    "abstract"
  ),
  scene(
    "ember-drift-warm",
    "Warm ember bands over a plum ground",
    "dark",
    "abstract"
  ),
  scene(
    "ember-streaks",
    "Streaks of orange light across black",
    "dark",
    "abstract"
  ),
  scene(
    "silk-waves",
    "Pale blue silk folding in slow waves",
    "light",
    "abstract"
  ),
  scene(
    "cyan-aurora",
    "A cyan aurora smeared across pale blue",
    "light",
    "abstract"
  ),
  scene(
    "cobalt-fade",
    "A clean cobalt-to-white diagonal fade",
    "light",
    "abstract"
  ),
  scene("lilac-bloom", "A soft lilac bloom on near-white", "light", "abstract"),
  scene(
    "pale-iridescence",
    "Barely-there iridescence on off-white",
    "light",
    "abstract"
  ),
  scene(
    "meadow-haze",
    "Green and cream haze, like a field out of focus",
    "light",
    "abstract"
  ),
  scene(
    "linen-texture",
    "A woven off-white linen texture",
    "light",
    "abstract"
  ),
];

/**
 * Editorial portraits, for demos where a card *is* a person — a swipe deck, a
 * profile cover. Distinct from `@smoothui/data/people`, whose avatars are square
 * headshots meant for a 32px circle and which crop badly at card size.
 */
const PORTRAIT_BASE = "https://ik.imagekit.io/16u211libb/smoothui/portraits";

export const portraits: Scene[] = [
  {
    alt: "A woman with freckles against a clear blue sky",
    id: "sky-freckles",
    kind: "photo",
    src: `${PORTRAIT_BASE}/sky-freckles.webp`,
    tone: "light",
  },
  {
    alt: "A woman in sunlight against a warm plaster wall",
    id: "warm-wall",
    kind: "photo",
    src: `${PORTRAIT_BASE}/warm-wall.webp`,
    tone: "light",
  },
  {
    alt: "A woman at golden hour with hills behind her",
    id: "golden-hour",
    kind: "photo",
    src: `${PORTRAIT_BASE}/golden-hour.webp`,
    tone: "dark",
  },
  {
    alt: "A woman with wind-blown hair under scattered cloud",
    id: "windswept",
    kind: "photo",
    src: `${PORTRAIT_BASE}/windswept.webp`,
    tone: "light",
  },
  {
    alt: "A woman laughing, head tilted back against open sky",
    id: "open-sky",
    kind: "photo",
    src: `${PORTRAIT_BASE}/open-sky.webp`,
    tone: "light",
  },
];

/**
 * Card art, for demos where the component is a finish applied over a printed
 * face — holographic foil above all. The artwork carries the whole card, so a
 * demo needs no fake name, HP or rarity block built around it.
 */
const CARD_BASE = "https://ik.imagekit.io/16u211libb/smoothui/cards";

export const cards: Scene[] = [
  {
    alt: "Tarot card back: a moon phase wheel in gold and white on deep indigo",
    id: "moon-tarot",
    kind: "photo",
    src: `${CARD_BASE}/moon-tarot.webp`,
    tone: "dark",
  },
];

export const sceneById = (id: string): Scene | undefined =>
  scenes.find((item) => item.id === id) ??
  portraits.find((item) => item.id === id) ??
  cards.find((item) => item.id === id);

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
