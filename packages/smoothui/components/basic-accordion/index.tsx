"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

const CHEVRON_ROTATION_DEGREES = 180;
const CHEVRON_ANIMATION_DURATION = 0.2;

export interface AccordionItem {
  id: string | number;
  title: string;
  content: React.ReactNode;
}

export interface BasicAccordionProps {
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
  const shouldReduceMotion = useReducedMotion();

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
              aria-controls={`accordion-content-${item.id}`}
              aria-expanded={isExpanded}
              className="flex min-h-[44px] w-full items-center justify-between gap-2 bg-background px-4 py-3 text-left transition-colors hover:bg-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              id={`accordion-header-${item.id}`}
              onClick={() => toggleItem(item.id)}
              type="button"
            >
              <h3 className="font-medium">{item.title}</h3>
              <motion.div
                animate={{ rotate: isExpanded ? CHEVRON_ROTATION_DEGREES : 0 }}
                className="shrink-0"
                transition={{
                  duration: shouldReduceMotion ? 0 : CHEVRON_ANIMATION_DURATION,
                }}
              >
                <ChevronDown className="h-5 w-5" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  animate={
                    shouldReduceMotion
                      ? { height: "auto", opacity: 1 }
                      : {
                          height: "auto",
                          opacity: 1,
                          transition: {
                            height: {
                              type: "spring",
                              stiffness: 500,
                              damping: 40,
                              duration: 0.25,
                            },
                            opacity: { duration: 0.2 },
                          },
                        }
                  }
                  aria-labelledby={`accordion-header-${item.id}`}
                  className="overflow-hidden"
                  exit={
                    shouldReduceMotion
                      ? { height: 0, opacity: 0, transition: { duration: 0 } }
                      : {
                          height: 0,
                          opacity: 0,
                          transition: {
                            height: { duration: 0.2 },
                            opacity: { duration: 0.15 },
                          },
                        }
                  }
                  id={`accordion-content-${item.id}`}
                  initial={
                    shouldReduceMotion
                      ? { height: "auto", opacity: 1 }
                      : { height: 0, opacity: 0 }
                  }
                  role="region"
                >
                  <div className="border-t bg-background px-4 py-3">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
