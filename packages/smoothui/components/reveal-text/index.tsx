import { motion, useInView, useReducedMotion } from "motion/react";
import React from "react";

export interface RevealTextProps {
  children: string;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  triggerOnView?: boolean;
}

const REVEAL_ANIMATION_DURATION_S = 0.25;
const MILLISECONDS_TO_SECONDS = 1000;

const directionVariants = {
  down: { opacity: 0, y: -24 },
  left: { opacity: 0, x: 24 },
  right: { opacity: 0, x: -24 },
  up: { opacity: 0, y: 24 },
};

const RevealText: React.FC<RevealTextProps> = ({
  children,
  direction = "up",
  delay = 0,
  triggerOnView = false,
  className = "",
}) => {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const shouldReduceMotion = useReducedMotion();
  const animate = (!triggerOnView || inView) && !shouldReduceMotion;

  return (
    <motion.span
      animate={
        shouldReduceMotion || !animate
          ? { opacity: 1 }
          : { opacity: 1, x: 0, y: 0 }
      }
      className={className}
      initial={
        shouldReduceMotion ? { opacity: 1 } : directionVariants[direction]
      }
      ref={ref}
      style={{ display: "inline-block" }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : {
              delay: delay / MILLISECONDS_TO_SECONDS,
              duration: REVEAL_ANIMATION_DURATION_S,
            }
      }
    >
      {children}
    </motion.span>
  );
};

export default RevealText;
