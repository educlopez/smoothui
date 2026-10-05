/**
 * Shared animation constants for SmoothUI components.
 *
 * Spring configs follow project guidelines + Fluid Functionalism tiers
 * (`lib/springs.ts`): fast / moderate / slow with slightly quicker exits.
 *
 * Easing curves use cubic-bezier arrays compatible with Motion's `ease` property.
 */

export type { SpringTier } from "./springs";
export { exitFallbackMs, spring } from "./springs";

/** @deprecated Prefer `spring.moderate` — kept for existing call sites */
export const SPRING_DEFAULT = {
  bounce: 0.1,
  duration: 0.25,
  type: "spring" as const,
};

/** @deprecated Prefer `spring.fast` — kept for existing call sites */
export const SPRING_SNAPPY = {
  bounce: 0,
  duration: 0.2,
  type: "spring" as const,
};

/** Ease-out curve for entering elements — cubic-bezier(.23, 1, .32, 1) */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/** Ease-in-out curve for moving elements — cubic-bezier(0.645, 0.045, 0.355, 1) */
export const EASE_IN_OUT = [0.645, 0.045, 0.355, 1] as const;

/** Instant transition for reduced-motion contexts */
export const DURATION_INSTANT = { duration: 0 };

/** Standard animation durations (seconds) */
export const DURATION = {
  complex: 0.4,
  default: 0.25,
  fast: 0.15,
  slow: 0.3,
} as const;

/**
 * Overlay enter — dialogs, menus, popovers.
 * Opacity + slight scale; keep bounce low so chrome feels solid.
 */
export const OVERLAY_ENTER = {
  opacity: 1,
  scale: 1,
  y: 0,
} as const;

export const OVERLAY_ENTER_INITIAL = {
  opacity: 0,
  scale: 0.97,
  y: 6,
} as const;

export const OVERLAY_EXIT = {
  opacity: 0,
  scale: 0.97,
  y: 6,
} as const;

/** Transition to pair with OVERLAY_* when motion is allowed */
export const OVERLAY_TRANSITION = SPRING_DEFAULT;

/**
 * Press feedback — buttons, menu items, chips.
 * Prefer CSS `active:scale-[…]` with `motion-reduce:active:scale-100` when
 * Motion is not already on the node; use these when driving via `animate`.
 */
export const PRESS_SCALE = 0.97 as const;
export const PRESS_SCALE_DEEP = 0.94 as const;
export const PRESS_TRANSITION = {
  duration: DURATION.fast,
  ease: EASE_OUT,
} as const;

/** Focus-visible ring timing for CSS transitions (not layout motion). */
export const FOCUS_RING_TRANSITION =
  "box-shadow 0.15s cubic-bezier(0.23, 1, 0.32, 1)" as const;

export type SpringConfig = typeof SPRING_DEFAULT;
export type EasingCurve = readonly [number, number, number, number];
