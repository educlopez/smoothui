"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { X } from "lucide-react"

import { BlurMagic } from "@/components/blurmagic/blurMagic"
import { useScrollOpacity } from "@/components/ui/hooks/useScrollOpacity"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInput,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { basicComponents } from "@/app/doc/data/basicComponents"
import { components } from "@/app/doc/data/components"
import { textComponents } from "@/app/doc/data/textComponentes"
import { ComponentsProps } from "@/app/doc/data/typeComponent"

import { SidebarButtonClient } from "./sidebarButtonClient"

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

  // Helper to filter components by search
  const filterComponents = (list: ComponentsProps[]) => {
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
  }

  const filteredBasic = useMemo(
    () => filterComponents(basicComponents),
    [search]
  )
  const filteredText = useMemo(() => filterComponents(textComponents), [search])
  const filteredComponents = useMemo(
    () => filterComponents(components),
    [search]
  )

  return (
    <div
      ref={scrollRef}
      style={{ minHeight: "unset" }}
      className="h-full overflow-y-auto"
      onScroll={handleScroll}
    >
      <BlurMagic
        side="top"
        className="!sticky z-2"
        stop="50%"
        blur="4px"
        background="var(--color-primary)"
        height="48px"
        style={{ opacity: blurOpacity }}
      />
      <div className="relative -mt-[48px] p-2">
        <SidebarInput
          placeholder="Search components..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus={false}
          className={`rounded-md ${search ? "pr-8" : ""}`}
        />
        {search && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setSearch("")}
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
        <SidebarMenuSub>
          <SidebarMenuSubItem key="1">
            <SidebarButtonClient key="1" name="Information" slug="/doc" />
          </SidebarMenuSubItem>
          <SidebarMenuSubItem key="2">
            <SidebarButtonClient
              key="2"
              name="Changelog"
              slug="/doc/changelog"
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
          {filteredBasic.length === 0 ? (
            <SidebarMenuSubItem>
              <span className="text-muted-foreground px-2 py-1 text-xs">
                No results
              </span>
            </SidebarMenuSubItem>
          ) : (
            filteredBasic
              .slice()
              .reverse()
              .map((component: ComponentsProps) => {
                const href = `/doc/basic/${component.slug}`
                return (
                  <SidebarMenuSubItem
                    key={component.componentTitle}
                    className="group"
                  >
                    <SidebarMenuButton
                      asChild
                      tooltip={component.componentTitle}
                    >
                      <SidebarButtonClient
                        key={component.componentTitle}
                        name={highlightMatch(component.componentTitle, search)}
                        slug={`/doc/basic/${component.slug}`}
                        isNew={component.isNew}
                        isUpdated={component.isUpdated}
                        icon={component.icon}
                      />
                    </SidebarMenuButton>
                  </SidebarMenuSubItem>
                )
              })
          )}
        </SidebarMenuSub>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel className="text-foreground font-bold">
          <Link href="/doc/text" className="hover:text-brand transition-colors">
            Text
          </Link>
        </SidebarGroupLabel>
        <SidebarMenuSub className="border-none p-0">
          {filteredText.length === 0 ? (
            <SidebarMenuSubItem>
              <span className="text-muted-foreground px-2 py-1 text-xs">
                No results
              </span>
            </SidebarMenuSubItem>
          ) : (
            filteredText
              .slice()
              .reverse()
              .map((component: ComponentsProps) => {
                const href = `/doc/text/${component.slug}`
                return (
                  <SidebarMenuSubItem
                    key={component.componentTitle}
                    className="group"
                  >
                    <SidebarMenuButton
                      asChild
                      tooltip={component.componentTitle}
                    >
                      <SidebarButtonClient
                        key={component.componentTitle}
                        name={highlightMatch(component.componentTitle, search)}
                        slug={`/doc/text/${component.slug}`}
                        isNew={component.isNew}
                        isUpdated={component.isUpdated}
                        icon={component.icon}
                      />
                    </SidebarMenuButton>
                  </SidebarMenuSubItem>
                )
              })
          )}
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
          {filteredComponents.length === 0 ? (
            <SidebarMenuSubItem>
              <span className="text-muted-foreground px-2 py-1 text-xs">
                No results
              </span>
            </SidebarMenuSubItem>
          ) : (
            filteredComponents
              .slice()
              .reverse()
              .map((component: ComponentsProps) => {
                const href = `/doc/components/${component.slug}`
                return (
                  <SidebarMenuSubItem key={component.componentTitle}>
                    <SidebarMenuButton
                      asChild
                      tooltip={component.componentTitle}
                    >
                      <SidebarButtonClient
                        key={component.componentTitle}
                        name={highlightMatch(component.componentTitle, search)}
                        slug={`/doc/components/${component.slug}`}
                        isNew={component.isNew}
                        isUpdated={component.isUpdated}
                        icon={component.icon}
                      />
                    </SidebarMenuButton>
                  </SidebarMenuSubItem>
                )
              })
          )}
        </SidebarMenuSub>
      </SidebarGroup>
    </div>
  )
}
