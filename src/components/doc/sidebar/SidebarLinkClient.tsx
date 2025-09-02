"use client"

import { useCallback, useMemo, useState } from "react"
import Link from "next/link"
import { X } from "lucide-react"

import { useScrollOpacity } from "@/components/ui/hooks/useScrollOpacity"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInput,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { aiComponents } from "@/app/doc/data/aiComponents"
import { basicComponents } from "@/app/doc/data/basicComponents"
import { components } from "@/app/doc/data/components"
import { textComponents } from "@/app/doc/data/textComponentes"
import { ComponentsProps } from "@/app/doc/data/typeComponent"

import { SidebarButtonClient } from "./sidebarButtonClient"

// Memoized component data to avoid recreating arrays on every render
const COMPONENT_DATA = {
  basic: basicComponents,
  text: textComponents,
  components,
  ai: aiComponents,
} as const

// Helper to highlight the matching part in the component title
function highlightMatch(text: string, query: string) {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-brand/20 text-brand-secondary rounded px-0.5 py-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  )
}

export default function SidebarLinkClient() {
  const [search, setSearch] = useState("")
  const {
    ref: scrollRef,
    opacity: blurOpacity,
    handleScroll,
  } = useScrollOpacity(15)

  // Memoized search handler to prevent unnecessary re-renders
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value)
    },
    []
  )

  const handleClearSearch = useCallback(() => {
    setSearch("")
  }, [])

  // Helper to filter components by search - memoized to avoid recreating function
  const filterComponents = useCallback(
    (list: ComponentsProps[]) => {
      if (!search.trim()) return list
      const q = search.toLowerCase()
      return list.filter((c) => {
        return (
          c.componentTitle.toLowerCase().includes(q) ||
          c.info.toLowerCase().includes(q) ||
          (c.slug && c.slug.toLowerCase().includes(q)) ||
          (c.tags && c.tags.some((tag) => tag.toLowerCase().includes(q)))
        )
      })
    },
    [search]
  )

  // Memoized filtered results to prevent unnecessary recalculations
  const filteredResults = useMemo(() => {
    const searchTerm = search.trim()
    if (!searchTerm) {
      return {
        basic: COMPONENT_DATA.basic,
        text: COMPONENT_DATA.text,
        components: COMPONENT_DATA.components,
        ai: COMPONENT_DATA.ai,
      }
    }

    return {
      basic: filterComponents(COMPONENT_DATA.basic),
      text: filterComponents(COMPONENT_DATA.text),
      components: filterComponents(COMPONENT_DATA.components),
      ai: filterComponents(COMPONENT_DATA.ai),
    }
  }, [search, filterComponents])

  // Memoized component rendering functions to prevent unnecessary re-renders
  const renderComponentList = useCallback(
    (components: ComponentsProps[], group: string) => {
      if (components.length === 0) {
        return (
          <SidebarMenuSubItem>
            <span className="text-muted-foreground px-2 py-1 text-xs">
              No results
            </span>
          </SidebarMenuSubItem>
        )
      }

      return components
        .slice()
        .reverse()
        .map((component: ComponentsProps) => (
          <SidebarMenuSubItem
            key={`${group}-${component.componentTitle}`}
            className="group"
          >
            <SidebarMenuButton asChild tooltip={component.componentTitle}>
              <SidebarButtonClient
                key={component.componentTitle}
                name={highlightMatch(component.componentTitle, search)}
                slug={`/doc/${group}/${component.slug}`}
                isNew={component.isNew}
                isUpdated={component.isUpdated}
                icon={component.icon}
              />
            </SidebarMenuButton>
          </SidebarMenuSubItem>
        ))
    },
    [search]
  )

  return (
    <ScrollArea
      ref={scrollRef}
      style={{ minHeight: "unset" }}
      onScroll={handleScroll}
      maskClassName="before:form-primary after:form-primary"
      maskHeight={50}
    >
      <div className="relative p-2">
        <SidebarInput
          placeholder="Search components..."
          value={search}
          onChange={handleSearchChange}
          autoFocus={false}
          className={`rounded-md ${search ? "pr-8" : ""}`}
        />
        {search && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={handleClearSearch}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-4 -translate-y-1/2 focus:outline-none"
            tabIndex={0}
          >
            <X size={16} />
          </button>
        )}
      </div>
      <SidebarGroup>
        <SidebarGroupLabel className="text-foreground font-bold">
          Get Started
        </SidebarGroupLabel>
        <SidebarMenuSub className="border-none p-0">
          <SidebarMenuSubItem key="1">
            <SidebarButtonClient
              key="1"
              name="Information"
              slug="/doc"
              icon="Book"
            />
          </SidebarMenuSubItem>
          <SidebarMenuSubItem key="2">
            <SidebarButtonClient
              key="2"
              name="Changelog"
              slug="/doc/changelog"
              icon="ListChecks"
            />
          </SidebarMenuSubItem>
          <SidebarMenuSubItem key="3">
            <SidebarButtonClient
              key="3"
              name="MCP"
              slug="/doc/mcp"
              icon="Bot"
            />
          </SidebarMenuSubItem>
        </SidebarMenuSub>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel className="text-foreground font-bold">
          <Link
            href="/doc/blocks"
            className="hover:text-brand transition-colors"
          >
            Blocks
          </Link>
        </SidebarGroupLabel>
        <SidebarMenuSub className="border-none p-0">
          <SidebarMenuSubItem key="blocks-pricing">
            <SidebarButtonClient
              key="blocks-pricing"
              name="Pricing"
              slug="/doc/blocks/pricing"
              icon="PackagePlus"
            />
          </SidebarMenuSubItem>
          <SidebarMenuSubItem key="blocks-hero">
            <SidebarButtonClient
              key="blocks-hero"
              name="Hero"
              slug="/doc/blocks/hero"
              icon="Sparkles"
            />
          </SidebarMenuSubItem>
          <SidebarMenuSubItem key="blocks-testimonial">
            <SidebarButtonClient
              key="blocks-testimonial"
              name="Testimonial"
              slug="/doc/blocks/testimonial"
              icon="User"
            />
          </SidebarMenuSubItem>
        </SidebarMenuSub>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel className="text-foreground font-bold">
          <Link
            href="/doc/basic"
            className="hover:text-brand transition-colors"
          >
            Basic
          </Link>
        </SidebarGroupLabel>
        <SidebarMenuSub className="border-none p-0">
          {renderComponentList(filteredResults.basic, "basic")}
        </SidebarMenuSub>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel className="text-foreground font-bold">
          <Link href="/doc/text" className="hover:text-brand transition-colors">
            Text
          </Link>
        </SidebarGroupLabel>
        <SidebarMenuSub className="border-none p-0">
          {renderComponentList(filteredResults.text, "text")}
        </SidebarMenuSub>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel className="text-foreground font-bold">
          <Link href="/doc/ai" className="hover:text-brand transition-colors">
            AI
          </Link>
        </SidebarGroupLabel>
        <SidebarMenuSub className="border-none p-0">
          {renderComponentList(filteredResults.ai, "ai")}
        </SidebarMenuSub>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel className="text-foreground font-bold">
          <Link
            href="/doc/components"
            className="hover:text-brand transition-colors"
          >
            Components
          </Link>
        </SidebarGroupLabel>
        <SidebarMenuSub className="border-none p-0">
          {renderComponentList(filteredResults.components, "components")}
        </SidebarMenuSub>
      </SidebarGroup>
    </ScrollArea>
  )
}
