"use client"

import { useCallback, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { Share2, Trash2 } from "lucide-react"

import blueArt from "@/app/components/resources/images/blueart.jpeg"
import orangeArt from "@/app/components/resources/images/orangeart.jpeg"
import orangePurpleArt from "@/app/components/resources/images/oranpurart.jpeg"
import pinkArt from "@/app/components/resources/images/pinkart.jpeg"

interface ImageData {
  id: number
  src: string
}

const initialImages: ImageData[] = [
  { id: 1, src: blueArt.src },
  { id: 2, src: pinkArt.src },
  { id: 3, src: orangeArt.src },
  { id: 4, src: orangePurpleArt.src },
  { id: 5, src: blueArt.src },
  { id: 6, src: pinkArt.src },
  { id: 7, src: orangeArt.src },
  { id: 8, src: pinkArt.src },
  { id: 9, src: orangePurpleArt.src },
  { id: 10, src: pinkArt.src },
  { id: 11, src: orangeArt.src },
  { id: 12, src: blueArt.src },
]

const imageMap = new Map(initialImages.map((img) => [img.id, img]))

export default function ImageSelector() {
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
    <div className="flex h-full w-full flex-col justify-between p-4">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-black/20 to-transparent dark:from-black/50"></div>
      <div className="absolute left-5 right-5 top-5 z-20 flex justify-between p-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-full bg-light1/20 px-3 py-1 text-sm font-semibold text-white bg-blend-luminosity backdrop-blur-xl"
          onClick={handleReset}
        >
          Reset
        </motion.button>
        <button
          className="rounded-full bg-light1/20 px-3 py-1 text-sm font-semibold text-white bg-blend-luminosity backdrop-blur-xl"
          onClick={toggleSelecting}
        >
          {isSelecting ? "Cancel" : "Select"}
        </button>
      </div>
      <div className="absolute left-5 right-5 top-16 z-20 flex justify-between p-4">
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
                  <div className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-full border border-white bg-blue-500 text-white">
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
            className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between bg-light1/20 p-4 bg-blend-luminosity backdrop-blur-xl dark:bg-dark1/20"
          >
            <button className="text-blue-500">
              <Share2 size={24} />
            </button>
            <span className="text-light12 dark:text-dark12">
              {selectedImages.length} selected
            </span>
            <button
              className="text-blue-500"
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
