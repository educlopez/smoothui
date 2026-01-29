"use client";

import { Share2, Trash2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useState } from "react";

const RESET_DELAY = 200;
const RESET_SCALE_START = 1;
const RESET_SCALE_PEAK = 1.1;
const RESET_SCALE_END = 1;
const RESET_ROTATE_START = 0;
const RESET_ROTATE_POSITIVE = 5;
const RESET_ROTATE_NEGATIVE = -5;
const SELECT_SCALE_START = 1;
const SELECT_SCALE_PEAK = 1.1;
const SELECT_SCALE_END = 1;
const SELECT_ROTATE_START = 0;
const SELECT_ROTATE_NEGATIVE = -5;
const SELECT_ROTATE_POSITIVE = 5;
const CONTAINER_SCALE_START = 1;
const CONTAINER_SCALE_MIN = 0.95;
const CONTAINER_SCALE_END = 1;
const ITEM_SCALE_START = 1;
const ITEM_SCALE_MIN = 0.9;
const ITEM_SCALE_END = 1;
const ITEM_ROTATE_START = 0;
const ITEM_ROTATE_POSITIVE = 2;
const ITEM_ROTATE_NEGATIVE = -2;
const RESET_ANIMATION_DURATION = 0.3;

export interface ImageData {
  id: number;
  src: string;
}

export interface InteractiveImageSelectorProps {
  images: ImageData[];
  selectedImages?: number[];
  onChange?: (selected: number[]) => void;
  onDelete?: (deleted: number[]) => void;
  onShare?: (selected: number[]) => void;
  className?: string;
  selectable?: boolean;
}

export default function InteractiveImageSelector({
  images,
  selectedImages: controlledSelected,
  onChange,
  onDelete,
  onShare,
  className = "",
  selectable = false,
}: InteractiveImageSelectorProps) {
  const [originalImages] = useState<ImageData[]>(images);
  const [internalImages, setInternalImages] = useState<ImageData[]>(images);
  const [internalSelected, setInternalSelected] = useState<number[]>([]);
  const [isSelecting, setIsSelecting] = useState(selectable);
  const [isResetting, setIsResetting] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const selected = controlledSelected ?? internalSelected;

  const handleImageClick = useCallback(
    (id: number) => {
      if (!isSelecting) {
        return;
      }
      const newSelected = selected.includes(id)
        ? selected.filter((imgId) => imgId !== id)
        : [...selected, id];
      if (onChange) {
        onChange(newSelected);
      } else {
        setInternalSelected(newSelected);
      }
    },
    [isSelecting, selected, onChange]
  );

  const handleDelete = useCallback(() => {
    const newImages = internalImages.filter(
      (img) => !selected.includes(img.id)
    );
    if (onDelete) {
      onDelete(selected);
    }
    setInternalImages(newImages);
    if (onChange) {
      onChange([]);
    } else {
      setInternalSelected([]);
    }
  }, [selected, internalImages, onDelete, onChange]);

  const handleReset = useCallback(() => {
    setIsResetting(true);

    // Add a small delay to show the reset animation
    setTimeout(() => {
      setInternalImages(originalImages);
      if (onChange) {
        onChange([]);
      } else {
        setInternalSelected([]);
      }
      setIsSelecting(false);
      setIsResetting(false);
    }, RESET_DELAY);
  }, [originalImages, onChange]);

  const toggleSelecting = useCallback(() => {
    setIsSelecting((prev) => !prev);
    if (isSelecting) {
      if (onChange) {
        onChange([]);
      } else {
        setInternalSelected([]);
      }
    }
  }, [isSelecting, onChange]);

  const handleShare = useCallback(() => {
    if (onShare) {
      onShare(selected);
    }
  }, [onShare, selected]);

  return (
    <div
      className={`relative flex h-full w-full max-w-[500px] flex-col justify-between p-4 ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-linear-to-b from-primary/80 to-transparent dark:from-background/50" />
      <div className="absolute top-5 right-5 left-5 z-20 flex justify-between p-4">
        <motion.button
          animate={
            shouldReduceMotion || !isResetting
              ? {}
              : {
                  scale: [RESET_SCALE_START, RESET_SCALE_PEAK, RESET_SCALE_END],
                  rotate: [
                    RESET_ROTATE_START,
                    RESET_ROTATE_POSITIVE,
                    RESET_ROTATE_NEGATIVE,
                    RESET_ROTATE_START,
                  ],
                }
          }
          aria-label="Reset selection"
          className={`cursor-pointer rounded-full px-3 py-1 font-semibold text-sm bg-blend-luminosity backdrop-blur-xl transition-colors ${
            isResetting
              ? "bg-brand/30 text-white"
              : "bg-background/20 text-foreground"
          }`}
          disabled={isResetting}
          exit={shouldReduceMotion ? {} : { rotate: 0 }}
          initial={shouldReduceMotion ? {} : { rotate: 0 }}
          onClick={handleReset}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.25 }}
          whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
        >
          {isResetting ? "Resetting..." : "Reset"}
        </motion.button>
        <motion.button
          animate={
            isSelecting
              ? {
                  scale: [
                    SELECT_SCALE_START,
                    SELECT_SCALE_PEAK,
                    SELECT_SCALE_END,
                  ],
                  rotate: [
                    SELECT_ROTATE_START,
                    SELECT_ROTATE_NEGATIVE,
                    SELECT_ROTATE_POSITIVE,
                    SELECT_ROTATE_START,
                  ],
                }
              : {}
          }
          aria-label={isSelecting ? "Cancel selection" : "Select images"}
          className={`cursor-pointer rounded-full px-3 py-1 font-semibold text-sm bg-blend-luminosity backdrop-blur-xl ${
            isSelecting
              ? "bg-brand/30 text-white"
              : "bg-background/20 text-foreground"
          }`}
          exit={{ rotate: 0 }}
          initial={{ rotate: 0 }}
          onClick={toggleSelecting}
          transition={{ duration: 0.3 }}
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSelecting ? "Cancel" : "Select"}
        </motion.button>
      </div>

      <motion.div
        animate={
          shouldReduceMotion || !isResetting
            ? {}
            : {
                scale: [
                  CONTAINER_SCALE_START,
                  CONTAINER_SCALE_MIN,
                  CONTAINER_SCALE_END,
                ],
              }
        }
        className="grid grid-cols-3 gap-1 overflow-scroll"
        layout={!shouldReduceMotion}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
      >
        <AnimatePresence>
          {internalImages.map((img) => (
            <motion.div
              animate={{
                opacity: 1,
                scale: isResetting
                  ? [ITEM_SCALE_START, ITEM_SCALE_MIN, ITEM_SCALE_END]
                  : 1,
                rotate: isResetting
                  ? [
                      ITEM_ROTATE_START,
                      ITEM_ROTATE_POSITIVE,
                      ITEM_ROTATE_NEGATIVE,
                      ITEM_ROTATE_START,
                    ]
                  : 0,
              }}
              className="relative aspect-square cursor-pointer"
              exit={{ opacity: 0, scale: 0.8 }}
              initial={{ opacity: 0, scale: 0.8 }}
              key={img.id}
              layout
              onClick={() => handleImageClick(img.id)}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                duration: isResetting ? RESET_ANIMATION_DURATION : undefined,
              }}
            >
              {/* biome-ignore lint/performance/noImgElement: Using img for gallery images without Next.js Image optimizations */}
              <img
                alt={`Gallery item ${img.id}`}
                className={`h-full w-full rounded-lg object-cover ${
                  selected.includes(img.id) && isSelecting ? "opacity-75" : ""
                }`}
                height={200}
                loading="lazy"
                src={img.src}
                width={200}
              />
              {isSelecting && selected.includes(img.id) && (
                <div className="absolute right-2 bottom-2 flex h-6 w-6 items-center justify-center rounded-full border border-white bg-brand text-white">
                  ✓
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      <AnimatePresence>
        {isSelecting && (
          <motion.div
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            className="absolute right-2 bottom-0 left-1/2 z-10 flex w-2/3 -translate-x-1/2 items-center justify-between rounded-full bg-background/20 p-4 bg-blend-luminosity backdrop-blur-md"
            exit={
              shouldReduceMotion
                ? { opacity: 0, transition: { duration: 0 } }
                : { opacity: 0, y: 20 }
            }
            initial={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }
            }
            transition={
              shouldReduceMotion ? { duration: 0 } : { duration: 0.25 }
            }
          >
            <button
              className="cursor-pointer text-brand"
              onClick={handleShare}
              type="button"
            >
              <Share2 size={24} />
            </button>
            <span className="text-foreground">{selected.length} selected</span>
            <button
              className="cursor-pointer text-brand"
              disabled={selected.length === 0}
              onClick={handleDelete}
              type="button"
            >
              <Trash2 size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
