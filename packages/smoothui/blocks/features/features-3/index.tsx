"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { getImageKitUrl } from "@smoothui/data";
import { motion, useReducedMotion } from "motion/react";

const SPRING = {
  type: "spring" as const,
  duration: 0.25,
  bounce: 0.1,
};

const features = [
  {
    title: "Intuitive Design",
    description:
      "Every component is designed with usability in mind. Clean interfaces that your users will love from the first interaction.",
    image: getImageKitUrl("/images/designerworking.webp", {
      width: 800,
      quality: 85,
      format: "auto",
    }),
    imageAlt: "Designer working on user interface",
  },
  {
    title: "Blazing Performance",
    description:
      "Optimized animations that only use transform and opacity. Hardware-accelerated rendering for butter-smooth 60fps experiences.",
    image: getImageKitUrl("/images/hero-smoothui.png", {
      width: 800,
      quality: 85,
      format: "auto",
    }),
    imageAlt: "SmoothUI component showcase",
  },
  {
    title: "Developer Experience",
    description:
      "Full TypeScript support, comprehensive documentation, and one-command installation via the shadcn registry.",
    image: getImageKitUrl("/images/hero-example_xertaz.png", {
      width: 800,
      quality: 85,
      format: "auto",
    }),
    imageAlt: "Code example with TypeScript support",
  },
];

export function FeaturesAlternating() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section aria-labelledby="features-alternating-heading">
      <div className="py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2
              className="text-balance font-bold text-3xl tracking-tight md:text-4xl"
              id="features-alternating-heading"
            >
              Why developers choose us
            </h2>
            <p className="mt-4 text-foreground/70 text-lg">
              Designed for developer productivity and user delight.
            </p>
          </div>
          <div className="space-y-24">
            {features.map((feature, index) => {
              const isReversed = index % 2 === 1;
              const slideDirection = isReversed ? 24 : -24;

              return (
                <div
                  className={cn(
                    "grid items-center gap-12 md:grid-cols-2",
                    isReversed && "md:[direction:rtl]"
                  )}
                  key={feature.title}
                >
                  <motion.div
                    className="md:[direction:ltr]"
                    initial={
                      shouldReduceMotion
                        ? { opacity: 1 }
                        : { opacity: 0, x: slideDirection }
                    }
                    transition={shouldReduceMotion ? { duration: 0 } : SPRING}
                    viewport={{ once: true, margin: "-100px" }}
                    whileInView={
                      shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }
                    }
                  >
                    <h3 className="mb-4 font-bold text-2xl">{feature.title}</h3>
                    <p className="text-foreground/70 text-lg leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>

                  <motion.div
                    className="md:[direction:ltr]"
                    initial={
                      shouldReduceMotion
                        ? { opacity: 1 }
                        : { opacity: 0, x: -slideDirection }
                    }
                    transition={shouldReduceMotion ? { duration: 0 } : SPRING}
                    viewport={{ once: true, margin: "-100px" }}
                    whileInView={
                      shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }
                    }
                  >
                    <div className="overflow-hidden rounded-xl border shadow-md">
                      <img
                        alt={feature.imageAlt}
                        className="aspect-video h-auto w-full object-cover"
                        src={feature.image}
                      />
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesAlternating;
