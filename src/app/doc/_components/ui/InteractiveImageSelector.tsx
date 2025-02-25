"use client"

import { useCallback, useState } from "react"
import Image from "next/image" // Only if you're using nextjs
import { Share2, Trash2 } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

const pinkArt =
  "https://images.unsplash.com/photo-1564951434112-64d74cc2a2d7?=jpg&fit=crop&w=300&q=80&fit=max"

const orangePurpleArt =
  "https://images.unsplash.com/photo-1603118675111-239b194fb8d8?=jpg&fit=crop&w=300&q=80&fit=max"

const orangeArt =
  "https://images.unsplash.com/photo-1612317248613-c1236be97f6f?=jpg&fit=crop&w=300&q=80&fit=max"

const blueArt =
  "https://images.unsplash.com/photo-1605478185737-99ae313e940c?=jpg&fit=crop&w=300&q=80&fit=max"

interface ImageData {
  id: number
  src: string
}

const initialImages: ImageData[] = [
  { id: 1, src: blueArt },
  { id: 2, src: pinkArt },
  { id: 3, src: orangeArt },
  { id: 4, src: orangePurpleArt },
  { id: 5, src: blueArt },
  { id: 6, src: pinkArt },
  { id: 7, src: orangeArt },
  { id: 8, src: pinkArt },
  { id: 9, src: orangePurpleArt },
  { id: 10, src: pinkArt },
  { id: 11, src: orangeArt },
  { id: 12, src: blueArt },
]

const imageMap = new Map(initialImages.map((img) => [img.id, img]))

export default function InteractiveImageSelector() {
  const [images, setImages] = useState<number[]>(
    initialImages.map((img) => img.id)
  )
  const [selectedImages, setSelectedImages] = useState<number[]>([])
  const [isSelecting, setIsSelecting] = useState(false)

  const handleImageClick = useCallback(
    (id: number) => {
      if (!isSelecting) return
      setSelectedImages((prev) =>
        prev.includes(id) ? prev.filter((imgId) => imgId !== id) : [...prev, id]
      )
    },
    [isSelecting]
  )

  const handleDelete = useCallback(() => {
    setImages((prev) => prev.filter((id) => !selectedImages.includes(id)))
    setSelectedImages([])
  }, [selectedImages])

  const handleReset = useCallback(() => {
    setImages(initialImages.map((img) => img.id))
    setSelectedImages([])
    setIsSelecting(false)
  }, [])

  const toggleSelecting = useCallback(() => {
    setIsSelecting((prev) => !prev)
    if (isSelecting) setSelectedImages([])
  }, [isSelecting])

  return (
    <div className="relative flex h-full w-full max-w-[500px] flex-col justify-between p-4">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-linear-to-b from-black/20 to-transparent dark:from-black/50"></div>
      <div className="absolute top-5 right-5 left-5 z-20 flex justify-between p-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-light-50/20 cursor-pointer rounded-full px-3 py-1 text-sm font-semibold text-white bg-blend-luminosity backdrop-blur-xl"
          onClick={handleReset}
          aria-label="Reset selection"
        >
          Reset
        </motion.button>
        <button
          className="bg-light-50/20 cursor-pointer rounded-full px-3 py-1 text-sm font-semibold text-white bg-blend-luminosity backdrop-blur-xl"
          onClick={toggleSelecting}
          aria-label={isSelecting ? "Cancel selection" : "Select images"}
        >
          {isSelecting ? "Cancel" : "Select"}
        </button>
      </div>
      <div className="absolute top-16 right-5 left-5 z-20 flex justify-between p-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-white">Art Gallery</span>
        </div>
      </div>
      <motion.div className="grid grid-cols-3 gap-1 overflow-scroll" layout>
        <AnimatePresence>
          {images.map((id) => {
            const image = imageMap.get(id)
            if (!image) return null

            return (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative aspect-square cursor-pointer"
                onClick={() => handleImageClick(image.id)}
              >
                <Image
                  src={image.src}
                  alt={`Image ${image.id}`}
                  className={`h-full w-full rounded-lg object-cover ${
                    selectedImages.includes(image.id) && isSelecting
                      ? "opacity-75"
                      : ""
                  }`}
                  width={200}
                  height={200}
                  loading="lazy"
                />
                {isSelecting && selectedImages.includes(image.id) && (
                  <div className="absolute right-2 bottom-2 flex h-6 w-6 items-center justify-center rounded-full border border-white bg-blue-500 text-white">
                    ✓
                  </div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>
      <AnimatePresence>
        {isSelecting && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-light-50/20 dark:bg-dark-50/20 absolute right-0 bottom-0 left-0 z-10 flex items-center justify-between p-4 bg-blend-luminosity backdrop-blur-xl"
          >
            <button className="cursor-pointer text-blue-500">
              <Share2 size={24} />
            </button>
            <span className="text-light-950 dark:text-dark-950">
              {selectedImages.length} selected
            </span>
            <button
              className="cursor-pointer text-blue-500"
              onClick={handleDelete}
              disabled={selectedImages.length === 0}
            >
              <Trash2 size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
