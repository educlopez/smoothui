"use client";

import SmoothButton from "@repo/smoothui/components/smooth-button";
import { getImageKitUrl } from "@smoothui/data";
import { motion, useReducedMotion } from "motion/react";

const SPRING = {
  type: "spring" as const,
  duration: 0.25,
  bounce: 0.1,
};

export function CtaSplit() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section aria-labelledby="cta-split-heading">
      <div className="py-24 md:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2">
          <motion.div
            initial={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -24 }
            }
            transition={shouldReduceMotion ? { duration: 0 } : SPRING}
            viewport={{ once: true }}
            whileInView={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }
            }
          >
            <h2
              className="text-balance font-bold text-3xl tracking-tight md:text-4xl"
              id="cta-split-heading"
            >
              Ship faster with animated components
            </h2>
            <p className="mt-4 text-foreground/70 text-lg leading-relaxed">
              Stop building UI from scratch. Use production-ready, beautifully
              animated components that work with your existing design system.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <SmoothButton size="lg" variant="candy">
                Browse Components
              </SmoothButton>
              <SmoothButton size="lg" variant="outline">
                View on GitHub
              </SmoothButton>
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 24 }
            }
            transition={shouldReduceMotion ? { duration: 0 } : SPRING}
            viewport={{ once: true }}
            whileInView={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }
            }
          >
            <div className="overflow-hidden rounded-2xl border shadow-lg">
              <img
                alt="Product preview showing animated UI components"
                className="h-auto w-full object-cover"
                src={getImageKitUrl("/images/hero-smoothui.png", {
                  width: 800,
                  quality: 85,
                  format: "auto",
                })}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default CtaSplit;
