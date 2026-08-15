/** GSAP ease-out for entering elements — cubic-bezier(.23, 1, .32, 1) */
export const GSAP_EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";

/** GSAP ease for moving elements — cubic-bezier(0.645, 0.045, 0.355, 1) */
export const GSAP_EASE_MOVE = "cubic-bezier(0.645, 0.045, 0.355, 1)";

export const GSAP_DURATION = {
  complex: 0.4,
  decorative: 0.7,
  default: 0.25,
  fast: 0.15,
} as const;

export const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isFinePointer = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;
