"use client";

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
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type ReactNode, useMemo, useState } from "react";

const BOUNCE_VARIANTS = {
  idle: 0.5,
  "ring-idle": 0.5,
  "timer-ring": 0.35,
  "ring-timer": 0.35,
  "timer-idle": 0.3,
  "idle-timer": 0.3,
  "idle-ring": 0.5,
} as const;

const DEFAULT_BOUNCE = 0.5;
const TIMER_INTERVAL_MS = 1000;

// Idle Component with Weather
const DefaultIdle = () => {
  const [showTemp, setShowTemp] = useState(false);

  return (
    <motion.div
      className="flex items-center gap-2 px-3 py-2"
      layout
      onHoverEnd={() => setShowTemp(false)}
      onHoverStart={() => setShowTemp(true)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="text-foreground"
          exit={{ opacity: 0, scale: 0.8 }}
          initial={{ opacity: 0, scale: 0.8 }}
          key="storm"
        >
          <CloudLightning className="h-5 w-5 text-white" />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showTemp && (
          <motion.div
            animate={{ opacity: 1, width: "auto" }}
            className="flex items-center gap-1 overflow-hidden text-white"
            exit={{ opacity: 0, width: 0 }}
            initial={{ opacity: 0, width: 0 }}
          >
            <Thermometer className="h-3 w-3" />
            <span className="pointer-events-none whitespace-nowrap text-white text-xs">
              12°C
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Ring Component
const DefaultRing = () => (
  <div className="flex w-64 items-center gap-3 overflow-hidden px-4 py-2 text-foreground">
    <Phone className="h-5 w-5 text-green-500" />
    <div className="flex-1">
      <p className="pointer-events-none font-medium text-sm text-white">
        Incoming Call
      </p>
      <p className="pointer-events-none text-white text-xs opacity-70">
        Guillermo Rauch
      </p>
    </div>
    <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
  </div>
);

// Timer Component
const DefaultTimer = () => {
  const [time, setTime] = useState(60);

  useMemo(() => {
    const timer = setInterval(() => {
      setTime((t) => (t > 0 ? t - 1 : 0));
    }, TIMER_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex w-64 items-center gap-3 overflow-hidden px-4 py-2 text-foreground">
      <TimerIcon className="h-5 w-5 text-amber-500" />
      <div className="flex-1">
        <p className="pointer-events-none font-medium text-sm text-white">
          {time}s remaining
        </p>
      </div>
      <div className="h-1 w-24 overflow-hidden rounded-full bg-white/20">
        <motion.div
          animate={{ width: "0%" }}
          className="h-full bg-amber-500"
          initial={{ width: "100%" }}
          transition={{ duration: time, ease: "linear" }}
        />
      </div>
    </div>
  );
};

// Notification Component
const Notification = () => (
  <div className="flex w-64 items-center gap-3 overflow-hidden px-4 py-2 text-foreground">
    <Bell className="h-5 w-5 text-yellow-400" />
    <div className="flex-1">
      <p className="pointer-events-none font-medium text-sm text-white">
        New Message
      </p>
      <p className="pointer-events-none text-white text-xs opacity-70">
        You have a new notification!
      </p>
    </div>
    <span className="rounded-full bg-yellow-400/40 px-2 py-0.5 text-xs text-yellow-500">
      1
    </span>
  </div>
);

// Music Player Component
const MusicPlayer = () => {
  const [playing, setPlaying] = useState(true);
  return (
    <div className="flex w-72 items-center gap-3 overflow-hidden px-4 py-2 text-foreground">
      <Music2 className="h-5 w-5 text-pink-500" />
      <div className="min-w-0 flex-1">
        <p className="pointer-events-none truncate font-medium text-sm text-white">
          Lofi Chill Beats
        </p>
        <p className="pointer-events-none truncate text-white text-xs opacity-70">
          DJ Smooth
        </p>
      </div>
      <button
        className="rounded-full p-1 hover:bg-white/30"
        onClick={() => setPlaying(false)}
        type="button"
      >
        <SkipBack className="h-4 w-4 text-white" />
      </button>
      <button
        className="rounded-full p-1 hover:bg-white/30"
        onClick={() => setPlaying((p) => !p)}
        type="button"
      >
        {playing ? (
          <Pause className="h-4 w-4 text-white" />
        ) : (
          <Play className="h-4 w-4 text-white" />
        )}
      </button>
      <button
        className="rounded-full p-1 hover:bg-white/30"
        onClick={() => setPlaying(true)}
        type="button"
      >
        <SkipForward className="h-4 w-4 text-white" />
      </button>
    </div>
  );
};

type View = "idle" | "ring" | "timer" | "notification" | "music";

export type DynamicIslandProps = {
  view?: View;
  onViewChange?: (view: View) => void;
  idleContent?: ReactNode;
  ringContent?: ReactNode;
  timerContent?: ReactNode;
  className?: string;
};

export default function DynamicIsland({
  view: controlledView,
  onViewChange,
  idleContent,
  ringContent,
  timerContent,
  className = "",
}: DynamicIslandProps) {
  const [internalView, setInternalView] = useState<View>("idle");
  const [variantKey, setVariantKey] = useState<string>("idle");

  const view = controlledView ?? internalView;

  const content = useMemo(() => {
    switch (view) {
      case "ring":
        return ringContent ?? <DefaultRing />;
      case "timer":
        return timerContent ?? <DefaultTimer />;
      case "notification":
        return <Notification />;
      case "music":
        return <MusicPlayer />;
      default:
        return idleContent ?? <DefaultIdle />;
    }
  }, [view, idleContent, ringContent, timerContent]);

  const handleViewChange = (newView: View) => {
    if (view === newView) {
      return;
    }
    setVariantKey(`${view}-${newView}`);
    if (onViewChange) {
      onViewChange(newView);
    } else {
      setInternalView(newView);
    }
  };

  return (
    <div className={`h-[200px] ${className}`}>
      <div className="relative flex h-full w-full flex-col justify-center">
        <motion.div
          className="mx-auto w-fit min-w-[100px] overflow-hidden rounded-full bg-black"
          layout
          style={{ borderRadius: 32 }}
          transition={{
            type: "spring",
            bounce:
              BOUNCE_VARIANTS[variantKey as keyof typeof BOUNCE_VARIANTS] ??
              DEFAULT_BOUNCE,
          }}
        >
          <motion.div
            animate={{
              scale: 1,
              opacity: 1,
              filter: "blur(0px)",
              originX: 0.5,
              originY: 0.5,
              transition: { delay: 0.05 },
            }}
            initial={{
              scale: 0.9,
              opacity: 0,
              filter: "blur(5px)",
              originX: 0.5,
              originY: 0.5,
            }}
            key={view}
            transition={{
              type: "spring",
              bounce:
                BOUNCE_VARIANTS[variantKey as keyof typeof BOUNCE_VARIANTS] ??
                DEFAULT_BOUNCE,
            }}
          >
            {content}
          </motion.div>
        </motion.div>

        <div className="-translate-x-1/2 absolute bottom-2 left-1/2 z-10 flex justify-center gap-1 rounded-full border bg-background p-1">
          {[
            { key: "idle", icon: <CloudLightning className="size-3" /> },
            { key: "ring", icon: <Phone className="size-3" /> },
            { key: "timer", icon: <TimerIcon className="size-3" /> },
            { key: "notification", icon: <Bell className="size-3" /> },
            { key: "music", icon: <Music2 className="size-3" /> },
          ].map(({ key, icon }) => (
            <button
              aria-label={key}
              className="flex size-8 cursor-pointer items-center justify-center rounded-full border bg-primary px-2"
              key={key}
              onClick={() => {
                if (view !== key) {
                  setVariantKey(`${view}-${key}`);
                  handleViewChange(key as View);
                }
              }}
              type="button"
            >
              {icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
