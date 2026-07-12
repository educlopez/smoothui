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
          : { opacity: 1, filter: "blur(0px)", y: 0 }
      }
      initial={
        shouldReduceMotion
          ? { opacity: 1 }
          : { opacity: 0, filter: "blur(12px)", y: 12 }
      }
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : {
              type: "spring" as const,
              bounce: 0.3,
              duration: 1.5,
              delay,
            }
      }
    >
      <Tag className={className}>{children}</Tag>
    </motion.div>
  );
}
