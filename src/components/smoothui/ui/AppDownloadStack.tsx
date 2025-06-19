"use client"

import { useCallback, useMemo, useState } from "react"
import { ChevronDown } from "lucide-react"
import { AnimatePresence, motion, useAnimation } from "motion/react"

export interface AppData {
  id: number
  name: string
  icon: string
}

export interface AppDownloadStackProps {
  apps?: AppData[]
  title?: string
  selectedApps?: number[]
  onChange?: (selected: number[]) => void
  onDownload?: (selected: number[]) => void
  isExpanded?: boolean
  onExpandChange?: (expanded: boolean) => void
  className?: string
}

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
]

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
  const [internalExpanded, setInternalExpanded] = useState(false)
  const [internalSelected, setInternalSelected] = useState<number[]>([])
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadComplete, setDownloadComplete] = useState(false)
  const shineControls = useAnimation()

  const isExpanded =
    controlledExpanded !== undefined ? controlledExpanded : internalExpanded
  const selected = controlledSelected ?? internalSelected

  const setExpanded = (val: boolean) => {
    if (onExpandChange) onExpandChange(val)
    else setInternalExpanded(val)
  }

  const toggleApp = useCallback(
    (id: number) => {
      const newSelected = selected.includes(id)
        ? selected.filter((appId) => appId !== id)
        : [...selected, id]
      if (onChange) onChange(newSelected)
      else setInternalSelected(newSelected)
    },
    [selected, onChange]
  )

  const handleDownload = useCallback(() => {
    setIsDownloading(true)
    if (onDownload) onDownload(selected)
    shineControls.start({
      x: ["0%", "100%"],
      transition: { duration: 1, repeat: Infinity, ease: "linear" },
    })
    setTimeout(() => {
      shineControls.stop()
      setDownloadComplete(true)
      setTimeout(() => {
        setExpanded(false)
        if (onChange) onChange([])
        else setInternalSelected([])
        setIsDownloading(false)
        setDownloadComplete(false)
      }, 1000)
    }, 3000)
  }, [shineControls, selected, onDownload, onChange])

  const stackVariants = useMemo(
    () => ({
      initial: (i: number) => ({
        rotate: i % 2 === 0 ? -8 * (i + 1) : 8 * (i + 1),
        x: i % 2 === 0 ? -3 * (i + 1) : 3 * (i + 1),
        y: 0,
        zIndex: 40 - i * 10,
      }),
      hover: (i: number) => ({
        rotate: 0,
        x: i * 10,
        y: -i * 10,
        zIndex: 40 - i * 10,
      }),
      float: (i: number) => ({
        y: [0, -5, 0],
        transition: {
          y: {
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut",
            delay: i * 0.2,
          },
        },
      }),
    }),
    []
  )

  return (
    <div
      className={`flex h-auto flex-col items-center justify-center ${className}`}
    >
      <motion.div layout className="flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {!isExpanded && !isDownloading && (
            <motion.button
              key="initial-stack"
              className="group relative isolate flex h-16 w-16 cursor-pointer items-center justify-center"
              onClick={() => setExpanded(true)}
              whileHover="hover"
              layout
              aria-label="Expand app selection"
            >
              {apps.map((app, index) => (
                <motion.img
                  key={app.id}
                  layoutId={`app-icon-${app.id}`}
                  src={app.icon}
                  width={64}
                  height={64}
                  alt={`${app.name} Logo`}
                  className="absolute inset-0 rounded-xl border-none"
                  custom={index}
                  variants={stackVariants}
                  initial="initial"
                  animate={["initial", "float"]}
                  whileHover="hover"
                  transition={{ duration: 0.3 }}
                />
              ))}
            </motion.button>
          )}

          {isExpanded && !isDownloading && (
            <motion.div
              className="flex flex-col items-center gap-2"
              key="app-selector"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              layout
            >
              <button
                className="flex w-full cursor-pointer items-center justify-between px-0.5"
                onClick={() => setExpanded(false)}
              >
                <p className="my-0 leading-0 font-medium">{title}</p>
                <div className="flex items-center gap-1">
                  <p className="my-0 leading-0 font-medium">
                    {selected.length}
                  </p>
                  <ChevronDown size={16} className="text-mauve-11" />
                </div>
              </button>
              <motion.ul className="grid grid-cols-2 gap-3">
                {apps.map((app, index) => (
                  <motion.li
                    key={app.id}
                    className="relative flex h-[80px] w-[80px]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
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
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="z-1 h-3 w-3"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <motion.path d="M5 13l4 4L19 7" />
                        </motion.svg>
                      )}
                    </div>
                    <button
                      className={`group bg-background/80 flex h-full w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-transparent p-2 transition-all duration-200 hover:border-blue-500 ${
                        selected.includes(app.id)
                          ? "border-blue-500 bg-blue-500/10"
                          : ""
                      }`}
                      onClick={() => toggleApp(app.id)}
                    >
                      <img
                        src={app.icon}
                        alt={app.name}
                        width={40}
                        height={40}
                        className="rounded-lg"
                      />
                      <span className="text-foreground text-xs font-medium">
                        {app.name}
                      </span>
                    </button>
                  </motion.li>
                ))}
              </motion.ul>
              <button
                className="mt-4 w-full rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white shadow transition hover:bg-blue-600 disabled:opacity-50"
                onClick={handleDownload}
                disabled={selected.length === 0}
              >
                Download Selected
              </button>
            </motion.div>
          )}

          {isDownloading && (
            <motion.div
              key="downloading"
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              layout
            >
              <div className="relative flex h-16 w-16 items-center justify-center">
                <motion.div
                  className="absolute inset-0 rounded-xl bg-blue-500/20"
                  animate={shineControls}
                  style={{ x: 0 }}
                />
                {apps.map((app, index) => (
                  <motion.img
                    key={app.id}
                    layoutId={`app-icon-${app.id}`}
                    src={app.icon}
                    width={64}
                    height={64}
                    alt={`${app.name} Logo`}
                    className="absolute inset-0 rounded-xl border-none"
                    custom={index}
                    variants={stackVariants}
                    initial="initial"
                    animate={["initial", "float"]}
                    transition={{ duration: 0.3 }}
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
              key="download-complete"
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
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
  )
}
