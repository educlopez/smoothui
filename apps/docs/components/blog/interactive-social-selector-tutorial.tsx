"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
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
    id: "buttons",
    title: "Platform Buttons",
    description: "Start with a row of icon buttons for each social platform.",
  },
  {
    id: "indicator",
    title: "Sliding Indicator",
    description: "Add an animated background that follows the selected button.",
  },
  {
    id: "spring",
    title: "Spring Physics",
    description: "Use spring animation for natural, snappy movement.",
  },
  {
    id: "link",
    title: "Dynamic Link",
    description: "Show the platform link with animated transitions.",
  },
  {
    id: "blur",
    title: "Blur Transition",
    description: "Add blur effect for depth when switching platforms.",
  },
  {
    id: "complete",
    title: "Complete",
    description: "The final component with all features combined.",
  },
] as const;

type StepId = (typeof STEPS)[number]["id"];

interface InteractiveSocialSelectorTutorialProps {
  className?: string;
}

// Code snippets for each step
const CODE_SNIPPETS: Record<StepId, string> = {
  buttons: `<div className="flex gap-4">
  {platforms.map((platform) => (
    <button
      key={platform.name}
      onClick={() => setSelected(platform)}
      className="size-9 rounded-full"
    >
      <platform.icon className="size-5" />
    </button>
  ))}
</div>`,
  indicator: `<div className="relative flex gap-4">
  {/* Animated background indicator */}
  <motion.div
    className="absolute size-9 rounded-full bg-primary"
    animate={{ x: selectedIndex * (36 + 16) }}
  />
  {/* Platform buttons */}
  {platforms.map((platform) => (
    <button ...>{platform.icon}</button>
  ))}
</div>`,
  spring: `<motion.div
  animate={{ x: selectedIndex * (36 + 16) }}
  transition={{
    type: "spring",
    stiffness: 500,  // Snappy response
    damping: 30,     // Prevents oscillation
    duration: 0.25
  }}
/>`,
  link: `<AnimatePresence mode="wait">
  <motion.a
    key={platform.domain}
    href={platform.url}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
  >
    @{username} on {platform.domain}
  </motion.a>
</AnimatePresence>`,
  blur: `initial={{
  opacity: 0,
  y: 10,
  filter: "blur(5px)"
}}
animate={{
  opacity: 1,
  y: 0,
  filter: "blur(0px)"
}}
exit={{
  opacity: 0,
  y: -10,
  filter: "blur(5px)"
}}`,
  complete: `// The complete component includes:
✓ Animated sliding indicator
✓ Spring physics (stiffness: 500)
✓ Blur transitions on link change
✓ Reduced motion support
✓ Controlled/uncontrolled modes`,
};

// Platform icons
const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const BlueskyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 01-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z" />
  </svg>
);

const ThreadsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.59 12c.025 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.332-3.023.88-.73 2.132-1.13 3.628-1.154 1.041-.017 1.996.071 2.862.267.026-1.073-.096-1.96-.442-2.498-.412-.642-1.074-.962-2.014-.974-1.053.005-1.801.283-2.222.804l-.063.085-1.704-1.26.067-.09c.703-.95 1.9-1.583 3.907-1.64l.058-.001c1.527.02 2.726.512 3.565 1.46.762.864 1.155 2.07 1.168 3.584l.001.136c.457.194.866.418 1.226.679 1.126.815 1.922 1.928 2.318 3.238.481 1.586.39 3.982-1.68 6.022-1.85 1.823-4.15 2.603-7.243 2.636zm-1.387-7.594c-1.592.053-2.44.626-2.485 1.378-.026.44.18.883.566 1.133.478.31 1.143.456 1.873.413 1.228-.066 2.784-.678 2.928-3.724a13.542 13.542 0 00-2.882-.2z" />
  </svg>
);

const PLATFORMS = [
  { name: "X", domain: "x.com", icon: XIcon, url: "https://x.com/educalvolpz" },
  {
    name: "Bluesky",
    domain: "bsky.app",
    icon: BlueskyIcon,
    url: "https://bsky.app/profile/educalvolpz",
  },
  {
    name: "Threads",
    domain: "threads.net",
    icon: ThreadsIcon,
    url: "https://threads.net/@educalvolpz",
  },
];

const ICON_SIZE = 36;
const ICON_GAP = 16;

export function InteractiveSocialSelectorTutorial({
  className,
}: InteractiveSocialSelectorTutorialProps) {
  const [currentStep, setCurrentStep] = useState<StepId>("buttons");
  const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0]);
  const shouldReduceMotion = useReducedMotion();
  const stepRefs = useRef<Map<string, HTMLElement>>(new Map());
  const indicatorRef = useRef<HTMLDivElement>(null);

  // Get step index for comparison
  const stepIndex = STEPS.findIndex((s) => s.id === currentStep);

  // Determine what to show based on current step
  const showIndicator = stepIndex >= 1;
  const showSpring = stepIndex >= 2;
  const showLink = stepIndex >= 3;
  const showBlur = stepIndex >= 4;

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

  const selectedIndex = PLATFORMS.findIndex(
    (p) => p.name === selectedPlatform.name
  );

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
                {step.id === "spring" && (
                  <p className="mt-3 text-muted-foreground text-sm">
                    <strong className="text-foreground">Stiffness 500</strong>{" "}
                    creates snappy, responsive movement.{" "}
                    <strong className="text-foreground">Damping 30</strong>{" "}
                    prevents the indicator from overshooting.
                  </p>
                )}
                {step.id === "blur" && (
                  <p className="mt-3 text-muted-foreground text-sm">
                    The blur effect creates depth, making content feel like it's
                    materializing from behind a glass surface.
                  </p>
                )}
                {step.id === "complete" && (
                  <p className="mt-3 text-muted-foreground text-sm">
                    <strong className="text-foreground">Try it!</strong> Click
                    the platform icons to see the animations in action.
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
            <div className="flex min-h-[300px] flex-col items-center justify-center gap-6 bg-background p-8">
              {/* Platform selector */}
              <div className="relative flex items-center gap-4">
                {/* Animated indicator background */}
                {showIndicator && (
                  <motion.div
                    animate={
                      shouldReduceMotion
                        ? { x: selectedIndex * (ICON_SIZE + ICON_GAP) }
                        : { x: selectedIndex * (ICON_SIZE + ICON_GAP) }
                    }
                    className="absolute size-9 rounded-full bg-primary"
                    initial={false}
                    layoutId={shouldReduceMotion ? undefined : "indicator"}
                    transition={
                      showSpring && !shouldReduceMotion
                        ? {
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                            duration: 0.25,
                          }
                        : { duration: 0 }
                    }
                  />
                )}

                {/* Platform buttons */}
                {PLATFORMS.map((platform) => (
                  <button
                    className={cn(
                      "relative z-10 flex size-9 items-center justify-center rounded-full transition-colors",
                      selectedPlatform.name === platform.name
                        ? "text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                    key={platform.name}
                    onClick={() => setSelectedPlatform(platform)}
                    type="button"
                  >
                    <platform.icon className="size-5" />
                  </button>
                ))}
              </div>

              {/* Platform link */}
              {showLink && (
                <AnimatePresence initial={false} mode="wait">
                  <motion.a
                    animate={
                      shouldReduceMotion
                        ? { opacity: 1 }
                        : {
                            opacity: 1,
                            y: 0,
                            filter: showBlur ? "blur(0px)" : undefined,
                          }
                    }
                    className="font-medium text-foreground text-sm"
                    exit={
                      shouldReduceMotion
                        ? { opacity: 0, transition: { duration: 0 } }
                        : {
                            opacity: 0,
                            y: -10,
                            filter: showBlur ? "blur(5px)" : undefined,
                          }
                    }
                    href={selectedPlatform.url}
                    initial={
                      shouldReduceMotion
                        ? { opacity: 0 }
                        : {
                            opacity: 0,
                            y: 10,
                            filter: showBlur ? "blur(5px)" : undefined,
                          }
                    }
                    key={selectedPlatform.domain}
                    rel="noopener noreferrer"
                    target="_blank"
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { type: "spring", duration: 0.25, bounce: 0 }
                    }
                  >
                    @educalvolpz on{" "}
                    <span className="text-muted-foreground">
                      {selectedPlatform.domain}
                    </span>
                  </motion.a>
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
