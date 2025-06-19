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
  title?: string
  selectable?: boolean
}

const defaultImages: ImageData[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1605478185737-99ae313e940c?=jpg&fit=crop&w=300&q=80&fit=max",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1564951434112-64d74cc2a2d7?=jpg&fit=crop&w=300&q=80&fit=max",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1612317248613-c1236be97f6f?=jpg&fit=crop&w=300&q=80&fit=max",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1603118675111-239b194fb8d8?=jpg&fit=crop&w=300&q=80&fit=max",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1605478185737-99ae313e940c?=jpg&fit=crop&w=300&q=80&fit=max",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1564951434112-64d74cc2a2d7?=jpg&fit=crop&w=300&q=80&fit=max",
  },
]

export default function InteractiveImageSelector({
  images = defaultImages,
  selectedImages: controlledSelected,
  onChange,
  onDelete,
  onShare,
  className = "",
  title = "Art Gallery",
  selectable = false,
}: InteractiveImageSelectorProps) {
  const [internalImages, setInternalImages] = useState<ImageData[]>(images)
  const [internalSelected, setInternalSelected] = useState<number[]>([])
  const [isSelecting, setIsSelecting] = useState(selectable)

  const selected = controlledSelected ?? internalSelected
  const imageMap = new Map(internalImages.map((img) => [img.id, img]))

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
    setInternalImages(images)
    if (onChange) {
      onChange([])
    } else {
      setInternalSelected([])
    }
    setIsSelecting(false)
  }, [images, onChange])

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
      <div className="from-background/20 dark:from-background/50 pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-linear-to-b to-transparent"></div>
      <div className="absolute top-5 right-5 left-5 z-20 flex justify-between p-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-background/20 text-foreground cursor-pointer rounded-full px-3 py-1 text-sm font-semibold bg-blend-luminosity backdrop-blur-xl"
          onClick={handleReset}
          aria-label="Reset selection"
        >
          Reset
        </motion.button>
        <button
          className="bg-background/20 text-foreground cursor-pointer rounded-full px-3 py-1 text-sm font-semibold bg-blend-luminosity backdrop-blur-xl"
          onClick={toggleSelecting}
          aria-label={isSelecting ? "Cancel selection" : "Select images"}
        >
          {isSelecting ? "Cancel" : "Select"}
        </button>
      </div>
      <div className="absolute top-16 right-5 left-5 z-20 flex justify-between p-4">
        <div className="flex items-center gap-2">
          <span className="text-foreground text-2xl font-bold">{title}</span>
        </div>
      </div>
      <motion.div className="grid grid-cols-3 gap-1 overflow-scroll" layout>
        <AnimatePresence>
          {internalImages.map((img) => (
            <motion.div
              key={img.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative aspect-square cursor-pointer"
              onClick={() => handleImageClick(img.id)}
            >
              <img
                src={img.src}
                alt={`Image ${img.id}`}
                className={`h-full w-full rounded-lg object-cover ${
                  selected.includes(img.id) && isSelecting ? "opacity-75" : ""
                }`}
                width={200}
                height={200}
                loading="lazy"
              />
              {isSelecting && selected.includes(img.id) && (
                <div className="absolute right-2 bottom-2 flex h-6 w-6 items-center justify-center rounded-full border border-white bg-blue-500 text-white">
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
            className="bg-background/20 /20 absolute right-0 bottom-0 left-0 z-10 flex items-center justify-between p-4 bg-blend-luminosity backdrop-blur-xl"
          >
            <button
              className="cursor-pointer text-blue-500"
              onClick={handleShare}
            >
              <Share2 size={24} />
            </button>
            <span className="text-foreground">{selected.length} selected</span>
            <button
              className="cursor-pointer text-blue-500"
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
