"use client";

import HolographicFoil from "@repo/smoothui/components/holographic-foil";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import { useState } from "react";

const LEVELS = [
  { label: "Subtle", value: 0.2 },
  { label: "Standard", value: 0.6 },
  { label: "Full holo", value: 1 },
];

/** Drives the art frame hairline, the HP figure and the rarity gem. */
const EDGE = "oklch(0.85 0.09 205)";
const SCRIM = "oklch(0.1 0.012 274 / 0.94)";

const MOVES = [
  { damage: "40", name: "Low Growl" },
  { damage: "90", name: "Split the Light" },
];

/**
 * One card, presented on the docs frame: a real collectible, not a thumbnail.
 * 5:7 stock, a printed frame, an art window the foil shows through, and a stat
 * block on its own scrim. The card carries its own dark stock, so it needs no
 * stage around it — the format is what sells foil, and the artwork is
 * deliberately generic photography so nothing borrows anyone else's characters.
 */
const HolographicFoilDemo = () => {
  const [intensity, setIntensity] = useState(0.6);

  return (
    <div className="flex w-full flex-col items-center gap-6 py-2">
      <HolographicFoil
        className="w-60 shadow-[0_26px_50px_-18px_oklch(0_0_0/0.55)]"
        glare={0.55}
        intensity={intensity}
        pattern="prism"
        sheenSpeed={0.9}
        tilt
      >
        {/* 5:7 is the trading-card ratio. The padding is bare card stock: it is
            where the foil print shows with nothing over it. */}
        <div className="flex aspect-[5/7] flex-col gap-[3%] p-[5.5%]">
          <div
            className="flex items-baseline justify-between gap-2 rounded-md px-2 py-1"
            style={{ backgroundColor: SCRIM }}
          >
            <p className="truncate font-semibold text-[0.8125rem] text-white tracking-tight">
              Dawnmane
            </p>
            <span
              className="shrink-0 font-semibold text-[0.875rem] tabular-nums"
              style={{ color: EDGE }}
            >
              130
              <span className="ml-0.5 text-[0.5625rem] text-white/50">HP</span>
            </span>
          </div>

          {/* The art window is the one place the foil prints *through* the
              image, so the photo is held below full opacity. */}
          <div
            className="min-h-0 flex-1 overflow-hidden rounded-sm"
            style={{ boxShadow: `0 0 0 1px ${EDGE}66` }}
          >
            <img
              alt="Dawnmane card artwork"
              className="size-full object-cover opacity-[0.74]"
              src="https://ik.imagekit.io/16u211libb/smoothui/backgrounds/foil-portrait.jpg?tr=w-640,f-auto"
            />
          </div>

          <p
            className="rounded-sm px-1 py-px text-[0.5625rem] uppercase tracking-[0.14em]"
            style={{ backgroundColor: SCRIM, color: EDGE }}
          >
            Stage 2 · Beast
          </p>

          <div
            className="rounded-md px-2 py-1.5"
            style={{ backgroundColor: SCRIM }}
          >
            {MOVES.map((move) => (
              <div
                className="flex items-baseline justify-between gap-2 py-[1px] text-[0.625rem]"
                key={move.name}
              >
                <span className="truncate text-white/80">{move.name}</span>
                <span className="shrink-0 font-semibold text-white tabular-nums">
                  {move.damage}
                </span>
              </div>
            ))}
          </div>

          <div
            className="flex items-center justify-between rounded-sm px-1 py-px text-[0.5625rem]"
            style={{ backgroundColor: SCRIM }}
          >
            <span className="flex items-center gap-1 text-white/70">
              <span
                aria-hidden="true"
                className="size-1.5 rotate-45 rounded-[1px]"
                style={{ backgroundColor: EDGE }}
              />
              Mythic
            </span>
            <span className="text-white/40 tabular-nums">042 / 165</span>
          </div>
        </div>
      </HolographicFoil>

      <div className="flex flex-col items-center gap-2.5">
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
        <p className="text-muted-foreground text-xs">
          Hover the card to tilt the print and move the foil.
        </p>
      </div>
    </div>
  );
};

export default HolographicFoilDemo;
