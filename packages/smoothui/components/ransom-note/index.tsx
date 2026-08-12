"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import {
  motion,
  type TargetAndTransition,
  useReducedMotion,
} from "motion/react";
import { useMemo } from "react";

export type RansomNoteAnimate = "none" | "assemble" | "jitter";

export interface RansomNoteProps {
  /** How the scraps enter/behave: fly in, idly wobble, or render static. */
  animate?: RansomNoteAnimate;
  className?: string;
  /** Font-family stacks to pick from for each character. */
  fonts?: string[];
  /** How wild the per-character variation gets, from 0 (subtle) to 1 (chaotic). */
  intensity?: number;
  /** Background colors used for each cut-out paper scrap. */
  palette?: string[];
  /** Maximum rotation, in degrees, applied to any scrap. */
  rotation?: number;
  /** Deterministic seed for the scrap layout. Same seed + text = same layout. */
  seed?: number;
  /** Delay, in seconds, added between each scrap's entrance/wobble. */
  stagger?: number;
  text: string;
}

interface RansomNoteScrap {
  backgroundColor?: string;
  char: string;
  entranceOffsetX: number;
  entranceOffsetY: number;
  entranceRotation: number;
  fontFamily: string;
  fontScale: number;
  isWhitespace: boolean;
  jitterDuration: number;
  jitterRotation: number;
  rotation: number;
  skew: number;
}

type RansomNoteRestState = {
  opacity: number;
  rotate: number;
  x: number;
  y: number;
};

interface RansomNoteTransition {
  bounce?: number;
  delay?: number;
  duration?: number;
  ease?: readonly [number, number, number, number];
  repeat?: number;
  repeatType?: "mirror";
  type?: "spring";
}

// mulberry32 constants
const MULBERRY32_INCREMENT = 0x6d_2b_79_f5;
const UINT32_DIVISOR = 4_294_967_296;

/**
 * Deterministic, seedable PRNG (mulberry32). Given the same seed it always
 * produces the same sequence of numbers in [0, 1), so layouts stay stable
 * across renders and are safe to compute during SSR.
 */
export const createSeededRandom = (seed: number): (() => number) => {
  let state = seed;
  return () => {
    state = (state + MULBERRY32_INCREMENT) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / UINT32_DIVISOR;
  };
};

const DEFAULT_SEED = 1;
const DEFAULT_INTENSITY = 0.6;
const DEFAULT_ROTATION_MAX = 8;
const DEFAULT_STAGGER_SECONDS = 0.03;
const MIN_INTENSITY = 0;
const MAX_INTENSITY = 1;

const DEFAULT_FONTS = [
  "Georgia, 'Times New Roman', serif",
  "'Courier New', Courier, monospace",
  "Impact, 'Arial Narrow Bold', sans-serif",
  "'Brush Script MT', cursive",
  "Verdana, Geneva, sans-serif",
  "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
];

const DEFAULT_PALETTE = [
  "#f7f1e3",
  "#fdf6e3",
  "#f1e4c3",
  "#e9dcc0",
  "#fbeee0",
  "#eee2cf",
];

const SCRAP_TEXT_COLOR = "#1f1b16";

const FONT_SCALE_BASE = 0.85;
const FONT_SCALE_VARIANCE = 0.5;
const ENTRANCE_OFFSET_BASE = 24;
const ENTRANCE_OFFSET_VARIANCE = 60;
const ENTRANCE_ROTATION_VARIANCE = 30;
const SKEW_MAX = 6;
const JITTER_ROTATION_BASE = 1.5;
const JITTER_ROTATION_VARIANCE = 2.5;
const JITTER_DURATION_MIN_SECONDS = 0.6;
const JITTER_DURATION_VARIANCE_SECONDS = 0.6;

const SPRING_DURATION = 0.25;
const SPRING_BOUNCE = 0.1;
const STATIC_TRANSITION: { duration: number } = { duration: 0 };
// ease-in-out cubic-bezier for the moving (idle wobble) loop, per the
// project's animation guidelines.
const JITTER_EASE: [number, number, number, number] = [0.645, 0.045, 0.355, 1];

const WHITESPACE_PATTERN = /\s/;

const randomInRange = (rand: () => number, min: number, max: number) =>
  min + rand() * (max - min);

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const RansomNote = ({
  animate = "assemble",
  className,
  fonts = DEFAULT_FONTS,
  intensity = DEFAULT_INTENSITY,
  palette = DEFAULT_PALETTE,
  rotation = DEFAULT_ROTATION_MAX,
  seed = DEFAULT_SEED,
  stagger = DEFAULT_STAGGER_SECONDS,
  text,
}: RansomNoteProps) => {
  const shouldReduceMotion = useReducedMotion();
  const clampedIntensity = clamp(intensity, MIN_INTENSITY, MAX_INTENSITY);

  const scraps = useMemo<RansomNoteScrap[]>(() => {
    const rand = createSeededRandom(seed);
    const characters = Array.from(text);
    const fontStack = fonts.length > 0 ? fonts : DEFAULT_FONTS;
    const colorStack = palette.length > 0 ? palette : DEFAULT_PALETTE;

    return characters.map((char) => {
      const isWhitespace = WHITESPACE_PATTERN.test(char);
      const fontFamily = fontStack[Math.floor(rand() * fontStack.length)];
      const backgroundColor = isWhitespace
        ? undefined
        : colorStack[Math.floor(rand() * colorStack.length)];
      const fontScale =
        FONT_SCALE_BASE + rand() * FONT_SCALE_VARIANCE * clampedIntensity;
      const restRotation =
        randomInRange(rand, -rotation, rotation) * clampedIntensity;
      const entranceSpread =
        ENTRANCE_OFFSET_BASE + ENTRANCE_OFFSET_VARIANCE * clampedIntensity;
      const entranceOffsetX = randomInRange(
        rand,
        -entranceSpread,
        entranceSpread
      );
      const entranceOffsetY = randomInRange(
        rand,
        -entranceSpread,
        entranceSpread
      );
      const entranceRotation =
        randomInRange(
          rand,
          -ENTRANCE_ROTATION_VARIANCE,
          ENTRANCE_ROTATION_VARIANCE
        ) * clampedIntensity;
      const skew = randomInRange(rand, -SKEW_MAX, SKEW_MAX) * clampedIntensity;
      const jitterRotation =
        JITTER_ROTATION_BASE +
        rand() * JITTER_ROTATION_VARIANCE * clampedIntensity;
      const jitterDuration =
        JITTER_DURATION_MIN_SECONDS + rand() * JITTER_DURATION_VARIANCE_SECONDS;

      return {
        backgroundColor,
        char,
        entranceOffsetX,
        entranceOffsetY,
        entranceRotation,
        fontFamily,
        fontScale,
        isWhitespace,
        jitterDuration,
        jitterRotation,
        rotation: restRotation,
        skew,
      };
    });
    // fonts/palette/rotation are included because they change the derived
    // per-character values below; the layout otherwise stays stable for a
    // given text + seed + intensity combination.
  }, [text, seed, clampedIntensity, fonts, palette, rotation]);

  return (
    <div className={cn("relative inline-block", className)}>
      <span className="sr-only">{text}</span>
      <div
        aria-hidden="true"
        className="flex flex-wrap items-baseline leading-none"
      >
        {scraps.map((scrap, index) => {
          const restState: RansomNoteRestState = {
            opacity: 1,
            rotate: scrap.rotation,
            x: 0,
            y: 0,
          };

          let initial: TargetAndTransition = restState;
          let animateState: TargetAndTransition = restState;
          let transition: RansomNoteTransition = STATIC_TRANSITION;

          if (!shouldReduceMotion && animate === "assemble") {
            initial = {
              opacity: 0,
              rotate: scrap.rotation + scrap.entranceRotation,
              x: scrap.entranceOffsetX,
              y: scrap.entranceOffsetY,
            };
            animateState = restState;
            transition = {
              bounce: SPRING_BOUNCE,
              delay: index * stagger,
              duration: SPRING_DURATION,
              type: "spring",
            };
          } else if (!shouldReduceMotion && animate === "jitter") {
            initial = restState;
            animateState = {
              rotate: [
                scrap.rotation - scrap.jitterRotation,
                scrap.rotation + scrap.jitterRotation,
              ],
            };
            transition = {
              delay: index * stagger,
              duration: scrap.jitterDuration,
              ease: JITTER_EASE,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "mirror",
            };
          }

          return (
            <motion.span
              animate={animateState}
              className={cn(
                "inline-block select-none whitespace-pre",
                !scrap.isWhitespace &&
                  "rounded-sm px-1 py-0.5 shadow-sm ring-1 ring-black/10"
              )}
              initial={initial}
              // biome-ignore lint/suspicious/noArrayIndexKey: characters have no stable id
              key={index}
              style={{
                backgroundColor: scrap.backgroundColor,
                color: scrap.isWhitespace ? undefined : SCRAP_TEXT_COLOR,
                fontFamily: scrap.fontFamily,
                fontSize: `${scrap.fontScale}em`,
                skewX: scrap.skew,
                transformOrigin: "50% 50%",
              }}
              transition={transition}
            >
              {scrap.char}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
};

export default RansomNote;
