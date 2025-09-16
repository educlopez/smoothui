"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  BarChart3,
  Building2,
  HelpCircle,
  Search,
  Users,
  Zap,
} from "lucide-react"

import { useScrollOpacity } from "@/components/ui/hooks/useScrollOpacity"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { aiComponents } from "@/app/doc/data/aiComponents"
import { basicComponents } from "@/app/doc/data/basicComponents"
import { components } from "@/app/doc/data/components"
import { textComponents } from "@/app/doc/data/textComponentes"
import type { ComponentsProps } from "@/app/doc/data/typeComponent"

import { CategorySelector } from "../CategorySelector"
import { SearchDialog } from "../SearchDialog"
import { SidebarButtonClient } from "./sidebarButtonClient"

// Memoized component data to avoid recreating arrays on every render
const COMPONENT_DATA = {
  basic: basicComponents,
  text: textComponents,
  components,
  ai: aiComponents,
} as const

export default function SidebarLinkClient() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false)
  const { ref: scrollRef, handleScroll } = useScrollOpacity(15)

  // Handle Cmd+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsSearchDialogOpen(true)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Memoized component results - always show all components
  const componentResults = useMemo(() => {
    return {
      basic: COMPONENT_DATA.basic,
      text: COMPONENT_DATA.text,
      components: COMPONENT_DATA.components,
      ai: COMPONENT_DATA.ai,
    }
  }, [])

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
                name={component.componentTitle}
                slug={`/doc/${group}/${component.slug}`}
                isNew={component.isNew}
                isUpdated={component.isUpdated}
                icon={component.icon}
              />
            </SidebarMenuButton>
          </SidebarMenuSubItem>
        ))
    },
    []
  )

  return (
    <>
      <SearchDialog
        open={isSearchDialogOpen}
        onOpenChange={setIsSearchDialogOpen}
      />
      <ScrollArea
        ref={scrollRef}
        style={{ minHeight: "unset" }}
        onScroll={handleScroll}
        maskClassName="before:from-primary after:from-primary"
        maskHeight={50}
      >
        <div className="space-y-2 p-2">
          {/* Search Button - Desktop */}
          <button
            type="button"
            data-search-full=""
            onClick={() => setIsSearchDialogOpen(true)}
            className="bg-background text-muted-foreground hover:bg-primary hover:text-accent-foreground inline-flex w-full cursor-pointer items-center gap-2 rounded-lg border p-1.5 ps-2 text-sm transition-colors max-md:hidden"
          >
            <Search className="h-4 w-4" />
            <span className="flex-1 text-left">Search</span>
            <div className="ms-auto inline-flex gap-0.5">
              <kbd className="bg-primary rounded border px-1.5 font-mono text-xs">
                ⌘
              </kbd>
              <kbd className="bg-primary rounded border px-1.5 font-mono text-xs">
                K
              </kbd>
            </div>
          </button>

          {/* Search Button - Mobile - Hidden since we have search in header */}
          <button
            type="button"
            onClick={() => setIsSearchDialogOpen(true)}
            className="bg-background text-muted-foreground hover:bg-primary hover:text-accent-foreground hidden w-full items-center justify-center gap-2 rounded-lg border p-2 text-sm transition-colors"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </button>

          {/* Category Selector */}
          <CategorySelector
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          />
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
            <SidebarMenuSubItem key="blocks-hero">
              <SidebarButtonClient
                key="blocks-hero"
                name="Hero"
                slug="/doc/blocks/hero"
                icon="Sparkles"
              />
            </SidebarMenuSubItem>
            <SidebarMenuSubItem key="blocks-pricing">
              <SidebarButtonClient
                key="blocks-pricing"
                name="Pricing"
                slug="/doc/blocks/pricing"
                icon="PackagePlus"
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
            <SidebarMenuSubItem key="blocks-logo-cloud">
              <SidebarButtonClient
                key="blocks-logo-cloud"
                name="Logo Clouds"
                slug="/doc/blocks/logo-cloud"
                icon="Zap"
              />
            </SidebarMenuSubItem>
            <SidebarMenuSubItem key="blocks-stats">
              <SidebarButtonClient
                key="blocks-stats"
                name="Stats"
                slug="/doc/blocks/stats"
                icon="BarChart3"
              />
            </SidebarMenuSubItem>
            <SidebarMenuSubItem key="blocks-team">
              <SidebarButtonClient
                key="blocks-team"
                name="Team Sections"
                slug="/doc/blocks/team"
                icon="Users"
              />
            </SidebarMenuSubItem>
            <SidebarMenuSubItem key="blocks-footer">
              <SidebarButtonClient
                key="blocks-footer"
                name="Footer"
                slug="/doc/blocks/footer"
                icon="Building2"
              />
            </SidebarMenuSubItem>
            <SidebarMenuSubItem key="blocks-faqs">
              <SidebarButtonClient
                key="blocks-faqs"
                name="FAQs"
                slug="/doc/blocks/faqs"
                icon="HelpCircle"
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
            {renderComponentList(componentResults.basic, "basic")}
          </SidebarMenuSub>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-foreground font-bold">
            <Link
              href="/doc/text"
              className="hover:text-brand transition-colors"
            >
              Text
            </Link>
          </SidebarGroupLabel>
          <SidebarMenuSub className="border-none p-0">
            {renderComponentList(componentResults.text, "text")}
          </SidebarMenuSub>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-foreground font-bold">
            <Link href="/doc/ai" className="hover:text-brand transition-colors">
              AI
            </Link>
          </SidebarGroupLabel>
          <SidebarMenuSub className="border-none p-0">
            {renderComponentList(componentResults.ai, "ai")}
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
            {renderComponentList(componentResults.components, "components")}
          </SidebarMenuSub>
        </SidebarGroup>
      </ScrollArea>
    </>
  )
}
