"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

export type RollingTextDirection = "up" | "down";
export type RollingTextTrigger = "mount" | "inView" | "hover" | "manual";

export interface RollingTextProps {
  className?: string;
  /** Direction the glyph column rolls in before landing. */
  direction?: RollingTextDirection;
  /** Roll duration per character, in milliseconds. */
  duration?: number;
  /**
   * Ramp alphabet cycled through before landing on the target character.
   * Defaults to the unique characters found in `text`.
   */
  glyphs?: string;
  /** Plays the roll when `trigger` is "manual" and this flips to `true`. */
  playing?: boolean;
  /** Number of intermediate glyphs shown before the target lands. */
  rampLength?: number;
  /** Per-character stagger, in milliseconds. */
  stagger?: number;
  text: string;
  trigger?: RollingTextTrigger;
}

interface RollingCharacter {
  isWhitespace: boolean;
  items: string[];
  key: string;
  targetIndex: number;
}

const DEFAULT_DURATION = 500;
const DEFAULT_STAGGER = 40;
const DEFAULT_RAMP_LENGTH = 4;
const MS = 1000;
const PERCENT = 100;
const DEFAULT_GLYPH_POOL =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const MOVEMENT_EASE = [0.645, 0.045, 0.355, 1] as const;

const segmentGraphemes = (value: string): string[] => {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter(undefined, {
      granularity: "grapheme",
    });
    return Array.from(segmenter.segment(value), (entry) => entry.segment);
  }
  return [...value];
};

const buildGlyphPool = (text: string, glyphs?: string): string[] => {
  if (glyphs && glyphs.length > 0) {
    return segmentGraphemes(glyphs);
  }
  const unique = Array.from(
    new Set(segmentGraphemes(text).filter((char) => char.trim().length > 0))
  );
  return unique.length > 1 ? unique : segmentGraphemes(DEFAULT_GLYPH_POOL);
};

const buildRamp = (
  target: string,
  pool: string[],
  rampLength: number,
  direction: RollingTextDirection
): string[] => {
  const randomGlyphs = Array.from(
    { length: rampLength },
    () => pool[Math.floor(Math.random() * pool.length)] ?? target
  );
  const ramp = [...randomGlyphs, target];
  return direction === "down" ? ramp.reverse() : ramp;
};

const buildCharacters = (
  text: string,
  pool: string[],
  rampLength: number,
  direction: RollingTextDirection
): RollingCharacter[] => {
  const occurrences = new Map<string, number>();
  return segmentGraphemes(text).map((char) => {
    const count = occurrences.get(char) ?? 0;
    occurrences.set(char, count + 1);
    const isWhitespace = char.trim().length === 0;
    const items = isWhitespace
      ? [char]
      : buildRamp(char, pool, rampLength, direction);
    return {
      isWhitespace,
      items,
      key: `${char}-${count}`,
      targetIndex: direction === "down" ? 0 : items.length - 1,
    };
  });
};

/**
 * RollingText — odometer-style vertical roll. Each character cycles
 * through a short ramp of glyphs, like a split-flap display, before
 * landing on its target.
 */
export default function RollingText({
  text,
  className,
  direction = "up",
  duration = DEFAULT_DURATION,
  glyphs,
  playing = false,
  rampLength = DEFAULT_RAMP_LENGTH,
  stagger = DEFAULT_STAGGER,
  trigger = "mount",
}: RollingTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(containerRef, { once: true });
  const shouldReduceMotion = useReducedMotion();
  const [playCount, setPlayCount] = useState(() =>
    trigger === "mount" ? 1 : 0
  );
  const [isHoverDevice, setIsHoverDevice] = useState(false);
  const wasPlayingRef = useRef(playing);

  useEffect(() => {
    const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsHoverDevice(hoverQuery.matches);
    const handleHoverChange = (event: MediaQueryListEvent) => {
      setIsHoverDevice(event.matches);
    };
    hoverQuery.addEventListener("change", handleHoverChange);
    return () => hoverQuery.removeEventListener("change", handleHoverChange);
  }, []);

  useEffect(() => {
    if (trigger === "inView" && inView && !shouldReduceMotion) {
      setPlayCount((count) => count + 1);
    }
  }, [trigger, inView, shouldReduceMotion]);

  useEffect(() => {
    if (
      trigger === "manual" &&
      playing &&
      !wasPlayingRef.current &&
      !shouldReduceMotion
    ) {
      setPlayCount((count) => count + 1);
    }
    wasPlayingRef.current = playing;
  }, [trigger, playing, shouldReduceMotion]);

  const pool = useMemo(() => buildGlyphPool(text, glyphs), [text, glyphs]);
  const characters = useMemo(
    () => buildCharacters(text, pool, rampLength, direction),
    [text, pool, rampLength, direction, playCount]
  );

  const handlePointerEnter = () => {
    if (trigger === "hover" && isHoverDevice && !shouldReduceMotion) {
      setPlayCount((count) => count + 1);
    }
  };

  if (shouldReduceMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span
      className={className}
      onPointerEnter={handlePointerEnter}
      ref={containerRef}
    >
      {/* Every glyph below is aria-hidden, so the readable copy lives here. An
          aria-label on this plain span would be dropped by assistive tech. */}
      <span className="sr-only">{text}</span>
      {characters.map((character, characterIndex) =>
        character.isWhitespace ? (
          <span
            aria-hidden="true"
            key={character.key}
            style={{ display: "inline-block", whiteSpace: "pre" }}
          >
            {character.items[0]}
          </span>
        ) : (
          <span
            aria-hidden="true"
            key={character.key}
            style={{
              display: "inline-block",
              height: "1em",
              lineHeight: "1em",
              overflow: "hidden",
              verticalAlign: "bottom",
            }}
          >
            <motion.span
              animate={{
                y: `${-(character.targetIndex / character.items.length) * PERCENT}%`,
              }}
              initial={{
                y:
                  direction === "down"
                    ? `${-((character.items.length - 1) / character.items.length) * PERCENT}%`
                    : "0%",
              }}
              key={playCount}
              style={{ display: "flex", flexDirection: "column" }}
              transition={{
                delay: (characterIndex * stagger) / MS,
                duration: duration / MS,
                ease: MOVEMENT_EASE,
              }}
            >
              {character.items.map((glyph, glyphIndex) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: ramp glyphs have no stable id
                  key={glyphIndex}
                  style={{
                    display: "block",
                    height: "1em",
                    lineHeight: "1em",
                  }}
                >
                  {glyph}
                </span>
              ))}
            </motion.span>
          </span>
        )
      )}
    </span>
  );
}
