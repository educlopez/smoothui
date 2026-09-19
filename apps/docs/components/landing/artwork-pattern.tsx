"use client";

import { useId } from "react";

export interface ArtworkPatternProps {
  /** Decoration is always opt-in; source artwork stays untouched. */
  variant?: "none" | "squares" | "contours";
}

// Irregular nested elevation rings, centered toward the lower-left of the art.
// One continuous Bézier outline keeps the field organic rather than wave-like.
const CONTOUR_OUTLINE =
  "M 0 -1 C .38 -1.08 .92 -.85 1 -.45 C 1.12 -.1 .7 .25 .8 .5 C .91 .8 .35 1 -.02 .88 C -.35 .72 -.35 .55 -.68 .62 C -1 .66 -1.08 .1 -.82 -.2 C -.62 -.5 -.5 -.95 0 -1 Z";
const CONTOUR_LEVELS = Array.from(
  { length: 46 },
  (_, index) => 24 + index * 22
);

/** Opt-in static textures, fading into artwork without tinting its colors. */
export function ArtworkPattern({ variant = "none" }: ArtworkPatternProps) {
  const id = useId();
  if (variant === "none") {
    return null;
  }

  if (variant === "contours") {
    return (
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full opacity-[0.12] dark:opacity-[0.1]"
        data-artwork-pattern="contours"
        focusable="false"
        preserveAspectRatio="none"
        style={{
          maskImage:
            "radial-gradient(ellipse at 40% 62%, #000 15%, #0009 58%, transparent 100%)",
        }}
        viewBox="0 0 600 720"
      >
        <defs>
          <path d={CONTOUR_OUTLINE} id={id} vectorEffect="non-scaling-stroke" />
        </defs>
        <g fill="none" stroke="white" strokeWidth="0.45">
          {CONTOUR_LEVELS.map((radius) => (
            <use
              href={`#${id}`}
              key={radius}
              transform={`translate(65 570) scale(${radius * 1.1} ${radius})`}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full opacity-[0.22] dark:opacity-[0.18]"
      data-artwork-pattern={variant}
      focusable="false"
      style={{
        maskImage:
          "linear-gradient(to bottom, transparent 10%, #000 52%, #0009 100%)",
      }}
    >
      <defs>
        <pattern height="12" id={id} patternUnits="userSpaceOnUse" width="12">
          <rect fill="white" height="1.5" width="1.5" x="5.25" y="5.25" />
        </pattern>
      </defs>
      <rect fill={`url(#${id})`} height="100%" width="100%" />
    </svg>
  );
}
