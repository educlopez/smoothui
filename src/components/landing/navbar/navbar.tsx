"use client"

import type React from "react"
import { useState } from "react"
import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import {
  Book,
  Layers3,
  LayoutDashboard,
  MessageCircle,
  PackagePlus,
  Sparkles,
  Type,
  User,
  Zap,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import "./navbar.css"

import Link from "next/link"

import { cn } from "@/lib/utils"
import {
  BlocksMenuIllustration,
  MenuIllustration,
} from "@/components/landing/navbar/MenuIllustration"
import Logo from "@/components/logo"

import { GithubStars } from "../githubstars"

// Preview components data
const componentPreviews = {
  text: {
    title: "Text Components",
    icon: <Type size={20} />,
    section: "text",
  },
  basic: {
    title: "Basic Components",
    icon: <Layers3 size={20} />,
    section: "basic",
  },
  components: {
    title: "UI Components",
    icon: <LayoutDashboard size={20} />,
    section: "components",
  },
}

const blockPreviews = {
  hero: {
    title: "Hero Blocks",
    icon: <Sparkles size={20} />,
    section: "hero",
  },
  pricing: {
    title: "Pricing Blocks",
    icon: <PackagePlus size={20} />,
    section: "pricing",
  },
  testimonial: {
    title: "Testimonial Blocks",
    icon: <User size={20} />,
    section: "testimonial",
  },
}

export default function Navbar({ className }: { className?: string }) {
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null)
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null)

  return (
    <NavigationMenu.Root className={cn("navbar-menu", className)}>
      <div className="flex flex-1 items-center gap-2">
        <Logo />
      </div>
      <NavigationMenu.List className="menu-list flex-auto">
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="trigger !cursor-default">
            <LayoutDashboard size={16} />
            Components
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="content">
            <div className="enhanced-submenu">
              <div className="submenu-nav">
                <div className="submenu-items">
                  <EnhancedListItem
                    href="/doc/text"
                    title="Texts"
                    icon={componentPreviews.text.icon}
                    onHover={() => setHoveredComponent("text")}
                    onLeave={() => setHoveredComponent(null)}
                  >
                    Animate text, headings, and more.
                  </EnhancedListItem>
                  <EnhancedListItem
                    href="/doc/basic"
                    title="Basics"
                    icon={componentPreviews.basic.icon}
                    onHover={() => setHoveredComponent("basic")}
                    onLeave={() => setHoveredComponent(null)}
                  >
                    Typography, spacing, and more.
                  </EnhancedListItem>
                  <EnhancedListItem
                    href="/doc/components"
                    title="Components"
                    icon={componentPreviews.components.icon}
                    onHover={() => setHoveredComponent("components")}
                    onLeave={() => setHoveredComponent(null)}
                  >
                    Buttons, cards, forms, and more.
                  </EnhancedListItem>
                </div>
              </div>

              <div className="submenu-preview">
                <div className="flex h-full w-full items-center justify-center">
                  <MenuIllustration
                    activeSection={
                      hoveredComponent
                        ? componentPreviews[
                            hoveredComponent as keyof typeof componentPreviews
                          ].section
                        : "text"
                    }
                    className="h-full w-full"
                  />
                </div>
              </div>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="trigger !cursor-default">
            <Zap size={16} />
            Blocks
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="content">
            <div className="enhanced-submenu">
              <div className="submenu-nav">
                <div className="submenu-items">
                  <EnhancedListItem
                    title="Hero Blocks"
                    href="/doc/blocks/hero"
                    icon={blockPreviews.hero.icon}
                    onHover={() => setHoveredBlock("hero")}
                    onLeave={() => setHoveredBlock(null)}
                  >
                    Animated hero sections for landing pages.
                  </EnhancedListItem>
                  <EnhancedListItem
                    title="Pricing Blocks"
                    href="/doc/blocks/pricing"
                    icon={blockPreviews.pricing.icon}
                    onHover={() => setHoveredBlock("pricing")}
                    onLeave={() => setHoveredBlock(null)}
                  >
                    Responsive pricing sections for your product.
                  </EnhancedListItem>
                  <EnhancedListItem
                    title="Testimonial Blocks"
                    href="/doc/blocks/testimonial"
                    icon={blockPreviews.testimonial.icon}
                    onHover={() => setHoveredBlock("testimonial")}
                    onLeave={() => setHoveredBlock(null)}
                  >
                    Stylish testimonial sections to build trust.
                  </EnhancedListItem>
                </div>
              </div>

              <div className="submenu-preview">
                <div className="flex h-full w-full items-center justify-center">
                  <BlocksMenuIllustration
                    activeSection={
                      hoveredBlock
                        ? blockPreviews[
                            hoveredBlock as keyof typeof blockPreviews
                          ].section
                        : "hero"
                    }
                    className="h-full w-full"
                  />
                </div>
              </div>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link className="trigger" href="/doc">
            <Book size={16} /> Docs
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link
            className="trigger"
            href="https://github.com/educlopez/smoothui/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={16} /> Feedback
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
      <div className="viewport-position">
        <NavigationMenu.Viewport className="viewport" />
      </div>
      <div className="flex flex-1 items-center justify-end gap-2">
        <GithubStars />
      </div>
    </NavigationMenu.Root>
  )
}

interface EnhancedListItemProps {
  children: React.ReactNode
  title: string
  icon: React.ReactNode
  href: string
  onHover: () => void
  onLeave: () => void
}

function EnhancedListItem({
  children,
  title,
  icon,
  href,
  onHover,
  onLeave,
  ...props
}: EnhancedListItemProps) {
  return (
    <NavigationMenu.Link asChild>
      <Link
        className="enhanced-list-item-link"
        href={href}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        {...props}
      >
        <div className="enhanced-list-item-icon">{icon}</div>
        <div className="enhanced-list-item-content">
          <div className="enhanced-list-item-heading">{title}</div>
          <p className="enhanced-list-item-text">{children}</p>
        </div>
      </Link>
    </NavigationMenu.Link>
  )
}
