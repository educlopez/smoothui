"use client";

import { ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

const CHEVRON_ROTATION_DEGREES = 180;
const CHEVRON_ANIMATION_DURATION = 0.2;

export interface AccordionItem {
  content: React.ReactNode;
  id: string | number;
  title: string;
}

export interface BasicAccordionProps {
  allowMultiple?: boolean;
  className?: string;
  defaultExpandedIds?: Array<string | number>;
  items: AccordionItem[];
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

            {/* Content stays mounted (height-animated, not unmounted) so the
                accordion keeps a stable width whether open or closed. `inert`
                removes collapsed content from tab order and the a11y tree. */}
            <motion.div
              animate={{
                height: isExpanded ? "auto" : 0,
                opacity: isExpanded ? 1 : 0,
              }}
              aria-labelledby={`accordion-header-${item.id}`}
              className="overflow-hidden"
              id={`accordion-content-${item.id}`}
              inert={!isExpanded}
              initial={false}
              role="region"
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : {
                      height: {
                        type: "spring" as const,
                        stiffness: 500,
                        damping: 40,
                        duration: 0.25,
                      },
                      opacity: { duration: 0.2 },
                    }
              }
            >
              <div className="border-t bg-background px-4 py-3">
                {item.content}
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
