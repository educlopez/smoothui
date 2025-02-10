"use client"

import { useState } from "react"
import { CircleX, Plus } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

export default function AnimatedTagsDemo() {
  const [selectedTag, setSelectedTag] = useState<string[]>([])

  const [tags, setTags] = useState<string[]>(initialTags)

  const handleTagClick = (tag: string) => {
    if (!selectedTag.includes(tag)) {
      setSelectedTag([...selectedTag, tag])
      setTags(tags.filter((t) => t !== tag))
    }
  }
  const handleDeleteTag = (tag: string) => {
    const newSelectedTag = selectedTag.filter((selected) => selected !== tag)
    setSelectedTag(newSelectedTag)
    setTags([...tags, tag])
  }
  return (
    <div className="flex w-[300px] flex-col gap-4 p-4">
      <div className="flex flex-col items-start justify-center gap-1">
        <p>Selected Tags</p>
        <AnimatePresence>
          <div className="border-light-300 dark:border-dark-300 flex min-h-12 w-full flex-wrap items-center gap-1 rounded-xl border p-2">
            {selectedTag?.map((tag) => (
              <motion.div
                key={tag}
                layout
                className="group bg-light-200 text-light-900 group-hover:bg-light-100 group-hover:text-light-950 dark:bg-dark-200 dark:text-dark-900 dark:group-hover:bg-dark-100 dark:group-hover:text-dark-950 flex cursor-pointer flex-row items-center justify-center gap-2 rounded-md px-2 py-1"
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
              className="group bg-light-200 text-light-900 dark:bg-dark-200 dark:text-dark-900 flex cursor-pointer flex-row items-center justify-center gap-2 rounded-md px-2 py-1"
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
                className="hover:bg-light-100 group-hover:text-light-950 dark:group-hover:bg-dark-100 dark:group-hover:text-dark-950 flex items-center justify-center rounded-full transition-all duration-300 ease-in-out"
              />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  )
}

const initialTags: string[] = ["react", "tailwindcss", "javascript"]
