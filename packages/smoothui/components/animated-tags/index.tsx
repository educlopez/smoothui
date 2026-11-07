"use client";

import { cn } from "@repo/smoothui-utils";
import { CircleX, Plus } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

export interface AnimatedTagsProps {
  className?: string;
  initialTags?: string[];
  onChange?: (selected: string[]) => void;
  selectedTags?: string[];
}

export default function AnimatedTags({
  initialTags = ["react", "tailwindcss", "javascript"],
  selectedTags: controlledSelectedTags,
  onChange,
  className = "",
}: AnimatedTagsProps) {
  const [internalSelected, setInternalSelected] = useState<string[]>([]);
  const shouldReduceMotion = useReducedMotion();

  const selectedTag = controlledSelectedTags ?? internalSelected;
  const tags = initialTags.filter((tag) => !selectedTag.includes(tag));

  const handleTagClick = (tag: string) => {
    const newSelected = [...selectedTag, tag];
    setInternalSelected(newSelected);
    onChange?.(newSelected);
  };
  const handleDeleteTag = (tag: string) => {
    const newSelectedTag = selectedTag.filter((selected) => selected !== tag);
    setInternalSelected(newSelectedTag);
    onChange?.(newSelectedTag);
  };
  return (
    <div className={cn("flex w-[300px] flex-col gap-4 p-4", className)}>
      <div className="flex flex-col items-start justify-center gap-1">
        <p>Selected Tags</p>
        <AnimatePresence>
          <div className="flex min-h-12 w-full flex-wrap items-center gap-1 rounded-xl border bg-background p-2">
            {selectedTag?.map((tag) => (
              <motion.button
                animate={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : {
                        filter: "blur(0px)",
                        opacity: 1,
                        y: 0,
                      }
                }
                aria-label={`Remove ${tag}`}
                className="focus-ring flex cursor-pointer flex-row items-center justify-center gap-2 rounded-md border bg-primary px-2 py-1 text-primary-foreground outline-none transition-colors hover:bg-muted"
                exit={
                  shouldReduceMotion
                    ? { opacity: 0, transition: { duration: 0 } }
                    : { filter: "blur(4px)", opacity: 0, y: 20 }
                }
                initial={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : { filter: "blur(4px)", opacity: 0, y: 20 }
                }
                key={tag}
                layout
                onClick={() => handleDeleteTag(tag)}
                type="button"
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { bounce: 0, duration: 0.25, type: "spring" as const }
                }
              >
                {tag}{" "}
                <CircleX aria-hidden="true" className="shrink-0" size={16} />
              </motion.button>
            ))}
          </div>
        </AnimatePresence>
      </div>
      <AnimatePresence>
        <div className="flex flex-wrap items-center gap-1">
          {tags.map((tag) => (
            <motion.button
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : {
                      filter: "blur(0px)",
                      opacity: 1,
                      y: 0,
                    }
              }
              aria-label={`Add ${tag}`}
              className="focus-ring flex cursor-pointer flex-row items-center justify-center gap-2 rounded-md border bg-background px-2 py-1 text-primary-foreground outline-none transition-colors hover:bg-muted"
              exit={
                shouldReduceMotion
                  ? { opacity: 0, transition: { duration: 0 } }
                  : { filter: "blur(4px)", opacity: 0, y: -20 }
              }
              initial={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { filter: "blur(4px)", opacity: 0, y: -20 }
              }
              key={tag}
              layout
              onClick={() => handleTagClick(tag)}
              type="button"
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { bounce: 0, duration: 0.25, type: "spring" as const }
              }
            >
              {tag} <Plus aria-hidden="true" className="shrink-0" size={16} />
            </motion.button>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}
