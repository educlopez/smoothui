import { motion, useReducedMotion } from "motion/react";

export interface AnimatedProgressBarProps {
  barClassName?: string;
  className?: string;
  color?: string;
  label?: string;
  labelClassName?: string;
  value: number; // 0-100
  /**
   * To replay the animation, change the React 'key' prop on this component from the parent.
   */
}

const MIN_PROGRESS_VALUE = 0;
const MAX_PROGRESS_VALUE = 100;

const SPRING = {
  damping: 10,
  duration: 0.25,
  mass: 0.75,
  stiffness: 100,
  type: "spring" as const,
};

export default function AnimatedProgressBar({
  value,
  label,
  color = "#6366f1",
  className = "",
  barClassName = "",
  labelClassName = "",
}: AnimatedProgressBarProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`w-full ${className}`}>
      {label ? (
        <div className={`mb-1 font-medium text-sm ${labelClassName}`}>
          {label}
        </div>
      ) : null}
      <div className="relative h-3 w-full overflow-hidden rounded border bg-background">
        <motion.div
          animate={{
            width: `${Math.max(MIN_PROGRESS_VALUE, Math.min(MAX_PROGRESS_VALUE, value))}%`,
          }}
          className={`h-full rounded bg-background ${barClassName}`}
          initial={{ width: MIN_PROGRESS_VALUE }}
          style={{ backgroundColor: color }}
          transition={shouldReduceMotion ? { duration: 0 } : SPRING}
        />
      </div>
    </div>
  );
}
