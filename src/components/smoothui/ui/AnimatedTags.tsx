"use client"

import { useState } from "react"
import { CircleX, Plus } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

export interface AnimatedTagsProps {
  initialTags?: string[]
  selectedTags?: string[]
  onChange?: (selected: string[]) => void
  className?: string
}

export default function AnimatedTags({
  initialTags = ["react", "tailwindcss", "javascript"],
  selectedTags: controlledSelectedTags,
  onChange,
  className = "",
}: AnimatedTagsProps) {
  const [internalSelected, setInternalSelected] = useState<string[]>([])
  const [internalTags, setInternalTags] = useState<string[]>(initialTags)

  const selectedTag = controlledSelectedTags ?? internalSelected
  const tags = initialTags.filter((tag) => !selectedTag.includes(tag))

  const handleTagClick = (tag: string) => {
    const newSelected = [...selectedTag, tag]
    if (onChange) {
      onChange(newSelected)
    } else {
      setInternalSelected(newSelected)
    }
  }
  const handleDeleteTag = (tag: string) => {
    const newSelectedTag = selectedTag.filter((selected) => selected !== tag)
    if (onChange) {
      onChange(newSelectedTag)
    } else {
      setInternalSelected(newSelectedTag)
    }
  }
  return (
    <div className={`flex w-[300px] flex-col gap-4 p-4 ${className}`}>
      <div className="flex flex-col items-start justify-center gap-1">
        <p>Selected Tags</p>
        <AnimatePresence>
          <div className="bg-background flex min-h-12 w-full flex-wrap items-center gap-1 rounded-xl border p-2">
            {selectedTag?.map((tag) => (
              <motion.div
                key={tag}
                layout
                className="group bg-primary text-primary-foreground group-hover:bg-primary group-hover:text-foreground flex cursor-pointer flex-row items-center justify-center gap-2 rounded-md border px-2 py-1"
                onClick={() => handleDeleteTag(tag)}
                initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
                animate={{
                  y: 0,
                  opacity: 1,
                  filter: "blur(0px)",
                }}
                exit={{ y: 20, opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.3, bounce: 0, type: "spring" }}
              >
                {tag}{" "}
                <CircleX
                  size={16}
                  className="flex items-center justify-center rounded-full transition-all duration-300 ease-in-out"
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
              layout
              key={index}
              className="group bg-background text-primary-foreground flex cursor-pointer flex-row items-center justify-center gap-2 rounded-md border px-2 py-1"
              onClick={() => handleTagClick(tag)}
              initial={{ y: -20, opacity: 0, filter: "blur(4px)" }}
              animate={{
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
              }}
              exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.3, bounce: 0, type: "spring" }}
            >
              {tag}{" "}
              <Plus
                size={16}
                className="hover:bg-primary group-hover:text-foreground flex items-center justify-center rounded-full transition-all duration-300 ease-in-out"
              />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  )
}
