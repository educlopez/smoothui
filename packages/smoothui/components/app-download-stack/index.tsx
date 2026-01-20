"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useAnimation, useReducedMotion } from "motion/react";
import { useCallback, useMemo, useState } from "react";

export type AppData = {
  id: number;
  name: string;
  icon: string;
};

export type AppDownloadStackProps = {
  apps?: AppData[];
  title?: string;
  selectedApps?: number[];
  onChange?: (selected: number[]) => void;
  onDownload?: (selected: number[]) => void;
  isExpanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
  className?: string;
};

const DOWNLOAD_DURATION_MS = 3000;
const RESET_DELAY_MS = 1000;
const ROTATION_MULTIPLIER = 8;
const TRANSLATION_MULTIPLIER = 3;
const BASE_Z_INDEX = 40;
const Z_INDEX_STEP = 10;
const HOVER_X_MULTIPLIER = 10;
const HOVER_Y_MULTIPLIER = 10;
const FLOAT_AMPLITUDE = 5;
const FLOAT_DURATION = 2;
const FLOAT_DELAY_MULTIPLIER = 0.2;
const STAGGER_DELAY_MULTIPLIER = 0.1;
const TRANSITION_DURATION = 0.3;
const CHECKMARK_TRANSITION_DURATION = 0.3;

const defaultApps: AppData[] = [
  {
    id: 1,
    name: "GitHub",
    icon: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/9c9721583ecba33e59ebcebdca2248fd_Mmr12FRh5V.png",
  },
  {
    id: 2,
    name: "Canary",
    icon: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/b47f43e02f04563447fa90d4ff6c8943_9KzW5GTggQ.png",
  },
  {
    id: 3,
    name: "Figma",
    icon: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/f0b9cdefa67b57eeb080278c2f6984cc_sCqUJBg6Qq.png",
  },
  {
    id: 4,
    name: "Arc",
    icon: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/178c7b02003c933e6b5afe98bbee595b_low_res_Arc_Browser.png",
  },
];

export default function AppDownloadStack({
  apps = defaultApps,
  title = "Starter Mac",
  selectedApps: controlledSelected,
  onChange,
  onDownload,
  isExpanded: controlledExpanded,
  onExpandChange,
  className = "",
}: AppDownloadStackProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const [internalSelected, setInternalSelected] = useState<number[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const shineControls = useAnimation();
  const shouldReduceMotion = useReducedMotion();

  const isExpanded =
    controlledExpanded !== undefined ? controlledExpanded : internalExpanded;
  const selected = controlledSelected ?? internalSelected;

  const setExpanded = (val: boolean) => {
    if (onExpandChange) {
      onExpandChange(val);
    } else {
      setInternalExpanded(val);
    }
  };

  const toggleApp = useCallback(
    (id: number) => {
      const newSelected = selected.includes(id)
        ? selected.filter((appId) => appId !== id)
        : [...selected, id];
      if (onChange) {
        onChange(newSelected);
      } else {
        setInternalSelected(newSelected);
      }
    },
    [selected, onChange]
  );

  const handleDownload = useCallback(() => {
    setIsDownloading(true);
    if (onDownload) {
      onDownload(selected);
    }
    if (!shouldReduceMotion) {
      shineControls.start({
        x: ["0%", "100%"],
        transition: {
          duration: 1,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        },
      });
    }
    setTimeout(() => {
      shineControls.stop();
      setDownloadComplete(true);
      setTimeout(() => {
        if (onExpandChange) {
          onExpandChange(false);
        } else {
          setInternalExpanded(false);
        }
        if (onChange) {
          onChange([]);
        } else {
          setInternalSelected([]);
        }
        setIsDownloading(false);
        setDownloadComplete(false);
      }, RESET_DELAY_MS);
    }, DOWNLOAD_DURATION_MS);
  }, [shineControls, selected, onDownload, onChange, onExpandChange]);

  const stackVariants = useMemo(
    () => ({
      initial: (i: number) =>
        shouldReduceMotion
          ? {
              rotate: 0,
              x: 0,
              y: 0,
              zIndex: BASE_Z_INDEX - i * Z_INDEX_STEP,
            }
          : {
              rotate:
                i % 2 === 0
                  ? -ROTATION_MULTIPLIER * (i + 1)
                  : ROTATION_MULTIPLIER * (i + 1),
              x:
                i % 2 === 0
                  ? -TRANSLATION_MULTIPLIER * (i + 1)
                  : TRANSLATION_MULTIPLIER * (i + 1),
              y: 0,
              zIndex: BASE_Z_INDEX - i * Z_INDEX_STEP,
            },
      hover: (i: number) =>
        shouldReduceMotion
          ? {
              rotate: 0,
              x: 0,
              y: 0,
              zIndex: BASE_Z_INDEX - i * Z_INDEX_STEP,
            }
          : {
              rotate: 0,
              x: i * HOVER_X_MULTIPLIER,
              y: -i * HOVER_Y_MULTIPLIER,
              zIndex: BASE_Z_INDEX - i * Z_INDEX_STEP,
            },
      float: (i: number) =>
        shouldReduceMotion
          ? { y: 0 }
          : {
              y: [0, -FLOAT_AMPLITUDE, 0],
              transition: {
                y: {
                  repeat: Number.POSITIVE_INFINITY,
                  duration: FLOAT_DURATION,
                  ease: [0.645, 0.045, 0.355, 1],
                  delay: i * FLOAT_DELAY_MULTIPLIER,
                },
              },
            },
    }),
    [shouldReduceMotion]
  );

  return (
    <div
      className={`flex h-auto flex-col items-center justify-center ${className}`}
    >
      <motion.div
        className="flex flex-col items-center justify-center"
        layout={!shouldReduceMotion}
      >
        <AnimatePresence mode="wait">
          {!(isExpanded || isDownloading) && (
            <motion.button
              aria-label="Expand app selection"
              className="group relative isolate flex h-16 w-16 cursor-pointer items-center justify-center"
              key="initial-stack"
              layout={!shouldReduceMotion}
              onClick={() => setExpanded(true)}
              whileHover={shouldReduceMotion ? {} : "hover"}
            >
              {apps.map((app, index) => (
                /* biome-ignore lint/performance/noImgElement: Using motion.img for animated app icons */
                <motion.img
                  alt={`${app.name} Logo`}
                  animate={shouldReduceMotion ? "initial" : ["initial", "float"]}
                  className="absolute inset-0 rounded-xl border-none"
                  custom={index}
                  height={64}
                  initial="initial"
                  key={app.id}
                  layoutId={shouldReduceMotion ? undefined : `app-icon-${app.id}`}
                  src={app.icon}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { duration: TRANSITION_DURATION }
                  }
                  variants={stackVariants}
                  whileHover={shouldReduceMotion ? {} : "hover"}
                  width={64}
                />
              ))}
            </motion.button>
          )}

          {isExpanded && !isDownloading && (
            <motion.div
              animate={
                shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }
              }
              className="flex flex-col items-center gap-2"
              exit={
                shouldReduceMotion
                  ? { opacity: 0, transition: { duration: 0 } }
                  : { opacity: 0, scale: 0.8 }
              }
              initial={
                shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }
              }
              key="app-selector"
              layout={!shouldReduceMotion}
            >
              <button
                className="flex w-full cursor-pointer items-center justify-between px-0.5"
                onClick={() => setExpanded(false)}
                type="button"
              >
                <p className="my-0 font-medium leading-0">{title}</p>
                <div className="flex items-center gap-1">
                  <p className="my-0 font-medium leading-0">
                    {selected.length}
                  </p>
                  <ChevronDown className="text-mauve-11" size={16} />
                </div>
              </button>
              <motion.ul className="grid grid-cols-2 gap-3">
                {apps.map((app, index) => (
                  <motion.li
                    animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                    className="relative flex h-[80px] w-[80px]"
                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                    key={app.id}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { delay: index * STAGGER_DELAY_MULTIPLIER, duration: 0.25 }
                    }
                  >
                    <div
                      className={`pointer-events-none absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full border border-solid ${
                        selected.includes(app.id)
                          ? "border-blue-500 bg-blue-500"
                          : "border-white/60"
                      }`}
                    >
                      {selected.includes(app.id) && (
                        <motion.svg
                          animate={{ pathLength: 1 }}
                          className="z-1 h-3 w-3"
                          fill="none"
                          initial={{ pathLength: 0 }}
                          stroke="white"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          transition={{
                            duration: CHECKMARK_TRANSITION_DURATION,
                          }}
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Checkmark</title>
                          <motion.path d="M5 13l4 4L19 7" />
                        </motion.svg>
                      )}
                    </div>
                    <button
                      className={`group flex h-full w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-transparent bg-background/80 p-2 transition-all duration-200 hover:border-blue-500 ${
                        selected.includes(app.id)
                          ? "border-blue-500 bg-blue-500/10"
                          : ""
                      }`}
                      onClick={() => toggleApp(app.id)}
                      type="button"
                    >
                      {/* biome-ignore lint/performance/noImgElement: Using img for app icon without Next.js Image optimizations */}
                      <img
                        alt={app.name}
                        className="rounded-lg"
                        height={40}
                        src={app.icon}
                        width={40}
                      />
                      <span className="font-medium text-foreground text-xs">
                        {app.name}
                      </span>
                    </button>
                  </motion.li>
                ))}
              </motion.ul>
              <button
                className="mt-4 w-full rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white shadow transition hover:bg-blue-600 disabled:opacity-50"
                disabled={selected.length === 0}
                onClick={handleDownload}
                type="button"
              >
                Download Selected
              </button>
            </motion.div>
          )}

          {isDownloading && (
            <motion.div
              animate={
                shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }
              }
              className="flex flex-col items-center gap-4"
              exit={
                shouldReduceMotion
                  ? { opacity: 0, transition: { duration: 0 } }
                  : { opacity: 0, scale: 0.8 }
              }
              initial={
                shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }
              }
              key="downloading"
              layout={!shouldReduceMotion}
            >
              <div className="relative flex h-16 w-16 items-center justify-center">
                <motion.div
                  animate={shineControls}
                  className="absolute inset-0 rounded-xl bg-blue-500/20"
                  style={{ x: 0 }}
                />
                {apps.map((app, index) => (
                  /* biome-ignore lint/performance/noImgElement: Using motion.img for animated app icons */
                  <motion.img
                    alt={`${app.name} Logo`}
                    animate={shouldReduceMotion ? "initial" : ["initial", "float"]}
                    className="absolute inset-0 rounded-xl border-none"
                    custom={index}
                    height={64}
                    initial="initial"
                    key={app.id}
                    layoutId={shouldReduceMotion ? undefined : `app-icon-${app.id}`}
                    src={app.icon}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { duration: TRANSITION_DURATION }
                    }
                    variants={stackVariants}
                    width={64}
                  />
                ))}
              </div>
              <span className="font-semibold text-blue-500">
                Downloading...
              </span>
            </motion.div>
          )}

          {downloadComplete && (
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4"
              exit={{ opacity: 0, scale: 0.8 }}
              initial={{ opacity: 0, scale: 0.8 }}
              key="download-complete"
              layout
            >
              <span className="font-semibold text-green-500">
                Download Complete!
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
