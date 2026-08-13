"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import {
  type MotionValue,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import type { RefObject } from "react";
import { useRef } from "react";

export type KineticTypeScrollAlign = "start" | "center" | "end";

type UseScrollOptions = Parameters<typeof useScroll>[0];
export type ScrollOffsetTuple = NonNullable<UseScrollOptions>["offset"];

export interface KineticTypeScrollProps {
  align?: KineticTypeScrollAlign;
  className?: string;
  /** Scrollable ancestor whose progress drives the effect. */
  container?: RefObject<HTMLElement | null>;
  /** Opacity at rest vs. at each word's peak. */
  dimRange?: [number, number];
  /** Vertical offset in px at rest vs. at each word's peak. */
  liftRange?: [number, number];
  /** Motion scroll offset tuple, forwarded to `useScroll`. */
  offset?: ScrollOffsetTuple;
  /** Scale applied at rest vs. at each word's peak. */
  scaleRange?: [number, number];
  /** Fractional offset between each word's active scroll window (0-1). */
  stagger?: number;
  /** Letter-spacing in px at rest vs. at each word's peak. */
  trackingRange?: [number, number];
  /**
   * `font-variation-settings` "wght" at rest vs. at each word's peak.
   * Only visible when the active font is a variable font.
   */
  weightRange?: [number, number];
  words: string[];
}

interface KineticWordProps {
  dimRange: [number, number];
  index: number;
  liftRange: [number, number];
  progress: MotionValue<number>;
  scaleRange: [number, number];
  shouldReduceMotion: boolean;
  stagger: number;
  total: number;
  trackingRange: [number, number];
  weightRange: [number, number];
  word: string;
}

const ALIGN_ROW_CLASS: Record<KineticTypeScrollAlign, string> = {
  center: "justify-center",
  end: "justify-end",
  start: "justify-start",
};

const DEFAULT_SCALE_RANGE: [number, number] = [0.92, 1.18];
const DEFAULT_TRACKING_RANGE: [number, number] = [-0.5, 2.5];
const DEFAULT_WEIGHT_RANGE: [number, number] = [380, 800];
const DEFAULT_LIFT_RANGE: [number, number] = [0, -12];
// Never fully dark: the phrase stays readable at rest and the crest is what
// lights it, so the wave is legible without the line ever going missing.
const DEFAULT_DIM_RANGE: [number, number] = [0.45, 1];
const DEFAULT_STAGGER = 0.12;
/**
 * Head- and tail-room at both ends of the scroll range: the wave starts after
 * the phrase has settled into view and ends before it leaves, so there is time
 * to read the line on either side of the effect.
 */
const WAVE_MARGIN = 0.14;
/**
 * Each word's active window as a multiple of the gap between peaks. Above 1 the
 * windows overlap, which is what turns a row of individual pulses into a single
 * wave travelling through the phrase.
 */
const WINDOW_OVERLAP = 1.2;
const MIN_WINDOW = 0.09;
const INTENSITY_MIDPOINT = 1;
const INTENSITY_SCALE = 2;
// A soft, near-critically-damped spring: the wave should read as one moving
// crest, not as each word snapping.
const SPRING_TRANSITION = {
  bounce: 0,
  duration: 0.32,
  type: "spring" as const,
};

/** Motion default (`["start start", "end end"]`) collapses on an element
 * shorter than its scroller, which left the whole effect stuck near 0. This
 * window opens as the phrase enters the lower part of the viewport and closes
 * around the time it reaches the middle. */
const DEFAULT_OFFSET = ["start 0.9", "end 0.45"] as ScrollOffsetTuple;

const KineticWord = ({
  word,
  dimRange,
  index,
  liftRange,
  progress,
  scaleRange,
  shouldReduceMotion,
  stagger,
  total,
  trackingRange,
  weightRange,
}: KineticWordProps) => {
  const gaps = Math.max(1, total - 1);
  // Peaks are evenly spaced and the whole wave is centred in the range, so a
  // short phrase does not crowd into the first third of the scroll.
  const spacing = Math.min(stagger, (1 - 2 * WAVE_MARGIN) / gaps);
  const waveStart = (1 - spacing * gaps) / 2;
  const center = waveStart + spacing * index;
  const halfWindow = Math.max(spacing * WINDOW_OVERLAP, MIN_WINDOW);
  const start = center - halfWindow;
  const end = center + halfWindow;

  const localProgress = useTransform(progress, [start, end], [0, 1], {
    clamp: true,
  });
  const intensity = useTransform(
    localProgress,
    (value) => INTENSITY_MIDPOINT - Math.abs(value * INTENSITY_SCALE - 1)
  );
  const rawScale = useTransform(intensity, [0, 1], scaleRange);
  const rawTracking = useTransform(intensity, [0, 1], trackingRange);
  const rawWeight = useTransform(intensity, [0, 1], weightRange);
  const rawLift = useTransform(intensity, [0, 1], liftRange);
  const rawOpacity = useTransform(intensity, [0, 1], dimRange);
  const scale = useSpring(rawScale, SPRING_TRANSITION);
  const trackingValue = useSpring(rawTracking, SPRING_TRANSITION);
  const weight = useSpring(rawWeight, SPRING_TRANSITION);
  const y = useSpring(rawLift, SPRING_TRANSITION);
  const opacity = useSpring(rawOpacity, SPRING_TRANSITION);
  const letterSpacing = useTransform(trackingValue, (value) => `${value}px`);
  const fontVariationSettings = useTransform(
    weight,
    (value) => `"wght" ${Math.round(value)}`
  );

  if (shouldReduceMotion) {
    // No travel and no dimming — the phrase simply reads at its peak weight.
    return (
      <span
        aria-hidden="true"
        className="inline-block"
        style={{ fontVariationSettings: `"wght" ${weightRange[1]}` }}
      >
        {word}
      </span>
    );
  }

  return (
    <motion.span
      aria-hidden="true"
      className="inline-block will-change-transform"
      style={{ fontVariationSettings, letterSpacing, opacity, scale, y }}
    >
      {word}
    </motion.span>
  );
};

/**
 * KineticTypeScroll — editorial kinetic typography driven by scroll.
 * Each word maps a slice of scroll progress to its own scale, tracking
 * and weight curve so the phrase breathes as the section scrolls.
 */
export default function KineticTypeScroll({
  words,
  align = "center",
  className,
  container,
  dimRange = DEFAULT_DIM_RANGE,
  liftRange = DEFAULT_LIFT_RANGE,
  offset = DEFAULT_OFFSET,
  scaleRange = DEFAULT_SCALE_RANGE,
  stagger = DEFAULT_STAGGER,
  trackingRange = DEFAULT_TRACKING_RANGE,
  weightRange = DEFAULT_WEIGHT_RANGE,
}: KineticTypeScrollProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    container,
    offset,
    target: wrapperRef,
  });

  return (
    <div
      className={cn(
        // Gaps are in `em` and sized to clear the peak scale: `scale` is a
        // transform, so a magnified word overflows its layout box and a fixed
        // 8px gutter lets the crest collide with its neighbours.
        "flex flex-wrap gap-x-[0.4em] gap-y-[0.18em]",
        ALIGN_ROW_CLASS[align],
        className
      )}
      ref={wrapperRef}
    >
      {/* Every glyph below is aria-hidden, so the readable copy lives here. An
          aria-label on this plain div would be dropped by assistive tech. */}
      <span className="sr-only">{words.join(" ")}</span>
      {words.map((word, index) => (
        <KineticWord
          dimRange={dimRange}
          index={index}
          // biome-ignore lint/suspicious/noArrayIndexKey: words may repeat and have no stable id
          key={index}
          liftRange={liftRange}
          progress={scrollYProgress}
          scaleRange={scaleRange}
          shouldReduceMotion={!!shouldReduceMotion}
          stagger={stagger}
          total={words.length}
          trackingRange={trackingRange}
          weightRange={weightRange}
          word={word}
        />
      ))}
    </div>
  );
}
