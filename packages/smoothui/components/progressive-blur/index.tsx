"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { useReducedMotion } from "motion/react";
import { type CSSProperties, type ReactNode, useEffect, useState } from "react";

/** Where the blur ramps *towards*. `radial` ramps outward from the centre. */
export type ProgressiveBlurDirection =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "radial";

export interface ProgressiveBlurProps {
  /** Peak blur radius in pixels, reached by the last layer. */
  blur?: number;
  /**
   * Optional content rendered above the blur stack. Unlike the stack itself it
   * stays interactive and visible to assistive technologies.
   */
  children?: ReactNode;
  className?: string;
  direction?: ProgressiveBlurDirection;
  /** Fade the stack in on mount. Ignored when reduced motion is preferred. */
  fadeIn?: boolean;
  /** Opacity applied to every layer, `0` to `1`. Lower means a softer veil. */
  intensity?: number;
  /** Number of stacked layers. More layers means a smoother ramp. */
  layers?: number;
}

const DEFAULT_LAYERS = 6;
const DEFAULT_BLUR = 24;
const DEFAULT_INTENSITY = 1;
const MIN_LAYERS = 2;
const MAX_LAYERS = 12;
const FULL_PERCENT = 100;
const STOPS_PER_LAYER = 3;
const FADE_MS = 250;
const ENTER_EASING = "cubic-bezier(.23, 1, .32, 1)";
const TRANSPARENT = "rgba(0, 0, 0, 0)";
const OPAQUE = "rgb(0, 0, 0)";

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const buildMask = (
  direction: ProgressiveBlurDirection,
  index: number,
  layers: number
) => {
  const step = FULL_PERCENT / layers;
  const start = index * step;
  const rampIn = (index + 1) * step;
  const rampOut = (index + STOPS_PER_LAYER - 1) * step;
  const end = (index + STOPS_PER_LAYER) * step;
  const stops = `${TRANSPARENT} ${start}%, ${OPAQUE} ${rampIn}%, ${OPAQUE} ${rampOut}%, ${TRANSPARENT} ${end}%`;

  if (direction === "radial") {
    return `radial-gradient(circle at center, ${stops})`;
  }
  return `linear-gradient(to ${direction}, ${stops})`;
};

const ProgressiveBlur = ({
  blur = DEFAULT_BLUR,
  children,
  className,
  direction = "bottom",
  fadeIn = true,
  intensity = DEFAULT_INTENSITY,
  layers = DEFAULT_LAYERS,
}: ProgressiveBlurProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const layerCount = Math.max(
    MIN_LAYERS,
    Math.min(MAX_LAYERS, Math.round(layers))
  );
  const opacity = clamp01(intensity);
  const shouldFade = fadeIn && !shouldReduceMotion;
  const isVisible = hasMounted || !shouldFade;

  const layerIds = Array.from(
    { length: layerCount },
    (_, index) => `layer-${index.toString()}`
  );

  return (
    <div className={cn("pointer-events-none absolute inset-0", className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: shouldFade
            ? `opacity ${FADE_MS}ms ${ENTER_EASING}`
            : undefined,
        }}
      >
        {layerIds.map((layerId, index) => {
          const layerBlur = blur / 2 ** (layerCount - 1 - index);
          const mask = buildMask(direction, index, layerCount);
          const style: CSSProperties = {
            backdropFilter: `blur(${layerBlur}px)`,
            inset: 0,
            maskImage: mask,
            opacity,
            position: "absolute",
            WebkitBackdropFilter: `blur(${layerBlur}px)`,
            WebkitMaskImage: mask,
            zIndex: index,
          };
          return <div key={layerId} style={style} />;
        })}
      </div>

      {children ? (
        <div className="pointer-events-auto relative z-10 h-full w-full">
          {children}
        </div>
      ) : null}
    </div>
  );
};

export default ProgressiveBlur;
