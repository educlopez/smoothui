"use client";

import { motion } from "motion/react";
import type { ElementType, ReactNode } from "react";

type AnimatedTextProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function AnimatedText({
  as: Tag = "span",
  children,
  className,
  delay = 0,
}: AnimatedTextProps) {
  return (
    <motion.div
      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      initial={{ opacity: 0, filter: "blur(12px)", y: 12 }}
      transition={{ type: "spring", bounce: 0.3, duration: 1.5, delay }}
    >
      <Tag className={className}>{children}</Tag>
    </motion.div>
  );
}

