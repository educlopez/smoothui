import { cn } from "@/app/utils/cn"

interface BadgeBetaProps {
  className?: string
}

export default function BadgeBeta({ className }: BadgeBetaProps) {
  return (
    <span
      className={cn(
        "relative mt-[calc(3/16*1rem)] mr-auto inline-flex bg-pink-500/5 px-[0.1875rem] text-[0.625rem]/[0.875rem] font-medium text-pink-700 dark:bg-pink-500/10 dark:text-pink-400",
        className
      )}
    >
      Beta
      <span className="absolute inset-x-[-0.1875rem] -top-px block transform-gpu text-pink-700 dark:text-pink-400">
        <svg
          width="100%"
          height="1"
          stroke="currentColor"
          strokeDasharray="3.3 1"
          aria-hidden="true"
        >
          <line x1="0" y1="0.5" x2="100%" y2="0.5"></line>
        </svg>
      </span>
      <span className="absolute inset-x-[-0.1875rem] -bottom-px block transform-gpu text-pink-700 dark:text-pink-400">
        <svg
          width="100%"
          height="1"
          stroke="currentColor"
          strokeDasharray="3.3 1"
          aria-hidden="true"
        >
          <line x1="0" y1="0.5" x2="100%" y2="0.5"></line>
        </svg>
      </span>
      <span className="absolute inset-y-[-0.1875rem] -left-px block transform-gpu text-pink-700 dark:text-pink-400">
        <svg
          width="1"
          height="100%"
          stroke="currentColor"
          strokeDasharray="3.3 1"
          aria-hidden="true"
        >
          <line x1="0.5" y1="0" x2="0.5" y2="100%"></line>
        </svg>
      </span>
      <span className="absolute inset-y-[-0.1875rem] -right-px block transform-gpu text-pink-700 dark:text-pink-400">
        <svg
          width="1"
          height="100%"
          stroke="currentColor"
          strokeDasharray="3.3 1"
          aria-hidden="true"
        >
          <line x1="0.5" y1="0" x2="0.5" y2="100%"></line>
        </svg>
      </span>
    </span>
  )
}
