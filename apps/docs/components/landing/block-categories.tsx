"use client";

import {
  FaqBlockDrawing,
  FooterBlockDrawing,
  HeroBlockDrawing,
  LogosBlockDrawing,
  PricingBlockDrawing,
  StatsBlockDrawing,
  TeamBlockDrawing,
  TestimonialBlockDrawing,
} from "@docs/components/illustrations/block-drawings";
import Divider from "@docs/components/landing/divider";
import { SectionHeader } from "@docs/components/landing/section-header";
import { Button } from "@docs/components/smoothbutton";
import { MotionConfig, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import type { ComponentType } from "react";
import { useState } from "react";

const EASE_OUT_QUAD = [0.25, 0.46, 0.45, 0.94] as const;

const blockCategories: {
  blockCount: number;
  href: string;
  preview: ComponentType<{ active?: boolean }>;
  title: string;
}[] = [
  {
    blockCount: 4,
    href: "/docs/blocks/hero",
    preview: HeroBlockDrawing,
    title: "Hero",
  },
  {
    blockCount: 3,
    href: "/docs/blocks/pricing",
    preview: PricingBlockDrawing,
    title: "Pricing",
  },
  {
    blockCount: 3,
    href: "/docs/blocks/testimonial",
    preview: TestimonialBlockDrawing,
    title: "Testimonial",
  },
  {
    blockCount: 2,
    href: "/docs/blocks/faqs",
    preview: FaqBlockDrawing,
    title: "FAQs",
  },
  {
    blockCount: 2,
    href: "/docs/blocks/footer",
    preview: FooterBlockDrawing,
    title: "Footer",
  },
  {
    blockCount: 2,
    href: "/docs/blocks/logo-clouds",
    preview: LogosBlockDrawing,
    title: "Logo Clouds",
  },
  {
    blockCount: 2,
    href: "/docs/blocks/stats",
    preview: StatsBlockDrawing,
    title: "Stats",
  },
  {
    blockCount: 2,
    href: "/docs/blocks/team-sections",
    preview: TeamBlockDrawing,
    title: "Team Sections",
  },
];

function BlockPreview({
  category,
}: {
  category: (typeof blockCategories)[number];
}) {
  const [active, setActive] = useState(false);
  const Preview = category.preview;

  return (
    <motion.div
      className="relative"
      onHoverEnd={() => setActive(false)}
      onHoverStart={() => setActive(true)}
    >
      <div className="frame-box relative h-[220px] w-full overflow-hidden rounded-2xl p-2">
        <MotionConfig reducedMotion="user">
          <div
            aria-hidden="true"
            className="motion-reduce:[&_*]:!transform-none flex h-full items-center justify-center"
          >
            <Preview active={active} />
          </div>
        </MotionConfig>
      </div>
      <Link
        className="mt-3 flex min-h-11 items-center justify-center gap-2 rounded-lg focus-visible:outline-2 focus-visible:outline-ring"
        href={category.href}
        onBlur={() => setActive(false)}
        onFocus={() => setActive(true)}
      >
        <span className="font-medium text-foreground text-sm">
          {category.title}
        </span>
        <span className="text-muted-foreground text-xs">
          {category.blockCount} Blocks ↗
        </span>
      </Link>
    </motion.div>
  );
}

export function BlockCategories() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative bg-background px-8 py-24 transition">
      <Divider />
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          description={
            <>
              <span className="font-medium text-foreground">Customizable</span>{" "}
              blocks that seamlessly{" "}
              <span className="font-medium text-foreground">adapt</span> to your
              project needs
            </>
          }
          title="Elevate your design with premium blocks"
        />

        <div className="relative mt-8 md:mt-16">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
            {blockCategories.map((category, index) => (
              <motion.div
                animate={
                  shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }
                }
                initial={
                  shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }
                }
                key={category.title}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : {
                        delay: index * 0.05,
                        duration: 0.3,
                        ease: EASE_OUT_QUAD,
                      }
                }
              >
                <BlockPreview category={category} />
              </motion.div>
            ))}
          </div>

          <Button
            asChild
            className="mx-auto mt-8 flex w-fit"
            size="lg"
            variant="candy"
          >
            <Link href="/docs/blocks">
              <span className="flex items-center gap-1">
                <span>Browse All Blocks</span>
              </span>
              <svg
                aria-hidden="true"
                className="-mx-1.5 size-5 shrink-0 text-white/72"
                fill="none"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.333 13.333 11.667 10 8.333 6.667"
                  stroke="currentColor"
                  strokeLinecap="square"
                  strokeWidth="1.25"
                />
              </svg>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
