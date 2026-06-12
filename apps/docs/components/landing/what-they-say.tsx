"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import AgentAvatar from "@repo/smoothui/components/agent-avatar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import Divider from "./divider";

type Testimonial = {
  id: string;
  name: string;
  handle: string;
  quote: string;
};

type Page = {
  variant: "brand" | "dark";
  feature: Testimonial;
  sides: [Testimonial, Testimonial];
};

// Static testimonial copy (pulled from real tweets). No live embeds — full
// control over layout and animation.
const PAGES: Page[] = [
  {
    variant: "brand",
    feature: {
      id: "orcdev",
      name: "OrcDev",
      handle: "@orcdev",
      quote:
        "Love your project Edu! Keep it up — can't wait to see what you cook next 🔥",
    },
    sides: [
      {
        id: "lucas",
        name: "Lucas",
        handle: "@Lucas_Moveset",
        quote:
          "Great resource! UI libraries like SmoothUI simplify your workflow and boost your project's design aesthetic. Happy coding!",
      },
      {
        id: "pete",
        name: "Peter Cruckshank",
        handle: "@PeteCapeCod",
        quote:
          "I just checked out SmoothUI and that's some great stuff! 👏 Great job 👍",
      },
    ],
  },
  {
    variant: "dark",
    feature: {
      id: "jaykosai",
      name: "jeth.eth",
      handle: "@jaykosai",
      quote:
        "All I can say is 🙌🔥 — I'm planning to build something crazy with it.",
    },
    sides: [
      {
        id: "potato",
        name: "Potato Dragon",
        handle: "@Potato___Dragon",
        quote:
          "I really liked the buttons on the SmoothUI website — that clickable kind of animation. Can you share it?",
      },
      {
        id: "openhunts",
        name: "openhunts",
        handle: "@openhunts",
        quote: "I love this UI component from @educalvolpz!",
      },
    ],
  },
];

const headerSpring = { type: "spring" as const, duration: 0.35, bounce: 0.1 };
const hoverSpring = { type: "spring" as const, duration: 0.25, bounce: 0.1 };
const CARD_STAGGER_S = 0.07;

const Avatar = ({ seed, animated }: { seed: string; animated: boolean }) => (
  <AgentAvatar
    animated={animated}
    className="size-9 shrink-0 rounded-full"
    seed={seed}
    size={36}
  />
);

const PlainCard = ({ data }: { data: Testimonial }) => (
  <div className="flex h-full flex-col justify-between rounded-2xl border bg-primary/40 p-6">
    <p className="text-balance text-foreground/90 leading-relaxed">
      {data.quote}
    </p>
    <div className="mt-6 flex items-center gap-3">
      <Avatar animated={false} seed={data.handle} />
      <div className="leading-tight">
        <div className="font-medium text-foreground text-sm">{data.name}</div>
        <div className="text-muted-foreground text-xs">{data.handle}</div>
      </div>
    </div>
  </div>
);

const FeatureCard = ({
  data,
  variant,
}: {
  data: Testimonial;
  variant: "brand" | "dark";
}) => (
  <div
    className={cn(
      "relative flex h-full min-h-[300px] flex-col justify-end overflow-hidden rounded-2xl p-7",
      variant === "brand"
        ? "bg-gradient-to-br from-brand-secondary via-brand to-brand-light text-white"
        : "bg-smooth-1000 text-smooth-50"
    )}
  >
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute size-44 rounded-full blur-3xl",
        variant === "brand"
          ? "-top-12 -right-12 bg-brand-lighter/40"
          : "-right-12 -bottom-12 bg-brand/30"
      )}
    />
    {variant === "brand" && (
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
    )}
    <p className="relative text-balance font-medium text-xl leading-snug">
      {data.quote}
    </p>
    <div className="relative mt-6 flex items-center gap-3">
      <Avatar animated seed={data.handle} />
      <div className="leading-tight">
        <div className="font-medium text-sm">{data.name}</div>
        <div className="text-sm opacity-70">{data.handle}</div>
      </div>
    </div>
  </div>
);

export function WhatTheySay() {
  const [page, setPage] = useState(0);
  const [isHoverDevice, setIsHoverDevice] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsHoverDevice(mediaQuery.matches);
    const onChange = (event: MediaQueryListEvent) =>
      setIsHoverDevice(event.matches);
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  const pageCount = PAGES.length;
  const goTo = (delta: number) =>
    setPage((current) => (current + delta + pageCount) % pageCount);

  const active = PAGES[page];

  const cardMotion = (
    order: number,
    wrapperClass: string,
    node: React.ReactNode
  ) => (
    <motion.div
      animate={{ opacity: 1, transform: "translateY(0px)" }}
      className={wrapperClass}
      exit={
        shouldReduceMotion
          ? { opacity: 0 }
          : { opacity: 0, transform: "translateY(10px)" }
      }
      initial={
        shouldReduceMotion
          ? { opacity: 0 }
          : { opacity: 0, transform: "translateY(14px)" }
      }
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : {
              type: "spring",
              duration: 0.4,
              bounce: 0.1,
              delay: order * CARD_STAGGER_S,
            }
      }
      whileHover={
        isHoverDevice && !shouldReduceMotion
          ? {
              transform: "translateY(-3px)",
              transition: hoverSpring,
            }
          : undefined
      }
    >
      {node}
    </motion.div>
  );

  const arrowClass =
    "flex size-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-primary";

  return (
    <section className="relative w-full bg-background px-8 py-24">
      <Divider />
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <motion.h2
              className="text-balance font-semibold font-title text-3xl text-foreground"
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
              What they say about us
            </motion.h2>
            <motion.p
              className="mt-4 text-foreground/70 text-lg"
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
          <div className="flex shrink-0 items-center gap-2">
            <button
              aria-label="Previous testimonials"
              className={arrowClass}
              onClick={() => goTo(-1)}
              type="button"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              aria-label="Next testimonials"
              className={arrowClass}
              onClick={() => goTo(1)}
              type="button"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        <div className="relative">
          <AnimatePresence initial={false} mode="popLayout">
            {/* Staggered bento — medium · large · medium, with faint
                decoration tiles in the gaps (ElevenLabs layout). */}
            <motion.div
              animate={{ opacity: 1 }}
              className="relative flex flex-col gap-5 md:flex-row md:items-stretch md:justify-center md:gap-6"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              key={page}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.3, ease: [0.23, 1, 0.32, 1] }
              }
            >
              <div
                aria-hidden
                className="absolute top-2 right-[3%] hidden size-24 rounded-2xl bg-smooth-200/60 md:block"
              />
              <div
                aria-hidden
                className="absolute bottom-2 left-[3%] hidden size-20 rounded-2xl bg-smooth-200/60 md:block"
              />
              {cardMotion(
                1,
                "relative z-10 md:w-[27%] md:self-start",
                <PlainCard data={active.sides[0]} />
              )}
              {cardMotion(
                0,
                "relative z-10 md:min-h-[360px] md:w-[40%]",
                <FeatureCard data={active.feature} variant={active.variant} />
              )}
              {cardMotion(
                2,
                "relative z-10 md:w-[27%] md:self-end",
                <PlainCard data={active.sides[1]} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
