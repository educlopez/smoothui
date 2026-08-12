"use client";

import AuroraCurtain from "@repo/smoothui/components/aurora-curtain";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import { useState } from "react";

/**
 * Every literal below is authored in oklch. Within a palette the three hues sit
 * at close to one perceptual lightness, each taking a comparable share of its
 * own chroma ceiling, so no single ribbon reads as the loud one.
 */
const PALETTES = [
  {
    // The real thing: green low, cyan mid, a violet upper band.
    colors: [
      "oklch(0.78 0.16 148)",
      "oklch(0.79 0.11 196)",
      "oklch(0.70 0.17 318)",
    ],
    id: "boreal",
    label: "Boreal",
  },
  {
    // Resolved from the SmoothUI theme, so it tracks light and dark.
    colors: ["var(--color-green)", "var(--color-blue)", "var(--color-brand)"],
    id: "theme",
    label: "Theme",
  },
  {
    // A warm sky: amber, ember red, magenta.
    colors: [
      "oklch(0.82 0.15 88)",
      "oklch(0.68 0.19 28)",
      "oklch(0.70 0.18 340)",
    ],
    id: "ember",
    label: "Ember",
  },
] as const;

/** Clean, fine, filmic, heavy — four stops that read differently on screen. */
const GRAIN_STEPS = [0, 0.35, 0.7, 1] as const;
const GRAIN_LABELS = ["clean", "fine", "filmic", "heavy"] as const;

/** Meter bars. Heights are literal classes so Tailwind can see them. */
const GRAIN_TICKS = [
  { className: "h-[5px]", id: "low", step: 1 },
  { className: "h-[9px]", id: "mid", step: 2 },
  { className: "h-[13px]", id: "high", step: 3 },
] as const;

export default function AuroraCurtainDemo() {
  const [paletteIndex, setPaletteIndex] = useState(0);
  const [grainStep, setGrainStep] = useState(2);
  const [isFrozen, setIsFrozen] = useState(false);

  const palette = PALETTES[paletteIndex];
  const grain = GRAIN_STEPS[grainStep];

  return (
    <div className="w-full">
      <AuroraCurtain
        bands={5}
        // A fixed dark surface: an aurora only exists against a night sky, so
        // this one panel opts out of the page theme on purpose.
        className="w-full rounded-2xl bg-[oklch(0.15_0.02_265)] ring-1 ring-[oklch(1_0_0_/_0.08)]"
        colors={[...palette.colors]}
        direction="down"
        intensity={0.95}
        noise={grain}
        paused={isFrozen}
        speed={0.9}
      >
        <div className="relative flex min-h-[460px] flex-col justify-end p-6 sm:p-9">
          {/* Legibility scrim, not decoration: the ribbons gather at the top,
              and this holds the copy at a fixed contrast as they drift. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[oklch(0.13_0.02_265)] via-[oklch(0.13_0.02_265_/_0.72)] to-transparent"
          />

          <div className="relative flex flex-col items-start gap-4">
            <h2 className="max-w-[22ch] text-balance font-semibold text-[2.25rem] text-[oklch(0.97_0.005_265)] leading-[1.05] tracking-tight sm:text-[2.75rem]">
              Northern lights that cost one draw call.
            </h2>
            <p className="max-w-[48ch] text-[oklch(0.84_0.02_265)] text-sm sm:text-base">
              Five ribbons fold through value noise and the film grain is
              re-seeded every frame, from a single WebGL2 canvas.
            </p>
            <SmoothButton
              color="accent"
              onClick={() => setIsFrozen((previous) => !previous)}
              shape="pill"
              size="sm"
              variant="solid"
            >
              {isFrozen ? "Resume the drift" : "Freeze the drift"}
            </SmoothButton>
          </div>

          {/* Floating instrument panel: the swatches carry the actual ribbon
              colours and the meter carries the actual grain strength, so the
              controls look like the thing they change. */}
          <div className="absolute top-4 right-4 flex items-center gap-2.5 rounded-xl border border-[oklch(1_0_0_/_0.1)] bg-[oklch(0.13_0.02_265_/_0.78)] p-1.5">
            <div className="flex items-center gap-1">
              {PALETTES.map((option, index) => (
                <button
                  aria-label={`${option.label} palette`}
                  aria-pressed={index === paletteIndex}
                  className={
                    index === paletteIndex
                      ? "size-6 scale-105 rounded-[5px] ring-2 ring-brand ring-offset-1 ring-offset-[oklch(0.13_0.02_265)] transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
                      : "size-6 rounded-[5px] ring-1 ring-[oklch(1_0_0_/_0.16)] transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-105 motion-reduce:transition-none"
                  }
                  key={option.id}
                  onClick={() => setPaletteIndex(index)}
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${option.colors.join(", ")})`,
                  }}
                  type="button"
                />
              ))}
            </div>

            <div className="h-6 w-px bg-[oklch(1_0_0_/_0.12)]" />

            <button
              aria-label={`Film grain ${GRAIN_LABELS[grainStep]}. Cycle to the next strength.`}
              className="flex items-center gap-2 rounded-lg px-2 py-1 text-[oklch(0.9_0.01_265)] transition-colors duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[oklch(1_0_0_/_0.08)] motion-reduce:transition-none"
              onClick={() =>
                setGrainStep((previous) => (previous + 1) % GRAIN_STEPS.length)
              }
              type="button"
            >
              <span aria-hidden="true" className="flex items-end gap-[3px]">
                {GRAIN_TICKS.map((tick) => (
                  <span
                    className={
                      tick.step <= grainStep
                        ? `${tick.className} w-[3px] rounded-full bg-brand opacity-100 transition-opacity duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none`
                        : `${tick.className} w-[3px] rounded-full bg-[oklch(1_0_0_/_0.55)] opacity-35 transition-opacity duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none`
                    }
                    key={tick.id}
                  />
                ))}
              </span>
              <span className="font-medium text-xs tabular-nums">
                grain {grain.toFixed(2)}
              </span>
            </button>
          </div>
        </div>
      </AuroraCurtain>
    </div>
  );
}
