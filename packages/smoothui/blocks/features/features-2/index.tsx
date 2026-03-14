"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { motion, useReducedMotion } from "motion/react";

const SPRING = {
  type: "spring" as const,
  duration: 0.25,
  bounce: 0.1,
};

const features = [
  {
    title: "Smart Analytics",
    description:
      "Real-time analytics dashboard with customizable metrics and beautiful visualizations.",
    span: "col-span-2 row-span-2",
    accent: true,
  },
  {
    title: "Team Collaboration",
    description: "Work together in real-time with built-in commenting and sharing.",
    span: "col-span-1",
  },
  {
    title: "API First",
    description: "RESTful API with comprehensive documentation and SDKs.",
    span: "col-span-1",
  },
  {
    title: "Global CDN",
    description: "Lightning-fast delivery from edge locations worldwide.",
    span: "col-span-1",
  },
  {
    title: "Security",
    description: "Enterprise-grade security with SOC 2 compliance and encryption.",
    span: "col-span-1",
  },
];

export function FeaturesBento() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section aria-labelledby="features-bento-heading">
      <div className="py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2
              className="text-balance font-bold text-3xl tracking-tight md:text-4xl"
              id="features-bento-heading"
            >
              Built for modern teams
            </h2>
            <p className="mt-4 text-foreground/70 text-lg">
              A complete platform with everything you need to ship faster.
            </p>
          </div>
          <div className="grid auto-rows-[180px] grid-cols-2 gap-4 md:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                className={cn(
                  "flex flex-col justify-end rounded-xl border p-6",
                  feature.accent
                    ? "bg-primary/5 ring-1 ring-primary/10"
                    : "bg-background",
                  feature.span
                )}
                initial={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : { opacity: 0, scale: 0.95 }
                }
                key={feature.title}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { ...SPRING, delay: index * 0.05 }
                }
                viewport={{ once: true, margin: "-100px" }}
                whileInView={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : { opacity: 1, scale: 1 }
                }
              >
                <h3 className="mb-1 font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-foreground/70 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesBento;
