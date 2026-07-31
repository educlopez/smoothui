"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

export interface KineticCenterBuildProps {
  className?: string;
  /** Interval between phrase completions in milliseconds. */
  interval?: number;
  phrases: string[];
}

const BUILD_EASE = [0.2, 0.8, 0.2, 1] as const;
const EXIT_EASE = [0.4, 0, 0.2, 1] as const;

/**
 * KineticCenterBuild — Apple keynote-style word-by-word build.
 * Each new word enters from the right and pushes the line until the full phrase locks centered.
 * From the animate-text catalog (`kinetic-center-build`).
 */
export default function KineticCenterBuild({
  phrases,
  className = "",
  interval = 2500,
}: KineticCenterBuildProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [wordCount, setWordCount] = useState(1);
  const [exiting, setExiting] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const currentPhrase = phrases[phraseIndex] ?? "";
  const words = currentPhrase.split(" ");

  // biome-ignore lint/correctness/useExhaustiveDependencies: words.length drives the build schedule
  useEffect(() => {
    if (shouldReduceMotion) {
      const holdId = setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }, interval);
      return () => clearTimeout(holdId);
    }

    setWordCount(1);
    setExiting(false);

    const buildTimers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 1; i < words.length; i++) {
      buildTimers.push(
        setTimeout(() => {
          setWordCount(i + 1);
        }, i * 430)
      );
    }

    const totalBuild = (words.length - 1) * 430 + 340;
    const holdId = setTimeout(() => {
      setExiting(true);
      setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
        setWordCount(1);
        setExiting(false);
      }, 260 + 220);
    }, totalBuild + interval);

    buildTimers.push(holdId);
    return () => {
      for (const t of buildTimers) {
        clearTimeout(t);
      }
    };
  }, [phraseIndex, phrases.length, interval, shouldReduceMotion, words.length]);

  const visibleWords = shouldReduceMotion ? words : words.slice(0, wordCount);
  const restingAnimate = shouldReduceMotion
    ? { opacity: 1 }
    : { filter: "blur(0px)", opacity: 1, scale: 1, x: 0, y: 0 };
  const exitAnimate = {
    filter: "blur(2.5px)",
    opacity: 0,
    transition: { duration: 0.26, ease: EXIT_EASE },
    y: -6,
  };

  return (
    <span
      aria-live="polite"
      className={`flex flex-wrap items-center justify-center ${className}`}
      style={{ gap: 10 }}
    >
      <AnimatePresence mode="popLayout">
        {visibleWords.map((word, i) => (
          <motion.span
            animate={exiting ? exitAnimate : restingAnimate}
            initial={
              shouldReduceMotion
                ? { opacity: 1 }
                : {
                    filter: "blur(3.5px)",
                    opacity: 0,
                    scale: 0.992,
                    x: 88,
                    y: 6,
                  }
            }
            // biome-ignore lint/suspicious/noArrayIndexKey: word position is the stable identity within a phrase
            key={`${phraseIndex}-${i}`}
            layout
            style={{ display: "inline-block" }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : {
                    duration: i === 0 ? 0.34 : 0.43,
                    ease: BUILD_EASE,
                    layout: { duration: 0.43, ease: BUILD_EASE },
                  }
            }
          >
            {word}
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  );
}
