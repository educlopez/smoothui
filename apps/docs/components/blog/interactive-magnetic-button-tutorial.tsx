"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { motion, useReducedMotion, useSpring } from "motion/react";
import {
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

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
    id: "button",
    title: "Base Button",
    description: "Start with a plain button — no motion, no tracking.",
  },
  {
    id: "track",
    title: "Track the Cursor",
    description:
      "Measure the distance from the button center to the pointer on mouse move.",
  },
  {
    id: "pull",
    title: "Pull Towards the Cursor",
    description:
      "Translate the button proportionally, with a strength factor so it only drifts slightly.",
  },
  {
    id: "radius",
    title: "Radius Falloff",
    description:
      "Only react within a radius. The further from center, the weaker the pull.",
  },
  {
    id: "spring",
    title: "Spring Return",
    description:
      "Wrap the x/y values in useSpring so movement — and the release — feels organic.",
  },
  {
    id: "accessibility",
    title: "Accessibility",
    description:
      "Disable the effect on touch devices and when the user prefers reduced motion.",
  },
] as const;

type StepId = (typeof STEPS)[number]["id"];

const CODE_SNIPPETS: Record<StepId, string> = {
  button: `<button className="rounded-md bg-primary px-6 py-2 text-primary-foreground">
  Hover me
</button>`,
  track: `const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
  const rect = buttonRef.current!.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const dx = e.clientX - centerX;
  const dy = e.clientY - centerY;
};`,
  pull: `// strength = 0.3 means the button drifts 30% of the distance
x.set(dx * strength);
y.set(dy * strength);

// In JSX
<motion.div style={{ x, y }}>
  <button>Magnetic</button>
</motion.div>`,
  radius: `const distance = Math.sqrt(dx * dx + dy * dy);

if (distance < radius) {
  const falloff = 1 - distance / radius;
  x.set(dx * strength * falloff);
  y.set(dy * strength * falloff);
} else {
  x.set(0);
  y.set(0);
}`,
  spring: `const x = useSpring(0, { duration: 0.4, bounce: 0.1 });
const y = useSpring(0, { duration: 0.4, bounce: 0.1 });

// On mouse leave, snap back:
const handleMouseLeave = () => {
  x.set(0);
  y.set(0);
};`,
  accessibility: `const shouldReduceMotion = useReducedMotion();
const [isHoverDevice, setIsHoverDevice] = useState(false);

useEffect(() => {
  const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
  setIsHoverDevice(mq.matches);
}, []);

const disabled = shouldReduceMotion || !isHoverDevice;`,
};

interface InteractiveMagneticButtonTutorialProps {
  className?: string;
}

export function InteractiveMagneticButtonTutorial({
  className,
}: InteractiveMagneticButtonTutorialProps) {
  const [currentStep, setCurrentStep] = useState<StepId>("button");
  const shouldReduceMotion = useReducedMotion();
  const stepRefs = useRef<Map<string, HTMLElement>>(new Map());
  const indicatorRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const stepIndex = STEPS.findIndex((s) => s.id === currentStep);
  const showTrack = stepIndex >= 1;
  const showPull = stepIndex >= 2;
  const showRadius = stepIndex >= 3;
  const showSpring = stepIndex >= 4;

  const strength = 0.4;
  const radius = 140;

  const rawX = useSpring(0, { duration: 0.4, bounce: 0.1 });
  const rawY = useSpring(0, { duration: 0.4, bounce: 0.1 });

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

  const handleMouseMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (!(showTrack && buttonRef.current) || shouldReduceMotion) {
        return;
      }
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (!showPull) {
        return;
      }

      if (showRadius) {
        if (distance < radius) {
          const falloff = 1 - distance / radius;
          rawX.set(dx * strength * falloff);
          rawY.set(dy * strength * falloff);
        } else {
          rawX.set(0);
          rawY.set(0);
        }
      } else {
        rawX.set(dx * strength);
        rawY.set(dy * strength);
      }
    },
    [showTrack, showPull, showRadius, shouldReduceMotion, rawX, rawY]
  );

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
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
                data-active={currentStep === step.id}
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
            {/* biome-ignore lint/a11y/noStaticElementInteractions: preview area */}
            <div
              className="flex min-h-[350px] items-center justify-center bg-background p-8"
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
              role="presentation"
            >
              <motion.div
                style={
                  showSpring
                    ? { x: rawX, y: rawY }
                    : showPull
                      ? { x: rawX.get(), y: rawY.get() }
                      : undefined
                }
              >
                <button
                  className="rounded-md bg-primary px-6 py-2 font-medium text-primary-foreground text-sm shadow-sm"
                  ref={buttonRef}
                  type="button"
                >
                  Hover me
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
