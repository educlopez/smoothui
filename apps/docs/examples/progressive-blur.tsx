"use client";

import type { ProgressiveBlurDirection } from "@repo/smoothui/components/progressive-blur";
import ProgressiveBlur from "@repo/smoothui/components/progressive-blur";
import { useState } from "react";

const DIRECTIONS: ProgressiveBlurDirection[] = [
  "bottom",
  "top",
  "left",
  "right",
  "radial",
];

const ROWS = [
  "Progressive blur ramps across many layers",
  "Each layer doubles the blur radius",
  "And every layer is masked by a shifted gradient",
  "So there is never a visible seam",
  "Unlike a single backdrop-filter with one mask",
  "Which always shows a hard cut somewhere",
  "Rauno Freiberg popularised the technique",
  "It costs nothing at runtime — no rAF, no JS",
  "Only backdrop-filter and mask-image",
  "Scroll this list to see it hold up",
];

export default function ProgressiveBlurDemo() {
  const [direction, setDirection] =
    useState<ProgressiveBlurDirection>("bottom");
  const [layers, setLayers] = useState(6);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-4 py-8">
      <div className="flex flex-wrap items-center gap-2">
        {DIRECTIONS.map((item) => (
          <button
            aria-pressed={direction === item}
            className={
              direction === item
                ? "rounded-full bg-brand px-3 py-1.5 font-medium text-sm text-white"
                : "rounded-full border border-foreground/20 px-3 py-1.5 font-medium text-muted-foreground text-sm"
            }
            key={item}
            onClick={() => setDirection(item)}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>

      <label className="flex items-center gap-3 text-muted-foreground text-sm">
        Layers: {layers}
        <input
          className="w-40 accent-brand"
          max={12}
          min={2}
          onChange={(event) => setLayers(Number(event.target.value))}
          step={1}
          type="range"
          value={layers}
        />
      </label>

      <div className="relative h-72 overflow-hidden rounded-2xl border border-foreground/20 bg-background">
        <div className="h-full overflow-y-auto p-6">
          <ul className="space-y-3">
            {ROWS.map((row) => (
              <li className="text-foreground text-sm leading-relaxed" key={row}>
                {row}
              </li>
            ))}
          </ul>
        </div>
        <ProgressiveBlur blur={20} direction={direction} layers={layers} />
      </div>

      <p className="text-muted-foreground text-xs">
        The overlay is <code className="text-foreground">aria-hidden</code> and{" "}
        <code className="text-foreground">pointer-events: none</code>, so the
        list underneath stays scrollable and readable by screen readers.
      </p>
    </div>
  );
}
