"use client"

import React, { useState } from "react"

import InteractiveImageSelector, {
  ImageData,
} from "../smoothui/InteractiveImageSelector"

const demoImages: ImageData[] = [
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

const InteractiveImageSelectorDemo = () => {
  const [selected, setSelected] = useState<number[]>([])
  const [images, setImages] = useState<ImageData[]>(demoImages)

  return (
    <InteractiveImageSelector
      images={images}
      selectedImages={selected}
      onChange={setSelected}
      onDelete={(deleted) =>
        setImages((imgs) => imgs.filter((img) => !deleted.includes(img.id)))
      }
      onShare={(selected) => alert(`Share images: ${selected.join(", ")}`)}
      title="Demo Gallery"
      selectable={false}
    />
  )
}

export default InteractiveImageSelectorDemo
