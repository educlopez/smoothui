"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
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

const STEPS = [
  {
    id: "static",
    title: "Static Number",
    description: "Start by rendering a number with tabular-nums so digits stay aligned.",
  },
  {
    id: "digits",
    title: "Split into Digits",
    description:
      "Convert the value to a string and animate each character independently.",
  },
  {
    id: "presence",
    title: "Animate Per Digit",
    description:
      "Use AnimatePresence keyed by the character so each digit can enter and exit.",
  },
  {
    id: "direction",
    title: "Direction-Aware",
    description:
      "Slide up when the value increases, slide down when it decreases.",
  },
  {
    id: "spring",
    title: "Spring Timing",
    description: "A quick spring with low bounce keeps the motion crisp.",
  },
  {
    id: "accessibility",
    title: "Reduced Motion",
    description: "Fall back to an instant swap when users prefer less motion.",
  },
] as const;

type StepId = (typeof STEPS)[number]["id"];

const CODE_SNIPPETS: Record<StepId, string> = {
  static: `<span className="tabular-nums">{value}</span>`,
  digits: `const digits = value.toString().split("");

<span className="tabular-nums">
  {digits.map((d, i) => <span key={i}>{d}</span>)}
</span>`,
  presence: `<AnimatePresence mode="popLayout" initial={false}>
  <motion.span
    key={digit + index}
    initial={{ y: 12, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: -12, opacity: 0 }}
  >
    {digit}
  </motion.span>
</AnimatePresence>`,
  direction: `const direction = value > previous ? 1 : -1;

initial={{ y: 12 * direction, opacity: 0 }}
exit={{ y: -12 * direction, opacity: 0 }}`,
  spring: `transition={{
  type: "spring",
  duration: 0.3,
  bounce: 0.1,
}}`,
  accessibility: `const shouldReduceMotion = useReducedMotion();

transition={shouldReduceMotion
  ? { duration: 0 }
  : { type: "spring", duration: 0.3, bounce: 0.1 }}`,
};

interface InteractiveNumberFlowTutorialProps {
  className?: string;
}

export function InteractiveNumberFlowTutorial({
  className,
}: InteractiveNumberFlowTutorialProps) {
  const [currentStep, setCurrentStep] = useState<StepId>("static");
  const [value, setValue] = useState(100);
  const previousValueRef = useRef(100);
  const shouldReduceMotion = useReducedMotion();
  const stepRefs = useRef<Map<string, HTMLElement>>(new Map());
  const indicatorRef = useRef<HTMLDivElement>(null);

  const stepIndex = STEPS.findIndex((s) => s.id === currentStep);
  const splitDigits = stepIndex >= 1;
  const animate = stepIndex >= 2;
  const directional = stepIndex >= 3;
  const useSpring = stepIndex >= 4;
  const respectReducedMotion = stepIndex >= 5;

  const direction = directional
    ? value >= previousValueRef.current
      ? 1
      : -1
    : 1;

  useEffect(() => {
    previousValueRef.current = value;
  }, [value]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-step");
            if (id) setCurrentStep(id as StepId);
          }
        }
      },
      { threshold: 0.5, rootMargin: "-20% 0px -20% 0px" }
    );
    for (const ref of stepRefs.current.values()) observer.observe(ref);
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

  const handleStepClick = (stepId: StepId) => {
    stepRefs.current
      .get(stepId)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const effectiveReduced = respectReducedMotion && shouldReduceMotion;
  const transition = effectiveReduced
    ? { duration: 0 }
    : useSpring
      ? { type: "spring" as const, duration: 0.3, bounce: 0.1 }
      : { duration: 0.2 };

  const digits = value.toString().split("");

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
                  if (el) stepRefs.current.set(step.id, el);
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
            <div className="flex min-h-[350px] flex-col items-center justify-center gap-6 bg-background p-8">
              <div className="flex items-baseline gap-1 font-semibold text-5xl text-foreground tabular-nums">
                <span className="text-muted-foreground text-2xl">$</span>
                {splitDigits ? (
                  <span className="inline-flex overflow-hidden">
                    {digits.map((digit, index) =>
                      animate ? (
                        <span
                          className="relative inline-block h-[1em] overflow-hidden leading-none"
                          // biome-ignore lint/suspicious/noArrayIndexKey: digit position is meaningful
                          key={`slot-${index}`}
                          style={{ width: "0.6em" }}
                        >
                          <AnimatePresence initial={false} mode="popLayout">
                            <motion.span
                              animate={{ y: 0, opacity: 1 }}
                              className="absolute inset-0 flex items-center justify-center"
                              exit={{
                                y: -18 * direction,
                                opacity: 0,
                              }}
                              initial={{
                                y: 18 * direction,
                                opacity: 0,
                              }}
                              key={`${digit}-${index}-${value}`}
                              transition={transition}
                            >
                              {digit}
                            </motion.span>
                          </AnimatePresence>
                        </span>
                      ) : (
                        // biome-ignore lint/suspicious/noArrayIndexKey: static render
                        <span key={`static-${index}`}>{digit}</span>
                      )
                    )}
                  </span>
                ) : (
                  <span>{value}</span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  className="rounded-md border border-border bg-muted px-3 py-1.5 font-medium text-sm hover:bg-muted/70"
                  onClick={() => setValue((v) => Math.max(0, v - 7))}
                  type="button"
                >
                  − 7
                </button>
                <button
                  className="rounded-md border border-border bg-muted px-3 py-1.5 font-medium text-sm hover:bg-muted/70"
                  onClick={() => setValue((v) => v + 7)}
                  type="button"
                >
                  + 7
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
