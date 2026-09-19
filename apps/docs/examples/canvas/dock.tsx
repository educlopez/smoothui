"use client";

import type { DockItem } from "@repo/smoothui/components/dock";
import Dock from "@repo/smoothui/components/dock";
import { dockIcons } from "@smoothui/data/app-icons";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/** One full there-and-back pass of the phantom cursor. */
const SWEEP_MS = 5200;
/** Keeps the sweep off the very edge, where the magnification is flat. */
const SWEEP_INSET = 18;
const TWO_PI = Math.PI * 2;
const HALF = 0.5;

const items: DockItem[] = dockIcons.map((app, index) => ({
  // The first two read as "running" — a dock with nothing open looks staged.
  active: index < 2,
  icon: (
    <img
      alt=""
      className="size-full rounded-[22%]"
      draggable={false}
      src={`${app.src}?tr=w-128`}
    />
  ),
  id: app.id,
  label: app.name,
}));

/**
 * A dock with no cursor over it is a row of icons. So the demo lends it one:
 * a `pointermove` is dispatched at the dock every frame, tracing a slow
 * cosine back and forth across the tiles. The magnification that answers is
 * the component's own — nothing here fakes the scaling.
 */
const DockCanvasDemo = () => {
  const shouldReduceMotion = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }
    const dock = hostRef.current?.querySelector("nav");
    if (!dock) {
      return;
    }

    let frame = 0;
    const started = performance.now();

    const tick = (now: number) => {
      const rect = dock.getBoundingClientRect();
      // Off-screen tiles are `content-visibility: hidden`, so they measure
      // zero — pointing at that would slam the magnification to the edge.
      if (rect.width > 0) {
        const phase =
          (1 - Math.cos(((now - started) / SWEEP_MS) * TWO_PI)) * HALF;
        dock.dispatchEvent(
          new PointerEvent("pointermove", {
            bubbles: true,
            clientX:
              rect.left + SWEEP_INSET + phase * (rect.width - SWEEP_INSET * 2),
            clientY: rect.top + rect.height * HALF,
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
    <div
      className="flex h-[86px] w-[320px] items-center justify-center"
      ref={hostRef}
    >
      <Dock
        baseSize={42}
        distance={120}
        gap={8}
        items={items}
        magnification={1.5}
      />
    </div>
  );
};

export default DockCanvasDemo;
