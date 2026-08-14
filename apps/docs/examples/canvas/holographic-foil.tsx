"use client";

import HolographicFoil from "@repo/smoothui/components/holographic-foil";

/**
 * A collectible card, which is the thing holo foil is actually for. The tilt is
 * off — the pointer belongs to the canvas here — so the only motion is the idle
 * sheen sweep, which loops on its own.
 */
const HolographicFoilCanvasDemo = () => (
  <HolographicFoil
    className="w-[240px]"
    glare={0.6}
    intensity={0.78}
    pattern="prism"
    sheenSpeed={1.1}
    tilt={false}
  >
    <div className="flex flex-col gap-3 p-3">
      <img
        alt="Rain-lit street at night"
        className="h-[152px] w-full rounded-xl object-cover opacity-90"
        src="https://ik.imagekit.io/16u211libb/smoothui/backgrounds/foil-landscape.jpg?tr=w-480,f-auto"
      />
      <div className="flex items-end justify-between gap-2 px-1 pb-1">
        <div className="min-w-0">
          <p className="truncate font-semibold text-sm text-white tracking-tight">
            Nightfall
          </p>
          <p className="truncate text-white/60 text-xs">Series 04 · Holo</p>
        </div>
        <span className="shrink-0 rounded-full bg-white/12 px-2 py-0.5 font-medium text-[10px] text-white/85">
          012 / 250
        </span>
      </div>
    </div>
  </HolographicFoil>
);

export default HolographicFoilCanvasDemo;
