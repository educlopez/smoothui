"use client";

import HolographicFoil from "@repo/smoothui/components/holographic-foil";
import { sceneById } from "@smoothui/data/scenes";

/**
 * A printed card with foil over it, which is what holo foil is actually for.
 * The tilt is off — the pointer belongs to the canvas here — so the only motion
 * is the idle sheen sweep, which loops on its own.
 *
 * The card face carries the whole tile, so there is no name plate or serial
 * strip built around it competing with the finish.
 */
const CARD = sceneById("moon-tarot");

const HolographicFoilCanvasDemo = () => (
  <HolographicFoil
    className="w-[190px] overflow-hidden rounded-xl"
    glare={0.6}
    intensity={0.78}
    pattern="prism"
    sheenSpeed={1.1}
    tilt={false}
  >
    <img
      alt={CARD?.alt ?? ""}
      className="block w-full select-none"
      draggable={false}
      height={676}
      src={`${CARD?.src}?tr=w-380,f-auto`}
      width={380}
    />
  </HolographicFoil>
);

export default HolographicFoilCanvasDemo;
