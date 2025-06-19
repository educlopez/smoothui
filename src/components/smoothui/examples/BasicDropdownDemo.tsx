"use client"

import React from "react"

import BasicDropdown from "@/components/smoothui/ui/BasicDropdown"

const items = [
  { id: 1, label: "Small" },
  { id: 2, label: "Medium" },
  { id: 3, label: "Large" },
  { id: 4, label: "Extra Large" },
]

const DropdownDemo = () => {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4 p-8">
      <h3 className="text-lg font-medium">Select a size</h3>
      <BasicDropdown
        label="Choose a size"
        items={items}
        onChange={(item) => console.log("Selected:", item.label)}
      />
    </div>
  )
}

export default DropdownDemo
