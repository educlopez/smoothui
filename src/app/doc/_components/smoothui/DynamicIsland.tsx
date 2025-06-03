"use client"

import { ReactNode, useMemo, useState } from "react"
import {
  CloudLightning,
  Phone,
  Thermometer,
  Timer as TimerIcon,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

// Animation variants remain the same
const ANIMATION_VARIANTS = {
  "ring-idle": { scale: 0.9, scaleX: 0.9, bounce: 0.5 },
  "timer-ring": { scale: 0.7, y: -7.5, bounce: 0.35 },
  "ring-timer": { scale: 1.4, y: 7.5, bounce: 0.35 },
  "timer-idle": { scale: 0.7, y: -7.5, bounce: 0.3 },
  "idle-timer": { scale: 1.2, y: 5, bounce: 0.3 },
  "idle-ring": { scale: 1.1, y: 3, bounce: 0.5 },
} as const

const BOUNCE_VARIANTS = {
  idle: 0.5,
  "ring-idle": 0.5,
  "timer-ring": 0.35,
  "ring-timer": 0.35,
  "timer-idle": 0.3,
  "idle-timer": 0.3,
  "idle-ring": 0.5,
} as const

const variants = {
  exit: (transition: any) => ({
    ...transition,
    opacity: [1, 0],
    filter: "blur(5px)",
  }),
}

// Idle Component with Weather
const DefaultIdle = () => {
  const [showTemp, setShowTemp] = useState(false)

  return (
    <motion.div
      className="flex items-center gap-2 px-3 py-2"
      onHoverStart={() => setShowTemp(true)}
      onHoverEnd={() => setShowTemp(false)}
      layout
    >
      <AnimatePresence mode="wait">
        <motion.div
          key="storm"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="text-foreground"
        >
          <CloudLightning className="h-5 w-5" />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showTemp && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="text-foreground flex items-center gap-1 overflow-hidden"
          >
            <Thermometer className="h-3 w-3" />
            <span className="pointer-events-none text-xs whitespace-nowrap">
              12°C
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Ring Component
const DefaultRing = () => {
  return (
    <div className="text-foreground flex w-64 items-center gap-3 overflow-hidden px-4 py-2">
      <Phone className="h-5 w-5" />
      <div className="flex-1">
        <p className="pointer-events-none text-sm font-medium">Incoming Call</p>
        <p className="pointer-events-none text-xs opacity-70">
          Guillermo Rauch
        </p>
      </div>
      <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
    </div>
  )
}

// Timer Component
const DefaultTimer = () => {
  const [time, setTime] = useState(60)

  useMemo(() => {
    const timer = setInterval(() => {
      setTime((t) => (t > 0 ? t - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="text-foreground flex w-64 items-center gap-3 overflow-hidden px-4 py-2">
      <TimerIcon className="h-5 w-5" />
      <div className="flex-1">
        <p className="pointer-events-none text-sm font-medium">
          {time}s remaining
        </p>
      </div>
      <div className="bg-background/20 h-1 w-24 overflow-hidden rounded-full">
        <motion.div
          className="bg-foreground h-full"
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: time, ease: "linear" }}
        />
      </div>
    </div>
  )
}

type View = "idle" | "ring" | "timer"

export interface DynamicIslandProps {
  view?: View
  onViewChange?: (view: View) => void
  idleContent?: ReactNode
  ringContent?: ReactNode
  timerContent?: ReactNode
  className?: string
}

export default function DynamicIsland({
  view: controlledView,
  onViewChange,
  idleContent,
  ringContent,
  timerContent,
  className = "",
}: DynamicIslandProps) {
  const [internalView, setInternalView] = useState<View>("idle")
  const [variantKey, setVariantKey] =
    useState<keyof typeof BOUNCE_VARIANTS>("idle")

  const view = controlledView ?? internalView

  const content = useMemo(() => {
    switch (view) {
      case "ring":
        return ringContent ?? <DefaultRing />
      case "timer":
        return timerContent ?? <DefaultTimer />
      default:
        return idleContent ?? <DefaultIdle />
    }
  }, [view, idleContent, ringContent, timerContent])

  const handleViewChange = (newView: View) => {
    if (view === newView) return
    setVariantKey(`${view}-${newView}` as keyof typeof BOUNCE_VARIANTS)
    if (onViewChange) onViewChange(newView)
    else setInternalView(newView)
  }

  return (
    <div className={`h-[200px] ${className}`}>
      <div className="relative flex h-full w-full flex-col justify-between">
        <motion.div
          layout
          transition={{
            type: "spring",
            bounce: BOUNCE_VARIANTS[variantKey],
          }}
          style={{ borderRadius: 32 }}
          className="mx-auto w-fit min-w-[100px] overflow-hidden rounded-full bg-black"
        >
          <motion.div
            transition={{
              type: "spring",
              bounce: BOUNCE_VARIANTS[variantKey],
            }}
            initial={{
              scale: 0.9,
              opacity: 0,
              filter: "blur(5px)",
              originX: 0.5,
              originY: 0.5,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              filter: "blur(0px)",
              originX: 0.5,
              originY: 0.5,
              transition: { delay: 0.05 },
            }}
            key={view}
          >
            {content}
          </motion.div>
        </motion.div>

        <div className="pointer-events-none absolute top-0 left-1/2 flex h-[200px] w-[300px] -translate-x-1/2 items-start justify-center">
          <AnimatePresence
            mode="popLayout"
            custom={
              ANIMATION_VARIANTS[variantKey as keyof typeof ANIMATION_VARIANTS]
            }
          >
            <motion.div
              initial={{ opacity: 0 }}
              exit="exit"
              variants={variants}
              key={view}
            >
              {content}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          <button
            className="rounded-full bg-black/80 px-3 py-1 text-xs text-white shadow"
            onClick={() => handleViewChange("idle")}
            aria-label="Idle"
          >
            Idle
          </button>
          <button
            className="rounded-full bg-black/80 px-3 py-1 text-xs text-white shadow"
            onClick={() => handleViewChange("ring")}
            aria-label="Ring"
          >
            Ring
          </button>
          <button
            className="rounded-full bg-black/80 px-3 py-1 text-xs text-white shadow"
            onClick={() => handleViewChange("timer")}
            aria-label="Timer"
          >
            Timer
          </button>
        </div>
      </div>
    </div>
  )
}
