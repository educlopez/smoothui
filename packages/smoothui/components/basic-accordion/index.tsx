"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export interface AccordionItem {
  id: string | number;
  title: string;
  content: React.ReactNode;
}

interface BasicAccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
  defaultExpandedIds?: Array<string | number>;
}

export default function BasicAccordion({
  items,
  allowMultiple = false,
  className = "",
  defaultExpandedIds = [],
}: BasicAccordionProps) {
  const [expandedItems, setExpandedItems] =
    useState<Array<string | number>>(defaultExpandedIds);

  const toggleItem = (id: string | number) => {
    if (expandedItems.includes(id)) {
      setExpandedItems(expandedItems.filter((item) => item !== id));
    } else if (allowMultiple) {
      setExpandedItems([...expandedItems, id]);
    } else {
      setExpandedItems([id]);
    }
  };

  return (
    <div
      className={`flex w-full flex-col divide-y divide-border overflow-hidden rounded-lg border ${className}`}
    >
      {items.map((item) => {
        const isExpanded = expandedItems.includes(item.id);

        return (
          <div className="overflow-hidden" key={item.id}>
            <button
              aria-expanded={isExpanded}
              className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left transition-colors hover:bg-primary"
              onClick={() => toggleItem(item.id)}
            >
              <h3 className="font-medium">{item.title}</h3>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                className="flex-shrink-0"
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-5 w-5" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
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
                  className="overflow-hidden"
                  exit={{
                    height: 0,
                    opacity: 0,
                    transition: {
                      height: { duration: 0.25 },
                      opacity: { duration: 0.15 },
                    },
                  }}
                  initial={{ height: 0, opacity: 0 }}
                >
                  <div className="border-t px-4 py-3">{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
