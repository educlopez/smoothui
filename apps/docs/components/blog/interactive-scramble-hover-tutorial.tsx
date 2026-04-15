"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { useEffect, useRef, useState } from "react";

const SmoothUIIsotype = () => (
  <div className="flex size-7 items-center justify-center rounded-full bg-brand/20">
    <svg
      aria-hidden="true"
      className="size-4 text-brand"
      fill="currentColor"
      viewBox="0 0 512 512"
    >
      <circle cx="256" cy="256" r="200" />
    </svg>
  </div>
);

const CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*".split(
    ""
  );

const STEPS = [
  {
    id: "base",
    title: "Base Text",
    description: "Start with a simple button rendering a string.",
  },
  {
    id: "scramble",
    title: "Scramble Function",
    description:
      "Write a pure function that replaces every character (except spaces) with a random one.",
  },
  {
    id: "interval",
    title: "Interval Loop",
    description:
      "On hover, run setInterval to reshuffle the text every few milliseconds.",
  },
  {
    id: "timeout",
    title: "Stop & Restore",
    description:
      "Use setTimeout so the scramble lasts a fixed duration, then reset to the original text.",
  },
  {
    id: "cleanup",
    title: "Cleanup on Leave",
    description:
      "Clear timers when the pointer leaves so animations don't leak or overlap.",
  },
  {
    id: "accessibility",
    title: "Accessibility",
    description:
      "Detect hover-capable devices and respect prefers-reduced-motion.",
  },
] as const;

type StepId = (typeof STEPS)[number]["id"];

const CODE_SNIPPETS: Record<StepId, string> = {
  base: "<button>{text}</button>",
  scramble: `const CHARACTERS = "ABC...xyz0123!@#".split("");

function scrambleText(original: string) {
  return original
    .split("")
    .map((c) =>
      c === " " ? " " : CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]
    )
    .join("");
}`,
  interval: `const [display, setDisplay] = useState(text);

const handleMouseEnter = () => {
  intervalRef.current = setInterval(() => {
    setDisplay(scrambleText(text));
  }, 30);
};`,
  timeout: `const handleMouseEnter = () => {
  intervalRef.current = setInterval(() => {
    setDisplay(scrambleText(text));
  }, 30);

  timeoutRef.current = setTimeout(() => {
    clearInterval(intervalRef.current!);
    setDisplay(text); // snap back to original
  }, 600);
};`,
  cleanup: `const handleMouseLeave = () => {
  clearInterval(intervalRef.current!);
  clearTimeout(timeoutRef.current!);
  setDisplay(text);
};`,
  accessibility: `useEffect(() => {
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const hover = matchMedia("(hover: hover) and (pointer: fine)");
  setReduced(motion.matches);
  setHasHover(hover.matches);
}, []);

const onEnter = reduced || !hasHover ? undefined : handleMouseEnter;`,
};

interface InteractiveScrambleHoverTutorialProps {
  className?: string;
}

function scrambleText(original: string) {
  return original
    .split("")
    .map((c) =>
      c === " "
        ? " "
        : CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]
    )
    .join("");
}

export function InteractiveScrambleHoverTutorial({
  className,
}: InteractiveScrambleHoverTutorialProps) {
  const ORIGINAL = "Scramble Me";
  const [currentStep, setCurrentStep] = useState<StepId>("base");
  const [display, setDisplay] = useState(ORIGINAL);
  const stepRefs = useRef<Map<string, HTMLElement>>(new Map());
  const indicatorRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const stepIndex = STEPS.findIndex((s) => s.id === currentStep);
  const canScramble = stepIndex >= 2;
  const hasTimeout = stepIndex >= 3;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-step");
            if (id) {
              setCurrentStep(id as StepId);
            }
          }
        }
      },
      { threshold: 0.5, rootMargin: "-20% 0px -20% 0px" }
    );
    for (const ref of stepRefs.current.values()) {
      observer.observe(ref);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const activeRef = stepRefs.current.get(currentStep);
    const container =
      indicatorRef.current?.parentElement?.querySelector(".space-y-6");
    if (activeRef && indicatorRef.current && container) {
      const top =
        activeRef.getBoundingClientRect().top -
        container.getBoundingClientRect().top +
        16;
      indicatorRef.current.style.transform = `translateY(${top}px)`;
    }
  }, [currentStep]);

  const clearTimers = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleEnter = () => {
    if (!canScramble) {
      return;
    }
    clearTimers();
    intervalRef.current = setInterval(() => {
      setDisplay(scrambleText(ORIGINAL));
    }, 30);
    if (hasTimeout) {
      timeoutRef.current = setTimeout(() => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        setDisplay(ORIGINAL);
      }, 600);
    }
  };

  const handleLeave = () => {
    clearTimers();
    setDisplay(ORIGINAL);
  };

  const handleStepClick = (stepId: StepId) => {
    stepRefs.current
      .get(stepId)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className={cn("relative", className)}>
      <div className="grid min-w-0 gap-8 lg:grid-cols-[1fr_400px]">
        <div className="relative min-w-0">
          <div
            className="absolute -left-1 z-10 hidden transition-transform duration-300 ease-out lg:block"
            ref={indicatorRef}
            style={{ transform: "translateY(16px)" }}
          >
            <SmoothUIIsotype />
          </div>
          <div className="space-y-6 lg:pl-8">
            {STEPS.map((step) => (
              <section
                className={cn(
                  "relative cursor-pointer scroll-mt-32 rounded-xl p-4 transition-all hover:bg-muted/50",
                  currentStep === step.id && "bg-muted/30"
                )}
                data-step={step.id}
                key={step.id}
                onClick={() => handleStepClick(step.id)}
                ref={(el) => {
                  if (el) {
                    stepRefs.current.set(step.id, el);
                  }
                }}
              >
                <h3 className="mb-1 font-semibold text-foreground uppercase tracking-wide">
                  {step.title}
                </h3>
                <p className="mb-4 text-muted-foreground text-sm">
                  {step.description}
                </p>
                <div className="[&_figure]:!my-0 [&_pre]:!text-xs max-w-full overflow-x-auto rounded-lg text-sm [&_figure]:rounded-lg">
                  <DynamicCodeBlock
                    code={CODE_SNIPPETS[step.id]}
                    lang="tsx"
                    options={{
                      themes: {
                        light: "catppuccin-latte",
                        dark: "catppuccin-mocha",
                      },
                    }}
                  />
                </div>
              </section>
            ))}
          </div>
        </div>

        <div className="not-prose lg:sticky lg:top-32 lg:h-fit">
          <div className="overflow-hidden rounded-2xl border bg-muted/20">
            <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2">
              <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                Live Preview
              </span>
              <span className="rounded-full bg-brand/10 px-2 py-0.5 font-medium text-brand text-xs">
                Step {stepIndex + 1}/{STEPS.length}
              </span>
            </div>
            <div className="flex min-h-[350px] items-center justify-center bg-background p-8">
              <button
                className="rounded-md bg-muted px-6 py-3 font-mono font-semibold text-foreground text-lg tabular-nums"
                onBlur={handleLeave}
                onFocus={handleEnter}
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}
                type="button"
              >
                {display}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
