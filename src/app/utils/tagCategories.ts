import type { ComponentsProps } from "@/app/doc/data/typeComponent"

// Tag categories for better organization
export interface TagCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
  tags: string[]
}

export const TAG_CATEGORIES: TagCategory[] = [
  {
    id: "functionality",
    name: "Functionality",
    description:
      "Components organized by their primary use case and functionality",
    icon: "Puzzle",
    color: "blue",
    tags: [
      "button",
      "input",
      "display",
      "navigation",
      "overlay",
      "notification",
      "media",
      "animation",
      "text",
      "interaction",
    ],
  },
  {
    id: "technology",
    name: "Technology",
    description:
      "Components organized by the technology and implementation approach",
    icon: "Code",
    color: "green",
    tags: [
      "framer-motion",
      "canvas",
      "css-animations",
      "spring",
      "3d",
      "gradient",
      "blur",
      "morph",
    ],
  },
  {
    id: "platform",
    name: "Platform",
    description: "Components inspired by specific platforms and design systems",
    icon: "Smartphone",
    color: "purple",
    tags: ["ios", "apple", "mobile", "desktop", "adaptive"],
  },
  {
    id: "interaction",
    name: "Interaction",
    description: "Components organized by user interaction patterns",
    icon: "MousePointer",
    color: "orange",
    tags: ["hover", "click", "drag", "scroll", "gesture", "cursor", "follow"],
  },
  {
    id: "visual",
    name: "Visual Effects",
    description: "Components focused on visual effects and animations",
    icon: "Sparkles",
    color: "pink",
    tags: [
      "gradient",
      "blur",
      "morph",
      "reveal",
      "particle",
      "effects",
      "distortion",
      "wave",
    ],
  },
  {
    id: "usecase",
    name: "Use Cases",
    description: "Components organized by specific application domains",
    icon: "Target",
    color: "indigo",
    tags: [
      "ai",
      "social",
      "ecommerce",
      "dashboard",
      "portfolio",
      "blog",
      "form",
      "gallery",
      "calendar",
      "job",
      "profile",
      "account",
    ],
  },
  {
    id: "state",
    name: "States",
    description: "Components organized by their different states and behaviors",
    icon: "Activity",
    color: "red",
    tags: ["loading", "success", "error", "interactive", "states", "status"],
  },
]

/**
 * Get category for a specific tag
 */
export function getCategoryForTag(tag: string): TagCategory | undefined {
  return TAG_CATEGORIES.find((category) =>
    category.tags.some(
      (categoryTag) => categoryTag.toLowerCase() === tag.toLowerCase()
    )
  )
}

/**
 * Get all tags in a specific category
 */
export function getTagsInCategory(categoryId: string): string[] {
  const category = TAG_CATEGORIES.find((cat) => cat.id === categoryId)
  return category?.tags || []
}

/**
 * Get components organized by category
 */
export function getComponentsByCategory(
  components: ComponentsProps[],
  categoryId: string
): ComponentsProps[] {
  const categoryTags = getTagsInCategory(categoryId)

  return components.filter((component) =>
    component.tags?.some((tag) =>
      categoryTags.some(
        (categoryTag) => categoryTag.toLowerCase() === tag.toLowerCase()
      )
    )
  )
}

/**
 * Get tag statistics for a category
 */
export function getCategoryStats(
  components: ComponentsProps[],
  categoryId: string
): { tag: string; count: number }[] {
  const categoryTags = getTagsInCategory(categoryId)
  const tagCounts = new Map<string, number>()

  components.forEach((component) => {
    component.tags?.forEach((tag) => {
      if (
        categoryTags.some(
          (categoryTag) => categoryTag.toLowerCase() === tag.toLowerCase()
        )
      ) {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
      }
    })
  })

  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}

/**
 * Get all categories with their component counts
 */
export function getCategoriesWithCounts(
  components: ComponentsProps[]
): (TagCategory & { componentCount: number })[] {
  return TAG_CATEGORIES.map((category) => {
    const categoryComponents = getComponentsByCategory(components, category.id)
    return {
      ...category,
      componentCount: categoryComponents.length,
    }
  }).filter((category) => category.componentCount > 0)
}
