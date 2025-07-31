import * as NavigationMenu from "@radix-ui/react-navigation-menu"

import "./navbar.css"

import Link from "next/link"

import { cn } from "@/lib/utils"
import Logo from "@/components/logo"
import { basicComponents } from "@/app/doc/data/basicComponents"
import { components } from "@/app/doc/data/components"
import { textComponents } from "@/app/doc/data/textComponentes"

import { GithubStars } from "../githubstars"

export default function Navbar({ className }: { className?: string }) {
  // Group components by collection
  const grouped = components.reduce(
    (acc, comp) => {
      const group = comp.collection || "Other"
      if (!acc[group]) acc[group] = []
      acc[group].push(comp)
      return acc
    },
    {} as Record<string, typeof components>
  )

  return (
    <NavigationMenu.Root className={cn("navbar-menu", className)}>
      <div className="flex flex-1 items-center gap-2">
        <Logo className="text-3xl" />
      </div>
      <NavigationMenu.List className="menu-list flex-auto">
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="trigger !cursor-default">
            Components
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="content">
            <ul className="list one">
              <li style={{ gridRow: "span 3" }}>
                <NavigationMenu.Link asChild>
                  <Link className="callout" href="/doc/components">
                    <div className="callout-heading">SmoothUI</div>
                    <p className="callout-text">
                      Beautiful, production-ready React components for every
                      team.
                    </p>
                  </Link>
                </NavigationMenu.Link>
              </li>

              <ListItem href="/doc/text" title="Texts">
                Animate text, headings, and more.
              </ListItem>
              <ListItem href="/doc/basic" title="Basics">
                Typography, spacing, and more.
              </ListItem>
              <ListItem href="/doc/components" title="Components">
                Buttons, cards, forms, and more.
              </ListItem>
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="trigger !cursor-default">
            Blocks
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="content">
            <ul className="list two">
              <ListItem title="Hero Blocks" href="/doc/blocks/hero">
                Animated hero sections for landing pages.
              </ListItem>
              <ListItem title="Pricing Blocks" href="/doc/blocks/pricing">
                Responsive pricing sections for your product.
              </ListItem>
              <ListItem
                title="Testimonial Blocks"
                href="/doc/blocks/testimonial"
              >
                Stylish testimonial sections to build trust.
              </ListItem>
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link className="link" href="/doc">
            Docs
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link
            className="link"
            href="https://github.com/educlopez/smoothui/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            Feedback
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

function ListItem({ className, children, title, ...props }: any) {
  return (
    <li>
      <NavigationMenu.Link asChild>
        <a className="list-item-link" {...props}>
          <div className="list-item-heading">{title}</div>
          <p className="list-item-text">{children}</p>
        </a>
      </NavigationMenu.Link>
    </li>
  )
}
