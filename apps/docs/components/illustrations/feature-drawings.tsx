"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { IconCheckFill24 } from "nucleo-core-fill-24";
import { CANDY, GHOST, INK } from "./ink";

type ActiveProps = { active?: boolean };

/** Motion: fan of chips — no outer tray; chips sit on the vivid stage. */
export const MotionDrawing = ({ active = false }: ActiveProps) => {
  const shouldReduceMotion = useReducedMotion();
  const chips = [
    { label: "Siri Orb", lift: 10, rotate: -6 },
    { label: "Island", lift: -2, rotate: -2 },
    { label: "Number", lift: 4, rotate: 2 },
    { label: "Wave", lift: 12, rotate: 6 },
  ];

  return (
    <div className="flex items-center justify-center [&>*:not(:first-child)]:-ml-6">
      {chips.map((chip, index) => {
        const spread = active && !shouldReduceMotion ? 1.35 : 1;
        return (
          <motion.div
            animate={{
              rotate: chip.rotate * spread,
              y: chip.lift * spread,
            }}
            className="flex h-36 w-24 shrink-0 flex-col gap-1.5 overflow-hidden rounded-xl border border-border bg-background p-2 shadow-sm"
            key={chip.label}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : {
                    bounce: 0.1,
                    delay: index * 0.02,
                    duration: 0.25,
                    type: "spring",
                  }
            }
          >
            <div
              className={cn(
                "flex h-5 shrink-0 items-center rounded-full px-2 font-mono text-[9px] text-muted-foreground",
                GHOST
              )}
            >
              {chip.label}
            </div>
            <div className={cn("min-h-0 flex-1 rounded-lg", GHOST)} />
            <div className={cn("h-2 w-10 shrink-0 rounded-full", CANDY)} />
            <div className={cn("h-1.5 w-full shrink-0 rounded-full", GHOST)} />
            <div className={cn("h-1.5 w-2/3 shrink-0 rounded-full", GHOST)} />
          </motion.div>
        );
      })}
    </div>
  );
};

/** React: tray of controls — candy accents on primary chrome. */
export const ReactDrawing = ({ active = false }: ActiveProps) => {
  const shouldReduceMotion = useReducedMotion();
  const tiles = [
    <div className={cn("h-5 w-12 rounded-full", CANDY)} key="btn" />,
    <div
      className={cn("flex h-4 w-8 items-center rounded-full p-0.5", CANDY)}
      key="toggle"
    >
      <div className="size-3 translate-x-3.5 rounded-full bg-white shadow-sm" />
    </div>,
    <div
      className={cn(
        "flex size-4 items-center justify-center rounded-[5px]",
        CANDY
      )}
      key="check"
    >
      <IconCheckFill24 className="text-white" size={11} />
    </div>,
    <div className="flex -space-x-1.5" key="avatars">
      <div
        className={cn("size-5 rounded-full border-2 border-background", INK)}
      />
      <div
        className={cn("size-5 rounded-full border-2 border-background", GHOST)}
      />
    </div>,
    <div
      className="flex h-5 w-14 items-center rounded-md border border-border px-1.5"
      key="input"
    >
      <div className="h-2.5 w-px bg-brand" />
    </div>,
    <div className={cn("h-4 w-10 rounded-full", INK)} key="ghost" />,
  ];

  return (
    <div className="grid w-full max-w-xs grid-cols-3 gap-2.5">
      {tiles.map((child, index) => (
        <motion.div
          animate={{
            scale: active && !shouldReduceMotion && index === 1 ? 1.06 : 1,
            y: active && !shouldReduceMotion && index === 1 ? -2 : 0,
          }}
          className="flex h-14 items-center justify-center rounded-xl border border-border bg-background"
          key={index}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { bounce: 0.1, duration: 0.22, type: "spring" }
          }
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
};

/** Tokens: open control sketch — no enclosing panel. */
export const TokensDrawing = ({ active = false }: ActiveProps) => {
  const shouldReduceMotion = useReducedMotion();
  const selected = active ? 2 : 1;

  return (
    <div className="flex w-full max-w-[15rem] flex-col gap-3">
      <div className="flex items-center justify-between px-0.5">
        <div className={cn("h-2 w-8 rounded-full", GHOST)} />
        <div className={cn("h-2 w-12 rounded-full", INK)} />
      </div>
      <motion.div
        animate={{ scale: active && !shouldReduceMotion ? 1.02 : 1 }}
        className="flex items-center gap-2 rounded-xl border border-border bg-background p-2.5 shadow-sm"
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { bounce: 0.1, duration: 0.22, type: "spring" }
        }
      >
        <div
          className={cn(
            "size-8",
            selected === 1 ? "rounded-lg" : "rounded-2xl",
            INK
          )}
        />
        <div className="flex flex-1 flex-col gap-1">
          <div className={cn("h-2 w-14 rounded-full", INK)} />
          <div className={cn("h-1.5 w-20 rounded-full", GHOST)} />
        </div>
        <div
          className={cn(
            "flex size-3.5 items-center justify-center rounded-full",
            CANDY
          )}
        >
          <IconCheckFill24 className="text-white" size={9} />
        </div>
      </motion.div>
      <div className="flex gap-1.5">
        {["crisp", "soft", "round"].map((label, index) => (
          <div
            className={cn(
              "flex h-7 flex-1 items-center justify-center rounded-md border text-[9px] capitalize",
              index === selected
                ? cn(CANDY, "border-transparent")
                : "border-border bg-background text-muted-foreground shadow-sm"
            )}
            key={label}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

/** Install: open registry sketch — no enclosing panel. */
export const InstallDrawing = ({ active = false }: ActiveProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={{ y: active && !shouldReduceMotion ? -3 : 0 }}
      className="flex w-full max-w-[15rem] flex-col gap-2.5"
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { bounce: 0.1, duration: 0.22, type: "spring" }
      }
    >
      <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 shadow-sm">
        <div className={cn("size-7 rounded-lg", CANDY)} />
        <div className="flex flex-1 flex-col gap-1">
          <div className={cn("h-2 w-14 rounded-full", INK)} />
          <div className={cn("h-1.5 w-20 rounded-full", GHOST)} />
        </div>
        <div className={cn("size-4 rounded", GHOST)} />
      </div>
      <div className="rounded-xl border border-border bg-background p-3 shadow-sm">
        <div className="space-y-1.5">
          <div className={cn("h-2 w-24 rounded-full", GHOST)} />
          <div className={cn("h-2 w-32 rounded-full", INK)} />
          <div className={cn("mt-2 h-8 w-full rounded-lg", GHOST)} />
        </div>
      </div>
    </motion.div>
  );
};
