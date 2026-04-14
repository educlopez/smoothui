"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { motion, useReducedMotion } from "motion/react";

export function HeroMinimal() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section aria-labelledby="hero-minimal-heading">
      <div className="flex min-h-[500px] items-center justify-center py-24 md:py-32">
        <motion.div
          className="mx-auto max-w-2xl px-6 text-center"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.4, ease: [0.23, 1, 0.32, 1] }
          }
          viewport={{ once: true }}
          whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1 }}
        >
          <motion.h1
            className="font-bold text-4xl tracking-tight md:text-5xl lg:text-6xl"
            id="hero-minimal-heading"
            initial={
              shouldReduceMotion ? undefined : { letterSpacing: "0.05em" }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.6, ease: [0.23, 1, 0.32, 1] }
            }
            viewport={{ once: true }}
            whileInView={
              shouldReduceMotion ? undefined : { letterSpacing: "0em" }
            }
          >
            Less is more
          </motion.h1>
          <p className="mt-6 text-foreground/60 text-lg">
            Simple, elegant components that speak for themselves.
          </p>
          <a
            className={cn(
              "mt-10 inline-flex items-center gap-1 font-medium text-foreground text-sm underline underline-offset-4 transition-colors hover:text-foreground/70",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
            href="#"
          >
            Explore components →
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroMinimal;
