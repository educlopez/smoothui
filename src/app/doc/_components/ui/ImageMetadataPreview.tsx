"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronUp, CircleX, Share } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import useMeasure from "react-use-measure"

import arenaOpenCard from "@/app/doc/_components/resources/arenaopencard/arenaOpenCard.png"

export default function ImageMetadataPreview() {
  const [openInfo, setopenInfo] = useState(false)
  const [height, setHeight] = useState("42px")
  const [elementRef, bounds] = useMeasure()

  const handleClickOpen = () => {
    setHeight(bounds.height.toString())
    setopenInfo((b) => !b)
  }

  const handleClickClose = () => {
    setHeight("42px")
    setopenInfo((b) => !b)
  }

  return (
    <div className="absolute bottom-10 flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ y: -bounds.height }}
        className="pointer-events-none overflow-hidden rounded-xl"
      >
        <Image
          src={arenaOpenCard}
          alt="Scenario with orange black colors"
          width="300"
        />
      </motion.div>

      <div className="relative flex w-full flex-col items-center gap-4">
        <div className="relative flex w-full flex-row items-center justify-center gap-4">
          <button
            disabled
            aria-label="Share"
            className="border-light-200 bg-light-50 dark:border-dark-200 dark:bg-dark-50 cursor-not-allowed rounded-full border p-3 transition disabled:opacity-50"
          >
            <Share size={16} />
          </button>
          <button
            disabled
            aria-label="Connect"
            className="border-light-200 bg-light-50 dark:border-dark-200 dark:bg-dark-50 cursor-not-allowed rounded-full border px-4 py-3 text-sm transition disabled:opacity-50"
          >
            Connect
          </button>
          <AnimatePresence>
            {!openInfo ? (
              <motion.button
                className="border-light-200 bg-light-50 dark:border-dark-200 dark:bg-dark-50 cursor-pointer border p-3 shadow-xs transition"
                aria-label="Open Metadata Preview"
                style={{ borderRadius: 100 }}
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                onClick={handleClickOpen}
              >
                <ChevronUp size={16} />
              </motion.button>
            ) : null}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {openInfo ? (
            <motion.div
              className="bg-light-50 dark:bg-dark-50 absolute bottom-0 w-full cursor-pointer gap-4 p-5 shadow-xs"
              style={{ borderRadius: 20 }}
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ type: "spring", duration: 0.4, bounce: 0 }}
              onClick={handleClickClose}
            >
              <div ref={elementRef} className="flex flex-col items-start">
                <div className="flex w-full flex-row items-start justify-between gap-4">
                  <div>
                    <p className="text-light-950 dark:text-dark-950">
                      screenshot 2024-06-12 at 20.00.22
                    </p>
                    <p className="text-light-900 dark:text-dark-900">
                      No description
                    </p>
                  </div>

                  <button className="cursor-pointer" aria-label="Close Icon">
                    <CircleX size={16} />
                  </button>
                </div>
                <table className="text-light-950 dark:text-dark-950 flex w-full flex-col items-center gap-4">
                  <tbody className="w-full">
                    <tr className="flex w-full flex-row items-center gap-4">
                      <td className="w-1/2">Created</td>
                      <td className="text-light-900 dark:text-dark-900 w-1/2">
                        2 yrs ago
                      </td>
                    </tr>
                    <tr className="flex w-full flex-row items-center gap-4">
                      <td className="w-1/2">Updated</td>
                      <td className="text-light-900 dark:text-dark-900 w-1/2">
                        2 yrs ago
                      </td>
                    </tr>
                    <tr className="flex w-full flex-row items-center gap-4">
                      <td className="w-1/2">By</td>
                      <td className="w-1/2">Edu Calvo</td>
                    </tr>
                    <tr className="flex w-full flex-row items-center gap-4">
                      <td className="w-1/2">Source</td>
                      <td className="w-1/2 truncate">95d2a403ff12d7e3b</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}
