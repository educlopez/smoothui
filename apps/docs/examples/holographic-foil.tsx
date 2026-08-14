"use client";

import type { HolographicFoilPattern } from "@repo/smoothui/components/holographic-foil";
import HolographicFoil from "@repo/smoothui/components/holographic-foil";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import { sceneById } from "@smoothui/data/scenes";
import { useState } from "react";

const LEVELS = [
  { label: "Subtle", value: 0.2 },
  { label: "Standard", value: 0.6 },
  { label: "Full holo", value: 1 },
];

const PATTERNS: HolographicFoilPattern[] = ["prism", "aurora", "gold", "oil"];

/**
 * A printed card with foil laid over it, and nothing else.
 *
 * This used to assemble a fake collectible in the DOM — name plate, HP, a move
 * list, a rarity strip — around a stock photo. All of that competed with the
 * effect the page is about. A real card face carries itself, so the demo is the
 * artwork at full bleed with the foil on top, and the controls change only the
 * finish.
 */
const CARD = sceneById("moon-tarot");

const HolographicFoilDemo = () => {
  const [intensity, setIntensity] = useState(0.6);
  const [pattern, setPattern] = useState<HolographicFoilPattern>("prism");

  return (
    <div className="flex w-full flex-col items-center gap-6 py-2">
      <HolographicFoil
        className="w-60 overflow-hidden rounded-xl shadow-[0_26px_50px_-18px_oklch(0_0_0/0.55)]"
        glare={0.55}
        intensity={intensity}
        pattern={pattern}
        sheenSpeed={0.9}
        tilt
      >
        <img
          alt={CARD?.alt ?? ""}
          className="block w-full select-none"
          draggable={false}
          height={1138}
          src={`${CARD?.src}?tr=w-640,f-auto`}
          width={640}
        />
      </HolographicFoil>

      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-1">
          {LEVELS.map((level) => {
            const isActive = level.value === intensity;
            return (
              <SmoothButton
                aria-pressed={isActive}
                color={isActive ? "accent" : undefined}
                key={level.label}
                onClick={() => setIntensity(level.value)}
                size="xs"
                variant={isActive ? "solid" : "ghost"}
              >
                {level.label}
              </SmoothButton>
            );
          })}
        </div>

        <div className="flex items-center gap-1">
          {PATTERNS.map((name) => {
            const isActive = name === pattern;
            return (
              <SmoothButton
                aria-pressed={isActive}
                color={isActive ? "accent" : undefined}
                key={name}
                onClick={() => setPattern(name)}
                size="xs"
                variant={isActive ? "solid" : "ghost"}
              >
                {name}
              </SmoothButton>
            );
          })}
        </div>

        <p className="text-muted-foreground text-xs">
          Hover the card to tilt the print and move the foil.
        </p>
      </div>
    </div>
  );
};

export default HolographicFoilDemo;
