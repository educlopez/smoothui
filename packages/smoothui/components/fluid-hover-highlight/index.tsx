"use client";

import { cn } from "@repo/smoothui-utils";
import {
  AnimatePresence,
  motion,
  type Transition,
  useReducedMotion,
} from "motion/react";
import type {
  ItemRect,
  UseFluidHoverReturn,
} from "../../hooks/use-fluid-hover";
import { spring } from "../../lib/springs";

/** What the highlight reads off the hook. */
export type FluidHoverSource = Pick<
  UseFluidHoverReturn,
  "activeIndex" | "itemRects" | "isMeasured" | "sessionRef"
>;

interface HighlightFromHook {
  /** Keep list state but show nothing (closed popup). */
  hidden?: boolean;
  hover: FluidHoverSource;
  rect?: never;
  session?: never;
}

interface HighlightFromRect {
  hidden?: never;
  hover?: never;
  /** Rect in the container's coordinate space; `null` fades out. */
  rect: ItemRect | null;
  session: number;
}

export type FluidHoverHighlightProps = (
  | HighlightFromHook
  | HighlightFromRect
) & {
  className?: string;
  /** Where a fresh session fades in from (e.g. checked row). */
  from?: ItemRect | null;
  /** Positional spring. `false` snaps with no travel. */
  transition?: Transition | false;
};

const fade: Transition = { duration: 0.08 };
const snap: Transition = { duration: 0 };

export const toTarget = (rect: ItemRect) => ({
  height: rect.height,
  width: rect.width,
  x: rect.left,
  y: rect.top,
});

export const resolveHighlightTransition = (
  transition: Transition | false | undefined,
  reduceMotion: boolean
): Transition => {
  const positional =
    transition === false || reduceMotion ? snap : (transition ?? spring.fast);
  return { ...positional, opacity: fade };
};

export const resolveHighlightSource = (
  props: FluidHoverHighlightProps
): { rect: ItemRect | null; session: number } => {
  if (props.hover) {
    const { activeIndex, itemRects, isMeasured, sessionRef } = props.hover;
    const rect =
      !props.hidden && isMeasured && activeIndex !== null
        ? (itemRects[activeIndex] ?? null)
        : null;
    return { rect, session: sessionRef.current };
  }
  return { rect: props.rect, session: props.session };
};

/**
 * Absolute fill that springs between `useFluidHover` rects.
 * Container must be `position: relative`. Owns no radius/z-index — pass via className.
 */
export const FluidHoverHighlight = (props: FluidHoverHighlightProps) => {
  const { from, className, transition } = props;
  const { rect, session } = resolveHighlightSource(props);
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <AnimatePresence>
      {rect ? (
        <motion.div
          animate={{ opacity: 1, ...toTarget(rect) }}
          className={cn(
            "pointer-events-none absolute top-0 left-0 bg-foreground/5",
            className
          )}
          data-slot="fluid-hover-highlight"
          exit={{ opacity: 0, transition: spring.fast.exit }}
          initial={{ opacity: 0, ...toTarget(from ?? rect) }}
          key={session}
          style={{ position: "absolute" }}
          transition={resolveHighlightTransition(transition, reduceMotion)}
        />
      ) : null}
    </AnimatePresence>
  );
};

export default FluidHoverHighlight;
