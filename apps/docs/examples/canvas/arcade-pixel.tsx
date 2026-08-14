"use client";

import ArcadePixel, {
  ARCADE_SPRITES,
} from "@repo/smoothui/components/arcade-pixel";
import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * One marcher on a cabinet screen, swapping its two frames forever — the
 * original two-frame animation, which needs no pointer and no controls.
 *
 * Nothing else shares the screen: a second `ArcadePixel` running a text reveal
 * spends half its cycle unlit, and an empty grid of dark cells beside a lit
 * sprite reads as a rendering fault rather than as a second element.
 */
const GREEN_PHOSPHOR = [
  "transparent",
  "oklch(0.7 0.21 145)",
  "oklch(0.8 0.24 145)",
  "oklch(0.88 0.2 145)",
  "oklch(0.95 0.09 145)",
];

const ALIEN_FRAMES = [ARCADE_SPRITES.alien, ARCADE_SPRITES.alienAlt];
const MARCH_INTERVAL_MS = 520;

const ArcadePixelCanvasDemo = () => {
  const shouldReduceMotion = useReducedMotion();
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }
    const id = setInterval(() => {
      setFrame((value) => (value + 1) % ALIEN_FRAMES.length);
    }, MARCH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [shouldReduceMotion]);

  return (
    <div className="flex h-[160px] w-[280px] items-center justify-center rounded-2xl bg-[oklch(0.17_0.035_145)] ring-1 ring-[oklch(0.8_0.24_145_/_0.16)]">
      <ArcadePixel
        crt
        glow={0.8}
        palette={GREEN_PHOSPHOR}
        pixelSize={12}
        scanlines
        sprite={ALIEN_FRAMES[frame]}
      />
    </div>
  );
};

export default ArcadePixelCanvasDemo;
