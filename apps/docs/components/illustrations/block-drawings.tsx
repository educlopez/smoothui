"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { CANDY, GHOST, INK } from "./ink";

type ActiveProps = { active?: boolean };

const spring = (reduced: boolean | null) =>
  reduced
    ? { duration: 0 }
    : { bounce: 0.1, duration: 0.22, type: "spring" as const };

/** Hero block sketch. */
export const HeroBlockDrawing = ({ active = false }: ActiveProps) => {
  const reduced = useReducedMotion();
  return (
    <div className="flex w-full max-w-xs items-center gap-3">
      <div className="flex flex-1 flex-col gap-1.5">
        <div className={cn("h-3 w-8 rounded-full", INK)} />
        <div className={cn("h-2.5 w-24 rounded-full", INK)} />
        <div className={cn("h-1.5 w-20 rounded-full", GHOST)} />
        <div className="mt-1 flex gap-1.5">
          <div className={cn("h-5 w-12 rounded-md", CANDY)} />
          <div
            className={cn("h-5 w-10 rounded-md border border-border", GHOST)}
          />
        </div>
      </div>
      <motion.div
        animate={{
          rotate: active && !reduced ? 6 : 0,
          scale: active && !reduced ? 1.08 : 1,
        }}
        className={cn("size-16 shrink-0 rounded-2xl", INK)}
        transition={spring(reduced)}
      />
    </div>
  );
};

/** Pricing sketch. */
export const PricingBlockDrawing = ({ active = false }: ActiveProps) => {
  const reduced = useReducedMotion();
  return (
    <div className="w-full max-w-[14rem] space-y-1.5 rounded-xl border border-border bg-background p-2 shadow-sm">
      {[false, true].map((popular, index) => (
        <motion.div
          animate={{ y: active && popular && !reduced ? -2 : 0 }}
          className={cn(
            "flex items-center gap-2 rounded-lg p-2",
            popular ? "border border-border bg-muted/40" : ""
          )}
          key={index}
          transition={spring(reduced)}
        >
          <div
            className={cn(
              "flex size-3.5 items-center justify-center rounded-full border",
              popular ? "border-brand" : "border-border"
            )}
          >
            {popular ? (
              <div className={cn("size-1.5 rounded-full", CANDY)} />
            ) : null}
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <div className={cn("h-1.5 w-10 rounded-full", INK)} />
            <div className={cn("h-1 w-14 rounded-full", GHOST)} />
          </div>
          <div className={cn("h-3 w-6 rounded-full", popular ? INK : GHOST)} />
        </motion.div>
      ))}
    </div>
  );
};

/** Testimonial sketch. */
export const TestimonialBlockDrawing = ({ active = false }: ActiveProps) => {
  const reduced = useReducedMotion();
  return (
    <motion.div
      animate={{ y: active && !reduced ? -3 : 0 }}
      className="flex w-full max-w-[12rem] flex-col gap-2 rounded-xl border border-border bg-background p-3 shadow-sm"
      transition={spring(reduced)}
    >
      <div className={cn("size-7 rounded-full", INK)} />
      <div className="flex gap-0.5">
        {[0, 1, 2, 3, 4].map((star) => (
          <div className={cn("size-2 rounded-sm", CANDY)} key={star} />
        ))}
      </div>
      <div className="space-y-1">
        <div className={cn("h-1.5 w-full rounded-full", GHOST)} />
        <div className={cn("h-1.5 w-4/5 rounded-full", GHOST)} />
      </div>
      <div className={cn("h-1 w-12 rounded-full", GHOST)} />
    </motion.div>
  );
};

/** FAQ sketch. */
export const FaqBlockDrawing = ({ active = false }: ActiveProps) => {
  const reduced = useReducedMotion();
  return (
    <div className="flex w-full max-w-[14rem] flex-col gap-1.5">
      <motion.div
        animate={{ opacity: active && !reduced ? 1 : 1 }}
        className="overflow-hidden rounded-lg border border-border bg-background p-2 shadow-sm"
      >
        <div className="flex items-center justify-between gap-2">
          <div className={cn("h-1.5 w-20 rounded-full", INK)} />
          <motion.div
            animate={{ rotate: active && !reduced ? 180 : 0 }}
            className={cn("size-2.5 rounded-sm", GHOST)}
            transition={spring(reduced)}
          />
        </div>
        <motion.div
          animate={{
            height: active && !reduced ? 16 : 0,
            opacity: active && !reduced ? 1 : 0,
          }}
          className="overflow-hidden"
          transition={spring(reduced)}
        >
          <div className={cn("mt-1.5 h-1.5 w-full rounded-full", GHOST)} />
        </motion.div>
      </motion.div>
      {[0, 1].map((row) => (
        <div
          className="flex items-center justify-between rounded-lg border border-border bg-background p-2"
          key={row}
        >
          <div className={cn("h-1.5 w-16 rounded-full", GHOST)} />
          <div className={cn("size-2.5 rounded-sm", GHOST)} />
        </div>
      ))}
    </div>
  );
};

/** Footer sketch. */
export const FooterBlockDrawing = ({ active = false }: ActiveProps) => {
  const reduced = useReducedMotion();
  return (
    <motion.div
      animate={{ scale: active && !reduced ? 1.03 : 1 }}
      className="flex w-full max-w-xs flex-col gap-2 rounded-lg border border-border bg-background p-3"
      transition={spring(reduced)}
    >
      <div className="flex items-center gap-2">
        <div className={cn("size-3.5 rounded", CANDY)} />
        <div className="flex gap-3">
          {[10, 12, 14].map((width) => (
            <div
              className={cn("h-1.5 rounded-full", GHOST)}
              key={width}
              style={{ width }}
            />
          ))}
        </div>
        <div className="ml-auto flex gap-1">
          <div className={cn("size-3 rounded", GHOST)} />
          <div className={cn("size-3 rounded", GHOST)} />
        </div>
      </div>
      <div className={cn("h-px w-full", GHOST)} />
      <div className={cn("h-1 w-24 rounded-full", GHOST)} />
    </motion.div>
  );
};

/** Logo cloud sketch. */
export const LogosBlockDrawing = ({ active = false }: ActiveProps) => {
  const reduced = useReducedMotion();
  return (
    <div className="flex w-full max-w-xs items-center justify-center gap-4">
      {[0, 1, 2, 3].map((index) => (
        <motion.div
          animate={{
            opacity: active && !reduced ? 1 : 0.7,
            y: active && !reduced ? (index % 2 === 0 ? -3 : 3) : 0,
          }}
          className={cn("h-3 rounded-full", index % 2 ? INK : GHOST)}
          key={index}
          style={{ width: `${2.5 + (index % 3) * 0.75}rem` }}
          transition={spring(reduced)}
        />
      ))}
    </div>
  );
};

/** Stats sketch. */
export const StatsBlockDrawing = ({ active = false }: ActiveProps) => {
  const reduced = useReducedMotion();
  return (
    <div className="flex w-full max-w-xs justify-center gap-4">
      {[0, 1, 2].map((index) => (
        <motion.div
          animate={{ y: active && !reduced ? -2 : 0 }}
          className="flex flex-col items-center gap-1"
          key={index}
          transition={{
            ...spring(reduced),
            delay: reduced ? 0 : index * 0.03,
          }}
        >
          <div className="flex items-center gap-0.5">
            <div className={cn("size-1.5 rounded-sm", CANDY)} />
            <div className={cn("h-4 w-8 rounded-md", INK)} />
          </div>
          <div className={cn("h-1 w-10 rounded-full", GHOST)} />
        </motion.div>
      ))}
    </div>
  );
};

/** Team sketch. */
export const TeamBlockDrawing = ({ active = false }: ActiveProps) => {
  const reduced = useReducedMotion();
  return (
    <motion.div
      animate={{
        scale: active && !reduced ? 1.04 : 1,
        y: active && !reduced ? -3 : 0,
      }}
      className="flex items-center justify-center gap-2"
      transition={spring(reduced)}
    >
      {[0, 1, 2].map((index) => (
        <div
          className="flex flex-col items-center gap-1 rounded-lg border border-border bg-background p-2"
          key={index}
        >
          <div
            className={cn("size-8 rounded-full", index === 1 ? INK : GHOST)}
          />
          <div className={cn("h-1.5 w-10 rounded-full", INK)} />
          <div className={cn("h-1 w-8 rounded-full", GHOST)} />
        </div>
      ))}
    </motion.div>
  );
};
