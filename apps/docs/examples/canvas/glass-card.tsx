"use client";

import GlassCard from "@repo/smoothui/components/glass-card";
import { motion, useReducedMotion } from "motion/react";

/**
 * Glass is only glass when something moves behind it. The photo drifts on a
 * long loop so the refractive rim is visibly bending a live image rather than
 * sitting on a still one — transform only, so the pan is free.
 */
const PHOTO =
  "url(https://ik.imagekit.io/16u211libb/smoothui/scenes/silk-waves.webp?tr=w-1200,h-800,f-auto) center/cover no-repeat";
const SHADOWED = "[text-shadow:0_1px_3px_oklch(0_0_0/0.55)]";
const DRIFT_PX = 26;
const DRIFT_SECONDS = 24;

const GlassCardCanvasDemo = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative h-[180px] w-[280px] overflow-hidden rounded-2xl">
      <motion.div
        animate={shouldReduceMotion ? undefined : { x: [-DRIFT_PX, DRIFT_PX] }}
        aria-hidden="true"
        className="absolute -inset-x-12 inset-y-0"
        style={{ background: PHOTO, willChange: "transform" }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : {
                duration: DRIFT_SECONDS,
                ease: "linear",
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "mirror",
              }
        }
      />

      <div className="relative flex size-full items-center p-4">
        <GlassCard className="w-full" interactive={false} radius={22}>
          <div className="flex items-center gap-3">
            <div
              aria-hidden="true"
              className="size-11 shrink-0 rounded-lg bg-[url(https://ik.imagekit.io/16u211libb/smoothui/scenes/cyan-aurora.webp?tr=w-160,h-160,f-auto)] bg-center bg-cover ring-1 ring-white/25 ring-inset"
            />
            <div className="min-w-0 flex-1">
              <p
                className={`truncate font-semibold text-[0.875rem] text-white tracking-tight ${SHADOWED}`}
              >
                Refraction Index
              </p>
              <p className={`truncate text-white/85 text-xs ${SHADOWED}`}>
                Kiasmos · 3:42
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default GlassCardCanvasDemo;
