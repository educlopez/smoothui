"use client";

import {
  Content as NavigationMenuContent,
  Item as NavigationMenuItem,
  Link as NavigationMenuLink,
  List as NavigationMenuList,
  Root as NavigationMenuRoot,
  Trigger as NavigationMenuTrigger,
  Viewport as NavigationMenuViewport,
} from "@radix-ui/react-navigation-menu";
import {
  IconArrowRightFill24,
  IconBoltFill24,
  IconBoxFill24,
  IconColorPaletteFill24,
  IconCompassFill24,
  IconGrid2Fill24,
  IconHeartFill24,
  IconLayersFill24,
  IconSparkleFill24,
  IconTextFill24,
  IconUserFill24,
  IconWandSparkleFill24,
  IconWindowCodeFill24,
} from "nucleo-core-fill-24";
import type React from "react";
import { useEffect, useState } from "react";

import "./navbar.css";

import Logo from "@docs/components/logo";
import { useIsMobile } from "@repo/shadcn-ui/hooks/use-mobile";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { GithubStars } from "./github-stars";
import { MobileNavbar } from "./mobile-navbar";

const componentGroups = [
  {
    href: "/docs/components/accordion",
    icon: <IconLayersFill24 size={16} />,
    text: "Forms, dialogs, and inputs.",
    title: "Basic UI",
  },
  {
    href: "/docs/components/scroll-reveal-paragraph",
    icon: <IconTextFill24 size={16} />,
    text: "Headings, paragraphs, and type.",
    title: "Text",
  },
  {
    href: "/docs/components/smooth-button",
    icon: <IconSparkleFill24 size={16} />,
    text: "Candy, outline, and magnetic.",
    title: "Buttons",
  },
  {
    href: "/docs/components/breadcrumb",
    icon: <IconCompassFill24 size={16} />,
    text: "Docks, breadcrumbs, and navbars.",
    title: "Navigation",
  },
  {
    href: "/docs/components/ai-prompt-input",
    icon: <IconWandSparkleFill24 size={16} />,
    text: "Chat, agents, and orbs.",
    title: "AI",
  },
  {
    href: "/docs/components/glass-card",
    icon: <IconWindowCodeFill24 size={16} />,
    text: "Glass, shaders, and foil.",
    title: "Surfaces",
  },
] as const;

const componentMore = [
  {
    href: "/docs/components/shader-reveal-transition",
    icon: <IconBoltFill24 size={16} />,
    title: "Transitions",
  },
  {
    href: "/docs/components/coverflow-carousel",
    icon: <IconColorPaletteFill24 size={16} />,
    title: "Media",
  },
  {
    href: "/docs/components/scroll-progress",
    icon: <IconArrowRightFill24 size={16} />,
    title: "Scroll",
  },
  {
    href: "/docs/components/dynamic-island",
    icon: <IconHeartFill24 size={16} />,
    title: "Creative",
  },
  {
    href: "/docs/components",
    icon: <IconGrid2Fill24 size={16} />,
    title: "All components",
  },
] as const;

const blockGroups = [
  {
    href: "/docs/blocks/hero",
    icon: <IconSparkleFill24 size={16} />,
    text: "Opening sections for a landing.",
    title: "Hero",
  },
  {
    href: "/docs/blocks/features",
    icon: <IconGrid2Fill24 size={16} />,
    text: "Product highlights and grids.",
    title: "Features",
  },
  {
    href: "/docs/blocks/pricing",
    icon: <IconBoxFill24 size={16} />,
    text: "Plans and comparison tables.",
    title: "Pricing",
  },
  {
    href: "/docs/blocks/testimonial",
    icon: <IconUserFill24 size={16} />,
    text: "Quotes and social proof.",
    title: "Testimonials",
  },
  {
    href: "/docs/blocks/faqs",
    icon: <IconTextFill24 size={16} />,
    text: "Answers to common questions.",
    title: "FAQs",
  },
  {
    href: "/docs/blocks/cta",
    icon: <IconBoltFill24 size={16} />,
    text: "A closer before the footer.",
    title: "Call to action",
  },
] as const;

const blockMore = [
  {
    href: "/docs/blocks/footer",
    icon: <IconLayersFill24 size={16} />,
    title: "Footer",
  },
  {
    href: "/docs/blocks/logo-clouds",
    icon: <IconWindowCodeFill24 size={16} />,
    title: "Logo clouds",
  },
  {
    href: "/docs/blocks/stats",
    icon: <IconColorPaletteFill24 size={16} />,
    title: "Stats",
  },
  {
    href: "/docs/blocks/team-sections",
    icon: <IconUserFill24 size={16} />,
    title: "Team",
  },
  {
    href: "/docs/blocks",
    icon: <IconGrid2Fill24 size={16} />,
    title: "All blocks",
  },
] as const;

const resourceGroups = [
  {
    href: "/blog",
    icon: <IconTextFill24 size={16} />,
    text: "Tutorials and component notes.",
    title: "Blog",
  },
  {
    href: "/docs/guides/getting-started",
    icon: <IconCompassFill24 size={16} />,
    text: "Install and ship in a few minutes.",
    title: "Getting started",
  },
  {
    href: "/docs/guides/themes",
    icon: <IconColorPaletteFill24 size={16} />,
    text: "Palettes and dark mode.",
    title: "Themes",
  },
  {
    external: true,
    href: "https://skills.smoothui.dev",
    icon: <IconWandSparkleFill24 size={16} />,
    text: "Scaffold components from the editor.",
    title: "Skills",
  },
] as const;

const resourceMore = [
  {
    href: "/playground",
    icon: <IconColorPaletteFill24 size={16} />,
    title: "Playground",
  },
  {
    href: "/docs/guides/changelog",
    icon: <IconBoltFill24 size={16} />,
    title: "Changelog",
  },
  {
    href: "/docs/guides/accessibility",
    icon: <IconHeartFill24 size={16} />,
    title: "Accessibility",
  },
  {
    href: "/docs/guides/sponsors",
    icon: <IconUserFill24 size={16} />,
    title: "Sponsors",
  },
] as const;

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Show mobile navbar on mobile devices
  if (isMobile) {
    return <MobileNavbar className={className} />;
  }

  return (
    <NavigationMenuRoot
      className={cn("navbar-menu", scrolled && "is-scrolled", className)}
    >
      <div className="nav-side nav-side-start" inert={scrolled || undefined}>
        <a href="/">
          <Logo />
        </a>
      </div>
      <NavigationMenuList className="menu-list">
        <li className="nav-slot" inert={scrolled ? undefined : true}>
          <a aria-label="Smooth UI" href="/">
            <Logo classNameIcon="h-5 w-auto" mark />
          </a>
        </li>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="trigger !cursor-default">
            <IconGrid2Fill24 size={16} />
            Components
            <span aria-hidden="true" className="nav-caret" />
          </NavigationMenuTrigger>
          <NavigationMenuContent className="content">
            <MenuPanel
              aside={componentMore}
              asideLabel="More"
              items={componentGroups}
              label="Components"
            />
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="trigger !cursor-default">
            <IconBoltFill24 size={16} />
            Blocks
            <span aria-hidden="true" className="nav-caret" />
          </NavigationMenuTrigger>
          <NavigationMenuContent className="content">
            <MenuPanel
              aside={blockMore}
              asideLabel="More"
              items={blockGroups}
              label="Blocks"
            />
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Same icon the docs sidebar uses for the section, so the two
            navigations agree on what Templates looks like. */}
        <NavigationMenuItem>
          <NavigationMenuLink className="trigger" href="/docs/templates">
            <IconWindowCodeFill24 size={16} /> Templates
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="trigger !cursor-default">
            <IconCompassFill24 size={16} />
            Resources
            <span aria-hidden="true" className="nav-caret" />
          </NavigationMenuTrigger>
          <NavigationMenuContent className="content">
            <MenuPanel
              aside={resourceMore}
              asideLabel="Also"
              items={resourceGroups}
              label="Resources"
            />
          </NavigationMenuContent>
        </NavigationMenuItem>
        <li className="nav-slot" inert={scrolled ? undefined : true}>
          <GithubStars compact />
        </li>
      </NavigationMenuList>
      <div className="viewport-position">
        <NavigationMenuViewport className="viewport" />
      </div>
      <div className="nav-side nav-side-end" inert={scrolled || undefined}>
        <GithubStars />
      </div>
    </NavigationMenuRoot>
  );
}

interface EnhancedListItemProps {
  children: React.ReactNode;
  external?: boolean;
  href: string;
  icon: React.ReactNode;
  title: string;
}

function EnhancedListItem({
  children,
  title,
  icon,
  href,
  external,
  ...props
}: EnhancedListItemProps) {
  const externalProps = external
    ? { rel: "noopener noreferrer", target: "_blank" }
    : {};

  return (
    <NavigationMenuLink asChild>
      <Link
        className="enhanced-list-item-link"
        href={href}
        {...externalProps}
        {...props}
      >
        <div className="enhanced-list-item-icon">{icon}</div>
        <div className="enhanced-list-item-content">
          <div className="enhanced-list-item-heading">{title}</div>
          <p className="enhanced-list-item-text">{children}</p>
        </div>
      </Link>
    </NavigationMenuLink>
  );
}

interface MenuLink {
  external?: boolean;
  href: string;
  icon: React.ReactNode;
  text?: string;
  title: string;
}

function MenuPanel({
  aside,
  asideLabel,
  items,
  label,
}: {
  aside: readonly MenuLink[];
  asideLabel: string;
  items: readonly MenuLink[];
  label: string;
}) {
  return (
    <div className="enhanced-submenu">
      <div className="submenu-nav">
        <span className="submenu-label">{label}</span>
        <div className="submenu-items">
          {items.map((item) => (
            <EnhancedListItem
              external={item.external}
              href={item.href}
              icon={item.icon}
              key={item.href}
              title={item.title}
            >
              {item.text}
            </EnhancedListItem>
          ))}
        </div>
      </div>
      <div className="submenu-aside">
        <span className="submenu-label">{asideLabel}</span>
        <div className="submenu-plain">
          {aside.map((item) => (
            <NavigationMenuLink asChild key={item.href}>
              <Link
                className="submenu-plain-link"
                href={item.href}
                {...(item.external
                  ? { rel: "noopener noreferrer", target: "_blank" }
                  : {})}
              >
                {item.icon}
                {item.title}
              </Link>
            </NavigationMenuLink>
          ))}
        </div>
      </div>
    </div>
  );
}
