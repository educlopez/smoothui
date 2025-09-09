import { aiComponents } from "@/app/doc/data/aiComponents"
import { basicComponents } from "@/app/doc/data/basicComponents"
import { components } from "@/app/doc/data/components"
import { textComponents } from "@/app/doc/data/textComponentes"
import type { ComponentsProps } from "@/app/doc/data/typeComponent"

// Combine all components for searching
const allComponents = [
  ...components,
  ...basicComponents,
  ...textComponents,
  ...aiComponents,
]

/**
 * Find related components based on tags, collection, and use cases
 */
export function findRelatedComponents(
  currentComponent: ComponentsProps,
  limit: number = 4
): ComponentsProps[] {
  const currentTags = currentComponent.tags || []
  const currentCollection = currentComponent.collection
  const currentSlug = currentComponent.slug

  // If component has predefined related components, use those first
  if (currentComponent.relatedComponents) {
    const predefined = currentComponent.relatedComponents
      .map((slug) => allComponents.find((c) => c.slug === slug))
      .filter(Boolean) as ComponentsProps[]

    if (predefined.length >= limit) {
      return predefined.slice(0, limit)
    }
  }

  // Score components based on similarity
  const scoredComponents = allComponents
    .filter((comp) => comp.slug !== currentSlug) // Exclude current component
    .map((comp) => {
      let score = 0

      // Same collection gets high score
      if (comp.collection === currentCollection) {
        score += 10
      }

      // Shared tags get points
      const sharedTags =
        comp.tags?.filter((tag) => currentTags.includes(tag)) || []
      score += sharedTags.length * 3

      // Same type gets points
      if (comp.type === currentComponent.type) {
        score += 2
      }

      // Similar use cases (based on component title and info)
      const currentText =
        `${currentComponent.componentTitle} ${currentComponent.info}`.toLowerCase()
      const compText = `${comp.componentTitle} ${comp.info}`.toLowerCase()

      // Simple keyword matching for similar functionality
      const keywords = [
        "button",
        "card",
        "modal",
        "input",
        "animation",
        "hover",
        "click",
        "interactive",
      ]
      keywords.forEach((keyword) => {
        if (currentText.includes(keyword) && compText.includes(keyword)) {
          score += 1
        }
      })

      return { component: comp, score }
    })
    .filter((item) => item.score > 0) // Only include components with some similarity
    .sort((a, b) => b.score - a.score) // Sort by score descending
    .slice(0, limit)
    .map((item) => item.component)

  return scoredComponents
}

/**
 * Find components by tag
 */
export function findComponentsByTag(tag: string): ComponentsProps[] {
  return allComponents.filter((comp) =>
    comp.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())
  )
}

/**
 * Get all unique tags across all components
 */
export function getAllTags(): string[] {
  const tagSet = new Set<string>()
  allComponents.forEach((comp) => {
    comp.tags?.forEach((tag) => tagSet.add(tag))
  })
  return Array.from(tagSet).sort()
}

/**
 * Search components by query
 */
export function searchComponents(query: string): ComponentsProps[] {
  const lowercaseQuery = query.toLowerCase()

  return allComponents.filter((comp) => {
    const searchableText = [
      comp.componentTitle,
      comp.info,
      ...(comp.tags || []),
      comp.collection || "",
    ]
      .join(" ")
      .toLowerCase()

    return searchableText.includes(lowercaseQuery)
  })
}

/**
 * Get component by slug
 */
export function getComponentBySlug(slug: string): ComponentsProps | undefined {
  return allComponents.find((comp) => comp.slug === slug)
}

/**
 * Get popular tags (most used tags)
 */
export function getPopularTags(
  limit: number = 10
): { tag: string; count: number }[] {
  const tagCounts = new Map<string, number>()

  allComponents.forEach((comp) => {
    comp.tags?.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
    })
  })

  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}
