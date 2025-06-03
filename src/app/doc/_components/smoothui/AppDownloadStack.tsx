"use client"

import { useCallback, useMemo, useState } from "react"
import { ChevronDown } from "lucide-react"
import { AnimatePresence, motion, useAnimation } from "motion/react"

const Canary =
  "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/b47f43e02f04563447fa90d4ff6c8943_9KzW5GTggQ.png"

const Github =
  "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/9c9721583ecba33e59ebcebdca2248fd_Mmr12FRh5V.png"

const Figma =
  "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/f0b9cdefa67b57eeb080278c2f6984cc_sCqUJBg6Qq.png"

const Arc =
  "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/178c7b02003c933e6b5afe98bbee595b_low_res_Arc_Browser.png"

const STARTER_KIT_TITLE = "Starter Mac"

const apps = [
  { id: 1, name: "GitHub", icon: Github },
  { id: 2, name: "Canary", icon: Canary },
  { id: 3, name: "Figma", icon: Figma },
  { id: 4, name: "Arc", icon: Arc },
]

const useAppDownloader = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedApps, setSelectedApps] = useState<number[]>([])
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadComplete, setDownloadComplete] = useState(false)
  const shineControls = useAnimation()

  const toggleApp = useCallback((id: number) => {
    setSelectedApps((prev) =>
      prev.includes(id) ? prev.filter((appId) => appId !== id) : [...prev, id]
    )
  }, [])

  const handleDownload = useCallback(() => {
    setIsDownloading(true)
  }, [])

  const confirmDownload = useCallback(() => {
    setIsDownloading(true)
    shineControls.start({
      x: ["0%", "100%"],
      transition: { duration: 1, repeat: Infinity, ease: "linear" },
    })
    setTimeout(() => {
      shineControls.stop()
      setDownloadComplete(true)
      setTimeout(() => {
        setIsExpanded(false)
        setSelectedApps([])
        setIsDownloading(false)
        setDownloadComplete(false)
      }, 1000)
    }, 3000)
  }, [shineControls])

  return {
    isExpanded,
    setIsExpanded,
    selectedApps,
    isDownloading,
    downloadComplete,
    toggleApp,
    handleDownload,
    confirmDownload,
    shineControls,
  }
}

export default function AppDownloadStack() {
  const {
    isExpanded,
    setIsExpanded,
    selectedApps,
    isDownloading,
    downloadComplete,
    toggleApp,
    handleDownload,
    confirmDownload,
    shineControls,
  } = useAppDownloader()

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
    <div className="flex h-auto flex-col items-center justify-center">
      <motion.div layout className="flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {!isExpanded && !isDownloading && (
            <motion.button
              key="initial-stack"
              className="group relative isolate flex h-16 w-16 cursor-pointer items-center justify-center"
              onClick={() => setIsExpanded(true)}
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
                onClick={() => setIsExpanded(false)}
              >
                <p className="my-0 leading-0 font-medium">
                  {STARTER_KIT_TITLE}
                </p>
                <div className="flex items-center gap-1">
                  <p className="my-0 leading-0 font-medium">
                    {selectedApps.length}
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
                        selectedApps.includes(app.id)
                          ? "border-blue-500 bg-blue-500"
                          : "border-white/60"
                      }`}
                    >
                      {selectedApps.includes(app.id) && (
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
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </motion.svg>
                      )}
                    </div>
                    <button
                      className="cursor-pointer"
                      onClick={() => toggleApp(app.id)}
                      aria-label={`${app.name} ${
                        selectedApps.includes(app.id)
                          ? "Selected"
                          : "Unselected"
                      }`}
                    >
                      <motion.img
                        layoutId={`app-icon-${app.id}`}
                        src={app.icon}
                        width={80}
                        height={80}
                        alt={`${app.name} Logo`}
                        className="z-0 w-auto rounded-xl border-none"
                      />
                    </button>
                  </motion.li>
                ))}
              </motion.ul>
              <motion.button
                layoutId="download-button"
                className={`mt-2 w-full rounded-full border p-3 py-2 font-sans font-medium shadow-sm transition ${
                  selectedApps.length > 0
                    ? "bg-background cursor-pointer"
                    : "cursor-not-allowed"
                }`}
                disabled={selectedApps.length === 0}
                onClick={handleDownload}
                whileHover={selectedApps.length > 0 ? { scale: 1.05 } : {}}
                whileTap={selectedApps.length > 0 ? { scale: 0.95 } : {}}
              >
                Download
              </motion.button>
            </motion.div>
          )}

          {isDownloading && (
            <motion.div
              key="download-confirmation"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center gap-8"
              layout
            >
              <motion.div
                className="relative h-16 w-16"
                initial={{ scale: 1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {selectedApps.map((appId, index) => {
                  const app = apps.find((a) => a.id === appId)
                  return (
                    <motion.img
                      key={appId}
                      layoutId={`app-icon-${appId}`}
                      src={app?.icon}
                      width={64}
                      height={64}
                      alt={`${app?.name} Logo`}
                      className="absolute inset-0 h-16 w-16 rounded-xl border-none"
                      style={{
                        rotate: index % 2 === 0 ? "12deg" : "-8deg",
                        transformOrigin: "50% 50% 0px",
                      }}
                    />
                  )
                })}
              </motion.div>
              <motion.div className="relative w-full overflow-hidden rounded-full">
                <motion.button
                  layoutId="download-button"
                  className={`bg-background text-foreground relative w-full cursor-pointer rounded-full border p-3 px-4 py-2 font-sans font-medium shadow-xs transition`}
                  onClick={confirmDownload}
                  disabled={downloadComplete}
                >
                  <motion.div
                    className="via-foreground/20 dark:via-background absolute inset-0 bg-linear-to-r from-transparent to-transparent opacity-30"
                    initial={{ x: "-100%" }}
                    animate={shineControls}
                  />
                  <span className="relative z-10">
                    {downloadComplete
                      ? "🎉 Download Complete!"
                      : `Confirm downloading ${selectedApps.length} app${
                          selectedApps.length > 1 ? "s" : ""
                        }`}
                  </span>
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isExpanded && !isDownloading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-center"
          >
            <h2 className="text-foreground text-xl font-bold">
              {STARTER_KIT_TITLE}
            </h2>
            <p className="text-primary-foreground">
              {apps.length} Applications
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
