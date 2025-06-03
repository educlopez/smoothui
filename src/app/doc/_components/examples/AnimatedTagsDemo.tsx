"use client"

import React, { useState } from "react"

import AnimatedTags from "../smoothui/AnimatedTags"

const initialTags = [
  "react",
  "tailwindcss",
  "javascript",
  "typescript",
  "nextjs",
]

const AnimatedTagsDemo = () => {
  const [selected, setSelected] = useState<string[]>([])
  return (
    <div>
      <AnimatedTags
        initialTags={initialTags}
        selectedTags={selected}
        onChange={setSelected}
      />
    </div>
  )
}

export default AnimatedTagsDemo
