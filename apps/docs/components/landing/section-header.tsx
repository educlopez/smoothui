"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export interface SectionHeaderProps {
  align?: "center" | "left";
  className?: string;
  description?: ReactNode;
  eyebrow?: ReactNode;
  title: ReactNode;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
  align = "center",
}: SectionHeaderProps) {
  const shouldReduceMotion = useReducedMotion();

  const transition = (delay: number) =>
    shouldReduceMotion
      ? { duration: 0 }
      : { type: "spring" as const, duration: 0.3, bounce: 0.1, delay };

  const fadeUp = (delay: number) => ({
    initial: shouldReduceMotion
      ? { opacity: 1 }
      : { opacity: 0, transform: "translateY(10px)" },
    whileInView: shouldReduceMotion
      ? { opacity: 1 }
      : { opacity: 1, transform: "translateY(0px)" },
    transition: transition(delay),
    viewport: { once: true, amount: 0.5 } as const,
  });

  const isCenter = align === "center";

  return (
    <div
      className={cn("max-w-2xl", isCenter && "mx-auto text-center", className)}
    >
      {eyebrow && (
        <motion.p
          className={cn(
            "mb-2 font-medium text-brand text-sm uppercase tracking-wider",
            isCenter && "text-center"
          )}
          {...fadeUp(0)}
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h2
        className={cn(
          "text-balance font-semibold font-title text-3xl text-foreground transition md:text-4xl",
          isCenter && "text-center"
        )}
        {...fadeUp(0.05)}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          className={cn(
            "mt-4 text-balance text-primary-foreground transition",
            isCenter && "text-center"
          )}
          {...fadeUp(0.1)}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
