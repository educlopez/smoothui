"use client";

import { getAvatarUrl, getTestimonials } from "@smoothui/data";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const TESTIMONIAL_COUNT = 4;
const AVATAR_SIZE = 96;
const DURATION = 5000; // ms
const BAR_WIDTH = 50;
const CIRCLE_SIZE = 12;
const BORDER_RADIUS_ACTIVE = 8;
const BORDER_RADIUS_INACTIVE = 999;
const MILLISECONDS_TO_SECONDS = 1000;

const testimonials = getTestimonials(TESTIMONIAL_COUNT).map((testimonial) => ({
  quote: testimonial.content || "",
  avatar: testimonial.avatar,
  name: testimonial.name,
  role: testimonial.role,
}));

export function TestimonialsSimple() {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, DURATION);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <section className="relative flex flex-col items-center bg-background py-16">
      <div className="flex w-full max-w-5xl flex-col items-center justify-center px-4">
        <div className="min-h-[120px] w-full">
          <AnimatePresence mode="wait">
            <motion.blockquote
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 text-center font-semibold text-2xl text-foreground leading-tight md:text-4xl"
              exit={{ opacity: 0, y: -30 }}
              initial={{ opacity: 0, y: 30 }}
              key={index}
              transition={{ type: "spring", duration: 0.5 }}
            >
              &ldquo;{testimonials[index].quote}&rdquo;
            </motion.blockquote>
          </AnimatePresence>
        </div>
        <div className="flex w-full max-w-lg items-center justify-center gap-8 pt-8">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              animate={{ opacity: 1, filter: "blur(0px)" }}
              className="flex items-center gap-4"
              exit={{ opacity: 0, filter: "blur(8px)" }}
              initial={{ opacity: 0, filter: "blur(8px)" }}
              key={index}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <img
                alt={`${testimonials[index].name} avatar`}
                className="h-12 w-12 rounded-full border bg-foreground/10 object-cover"
                height={48}
                src={getAvatarUrl(testimonials[index].avatar, AVATAR_SIZE)}
                width={48}
              />
              <div className="mx-4 h-8 border-muted-foreground/30 border-l" />
              <div className="text-left">
                <div className="font-medium text-foreground text-lg italic">
                  {testimonials[index].name}
                </div>
                <div className="text-base text-muted-foreground">
                  {testimonials[index].role}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        {/* Progress Bar & Circles Indicator */}
        <div className="mx-auto mt-8 flex w-full max-w-lg justify-center gap-3">
          {testimonials.map((testimonial, i) => {
            const isActive = i === index;
            return (
              <motion.span
                animate={{
                  width: isActive ? BAR_WIDTH : CIRCLE_SIZE,
                  height: CIRCLE_SIZE,
                  borderRadius: isActive
                    ? BORDER_RADIUS_ACTIVE
                    : BORDER_RADIUS_INACTIVE,
                }}
                className="relative block overflow-hidden bg-foreground/10"
                initial={false}
                key={`testimonial-${testimonial.name}-${i}`}
                layout
                style={{
                  minWidth: CIRCLE_SIZE,
                  maxWidth: BAR_WIDTH,
                  border: "none",
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  duration: 0.4,
                }}
              >
                {isActive && (
                  <motion.div
                    animate={{ width: "100%" }}
                    className="absolute top-0 left-0 h-full rounded-lg bg-brand"
                    exit={{ width: 0 }}
                    initial={{ width: 0 }}
                    key={index}
                    transition={{
                      duration: DURATION / MILLISECONDS_TO_SECONDS,
                      ease: "linear",
                    }}
                  />
                )}
              </motion.span>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSimple;
