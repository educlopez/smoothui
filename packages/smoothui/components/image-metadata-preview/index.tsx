"use client";

import { ChevronUp, CircleX, Share } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import useMeasure from "react-use-measure";

export type ImageMetadata = {
  created: string;
  updated: string;
  by: string;
  source: string;
};

export type ImageMetadataPreviewProps = {
  imageSrc: string;
  alt?: string;
  filename?: string;
  description?: string;
  metadata: ImageMetadata;
  onShare?: () => void;
};

export default function ImageMetadataPreview({
  imageSrc,
  alt = "Image preview",
  filename = "screenshot.png",
  description = "No description",
  metadata,
  onShare,
}: ImageMetadataPreviewProps) {
  const [openInfo, setopenInfo] = useState(false);
  const [elementRef, bounds] = useMeasure();
  const shouldReduceMotion = useReducedMotion();

  const handleClickOpen = () => {
    setopenInfo((b) => !b);
  };

  const handleClickClose = () => {
    setopenInfo((b) => !b);
  };

  return (
    <div className="absolute bottom-10 flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={shouldReduceMotion ? {} : { y: -bounds.height }}
        className="pointer-events-none overflow-hidden rounded-xl"
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.25 }}
      >
        {/* biome-ignore lint/performance/noImgElement: Using img for image preview without Next.js Image optimizations */}
        <img alt={alt} height={437} src={imageSrc} width={300} />
      </motion.div>

      <div className="relative flex w-full flex-col items-center gap-4">
        <div className="relative flex w-full flex-row items-center justify-center gap-4">
          <button
            aria-label="Share"
            className="rounded-full border bg-background p-3 transition"
            disabled={!onShare}
            onClick={onShare}
            type="button"
          >
            <Share size={16} />
          </button>
          <button
            aria-label="Connect"
            className="cursor-not-allowed rounded-full border bg-background px-4 py-3 text-sm transition disabled:opacity-50"
            disabled
            type="button"
          >
            Connect
          </button>
          <AnimatePresence>
            {openInfo ? null : (
              <motion.button
                animate={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : { opacity: 1, filter: "blur(0px)" }
                }
                aria-label="Open Metadata Preview"
                className="cursor-pointer border bg-background p-3 shadow-xs transition"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, filter: "blur(4px)" }}
                onClick={handleClickOpen}
                style={{ borderRadius: 100 }}
                transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
              >
                <ChevronUp size={16} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {openInfo ? (
            <motion.div
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, filter: "blur(0px)" }
              }
              className="absolute bottom-0 w-full cursor-pointer gap-4 border bg-background p-5 shadow-xs"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, filter: "blur(4px)" }}
              onClick={handleClickClose}
              style={{ borderRadius: 20 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { type: "spring", duration: 0.25, bounce: 0 }
              }
            >
              <div className="flex flex-col items-start" ref={elementRef}>
                <div className="flex w-full flex-row items-start justify-between gap-4">
                  <div>
                    <p className="text-foreground">{filename}</p>
                    <p className="text-primary-foreground">{description}</p>
                  </div>

                  <button
                    aria-label="Close Icon"
                    className="cursor-pointer"
                    type="button"
                  >
                    <CircleX size={16} />
                  </button>
                </div>
                <table className="flex w-full flex-col items-center gap-4 text-foreground">
                  <tbody className="w-full">
                    <tr className="flex w-full flex-row items-center gap-4">
                      <td className="w-1/2">Created</td>
                      <td className="w-1/2 text-primary-foreground">
                        {metadata.created}
                      </td>
                    </tr>
                    <tr className="flex w-full flex-row items-center gap-4">
                      <td className="w-1/2">Updated</td>
                      <td className="w-1/2 text-primary-foreground">
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
  );
}
