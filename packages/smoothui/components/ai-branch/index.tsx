"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon, Copy, Pencil } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { HTMLAttributes, ReactElement, ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type AIBranchContextType = {
  currentBranch: number;
  totalBranches: number;
  goToPrevious: () => void;
  goToNext: () => void;
  branches: ReactElement[];
  setBranches: (branches: ReactElement[]) => void;
};

const AIBranchContext = createContext<AIBranchContextType | null>(null);

const useAIBranch = () => {
  const context = useContext(AIBranchContext);
  if (!context) {
    throw new Error("AIBranch components must be used within AIBranch");
  }
  return context;
};

export type AIBranchProps = HTMLAttributes<HTMLDivElement> & {
  defaultBranch?: number;
  onBranchChange?: (branchIndex: number) => void;
};

export const AIBranch = ({
  defaultBranch = 0,
  onBranchChange,
  className,
  ...props
}: AIBranchProps) => {
  const [currentBranch, setCurrentBranch] = useState(defaultBranch);
  const [branches, setBranches] = useState<ReactElement[]>([]);

  const handleBranchChange = (newBranch: number) => {
    setCurrentBranch(newBranch);
    onBranchChange?.(newBranch);
  };

  const goToPrevious = () => {
    const newBranch =
      currentBranch > 0 ? currentBranch - 1 : branches.length - 1;
    handleBranchChange(newBranch);
  };

  const goToNext = () => {
    const newBranch =
      currentBranch < branches.length - 1 ? currentBranch + 1 : 0;
    handleBranchChange(newBranch);
  };

  const contextValue: AIBranchContextType = {
    currentBranch,
    totalBranches: branches.length,
    goToPrevious,
    goToNext,
    branches,
    setBranches,
  };

  return (
    <AIBranchContext.Provider value={contextValue}>
      <div
        className={cn("grid w-full gap-2 [&>div]:pb-0", className)}
        {...props}
      />
    </AIBranchContext.Provider>
  );
};

export type AIBranchMessagesProps = {
  children: ReactElement | ReactElement[];
};

export const AIBranchMessages = ({ children }: AIBranchMessagesProps) => {
  const { currentBranch, setBranches, branches } = useAIBranch();
  const shouldReduceMotion = useReducedMotion();
  const childrenArray = useMemo(
    () => (Array.isArray(children) ? children : [children]),
    [children]
  );

  // Use useEffect to update branches when they change
  useEffect(() => {
    if (branches.length !== childrenArray.length) {
      setBranches(childrenArray);
    }
  }, [childrenArray, branches, setBranches]);

  return childrenArray.map((branch, index) => (
    <motion.div
      animate={
        shouldReduceMotion
          ? { opacity: index === currentBranch ? 1 : 0 }
          : {
              opacity: index === currentBranch ? 1 : 0,
              y: index === currentBranch ? 0 : 10,
              display: index === currentBranch ? "block" : "none",
            }
      }
      className={cn(
        "grid gap-2 [&>div]:pb-0",
        index === currentBranch ? "block" : "hidden"
      )}
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
      key={`branch-${index}-${currentBranch}`}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : {
              duration: 0.25,
              type: "spring",
              stiffness: 300,
              damping: 30,
            }
      }
    >
      {branch}
    </motion.div>
  ));
};

export type AIBranchSelectorProps = HTMLAttributes<HTMLDivElement> & {
  from: "user" | "assistant";
};

export const AIBranchSelector = ({
  className,
  from,
  ...props
}: AIBranchSelectorProps) => {
  const { totalBranches } = useAIBranch();

  // Don't render if there's only one branch
  if (totalBranches <= 1) {
    return null;
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
  );
};

export type AIBranchPreviousProps = {
  className?: string;
  children?: ReactNode;
};

export const AIBranchPrevious = ({
  className,
  children,
}: AIBranchPreviousProps) => {
  const { goToPrevious, totalBranches } = useAIBranch();
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      aria-label="Previous branch"
      className={cn(
        "size-7 shrink-0 rounded-full text-muted-foreground transition-colors",
        "hover:bg-accent hover:text-foreground",
        "disabled:pointer-events-none disabled:opacity-50",
        "flex items-center justify-center",
        className
      )}
      disabled={totalBranches <= 1}
      onClick={goToPrevious}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 400, damping: 25, duration: 0.2 }
      }
      type="button"
      whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
    >
      {children ?? <ChevronLeftIcon size={14} />}
    </motion.button>
  );
};

export type AIBranchNextProps = {
  className?: string;
  children?: ReactNode;
};

export const AIBranchNext = ({ className, children }: AIBranchNextProps) => {
  const { goToNext, totalBranches } = useAIBranch();
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      aria-label="Next branch"
      className={cn(
        "size-7 shrink-0 rounded-full text-muted-foreground transition-colors",
        "hover:bg-accent hover:text-foreground",
        "disabled:pointer-events-none disabled:opacity-50",
        "flex items-center justify-center",
        className
      )}
      disabled={totalBranches <= 1}
      onClick={goToNext}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 400, damping: 25, duration: 0.2 }
      }
      type="button"
      whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
    >
      {children ?? <ChevronRightIcon size={14} />}
    </motion.button>
  );
};

export type AIBranchPageProps = {
  className?: string;
};

export const AIBranchPage = ({ className }: AIBranchPageProps) => {
  const { currentBranch, totalBranches } = useAIBranch();

  return (
    <span
      className={cn(
        "font-medium text-muted-foreground text-xs tabular-nums",
        className
      )}
    >
      {currentBranch + 1} of {totalBranches}
    </span>
  );
};

// Updated type for conversation branches
export type AIBranchData = {
  id: string;
  userMessage: string;
  aiResponse: string;
  timestamp: Date;
  isActive: boolean;
};

// Export the type alias for backward compatibility
export type AIBranch = AIBranchData;

type LegacyAiBranchProps = {
  branches: AIBranchData[];
  onBranchSelect: (branchId: string) => void;
  className?: string;
};

// Updated legacy component to show conversation branches
export function LegacyAiBranch({
  branches,
  onBranchSelect,
  className,
}: LegacyAiBranchProps) {
  const shouldReduceMotion = useReducedMotion();
  const [currentBranchIndex, setCurrentBranchIndex] = useState(() =>
    branches.findIndex((branch) => branch.isActive)
  );

  const activeBranch = branches[currentBranchIndex];

  const goToPrevious = () => {
    const newIndex =
      currentBranchIndex > 0 ? currentBranchIndex - 1 : branches.length - 1;
    setCurrentBranchIndex(newIndex);
    onBranchSelect(branches[newIndex].id);
  };

  const goToNext = () => {
    const newIndex =
      currentBranchIndex < branches.length - 1 ? currentBranchIndex + 1 : 0;
    setCurrentBranchIndex(newIndex);
    onBranchSelect(branches[newIndex].id);
  };

  return (
    <div className={cn("w-full max-w-2xl", className)}>
      {/* Active Branch Display */}
      {activeBranch && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 space-y-4"
          initial={{ opacity: 0, y: 10 }}
          transition={{
            duration: 0.3,
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        >
          {/* User Message with Branch Navigation */}
          <div className="flex justify-end">
            <div className="flex flex-col items-end gap-2">
              <div className="max-w-full rounded-lg bg-brand p-3 text-white">
                <p className="text-sm">{activeBranch.userMessage}</p>
              </div>

              {/* Branch Navigation Controls */}
              {branches.length > 1 && (
                <div className="flex items-center gap-1">
                  <motion.button
                    aria-label="Copy message"
                    className={cn(
                      "size-6 shrink-0 rounded text-foreground/70 transition-colors",
                      "hover:bg-accent hover:text-white",
                      "flex items-center justify-center"
                    )}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : {
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                            duration: 0.2,
                          }
                    }
                    type="button"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                  >
                    <Copy className="h-3 w-3" />
                  </motion.button>

                  <motion.button
                    aria-label="Edit message"
                    className={cn(
                      "size-6 shrink-0 rounded text-foreground/70 transition-colors",
                      "hover:bg-accent hover:text-white",
                      "flex items-center justify-center"
                    )}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : {
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                            duration: 0.2,
                          }
                    }
                    type="button"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                  >
                    <Pencil className="h-3 w-3" />
                  </motion.button>

                  <motion.button
                    aria-label="Previous branch"
                    className={cn(
                      "size-6 shrink-0 rounded text-foreground/70 transition-colors",
                      "hover:bg-accent hover:text-white",
                      "disabled:pointer-events-none disabled:opacity-50",
                      "flex items-center justify-center"
                    )}
                    disabled={branches.length <= 1}
                    onClick={goToPrevious}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : {
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                            duration: 0.2,
                          }
                    }
                    type="button"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                  >
                    <ChevronLeftIcon size={12} />
                  </motion.button>

                  <span className="font-medium text-foreground/70 text-xs tabular-nums">
                    {currentBranchIndex + 1}/{branches.length}
                  </span>

                  <motion.button
                    aria-label="Next branch"
                    className={cn(
                      "size-6 shrink-0 rounded text-foreground/70 transition-colors",
                      "hover:bg-accent hover:text-white",
                      "disabled:pointer-events-none disabled:opacity-50",
                      "flex items-center justify-center"
                    )}
                    disabled={branches.length <= 1}
                    onClick={goToNext}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : {
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                            duration: 0.2,
                          }
                    }
                    type="button"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                  >
                    <ChevronRightIcon size={12} />
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          {/* AI Response */}
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg border border-brand/30 bg-brand/10 p-3">
              <p className="text-gray-900 text-sm dark:text-gray-100">
                {activeBranch.aiResponse}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Export the legacy component as the default for backward compatibility
export { LegacyAiBranch as AiBranch };

// Add default export for lazy loading
export default LegacyAiBranch;
