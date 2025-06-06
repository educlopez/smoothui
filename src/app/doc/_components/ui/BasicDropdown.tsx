"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

interface DropdownItem {
  id: string | number
  label: string
  icon?: React.ReactNode
}

interface BasicDropdownProps {
  label: string
  items: DropdownItem[]
  onChange?: (item: DropdownItem) => void
  className?: string
}

export default function BasicDropdown({
  label,
  items,
  onChange,
  className = "",
}: BasicDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<DropdownItem | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleItemSelect = (item: DropdownItem) => {
    setSelectedItem(item)
    setIsOpen(false)
    onChange?.(item)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="border-light-300 bg-light-100 hover:bg-light-200 dark:border-dark-300 dark:bg-dark-100 dark:hover:bg-dark-200 flex w-full items-center justify-between gap-2 rounded-lg border px-4 py-2 text-left transition-colors"
      >
        <span className="block truncate">
          {selectedItem ? selectedItem.label : label}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="border-light-300 bg-light-100 dark:border-dark-300 dark:bg-dark-100 absolute left-0 z-10 mt-1 w-full origin-top rounded-lg border shadow-lg"
            initial={{ opacity: 0, y: -10, scaleY: 0.8 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{
              opacity: 0,
              y: -10,
              scaleY: 0.8,
              transition: { duration: 0.2 },
            }}
            transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
          >
            <ul
              className="py-2"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="dropdown-button"
            >
              {items.map((item) => (
                <motion.li
                  key={item.id}
                  role="menuitem"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="block"
                  whileHover={{ x: 5 }}
                >
                  <button
                    onClick={() => handleItemSelect(item)}
                    className={`hover:bg-light-200 dark:hover:bg-dark-200 flex w-full items-center px-4 py-2 text-left text-sm ${
                      selectedItem?.id === item.id
                        ? "font-medium text-pink-500"
                        : ""
                    }`}
                  >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.label}

                    {selectedItem?.id === item.id && (
                      <motion.span
                        className="ml-auto"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <svg
                          className="h-4 w-4 text-pink-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </motion.span>
                    )}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function DropdownDemo() {
  const items = [
    { id: 1, label: "Small" },
    { id: 2, label: "Medium" },
    { id: 3, label: "Large" },
    { id: 4, label: "Extra Large" },
  ]

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
