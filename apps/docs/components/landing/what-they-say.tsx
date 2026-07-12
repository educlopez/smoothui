"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import {
  IconChevronLeftFill24,
  IconChevronRightFill24,
} from "nucleo-core-fill-24";
import { useState } from "react";
import Divider from "./divider";

type Testimonial = {
  id: string;
  name: string;
  handle: string;
  quote: string;
  tweetUrl: string;
};

const username = (handle: string) => handle.replace(/^@/, "");
const avatarUrl = (handle: string) =>
  `https://unavatar.io/x/${username(handle)}`;

const Avatar = ({ data, size }: { data: Testimonial; size: number }) => (
  <Image
    alt={data.name}
    className="shrink-0 rounded-full object-cover"
    draggable={false}
    height={size}
    src={avatarUrl(data.handle)}
    width={size}
  />
);

// Center feature card per page (crossfades).
const CENTERS: { image: string; data: Testimonial }[] = [
  {
    image: "/scenes/testimonial-1.jpg",
    data: {
      id: "orcdev",
      name: "OrcDev",
      handle: "@orcdev",
      tweetUrl: "https://x.com/orcdev/status/2007091382784303330",
      quote:
        "Love your project Edu! Keep it up — can't wait to see what you cook next 🔥",
    },
  },
  {
    image: "/scenes/testimonial-2.jpg",
    data: {
      id: "jaykosai",
      name: "jeth.eth",
      handle: "@jaykosai",
      tweetUrl: "https://x.com/jaykosai/status/1919079453017231481",
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
      tweetUrl: "https://x.com/Lucas_Moveset/status/1990155654019887348",
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
      tweetUrl: "https://x.com/Potato___Dragon/status/1980544421121970512",
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
      tweetUrl: "https://x.com/openhunts/status/1980911462030950489",
      quote: "I love this UI component from @educalvolpz!",
    },
  },
  {
    activePage: 0,
    data: {
      id: "pete",
      name: "Peter Cruckshank",
      handle: "@PeteCapeCod",
      tweetUrl: "https://x.com/PeteCapeCod/status/1962707094395556337",
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
  <a
    className="flex h-full flex-col justify-between rounded-2xl border bg-primary/40 p-4 transition-colors hover:bg-primary"
    href={data.tweetUrl}
    rel="noopener noreferrer"
    target="_blank"
  >
    <p
      className={cn(
        "text-balance text-foreground/90 text-sm leading-relaxed",
        compact && "line-clamp-4"
      )}
    >
      {data.quote}
    </p>
    <div className="mt-3 flex items-center gap-2">
      <Avatar data={data} size={28} />
      <div className="leading-tight">
        <div className="font-medium text-foreground text-xs">{data.name}</div>
        <div className="text-[11px] text-muted-foreground">{data.handle}</div>
      </div>
    </div>
  </a>
);

const FeatureCard = ({ data, image }: { data: Testimonial; image: string }) => (
  <a
    className="relative flex h-full flex-col justify-end overflow-hidden rounded-2xl p-6 text-white transition-[filter] hover:brightness-105"
    href={data.tweetUrl}
    rel="noopener noreferrer"
    target="_blank"
  >
    <Image
      alt=""
      aria-hidden
      className="object-cover"
      draggable={false}
      fill
      sizes="(max-width: 768px) 100vw, 360px"
      src={image}
      unoptimized
    />
    {/* legibility scrim over the photo */}
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/5" />
    <p className="relative text-balance font-medium text-lg leading-snug drop-shadow-sm">
      {data.quote}
    </p>
    <div className="relative mt-5 flex items-center gap-2.5">
      <Avatar data={data} size={32} />
      <div className="leading-tight">
        <div className="font-medium text-sm">{data.name}</div>
        <div className="text-sm opacity-80">{data.handle}</div>
      </div>
    </div>
  </a>
);

const SideTile = ({
  slot,
  active,
  reduce,
  align,
}: {
  slot: { data: Testimonial };
  active: boolean;
  reduce: boolean | null;
  align: "start" | "end";
}) => (
  <motion.div
    className={cn(
      "relative min-h-0 overflow-hidden rounded-2xl",
      active
        ? "w-full flex-[1.7]"
        : cn(
            "aspect-square flex-1",
            align === "end" ? "self-end" : "self-start"
          )
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
          <FeatureCard data={center.data} image={center.image} />
        </motion.div>
      </AnimatePresence>
    </div>
  );

  return (
    <section className="relative w-full bg-background px-8 py-24">
      <Divider />
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col items-center gap-6 text-center">
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
              <IconChevronLeftFill24 className="size-4" />
            </button>
            <button
              aria-label="Next testimonials"
              className={arrowClass}
              onClick={() => goTo(1)}
              type="button"
            >
              <IconChevronRightFill24 className="size-4" />
            </button>
          </div>
        </div>

        {/* Desktop: morphing card / square columns around a crossfading center */}
        <div className="hidden items-stretch justify-center gap-3 md:flex">
          <div className="flex w-[210px] flex-col gap-3">
            <SideTile
              active={lt.activePage === page}
              align="end"
              reduce={shouldReduceMotion}
              slot={lt}
            />
            <SideTile
              active={lb.activePage === page}
              align="end"
              reduce={shouldReduceMotion}
              slot={lb}
            />
          </div>
          <div className="h-80 w-[360px] shrink-0">{renderCenter}</div>
          <div className="flex w-[210px] flex-col gap-3">
            <SideTile
              active={rt.activePage === page}
              align="start"
              reduce={shouldReduceMotion}
              slot={rt}
            />
            <SideTile
              active={rb.activePage === page}
              align="start"
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
                <FeatureCard data={center.data} image={center.image} />
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
