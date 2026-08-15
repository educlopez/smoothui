"use client";

import MotionLoader from "@repo/smoothui/components/motion-loader";

/**
 * Newton's cradle over the spinners: at tile size the dot-and-trail variants
 * shrink to a few faint specks, while the cradle keeps five solid balls and a
 * swing wide enough to read as motion from across the canvas. Inherited colour,
 * so the object stays legible in both themes.
 */
const MotionLoaderCanvasDemo = () => (
  <div className="flex size-[150px] items-center justify-center text-foreground">
    <MotionLoader
      label="Loading"
      size={110}
      speed={0.9}
      variant="newton-cradle"
    />
  </div>
);

export default MotionLoaderCanvasDemo;
