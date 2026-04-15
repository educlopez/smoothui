"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { motion, useReducedMotion } from "motion/react";
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
    id: "markup",
    title: "Semantic Markup",
    description:
      "Start with role=tablist + role=tab so keyboard users and screen readers work out of the box.",
  },
  {
    id: "state",
    title: "Active State",
    description: "Track which tab is active and style it differently.",
  },
  {
    id: "indicator",
    title: "Shared Indicator",
    description:
      "Add a motion.span with a shared layoutId inside the active tab — Motion handles the slide for you.",
  },
  {
    id: "spring",
    title: "Spring Transition",
    description:
      "Use a snappy spring (bounce ≤ 0.1) so the indicator feels tight, not floaty.",
  },
  {
    id: "keyboard",
    title: "Keyboard Navigation",
    description:
      "Handle Arrow keys, Home and End. Move focus to the newly active tab.",
  },
  {
    id: "accessibility",
    title: "Reduced Motion",
    description:
      "Skip the spring entirely when the user has prefers-reduced-motion set.",
  },
] as const;

type StepId = (typeof STEPS)[number]["id"];

const CODE_SNIPPETS: Record<StepId, string> = {
  markup: `<div role="tablist">
  {tabs.map((tab) => (
    <button key={tab.id} role="tab" aria-selected={active === tab.id}>
      {tab.label}
    </button>
  ))}
</div>`,
  state: `const [active, setActive] = useState(tabs[0].id);

<button
  role="tab"
  aria-selected={active === tab.id}
  className={active === tab.id ? "text-foreground" : "text-muted-foreground"}
  onClick={() => setActive(tab.id)}
>`,
  indicator: `{active === tab.id && (
  <motion.span
    layoutId="tabs-indicator"
    className="absolute inset-0 rounded-full bg-background shadow-sm"
  />
)}`,
  spring: `<motion.span
  layoutId="tabs-indicator"
  transition={{ type: "spring", duration: 0.25, bounce: 0.05 }}
/>`,
  keyboard: `const onKeyDown = (e: KeyboardEvent, i: number) => {
  if (e.key === "ArrowRight") setActive(tabs[(i + 1) % tabs.length].id);
  if (e.key === "ArrowLeft") setActive(tabs[(i - 1 + tabs.length) % tabs.length].id);
  if (e.key === "Home") setActive(tabs[0].id);
  if (e.key === "End") setActive(tabs[tabs.length - 1].id);
};`,
  accessibility: `const shouldReduceMotion = useReducedMotion();

<motion.span
  layoutId="tabs-indicator"
  transition={shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring", duration: 0.25, bounce: 0.05 }}
/>`,
};

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "analytics", label: "Analytics" },
  { id: "reports", label: "Reports" },
] as const;

interface InteractiveAnimatedTabsTutorialProps {
  className?: string;
}

export function InteractiveAnimatedTabsTutorial({
  className,
}: InteractiveAnimatedTabsTutorialProps) {
  const [currentStep, setCurrentStep] = useState<StepId>("markup");
  const [active, setActive] = useState<(typeof TABS)[number]["id"]>(TABS[0].id);
  const shouldReduceMotion = useReducedMotion();
  const stepRefs = useRef<Map<string, HTMLElement>>(new Map());
  const indicatorRef = useRef<HTMLDivElement>(null);

  const stepIndex = STEPS.findIndex((s) => s.id === currentStep);
  const showActiveState = stepIndex >= 1;
  const showIndicator = stepIndex >= 2;
  const useSpring = stepIndex >= 3;
  const respectReducedMotion = stepIndex >= 5;

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

  const handleStepClick = (stepId: StepId) => {
    stepRefs.current
      .get(stepId)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const effectiveReduced = respectReducedMotion && shouldReduceMotion;

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
              <div
                aria-label="Tabs"
                className="relative inline-flex gap-1 rounded-full bg-muted p-1"
                role="tablist"
              >
                {TABS.map((tab) => {
                  const isActive = active === tab.id;
                  const isActiveStyled = showActiveState && isActive;
                  return (
                    <button
                      aria-selected={isActive}
                      className={cn(
                        "relative z-10 rounded-full px-4 py-2 font-medium text-sm transition-colors",
                        isActiveStyled
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                      key={tab.id}
                      onClick={() => setActive(tab.id)}
                      role="tab"
                      type="button"
                    >
                      {showIndicator && isActive && (
                        <motion.span
                          className="absolute inset-0 -z-10 rounded-full border border-border bg-background shadow-sm"
                          layoutId="tutorial-tabs-indicator"
                          transition={
                            effectiveReduced
                              ? { duration: 0 }
                              : useSpring
                                ? {
                                    type: "spring",
                                    duration: 0.25,
                                    bounce: 0.05,
                                  }
                                : { duration: 0.2 }
                          }
                        />
                      )}
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
