"use client";

import TiltCard from "@repo/smoothui/components/tilt-card";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/** One lap of the phantom cursor around the card. */
const ORBIT_MS = 6400;
/** Vertical lap runs at a different rate, so the path never repeats a line. */
const CROSS_RATE = 0.62;
/** How far from the centre the orbit reaches, as a fraction of the card. */
const REACH = 0.42;
const CENTRE = 0.5;
const TWO_PI = Math.PI * 2;

/**
 * Tilt, glare and parallax all read the pointer, so the demo supplies one:
 * `pointermove` is dispatched at the card each frame along a slow open orbit.
 * The card leans and the highlight travels across it exactly as it would under
 * a real cursor — the component is doing all of the work.
 */
const TiltCardCanvasDemo = () => {
  const shouldReduceMotion = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }
    const card = hostRef.current?.firstElementChild;
    if (!card) {
      return;
    }

    let frame = 0;
    const started = performance.now();

    const tick = (now: number) => {
      const rect = card.getBoundingClientRect();
      if (rect.width > 0) {
        const turn = ((now - started) / ORBIT_MS) * TWO_PI;
        card.dispatchEvent(
          new PointerEvent("pointermove", {
            bubbles: true,
            clientX: rect.left + rect.width * (CENTRE + Math.sin(turn) * REACH),
            clientY:
              rect.top +
              rect.height * (CENTRE + Math.sin(turn * CROSS_RATE) * REACH),
            pointerType: "mouse",
          })
        );
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [shouldReduceMotion]);

  return (
    <div className="w-[240px]" ref={hostRef}>
      <TiltCard
        className="w-[240px] overflow-hidden rounded-[20px] shadow-[0_22px_50px_-26px_rgb(0_0_0/0.65)]"
        glareOpacity={0.32}
        maxTilt={16}
        parallax
        perspective={800}
        scale={1.04}
      >
        <div className="relative h-[152px] w-full overflow-hidden">
          <img
            alt="Warm ember bands over a plum ground"
            className="h-full w-full scale-110 object-cover"
            data-tilt-depth="0.18"
            draggable={false}
            src="https://ik.imagekit.io/16u211libb/smoothui/scenes/ember-drift-warm.webp?tr=w-480,h-320,f-auto"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_top,oklch(0.16_0.02_264/0.88),oklch(0.16_0.02_264/0.1)_62%)]"
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4" data-tilt-depth="0.55">
          <p className="font-medium text-[10px] text-white/65 uppercase tracking-[0.16em]">
            Ridge pass
          </p>
          <p className="font-semibold text-[17px] text-white leading-tight">
            Northern Traverse
          </p>
          <p className="text-[11px] text-white/70 tabular-nums">
            Gate 04 · 09:41
          </p>
        </div>
      </TiltCard>
    </div>
  );
};

export default TiltCardCanvasDemo;
