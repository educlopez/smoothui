import { landscapes, type Scene, sceneById } from "@smoothui/data/scenes";

function landscape(id: string): Scene {
  const asset = sceneById(id);
  if (!(asset && landscapes.some((scene) => scene.id === id))) {
    throw new Error(`Landing background must be a catalog landscape: ${id}`);
  }
  return asset;
}

/**
 * Intentional color rhythm for vivid home stages. Landscapes are blurred +
 * saturated in components; entramado sits on top via ArtworkPattern.
 */
export const landingBackgrounds = {
  ai: landscape("volcanic-coast"),
  features: landscape("turquoise-canyon"),
  testimonialFirst: landscape("alpine-dawn"),
  testimonialSecond: landscape("tidal-cove"),
};

/** Shared treatment for lead vivid stages (Features, AI). */
export const landingStageImageClass =
  "scale-110 object-cover blur-2xl saturate-[3] motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.15] motion-safe:group-focus-within:scale-[1.15] dark:opacity-55";

/** Testimonials keep full vibrancy — copy sits on the artwork with a scrim. */
export const landingTestimonialImageClass =
  "scale-110 object-cover blur-2xl saturate-[3]";
