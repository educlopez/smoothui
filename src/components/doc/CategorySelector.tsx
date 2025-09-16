"use client"

import { useRouter } from "next/navigation"

interface CategorySelectorProps {
  value: string
  onValueChange: (value: string) => void
  className?: string
}

const categories = [
  {
    value: "components",
    label: "Components",
    path: "/doc/components",
  },
  {
    value: "blocks",
    label: "Blocks",
    path: "/doc/blocks",
  },
]

export function CategorySelector({
  value,
  onValueChange,
  className = "",
}: CategorySelectorProps) {
  const router = useRouter()

  const handleCategorySelect = (categoryValue: string) => {
    const category = categories.find((cat) => cat.value === categoryValue)
    if (category) {
      onValueChange(categoryValue)
      // Navigate to the category page
      router.push(category.path)
    }
  }

  const selectedIndex = categories.findIndex((cat) => cat.value === value)

  return (
    <div className={`relative my-2 px-1 md:my-0 ${className}`}>
      <div
        role="radiogroup"
        aria-required="false"
        dir="ltr"
        className="bg-background grid grid-cols-2 rounded-lg border p-0.5"
        aria-label="Select view"
        tabIndex={0}
        style={{ outline: "none" }}
      >
        {/* Animated background indicator */}
        <div
          className="bg-primary absolute top-1 bottom-1 left-2 rounded-md border"
          style={{
            width: "calc(50% - 8px)",
            transform: `translateX(${selectedIndex * 100}%)`,
            transition: "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />

        {categories.map((category) => {
          const isSelected = value === category.value

          return (
            <button
              key={category.value}
              type="button"
              data-state={isSelected ? "checked" : "unchecked"}
              value={category.label}
              className="hover:text-gray-1200 relative h-8 text-[13px] font-medium transition-colors"
              onClick={() => handleCategorySelect(category.value)}
              tabIndex={isSelected ? 0 : -1}
              aria-pressed={isSelected}
            >
              <span className="relative flex items-center justify-center gap-1.5 text-inherit">
                {category.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
