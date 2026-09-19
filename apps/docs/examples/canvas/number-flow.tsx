"use client";

import NumberFlow from "@repo/smoothui/components/number-flow";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/** One digit roll per tick — slow enough to read, quick enough to feel live. */
const STEP_MS = 820;
/** The count paces between these, so the tens digit turns over each pass. */
const LOW = 5;
const HIGH = 14;

/**
 * The odometer only rolls when the component's own stepper is pressed — it
 * tracks the previous value internally — so the demo presses it, counting up
 * to fourteen and back down again forever. The stepper itself is hidden;
 * what floats on the canvas is just the number, turning over.
 */
const NumberFlowCanvasDemo = () => {
  const shouldReduceMotion = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }
    let value = 0;
    let direction = 1;

    const timer = setInterval(() => {
      if (value >= HIGH) {
        direction = -1;
      }
      if (value <= LOW) {
        direction = 1;
      }
      const label = direction === 1 ? "Increase number" : "Decrease number";
      hostRef.current
        ?.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)
        ?.click();
      value += direction;
    }, STEP_MS);

    return () => clearInterval(timer);
  }, [shouldReduceMotion]);

  return (
    <div className="flex w-[200px] items-center justify-center" ref={hostRef}>
      {/* The stepper column is a control; the canvas is not operable. It stays
          in the DOM because the demo still drives it. */}
      <NumberFlow className="[&>div>div:last-child]:hidden" max={999} min={0} />
    </div>
  );
};

export default NumberFlowCanvasDemo;
