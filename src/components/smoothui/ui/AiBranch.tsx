"use client"

import type { HTMLAttributes, ReactElement, ReactNode } from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Clock,
  Copy,
  MessageSquare,
  Pencil,
} from "lucide-react"
import { motion } from "motion/react"

import { cn } from "@/components/smoothui/utils/cn"

type AIBranchContextType = {
  currentBranch: number
  totalBranches: number
  goToPrevious: () => void
  goToNext: () => void
  branches: ReactElement[]
  setBranches: (branches: ReactElement[]) => void
}

const AIBranchContext = createContext<AIBranchContextType | null>(null)

const useAIBranch = () => {
  const context = useContext(AIBranchContext)
  if (!context) {
    throw new Error("AIBranch components must be used within AIBranch")
  }
  return context
}

export type AIBranchProps = HTMLAttributes<HTMLDivElement> & {
  defaultBranch?: number
  onBranchChange?: (branchIndex: number) => void
}

export const AIBranch = ({
  defaultBranch = 0,
  onBranchChange,
  className,
  ...props
}: AIBranchProps) => {
  const [currentBranch, setCurrentBranch] = useState(defaultBranch)
  const [branches, setBranches] = useState<ReactElement[]>([])

  const handleBranchChange = (newBranch: number) => {
    setCurrentBranch(newBranch)
    onBranchChange?.(newBranch)
  }

  const goToPrevious = () => {
    const newBranch =
      currentBranch > 0 ? currentBranch - 1 : branches.length - 1
    handleBranchChange(newBranch)
  }

  const goToNext = () => {
    const newBranch =
      currentBranch < branches.length - 1 ? currentBranch + 1 : 0
    handleBranchChange(newBranch)
  }

  const contextValue: AIBranchContextType = {
    currentBranch,
    totalBranches: branches.length,
    goToPrevious,
    goToNext,
    branches,
    setBranches,
  }

  return (
    <AIBranchContext.Provider value={contextValue}>
      <div
        className={cn("grid w-full gap-2 [&>div]:pb-0", className)}
        {...props}
      />
    </AIBranchContext.Provider>
  )
}

export type AIBranchMessagesProps = {
  children: ReactElement | ReactElement[]
}

export const AIBranchMessages = ({ children }: AIBranchMessagesProps) => {
  const { currentBranch, setBranches, branches } = useAIBranch()
  const childrenArray = useMemo(
    () => (Array.isArray(children) ? children : [children]),
    [children]
  )

  // Use useEffect to update branches when they change
  useEffect(() => {
    if (branches.length !== childrenArray.length) {
      setBranches(childrenArray)
    }
  }, [childrenArray, branches, setBranches])

  return childrenArray.map((branch, index) => (
    <motion.div
      key={`branch-${index}-${currentBranch}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: index === currentBranch ? 1 : 0,
        y: index === currentBranch ? 0 : 10,
        display: index === currentBranch ? "block" : "none",
      }}
      transition={{
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className={cn(
        "grid gap-2 [&>div]:pb-0",
        index === currentBranch ? "block" : "hidden"
      )}
    >
      {branch}
    </motion.div>
  ))
}

export type AIBranchSelectorProps = HTMLAttributes<HTMLDivElement> & {
  from: "user" | "assistant"
}

export const AIBranchSelector = ({
  className,
  from,
  ...props
}: AIBranchSelectorProps) => {
  const { totalBranches } = useAIBranch()

  // Don't render if there's only one branch
  if (totalBranches <= 1) {
    return null
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 self-end px-10",
        from === "assistant" ? "justify-start" : "justify-end",
        className
      )}
      {...props}
    />
  )
}

export type AIBranchPreviousProps = {
  className?: string
  children?: ReactNode
}

export const AIBranchPrevious = ({
  className,
  children,
}: AIBranchPreviousProps) => {
  const { goToPrevious, totalBranches } = useAIBranch()

  return (
    <motion.button
      aria-label="Previous branch"
      className={cn(
        "text-muted-foreground size-7 shrink-0 rounded-full transition-colors",
        "hover:bg-accent hover:text-foreground",
        "disabled:pointer-events-none disabled:opacity-50",
        "flex items-center justify-center",
        className
      )}
      disabled={totalBranches <= 1}
      onClick={goToPrevious}
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {children ?? <ChevronLeftIcon size={14} />}
    </motion.button>
  )
}

export type AIBranchNextProps = {
  className?: string
  children?: ReactNode
}

export const AIBranchNext = ({ className, children }: AIBranchNextProps) => {
  const { goToNext, totalBranches } = useAIBranch()

  return (
    <motion.button
      aria-label="Next branch"
      className={cn(
        "text-muted-foreground size-7 shrink-0 rounded-full transition-colors",
        "hover:bg-accent hover:text-foreground",
        "disabled:pointer-events-none disabled:opacity-50",
        "flex items-center justify-center",
        className
      )}
      disabled={totalBranches <= 1}
      onClick={goToNext}
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {children ?? <ChevronRightIcon size={14} />}
    </motion.button>
  )
}

export type AIBranchPageProps = {
  className?: string
}

export const AIBranchPage = ({ className }: AIBranchPageProps) => {
  const { currentBranch, totalBranches } = useAIBranch()

  return (
    <span
      className={cn(
        "text-muted-foreground text-xs font-medium tabular-nums",
        className
      )}
    >
      {currentBranch + 1} of {totalBranches}
    </span>
  )
}

// Updated interface for conversation branches
export interface AIBranchData {
  id: string
  userMessage: string
  aiResponse: string
  timestamp: Date
  isActive: boolean
}

// Export the type alias for backward compatibility
export type AIBranch = AIBranchData

interface LegacyAiBranchProps {
  branches: AIBranchData[]
  onBranchSelect: (branchId: string) => void
  className?: string
}

// Updated legacy component to show conversation branches
export function LegacyAiBranch({
  branches,
  onBranchSelect,
  className,
}: LegacyAiBranchProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentBranchIndex, setCurrentBranchIndex] = useState(() =>
    branches.findIndex((branch) => branch.isActive)
  )

  const activeBranch = branches[currentBranchIndex]
  const inactiveBranches = branches.filter(
    (_, index) => index !== currentBranchIndex
  )

  const goToPrevious = () => {
    const newIndex =
      currentBranchIndex > 0 ? currentBranchIndex - 1 : branches.length - 1
    setCurrentBranchIndex(newIndex)
    onBranchSelect(branches[newIndex].id)
  }

  const goToNext = () => {
    const newIndex =
      currentBranchIndex < branches.length - 1 ? currentBranchIndex + 1 : 0
    setCurrentBranchIndex(newIndex)
    onBranchSelect(branches[newIndex].id)
  }

  return (
    <div className={cn("w-full max-w-2xl", className)}>
      {/* Active Branch Display */}
      {activeBranch && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          className="mb-4 space-y-4"
        >
          {/* User Message with Branch Navigation */}
          <div className="flex justify-end">
            <div className="flex flex-col items-end gap-2">
              <div className="bg-brand max-w-full rounded-lg p-3 text-white">
                <p className="text-sm">{activeBranch.userMessage}</p>
              </div>

              {/* Branch Navigation Controls */}
              {branches.length > 1 && (
                <div className="flex items-center gap-1">
                  <motion.button
                    aria-label="Copy message"
                    className={cn(
                      "text-foreground/70 size-6 shrink-0 rounded transition-colors",
                      "hover:bg-accent hover:text-white",
                      "flex items-center justify-center"
                    )}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <Copy className="h-3 w-3" />
                  </motion.button>

                  <motion.button
                    aria-label="Edit message"
                    className={cn(
                      "text-foreground/70 size-6 shrink-0 rounded transition-colors",
                      "hover:bg-accent hover:text-white",
                      "flex items-center justify-center"
                    )}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <Pencil className="h-3 w-3" />
                  </motion.button>

                  <motion.button
                    aria-label="Previous branch"
                    className={cn(
                      "text-foreground/70 size-6 shrink-0 rounded transition-colors",
                      "hover:bg-accent hover:text-white",
                      "disabled:pointer-events-none disabled:opacity-50",
                      "flex items-center justify-center"
                    )}
                    disabled={branches.length <= 1}
                    onClick={goToPrevious}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <ChevronLeftIcon size={12} />
                  </motion.button>

                  <span className="text-foreground/70 text-xs font-medium tabular-nums">
                    {currentBranchIndex + 1}/{branches.length}
                  </span>

                  <motion.button
                    aria-label="Next branch"
                    className={cn(
                      "text-foreground/70 size-6 shrink-0 rounded transition-colors",
                      "hover:bg-accent hover:text-white",
                      "disabled:pointer-events-none disabled:opacity-50",
                      "flex items-center justify-center"
                    )}
                    disabled={branches.length <= 1}
                    onClick={goToNext}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <ChevronRightIcon size={12} />
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          {/* AI Response */}
          <div className="flex justify-start">
            <div className="border-brand/30 bg-brand/10 max-w-[80%] rounded-lg border p-3">
              <p className="text-sm text-gray-900 dark:text-gray-100">
                {activeBranch.aiResponse}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Export the legacy component as the default for backward compatibility
export { LegacyAiBranch as AiBranch }
