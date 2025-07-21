"use client"

import { ReactNode, useMemo, useState } from "react"
import {
  Bell,
  CloudLightning,
  Music2,
  Pause,
  Phone,
  Play,
  SkipBack,
  SkipForward,
  Thermometer,
  Timer as TimerIcon,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

// Animation variants
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
  exit: (transition: any, custom: any) => {
    // custom is the animation variant, e.g., ANIMATION_VARIANTS[variantKey]
    // We'll pass the target view as custom.nextView
    if (custom && custom.nextView === "idle") {
      return {
        opacity: [1, 0],
        scale: 0.7,
        filter: "blur(5px)",
        transition: { duration: 0.18, ease: "ease-in" },
      }
    }
    return {
      ...transition,
      opacity: [1, 0],
      filter: "blur(5px)",
    }
  },
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
          <CloudLightning className="h-5 w-5 text-white" />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showTemp && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="flex items-center gap-1 overflow-hidden text-white"
          >
            <Thermometer className="h-3 w-3" />
            <span className="pointer-events-none text-xs whitespace-nowrap text-white">
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
      <Phone className="h-5 w-5 text-green-500" />
      <div className="flex-1">
        <p className="pointer-events-none text-sm font-medium text-white">
          Incoming Call
        </p>
        <p className="pointer-events-none text-xs text-white opacity-70">
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
      <TimerIcon className="h-5 w-5 text-amber-500" />
      <div className="flex-1">
        <p className="pointer-events-none text-sm font-medium text-white">
          {time}s remaining
        </p>
      </div>
      <div className="h-1 w-24 overflow-hidden rounded-full bg-white/20">
        <motion.div
          className="h-full bg-amber-500"
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: time, ease: "linear" }}
        />
      </div>
    </div>
  )
}

// Notification Component
const Notification = () => (
  <div className="text-foreground flex w-64 items-center gap-3 overflow-hidden px-4 py-2">
    <Bell className="h-5 w-5 text-yellow-400" />
    <div className="flex-1">
      <p className="pointer-events-none text-sm font-medium text-white">
        New Message
      </p>
      <p className="pointer-events-none text-xs text-white opacity-70">
        You have a new notification!
      </p>
    </div>
    <span className="rounded-full bg-yellow-400/40 px-2 py-0.5 text-xs text-yellow-500">
      1
    </span>
  </div>
)

// Music Player Component
const MusicPlayer = () => {
  const [playing, setPlaying] = useState(true)
  return (
    <div className="text-foreground flex w-72 items-center gap-3 overflow-hidden px-4 py-2">
      <Music2 className="h-5 w-5 text-pink-500" />
      <div className="min-w-0 flex-1">
        <p className="pointer-events-none truncate text-sm font-medium text-white">
          Lofi Chill Beats
        </p>
        <p className="pointer-events-none truncate text-xs text-white opacity-70">
          DJ Smooth
        </p>
      </div>
      <button
        onClick={() => setPlaying(false)}
        className="rounded-full p-1 hover:bg-white/30"
      >
        <SkipBack className="h-4 w-4 text-white" />
      </button>
      <button
        onClick={() => setPlaying((p) => !p)}
        className="rounded-full p-1 hover:bg-white/30"
      >
        {playing ? (
          <Pause className="h-4 w-4 text-white" />
        ) : (
          <Play className="h-4 w-4 text-white" />
        )}
      </button>
      <button
        onClick={() => setPlaying(true)}
        className="rounded-full p-1 hover:bg-white/30"
      >
        <SkipForward className="h-4 w-4 text-white" />
      </button>
    </div>
  )
}

type View = "idle" | "ring" | "timer" | "notification" | "music"

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
  const [variantKey, setVariantKey] = useState<string>("idle")

  const view = controlledView ?? internalView

  const content = useMemo(() => {
    switch (view) {
      case "ring":
        return ringContent ?? <DefaultRing />
      case "timer":
        return timerContent ?? <DefaultTimer />
      case "notification":
        return <Notification />
      case "music":
        return <MusicPlayer />
      default:
        return idleContent ?? <DefaultIdle />
    }
  }, [view, idleContent, ringContent, timerContent])

  const handleViewChange = (newView: View) => {
    if (view === newView) return
    setVariantKey(`${view}-${newView}`)
    if (onViewChange) onViewChange(newView)
    else setInternalView(newView)
  }

  return (
    <div className={`h-[200px] ${className}`}>
      <div className="relative flex h-full w-full flex-col justify-center">
        <motion.div
          layout
          transition={{
            type: "spring",
            bounce:
              BOUNCE_VARIANTS[variantKey as keyof typeof BOUNCE_VARIANTS] ??
              0.5,
          }}
          style={{ borderRadius: 32 }}
          className="mx-auto w-fit min-w-[100px] overflow-hidden rounded-full bg-black"
        >
          <motion.div
            transition={{
              type: "spring",
              bounce:
                BOUNCE_VARIANTS[variantKey as keyof typeof BOUNCE_VARIANTS] ??
                0.5,
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

        <div className="bg-background absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 justify-center gap-1 rounded-full border p-1">
          {[
            { key: "idle", icon: <CloudLightning className="size-3" /> },
            { key: "ring", icon: <Phone className="size-3" /> },
            { key: "timer", icon: <TimerIcon className="size-3" /> },
            { key: "notification", icon: <Bell className="size-3" /> },
            { key: "music", icon: <Music2 className="size-3" /> },
          ].map(({ key, icon }) => (
            <button
              type="button"
              className="bg-primary flex size-8 cursor-pointer items-center justify-center rounded-full border px-2"
              onClick={() => {
                if (view !== key) {
                  setVariantKey(`${view}-${key}`)
                  handleViewChange(key as View)
                }
              }}
              key={key}
              aria-label={key}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
