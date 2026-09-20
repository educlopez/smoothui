"use client";

import type { TemplateMeta } from "@docs/lib/templates-gallery";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

import { MasonryGrid } from "./masonry-grid";
import { TEMPLATE_SHOTS } from "./template-shots";

export interface TemplateGalleryProps {
  templates: TemplateMeta[];
}

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const STAGGER_STEP = 0.04;

/**
 * The templates index.
 *
 * Same masonry as blocks and components, so the three catalogues read as one
 * site. With a single template it is a single card — the layout is right for
 * whatever lands next rather than something to rewrite then.
 */
export const TemplateGallery = ({ templates }: TemplateGalleryProps) => {
  const shouldReduceMotion = useReducedMotion();

  const tiles = templates.map((template, index) => {
    const cover = TEMPLATE_SHOTS[template.installer]?.find(
      (shot) => !shot.narrow
    );

    return {
      key: template.slug,
      node: (
        <motion.article
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-xl border bg-card transition-colors hover:border-foreground/20"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  delay: index * STAGGER_STEP,
                  duration: 0.25,
                  ease: EASE_OUT,
                }
          }
        >
          {cover && (
            <Image
              alt=""
              className="w-full"
              placeholder="blur"
              sizes="(min-width: 1024px) 50vw, 100vw"
              src={cover.image}
            />
          )}
          <footer className="border-t px-4 py-3">
            <span className="block font-medium text-foreground text-sm">
              {template.title}
            </span>
            <span className="mt-0.5 block text-muted-foreground text-xs leading-relaxed">
              {template.description}
            </span>
          </footer>
          <Link
            aria-label={template.title}
            className="absolute inset-0 z-10"
            href={template.href}
          />
        </motion.article>
      ),
    };
  });

  return <MasonryGrid className="not-prose" maxColumns={2} tiles={tiles} />;
};
