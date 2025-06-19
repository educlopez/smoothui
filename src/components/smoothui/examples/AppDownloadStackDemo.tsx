"use client"

import React, { useState } from "react"

import AppDownloadStack, { AppData } from "../ui/AppDownloadStack"

const demoApps: AppData[] = [
  {
    id: 1,
    name: "GitHub",
    icon: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/9c9721583ecba33e59ebcebdca2248fd_Mmr12FRh5V.png",
  },
  {
    id: 2,
    name: "Canary",
    icon: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/b47f43e02f04563447fa90d4ff6c8943_9KzW5GTggQ.png",
  },
  {
    id: 3,
    name: "Figma",
    icon: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/f0b9cdefa67b57eeb080278c2f6984cc_sCqUJBg6Qq.png",
  },
  {
    id: 4,
    name: "Arc",
    icon: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/178c7b02003c933e6b5afe98bbee595b_low_res_Arc_Browser.png",
  },
]

const AppDownloadStackDemo = () => {
  const [selected, setSelected] = useState<number[]>([])
  const [expanded, setExpanded] = useState(false)

  return (
    <AppDownloadStack
      apps={demoApps}
      title="Starter Mac"
      selectedApps={selected}
      onChange={setSelected}
      isExpanded={expanded}
      onExpandChange={setExpanded}
      onDownload={(selected) => alert(`Download apps: ${selected.join(", ")}`)}
    />
  )
}

export default AppDownloadStackDemo
