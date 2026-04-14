"use client";

import SmoothButton from "@repo/smoothui/components/smooth-button";
import { motion, useReducedMotion } from "motion/react";

const SPRING = {
  type: "spring" as const,
  duration: 0.25,
  bounce: 0.1,
};

export function CtaCentered() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section aria-labelledby="cta-centered-heading">
      <div className="relative overflow-hidden bg-muted/50 py-24 md:py-32">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-primary)/0.08,transparent_70%)]"
        />
        <motion.div
          className="relative mx-auto max-w-3xl px-6 text-center"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
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
          <h2
            className="text-balance font-bold text-3xl tracking-tight md:text-4xl lg:text-5xl"
            id="cta-centered-heading"
          >
            Ready to build something amazing?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-balance text-foreground/70 text-lg">
            Start building with beautifully animated components today. Free,
            open source, and ready for production.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <SmoothButton size="lg" variant="candy">
              Get Started
            </SmoothButton>
            <SmoothButton size="lg" variant="outline">
              Learn More
            </SmoothButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default CtaCentered;
