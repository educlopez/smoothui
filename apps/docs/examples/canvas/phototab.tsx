"use client";

import { PHOTO_TABS, sceneSrc } from "@docs/examples/shared/demo-fixtures";
import type { PhototabTab } from "@repo/smoothui/components/phototab";
import Phototab from "@repo/smoothui/components/phototab";
import { Mountain, TreePine, Waves } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { preload } from "react-dom";

/** Long enough to look at the photograph before it changes. */
const SWITCH_MS = 2600;
const ICONS = [<Mountain key="m" />, <Waves key="w" />, <TreePine key="t" />];

const FRAME = 240;

const tabs: PhototabTab[] = PHOTO_TABS.map((tab, index) => ({
  icon: ICONS[index],
  image: sceneSrc(tab.scene, "w-600,h-600"),
  name: tab.name,
}));

/**
 * The glass tab bar normally waits below the frame until the photo is hovered,
 * and the sliding pill behind it follows the cursor. Neither can happen while
 * the pointer is panning the canvas, so the bar is pinned in view and the demo
 * walks the cursor across it: a `mouseover` for the pill, a click for the
 * photograph.
 */
const PhototabCanvasDemo = () => {
  const shouldReduceMotion = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);

  // The inactive panels are unmounted, so each turn re-requests its photograph
  // and the frame goes white while it lands. Warm all three up front.
  for (const tab of tabs) {
    preload(tab.image, { as: "image" });
  }

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }
    let index = 0;
    const timer = setInterval(() => {
      const triggers =
        hostRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
      if (!triggers?.length) {
        return;
      }
      const previous = triggers[index];
      index = (index + 1) % triggers.length;
      const next = triggers[index];
      if (!next) {
        return;
      }
      // React synthesises mouseenter/mouseleave from mouseover, so this is the
      // event the sliding pill is actually listening for.
      next.dispatchEvent(
        new MouseEvent("mouseover", { bubbles: true, relatedTarget: previous })
      );
      // And the tab itself switches on mousedown, not on click — a bare
      // `.click()` moves the pill but leaves the photograph behind.
      next.dispatchEvent(
        new MouseEvent("mousedown", { bubbles: true, button: 0 })
      );
    }, SWITCH_MS);
    return () => clearInterval(timer);
  }, [shouldReduceMotion]);

  return (
    <div className="h-[240px] w-[240px]" ref={hostRef}>
      <Phototab
        defaultTab="Ridge line"
        height={FRAME}
        // The bar hides itself off-frame until hover; there is no hover here.
        tabListClassName="translate-y-0! md:translate-y-0!"
        tabs={tabs}
      />
    </div>
  );
};

export default PhototabCanvasDemo;
