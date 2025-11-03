"use client";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
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
} from "lucide-react";
import type React from "react";
import { useState } from "react";

import "./navbar.css";

import { useIsMobile } from "@repo/shadcn-ui/hooks/use-mobile";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Logo from "../../logo";
import { GithubStars } from "./girhub-stars";
import { BlocksMenuIllustration, MenuIllustration } from "./menu-illustration";
import { MobileNavbar } from "./mobile-navbar";

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
};

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
};

export default function Navbar({ className }: { className?: string }) {
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);
  const isMobile = useIsMobile();

  // Show mobile navbar on mobile devices
  if (isMobile) {
    return <MobileNavbar className={className} />;
  }

  return (
    <NavigationMenu.Root className={cn("navbar-menu", className)}>
      <a className="flex flex-1 items-center gap-2" href="/">
        <Logo />
      </a>
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
                    href="/docs/components/scroll-reveal-paragraph"
                    icon={componentPreviews.text.icon}
                    onHover={() => setHoveredComponent("text")}
                    onLeave={() => setHoveredComponent(null)}
                    title="Texts"
                  >
                    Animate text, headings, and more.
                  </EnhancedListItem>
                  <EnhancedListItem
                    href="/docs/components/accordion"
                    icon={componentPreviews.basic.icon}
                    onHover={() => setHoveredComponent("basic")}
                    onLeave={() => setHoveredComponent(null)}
                    title="Basics"
                  >
                    Typography, spacing, and more.
                  </EnhancedListItem>
                  <EnhancedListItem
                    href="/docs/components/animated-o-t-p-input"
                    icon={componentPreviews.components.icon}
                    onHover={() => setHoveredComponent("components")}
                    onLeave={() => setHoveredComponent(null)}
                    title="Components"
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
                    href="/docs/blocks/hero"
                    icon={blockPreviews.hero.icon}
                    onHover={() => setHoveredBlock("hero")}
                    onLeave={() => setHoveredBlock(null)}
                    title="Hero Blocks"
                  >
                    Animated hero sections for landing pages.
                  </EnhancedListItem>
                  <EnhancedListItem
                    href="/docs/blocks/pricing"
                    icon={blockPreviews.pricing.icon}
                    onHover={() => setHoveredBlock("pricing")}
                    onLeave={() => setHoveredBlock(null)}
                    title="Pricing Blocks"
                  >
                    Responsive pricing sections for your product.
                  </EnhancedListItem>
                  <EnhancedListItem
                    href="/docs/blocks/testimonial"
                    icon={blockPreviews.testimonial.icon}
                    onHover={() => setHoveredBlock("testimonial")}
                    onLeave={() => setHoveredBlock(null)}
                    title="Testimonial Blocks"
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
          <NavigationMenu.Link className="trigger" href="/docs/guides">
            <Book size={16} /> Docs
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link
            className="trigger"
            href="https://github.com/educlopez/smoothui/issues"
            rel="noopener noreferrer"
            target="_blank"
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
  );
}

interface EnhancedListItemProps {
  children: React.ReactNode;
  title: string;
  icon: React.ReactNode;
  href: string;
  onHover: () => void;
  onLeave: () => void;
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
        <div className="enhanced-list-item-icon frame-box relative">{icon}</div>
        <div className="enhanced-list-item-content">
          <div className="enhanced-list-item-heading">{title}</div>
          <p className="enhanced-list-item-text">{children}</p>
        </div>
      </Link>
    </NavigationMenu.Link>
  );
}
