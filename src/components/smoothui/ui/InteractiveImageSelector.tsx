"use client"

import { useCallback, useState } from "react"
import { Share2, Trash2 } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

export interface ImageData {
  id: number
  src: string
}

export interface InteractiveImageSelectorProps {
  images?: ImageData[]
  selectedImages?: number[]
  onChange?: (selected: number[]) => void
  onDelete?: (deleted: number[]) => void
  onShare?: (selected: number[]) => void
  className?: string
  selectable?: boolean
}

const defaultImages: ImageData[] = [
  {
    id: 1,
    src: "https://res.cloudinary.com/dyzxnud9z/image/upload/w_300,ar_1:1,c_fill,g_auto/v1758270763/smoothui/womanorange.webp",
  },
  {
    id: 2,
    src: "https://res.cloudinary.com/dyzxnud9z/image/upload/w_300,ar_1:1,c_fill,g_auto/v1758209962/smoothui/girl-nature.webp",
  },
  {
    id: 3,
    src: "https://res.cloudinary.com/dyzxnud9z/image/upload/w_300,ar_1:1,c_fill,g_auto/v1758271088/smoothui/metrowoman.webp",
  },
  {
    id: 4,
    src: "https://res.cloudinary.com/dyzxnud9z/image/upload/w_300,ar_1:1,c_fill,g_auto/v1758271134/smoothui/designerworking.webp",
  },
  {
    id: 5,
    src: "https://res.cloudinary.com/dyzxnud9z/image/upload/w_300,ar_1:1,c_fill,g_auto/v1758271305/smoothui/girlglass.webp",
  },
  {
    id: 6,
    src: "https://res.cloudinary.com/dyzxnud9z/image/upload/w_300,ar_1:1,c_fill,g_auto/v1758271369/smoothui/manup.webp",
  },
]

export default function InteractiveImageSelector({
  images = defaultImages,
  selectedImages: controlledSelected,
  onChange,
  onDelete,
  onShare,
  className = "",
  selectable = false,
}: InteractiveImageSelectorProps) {
  const [originalImages] = useState<ImageData[]>(images)
  const [internalImages, setInternalImages] = useState<ImageData[]>(images)
  const [internalSelected, setInternalSelected] = useState<number[]>([])
  const [isSelecting, setIsSelecting] = useState(selectable)
  const [isResetting, setIsResetting] = useState(false)

  const selected = controlledSelected ?? internalSelected

  const handleImageClick = useCallback(
    (id: number) => {
      if (!isSelecting) return
      const newSelected = selected.includes(id)
        ? selected.filter((imgId) => imgId !== id)
        : [...selected, id]
      if (onChange) {
        onChange(newSelected)
      } else {
        setInternalSelected(newSelected)
      }
    },
    [isSelecting, selected, onChange]
  )

  const handleDelete = useCallback(() => {
    const newImages = internalImages.filter((img) => !selected.includes(img.id))
    if (onDelete) {
      onDelete(selected)
    }
    setInternalImages(newImages)
    if (onChange) {
      onChange([])
    } else {
      setInternalSelected([])
    }
  }, [selected, internalImages, onDelete, onChange])

  const handleReset = useCallback(() => {
    setIsResetting(true)

    // Add a small delay to show the reset animation
    setTimeout(() => {
      setInternalImages(originalImages)
      if (onChange) {
        onChange([])
      } else {
        setInternalSelected([])
      }
      setIsSelecting(false)
      setIsResetting(false)
    }, 200)
  }, [originalImages, onChange])

  const toggleSelecting = useCallback(() => {
    setIsSelecting((prev) => !prev)
    if (isSelecting) {
      if (onChange) {
        onChange([])
      } else {
        setInternalSelected([])
      }
    }
  }, [isSelecting, onChange])

  const handleShare = useCallback(() => {
    if (onShare) onShare(selected)
  }, [onShare, selected])

  return (
    <div
      className={`relative flex h-full w-full max-w-[500px] flex-col justify-between p-4 ${className}`}
    >
      <div className="from-primary/80 dark:from-background/50 pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-linear-to-b to-transparent"></div>
      <div className="absolute top-5 right-5 left-5 z-20 flex justify-between p-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ rotate: 0 }}
          animate={
            isResetting ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}
          }
          exit={{ rotate: 0 }}
          transition={{ duration: 0.3 }}
          className={`cursor-pointer rounded-full px-3 py-1 text-sm font-semibold bg-blend-luminosity backdrop-blur-xl transition-colors ${
            isResetting
              ? "bg-brand/30 text-white"
              : "bg-background/20 text-foreground"
          }`}
          onClick={handleReset}
          disabled={isResetting}
          aria-label="Reset selection"
        >
          {isResetting ? "Resetting..." : "Reset"}
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ rotate: 0 }}
          animate={
            isSelecting ? { scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] } : {}
          }
          exit={{ rotate: 0 }}
          transition={{ duration: 0.3 }}
          className={`cursor-pointer rounded-full px-3 py-1 text-sm font-semibold bg-blend-luminosity backdrop-blur-xl ${
            isSelecting
              ? "bg-brand/30 text-white"
              : "text-foreground bg-background/20"
          }`}
          onClick={toggleSelecting}
          aria-label={isSelecting ? "Cancel selection" : "Select images"}
        >
          {isSelecting ? "Cancel" : "Select"}
        </motion.button>
      </div>

      <motion.div
        className="grid grid-cols-3 gap-1 overflow-scroll"
        layout
        animate={isResetting ? { scale: [1, 0.95, 1] } : {}}
        transition={{ duration: 0.2 }}
      >
        <AnimatePresence>
          {internalImages.map((img) => (
            <motion.div
              key={img.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: isResetting ? [1, 0.9, 1] : 1,
                rotate: isResetting ? [0, 2, -2, 0] : 0,
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                duration: isResetting ? 0.3 : undefined,
              }}
              className="relative aspect-square cursor-pointer"
              onClick={() => handleImageClick(img.id)}
            >
              <img
                src={img.src}
                alt={`Gallery item ${img.id}`}
                className={`h-full w-full rounded-lg object-cover ${
                  selected.includes(img.id) && isSelecting ? "opacity-75" : ""
                }`}
                width={200}
                height={200}
                loading="lazy"
              />
              {isSelecting && selected.includes(img.id) && (
                <div className="bg-brand absolute right-2 bottom-2 flex h-6 w-6 items-center justify-center rounded-full border border-white text-white">
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-background/20 absolute right-2 bottom-0 left-1/2 z-10 flex w-2/3 -translate-x-1/2 items-center justify-between rounded-full p-4 bg-blend-luminosity backdrop-blur-md"
          >
            <button
              type="button"
              className="text-brand cursor-pointer"
              onClick={handleShare}
            >
              <Share2 size={24} />
            </button>
            <span className="text-foreground">{selected.length} selected</span>
            <button
              type="button"
              className="text-brand cursor-pointer"
              onClick={handleDelete}
              disabled={selected.length === 0}
            >
              <Trash2 size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
