import { type Scene, sceneById } from "@smoothui/data/scenes";

function background(id: string): Scene {
  const asset = sceneById(id);
  if (!asset || asset.kind !== "abstract") {
    throw new Error(`Landing background must be a catalog abstract: ${id}`);
  }
  return asset;
}

/** Intentional color rhythm; every source comes from the shared media catalog. */
export const landingBackgrounds = {
  ai: background("fuchsia-cobalt"),
  features: background("coral-cyan"),
  testimonialFirst: background("violet-tangerine"),
  testimonialSecond: background("teal-apricot"),
  uicraft: background("cobalt-pink"),
};
