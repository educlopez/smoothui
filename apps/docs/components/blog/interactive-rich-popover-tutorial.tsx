"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/shadcn-ui/components/ui/popover";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Clock, ExternalLink, Play } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// SmoothUI Logo Isotype
const SmoothUIIsotype = () => (
  <div className="flex size-7 items-center justify-center rounded-full bg-brand/20">
    <svg
      aria-hidden="true"
      className="size-4 text-brand"
      fill="currentColor"
      viewBox="0 0 512 512"
    >
      <path d="M329.205 6.05469C331.396 0.985458 337.281 -1.34888 342.351 0.84082L355.644 6.58301C356.018 6.74496 356.377 6.93032 356.722 7.13086L439.729 42.9902C444.799 45.1805 447.134 51.066 444.944 56.1357L439.202 69.4277C437.012 74.4976 431.126 76.8315 426.056 74.6416L351.12 42.2705L330.918 89.0332C376.141 114.344 408.567 159.794 416.052 213.239H429.756V278.752H397.765L397.27 282.408L386.144 369.047C383.266 392.108 380.937 415.238 377.957 438.284C376.66 448.318 375.865 459.058 373.398 468.858C372.384 471.375 371.168 473.657 369.527 475.817C353.072 497.475 312.68 504.556 287.003 508.111C273.789 510.037 260.45 510.964 247.098 510.888C217.287 510.485 162.338 502.749 138.37 484.41C133.049 480.338 128.118 475.314 126.057 468.793C124.143 462.739 123.772 455.672 122.899 449.391L117.649 411.719L99.9443 278.752H67.7119V213.239H80.5723C92.1014 130.913 162.808 67.5599 248.312 67.5596C266.066 67.5596 283.183 70.2933 299.265 75.3594L329.205 6.05469ZM298.618 347.714C290.008 349.185 284.699 357.994 277.604 362.6C260.758 373.533 233.532 371.369 217.451 359.928C211.198 355.48 206.551 346.709 197.798 348.069C194.209 348.628 190.796 350.598 188.722 353.611C186.781 356.428 186.276 360.028 186.956 363.345C188.187 369.351 193.243 374.041 197.507 378.105C213.771 391.889 237.722 397.757 258.754 395.938C277.382 394.327 294.852 386.112 306.932 371.629C309.792 368.2 311.798 364.372 311.3 359.786C310.918 356.283 309.287 352.397 306.453 350.188C304.098 348.351 301.526 347.879 298.618 347.714ZM187.43 188.242C177.489 188.242 169.43 196.301 169.43 206.242V305.578C169.43 315.519 177.489 323.578 187.43 323.578H194.529C204.47 323.578 212.529 315.519 212.529 305.578V206.242C212.529 196.301 204.47 188.242 194.529 188.242H187.43ZM302.939 188.242C292.998 188.242 284.94 196.301 284.939 206.242V305.578C284.939 315.519 292.998 323.578 302.939 323.578H310.04C319.981 323.578 328.04 315.519 328.04 305.578V206.242C328.04 196.301 319.981 188.242 310.04 188.242H302.939Z" />
    </svg>
  </div>
);

// Step definitions for the tutorial
const STEPS = [
  {
    id: "trigger",
    title: "Trigger Element",
    description:
      "Start with an inline trigger that opens the popover on click.",
  },
  {
    id: "content",
    title: "Rich Content",
    description:
      "Structure the popover with icon, title, description, and metadata.",
  },
  {
    id: "animation",
    title: "Entry Animation",
    description: "Add scale and opacity animation for smooth appearance.",
  },
  {
    id: "blur",
    title: "Blur Effect",
    description: "Add blur transition for a materializing glass effect.",
  },
  {
    id: "spring",
    title: "Spring Physics",
    description: "Use spring animation for natural, responsive movement.",
  },
  {
    id: "complete",
    title: "Complete",
    description: "The final component with all features combined.",
  },
] as const;

type StepId = (typeof STEPS)[number]["id"];

interface InteractiveRichPopoverTutorialProps {
  className?: string;
}

// Code snippets for each step
const CODE_SNIPPETS: Record<StepId, string> = {
  trigger: `<Popover>
  <PopoverTrigger asChild>
    <button className="text-brand underline">
      hover or click me
    </button>
  </PopoverTrigger>
  <PopoverContent>
    {/* Popover content */}
  </PopoverContent>
</Popover>`,
  content: `<PopoverContent className="w-80 rounded-2xl bg-black p-4">
  <div className="flex gap-3">
    <div className="size-10 rounded-lg bg-red-600">
      <YouTubeIcon />
    </div>
    <div className="flex-1">
      <h3 className="font-semibold text-white">
        Video Title
        <ExternalLink className="ml-1 inline" />
      </h3>
      <p className="text-white/70 text-sm">
        Description text here...
      </p>
    </div>
  </div>
</PopoverContent>`,
  animation: `<motion.div
  initial={{ opacity: 0, scale: 0.95, y: 5 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.95, y: 5 }}
>
  {/* Popover content */}
</motion.div>`,
  blur: `initial={{
  opacity: 0,
  scale: 0.95,
  y: 5,
  filter: "blur(8px)"
}}
animate={{
  opacity: 1,
  scale: 1,
  y: 0,
  filter: "blur(0px)"
}}`,
  spring: `transition={{
  type: "spring",
  stiffness: 500,  // Quick response
  damping: 30,     // Smooth settling
  duration: 0.2    // Fast but visible
}}`,
  complete: `// The complete component includes:
✓ Scale + opacity animation
✓ Blur materializing effect
✓ Spring physics (stiffness: 500)
✓ Rich content structure
✓ Reduced motion support
✓ Dark theme aesthetic`,
};

// Helper function to get transition config
const getTransition = (
  shouldReduceMotion: boolean | null,
  showSpring: boolean
) => {
  if (shouldReduceMotion) {
    return { duration: 0 };
  }
  if (showSpring) {
    return {
      type: "spring" as const,
      stiffness: 500,
      damping: 30,
      duration: 0.2,
    };
  }
  return { duration: 0.2 };
};

// YouTube icon component
const YouTubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export function InteractiveRichPopoverTutorial({
  className,
}: InteractiveRichPopoverTutorialProps) {
  const [currentStep, setCurrentStep] = useState<StepId>("trigger");
  const [isOpen, setIsOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const stepRefs = useRef<Map<string, HTMLElement>>(new Map());
  const indicatorRef = useRef<HTMLDivElement>(null);

  // Get step index for comparison
  const stepIndex = STEPS.findIndex((s) => s.id === currentStep);

  // Determine what to show based on current step
  const showContent = stepIndex >= 1;
  const showAnimation = stepIndex >= 2;
  const showBlur = stepIndex >= 3;
  const showSpring = stepIndex >= 4;

  // Track scroll position to update current step
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const stepId = entry.target.getAttribute("data-step");
            if (stepId) {
              setCurrentStep(stepId as StepId);
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

  // Update indicator position
  useEffect(() => {
    const activeRef = stepRefs.current.get(currentStep);
    const stepsContainer =
      indicatorRef.current?.parentElement?.querySelector(".space-y-6");
    if (activeRef && indicatorRef.current && stepsContainer) {
      const containerRect = stepsContainer.getBoundingClientRect();
      const activeRect = activeRef.getBoundingClientRect();
      const top = activeRect.top - containerRect.top + 16;
      indicatorRef.current.style.transform = `translateY(${top}px)`;
    }
  }, [currentStep]);

  const handleStepClick = (stepId: StepId) => {
    const ref = stepRefs.current.get(stepId);
    if (ref) {
      ref.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div className="grid min-w-0 gap-8 lg:grid-cols-[1fr_400px]">
        {/* Left: Slides/Content */}
        <div className="relative min-w-0">
          {/* Indicator logo */}
          <div
            className="absolute -left-1 z-10 hidden transition-transform duration-300 ease-out lg:block"
            ref={indicatorRef}
            style={{ transform: "translateY(16px)" }}
          >
            <SmoothUIIsotype />
          </div>

          {/* Steps */}
          <div className="space-y-6 lg:pl-8">
            {STEPS.map((step) => (
              <section
                className={cn(
                  "relative cursor-pointer scroll-mt-32 rounded-xl p-4 transition-all",
                  "hover:bg-muted/50",
                  currentStep === step.id && "bg-muted/30"
                )}
                data-active={currentStep === step.id}
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

                {/* Code snippet with Shiki highlighting */}
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

                {/* Additional notes for specific steps */}
                {step.id === "blur" && (
                  <p className="mt-3 text-muted-foreground text-sm">
                    The blur creates a "materializing" effect, as if the content
                    is coming into focus from behind frosted glass.
                  </p>
                )}
                {step.id === "spring" && (
                  <p className="mt-3 text-muted-foreground text-sm">
                    <strong className="text-foreground">Stiffness 500</strong>{" "}
                    makes it feel responsive.{" "}
                    <strong className="text-foreground">Duration 0.2s</strong>{" "}
                    keeps it snappy without being jarring.
                  </p>
                )}
                {step.id === "complete" && (
                  <p className="mt-3 text-muted-foreground text-sm">
                    <strong className="text-foreground">Try it!</strong> Click
                    the trigger to see the animation in action.
                  </p>
                )}
              </section>
            ))}
          </div>
        </div>

        {/* Right: Demo Preview */}
        <div className="not-prose lg:sticky lg:top-32 lg:h-fit">
          <div className="overflow-hidden rounded-2xl border bg-muted/20">
            {/* Demo header */}
            <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2">
              <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                Live Preview
              </span>
              <span className="rounded-full bg-brand/10 px-2 py-0.5 font-medium text-brand text-xs">
                Step {stepIndex + 1}/{STEPS.length}
              </span>
            </div>

            {/* Demo content */}
            <div className="flex min-h-[350px] items-center justify-center bg-background p-8">
              <p className="text-center text-foreground text-sm leading-relaxed">
                Check out the latest{" "}
                <Popover onOpenChange={setIsOpen} open={isOpen}>
                  <PopoverTrigger asChild>
                    <button
                      className="cursor-pointer font-medium text-brand underline underline-offset-2 hover:text-brand/80"
                      type="button"
                    >
                      announcement video
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="z-50 w-80 overflow-hidden border-0 bg-transparent p-0 shadow-none"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    sideOffset={8}
                  >
                    <motion.div
                      animate={
                        showAnimation && !shouldReduceMotion
                          ? {
                              opacity: 1,
                              scale: 1,
                              y: 0,
                              filter: showBlur ? "blur(0px)" : undefined,
                            }
                          : { opacity: 1 }
                      }
                      className="rounded-2xl border border-white/10 bg-black p-4 shadow-xl"
                      initial={
                        showAnimation && !shouldReduceMotion
                          ? {
                              opacity: 0,
                              scale: 0.95,
                              y: 5,
                              filter: showBlur ? "blur(8px)" : undefined,
                            }
                          : { opacity: 1 }
                      }
                      transition={getTransition(shouldReduceMotion, showSpring)}
                    >
                      {showContent ? (
                        <div className="flex gap-3">
                          {/* Icon */}
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-red-600">
                            <YouTubeIcon className="size-5 text-white" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 space-y-2">
                            <div>
                              <a
                                className="inline-flex items-center gap-1 font-semibold text-white hover:underline"
                                href="https://youtube.com"
                                rel="noopener noreferrer"
                                target="_blank"
                              >
                                Introducing GPT-5
                                <ExternalLink className="size-3.5" />
                              </a>
                              <p className="mt-1 max-w-[220px] text-pretty text-sm text-white/70">
                                OpenAI announces their most capable model yet
                                with groundbreaking capabilities.
                              </p>
                            </div>

                            {/* Meta & Action */}
                            <div className="flex items-center justify-between pt-1">
                              <div className="flex items-center gap-1.5 text-white/50 text-xs">
                                <Clock className="size-3.5" />
                                <span>12:34</span>
                              </div>
                              <button
                                className="flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 font-medium text-black text-xs transition-colors hover:bg-white/90"
                                type="button"
                              >
                                <Play className="size-3.5" />
                                Play
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="py-4 text-center text-sm text-white/50">
                          Popover content here
                        </div>
                      )}
                    </motion.div>
                  </PopoverContent>
                </Popover>{" "}
                from OpenAI.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
