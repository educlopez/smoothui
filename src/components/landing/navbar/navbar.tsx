import * as NavigationMenu from "@radix-ui/react-navigation-menu"

import "./navbar.css"

import { cn } from "@/lib/utils"
import Logo from "@/components/logo"
import { components } from "@/app/doc/data/components"

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
        <Logo className="text-2xl" />
      </div>
      <NavigationMenu.List className="menu-list flex-auto">
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="trigger">
            Components
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="content">
            <ul className="list one">
              <li style={{ gridRow: "span 3" }}>
                <NavigationMenu.Link asChild>
                  <a className="callout" href="/doc/components">
                    <div className="callout-heading">SmoothUI</div>
                    <p className="callout-text">
                      Beautiful, production-ready React components for every
                      team.
                    </p>
                  </a>
                </NavigationMenu.Link>
              </li>

              <ListItem href="/doc/text/" title="Texts">
                Animate text, headings, and more.
              </ListItem>
              <ListItem href="/doc/basic/" title="Basics">
                Typography, spacing, and more.
              </ListItem>
              <ListItem href="/doc/components/" title="Components">
                Buttons, cards, forms, and more.
              </ListItem>
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="trigger">
            Blocks
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="content">
            <ul className="list two">
              <ListItem title="Landing Blocks" href="/doc/blocks/landing">
                Hero, Features, FAQ, and more.
              </ListItem>
              <ListItem title="Dashboard Blocks" href="/doc/blocks/dashboard">
                Cards, tables, charts, and more.
              </ListItem>
              <ListItem title="E-commerce Blocks" href="/doc/blocks/ecommerce">
                Product, cart, checkout, and more.
              </ListItem>
              <ListItem title="Marketing Blocks" href="/doc/blocks/marketing">
                CTAs, testimonials, pricing, and more.
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
            href="https://github.com/eduardocalvo/smoothui/issues"
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
