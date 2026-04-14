"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ReactNode, useCallback, useId, useState } from "react";

export interface StepItem {
  content?: ReactNode;
  description?: string;
  icon?: ReactNode;
  label: string;
}

export interface AnimatedStepperProps {
  allowClickNavigation?: boolean;
  className?: string;
  currentStep?: number;
  defaultStep?: number;
  onStepChange?: (step: number) => void;
  steps: StepItem[];
  variant?: "horizontal" | "vertical";
}

/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD
 *
 *    0ms   stepper enters viewport
 *  100ms   step circles stagger in (50ms each)
 *  click   active ring pulse + circle scale bounce
 *  step    progress line fills with spring
 *  done    checkmark draws with pathLength animation
 *  slide   content slides directionally with crossfade
 * ───────────────────────────────────────────────────────── */

const SPRING = {
  type: "spring" as const,
  duration: 0.25,
  bounce: 0.1,
};

const SPRING_BOUNCY = {
  type: "spring" as const,
  duration: 0.3,
  bounce: 0.2,
};

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      viewBox="0 0 24 24"
    >
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AnimatedStepper({
  steps,
  currentStep: controlledStep,
  defaultStep = 0,
  onStepChange,
  variant = "horizontal",
  allowClickNavigation = false,
  className,
}: AnimatedStepperProps) {
  const shouldReduceMotion = useReducedMotion();
  const id = useId();

  const [internalStep, setInternalStep] = useState(defaultStep);
  const [direction, setDirection] = useState(1);

  const isControlled = controlledStep !== undefined;
  const activeStep = isControlled ? controlledStep : internalStep;

  const handleStepChange = useCallback(
    (step: number) => {
      if (step < 0 || step >= steps.length) {
        return;
      }
      setDirection(step > activeStep ? 1 : -1);
      if (!isControlled) {
        setInternalStep(step);
      }
      onStepChange?.(step);
    },
    [isControlled, onStepChange, activeStep, steps.length]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!allowClickNavigation) {
        return;
      }
      const isHoriz = variant === "horizontal";
      const nextKey = isHoriz ? "ArrowRight" : "ArrowDown";
      const prevKey = isHoriz ? "ArrowLeft" : "ArrowUp";

      if (event.key === nextKey) {
        event.preventDefault();
        handleStepChange(Math.min(activeStep + 1, steps.length - 1));
      } else if (event.key === prevKey) {
        event.preventDefault();
        handleStepChange(Math.max(activeStep - 1, 0));
      }
    },
    [allowClickNavigation, variant, activeStep, steps.length, handleStepChange]
  );

  const progress = steps.length > 1 ? activeStep / (steps.length - 1) : 0;
  const isHorizontal = variant === "horizontal";

  return (
    <div
      className={cn(
        "flex w-full gap-6",
        isHorizontal ? "flex-col" : "flex-row",
        className
      )}
    >
      <div
        aria-label="Progress steps"
        className={cn(
          "relative flex",
          isHorizontal
            ? "flex-row items-center justify-between"
            : "flex-col items-start gap-2"
        )}
        role="group"
      >
        {steps.map((step, index) => {
          const isActive = index === activeStep;
          const isCompleted = index < activeStep;

          return (
            <div
              className={cn(
                "relative z-10 flex items-center",
                isHorizontal ? "flex-1" : "gap-3",
                index < steps.length - 1 && isHorizontal && "flex-1"
              )}
              key={`${id}-step-${step.label}`}
            >
              <motion.button
                animate={shouldReduceMotion ? undefined : { scale: 1 }}
                aria-label={`Step ${index + 1}: ${step.label}${isCompleted ? ", completed" : ""}${isActive ? ", current" : ""}`}
                aria-selected={isActive}
                className={cn(
                  "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-medium text-sm",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  isActive &&
                    "border-primary bg-primary text-primary-foreground",
                  isCompleted &&
                    "border-primary bg-primary text-primary-foreground",
                  !(isActive || isCompleted) &&
                    "border-muted-foreground/30 bg-background text-muted-foreground",
                  allowClickNavigation ? "cursor-pointer" : "cursor-default"
                )}
                disabled={!allowClickNavigation}
                id={`${id}-step-${index}`}
                onClick={() => allowClickNavigation && handleStepChange(index)}
                onKeyDown={handleKeyDown}
                role="tab"
                tabIndex={isActive ? 0 : -1}
                transition={shouldReduceMotion ? { duration: 0 } : SPRING}
                type="button"
                whileTap={
                  allowClickNavigation && !shouldReduceMotion
                    ? { scale: 0.9 }
                    : undefined
                }
              >
                {/* Active ring pulse */}
                {isActive && !shouldReduceMotion && (
                  <motion.span
                    animate={{ opacity: 0, scale: 1.6 }}
                    className="absolute inset-0 rounded-full border-2 border-primary"
                    initial={{ opacity: 0.5, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                  />
                )}

                <AnimatePresence initial={false} mode="wait">
                  {isCompleted ? (
                    <motion.span
                      animate={
                        shouldReduceMotion
                          ? { opacity: 1 }
                          : { opacity: 1, scale: 1 }
                      }
                      exit={
                        shouldReduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, scale: 0.5 }
                      }
                      initial={
                        shouldReduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, scale: 0.5 }
                      }
                      key="check"
                      transition={
                        shouldReduceMotion ? { duration: 0 } : SPRING_BOUNCY
                      }
                    >
                      <CheckIcon />
                    </motion.span>
                  ) : step.icon ? (
                    <motion.span
                      animate={
                        shouldReduceMotion
                          ? { opacity: 1 }
                          : { opacity: 1, scale: 1 }
                      }
                      exit={
                        shouldReduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, scale: 0.8 }
                      }
                      initial={
                        shouldReduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, scale: 0.8 }
                      }
                      key="icon"
                      transition={shouldReduceMotion ? { duration: 0 } : SPRING}
                    >
                      {step.icon}
                    </motion.span>
                  ) : (
                    <motion.span
                      animate={
                        shouldReduceMotion
                          ? { opacity: 1 }
                          : { opacity: 1, scale: 1 }
                      }
                      exit={
                        shouldReduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, scale: 0.8 }
                      }
                      initial={
                        shouldReduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, scale: 0.8 }
                      }
                      key="number"
                      transition={shouldReduceMotion ? { duration: 0 } : SPRING}
                    >
                      {index + 1}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {isHorizontal && (
                <div className="ml-2 hidden sm:block">
                  <p
                    className={cn(
                      "font-medium text-sm transition-colors duration-200",
                      isActive ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-muted-foreground text-xs">
                      {step.description}
                    </p>
                  )}
                </div>
              )}

              {!isHorizontal && (
                <div>
                  <p
                    className={cn(
                      "font-medium text-sm transition-colors duration-200",
                      isActive ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-muted-foreground text-xs">
                      {step.description}
                    </p>
                  )}
                </div>
              )}

              {isHorizontal && index < steps.length - 1 && (
                <div className="mx-2 h-0.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    animate={{ width: index < activeStep ? "100%" : "0%" }}
                    className="h-full bg-primary"
                    transition={shouldReduceMotion ? { duration: 0 } : SPRING}
                  />
                </div>
              )}
            </div>
          );
        })}

        {!isHorizontal && (
          <div className="absolute top-5 left-5 h-[calc(100%-2.5rem)] w-0.5 -translate-x-1/2 overflow-hidden bg-muted">
            <motion.div
              animate={{ height: `${progress * 100}%` }}
              className="w-full bg-primary"
              transition={shouldReduceMotion ? { duration: 0 } : SPRING}
            />
          </div>
        )}
      </div>

      <div aria-label={`Step ${activeStep + 1} content`} role="tabpanel">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0, transition: { duration: 0 } }
                : { opacity: 0, x: -direction * 20 }
            }
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, x: direction * 20 }
            }
            key={activeStep}
            transition={shouldReduceMotion ? { duration: 0 } : SPRING}
          >
            {steps[activeStep]?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
