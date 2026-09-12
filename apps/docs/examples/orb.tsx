"use client";

import Orb, { type OrbProps } from "@repo/smoothui/components/orb";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import { useState } from "react";

/**
 * Presets first, sliders second.
 *
 * Twenty-two knobs tell you the component is configurable; four finished orbs
 * tell you what it is for. The three sliders underneath are the ones that
 * change the character of the thing rather than trim it.
 */
const PRESETS: { id: string; label: string; note: string; config: OrbProps }[] =
  [
    {
      config: {
        aberration: 0.8,
        blobScale: 3,
        colors: ["#f25aed", "#ffffff"],
        inner: 0.38,
        rim: 1.3,
      },
      id: "bloom",
      label: "Bloom",
      note: "Magenta against white. The lightness gap is what makes the marbling visible at all.",
    },
    {
      config: {
        blobScale: 1.7,
        colors: ["#06121f", "#2f6fed", "#8ad8ff", "#ffffff"],
        contrast: 1.2,
        inner: 0.22,
        iridescence: 0.5,
        rim: 2,
        specular: 0.7,
      },
      id: "glass",
      label: "Glass",
      note: "Four stops and a hard rim. Iridescence rotates the hue toward the edge, the way a bubble does.",
    },
    {
      config: {
        blobScale: 4.2,
        colors: ["#ff7a1a", "#ffd166"],
        flow: 0.85,
        inner: 0.7,
        rim: 0.6,
        shading: 0,
        specular: 0.1,
        turbulence: 0.6,
      },
      id: "ember",
      label: "Ember",
      note: "Lit from within rather than from the side, so it reads as a lamp instead of a ball.",
    },
    {
      config: {
        aberration: 0.2,
        blobScale: 2.4,
        colors: ["#7c5cff", "#12f7d6"],
        glow: 0.55,
        grain: 0.2,
        rim: 1.1,
        turbulence: 0.55,
        wobble: 0.8,
      },
      id: "drop",
      label: "Drop",
      note: "Wobble deforms the silhouette and the halo spills past it. A liquid drop, not a sphere.",
    },
  ];

const SLIDERS = [
  { key: "blobScale", label: "Blob size", max: 6, min: 0.5, step: 0.1 },
  { key: "flow", label: "Motion", max: 1.5, min: 0, step: 0.05 },
  { key: "wobble", label: "Wobble", max: 1.5, min: 0, step: 0.05 },
] as const;

export default function OrbDemo() {
  const [id, setId] = useState(PRESETS[0].id);
  const [overrides, setOverrides] = useState<Partial<OrbProps>>({});

  const preset = PRESETS.find((item) => item.id === id) ?? PRESETS[0];
  const config = { ...preset.config, ...overrides };

  const choose = (next: string) => {
    setId(next);
    // Sliders show the new preset's own values rather than keeping the last
    // ones, which would misrepresent the preset you just picked.
    setOverrides({});
  };

  return (
    <div className="flex w-full flex-col items-center gap-7 py-8">
      <div className="flex min-h-[300px] items-center justify-center">
        <Orb key={id} {...config} size={280} />
      </div>

      <div className="flex w-full max-w-md flex-col items-center gap-4">
        <div className="flex flex-wrap items-center justify-center gap-1">
          {PRESETS.map((item) => (
            <SmoothButton
              aria-pressed={item.id === id}
              color={item.id === id ? "accent" : undefined}
              key={item.id}
              onClick={() => choose(item.id)}
              size="xs"
              variant={item.id === id ? "solid" : "ghost"}
            >
              {item.label}
            </SmoothButton>
          ))}
        </div>

        <p className="max-w-sm text-balance text-center text-muted-foreground text-xs leading-relaxed">
          {preset.note}
        </p>

        <div className="flex w-full flex-col gap-2">
          {SLIDERS.map((slider) => {
            const value = Number(
              config[slider.key] ?? PRESETS[0].config[slider.key] ?? 0
            );
            return (
              <label
                className="flex items-center gap-3 text-xs"
                key={slider.key}
              >
                <span className="w-20 shrink-0 text-muted-foreground">
                  {slider.label}
                </span>
                <input
                  className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-foreground/15 accent-brand"
                  max={slider.max}
                  min={slider.min}
                  onChange={(event) =>
                    setOverrides((prev) => ({
                      ...prev,
                      [slider.key]: Number(event.target.value),
                    }))
                  }
                  step={slider.step}
                  type="range"
                  value={value}
                />
                <span className="w-8 shrink-0 text-right text-muted-foreground tabular-nums">
                  {value.toFixed(1)}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
