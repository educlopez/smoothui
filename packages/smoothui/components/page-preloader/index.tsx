"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";

export const PAGE_PRELOADER_VARIANTS = [
  "words",
  "stairs",
  "pixel",
  "curtain",
] as const;

export type PagePreloaderVariant = (typeof PAGE_PRELOADER_VARIANTS)[number];

export type PagePreloaderProps = {
  /** Whether the overlay is showing. Omit to let the component manage itself. */
  active?: boolean;
  /** Tailwind class(es) used to fill the overlay pieces. */
  background?: string;
  className?: string;
  /** Column count for the "stairs" and "pixel" variants. */
  columns?: number;
  /** Renders the overlay `absolute` inside its parent instead of `fixed` full-screen. */
  container?: boolean;
  /** Initial `active` value when uncontrolled. */
  defaultActive?: boolean;
  /** Hold duration in ms before the exit plays (uncontrolled mode). */
  duration?: number;
  /** Fires once the exit transition has fully finished. */
  onComplete?: () => void;
  variant?: PagePreloaderVariant;
  /** Words cycled by the "words" variant while holding. */
  words?: string[];
};

type Stage = "idle" | "hold" | "exiting";

const DEFAULT_DURATION_MS = 1400;
const DEFAULT_COLUMNS = 6;
const DEFAULT_WORDS = ["Loading", "Almost there", "Ready"];
const DEFAULT_BACKGROUND = "bg-background";
const WORD_STEP_MS = 480;
const STAIRS_STAGGER_S = 0.06;
const PIXEL_STAGGER_S = 0.012;
const CURTAIN_EXIT_S = 0.5;
const STAIRS_EXIT_S = 0.55;
const PIXEL_EXIT_S = 0.4;
const WORDS_EXIT_S = 0.45;
const WORD_ROLL_OFFSET_PERCENT = 100;
const EASE_ENTER = [0.23, 1, 0.32, 1] as const;
const EASE_MOVE = [0.645, 0.045, 0.355, 1] as const;
const MS_PER_S = 1000;
const PIXEL_SEED = 733;
const LCG_MULTIPLIER = 1_664_525;
const LCG_INCREMENT = 1_013_904_223;
const UINT32_MAX = 0xff_ff_ff_ff;

/** Deterministic seeded shuffle — no `Math.random()`, safe to call during render via `useMemo`. */
const seededOrder = (count: number, seed: number): number[] => {
  let state = seed;
  const next = () => {
    state = (state * LCG_MULTIPLIER + LCG_INCREMENT) >>> 0;
    return state / UINT32_MAX;
  };
  const order = Array.from({ length: count }, (_, index) => index);
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(next() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
};

const getExitDurationMs = (
  variant: PagePreloaderVariant,
  columns: number
): number => {
  switch (variant) {
    case "stairs":
      return (
        (STAIRS_EXIT_S + Math.max(0, columns - 1) * STAIRS_STAGGER_S) * MS_PER_S
      );
    case "pixel": {
      const total = columns * columns;
      return (
        (PIXEL_EXIT_S + Math.max(0, total - 1) * PIXEL_STAGGER_S) * MS_PER_S
      );
    }
    case "words":
      return WORDS_EXIT_S * MS_PER_S;
    default:
      return CURTAIN_EXIT_S * MS_PER_S;
  }
};

type VariantProps = {
  background: string;
  shouldReduceMotion: boolean;
  stage: Stage;
};

const CurtainVariant = ({
  background,
  shouldReduceMotion,
  stage,
}: VariantProps) => {
  const exiting = stage === "exiting";
  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: CURTAIN_EXIT_S, ease: EASE_MOVE };

  return (
    <div aria-hidden="true" className="absolute inset-0 flex">
      <motion.div
        animate={
          exiting
            ? shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 1, x: "-100%" }
            : { opacity: 1, x: 0 }
        }
        className={cn("h-full w-1/2", background)}
        initial={false}
        transition={transition}
      />
      <motion.div
        animate={
          exiting
            ? shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 1, x: "100%" }
            : { opacity: 1, x: 0 }
        }
        className={cn("h-full w-1/2", background)}
        initial={false}
        transition={transition}
      />
    </div>
  );
};

const StairsVariant = ({
  background,
  columns,
  shouldReduceMotion,
  stage,
}: VariantProps & { columns: number }) => {
  const exiting = stage === "exiting";

  return (
    <div aria-hidden="true" className="absolute inset-0 flex">
      {Array.from({ length: columns }, (_, index) => (
        <motion.div
          animate={
            exiting
              ? shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 1, scaleY: 0 }
              : { opacity: 1, scaleY: 1 }
          }
          className={cn("h-full flex-1", background)}
          initial={false}
          // biome-ignore lint/suspicious/noArrayIndexKey: columns are positional decorative tiles
          key={index}
          style={{ transformOrigin: "bottom" }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  delay: exiting ? index * STAIRS_STAGGER_S : 0,
                  duration: STAIRS_EXIT_S,
                  ease: EASE_MOVE,
                }
          }
        />
      ))}
    </div>
  );
};

const PixelVariant = ({
  background,
  columns,
  shouldReduceMotion,
  stage,
}: VariantProps & { columns: number }) => {
  const exiting = stage === "exiting";
  const total = columns * columns;
  const order = useMemo(() => seededOrder(total, PIXEL_SEED), [total]);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 grid"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {Array.from({ length: total }, (_, index) => (
        <motion.div
          animate={exiting ? { opacity: 0 } : { opacity: 1 }}
          className={cn(background)}
          initial={false}
          // biome-ignore lint/suspicious/noArrayIndexKey: grid cells are positional decorative tiles
          key={index}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  delay: exiting ? (order[index] ?? 0) * PIXEL_STAGGER_S : 0,
                  duration: PIXEL_EXIT_S,
                  ease: EASE_ENTER,
                }
          }
        />
      ))}
    </div>
  );
};

const WordsVariant = ({
  background,
  shouldReduceMotion,
  stage,
  wordIndex,
  words,
}: VariantProps & { wordIndex: number; words: string[] }) => {
  const exiting = stage === "exiting";

  return (
    <motion.div
      animate={
        exiting
          ? shouldReduceMotion
            ? { opacity: 0 }
            : { opacity: 1, y: "-100%" }
          : { opacity: 1, y: 0 }
      }
      aria-hidden="true"
      className={cn(
        "absolute inset-0 flex items-center justify-center overflow-hidden",
        background
      )}
      initial={false}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { duration: WORDS_EXIT_S, ease: EASE_MOVE }
      }
    >
      <div className="relative h-8 overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.span
            animate={{ opacity: 1, y: 0 }}
            className="block font-medium text-foreground text-xl"
            exit={
              shouldReduceMotion
                ? { opacity: 0, transition: { duration: 0 } }
                : { opacity: 0, y: -WORD_ROLL_OFFSET_PERCENT }
            }
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: WORD_ROLL_OFFSET_PERCENT }
            }
            key={words[wordIndex] ?? wordIndex}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { bounce: 0.1, duration: 0.25, type: "spring" }
            }
          >
            {words[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const PagePreloader = ({
  active: activeProp,
  background = DEFAULT_BACKGROUND,
  className,
  columns = DEFAULT_COLUMNS,
  container = false,
  defaultActive = true,
  duration = DEFAULT_DURATION_MS,
  onComplete,
  variant = "curtain",
  words = DEFAULT_WORDS,
}: PagePreloaderProps) => {
  const reduceMotionPreference = useReducedMotion();
  const shouldReduceMotion = Boolean(reduceMotionPreference);
  const isControlled = activeProp !== undefined;
  const [internalActive, setInternalActive] = useState(defaultActive);
  const active = isControlled ? Boolean(activeProp) : internalActive;
  const [stage, setStage] = useState<Stage>(active ? "hold" : "idle");
  const [wordIndex, setWordIndex] = useState(0);

  const finish = useCallback(() => {
    setStage("idle");
    if (!isControlled) {
      setInternalActive(false);
    }
    onComplete?.();
  }, [isControlled, onComplete]);

  // Sync stage with the active flag: entering re-arms the hold, and a
  // controlled dismissal while holding starts the exit.
  useEffect(() => {
    if (active) {
      setStage((current) => (current === "exiting" ? current : "hold"));
      setWordIndex(0);
      return;
    }
    setStage((current) => (current === "hold" ? "exiting" : current));
  }, [active]);

  // Uncontrolled auto-hold: exit on its own after `duration`.
  useEffect(() => {
    if (isControlled || stage !== "hold") {
      return;
    }
    const timer = setTimeout(
      () => setStage("exiting"),
      shouldReduceMotion ? 0 : duration
    );
    return () => clearTimeout(timer);
  }, [duration, isControlled, shouldReduceMotion, stage]);

  // Words cycling while holding.
  useEffect(() => {
    if (variant !== "words" || stage !== "hold" || shouldReduceMotion) {
      return;
    }
    if (words.length <= 1) {
      return;
    }
    const timer = setInterval(() => {
      setWordIndex((index) => (index + 1) % words.length);
    }, WORD_STEP_MS);
    return () => clearInterval(timer);
  }, [shouldReduceMotion, stage, variant, words.length]);

  // Exit finishes after its computed duration.
  useEffect(() => {
    if (stage !== "exiting") {
      return;
    }
    const ms = shouldReduceMotion ? 0 : getExitDurationMs(variant, columns);
    const timer = setTimeout(finish, ms);
    return () => clearTimeout(timer);
  }, [columns, finish, shouldReduceMotion, stage, variant]);

  // Lock body scroll only for full-screen overlays.
  useEffect(() => {
    if (container || stage === "idle") {
      return;
    }
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [container, stage]);

  if (stage === "idle") {
    return null;
  }

  return (
    <div
      aria-live="polite"
      className={cn(
        "overflow-hidden",
        container ? "absolute inset-0 z-40" : "fixed inset-0 z-[100]",
        className
      )}
      role="status"
    >
      <span className="sr-only">Loading</span>
      {variant === "curtain" && (
        <CurtainVariant
          background={background}
          shouldReduceMotion={shouldReduceMotion}
          stage={stage}
        />
      )}
      {variant === "stairs" && (
        <StairsVariant
          background={background}
          columns={columns}
          shouldReduceMotion={shouldReduceMotion}
          stage={stage}
        />
      )}
      {variant === "pixel" && (
        <PixelVariant
          background={background}
          columns={columns}
          shouldReduceMotion={shouldReduceMotion}
          stage={stage}
        />
      )}
      {variant === "words" && (
        <WordsVariant
          background={background}
          shouldReduceMotion={shouldReduceMotion}
          stage={stage}
          wordIndex={wordIndex}
          words={words}
        />
      )}
    </div>
  );
};

export default PagePreloader;
