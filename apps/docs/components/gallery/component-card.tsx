"use client";

import { AddToKitButton } from "@docs/components/add-to-kit-button";
import { InstallCopyButton } from "@docs/components/landing/install-copy-button";
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

/**
 * Footer is `h-12` (48px) and the card border adds 2px. The masonry span
 * uses this instead of measuring the card.
 */
export const POSTER_CHROME = 50;

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
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card"
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { bounce: 0.1, duration: 0.25, type: "spring" }
      }
    >
      {/* The overlay covers the poster only. Footer actions stay clickable,
          and the poster is not wrapped in the link. */}
      <div className="relative bg-muted">
        {shot ? (
          <Image
            alt=""
            className="block h-auto w-full"
            priority={priority}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            src={shot}
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex items-center justify-center px-6 text-center text-muted-foreground text-sm"
            style={{
              aspectRatio: `${POSTER_PLACEHOLDER.width} / ${POSTER_PLACEHOLDER.height}`,
            }}
          >
            {component.title}
          </div>
        )}
        <Link
          aria-label={`View ${component.title} component`}
          className="absolute inset-0 z-10"
          href={component.href}
        />
      </div>
      <footer className="flex h-12 items-center justify-between gap-2 border-border/60 border-t px-4">
        <Link
          className="truncate font-medium text-foreground text-sm transition-colors hover:text-brand"
          href={component.href}
        >
          {component.title}
        </Link>
        {component.installer ? (
          <div className="flex shrink-0 items-center gap-1.5">
            <AddToKitButton
              size="xs"
              slug={component.installer}
              title={component.title}
            />
            <InstallCopyButton slug={component.installer} />
          </div>
        ) : null}
      </footer>
    </motion.div>
  );
};
