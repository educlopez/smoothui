"use client";

import type { GalleryComponentMeta } from "@docs/lib/gallery";
import { motion, useReducedMotion } from "motion/react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

export interface ComponentCardProps {
  component: GalleryComponentMeta;
  /** First screenful, so the browser fetches those posters immediately. */
  priority?: boolean;
  shot?: StaticImageData;
}

/** Horizontal and vertical stage padding (`p-6` on both axes). */
export const POSTER_STAGE_INSET = 48;

/** Label row (`h-11`) plus the stage padding above and below the poster. */
export const POSTER_CHROME = 44 + POSTER_STAGE_INSET;

/**
 * Posters are captured at 2x. Display CSS pixels are the file size divided by
 * this, so a button stays a button and only wider shots shrink to the card.
 */
export const POSTER_PIXEL_RATIO = 2;

/** Icon-sized shots scale up to this so they stay readable. Wider shots do not. */
export const POSTER_MIN_CSS = 168;

export const posterDisplaySize = (shot: { height: number; width: number }) => {
  const naturalWidth = shot.width / POSTER_PIXEL_RATIO;
  const naturalHeight = shot.height / POSTER_PIXEL_RATIO;
  const scale =
    naturalWidth < POSTER_MIN_CSS ? POSTER_MIN_CSS / naturalWidth : 1;

  return {
    height: naturalHeight * scale,
    width: naturalWidth * scale,
  };
};

/** Stand-in ratio when a poster has not been captured yet. */
export const POSTER_PLACEHOLDER = { height: 3, width: 4 } as const;

export const ComponentCard = ({
  component,
  priority = false,
  shot,
}: ComponentCardProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-muted"
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { bounce: 0.1, duration: 0.25, type: "spring" }
      }
    >
      <div className="flex flex-1 items-center justify-center p-6">
        {shot ? (
          <Image
            alt=""
            className="block h-auto max-w-full"
            priority={priority}
            quality={90}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            src={shot}
            style={{ width: posterDisplaySize(shot).width }}
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex w-full items-center justify-center text-center text-muted-foreground text-sm"
            style={{
              aspectRatio: `${POSTER_PLACEHOLDER.width} / ${POSTER_PLACEHOLDER.height}`,
            }}
          >
            {component.title}
          </div>
        )}
      </div>
      <p className="flex h-11 items-center px-6 font-medium text-foreground text-sm">
        <span className="truncate">{component.title}</span>
      </p>
      <Link
        aria-label={`View ${component.title} component`}
        className="absolute inset-0 z-10"
        href={component.href}
      />
    </motion.div>
  );
};
