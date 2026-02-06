"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/shadcn-ui/components/ui/popover";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Eye, Package, User } from "lucide-react";
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
    id: "avatar",
    title: "Avatar Trigger",
    description: "Start with a simple avatar button as the trigger element.",
  },
  {
    id: "popover",
    title: "Popover Container",
    description: "Wrap the avatar with Radix UI's Popover for accessibility.",
  },
  {
    id: "buttons",
    title: "Section Buttons",
    description: "Add interactive section buttons with state management.",
  },
  {
    id: "animation",
    title: "Spring Animation",
    description: "Add spring animations for smooth expansion effects.",
  },
  {
    id: "blur",
    title: "Blur Effect",
    description: "Add blur transition for a materializing effect.",
  },
  {
    id: "progress",
    title: "Progress Bars",
    description: "Animate progress bars with spring physics.",
  },
  {
    id: "complete",
    title: "Complete",
    description: "The final component with all features combined.",
  },
] as const;

type StepId = (typeof STEPS)[number]["id"];

interface InteractiveAvatarTutorialProps {
  className?: string;
}

// Avatar URL matching the example
const AVATAR_URL =
  "https://ik.imagekit.io/16u211libb/avatar-educalvolpz.jpeg?updatedAt=1765524159631&tr=w-96,h-96,q-85,f-auto";

// Mock data
const mockUser = {
  name: "Jane Doe",
  email: "jane@example.com",
  avatar: AVATAR_URL,
};

const mockOrders = [
  {
    id: "ORD001",
    date: "2025-01-15",
    status: "delivered" as const,
    progress: 100,
  },
  {
    id: "ORD002",
    date: "2025-01-20",
    status: "shipped" as const,
    progress: 66,
  },
];

// Code snippets for each step
const CODE_SNIPPETS: Record<StepId, string> = {
  avatar: `<button className="rounded-full border">
  <img
    src={user.avatar}
    alt="Avatar"
    className="rounded-full"
    width={48}
    height={48}
  />
</button>`,
  popover: `import { Popover, PopoverTrigger, PopoverContent }
  from "@/components/ui/popover";

<Popover>
  <PopoverTrigger asChild>
    {/* Avatar button */}
  </PopoverTrigger>
  <PopoverContent sideOffset={8}>
    {/* Popover content */}
  </PopoverContent>
</Popover>`,
  buttons: `const [activeSection, setActiveSection] =
  useState<string | null>(null);

const handleClick = (section: string) => {
  setActiveSection(
    activeSection === section ? null : section
  );
};`,
  animation: `<motion.div
  initial={{ opacity: 0, height: 0 }}
  animate={{ opacity: 1, height: "auto" }}
  exit={{ opacity: 0, height: 0 }}
  transition={{
    type: "spring",
    duration: 0.25,
    bounce: 0  // No overshoot for professional feel
  }}
>`,
  blur: `initial={{
  opacity: 0,
  height: 0,
  filter: "blur(10px)"
}}
animate={{
  opacity: 1,
  height: "auto",
  filter: "blur(0px)"
}}`,
  progress: `<motion.div
  initial={{ width: 0 }}
  animate={{ width: \`\${progress}%\` }}
  transition={{
    type: "spring",
    stiffness: 300,
    damping: 30,
    duration: 0.4
  }}
/>`,
  complete: `// The complete component includes:
✓ Accessible Radix UI popover
✓ Spring animations with no bounce
✓ Blur transition effect
✓ Animated progress bars
✓ Reduced motion support
✓ Keyboard accessibility`,
};

export function InteractiveAvatarTutorial({
  className,
}: InteractiveAvatarTutorialProps) {
  const [currentStep, setCurrentStep] = useState<StepId>("avatar");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const stepRefs = useRef<Map<string, HTMLElement>>(new Map());
  const indicatorRef = useRef<HTMLDivElement>(null);

  // Get step index for comparison
  const stepIndex = STEPS.findIndex((s) => s.id === currentStep);

  // Determine what to show based on current step
  const showPopover = stepIndex >= 1;
  const showButtons = stepIndex >= 2;
  const showAnimation = stepIndex >= 3;
  const showBlur = stepIndex >= 4;
  const showProgress = stepIndex >= 5;

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

  const handleSectionClick = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const getStatusColor = (status: "processing" | "shipped" | "delivered") => {
    if (status === "processing") return "bg-blue-500";
    if (status === "shipped") return "bg-amber-500";
    return "bg-emerald-500";
  };

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
            {STEPS.map((step, idx) => (
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
                {step.id === "animation" && (
                  <p className="mt-3 text-muted-foreground text-sm">
                    <strong className="text-foreground">Why spring?</strong>{" "}
                    Springs feel more natural than linear timing.{" "}
                    <strong className="text-foreground">Why bounce: 0?</strong>{" "}
                    No overshoot keeps it professional.
                  </p>
                )}
                {step.id === "blur" && (
                  <p className="mt-3 text-muted-foreground text-sm">
                    The blur mimics how our eyes focus when something appears.
                  </p>
                )}
                {step.id === "progress" && (
                  <p className="mt-3 text-muted-foreground text-sm">
                    Higher stiffness = snappier. Longer duration lets users see
                    the progress.
                  </p>
                )}
                {step.id === "complete" && (
                  <p className="mt-3 text-muted-foreground text-sm">
                    <strong className="text-foreground">Try it!</strong> Click
                    the avatar and explore the sections.
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
            <div className="flex min-h-[450px] items-start justify-center bg-background p-8 pt-16">
              <Popover open={showPopover ? undefined : false}>
                <PopoverTrigger asChild>
                  <button
                    className="size-12 cursor-pointer overflow-hidden rounded-full border bg-background shadow-lg transition-transform hover:scale-105"
                    type="button"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt="User Avatar"
                      className="size-full object-cover"
                      height={48}
                      src={mockUser.avatar}
                      width={48}
                    />
                  </button>
                </PopoverTrigger>
                {showPopover && (
                  <PopoverContent
                    className="z-50 w-64 overflow-hidden rounded-xl border bg-background p-0 shadow-xl"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    sideOffset={8}
                  >
                    <motion.div
                      animate={
                        showAnimation && !shouldReduceMotion
                          ? { height: "auto" }
                          : {}
                      }
                      initial={
                        showAnimation && !shouldReduceMotion
                          ? { height: "auto" }
                          : {}
                      }
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : { type: "spring", duration: 0.25, bounce: 0 }
                      }
                    >
                      <div className="flex flex-col divide-y divide-border">
                        {showButtons && (
                          <>
                            <button
                              className={cn(
                                "flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 font-medium text-sm transition-colors",
                                activeSection === "profile"
                                  ? "bg-primary text-primary-foreground"
                                  : "text-foreground hover:bg-muted"
                              )}
                              onClick={() => handleSectionClick("profile")}
                              type="button"
                            >
                              <User className="shrink-0" size={16} />
                              Edit Profile
                            </button>
                            <AnimatePresence initial={false}>
                              {activeSection === "profile" && showAnimation && (
                                <motion.div
                                  animate={
                                    shouldReduceMotion
                                      ? { opacity: 1, height: "auto" }
                                      : {
                                          opacity: 1,
                                          height: "auto",
                                          filter: showBlur
                                            ? "blur(0px)"
                                            : undefined,
                                        }
                                  }
                                  exit={
                                    shouldReduceMotion
                                      ? {
                                          opacity: 0,
                                          height: 0,
                                          transition: { duration: 0 },
                                        }
                                      : {
                                          opacity: 0,
                                          height: 0,
                                          filter: showBlur
                                            ? "blur(10px)"
                                            : undefined,
                                        }
                                  }
                                  initial={
                                    shouldReduceMotion
                                      ? { opacity: 0, height: 0 }
                                      : {
                                          opacity: 0,
                                          height: 0,
                                          filter: showBlur
                                            ? "blur(10px)"
                                            : undefined,
                                        }
                                  }
                                  transition={
                                    shouldReduceMotion
                                      ? { duration: 0 }
                                      : {
                                          type: "spring",
                                          duration: 0.25,
                                          bounce: 0,
                                        }
                                  }
                                >
                                  <div className="flex flex-col gap-3 p-4">
                                    <div className="flex flex-col gap-1.5">
                                      <label className="font-medium text-muted-foreground text-xs">
                                        Name
                                      </label>
                                      <input
                                        className="rounded-md border border-border bg-background px-3 py-2 text-foreground text-sm"
                                        defaultValue={mockUser.name}
                                        type="text"
                                      />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                      <label className="font-medium text-muted-foreground text-xs">
                                        Email
                                      </label>
                                      <input
                                        className="rounded-md border border-border bg-background px-3 py-2 text-foreground text-sm"
                                        defaultValue={mockUser.email}
                                        type="email"
                                      />
                                    </div>
                                    <button
                                      className="mt-2 rounded-md bg-brand px-4 py-2.5 font-semibold text-sm text-white"
                                      type="button"
                                    >
                                      Save Changes
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                            <button
                              className={cn(
                                "flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 font-medium text-sm transition-colors",
                                activeSection === "orders"
                                  ? "bg-primary text-primary-foreground"
                                  : "text-foreground hover:bg-muted"
                              )}
                              onClick={() => handleSectionClick("orders")}
                              type="button"
                            >
                              <Package className="shrink-0" size={16} />
                              Last Orders
                            </button>
                            <AnimatePresence initial={false}>
                              {activeSection === "orders" && showAnimation && (
                                <motion.div
                                  animate={
                                    shouldReduceMotion
                                      ? { opacity: 1, height: "auto" }
                                      : {
                                          opacity: 1,
                                          height: "auto",
                                          filter: showBlur
                                            ? "blur(0px)"
                                            : undefined,
                                        }
                                  }
                                  exit={
                                    shouldReduceMotion
                                      ? {
                                          opacity: 0,
                                          height: 0,
                                          transition: { duration: 0 },
                                        }
                                      : {
                                          opacity: 0,
                                          height: 0,
                                          filter: showBlur
                                            ? "blur(10px)"
                                            : undefined,
                                        }
                                  }
                                  initial={
                                    shouldReduceMotion
                                      ? { opacity: 0, height: 0 }
                                      : {
                                          opacity: 0,
                                          height: 0,
                                          filter: showBlur
                                            ? "blur(10px)"
                                            : undefined,
                                        }
                                  }
                                  transition={
                                    shouldReduceMotion
                                      ? { duration: 0 }
                                      : {
                                          type: "spring",
                                          duration: 0.25,
                                          bounce: 0,
                                        }
                                  }
                                >
                                  <div className="flex flex-col gap-3 p-4">
                                    {mockOrders.map((order) => (
                                      <div
                                        className="flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-3"
                                        key={order.id}
                                      >
                                        <div className="flex items-center justify-between">
                                          <div className="font-semibold text-sm">
                                            {order.id}
                                          </div>
                                          <div className="text-muted-foreground text-xs">
                                            {order.date}
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                          <div className="flex-1 space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                              <span className="font-medium capitalize">
                                                {order.status}
                                              </span>
                                              <span className="text-muted-foreground">
                                                {order.progress}%
                                              </span>
                                            </div>
                                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                              {showProgress ? (
                                                <motion.div
                                                  animate={
                                                    shouldReduceMotion
                                                      ? {}
                                                      : {
                                                          width: `${order.progress}%`,
                                                        }
                                                  }
                                                  className={`h-full rounded-full ${getStatusColor(order.status)}`}
                                                  initial={
                                                    shouldReduceMotion
                                                      ? {}
                                                      : { width: 0 }
                                                  }
                                                  transition={
                                                    shouldReduceMotion
                                                      ? { duration: 0 }
                                                      : {
                                                          type: "spring",
                                                          stiffness: 300,
                                                          damping: 30,
                                                          duration: 0.4,
                                                        }
                                                  }
                                                />
                                              ) : (
                                                <div
                                                  className={`h-full rounded-full ${getStatusColor(order.status)}`}
                                                  style={{
                                                    width: `${order.progress}%`,
                                                  }}
                                                />
                                              )}
                                            </div>
                                          </div>
                                          <button
                                            className="flex shrink-0 items-center justify-center rounded-md border bg-background p-2"
                                            type="button"
                                          >
                                            <Eye
                                              className="text-muted-foreground"
                                              size={16}
                                            />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        )}
                        {!showButtons && (
                          <div className="p-4 text-center text-muted-foreground text-sm">
                            Popover content will appear here
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </PopoverContent>
                )}
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
