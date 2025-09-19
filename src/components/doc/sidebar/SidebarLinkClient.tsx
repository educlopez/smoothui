"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "motion/react"

import { isComponentNew } from "@/lib/componentUtils"
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
import { SidebarButtonClient } from "./sidebarButtonClient"

// Memoized component data to avoid recreating arrays on every render
const COMPONENT_DATA = {
  basic: basicComponents,
  text: textComponents,
  components,
  ai: aiComponents,
} as const

export default function SidebarLinkClient() {
  const pathname = usePathname()
  const [selectedCategory, setSelectedCategory] = useState("")
  const [previousCategory, setPreviousCategory] = useState<string | null>(null)
  const { ref: scrollRef, handleScroll } = useScrollOpacity(15)

  // Update category when pathname changes
  useEffect(() => {
    let initialCategory = ""
    if (pathname.startsWith("/doc/blocks")) {
      initialCategory = "blocks"
    } else if (
      pathname.startsWith("/doc/components") ||
      pathname.startsWith("/doc/basic") ||
      pathname.startsWith("/doc/text") ||
      pathname.startsWith("/doc/ai")
    ) {
      initialCategory = "components"
    }
    setSelectedCategory(initialCategory)
  }, [pathname])

  const handleCategoryChange = (newCategory: string) => {
    setPreviousCategory(selectedCategory)
    setSelectedCategory(newCategory)
  }

  // Helper function to determine animation direction based on category transition
  const getAnimationDirection = (
    currentCategory: string,
    previousCategory: string | null
  ) => {
    if (!previousCategory) return "center"

    // If showing both categories (empty selectedCategory), use center animation
    if (currentCategory === "") return "center"

    // If going from components to blocks, animate from right
    if (previousCategory === "components" && currentCategory === "blocks") {
      return "fromRight"
    }
    // If going from blocks to components, animate from left
    if (previousCategory === "blocks" && currentCategory === "components") {
      return "fromLeft"
    }

    return "center"
  }

  const animationDirection = getAnimationDirection(
    selectedCategory,
    previousCategory
  )

  // Animation variants based on direction
  const getAnimationVariants = (direction: string) => {
    switch (direction) {
      case "fromRight":
        return {
          initial: {
            opacity: 0,
            x: 30,
            filter: "blur(8px)",
            scale: 0.95,
          },
          animate: {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            scale: 1,
          },
          exit: {
            opacity: 0,
            x: -30,
            filter: "blur(8px)",
            scale: 0.95,
          },
        }
      case "fromLeft":
        return {
          initial: {
            opacity: 0,
            x: -30,
            filter: "blur(8px)",
            scale: 0.95,
          },
          animate: {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            scale: 1,
          },
          exit: {
            opacity: 0,
            x: 30,
            filter: "blur(8px)",
            scale: 0.95,
          },
        }
      default:
        return {
          initial: {
            opacity: 0,
            scale: 0.95,
          },
          animate: {
            opacity: 1,
            scale: 1,
          },
          exit: {
            opacity: 0,
            scale: 0.95,
          },
        }
    }
  }

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
                isNew={isComponentNew(component)}
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
      <ScrollArea
        ref={scrollRef}
        style={{ minHeight: "unset" }}
        onScroll={handleScroll}
        maskClassName="before:from-primary after:from-primary"
        maskHeight={50}
      >
        <div className="space-y-2 p-2">
          {/* Category Selector */}
          <CategorySelector
            value={selectedCategory}
            onValueChange={handleCategoryChange}
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
                name="Introduction"
                slug="/doc"
                icon="Book"
              />
            </SidebarMenuSubItem>
            <SidebarMenuSubItem key="2">
              <SidebarButtonClient
                key="2"
                name="Installation"
                slug="/doc/installation"
                icon="Download"
              />
            </SidebarMenuSubItem>
            <SidebarMenuSubItem key="3">
              <SidebarButtonClient
                key="3"
                name="Design Principles"
                slug="/doc/design-principles"
                icon="Palette"
              />
            </SidebarMenuSubItem>
            <SidebarMenuSubItem key="4">
              <SidebarButtonClient
                key="4"
                name="MCP"
                slug="/doc/mcp"
                icon="Bot"
              />
            </SidebarMenuSubItem>
            <SidebarMenuSubItem key="5">
              <SidebarButtonClient
                key="5"
                name="Changelog"
                slug="/doc/changelog"
                icon="ListChecks"
              />
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        </SidebarGroup>
        <AnimatePresence mode="wait">
          {(selectedCategory === "blocks" || selectedCategory === "") && (
            <motion.div
              key="blocks-section"
              layout
              {...getAnimationVariants(animationDirection)}
              transition={{
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
                opacity: { duration: 0.3 },
                filter: { duration: 0.35 },
                scale: { duration: 0.35 },
                layout: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
              }}
            >
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
            </motion.div>
          )}
          {(selectedCategory === "components" || selectedCategory === "") && (
            <motion.div
              key="components-section"
              layout
              {...getAnimationVariants(animationDirection)}
              transition={{
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
                opacity: { duration: 0.3 },
                filter: { duration: 0.35 },
                scale: { duration: 0.35 },
                layout: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
              }}
            >
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
                  <Link
                    href="/doc/ai"
                    className="hover:text-brand transition-colors"
                  >
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
                  {renderComponentList(
                    componentResults.components,
                    "components"
                  )}
                </SidebarMenuSub>
              </SidebarGroup>
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollArea>
    </>
  )
}
