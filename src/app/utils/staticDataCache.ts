import { aiComponents } from "@/app/doc/data/aiComponents"
import { basicComponents } from "@/app/doc/data/basicComponents"
import { components } from "@/app/doc/data/components"
import { textComponents } from "@/app/doc/data/textComponentes"
import type { ComponentsProps } from "@/app/doc/data/typeComponent"

// Cache for processed component data
const componentCache = new Map<
  string,
  CacheEntry<ComponentsProps[] | ComponentsProps | undefined>
>()

// Cache for filtered search results
const searchCache = new Map<string, CacheEntry<ComponentsProps[]>>()

// Cache TTL in milliseconds
const CACHE_TTL = 10 * 60 * 1000 // 10 minutes

interface CacheEntry<T> {
  data: T
  timestamp: number
}

function isCacheValid<T>(entry: CacheEntry<T> | undefined): boolean {
  if (!entry) return false
  return Date.now() - entry.timestamp < CACHE_TTL
}

function getCacheKey(prefix: string, ...params: string[]): string {
  return `${prefix}:${params.join(":")}`
}

// Get all components for a specific group
export function getGroupComponents(group: string): ComponentsProps[] {
  const cacheKey = getCacheKey("group", group)
  const cached = componentCache.get(cacheKey) as
    | CacheEntry<ComponentsProps[]>
    | undefined

  if (isCacheValid(cached)) {
    return cached!.data
  }

  let groupData: ComponentsProps[]
  switch (group) {
    case "ai":
      groupData = aiComponents
      break
    case "basic":
      groupData = basicComponents
      break
    case "text":
      groupData = textComponents
      break
    case "components":
      groupData = components
      break
    default:
      groupData = []
  }

  // Cache the result
  componentCache.set(cacheKey, {
    data: groupData,
    timestamp: Date.now(),
  })

  return groupData
}

// Search components with caching
export function searchComponents(
  query: string,
  group?: string
): ComponentsProps[] {
  const searchTerm = query.trim().toLowerCase()
  if (!searchTerm) {
    return group ? getGroupComponents(group) : []
  }

  const cacheKey = getCacheKey("search", searchTerm, group || "all")
  const cached = searchCache.get(cacheKey) as
    | CacheEntry<ComponentsProps[]>
    | undefined

  if (isCacheValid(cached)) {
    return cached!.data
  }

  let componentsToSearch: ComponentsProps[]
  if (group) {
    componentsToSearch = getGroupComponents(group)
  } else {
    componentsToSearch = [
      ...aiComponents,
      ...basicComponents,
      ...textComponents,
      ...components,
    ]
  }

  const results = componentsToSearch.filter((c) => {
    return (
      c.componentTitle.toLowerCase().includes(searchTerm) ||
      c.info.toLowerCase().includes(searchTerm) ||
      (c.slug && c.slug.toLowerCase().includes(searchTerm)) ||
      (c.tags && c.tags.some((tag) => tag.toLowerCase().includes(searchTerm)))
    )
  })

  // Cache the search results
  searchCache.set(cacheKey, {
    data: results,
    timestamp: Date.now(),
  })

  return results
}

// Get component by slug with caching
export function getComponentBySlug(
  group: string,
  slug: string
): ComponentsProps | undefined {
  const cacheKey = getCacheKey("component", group, slug)
  const cached = componentCache.get(cacheKey) as
    | CacheEntry<ComponentsProps | undefined>
    | undefined

  if (isCacheValid(cached)) {
    return cached!.data
  }

  const groupData = getGroupComponents(group)
  const component = groupData.find((c) => c.slug === slug)

  // Cache the result (even if undefined)
  componentCache.set(cacheKey, {
    data: component,
    timestamp: Date.now(),
  })

  return component
}

// Clear expired cache entries
export function clearExpiredCache(): void {
  const now = Date.now()

  // Clear expired component cache
  for (const [key, entry] of componentCache.entries()) {
    if (now - entry.timestamp >= CACHE_TTL) {
      componentCache.delete(key)
    }
  }

  // Clear expired search cache
  for (const [key, entry] of searchCache.entries()) {
    if (now - entry.timestamp >= CACHE_TTL) {
      searchCache.delete(key)
    }
  }
}

// Clear all cache (useful for development or when data changes)
export function clearAllCache(): void {
  componentCache.clear()
  searchCache.clear()
}

// Get cache statistics
export function getCacheStats() {
  return {
    componentCacheSize: componentCache.size,
    searchCacheSize: searchCache.size,
    totalSize: componentCache.size + searchCache.size,
  }
}

// Auto-cleanup expired cache entries every 5 minutes
if (typeof window !== "undefined") {
  setInterval(clearExpiredCache, 5 * 60 * 1000)
}
