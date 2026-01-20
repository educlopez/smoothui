import { motion, useInView, useReducedMotion } from "motion/react";
import React from "react";

export type RevealTextProps = {
  children: string;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  triggerOnView?: boolean;
  className?: string;
};

const REVEAL_ANIMATION_DURATION_S = 0.25;
const MILLISECONDS_TO_SECONDS = 1000;

const directionVariants = {
  up: { y: 24, opacity: 0 },
  down: { y: -24, opacity: 0 },
  left: { x: 24, opacity: 0 },
  right: { x: -24, opacity: 0 },
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
          : { x: 0, y: 0, opacity: 1 }
      }
      className={className}
      initial={shouldReduceMotion ? { opacity: 1 } : directionVariants[direction]}
      ref={ref}
      style={{ display: "inline-block" }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : {
              duration: REVEAL_ANIMATION_DURATION_S,
              delay: delay / MILLISECONDS_TO_SECONDS,
            }
      }
    >
      {children}
    </motion.span>
  );
};

export default RevealText;
