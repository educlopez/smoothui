"use client";

import SmoothButton from "@repo/smoothui/components/smooth-button";
import { motion, useReducedMotion } from "motion/react";

const SPRING = {
  type: "spring" as const,
  duration: 0.25,
  bounce: 0.1,
};

export function CtaBanner() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section aria-labelledby="cta-banner-heading">
      <div className="px-6 py-12">
        <motion.div
          className="mx-auto max-w-4xl overflow-hidden rounded-2xl border bg-gradient-to-r from-primary/5 via-background to-primary/5 p-8 md:p-12"
          initial={
            shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.97 }
          }
          transition={shouldReduceMotion ? { duration: 0 } : SPRING}
          viewport={{ once: true }}
          whileInView={
            shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }
          }
        >
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <h2
                className="font-bold text-xl md:text-2xl"
                id="cta-banner-heading"
              >
                Start building today
              </h2>
              <p className="mt-1 text-foreground/70 text-sm md:text-base">
                Install any component with a single command.
              </p>
            </div>
            <SmoothButton variant="candy">Get Started →</SmoothButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default CtaBanner;
