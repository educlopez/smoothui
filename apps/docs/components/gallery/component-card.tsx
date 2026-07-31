"use client";

import { AddToKitButton } from "@docs/components/add-to-kit-button";
import { InstallCopyButton } from "@docs/components/landing/install-copy-button";
import type { GalleryComponentMeta } from "@docs/lib/gallery";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";

import { GalleryPreview } from "./gallery-preview";

export interface ComponentCardProps {
  component: GalleryComponentMeta;
}

export const ComponentCard = ({ component }: ComponentCardProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card"
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { bounce: 0.1, duration: 0.25, type: "spring" }
      }
    >
      {/* Not a wrapper around the preview: demos contain their own links, and
          an anchor inside an anchor is invalid HTML that React refuses to
          hydrate. The overlay sits above the preview and below the footer. */}
      <div className="relative">
        <GalleryPreview slug={component.slug} title={component.title} />
        <Link
          aria-label={`View ${component.title} component`}
          className="absolute inset-0 z-10"
          href={component.href}
        />
      </div>
      <footer className="flex items-center justify-between gap-2 border-border/60 border-t px-4 py-2.5">
        <Link
          className="truncate font-medium text-foreground text-sm transition-colors hover:text-brand"
          href={component.href}
        >
          {component.title}
        </Link>
        {component.installer && (
          <div className="flex shrink-0 items-center gap-1.5">
            <AddToKitButton
              size="xs"
              slug={component.installer}
              title={component.title}
            />
            <InstallCopyButton slug={component.installer} />
          </div>
        )}
      </footer>
    </motion.div>
  );
};
