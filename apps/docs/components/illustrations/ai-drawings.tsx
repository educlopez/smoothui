"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { CANDY, GHOST, INK } from "./ink";

type ActiveProps = { active?: boolean };

/** MCP: numbered workflow floating on the vivid stage. */
export const McpDrawing = ({ active = false }: ActiveProps) => {
  const shouldReduceMotion = useReducedMotion();
  const steps = ["Search", "Resolve", "Install"];
  const current = active ? 1 : 0;

  return (
    <div className="flex w-full max-w-[17rem] flex-col gap-2">
      {steps.map((label, index) => {
        const selected = index === current;
        return (
          <motion.div
            animate={{
              scale: selected && !shouldReduceMotion ? 1.02 : 1,
              x: selected && !shouldReduceMotion ? 6 : 0,
            }}
            className={cn(
              "flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-3 shadow-sm",
              selected && "shadow-md"
            )}
            key={label}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { bounce: 0.1, duration: 0.22, type: "spring" }
            }
          >
            <div
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-lg font-mono text-[11px]",
                selected
                  ? CANDY
                  : "border border-border bg-muted font-medium text-muted-foreground"
              )}
            >
              {index + 1}
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <div
                className={cn("h-2 rounded-full", selected ? INK : GHOST)}
                style={{ width: selected ? "70%" : "55%" }}
              />
              {selected ? null : (
                <div className={cn("h-1.5 w-2/5 rounded-full", GHOST)} />
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

/** API: open sketch — search + segments + rows, no enclosing panel. */
export const ApiDrawing = ({ active = false }: ActiveProps) => {
  const shouldReduceMotion = useReducedMotion();
  const selected = active ? 1 : 0;

  return (
    <div className="flex w-full max-w-[16rem] flex-col gap-3">
      <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 shadow-sm">
        <div className={cn("size-3 rounded-full", GHOST)} />
        <div className={cn("h-2 flex-1 rounded-full", GHOST)} />
        <div className={cn("h-4 w-8 rounded-md border border-border", GHOST)} />
      </div>

      <div className="flex gap-1.5">
        {[0, 1].map((index) => (
          <motion.div
            animate={{
              scale: selected === index && !shouldReduceMotion ? 1.03 : 1,
            }}
            className={cn(
              "h-7 flex-1 rounded-lg",
              index === selected
                ? CANDY
                : "border border-border bg-background shadow-sm"
            )}
            key={index}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { bounce: 0.1, duration: 0.2, type: "spring" }
            }
          />
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        {[0, 1].map((index) => (
          <motion.div
            animate={{
              x: active && !shouldReduceMotion && index === 0 ? 2 : 0,
            }}
            className="flex items-center gap-2.5 rounded-xl border border-border bg-background px-2.5 py-2.5 shadow-sm"
            key={`${selected}-${index}`}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { delay: index * 0.04, duration: 0.18 }
            }
          >
            <div
              className={cn(
                "size-7 shrink-0 rounded-lg",
                index === 0 ? CANDY : INK
              )}
            />
            <div className="flex flex-1 flex-col gap-1">
              <div
                className={cn("h-2 rounded-full", INK)}
                style={{ width: selected === 0 ? "6rem" : "5rem" }}
              />
              <div className={cn("h-1.5 w-14 rounded-full", GHOST)} />
            </div>
            {index === 0 ? (
              <div className={cn("size-1.5 shrink-0 rounded-full", CANDY)} />
            ) : null}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/** llms.txt: open catalog sketch — tabs + tree, no enclosing panel. */
export const LlmsDrawing = ({ active = false }: ActiveProps) => {
  const shouldReduceMotion = useReducedMotion();
  const rows = active
    ? [
        { name: "hero", width: "4rem" },
        { name: "pricing", width: "5rem" },
        { name: "faqs", width: "3.5rem" },
      ]
    : [
        { name: "animated-tabs", width: "6rem" },
        { name: "phototab", width: "5rem" },
        { name: "siri-orb", width: "4.5rem" },
      ];

  return (
    <div className="flex w-full max-w-[16rem] flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className={cn("size-4 rounded-md", CANDY)} />
        <div className={cn("h-2 flex-1 rounded-full", INK)} />
        <div className={cn("size-1.5 rounded-full", CANDY)} />
      </div>

      <div className="flex gap-1.5">
        {[0, 1].map((index) => {
          const on = active ? index === 1 : index === 0;
          return (
            <motion.div
              animate={{
                scale: on && !shouldReduceMotion ? 1.03 : 1,
              }}
              className={cn(
                "h-7 flex-1 rounded-lg",
                on ? CANDY : "border border-border bg-background shadow-sm"
              )}
              key={index}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { bounce: 0.1, duration: 0.2, type: "spring" }
              }
            />
          );
        })}
      </div>

      <div className="space-y-2.5 border-border border-l-2 pl-3">
        {rows.map((row, index) => (
          <div className="flex items-center gap-2" key={row.name}>
            <div
              className={cn(
                "h-2 w-2 rotate-45 border-b border-l",
                index === 0 ? "border-brand" : "border-border"
              )}
            />
            <div
              className={cn("h-2 rounded-full", index === 0 ? INK : GHOST)}
              style={{ width: row.width }}
            />
            <div className={cn("ml-auto h-1.5 w-5 rounded-full", GHOST)} />
          </div>
        ))}
      </div>
    </div>
  );
};
