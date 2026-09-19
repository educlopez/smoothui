"use client";

import PowerOffSlide from "@repo/smoothui/components/power-off-slide";

/** Pace of the shimmer sweeping across the label, in ms. */
const SHIMMER_MS = 2200;

/**
 * This one is a drag, and a drag cannot be faked convincingly — Motion's
 * gesture layer wants a real pointer, and a simulated one that half-lands
 * would look broken rather than alive. What the component does have is an idle
 * animation of its own: a shimmer that runs across the label on every frame,
 * on a loop, forever. That is the resting state shown here — the invitation to
 * slide, still glinting.
 */
const PowerOffSlideCanvasDemo = () => (
  <div className="flex w-[240px] items-center justify-center py-3">
    <PowerOffSlide duration={SHIMMER_MS} label="Slide to power off" />
  </div>
);

export default PowerOffSlideCanvasDemo;
