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
              bounce: 0.3,
              delay,
              duration: 1.5,
              type: "spring" as const,
            }
      }
    >
      <Tag className={className}>{children}</Tag>
    </motion.div>
  );
}
