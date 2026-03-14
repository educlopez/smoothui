"use client";

import SmoothButton from "@repo/smoothui/components/smooth-button";
import { motion, useReducedMotion } from "motion/react";

const SPRING = {
  type: "spring" as const,
  duration: 0.25,
  bounce: 0.1,
};

export function HeroSpotlight() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section aria-labelledby="hero-spotlight-heading">
      <div className="relative flex min-h-[600px] items-center justify-center overflow-hidden bg-zinc-950 py-24 md:py-32">
        {/* Spotlight beam */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-1/2 h-full w-[600px] -translate-x-1/2"
          initial={
            shouldReduceMotion
              ? { opacity: 0.15 }
              : { opacity: 0, scaleX: 0 }
          }
          style={{
            background:
              "conic-gradient(from 180deg at 50% 0%, transparent 40%, rgba(120, 119, 198, 0.12) 50%, transparent 60%)",
          }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.8, ease: [0.23, 1, 0.32, 1] }
          }
          viewport={{ once: true }}
          whileInView={
            shouldReduceMotion
              ? { opacity: 0.15 }
              : { opacity: 0.15, scaleX: 1 }
          }
        />

        {/* Floating particles */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              className="absolute h-1 w-1 rounded-full bg-white/20"
              key={`particle-${i}`}
              style={{
                left: `${(i * 37 + 13) % 100}%`,
                top: `${(i * 53 + 7) % 100}%`,
                animation: `pulse ${2 + (i % 3)}s ease-in-out infinite ${(i % 5) * 0.5}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { ...SPRING, staggerChildren: 0.08 }
            }
            viewport={{ once: true }}
            whileInView={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }
            }
          >
            <h1
              className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text font-bold text-4xl text-transparent tracking-tight md:text-6xl lg:text-7xl"
              id="hero-spotlight-heading"
            >
              Build stunning interfaces
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-zinc-400 text-lg">
              Beautifully animated components built with React, Motion, and
              Tailwind CSS. Open source and ready for production.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <SmoothButton className="bg-white text-zinc-900 hover:bg-zinc-200" size="lg">
                Get Started
              </SmoothButton>
              <SmoothButton className="border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800" size="lg" variant="outline">
                Documentation
              </SmoothButton>
            </div>
          </motion.div>
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.8; }
          }
        `}</style>
      </div>
    </section>
  );
}

export default HeroSpotlight;
