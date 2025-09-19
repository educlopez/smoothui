"use client"

import { usePathname, useRouter } from "next/navigation"

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
  const pathname = usePathname()

  // Determine which category corresponds to the current pathname
  const getCurrentCategoryFromPath = () => {
    if (pathname.startsWith("/doc/blocks")) return "blocks"
    if (
      pathname.startsWith("/doc/components") ||
      pathname.startsWith("/doc/basic") ||
      pathname.startsWith("/doc/text") ||
      pathname.startsWith("/doc/ai")
    )
      return "components"
    return null
  }

  // Check if we're on a common page that doesn't belong to any category
  const isCommonPage = () => {
    return (
      pathname === "/doc" ||
      pathname === "/doc/installation" ||
      pathname === "/doc/design-principles" ||
      pathname === "/doc/changelog" ||
      pathname === "/doc/mcp"
    )
  }

  const currentCategoryFromPath = getCurrentCategoryFromPath()
  const isOnCommonPage = isCommonPage()

  const handleCategorySelect = (categoryValue: string) => {
    // Don't navigate if clicking on the current category
    if (categoryValue === currentCategoryFromPath) {
      return
    }

    const category = categories.find((cat) => cat.value === categoryValue)
    if (category) {
      onValueChange(categoryValue)
      // Navigate to the category page
      router.push(category.path)
    }
  }

  // If we're on a common page, don't show any selection
  const selectedIndex = isOnCommonPage
    ? -1
    : categories.findIndex((cat) => cat.value === value)

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
        {selectedIndex >= 0 && (
          <div
            className="from-brand to-brand-secondary shadow-custom-brand absolute top-1 bottom-1 left-2 rounded-md bg-gradient-to-b text-white"
            style={{
              width: "calc(50% - 8px)",
              transform: `translateX(${selectedIndex * 100}%)`,
              transition: "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        )}

        {categories.map((category) => {
          const isSelected = !isOnCommonPage && value === category.value
          const isCurrentCategory = category.value === currentCategoryFromPath
          const isDisabled = isCurrentCategory

          return (
            <button
              key={category.value}
              type="button"
              data-state={isSelected ? "checked" : "unchecked"}
              value={category.label}
              disabled={isDisabled}
              className={`relative h-8 text-[13px] font-medium transition-colors ${
                isDisabled
                  ? "cursor-not-allowed"
                  : "hover:text-foreground/70 cursor-pointer"
              } ${isSelected ? "text-white" : "text-foreground"}`}
              onClick={() => handleCategorySelect(category.value)}
              tabIndex={isSelected ? 0 : -1}
              aria-pressed={isSelected}
              aria-disabled={isDisabled}
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
