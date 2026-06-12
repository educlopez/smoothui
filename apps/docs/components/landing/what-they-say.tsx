"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import AgentAvatar from "@repo/smoothui/components/agent-avatar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import Divider from "./divider";

type Testimonial = {
  id: string;
  name: string;
  handle: string;
  quote: string;
};

// Center feature card per page (crossfades).
const CENTERS: { variant: "brand" | "dark"; data: Testimonial }[] = [
  {
    variant: "brand",
    data: {
      id: "orcdev",
      name: "OrcDev",
      handle: "@orcdev",
      quote:
        "Love your project Edu! Keep it up — can't wait to see what you cook next 🔥",
    },
  },
  {
    variant: "dark",
    data: {
      id: "jaykosai",
      name: "jeth.eth",
      handle: "@jaykosai",
      quote:
        "All I can say is 🙌🔥 — planning to build something crazy with it.",
    },
  },
];

// Four side slots. Each holds one testimonial and is a card on its activePage,
// otherwise a small square. The two slots in a column swap card/square on page
// change — the ElevenLabs morph.
const SIDE_SLOTS: { activePage: number; data: Testimonial }[] = [
  // left column: top, bottom
  {
    activePage: 0,
    data: {
      id: "lucas",
      name: "Lucas",
      handle: "@Lucas_Moveset",
      quote:
        "Great resource! UI libraries like SmoothUI simplify your workflow and boost your design aesthetic.",
    },
  },
  {
    activePage: 1,
    data: {
      id: "potato",
      name: "Potato Dragon",
      handle: "@Potato___Dragon",
      quote:
        "I really liked the buttons on SmoothUI — that clickable kind of animation. Can you share it?",
    },
  },
  // right column: top, bottom
  {
    activePage: 1,
    data: {
      id: "openhunts",
      name: "openhunts",
      handle: "@openhunts",
      quote: "I love this UI component from @educalvolpz!",
    },
  },
  {
    activePage: 0,
    data: {
      id: "pete",
      name: "Peter Cruckshank",
      handle: "@PeteCapeCod",
      quote: "Checked out SmoothUI — some great stuff! 👏 Great job 👍",
    },
  },
];

const PAGE_COUNT = CENTERS.length;

const headerSpring = { type: "spring" as const, duration: 0.35, bounce: 0.1 };
const morphSpring = { type: "spring" as const, duration: 0.55, bounce: 0.14 };
const fadeTween = { duration: 0.25, ease: [0.23, 1, 0.32, 1] as const };

const PlainCard = ({
  data,
  compact,
}: {
  data: Testimonial;
  compact?: boolean;
}) => (
  <div className="flex h-full flex-col justify-between rounded-2xl border bg-primary/40 p-4">
    <p
      className={cn(
        "text-balance text-foreground/90 text-sm leading-relaxed",
        compact && "line-clamp-4"
      )}
    >
      {data.quote}
    </p>
    <div className="mt-3 flex items-center gap-2">
      <AgentAvatar
        className="size-7 shrink-0 rounded-full"
        seed={data.handle}
        size={28}
      />
      <div className="leading-tight">
        <div className="font-medium text-foreground text-xs">{data.name}</div>
        <div className="text-[11px] text-muted-foreground">{data.handle}</div>
      </div>
    </div>
  </div>
);

const FeatureCard = ({
  data,
  variant,
  animated,
}: {
  data: Testimonial;
  variant: "brand" | "dark";
  animated: boolean;
}) => (
  <div
    className={cn(
      "relative flex h-full flex-col justify-end overflow-hidden rounded-2xl p-6",
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
    <p className="relative text-balance font-medium text-lg leading-snug">
      {data.quote}
    </p>
    <div className="relative mt-5 flex items-center gap-2.5">
      <AgentAvatar
        animated={animated}
        className="size-8 shrink-0 rounded-full"
        seed={data.handle}
        size={32}
      />
      <div className="leading-tight">
        <div className="font-medium text-sm">{data.name}</div>
        <div className="text-sm opacity-70">{data.handle}</div>
      </div>
    </div>
  </div>
);

const SideTile = ({
  slot,
  active,
  reduce,
}: {
  slot: { data: Testimonial };
  active: boolean;
  reduce: boolean | null;
}) => (
  <motion.div
    className={cn(
      "relative overflow-hidden rounded-2xl",
      active ? "h-44 w-full" : "size-20 self-center"
    )}
    layout
    transition={reduce ? { duration: 0 } : morphSpring}
  >
    <AnimatePresence initial={false}>
      {active ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="absolute inset-0"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          key="card"
          transition={reduce ? { duration: 0 } : fadeTween}
        >
          <PlainCard compact data={slot.data} />
        </motion.div>
      ) : (
        <motion.div
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-2xl bg-smooth-200/60"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          key="square"
          transition={reduce ? { duration: 0 } : fadeTween}
        />
      )}
    </AnimatePresence>
  </motion.div>
);

export function WhatTheySay() {
  const [page, setPage] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const goTo = (delta: number) =>
    setPage((current) => (current + delta + PAGE_COUNT) % PAGE_COUNT);

  const center = CENTERS[page];
  const [lt, lb, rt, rb] = SIDE_SLOTS;
  const mobileSlots = SIDE_SLOTS.filter((s) => s.activePage === page);

  const arrowClass =
    "flex size-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-primary";

  const renderCenter = (
    <div className="relative size-full">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          animate={{ opacity: 1 }}
          className="absolute inset-0"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          key={page}
          transition={shouldReduceMotion ? { duration: 0 } : fadeTween}
        >
          <FeatureCard
            animated={!shouldReduceMotion}
            data={center.data}
            variant={center.variant}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );

  return (
    <section className="relative w-full bg-background px-8 py-24">
      <Divider />
      <div className="mx-auto max-w-6xl">
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

        {/* Desktop: morphing card / square columns around a crossfading center */}
        <div className="hidden items-center justify-center gap-5 md:flex">
          <div className="flex h-72 w-[210px] flex-col gap-5">
            <SideTile
              active={lt.activePage === page}
              reduce={shouldReduceMotion}
              slot={lt}
            />
            <SideTile
              active={lb.activePage === page}
              reduce={shouldReduceMotion}
              slot={lb}
            />
          </div>
          <div className="h-80 w-[360px] shrink-0">{renderCenter}</div>
          <div className="flex h-72 w-[210px] flex-col gap-5">
            <SideTile
              active={rt.activePage === page}
              reduce={shouldReduceMotion}
              slot={rt}
            />
            <SideTile
              active={rb.activePage === page}
              reduce={shouldReduceMotion}
              slot={rb}
            />
          </div>
        </div>

        {/* Mobile: simple stacked fade of the active page's three cards */}
        <div className="md:hidden">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              animate={{ opacity: 1 }}
              className="flex flex-col gap-4"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              key={page}
              transition={shouldReduceMotion ? { duration: 0 } : fadeTween}
            >
              <div className="h-72">
                <FeatureCard
                  animated={!shouldReduceMotion}
                  data={center.data}
                  variant={center.variant}
                />
              </div>
              {mobileSlots.map((slot) => (
                <PlainCard data={slot.data} key={slot.data.id} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
