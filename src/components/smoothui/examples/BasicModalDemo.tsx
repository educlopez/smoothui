"use client"

import React, { useState } from "react"

import BasicModal from "../ui/BasicModal"

const ModalDemo = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4 p-8">
      <button
        onClick={() => setIsOpen(true)}
        className="bg-background cursor-pointer rounded-md border p-3 shadow-xs"
      >
        Open Modal
      </button>

      <BasicModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Beautiful Modal"
        size="md"
      >
        <div className="flex flex-col gap-4">
          <p>
            This is a beautiful animated modal with smooth entrance and exit
            animations. Click outside or press Escape to close.
          </p>
          <div className="flex flex-col gap-2">
            <h4 className="font-medium">Features:</h4>
            <ul className="list-inside list-disc space-y-1">
              <li>Smooth animations</li>
              <li>Backdrop blur effect</li>
              <li>Responsive design</li>
              <li>Keyboard navigation (ESC to close)</li>
            </ul>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-secondary rounded-lg border px-4 py-2 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="bg-candy hover:bg-candy-secondary rounded-lg px-4 py-2 text-white transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </BasicModal>
    </div>
  )
}

export default ModalDemo
