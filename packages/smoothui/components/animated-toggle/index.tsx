"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useState,
} from "react";

export type AnimatedToggleProps = {
  /** Controlled checked state */
  checked?: boolean;
  /** Default checked state for uncontrolled mode */
  defaultChecked?: boolean;
  /** Callback when checked state changes */
  onChange?: (checked: boolean) => void;
  /** Visual variant of the toggle */
  variant?: "default" | "morph" | "icon";
  /** Icons for on/off states (only used with icon variant) */
  icons?: { on: ReactNode; off: ReactNode };
  /** Size of the toggle */
  size?: "sm" | "md" | "lg";
  /** Whether the toggle is disabled */
  disabled?: boolean;
  /** Accessible label for the toggle */
  label?: string;
  /** Additional CSS classes */
  className?: string;
};

const SPRING = {
  type: "spring" as const,
  duration: 0.25,
  bounce: 0.1,
};

const SIZES = {
  sm: {
    track: "w-9 h-5",
    thumb: "size-4",
    thumbTranslate: 16,
    icon: "size-2.5",
  },
  md: {
    track: "w-11 h-6",
    thumb: "size-5",
    thumbTranslate: 20,
    icon: "size-3",
  },
  lg: {
    track: "w-[52px] h-7",
    thumb: "size-6",
    thumbTranslate: 24,
    icon: "size-3.5",
  },
};

const AnimatedToggle = ({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  variant = "default",
  icons,
  size = "md",
  disabled = false,
  label,
  className,
}: AnimatedToggleProps) => {
  const shouldReduceMotion = useReducedMotion();

  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;

  const handleToggle = useCallback(() => {
    if (disabled) return;

    const newValue = !checked;
    if (!isControlled) {
      setInternalChecked(newValue);
    }
    onChange?.(newValue);
  }, [checked, disabled, isControlled, onChange]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        handleToggle();
      }
    },
    [handleToggle]
  );

  const sizeConfig = SIZES[size];

  const getThumbBorderRadius = () => {
    if (variant !== "morph" || shouldReduceMotion) {
      return 9999;
    }
    return checked ? 9999 : 6;
  };

  const getThumbTransform = () => {
    const translateX = checked ? sizeConfig.thumbTranslate : 0;
    return translateX;
  };

  return (
    <button
      aria-checked={checked}
      aria-label={label}
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        checked ? "bg-primary" : "bg-muted",
        disabled && "cursor-not-allowed opacity-50",
        sizeConfig.track,
        className
      )}
      disabled={disabled}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      role="switch"
      type="button"
    >
      <motion.span
        animate={
          shouldReduceMotion
            ? {
                x: getThumbTransform(),
              }
            : {
                x: getThumbTransform(),
                borderRadius: getThumbBorderRadius(),
              }
        }
        className={cn(
          "pointer-events-none flex items-center justify-center bg-background shadow-sm",
          sizeConfig.thumb
        )}
        initial={false}
        style={{
          borderRadius: getThumbBorderRadius(),
        }}
        transition={shouldReduceMotion ? { duration: 0 } : SPRING}
      >
        {variant === "icon" && icons && (
          <AnimatePresence initial={false} mode="wait">
            <motion.span
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, scale: 1, rotate: 0 }
              }
              className={cn(
                "flex items-center justify-center text-muted-foreground",
                sizeConfig.icon
              )}
              exit={
                shouldReduceMotion
                  ? { opacity: 0, transition: { duration: 0 } }
                  : { opacity: 0, scale: 0.5, rotate: -90 }
              }
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.5, rotate: 90 }
              }
              key={checked ? "on" : "off"}
              transition={shouldReduceMotion ? { duration: 0 } : SPRING}
            >
              {checked ? icons.on : icons.off}
            </motion.span>
          </AnimatePresence>
        )}
      </motion.span>
    </button>
  );
};

export default AnimatedToggle;
