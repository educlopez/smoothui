"use client";

import type { BlockCategoryMeta } from "@docs/lib/blocks-gallery";
import { motion, useReducedMotion } from "motion/react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import ctaCover from "./covers/cta.webp";
import faqsCover from "./covers/faqs.webp";
import featuresCover from "./covers/features.webp";
import footerCover from "./covers/footer.webp";
import heroCover from "./covers/hero.webp";
import logoCloudsCover from "./covers/logo-clouds.webp";
import pricingCover from "./covers/pricing.webp";
import statsCover from "./covers/stats.webp";
import teamCover from "./covers/team-sections.webp";
import testimonialCover from "./covers/testimonial.webp";

export type BlockGalleryProps = {
  categories: BlockCategoryMeta[];
};

/**
 * Cover art, one per category.
 *
 * Stills rather than live demos: a block is a full-width page section, and
 * scaling one into a card column squashed it past the point of telling you
 * anything. A screenshot is cropped to what the block actually looks like, and
 * each keeps its own proportions — a logo cloud is a strip, a hero is most of a
 * page — which is what gives the masonry its rhythm.
 */
const COVERS: Record<string, StaticImageData> = {
  cta: ctaCover,
  faqs: faqsCover,
  features: featuresCover,
  footer: footerCover,
  hero: heroCover,
  "logo-clouds": logoCloudsCover,
  pricing: pricingCover,
  stats: statsCover,
  "team-sections": teamCover,
  testimonial: testimonialCover,
};

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const MAX_STAGGER = 0.24;
const STAGGER_STEP = 0.03;

/**
 * The blocks index: one card per category, led by a real block from it.
 *
 * CSS columns, not a layout library: the cards never reorder, so nothing has to
 * be measured in JavaScript.
 */
export const BlockGallery = ({ categories }: BlockGalleryProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="not-prose columns-1 gap-4 sm:columns-2 xl:columns-3">
      {categories.map((category, index) => {
        const cover = COVERS[category.slug];

        return (
          <motion.article
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-4 break-inside-avoid overflow-hidden rounded-xl border bg-card transition-colors hover:border-foreground/20"
            initial={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }
            }
            key={category.slug}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : {
                    delay: Math.min(index * STAGGER_STEP, MAX_STAGGER),
                    duration: 0.25,
                    ease: EASE_OUT,
                  }
            }
          >
            {cover ? (
              <Image
                alt=""
                className="w-full"
                placeholder="blur"
                sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                src={cover}
              />
            ) : null}
            {/* Spans, not a heading: the docs stylesheet sizes every `h2` on the
                page and would blow the card title up to article scale. The link
                already carries the full accessible name. */}
            {/* Title and count share one row: stacked, the footer cost two
                lines of height on every card for one short number. */}
            <footer className="flex items-baseline justify-between gap-3 border-t px-4 py-2.5">
              <span className="truncate font-medium text-foreground text-sm">
                {category.title}
              </span>
              <span className="shrink-0 text-muted-foreground text-xs tabular-nums">
                {category.count} {category.count === 1 ? "block" : "blocks"}
              </span>
            </footer>
            <Link
              aria-label={`${category.title}, ${category.count} blocks`}
              className="absolute inset-0 z-10"
              href={category.href}
            />
          </motion.article>
        );
      })}
    </div>
  );
};
