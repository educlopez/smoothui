"use client";

import AuroraCurtain from "@repo/smoothui/components/aurora-curtain";

/**
 * A night sky with something under it.
 *
 * The tile used to be the curtain alone in a dark rectangle, which reads as a
 * gradient rather than as weather. An aurora only means anything against a
 * horizon and a time of night, so the panel carries both: the light moves
 * behind a ridge line, over a plate that could be a lock screen.
 */
const BOREAL = [
  "oklch(0.78 0.16 148)",
  "oklch(0.79 0.11 196)",
  "oklch(0.70 0.17 318)",
];

/** A low ridge, drawn rather than photographed so it stays crisp at any size. */
const RIDGE =
  "polygon(0% 100%, 0% 62%, 9% 54%, 17% 66%, 27% 44%, 36% 58%, 46% 33%, 57% 52%, 66% 40%, 75% 57%, 84% 47%, 92% 61%, 100% 52%, 100% 100%)";

const AuroraCurtainCanvasDemo = () => (
  <AuroraCurtain
    bands={3}
    blur={0.25}
    className="relative h-[210px] w-[320px] overflow-hidden rounded-2xl bg-[oklch(0.15_0.02_265)] ring-1 ring-[oklch(1_0_0_/_0.08)]"
    colors={BOREAL}
    direction="down"
    intensity={1}
    noise={0.6}
    speed={0.95}
  >
    {/* The horizon. Everything above it is sky, which is what makes the light
        above read as an aurora instead of a gradient. */}
    <div
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-[38%] bg-[oklch(0.11_0.015_265)]"
      style={{ clipPath: RIDGE }}
    />

    <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
      <div>
        <p className="font-semibold text-[34px] text-white tabular-nums leading-none tracking-tight">
          02:41
        </p>
        <p className="mt-1 text-[11px] text-white/60">Tromsø · −8°</p>
      </div>
      <span className="rounded-full bg-white/12 px-2 py-0.5 font-medium text-[10px] text-white/85 backdrop-blur-sm">
        Kp 6
      </span>
    </div>

    <p className="absolute inset-x-0 bottom-0 p-4 text-[11px] text-white/70">
      Aurora likely until dawn
    </p>
  </AuroraCurtain>
);

export default AuroraCurtainCanvasDemo;
