"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import {
  animate,
  motion,
  type PanInfo,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import {
  type KeyboardEvent,
  type ReactNode,
  type Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

const DEFAULT_THRESHOLD = 110; // px of horizontal drag needed to commit
const DEFAULT_ROTATION_FACTOR = 18; // deg at the edge of DRAG_RANGE
const DEFAULT_STACK_SIZE = 3;
const DEFAULT_STACK_OFFSET = 14; // px per receding card
const STACK_SCALE_STEP = 0.05;
const DRAG_RANGE = 260; // px input domain for the rotation transform
const VELOCITY_COMMIT_THRESHOLD = 450; // px/s
const EXIT_DISTANCE = 900; // px travelled before unmount
const STAMP_RATIO = 0.85; // stamps hit full strength just before the threshold
const WASH_RATIO = 1.35; // the colour wash lags the stamps slightly
const WASH_MAX_OPACITY = 0.9;
const MIN_THROW_SPEED = 750; // px/s floor so button swipes still fly
const THROW_DURATION = 0.34;
const FADE_DELAY = 0.2;
const FADE_DURATION = 0.14;
const VERTICAL_LIMIT = 90; // px of vertical give while dragging
const STAMP_MIN_SCALE = 0.7;
const DEFAULT_THROW_LIFT = -160; // px/s upward bias for non-drag commits
/**
 * Rotation pivot sits *below* the bottom edge of the card. This is the detail
 * that makes the Tinder tilt read correctly: the card swings around a point
 * near the user's hand rather than around its own centre.
 */
const PIVOT_ORIGIN = "50% 165%";
const THROW_TRANSITION = {
  bounce: 0,
  duration: THROW_DURATION,
  type: "spring" as const,
};
const SNAP_BACK_TRANSITION = {
  bounce: 0.3,
  duration: 0.45,
  type: "spring" as const,
};
const STACK_TRANSITION = {
  bounce: 0.1,
  duration: 0.25,
  type: "spring" as const,
};
const FADE_EASE = [0.645, 0.045, 0.355, 1] as const;

export type SwipeDirection = "left" | "right";

export interface CardSwipeDeckItem {
  content: ReactNode;
  id: string;
}

export interface CardSwipeDeckLabels {
  left?: string;
  right?: string;
}

export interface CardSwipeDeckHandle {
  reset: () => void;
  swipeLeft: () => void;
  swipeRight: () => void;
}

export interface CardSwipeDeckProps {
  className?: string;
  disabled?: boolean;
  items: CardSwipeDeckItem[];
  /** Stamp copy burned into the top corners, e.g. `{ left: "Nope", right: "Like" }`. */
  labels?: CardSwipeDeckLabels;
  onEmpty?: () => void;
  onSwipe?: (id: string, direction: SwipeDirection) => void;
  ref?: Ref<CardSwipeDeckHandle>;
  /** Max rotation (degrees) applied at the edge of the drag range. */
  rotationFactor?: number;
  /** Vertical offset (px) applied to each receding card in the stack. */
  stackOffset?: number;
  /** How many cards are visible in the stack, front card included. */
  stackSize?: number;
  /** Drag distance (px) required to commit a swipe. */
  threshold?: number;
}

interface ThrowVector {
  direction: SwipeDirection;
  vx: number;
  vy: number;
}

interface DeckCardProps {
  disabled: boolean;
  isFront: boolean;
  item: CardSwipeDeckItem;
  labels: Required<CardSwipeDeckLabels>;
  onCommit: (direction: SwipeDirection, info?: PanInfo) => void;
  onExitComplete: () => void;
  pos: number;
  rotationFactor: number;
  shouldReduceMotion: boolean;
  stackOffset: number;
  stackSize: number;
  threshold: number;
  throwVector: ThrowVector | null;
  zIndex: number;
}

const DeckCard = ({
  disabled,
  isFront,
  item,
  labels,
  onCommit,
  onExitComplete,
  pos,
  rotationFactor,
  shouldReduceMotion,
  stackOffset,
  stackSize,
  threshold,
  throwVector,
  zIndex,
}: DeckCardProps) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const isExiting = throwVector !== null;

  const rotate = useTransform(
    x,
    [-DRAG_RANGE, DRAG_RANGE],
    [-rotationFactor, rotationFactor]
  );

  const stampSpan = threshold * STAMP_RATIO;
  const washSpan = threshold * WASH_RATIO;

  // Stamps and wash are driven straight off the drag distance, so they bloom
  // continuously under the finger instead of snapping in at the threshold.
  const likeOpacity = useTransform(x, [0, stampSpan], [0, 1]);
  const likeScale = useTransform(x, [0, stampSpan], [STAMP_MIN_SCALE, 1]);
  const nopeOpacity = useTransform(x, [-stampSpan, 0], [1, 0]);
  const nopeScale = useTransform(x, [-stampSpan, 0], [1, STAMP_MIN_SCALE]);
  const likeWash = useTransform(x, [0, washSpan], [0, WASH_MAX_OPACITY]);
  const nopeWash = useTransform(x, [-washSpan, 0], [WASH_MAX_OPACITY, 0]);

  useEffect(() => {
    if (!throwVector || shouldReduceMotion) {
      return;
    }
    const targetX =
      throwVector.direction === "left" ? -EXIT_DISTANCE : EXIT_DISTANCE;
    const speed = Math.max(Math.abs(throwVector.vx), MIN_THROW_SPEED);
    const signedVx = throwVector.direction === "left" ? -speed : speed;
    // Keep the throw on the trajectory the finger was already describing.
    const targetY = y.get() + throwVector.vy * THROW_DURATION;

    const xControls = animate(x, targetX, {
      ...THROW_TRANSITION,
      velocity: signedVx,
    });
    const yControls = animate(y, targetY, {
      ...THROW_TRANSITION,
      velocity: throwVector.vy,
    });

    return () => {
      xControls.stop();
      yControls.stop();
    };
  }, [throwVector, shouldReduceMotion, x, y]);

  const handleDragEnd = useCallback(
    (_event: unknown, info: PanInfo) => {
      if (disabled) {
        return;
      }
      const shouldCommit =
        Math.abs(info.offset.x) > threshold ||
        Math.abs(info.velocity.x) > VELOCITY_COMMIT_THRESHOLD;

      if (shouldCommit) {
        onCommit(info.offset.x > 0 ? "right" : "left", info);
        return;
      }
      // Below threshold: elastic snap back to centre.
      animate(x, 0, SNAP_BACK_TRANSITION);
      animate(y, 0, SNAP_BACK_TRANSITION);
    },
    [disabled, onCommit, threshold, x, y]
  );

  const isBuried = pos >= stackSize;
  const canDrag = isFront && !disabled && !isExiting;

  return (
    <motion.div
      animate={{
        scale: 1 - pos * STACK_SCALE_STEP,
        y: pos * stackOffset,
      }}
      className="absolute inset-0"
      initial={false}
      style={{ zIndex }}
      transition={shouldReduceMotion ? { duration: 0 } : STACK_TRANSITION}
    >
      <motion.div
        animate={
          isExiting
            ? {
                opacity: 0,
                transition: shouldReduceMotion
                  ? { duration: 0 }
                  : {
                      delay: FADE_DELAY,
                      duration: FADE_DURATION,
                      ease: FADE_EASE,
                    },
              }
            : { opacity: isBuried ? 0 : 1 }
        }
        className="relative h-full w-full cursor-grab overflow-hidden rounded-[28px] bg-background shadow-[0_1px_2px_rgba(0,0,0,0.06),0_10px_20px_-8px_rgba(0,0,0,0.18),0_28px_56px_-20px_rgba(0,0,0,0.32)] ring-1 ring-foreground/10 active:cursor-grabbing"
        drag={canDrag}
        initial={false}
        dragConstraints={{ bottom: VERTICAL_LIMIT, top: -VERTICAL_LIMIT }}
        dragElastic={{ bottom: 0.35, left: 1, right: 1, top: 0.35 }}
        dragMomentum={false}
        onAnimationComplete={() => {
          if (isExiting) {
            onExitComplete();
          }
        }}
        onDragEnd={handleDragEnd}
        style={{
          rotate,
          transformOrigin: PIVOT_ORIGIN,
          x,
          y,
        }}
        transition={shouldReduceMotion ? { duration: 0 } : STACK_TRANSITION}
        whileDrag={shouldReduceMotion ? undefined : { scale: 1.02 }}
      >
        {item.content}

        {/* Kept mounted through the throw so the stamp flies off with the card. */}
        {isFront ? (
          <>
            {/* Colour wash — the card itself tints toward the outcome. */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-l from-green/55 via-green/15 to-transparent"
              style={{ opacity: likeWash }}
            />
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-destructive/55 via-destructive/15 to-transparent"
              style={{ opacity: nopeWash }}
            />

            {/* Stamps — outlined, rotated, driven by drag distance. */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute top-7 left-6 rounded-xl border-[3px] border-green px-3 py-1 font-black text-2xl text-green uppercase leading-none tracking-[0.08em] drop-shadow-sm"
              style={{
                opacity: likeOpacity,
                rotate: -20,
                scale: likeScale,
              }}
            >
              {labels.right}
            </motion.div>
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute top-7 right-6 rounded-xl border-[3px] border-destructive px-3 py-1 font-black text-2xl text-destructive uppercase leading-none tracking-[0.08em] drop-shadow-sm"
              style={{
                opacity: nopeOpacity,
                rotate: 20,
                scale: nopeScale,
              }}
            >
              {labels.left}
            </motion.div>
          </>
        ) : null}
      </motion.div>
    </motion.div>
  );
};

export default function CardSwipeDeck({
  className,
  disabled = false,
  items,
  labels,
  onEmpty,
  onSwipe,
  ref,
  rotationFactor = DEFAULT_ROTATION_FACTOR,
  stackOffset = DEFAULT_STACK_OFFSET,
  stackSize = DEFAULT_STACK_SIZE,
  threshold = DEFAULT_THRESHOLD,
}: CardSwipeDeckProps) {
  const shouldReduceMotion = useReducedMotion();
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());
  const [exiting, setExiting] = useState<{
    id: string;
    vector: ThrowVector;
  } | null>(null);

  const remaining = items.filter((item) => !removedIds.has(item.id));
  // One extra card is mounted so the stack keeps its depth while the top
  // card is flying away.
  const visible = remaining.slice(0, stackSize + 1);

  const commitSwipe = useCallback(
    (direction: SwipeDirection, info?: PanInfo) => {
      if (disabled || exiting) {
        return;
      }
      const [top] = remaining;
      if (!top) {
        return;
      }
      onSwipe?.(top.id, direction);
      const wasLast = remaining.length === 1;

      if (shouldReduceMotion) {
        setRemovedIds((prev) => new Set(prev).add(top.id));
      } else {
        setExiting({
          id: top.id,
          vector: {
            direction,
            vx: info?.velocity.x ?? 0,
            vy: info?.velocity.y ?? DEFAULT_THROW_LIFT,
          },
        });
      }
      if (wasLast) {
        onEmpty?.();
      }
    },
    [disabled, exiting, onEmpty, onSwipe, remaining, shouldReduceMotion]
  );

  const handleExitComplete = useCallback((id: string) => {
    setRemovedIds((prev) => new Set(prev).add(id));
    setExiting(null);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      reset: () => {
        setRemovedIds(new Set());
        setExiting(null);
      },
      swipeLeft: () => commitSwipe("left"),
      swipeRight: () => commitSwipe("right"),
    }),
    [commitSwipe]
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) {
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      commitSwipe("left");
    } else if (event.key === "ArrowRight" || event.key === "Enter") {
      event.preventDefault();
      commitSwipe("right");
    }
  };

  const resolvedLabels: Required<CardSwipeDeckLabels> = {
    left: labels?.left ?? "Nope",
    right: labels?.right ?? "Like",
  };

  return (
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: Interactive swipeable widget requires event handlers
    <div
      aria-label="Swipeable card deck"
      className={cn(
        "relative h-[480px] w-[340px] max-w-full touch-pan-y outline-none",
        className
      )}
      onKeyDown={handleKeyDown}
      role="application"
      // biome-ignore lint/a11y/noNoninteractiveTabindex: Required for keyboard navigation
      tabIndex={0}
    >
      {visible.length === 0 ? (
        <div className="flex h-full w-full items-center justify-center rounded-[28px] border border-foreground/10 border-dashed">
          <p className="text-center text-muted-foreground text-sm">
            No more cards
          </p>
        </div>
      ) : (
        visible.map((item, index) => {
          const isExitingCard = exiting?.id === item.id;
          // While the top card leaves, everything behind it slides forward
          // one slot — the next card scales up as the throw happens.
          const pos = exiting ? Math.max(index - 1, 0) : index;

          return (
            <DeckCard
              disabled={disabled}
              isFront={index === 0}
              item={item}
              key={item.id}
              labels={resolvedLabels}
              onCommit={commitSwipe}
              onExitComplete={() => handleExitComplete(item.id)}
              pos={isExitingCard ? 0 : pos}
              rotationFactor={rotationFactor}
              shouldReduceMotion={Boolean(shouldReduceMotion)}
              stackOffset={stackOffset}
              stackSize={stackSize}
              threshold={threshold}
              throwVector={isExitingCard ? exiting.vector : null}
              zIndex={visible.length - index}
            />
          );
        })
      )}
      <div aria-live="polite" className="sr-only">
        {remaining.length > 0
          ? `${remaining.length} card${remaining.length === 1 ? "" : "s"} remaining`
          : "No cards remaining"}
      </div>
    </div>
  );
}
