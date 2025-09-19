"use client"

import { useLayoutEffect, useRef, useState } from "react"
import * as Tabs from "@radix-ui/react-tabs"
import { AnimatePresence, motion } from "motion/react"

/**
 * Tab definition for Phototab
 */
export interface PhototabTab {
  /** Tab label */
  name: string
  /** Tab icon (ReactNode) */
  icon: React.ReactNode
  /** Tab image (string: URL or import) */
  image: string
}

export interface PhototabProps {
  /** Array of tabs to display */
  tabs: PhototabTab[]
  /** Default selected tab name */
  defaultTab?: string
  /** Height of the component in pixels */
  height?: number
  /** Class name for root */
  className?: string
  /** Class name for tab list */
  tabListClassName?: string
  /** Class name for tab trigger */
  tabTriggerClassName?: string
  /** Class name for image */
  imageClassName?: string
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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [bgStyle, setBgStyle] = useState<{
    left: number
    top: number
    width: number
    height: number
  } | null>(null)
  const triggersRef = useRef<(HTMLButtonElement | null)[]>([])
  const listRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    if (
      hoveredIndex !== null &&
      triggersRef.current[hoveredIndex] &&
      listRef.current
    ) {
      const trigger = triggersRef.current[hoveredIndex]
      const listRect = listRef.current.getBoundingClientRect()
      const triggerRect = trigger!.getBoundingClientRect()
      setBgStyle({
        left: triggerRect.left - listRect.left,
        top: triggerRect.top - listRect.top,
        width: triggerRect.width,
        height: triggerRect.height,
      })
    } else {
      setBgStyle(null)
    }
  }, [hoveredIndex])

  return (
    <Tabs.Root
      className={`group relative aspect-square w-auto overflow-hidden ${className}`}
      style={{ height: `${height}px` }}
      defaultValue={defaultTab || (tabs[0]?.name ?? "")}
      orientation="horizontal"
    >
      <Tabs.List
        ref={listRef}
        aria-label="Phototab Tabs"
        className={`hover:text-foreground bg-primary/40 ring-border/70 absolute right-0 bottom-2 left-0 mx-auto flex w-40 -translate-y-10 flex-row items-center justify-between rounded-full px-3 py-2 text-sm font-medium ring backdrop-blur-sm transition md:translate-y-20 md:group-hover:translate-y-0 ${tabListClassName}`}
        style={{ pointerEvents: "auto" }}
      >
        <AnimatePresence>
          {bgStyle && (
            <motion.span
              className="bg-primary absolute z-0 rounded-full transition-colors"
              layoutId="hoverBackground"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                left: bgStyle.left,
                top: bgStyle.top,
                width: bgStyle.width,
                height: bgStyle.height,
              }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              style={{ position: "absolute" }}
            />
          )}
        </AnimatePresence>
        {tabs.map((tab, index) => (
          <Tabs.Trigger
            aria-label={tab.name}
            className={`data-[state='active']:bg-background relative z-10 cursor-pointer rounded-full p-2 ${tabTriggerClassName}`}
            key={tab.name}
            ref={(el) => {
              triggersRef.current[index] = el
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            value={tab.name}
          >
            <span className="relative z-10 rounded-full focus:outline-none">
              {tab.icon}
              <span className="sr-only">{tab.name}</span>
            </span>
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {tabs.map((tab) => (
        <Tabs.Content key={tab.name} value={tab.name} className="h-full w-full">
          <img
            alt={tab.name}
            className={`bg-primary h-full w-full rounded-2xl object-cover ${imageClassName}`}
            src={tab.image}
            width={400}
            height={height}
            loading="lazy"
          />
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}
