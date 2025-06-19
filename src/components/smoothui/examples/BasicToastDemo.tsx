"use client"

import React, { useState } from "react"
import { AnimatePresence } from "motion/react"

import BasicToast, { ToastType } from "@/components/smoothui/ui/BasicToast"

const BasicToastDemo = () => {
  const [showToast, setShowToast] = useState(false)
  const [toastType, setToastType] = useState<ToastType>("success")

  const handleShowToast = (type: ToastType) => {
    setToastType(type)
    setShowToast(true)
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleShowToast("success")}
          className="rounded-md bg-emerald-500 px-3 py-1.5 text-sm text-white hover:bg-emerald-600"
        >
          Success Toast
        </button>
        <button
          onClick={() => handleShowToast("error")}
          className="rounded-md bg-red-500 px-3 py-1.5 text-sm text-white hover:bg-red-600"
        >
          Error Toast
        </button>
        <button
          onClick={() => handleShowToast("warning")}
          className="rounded-md bg-amber-500 px-3 py-1.5 text-sm text-white hover:bg-amber-600"
        >
          Warning Toast
        </button>
        <button
          onClick={() => handleShowToast("info")}
          className="rounded-md bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600"
        >
          Info Toast
        </button>
      </div>
      <AnimatePresence>
        {showToast && (
          <BasicToast
            message={`This is a ${toastType} message example!`}
            type={toastType}
            duration={3000}
            onClose={() => setShowToast(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default BasicToastDemo
