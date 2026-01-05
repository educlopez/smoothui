"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { useEffect, useMemo, useState } from "react";

export type LightState = "off" | "medium" | "high";

export type SwitchboardCardProps = {
  title: string;
  subtitle: string;
  columns?: number;
  rows?: number;
  gridPattern?: number[] | number[][]; // Direct grid pattern: flat array (columns*rows) or 2D array [rows][columns] where 0=off, 1=high
  randomLights?: boolean; // If true, randomly activate some lights
  transitionDuration?: number; // in milliseconds (default: 200ms for smooth light transitions)
  className?: string;
  variant?: "default" | "next";
  showButton?: boolean;
  href?: string;
  onButtonClick?: () => void;
};

function generateRandomPattern(
  totalLights: number,
  activeRatio = 0.15
): number[] {
  const activeCount = Math.floor(totalLights * activeRatio);
  const pattern: number[] = [];
  const used = new Set<number>();

  while (pattern.length < activeCount) {
    const index = Math.floor(Math.random() * totalLights);
    if (!used.has(index)) {
      used.add(index);
      pattern.push(index);
    }
  }

  return pattern.sort((a, b) => a - b);
}

export default function SwitchboardCard({
  title,
  subtitle,
  columns = 18,
  rows = 5,
  gridPattern,
  randomLights = false,
  transitionDuration = 200,
  className,
  variant = "default",
  showButton = true,
  href,
  onButtonClick,
}: SwitchboardCardProps) {
  const totalLights = columns * rows;
  const isRandomLightsMode = randomLights && !gridPattern;

  // Convert gridPattern to light indices
  // Priority: gridPattern > randomLights
  const basePattern = useMemo<number[]>(() => {
    if (gridPattern) {
      const pattern: number[] = [];
      // Handle 2D array [rows][columns]
      if (Array.isArray(gridPattern[0]) && typeof gridPattern[0] !== "number") {
        const grid2D = gridPattern as number[][];
        for (let row = 0; row < Math.min(grid2D.length, rows); row++) {
          const rowData = grid2D[row];
          if (Array.isArray(rowData)) {
            for (let col = 0; col < Math.min(rowData.length, columns); col++) {
              if (rowData[col] === 1) {
                const index = col + row * columns;
                if (index >= 0 && index < totalLights) {
                  pattern.push(index);
                }
              }
            }
          }
        }
        return pattern;
      }
      // Handle flat array [columns*rows]
      const flatPattern = gridPattern as number[];
      for (let i = 0; i < Math.min(flatPattern.length, totalLights); i++) {
        if (flatPattern[i] === 1) {
          pattern.push(i);
        }
      }
      return pattern;
    }
    if (randomLights) {
      return generateRandomPattern(totalLights);
    }
    return [];
  }, [gridPattern, randomLights, columns, rows, totalLights]);

  // Animated light states
  // For random lights: all start off, will animate randomly through medium → high → medium → off
  // For word/pattern: pattern lights start high (stay high), rest off
  const [lightStates, setLightStates] = useState<LightState[]>(() => {
    const states: LightState[] = new Array(totalLights).fill("off");
    if (!isRandomLightsMode) {
      // For word/pattern, set pattern lights to high
      for (const index of basePattern) {
        if (index >= 0 && index < totalLights) {
          states[index] = "high";
        }
      }
    }
    // For random lights, all start off (will animate)
    return states;
  });

  // Animate lights - only for random lights mode (word/pattern stays high)
  useEffect(() => {
    // Word/pattern mode: no animation, lights stay high
    if (!isRandomLightsMode) return;
    if (basePattern.length === 0) return;

    const interval = setInterval(() => {
      setLightStates((prev) => {
        const next = [...prev];
        // For random lights: animate all lights randomly through off → high (via medium transition)
        // Randomly select a subset of lights to animate each tick
        const lightsToAnimate = Math.floor(totalLights * 0.2); // Animate ~20% of all lights per tick
        const allIndices = Array.from({ length: totalLights }, (_, i) => i);
        const shuffled = allIndices.sort(() => Math.random() - 0.5);

        for (let i = 0; i < Math.min(lightsToAnimate, shuffled.length); i++) {
          const index = shuffled[i];
          if (index >= 0 && index < totalLights) {
            const current = prev[index];
            // State transition logic for random lights: off → high (with medium as intermediate transition state)
            // Medium state is only used as a transition, not a final state
            if (current === "off") {
              // Start transition to high by going to medium first
              next[index] = "medium";
            } else if (current === "medium") {
              // Continue transition: medium → high
              next[index] = "high";
            } else if (current === "high") {
              // Turn off directly (no medium transition when turning off)
              next[index] = "off";
            }
          }
        }
        return next;
      });
    }, 200); // 0.2s interval to match transition duration

    return () => clearInterval(interval);
  }, [isRandomLightsMode, totalLights]);

  const isNextVariant = variant === "next";

  const CardContent = (
    <div
      className={cn(
        "relative flex h-[380px] w-full flex-col overflow-hidden rounded-xl border p-6 transition-[border-color,background-color] duration-150",
        isNextVariant
          ? "border-0 dark:border-0 dark:shadow-[inset_0_0_6px_rgba(255,255,255,0.1)]"
          : "border-border bg-background hover:border-foreground/20",
        className
      )}
      data-variant={isNextVariant ? "next" : undefined}
      style={
        isNextVariant
          ? ({
              background:
                "linear-gradient(110deg, oklch(0.65 0 0) 0.06%, oklch(0.54 0 0) 100%)",
            } as React.CSSProperties)
          : undefined
      }
    >
      {/* Illustration/Switchboard */}
      <div
        className="flex h-full w-full items-center justify-center"
        data-illustration="true"
      >
        <div
          className="grid h-full w-full"
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
            gap: `min(1px, calc(100% / ${columns} / 10))`,
            maxHeight: "81px",
            transitionDuration: `${transitionDuration}ms`,
          }}
        >
          {lightStates.map((state, index) => (
            <LightBulb
              key={index}
              state={state}
              transitionDuration={transitionDuration}
            />
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="mt-4 flex flex-row items-center justify-start gap-2 text-left">
        <h3
          className={cn(
            "text-left font-semibold leading-8 tracking-[-0.04em]",
            isNextVariant ? "mt-4 text-2xl" : "text-foreground text-xl"
          )}
          data-title="true"
          style={
            isNextVariant
              ? ({ color: "oklch(0.95 0 0)" } as React.CSSProperties)
              : undefined
          }
        >
          {title}
        </h3>
      </div>

      {/* Subtitle */}
      <p
        className={cn(
          "text-left text-sm leading-relaxed tracking-[-0.01em]",
          isNextVariant
            ? "mt-1 max-w-[80%] text-base"
            : "mt-1 text-foreground/70"
        )}
        data-subtitle="true"
        style={
          isNextVariant
            ? ({ color: "oklch(0.9 0 0)" } as React.CSSProperties)
            : undefined
        }
      >
        {subtitle}
      </p>
    </div>
  );

  if (href) {
    return (
      <a
        aria-label={title}
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        href={href}
      >
        {CardContent}
      </a>
    );
  }

  if (onButtonClick) {
    return (
      <button
        aria-label={title}
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        onClick={onButtonClick}
        type="button"
      >
        {CardContent}
      </button>
    );
  }

  return CardContent;
}

function LightBulb({
  state,
  transitionDuration,
}: {
  state: LightState;
  transitionDuration: number;
}) {
  const transitionStyle = {
    transition: `opacity ${transitionDuration}ms ease-out, transform ${transitionDuration}ms ease-out`,
  };

  return (
    <div
      className={cn(
        "relative rounded-full",
        state === "off" && "bg-foreground/50",
        state === "high" ? "h-[2px] w-[2px]" : "h-px w-px"
      )}
      data-state={state}
      style={{
        ...transitionStyle,
        transform: state !== "off" ? "scale(1)" : "unset",
      }}
    >
      {/* Glow effect for medium state (::before equivalent) */}
      {state === "medium" && (
        <div
          className="absolute inset-0 rounded-full"
          style={{
            ...transitionStyle,
            opacity: 1,
            backgroundColor: "var(--color-brand)",
            boxShadow:
              "0 0 2px 1px color-mix(in oklch, var(--color-brand), transparent 60%), 0 0 4px 1.5px color-mix(in oklch, var(--color-brand), transparent 75%)",
          }}
        />
      )}

      {/* Glow effect for high state (::after equivalent) */}
      {state === "high" && (
        <div
          className="absolute inset-0 rounded-full"
          style={{
            ...transitionStyle,
            opacity: 1,
            backgroundColor: "var(--color-brand)",
            boxShadow:
              "0 0 2px 1px color-mix(in oklch, var(--color-brand), transparent 40%), 0 0 4px 1.5px color-mix(in oklch, var(--color-brand), transparent 65%), 0 0 6px 2px color-mix(in oklch, var(--color-brand), transparent 80%)",
          }}
        />
      )}
    </div>
  );
}
