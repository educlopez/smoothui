"use client"

import { useRouter } from "next/navigation"
import {
  Bot,
  Check,
  ChevronsUpDown,
  Grid3X3,
  Layers3,
  LayoutDashboard,
  Type,
  Zap,
} from "lucide-react"

import { Button } from "@/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface CategorySelectorProps {
  value: string
  onValueChange: (value: string) => void
  className?: string
}

const categories = [
  {
    value: "all",
    label: "All Categories",
    description: "Browse all components",
    icon: Grid3X3,
    path: "/doc",
  },
  {
    value: "components",
    label: "Components",
    description: "Interactive UI components",
    icon: LayoutDashboard,
    path: "/doc/components",
  },
  {
    value: "basic",
    label: "Basics",
    description: "Essential UI elements",
    icon: Layers3,
    path: "/doc/basic",
  },
  {
    value: "blocks",
    label: "Blocks",
    description: "Complete page sections",
    icon: Zap,
    path: "/doc/blocks",
  },
  {
    value: "text",
    label: "Text",
    description: "Typography and text effects",
    icon: Type,
    path: "/doc/text",
  },
  {
    value: "ai",
    label: "AI",
    description: "AI-powered components",
    icon: Bot,
    path: "/doc/ai",
  },
]

export function CategorySelector({
  value,
  onValueChange,
  className = "",
}: CategorySelectorProps) {
  const router = useRouter()
  const selectedCategory =
    categories.find((cat) => cat.value === value) || categories[0]
  const SelectedIcon = selectedCategory.icon

  const handleCategorySelect = (categoryValue: string) => {
    const category = categories.find((cat) => cat.value === categoryValue)
    if (category) {
      onValueChange(categoryValue)

      // Navigate to the category page
      router.push(category.path)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={`bg-background hover:bg-primary w-full justify-between border p-2 shadow-none ${className}`}
        >
          <div className="flex items-center gap-2">
            <SelectedIcon className="h-4 w-4" />
            <span>{selectedCategory.label}</span>
          </div>
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full min-w-[--radix-dropdown-menu-trigger-width]">
        {categories.map((category) => {
          const Icon = category.icon
          const isSelected = value === category.value

          return (
            <DropdownMenuItem
              key={category.value}
              onClick={() => handleCategorySelect(category.value)}
              className="hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center gap-2 rounded-lg p-1.5"
            >
              <div className="flex h-5 w-5 items-center justify-center">
                <Icon className="text-muted-foreground h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{category.label}</p>
                <p className="text-muted-foreground truncate text-xs">
                  {category.description}
                </p>
              </div>
              {isSelected && <Check className="text-primary h-3.5 w-3.5" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
