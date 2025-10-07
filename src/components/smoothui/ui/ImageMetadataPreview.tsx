"use client"

import { useState } from "react"
import { ChevronUp, CircleX, Share } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import useMeasure from "react-use-measure"

export interface ImageMetadata {
  created: string
  updated: string
  by: string
  source: string
}

export interface ImageMetadataPreviewProps {
  imageSrc: string
  alt?: string
  filename?: string
  description?: string
  metadata: ImageMetadata
  onShare?: () => void
}

export default function ImageMetadataPreview({
  imageSrc,
  alt = "Image preview",
  filename = "screenshot.png",
  description = "No description",
  metadata,
  onShare,
}: ImageMetadataPreviewProps) {
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
        <img src={imageSrc} alt={alt} width={300} height={437} />
      </motion.div>

      <div className="relative flex w-full flex-col items-center gap-4">
        <div className="relative flex w-full flex-row items-center justify-center gap-4">
          <button
            type="button"
            aria-label="Share"
            className="bg-background rounded-full border p-3 transition"
            onClick={onShare}
            disabled={!onShare}
          >
            <Share size={16} />
          </button>
          <button
            type="button"
            disabled
            aria-label="Connect"
            className="bg-background cursor-not-allowed rounded-full border px-4 py-3 text-sm transition disabled:opacity-50"
          >
            Connect
          </button>
          <AnimatePresence>
            {!openInfo ? (
              <motion.button
                className="bg-background cursor-pointer border p-3 shadow-xs transition"
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
              className="bg-background absolute bottom-0 w-full cursor-pointer gap-4 border p-5 shadow-xs"
              style={{ borderRadius: 20 }}
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ type: "spring", duration: 0.4, bounce: 0 }}
              onClick={handleClickClose}
            >
              <div ref={elementRef} className="flex flex-col items-start">
                <div className="flex w-full flex-row items-start justify-between gap-4">
                  <div>
                    <p className="text-foreground">{filename}</p>
                    <p className="text-primary-foreground">{description}</p>
                  </div>

                  <button
                    type="button"
                    className="cursor-pointer"
                    aria-label="Close Icon"
                  >
                    <CircleX size={16} />
                  </button>
                </div>
                <table className="text-foreground flex w-full flex-col items-center gap-4">
                  <tbody className="w-full">
                    <tr className="flex w-full flex-row items-center gap-4">
                      <td className="w-1/2">Created</td>
                      <td className="text-primary-foreground w-1/2">
                        {metadata.created}
                      </td>
                    </tr>
                    <tr className="flex w-full flex-row items-center gap-4">
                      <td className="w-1/2">Updated</td>
                      <td className="text-primary-foreground w-1/2">
                        {metadata.updated}
                      </td>
                    </tr>
                    <tr className="flex w-full flex-row items-center gap-4">
                      <td className="w-1/2">By</td>
                      <td className="w-1/2">{metadata.by}</td>
                    </tr>
                    <tr className="flex w-full flex-row items-center gap-4">
                      <td className="w-1/2">Source</td>
                      <td className="w-1/2 truncate">{metadata.source}</td>
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
