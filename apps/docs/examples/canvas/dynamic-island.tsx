"use client";

import DynamicIsland from "@repo/smoothui/components/dynamic-island";
import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * The island driven from the outside, so the morph plays by itself: pill, call,
 * notification, back to the pill. Its built-in view picker is hidden here — on
 * a canvas nobody is operating a demo, and an inert row of buttons would read
 * as chrome around the one thing worth looking at.
 *
 * The 200px stage the island reserves is trimmed to the pill by the window
 * below; only empty space is cut.
 */
const VIEWS = ["idle", "ring", "notification"] as const;
const VIEW_INTERVAL_MS = 3200;
const STAGE_OFFSET_Y = -48;
/**
 * Two rules, both scoped to this tile by the wrapper class.
 *
 * The first hides the component's built-in view picker: on a canvas nobody is
 * operating a demo, and an inert row of buttons reads as chrome.
 *
 * The second forces the swapped-in view visible. `DynamicIsland` mounts each
 * view at `opacity: 0, filter: blur(5px)` and never resolves the spring that is
 * meant to clear it — reproducible on `/docs/components/dynamic-island` by
 * clicking any view, so it is a component bug rather than a canvas one. Without
 * the override this tile is an empty black pill. Delete once the component is
 * fixed; the pill's own width morph is unaffected either way.
 */
const ISLAND_CANVAS_CSS = `
.smoothui-canvas-island button[aria-label] { display: none; }
.smoothui-canvas-island [style*="blur"] { filter: none !important; opacity: 1 !important; }
`;

const DynamicIslandCanvasDemo = () => {
  const shouldReduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }
    const id = setInterval(() => {
      setIndex((value) => (value + 1) % VIEWS.length);
    }, VIEW_INTERVAL_MS);
    return () => clearInterval(id);
  }, [shouldReduceMotion]);

  return (
    <div className="smoothui-canvas-island relative h-[104px] w-[264px] overflow-hidden">
      <style>{ISLAND_CANVAS_CSS}</style>
      <div className="absolute left-0" style={{ top: STAGE_OFFSET_Y }}>
        <DynamicIsland className="w-[264px]" view={VIEWS[index]} />
      </div>
    </div>
  );
};

export default DynamicIslandCanvasDemo;
