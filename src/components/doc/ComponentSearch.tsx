"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, Search, X } from "lucide-react"

import { Button } from "@/components/button"
import { Badge } from "@/components/ui/badge"
import type { ComponentsProps } from "@/app/doc/data/typeComponent"
import { getPopularTags, searchComponents } from "@/app/utils/componentUtils"

interface ComponentSearchProps {
  className?: string
  placeholder?: string
}

export function ComponentSearch({
  className = "",
  placeholder = "Search components...",
}: ComponentSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<ComponentsProps[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  const popularTags = getPopularTags(5)

  useEffect(() => {
    if (query.trim()) {
      const searchResults = searchComponents(query)
      setResults(searchResults.slice(0, 8)) // Limit to 8 results
      setIsOpen(true)
    } else {
      setResults([])
      setIsOpen(false)
    }
    setSelectedIndex(-1)
  }, [query])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : prev
          )
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
          break
        case "Enter":
          e.preventDefault()
          if (selectedIndex >= 0 && results[selectedIndex]) {
            const component = results[selectedIndex]
            // Determine group based on component data
            const group = getComponentGroup(component)
            window.location.href = `/doc/${group}/${component.slug}`
          }
          break
        case "Escape":
          setIsOpen(false)
          inputRef.current?.blur()
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, results, selectedIndex])

  const getComponentGroup = (component: ComponentsProps): string => {
    // This is a simplified approach - you might want to enhance this
    // based on your actual component organization
    if (component.componentTitle.toLowerCase().includes("ai")) return "ai"
    if (component.type === "block") return "components"
    return "components"
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const clearSearch = () => {
    setQuery("")
    setResults([])
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const handleResultClick = (component: ComponentsProps) => {
    const group = getComponentGroup(component)
    window.location.href = `/doc/${group}/${component.slug}`
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="text-foreground/50 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query && setIsOpen(true)}
          placeholder={placeholder}
          className="bg-background placeholder:text-foreground/50 focus:border-brand focus:ring-brand w-full rounded-lg border px-10 py-2 text-sm focus:ring-1 focus:outline-none"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Search Results */}
      {isOpen && (
        <div
          ref={resultsRef}
          className="bg-background absolute top-full z-50 mt-2 w-full rounded-lg border shadow-lg"
        >
          {results.length > 0 ? (
            <div className="max-h-96 overflow-y-auto p-2">
              {results.map((component, index) => (
                <div
                  key={component.slug}
                  onClick={() => handleResultClick(component)}
                  className={`flex cursor-pointer items-center gap-3 rounded-md p-3 transition-colors ${
                    index === selectedIndex
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium">
                        {component.componentTitle}
                      </span>
                      {component.isNew && (
                        <Badge variant="secondary" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-foreground/70 line-clamp-1 text-xs">
                      {component.info}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {component.tags?.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 flex-shrink-0" />
                </div>
              ))}
            </div>
          ) : query ? (
            <div className="text-foreground/70 p-4 text-center text-sm">
              No components found for &quot;{query}&quot;
            </div>
          ) : (
            <div className="p-4">
              <div className="mb-3 text-sm font-medium">Popular Tags</div>
              <div className="flex flex-wrap gap-2">
                {popularTags.map(({ tag }) => (
                  <Link key={tag} href={`/doc/tags/${tag.toLowerCase()}`}>
                    <Badge
                      variant="outline"
                      className="hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"
                    >
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
