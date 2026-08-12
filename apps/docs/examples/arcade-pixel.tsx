"use client";

import ArcadePixel, {
  ARCADE_SPRITES,
} from "@repo/smoothui/components/arcade-pixel";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * Phosphor palettes. Each ramp is authored in oklch and keeps one hue from end
 * to end, so it brightens without drifting: index 1 is the lit pixel, index 2
 * its highlight, index 3 and 4 the hotter core. Chroma peaks mid-ramp, where
 * sRGB has the most room at that lightness, then falls off as the core goes
 * white-hot -- the way a real phosphor dot actually saturates.
 */
const GREEN_PHOSPHOR = [
  "transparent",
  "oklch(0.7 0.21 145)",
  "oklch(0.8 0.24 145)",
  "oklch(0.88 0.2 145)",
  "oklch(0.95 0.09 145)",
];

const AMBER_PHOSPHOR = [
  "transparent",
  "oklch(0.72 0.15 71)",
  "oklch(0.81 0.16 71)",
  "oklch(0.89 0.13 71)",
  "oklch(0.96 0.06 71)",
];

/**
 * Full colour is categorical rather than tonal, so it deliberately breaks the
 * one-hue rule: lightness is held at 0.76 across all four entries and each hue
 * gets a similar fraction of its own chroma ceiling, so no single colour wins
 * the eye. Index 1 is the brand hue, 2 its highlight, 3 and 4 are accents.
 */
const FULL_COLOUR = [
  "transparent",
  "oklch(0.76 0.18 353)",
  "oklch(0.85 0.12 353)",
  "oklch(0.76 0.12 215)",
  "oklch(0.76 0.16 75)",
];

type PaletteId = "amber" | "colour" | "green";

const PALETTES: Record<
  PaletteId,
  { label: string; screen: string; swatch: string; values: string[] }
> = {
  amber: {
    label: "Amber",
    screen: "oklch(0.17 0.03 71)",
    swatch: "oklch(0.81 0.16 71)",
    values: AMBER_PHOSPHOR,
  },
  colour: {
    label: "Full colour",
    screen: "oklch(0.16 0.02 320)",
    swatch: "oklch(0.76 0.18 353)",
    values: FULL_COLOUR,
  },
  green: {
    label: "Green phosphor",
    screen: "oklch(0.17 0.035 145)",
    swatch: "oklch(0.8 0.24 145)",
    values: GREEN_PHOSPHOR,
  },
};

const PALETTE_ORDER: PaletteId[] = ["green", "amber", "colour"];

/**
 * The cabinet stays dark in both themes on purpose -- an arcade cabinet reads as
 * a physical object, not as a themed surface, and the emissive display only
 * works against a dark bezel.
 */
const CABINET_BACKGROUND =
  "linear-gradient(to bottom, oklch(0.28 0.008 285), oklch(0.17 0.008 285))";

const MARQUEE_TEXT =
  "HIGH SCORE 1250400 - PLAYER 1 - SMOOTHUI - INSERT COIN TO CONTINUE * ";

const ALIEN_FRAMES = [ARCADE_SPRITES.alien, ARCADE_SPRITES.alienAlt];
const ALIEN_FRAME_MS = 420;

export default function ArcadePixelDemo() {
  const shouldReduceMotion = useReducedMotion();
  const [paletteId, setPaletteId] = useState<PaletteId>("green");
  const [replayKey, setReplayKey] = useState(0);
  const [alienFrame, setAlienFrame] = useState(0);

  const palette = PALETTES[paletteId];

  // Sprite animation is two frames swapped on a timer, the way the original
  // boards did it. Held still when the visitor asked for reduced motion.
  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }
    const id = window.setInterval(() => {
      setAlienFrame((previous) => (previous + 1) % ALIEN_FRAMES.length);
    }, ALIEN_FRAME_MS);
    return () => window.clearInterval(id);
  }, [shouldReduceMotion]);

  const handleReplay = () => {
    setReplayKey((previous) => previous + 1);
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-8">
      <div
        className="rounded-[28px] border border-white/10 p-3 shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_18px_40px_-16px_rgba(0,0,0,0.7)]"
        style={{ backgroundImage: CABINET_BACKGROUND }}
      >
        <div
          className="flex h-[340px] flex-col justify-between gap-4 overflow-hidden rounded-[20px] p-5 shadow-[0_0_0_1px_rgba(0,0,0,0.6)_inset]"
          style={{ backgroundColor: palette.screen }}
        >
          <ArcadePixel
            animate="marquee"
            columns={80}
            crt
            glow={0.75}
            palette={palette.values}
            pixelSize={8}
            scanlines
            text={MARQUEE_TEXT}
          />

          <div className="flex flex-1 items-center justify-between gap-6">
            <div className="flex items-end gap-5">
              <ArcadePixel
                glow={0.7}
                palette={palette.values}
                pixelSize={11}
                scanlines
                sprite={ALIEN_FRAMES[alienFrame]}
              />
              <ArcadePixel
                animate="blink"
                glow={0.7}
                loop
                palette={palette.values}
                pixelSize={7}
                scanlines
                speed={0.7}
                sprite={ARCADE_SPRITES.heart}
              />
              <ArcadePixel
                glow={0.55}
                palette={palette.values}
                pixelSize={7}
                scanlines
                sprite={ARCADE_SPRITES.arrow}
              />
            </div>

            <div className="flex shrink-0 flex-col items-end gap-3">
              <ArcadePixel
                glow={0.55}
                palette={palette.values}
                pixelSize={5}
                scanlines
                text="1UP"
              />
              <ArcadePixel
                animate="type"
                glow={0.8}
                key={`score-${replayKey}`}
                palette={palette.values}
                pixelSize={8}
                scanlines
                text="042500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <ArcadePixel
              animate="blink"
              glow={0.8}
              loop
              palette={palette.values}
              pixelSize={6}
              scanlines
              text="READY"
            />
            <ArcadePixel
              animate="wipe"
              glow={0.6}
              key={`hi-${replayKey}`}
              palette={palette.values}
              pixelSize={6}
              scanlines
              speed={0.8}
              text="HI 999999"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          aria-label="Phosphor palette"
          className="flex items-center gap-1 rounded-xl border border-foreground/10 bg-background p-1"
          role="group"
        >
          {PALETTE_ORDER.map((id) => {
            const option = PALETTES[id];
            const isActive = id === paletteId;
            return (
              <button
                aria-pressed={isActive}
                className={`flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors ease-out ${
                  isActive
                    ? "bg-foreground/10 text-foreground"
                    : "text-foreground/60 hover:text-foreground"
                }`}
                key={id}
                onClick={() => setPaletteId(id)}
                type="button"
              >
                <span
                  aria-hidden="true"
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: option.swatch }}
                />
                {option.label}
              </button>
            );
          })}
        </div>

        <SmoothButton color="accent" onClick={handleReplay} variant="candy">
          Replay reveal
        </SmoothButton>
      </div>
    </div>
  );
}
