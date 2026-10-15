"use client";

import { ArtworkPattern } from "@docs/components/landing/artwork-pattern";
import { sceneSrc } from "@docs/examples/shared/demo-fixtures";
import { landscapes, sceneById } from "@smoothui/data/scenes";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useState } from "react";

const HOVER_TRANSITION_DURATION = 0.2;
const CONTENT_TRANSITION_DURATION = 0.25;
const EASE_OUT_QUINT = [0.22, 1, 0.36, 1] as const;
const HOVER_SCALE = 1.02;
const TITLE_OFFSET_Y = -20;
const DESCRIPTION_OFFSET_Y = 20;
const NO_BLUR = "blur(0px)";
const BLUR_AMOUNT = "blur(8px)";

/** Vivid stage fill — saturated, no dark-mode opacity wash. */
const STAGE_IMAGE_CLASS =
  "scale-110 object-cover blur-lg saturate-[2] motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.15]";

interface FeatureCardHoverProps {
  description: string;
  /** Catalog landscape id — same vivid stages as the landing. */
  scene: string;
  title: string;
}

function landscapeSrc(id: string) {
  const asset = sceneById(id);
  if (!(asset && landscapes.some((entry) => entry.id === id))) {
    throw new Error(`FeatureCardHover requires a catalog landscape: ${id}`);
  }
  return sceneSrc(asset.id, "w-800");
}

export function FeatureCardHover({
  title,
  description,
  scene,
}: FeatureCardHoverProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const src = landscapeSrc(scene);

  return (
    <motion.div
      className="not-prose group relative h-32 cursor-default overflow-hidden rounded-lg border border-white/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ willChange: "transform" }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { duration: HOVER_TRANSITION_DURATION, ease: EASE_OUT_QUINT }
      }
      whileHover={shouldReduceMotion ? undefined : { scale: HOVER_SCALE }}
    >
      <Image
        alt=""
        aria-hidden
        className={`absolute inset-0 size-full ${STAGE_IMAGE_CLASS}`}
        draggable={false}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        src={src}
        unoptimized
      />
      <ArtworkPattern variant="squares" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-black/20"
      />

      <motion.div
        animate={
          shouldReduceMotion
            ? { opacity: isHovered ? 0 : 1 }
            : {
                opacity: isHovered ? 0 : 1,
                y: isHovered ? TITLE_OFFSET_Y : 0,
              }
        }
        className="absolute inset-0 z-10 flex items-center justify-center p-4"
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : {
                duration: CONTENT_TRANSITION_DURATION,
                ease: EASE_OUT_QUINT,
              }
        }
      >
        <p
          className="text-center font-semibold"
          style={{
            color: "#fff",
            textShadow: "0 1px 2px rgb(0 0 0 / 0.55)",
          }}
        >
          {title}
        </p>
      </motion.div>
      <motion.div
        animate={
          shouldReduceMotion
            ? { opacity: isHovered ? 1 : 0 }
            : {
                filter: isHovered ? NO_BLUR : BLUR_AMOUNT,
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : DESCRIPTION_OFFSET_Y,
              }
        }
        className="absolute inset-0 z-10 flex items-center justify-center px-4"
        initial={
          shouldReduceMotion
            ? { opacity: 0 }
            : {
                filter: BLUR_AMOUNT,
                opacity: 0,
                y: DESCRIPTION_OFFSET_Y,
              }
        }
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : {
                duration: CONTENT_TRANSITION_DURATION,
                ease: EASE_OUT_QUINT,
              }
        }
      >
        <p
          className="text-center font-semibold text-sm leading-relaxed"
          style={{
            color: "#fff",
            textShadow: "0 1px 2px rgb(0 0 0 / 0.55)",
          }}
        >
          {description}
        </p>
      </motion.div>
    </motion.div>
  );
}
