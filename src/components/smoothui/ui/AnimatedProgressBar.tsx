import { motion } from "motion/react"

export interface AnimatedProgressBarProps {
  value: number // 0-100
  label?: string
  color?: string
  className?: string
  barClassName?: string
  labelClassName?: string
  /**
   * To replay the animation, change the React 'key' prop on this component from the parent.
   */
}

const SPRING = {
  type: "spring",
  damping: 10,
  mass: 0.75,
  stiffness: 100,
}

export default function AnimatedProgressBar({
  value,
  label,
  color = "#6366f1",
  className = "",
  barClassName = "",
  labelClassName = "",
}: AnimatedProgressBarProps) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className={`mb-1 text-sm font-medium ${labelClassName}`}>
          {label}
        </div>
      )}
      <div className="relative h-3 w-full overflow-hidden rounded bg-gray-200 dark:bg-gray-800">
        <motion.div
          className={`bg-primary h-full rounded ${barClassName}`}
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(0, Math.min(100, value))}%` }}
          transition={SPRING}
        />
      </div>
    </div>
  )
}
