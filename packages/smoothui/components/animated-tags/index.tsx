"use client";

import { CircleX, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export interface AnimatedTagsProps {
  initialTags?: string[];
  selectedTags?: string[];
  onChange?: (selected: string[]) => void;
  className?: string;
}

export default function AnimatedTags({
  initialTags = ["react", "tailwindcss", "javascript"],
  selectedTags: controlledSelectedTags,
  onChange,
  className = "",
}: AnimatedTagsProps) {
  const [internalSelected, setInternalSelected] = useState<string[]>([]);
  const [internalTags, setInternalTags] = useState<string[]>(initialTags);

  const selectedTag = controlledSelectedTags ?? internalSelected;
  const tags = initialTags.filter((tag) => !selectedTag.includes(tag));

  const handleTagClick = (tag: string) => {
    const newSelected = [...selectedTag, tag];
    if (onChange) {
      onChange(newSelected);
    } else {
      setInternalSelected(newSelected);
    }
  };
  const handleDeleteTag = (tag: string) => {
    const newSelectedTag = selectedTag.filter((selected) => selected !== tag);
    if (onChange) {
      onChange(newSelectedTag);
    } else {
      setInternalSelected(newSelectedTag);
    }
  };
  return (
    <div className={`flex w-[300px] flex-col gap-4 p-4 ${className}`}>
      <div className="flex flex-col items-start justify-center gap-1">
        <p>Selected Tags</p>
        <AnimatePresence>
          <div className="flex min-h-12 w-full flex-wrap items-center gap-1 rounded-xl border bg-background p-2">
            {selectedTag?.map((tag) => (
              <motion.div
                animate={{
                  y: 0,
                  opacity: 1,
                  filter: "blur(0px)",
                }}
                className="group flex cursor-pointer flex-row items-center justify-center gap-2 rounded-md border bg-primary px-2 py-1 text-primary-foreground group-hover:bg-primary group-hover:text-foreground"
                exit={{ y: 20, opacity: 0, filter: "blur(4px)" }}
                initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
                key={tag}
                layout
                onClick={() => handleDeleteTag(tag)}
                transition={{ duration: 0.3, bounce: 0, type: "spring" }}
              >
                {tag}{" "}
                <CircleX
                  className="flex items-center justify-center rounded-full transition-all duration-300 ease-in-out"
                  size={16}
                />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>
      <AnimatePresence>
        <div className="flex flex-wrap items-center gap-1">
          {tags.map((tag, index) => (
            <motion.div
              animate={{
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
              }}
              className="group flex cursor-pointer flex-row items-center justify-center gap-2 rounded-md border bg-background px-2 py-1 text-primary-foreground"
              exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
              initial={{ y: -20, opacity: 0, filter: "blur(4px)" }}
              key={index}
              layout
              onClick={() => handleTagClick(tag)}
              transition={{ duration: 0.3, bounce: 0, type: "spring" }}
            >
              {tag}{" "}
              <Plus
                className="flex items-center justify-center rounded-full transition-all duration-300 ease-in-out hover:bg-primary group-hover:text-foreground"
                size={16}
              />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}
