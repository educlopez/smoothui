"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

export interface AccordionItem {
  id: string | number
  title: string
  content: React.ReactNode
}

interface BasicAccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
  className?: string
  defaultExpandedIds?: Array<string | number>
}

export default function BasicAccordion({
  items,
  allowMultiple = false,
  className = "",
  defaultExpandedIds = [],
}: BasicAccordionProps) {
  const [expandedItems, setExpandedItems] =
    useState<Array<string | number>>(defaultExpandedIds)

  const toggleItem = (id: string | number) => {
    if (expandedItems.includes(id)) {
      setExpandedItems(expandedItems.filter((item) => item !== id))
    } else {
      if (allowMultiple) {
        setExpandedItems([...expandedItems, id])
      } else {
        setExpandedItems([id])
      }
    }
  }

  return (
    <div
      className={`divide-border flex w-full flex-col divide-y overflow-hidden rounded-lg border ${className}`}
    >
      {items.map((item) => {
        const isExpanded = expandedItems.includes(item.id)

        return (
          <div key={item.id} className="overflow-hidden">
            <button
              onClick={() => toggleItem(item.id)}
              className="hover:bg-primary flex w-full items-center justify-between gap-2 px-4 py-3 text-left transition-colors"
              aria-expanded={isExpanded}
            >
              <h3 className="font-medium">{item.title}</h3>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0"
              >
                <ChevronDown className="h-5 w-5" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: "auto",
                    opacity: 1,
                    transition: {
                      height: {
                        type: "spring",
                        stiffness: 500,
                        damping: 40,
                        duration: 0.3,
                      },
                      opacity: { duration: 0.25 },
                    },
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                    transition: {
                      height: { duration: 0.25 },
                      opacity: { duration: 0.15 },
                    },
                  }}
                  className="overflow-hidden"
                >
                  <div className="border-t px-4 py-3">{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
