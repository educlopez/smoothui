"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Divider from "./divider";
import { LoadingDots } from "./loading-dots";
import { MediaPlayer } from "./media-player";

export interface TestimonialMedia {
  id: string;
  type: "twitter";
  url: string;
}

const testimonials: TestimonialMedia[] = [
  // Add your testimonials here
  // Example:

  {
    id: "1",
    type: "twitter",
    url: "https://x.com/Lucas_Moveset/status/1990155654019887348",
  },
  {
    id: "2",
    type: "twitter",
    url: "https://x.com/PeteCapeCod/status/1962707094395556337",
  },
  {
    id: "3",
    type: "twitter",
    url: "https://x.com/orcdev/status/2007091382784303330",
  },
  {
    id: "4",
    type: "twitter",
    url: "https://x.com/dew_yashtwt/status/1986010168065466568",
  },
  {
    id: "5",
    type: "twitter",
    url: "https://x.com/Potato___Dragon/status/1980544421121970512",
  },
  {
    id: "6",
    type: "twitter",
    url: "https://x.com/openhunts/status/1980911462030950489",
  },
  {
    id: "7",
    type: "twitter",
    url: "https://x.com/jaykosai/status/1919079453017231481",
  },
];

const MIN_LOADING_DURATION_MS = 1200;
const TWEET_LOAD_CHECK_INTERVAL_MS = 200;
const MIN_LOADED_TWEETS_COUNT = 2;
const CONTENT_FADE_DELAY_MS = 100;

const STAGGER_DELAY_S = 0.08;

const entrySpring = { type: "spring" as const, duration: 0.4, bounce: 0.1 };
const hoverSpring = { type: "spring" as const, duration: 0.25, bounce: 0.1 };
const headerSpring = { type: "spring" as const, duration: 0.35, bounce: 0.1 };

const getCardAnimateState = (
  isVisible: boolean,
  reduceMotion: boolean | null
) => {
  if (isVisible && reduceMotion) {
    return { opacity: 1 };
  }
  if (isVisible) {
    return { opacity: 1, transform: "translateY(0px)" };
  }
  if (reduceMotion) {
    return { opacity: 0 };
  }
  return { opacity: 0, transform: "translateY(20px)" };
};

export function WhatTheySay() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [isHoverDevice, setIsHoverDevice] = useState(false);
  const tweetsContainerRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef(Date.now());
  const timeoutRefsRef = useRef<Set<NodeJS.Timeout>>(new Set());
  const isMountedRef = useRef(true);
  const isLoadingRef = useRef(true);
  const shouldReduceMotion = useReducedMotion();

  // Detect hover-capable devices
  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsHoverDevice(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsHoverDevice(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  // Keep ref in sync with state
  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    isMountedRef.current = true;
    isLoadingRef.current = true;

    // Helper to track and create timeouts
    const createTrackedTimeout = (
      callback: () => void,
      delay: number
    ): NodeJS.Timeout => {
      const timeoutId = setTimeout(() => {
        timeoutRefsRef.current.delete(timeoutId);
        if (isMountedRef.current) {
          callback();
        }
      }, delay);
      timeoutRefsRef.current.add(timeoutId);
      return timeoutId;
    };

    // Helper to check if loading should stop
    const shouldStopLoading = (): boolean => {
      const container = tweetsContainerRef.current;
      if (!container) {
        return false;
      }
      const actualTweets = container.querySelectorAll("[data-tweet]");
      const hasLoadedTweets = actualTweets.length >= MIN_LOADED_TWEETS_COUNT;
      const elapsed = Date.now() - startTimeRef.current;
      return hasLoadedTweets || elapsed >= MIN_LOADING_DURATION_MS;
    };

    // Helper to show content after delay
    const showContentAfterDelay = () => {
      createTrackedTimeout(() => {
        if (isMountedRef.current) {
          setShowContent(true);
        }
      }, CONTENT_FADE_DELAY_MS);
    };

    // Function to check if tweets are loaded
    // Early exit optimization: combine conditions for better performance
    const checkTweetsLoaded = () => {
      const container = tweetsContainerRef.current;
      if (!(container && isMountedRef.current && isLoadingRef.current)) {
        return;
      }

      if (shouldStopLoading()) {
        isLoadingRef.current = false;
        setIsLoading(false);
        showContentAfterDelay();
        return;
      }

      createTrackedTimeout(checkTweetsLoaded, TWEET_LOAD_CHECK_INTERVAL_MS);
    };

    // Start checking for loaded tweets after minimum duration
    createTrackedTimeout(checkTweetsLoaded, MIN_LOADING_DURATION_MS);

    return () => {
      isMountedRef.current = false;
      // Clear all tracked timeouts
      for (const timeoutId of timeoutRefsRef.current) {
        clearTimeout(timeoutId);
      }
      timeoutRefsRef.current.clear();
    };
  }, []);

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full bg-background px-8 py-24">
      <Divider />
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <motion.h2
            className="text-balance text-center font-semibold font-title text-3xl text-foreground transition"
            initial={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 0, transform: "translateY(12px)" }
            }
            transition={shouldReduceMotion ? { duration: 0 } : headerSpring}
            viewport={{ once: true, amount: 0.5 }}
            whileInView={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 1, transform: "translateY(0px)" }
            }
          >
            What They Say About Us
          </motion.h2>
          <motion.p
            className="mx-auto mt-4 max-w-2xl text-foreground/70 text-lg"
            initial={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 0, transform: "translateY(12px)" }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { ...headerSpring, delay: 0.1 }
            }
            viewport={{ once: true, amount: 0.5 }}
            whileInView={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 1, transform: "translateY(0px)" }
            }
          >
            See what developers and designers are saying about SmoothUI.
          </motion.p>
        </div>

        <div className="relative mt-4 flex min-h-[600px] gap-4 overflow-hidden px-1 pt-px">
          {/* Loading overlay - always show when loading */}
          {isLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-background">
              <LoadingDots showText size={64} />
            </div>
          )}

          {/* Tweets container - render invisibly when not ready, then animate in when ready */}
          <div
            className={cn(
              "mt-10 columns-1 gap-5 sm:columns-2 sm:gap-7 md:columns-3 [&_[data-tweet]]:mb-5",
              showContent ? "" : "pointer-events-none invisible"
            )}
            ref={tweetsContainerRef}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                animate={getCardAnimateState(showContent, shouldReduceMotion)}
                className="break-inside-avoid"
                initial={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, transform: "translateY(20px)" }
                }
                key={testimonial.id}
                style={{ willChange: "transform, opacity" }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : {
                        ...entrySpring,
                        delay: index * STAGGER_DELAY_S,
                      }
                }
                whileHover={
                  isHoverDevice && !shouldReduceMotion
                    ? {
                        transform: "translateY(-2px) scale(1.02)",
                        transition: hoverSpring,
                      }
                    : undefined
                }
              >
                <MediaPlayer key={testimonial.id} media={testimonial} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
