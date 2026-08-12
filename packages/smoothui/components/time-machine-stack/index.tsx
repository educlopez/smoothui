"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import {
  AnimatePresence,
  motion,
  type TargetAndTransition,
  useReducedMotion,
} from "motion/react";
import {
  type KeyboardEvent,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

const DEFAULT_DEPTH = 50;
const DEFAULT_OFFSET_Y = 36;
const DEFAULT_SCALE_STEP = 0.05;
const DEFAULT_VISIBLE_COUNT = 4;
const DEFAULT_PERSPECTIVE = 1400;
const WHEEL_THRESHOLD = 12;
const WHEEL_COOLDOWN_MS = 220;
const DRAG_THRESHOLD = 48;
const FORWARD = 1;
const BACKWARD = -1;
const EXIT_ENTER_TRANSITION = {
  duration: 0.25,
  ease: [0.23, 1, 0.32, 1] as const,
};

export interface TimeMachineStackItem {
  content: ReactNode;
  id: string;
}

export interface TimeMachineStackProps {
  className?: string;
  /** Distance (px) each receding panel is pushed back on the z-axis. */
  depth?: number;
  /** Controlled index of the front-most item. */
  index?: number;
  items: TimeMachineStackItem[];
  /** Vertical offset (px) applied per receding panel. */
  offsetY?: number;
  onIndexChange?: (index: number) => void;
  /** CSS perspective (px) applied to the stack's 3D context. */
  perspective?: number;
  /** Scale reduction applied per receding panel. */
  scaleStep?: number;
  /** Number of panels rendered at once; the rest stay unmounted. */
  visibleCount?: number;
}

type PanelState = TargetAndTransition & {
  opacity: number;
  transform: string;
};

const clampIndex = (value: number, max: number): number =>
  Math.min(Math.max(value, 0), max);

/**
 * One `transform` string rather than Motion's `y`/`z`/`scale` shorthands: the
 * shorthands are implemented with CSS variables, which the compositor will not
 * accelerate, and a stack of full-bleed images under `perspective` is exactly
 * the case that wants to stay off the main thread.
 */
const toTransform = (y: number, z: number, scale: number): string =>
  `translateY(${y}px) translateZ(${z}px) scale(${scale})`;

export default function TimeMachineStack({
  className,
  depth = DEFAULT_DEPTH,
  index,
  items,
  offsetY = DEFAULT_OFFSET_Y,
  onIndexChange,
  perspective = DEFAULT_PERSPECTIVE,
  scaleStep = DEFAULT_SCALE_STEP,
  visibleCount = DEFAULT_VISIBLE_COUNT,
}: TimeMachineStackProps) {
  const shouldReduceMotion = useReducedMotion();
  const listboxId = useId();
  const lastIndex = Math.max(items.length - 1, 0);
  const isControlled = index !== undefined;
  const [internalIndex, setInternalIndex] = useState(0);
  const currentIndex = clampIndex(
    isControlled ? (index as number) : internalIndex,
    lastIndex
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const wheelLockRef = useRef(false);
  const dragOriginRef = useRef<number | null>(null);

  // Travel direction drives both enter and exit: moving forward the front
  // panel flies past the viewer, moving back it falls in from the front.
  // Derived from the index itself so it stays correct when `index` is
  // controlled from the outside instead of by this component's handlers.
  const previousIndexRef = useRef(currentIndex);
  const directionRef = useRef(FORWARD);
  if (previousIndexRef.current !== currentIndex) {
    directionRef.current =
      currentIndex > previousIndexRef.current ? FORWARD : BACKWARD;
    previousIndexRef.current = currentIndex;
  }
  const direction = directionRef.current;

  const goTo = useCallback(
    (next: number) => {
      const clamped = clampIndex(next, lastIndex);
      if (clamped === currentIndex) {
        return;
      }
      if (!isControlled) {
        setInternalIndex(clamped);
      }
      onIndexChange?.(clamped);
    },
    [currentIndex, isControlled, lastIndex, onIndexChange]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const handleNativeWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < WHEEL_THRESHOLD || wheelLockRef.current) {
        return;
      }
      const next = currentIndex + (event.deltaY > 0 ? FORWARD : BACKWARD);
      // At either end the stack hands the wheel back to the page instead of
      // swallowing it, so the demo never traps the document scroll.
      if (next < 0 || next > lastIndex) {
        return;
      }
      event.preventDefault();
      wheelLockRef.current = true;
      goTo(next);
      setTimeout(() => {
        wheelLockRef.current = false;
      }, WHEEL_COOLDOWN_MS);
    };
    container.addEventListener("wheel", handleNativeWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleNativeWheel);
  }, [currentIndex, goTo, lastIndex]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        goTo(currentIndex + FORWARD);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        goTo(currentIndex + BACKWARD);
      } else if (event.key === "Home") {
        event.preventDefault();
        goTo(0);
      } else if (event.key === "End") {
        event.preventDefault();
        goTo(lastIndex);
      }
    },
    [currentIndex, goTo, lastIndex]
  );

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      dragOriginRef.current = event.clientY;
    },
    []
  );

  const handlePointerUp = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const origin = dragOriginRef.current;
      dragOriginRef.current = null;
      if (origin === null) {
        return;
      }
      const delta = origin - event.clientY;
      if (Math.abs(delta) < DRAG_THRESHOLD) {
        return;
      }
      goTo(currentIndex + (delta > 0 ? FORWARD : BACKWARD));
    },
    [currentIndex, goTo]
  );

  const handlePointerCancel = useCallback(() => {
    dragOriginRef.current = null;
  }, []);

  // Depth is scale, offset, z-translation and shadow — never opacity. A panel
  // that is see-through stops occluding the one behind it, and a stack that
  // does not occlude reads as a pile of ghosts rather than a stack of objects.
  // Opacity is reserved for the two positions outside the visible window
  // (`pos < 0` and `pos >= visibleCount`), which is the only place a fade is
  // describing something real: a panel leaving or entering the window.
  const getPanelState = useCallback(
    (pos: number): PanelState => {
      if (shouldReduceMotion) {
        return { opacity: pos === 0 ? 1 : 0, transform: toTransform(0, 0, 1) };
      }
      if (pos < 0) {
        return {
          opacity: 0,
          transform: toTransform(offsetY * 2, depth * 2, 1 + scaleStep * 2),
        };
      }
      return {
        opacity: pos >= visibleCount ? 0 : 1,
        transform: toTransform(
          -pos * offsetY,
          -pos * depth,
          1 - pos * scaleStep
        ),
      };
    },
    [depth, offsetY, scaleStep, shouldReduceMotion, visibleCount]
  );

  const visibleItems = items
    .slice(currentIndex, currentIndex + visibleCount)
    .map((item, pos) => ({ item, pos }));
  const frontItem = visibleItems[0]?.item;

  // Receding panels translate up, so the stack reserves that much headroom and
  // anchors every panel to the bottom edge. Without it the deeper panels are
  // pushed outside the box and the "stack" reads as a single flat card.
  const reservedTop = shouldReduceMotion
    ? 0
    : Math.max(visibleCount - 1, 0) * offsetY;

  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { bounce: 0.1, duration: 0.25, type: "spring" as const };

  const exitState =
    direction === FORWARD ? getPanelState(-1) : getPanelState(visibleCount);

  return (
    // `w-full` is load-bearing: every panel is absolutely positioned, so the
    // stack has no intrinsic width. Inside any shrink-to-fit parent (the docs
    // preview centres its children) it would otherwise collapse to 0px wide.
    <div className={cn("flex w-full flex-col items-center gap-4", className)}>
      {/* biome-ignore lint/a11y/useSemanticElements: a listbox of 3D panels has no native equivalent */}
      <div
        aria-activedescendant={
          frontItem ? `${listboxId}-${frontItem.id}` : undefined
        }
        aria-label="Time machine stack"
        className="relative min-h-[14rem] w-full flex-1 touch-none select-none rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        id={listboxId}
        onKeyDown={handleKeyDown}
        onPointerCancel={handlePointerCancel}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        ref={containerRef}
        role="listbox"
        style={{
          perspective: shouldReduceMotion ? undefined : perspective,
          touchAction: "none",
        }}
        tabIndex={0}
      >
        <AnimatePresence initial={false}>
          {visibleItems
            .slice()
            .reverse()
            .map(({ item, pos }) => {
              const state = getPanelState(pos);
              const isFront = pos === 0;
              return (
                <motion.div
                  animate={{
                    opacity: state.opacity,
                    transform: state.transform,
                  }}
                  aria-selected={isFront}
                  className="absolute inset-x-0 bottom-0 overflow-hidden rounded-2xl border border-foreground/10 bg-background shadow-[0_18px_45px_-20px_rgba(0,0,0,0.45)]"
                  exit={{
                    opacity: 0,
                    transform: exitState.transform,
                    transition: shouldReduceMotion
                      ? { duration: 0 }
                      : EXIT_ENTER_TRANSITION,
                  }}
                  id={`${listboxId}-${item.id}`}
                  // A panel only ever mounts in one of two places: one slot
                  // behind the deepest one when travelling forward, or in front
                  // of the stack when travelling back. Deriving it from `pos`
                  // handed every already-mounted panel a start state it can
                  // never legitimately occupy, which is only ever a chance for
                  // a stale value to be read back.
                  initial={
                    direction === FORWARD
                      ? getPanelState(visibleCount)
                      : getPanelState(-1)
                  }
                  key={item.id}
                  role="option"
                  style={{ top: reservedTop, zIndex: visibleCount - pos }}
                  transition={transition}
                >
                  {item.content}
                </motion.div>
              );
            })}
        </AnimatePresence>
      </div>
      <div aria-live="polite" className="sr-only">
        {frontItem ? `Item ${currentIndex + 1} of ${items.length}` : "No items"}
      </div>
    </div>
  );
}
