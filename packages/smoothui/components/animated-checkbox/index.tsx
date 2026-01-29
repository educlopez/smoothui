"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { type ReactNode, useCallback, useId, useState } from "react";

export type AnimatedCheckboxProps = {
  /** Controlled checked state */
  checked?: boolean;
  /** Default checked state for uncontrolled mode */
  defaultChecked?: boolean;
  /** Callback when checked state changes */
  onChange?: (checked: boolean) => void;
  /** Animation variant */
  variant?: "draw" | "pop" | "morph";
  /** Size of the checkbox */
  size?: "sm" | "md" | "lg";
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** Indeterminate state (overrides checked visual) */
  indeterminate?: boolean;
  /** Label content */
  label?: ReactNode;
  /** Additional CSS classes */
  className?: string;
};

const SIZES = {
  sm: { box: 16, stroke: 1.5 },
  md: { box: 20, stroke: 2 },
  lg: { box: 24, stroke: 2.5 },
};

// Animation timing constants
const DRAW_DURATION = 0.2;
const POP_DURATION = 0.25;
const POP_BOUNCE = 0.15;
const MORPH_DURATION = 0.15;
const MORPH_DELAY = 0.1;

// Path coordinate multipliers
const PATH_START = 0.2;
const PATH_MID_X = 0.4;
const PATH_MID_Y_TOP = 0.3;
const PATH_MID_Y = 0.5;
const PATH_MID_Y_BOTTOM = 0.7;
const PATH_END = 0.8;
const INDENT_START = 0.25;
const INDENT_END = 0.75;

type AnimationConfig = {
  initial: Record<string, number>;
  animate: Record<string, number>;
  transition: Record<string, unknown>;
};

const getReducedMotionAnimation = (isActive: boolean): AnimationConfig => ({
  initial: { opacity: isActive ? 1 : 0 },
  animate: { opacity: isActive ? 1 : 0 },
  transition: { duration: 0 },
});

const getDrawAnimation = (isActive: boolean): AnimationConfig => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: {
    pathLength: isActive ? 1 : 0,
    opacity: isActive ? 1 : 0,
  },
  transition: { duration: DRAW_DURATION, ease: "easeOut" },
});

const getPopAnimation = (isActive: boolean): AnimationConfig => ({
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: isActive ? 1 : 0,
    opacity: isActive ? 1 : 0,
  },
  transition: {
    type: "spring",
    duration: POP_DURATION,
    bounce: POP_BOUNCE,
  },
});

const getMorphCheckAnimation = (isActive: boolean): AnimationConfig => ({
  initial: { opacity: 0 },
  animate: { opacity: isActive ? 1 : 0 },
  transition: {
    duration: MORPH_DURATION,
    delay: isActive ? MORPH_DELAY : 0,
  },
});

const getDefaultAnimation = (isActive: boolean): AnimationConfig => ({
  initial: { opacity: 0 },
  animate: { opacity: isActive ? 1 : 0 },
  transition: { duration: DRAW_DURATION },
});

const buildCheckPath = (boxSize: number, isIndeterminate: boolean): string => {
  if (isIndeterminate) {
    const startX = boxSize * INDENT_START;
    const endX = boxSize * INDENT_END;
    const midY = boxSize * PATH_MID_Y;
    return `M${startX} ${midY} L${endX} ${midY}`;
  }

  const x1 = boxSize * PATH_START;
  const y1 = boxSize * PATH_MID_Y;
  const x2 = boxSize * PATH_MID_X;
  const y2 = boxSize * PATH_MID_Y_BOTTOM;
  const x3 = boxSize * PATH_END;
  const y3 = boxSize * PATH_MID_Y_TOP;

  return `M${x1} ${y1} L${x2} ${y2} L${x3} ${y3}`;
};

const AnimatedCheckbox = ({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  variant = "draw",
  size = "md",
  disabled = false,
  indeterminate = false,
  label,
  className,
}: AnimatedCheckboxProps) => {
  const shouldReduceMotion = useReducedMotion();
  const id = useId();

  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;

  const handleChange = useCallback(() => {
    if (disabled) {
      return;
    }

    const newValue = !checked;
    if (!isControlled) {
      setInternalChecked(newValue);
    }
    onChange?.(newValue);
  }, [checked, disabled, isControlled, onChange]);

  const sizeConfig = SIZES[size];
  const isCheckedOrIndeterminate = checked || indeterminate;

  const getCheckAnimation = (): AnimationConfig => {
    if (shouldReduceMotion) {
      return getReducedMotionAnimation(isCheckedOrIndeterminate);
    }

    switch (variant) {
      case "draw":
        return getDrawAnimation(isCheckedOrIndeterminate);
      case "pop":
        return getPopAnimation(isCheckedOrIndeterminate);
      case "morph":
        return getMorphCheckAnimation(isCheckedOrIndeterminate);
      default:
        return getDefaultAnimation(isCheckedOrIndeterminate);
    }
  };

  const getBackgroundAnimation = () => {
    if (shouldReduceMotion || variant !== "morph") {
      return {
        initial: { scale: 1 },
        animate: { scale: 1 },
        transition: { duration: 0 },
      };
    }

    return {
      initial: { scale: 0 },
      animate: { scale: isCheckedOrIndeterminate ? 1 : 0 },
      transition: { duration: MORPH_DURATION, ease: "easeOut" },
    };
  };

  const checkAnimation = getCheckAnimation();
  const backgroundAnimation = getBackgroundAnimation();
  const checkPath = buildCheckPath(sizeConfig.box, indeterminate);

  return (
    <label
      className={cn(
        "inline-flex cursor-pointer items-center gap-2",
        "rounded focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      htmlFor={id}
    >
      <input
        aria-checked={indeterminate ? "mixed" : checked}
        checked={checked}
        className="sr-only"
        disabled={disabled}
        id={id}
        onChange={handleChange}
        type="checkbox"
      />
      <span
        className="relative inline-flex items-center justify-center"
        style={{ width: sizeConfig.box, height: sizeConfig.box }}
      >
        {/* Border box */}
        <span
          className={cn(
            "absolute inset-0 rounded-sm border-2 transition-colors",
            isCheckedOrIndeterminate
              ? "border-primary bg-transparent"
              : "border-muted-foreground/40 bg-transparent"
          )}
        />

        {/* Background fill for morph variant */}
        {variant === "morph" && (
          <motion.span
            animate={backgroundAnimation.animate}
            className="absolute inset-0 rounded-sm bg-primary"
            initial={backgroundAnimation.initial}
            style={{ originX: 0.5, originY: 0.5 }}
            transition={backgroundAnimation.transition}
          />
        )}

        {/* Background fill for non-morph variants */}
        {variant !== "morph" && isCheckedOrIndeterminate && (
          <span className="absolute inset-0 rounded-sm bg-primary" />
        )}

        {/* Check mark */}
        <svg
          aria-hidden="true"
          className="relative"
          fill="none"
          height={sizeConfig.box}
          viewBox={`0 0 ${sizeConfig.box} ${sizeConfig.box}`}
          width={sizeConfig.box}
        >
          <motion.path
            animate={checkAnimation.animate}
            className="text-primary-foreground"
            d={checkPath}
            initial={checkAnimation.initial}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={sizeConfig.stroke}
            transition={checkAnimation.transition}
          />
        </svg>
      </span>
      {label && <span className="select-none text-sm">{label}</span>}
    </label>
  );
};

export default AnimatedCheckbox;
