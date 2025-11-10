"use client";

import { motion } from "motion/react";
import { useState } from "react";

import { BodyText } from "./body-text";

const HOVER_TRANSITION_DURATION = 0.2;
const CONTENT_TRANSITION_DURATION = 0.25;
const EASE_OUT_QUINT_X1 = 0.22;
const EASE_OUT_QUINT_Y1 = 1;
const EASE_OUT_QUINT_X2 = 0.36;
const EASE_OUT_QUINT_Y2 = 1;
const EASE_OUT_QUINT = [
  EASE_OUT_QUINT_X1,
  EASE_OUT_QUINT_Y1,
  EASE_OUT_QUINT_X2,
  EASE_OUT_QUINT_Y2,
] as const;
const HOVER_SCALE = 1.02;
const TITLE_OFFSET_Y = -20;
const DESCRIPTION_OFFSET_Y = 20;
const NO_BLUR = "blur(0px)";
const BLUR_AMOUNT = "blur(8px)";

type FeatureCardHoverProps = {
  title: string;
  description: string;
  gradient: string;
};

export function FeatureCardHover({
  title,
  description,
  gradient,
}: FeatureCardHoverProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`group r relative inset-ring-2 inset-ring-background h-32 cursor-default overflow-hidden rounded-lg border bg-gradient-to-br bg-primary ${gradient} p-4`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        willChange: "transform",
      }}
      transition={{ duration: HOVER_TRANSITION_DURATION, ease: EASE_OUT_QUINT }}
      whileHover={{ scale: HOVER_SCALE }}
    >
      <motion.div
        animate={{
          y: isHovered ? TITLE_OFFSET_Y : 0,
          opacity: isHovered ? 0 : 1,
        }}
        className="absolute inset-0 flex items-center justify-center"
        transition={{
          duration: CONTENT_TRANSITION_DURATION,
          ease: EASE_OUT_QUINT,
        }}
      >
        <p className="text-center font-semibold text-white">{title}</p>
      </motion.div>
      <motion.div
        animate={{
          y: isHovered ? 0 : DESCRIPTION_OFFSET_Y,
          opacity: isHovered ? 1 : 0,
          filter: isHovered ? NO_BLUR : BLUR_AMOUNT,
        }}
        className="absolute inset-0 flex items-center justify-center px-4"
        initial={{
          y: DESCRIPTION_OFFSET_Y,
          opacity: 0,
          filter: BLUR_AMOUNT,
        }}
        transition={{
          duration: CONTENT_TRANSITION_DURATION,
          ease: EASE_OUT_QUINT,
        }}
      >
        <BodyText className="text-center font-semibold text-sm text-white">
          {description}
        </BodyText>
      </motion.div>
    </motion.div>
  );
}
