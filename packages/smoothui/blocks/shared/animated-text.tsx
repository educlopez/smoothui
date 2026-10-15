"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ElementType, ReactNode } from "react";

interface AnimatedTextProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedText({
  as: Tag = "span",
  children,
  className,
  delay = 0,
}: AnimatedTextProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={
        shouldReduceMotion
          ? { opacity: 1 }
          : { filter: "blur(0px)", opacity: 1, y: 0 }
      }
      initial={
        shouldReduceMotion
          ? { opacity: 1 }
          : { filter: "blur(12px)", opacity: 0, y: 12 }
      }
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : {
              delay,
              duration: 0.35,
              ease: [0.23, 1, 0.32, 1],
              filter: { duration: 0.3, ease: [0.23, 1, 0.32, 1] },
              opacity: { delay, duration: 0.3, ease: [0.23, 1, 0.32, 1] },
              y: { delay, duration: 0.35, ease: [0.23, 1, 0.32, 1] },
            }
      }
    >
      <Tag className={className}>{children}</Tag>
    </motion.div>
  );
}
