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
    // The lead cell of a bento is two columns by two rows. Without something to
    // look at, that is a quarter of the section spent on two lines of text.
    visual: "analytics" as const,
    span: "col-span-2 row-span-2",
    accent: true,
  },
  {
    title: "Team Collaboration",
    description:
      "Work together in real-time with built-in commenting and sharing.",
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
    description:
      "Enterprise-grade security with SOC 2 compliance and encryption.",
    span: "col-span-1",
  },
];

/** Bars of a plausible-looking week. Fixed, so the panel never reflows. */
const SERIES = [
  { id: "w1", value: 38 },
  { id: "w2", value: 52 },
  { id: "w3", value: 44 },
  { id: "w4", value: 66 },
  { id: "w5", value: 58 },
  { id: "w6", value: 74 },
  { id: "w7", value: 62 },
  { id: "w8", value: 88 },
  { id: "w9", value: 71 },
  { id: "w10", value: 96 },
  { id: "w11", value: 84 },
  { id: "w12", value: 100 },
];
const PEAK_ID = "w12";
const BAR_STAGGER = 0.03;

/**
 * A small analytics panel for the bento's lead cell.
 *
 * Every element is real markup on the page's own tokens, so it follows the
 * theme into dark mode and stays sharp at any pixel density — and the bars can
 * grow on entry, which is the point of the library it ships with.
 */
const AnalyticsPanel = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="flex h-full flex-col gap-4 rounded-xl border bg-background p-5">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <p className="text-foreground/60 text-xs">Revenue this month</p>
          <p className="font-semibold text-2xl text-foreground tabular-nums">
            $48,219
          </p>
        </div>
        <span className="rounded-full bg-foreground/5 px-2 py-0.5 font-medium text-foreground/70 text-xs tabular-nums">
          +12.4%
        </span>
      </div>

      <div
        aria-hidden="true"
        className="flex min-h-0 flex-1 items-end gap-1.5 sm:gap-2"
      >
        {SERIES.map(({ id, value }, index) => (
          <motion.span
            className={cn(
              "flex-1 origin-bottom rounded-t-sm",
              id === PEAK_ID ? "bg-foreground" : "bg-foreground/15"
            )}
            initial={shouldReduceMotion ? { scaleY: 1 } : { scaleY: 0 }}
            key={id}
            style={{ height: `${value}%` }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { ...SPRING, delay: index * BAR_STAGGER }
            }
            viewport={{ once: true, margin: "-80px" }}
            whileInView={{ scaleY: 1 }}
          />
        ))}
      </div>
    </div>
  );
};

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
                  "flex flex-col justify-end overflow-hidden rounded-xl border p-6",
                  feature.accent
                    ? "bg-foreground/5 ring-1 ring-foreground/10"
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
                  shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }
                }
              >
                {feature.visual === "analytics" && (
                  // Drawn, not photographed. A screenshot would be fixed to one
                  // theme, blur on a retina screen and weigh more than the whole
                  // block; markup inherits the page's colours and stays sharp.
                  <div className="-mx-6 -mt-6 mb-4 min-h-0 flex-1 overflow-hidden">
                    <AnalyticsPanel />
                  </div>
                )}
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
