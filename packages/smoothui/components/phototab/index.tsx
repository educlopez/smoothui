"use client";

import {
  Content as TabsContent,
  List as TabsList,
  Root as TabsRoot,
  Trigger as TabsTrigger,
} from "@radix-ui/react-tabs";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";

/**
 * Tab definition for Phototab
 */
export interface PhototabTab {
  /** Tab label */
  name: string;
  /** Tab icon (ReactNode) */
  icon: React.ReactNode;
  /** Tab image (string: URL or import) */
  image: string;
}

export interface PhototabProps {
  /** Array of tabs to display */
  tabs: PhototabTab[];
  /** Default selected tab name */
  defaultTab?: string;
  /** Height of the component in pixels */
  height?: number;
  /** Class name for root */
  className?: string;
  /** Class name for tab list */
  tabListClassName?: string;
  /** Class name for tab trigger */
  tabTriggerClassName?: string;
  /** Class name for image */
  imageClassName?: string;
}

export default function Phototab({
  tabs,
  defaultTab,
  height = 400,
  className = "",
  tabListClassName = "",
  tabTriggerClassName = "",
  imageClassName = "",
}: PhototabProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [bgStyle, setBgStyle] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const triggersRef = useRef<(HTMLButtonElement | null)[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (
      hoveredIndex !== null &&
      triggersRef.current[hoveredIndex] &&
      listRef.current
    ) {
      const trigger = triggersRef.current[hoveredIndex];
      if (!trigger) {
        return;
      }
      const listRect = listRef.current.getBoundingClientRect();
      const triggerRect = trigger.getBoundingClientRect();
      setBgStyle({
        left: triggerRect.left - listRect.left,
        top: triggerRect.top - listRect.top,
        width: triggerRect.width,
        height: triggerRect.height,
      });
    } else {
      setBgStyle(null);
    }
  }, [hoveredIndex]);

  return (
    <TabsRoot
      className={`group relative aspect-square w-auto overflow-hidden ${className}`}
      defaultValue={defaultTab || (tabs[0]?.name ?? "")}
      orientation="horizontal"
      style={{ height: `${height}px` }}
    >
      <TabsList
        aria-label="Phototab Tabs"
        className={`absolute right-0 bottom-2 left-0 mx-auto flex w-40 -translate-y-10 flex-row items-center justify-between rounded-full bg-primary/40 px-3 py-2 font-medium text-sm ring ring-border/70 backdrop-blur-sm transition hover:text-foreground md:translate-y-20 md:group-hover:translate-y-0 ${tabListClassName}`}
        ref={listRef}
        style={{ pointerEvents: "auto" }}
      >
        <AnimatePresence>
          {bgStyle && (
            <motion.span
              animate={{
                opacity: 1,
                left: bgStyle.left,
                top: bgStyle.top,
                width: bgStyle.width,
                height: bgStyle.height,
              }}
              className="absolute z-0 rounded-full bg-primary transition-colors"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              layoutId="hoverBackground"
              style={{ position: "absolute" }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : {
                      type: "spring",
                      stiffness: 400,
                      damping: 40,
                      duration: 0.25,
                    }
              }
            />
          )}
        </AnimatePresence>
        {tabs.map((tab, index) => (
          <TabsTrigger
            aria-label={tab.name}
            className={`relative z-10 cursor-pointer rounded-full p-2 data-[state='active']:bg-background ${tabTriggerClassName}`}
            key={tab.name}
            onMouseEnter={() => {
              setHoveredIndex(index);
            }}
            onMouseLeave={() => {
              setHoveredIndex(null);
            }}
            ref={(el) => {
              triggersRef.current[index] = el;
            }}
            value={tab.name}
          >
            <span className="relative z-10 rounded-full focus:outline-none">
              {tab.icon}
              <span className="sr-only">{tab.name}</span>
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent className="h-full w-full" key={tab.name} value={tab.name}>
          <img
            alt={tab.name}
            className={`h-full w-full rounded-2xl bg-primary object-cover ${imageClassName}`}
            height={height}
            loading="lazy"
            src={tab.image}
            width={400}
          />
        </TabsContent>
      ))}
    </TabsRoot>
  );
}
