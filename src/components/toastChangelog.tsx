"use client"

import { useState } from "react"
import { BellDot, X } from "lucide-react"
import { toast } from "sonner"

import { changelogEntries } from "@/app/doc/data/changelog"

export default function ToastChangelog() {
  const [isToastOpen, setIsToastOpen] = useState(false)

  const handleClick = async () => {
    if (isToastOpen) return

    setIsToastOpen(true)
    const firstChangelog = changelogEntries[0]

    toast.custom(
      (t) => (
        <div>
          <p className="font-bold">Last changes: {firstChangelog.date}</p>
          <ul className="text-primary-foreground mt-1 list-disc pl-4">
            {firstChangelog.changes.map((change, index) => (
              <li key={index}>{change}</li>
            ))}
          </ul>
          <button
            aria-label="Dismiss changelog"
            className="hover:bg-background absolute top-2 right-2 cursor-pointer rounded-full p-1"
            onClick={() => {
              toast.dismiss(t)
              setIsToastOpen(false)
            }}
          >
            <X size={16} />
          </button>
        </div>
      ),
      {
        onAutoClose: () => {
          setIsToastOpen(false)
          console.log("Changelog auto close")
        },
      }
    )
  }

  return (
    <div className="flex h-auto w-auto cursor-pointer items-center justify-center gap-4 p-1">
      <BellDot
        size={20}
        onClick={handleClick}
        className={`hover:text-brand text-foreground ${isToastOpen ? "text-brand cursor-not-allowed" : "cursor-pointer"}`}
      />
    </div>
  )
}
