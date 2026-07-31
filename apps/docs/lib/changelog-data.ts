export interface ChangelogEntry {
  date: string;
  description: string;
  href: string;
  id: string;
  title: string;
  version: string;
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    date: "Jul 31, 2026",
    description:
      "Twenty AI components and the first template, installable in one command. Component pages pin the preview beside the docs; block and template pages were rebuilt around what you actually came to do.",
    href: "/docs/guides/changelog",
    id: "3.6.0",
    title: "AI Components, Templates & Rebuilt Docs",
    version: "3.6.0",
  },
  {
    date: "Jun 11, 2026",
    description:
      "New Theme Studio with live previews for all 70 demos. Six installable registry themes. 100% prefers-reduced-motion compliance across all blocks.",
    href: "/docs/guides/changelog",
    id: "3.5.0",
    title: "Theme Studio, Installable Themes & Accessibility",
    version: "3.5.0",
  },
  {
    date: "Mar 7, 2026",
    description:
      "REST API with 6 endpoints, OpenAPI 3.1 spec, llms-full.txt, Book and Exposure Slider components, and per-component accessibility docs.",
    href: "/docs/guides/changelog",
    id: "3.4.0",
    title: "AI-First Developer Experience",
    version: "3.4.0",
  },
  {
    date: "Feb 21, 2026",
    description:
      "Gooey Popover, Agent Avatar, Animated Avatar Group, Animated Tooltip, and Scrubber components. Enhanced Grid Loader and Vercel OSS badge.",
    href: "/docs/guides/changelog",
    id: "3.3.0",
    title: "New Components & Enhancements",
    version: "3.3.0",
  },
  {
    date: "Feb 6, 2026",
    description:
      "Standalone SmoothUI CLI with ASCII header, Grid Loader with 65 preset patterns, and interactive tutorial blog section.",
    href: "/docs/guides/changelog",
    id: "3.2.0",
    title: "CLI & Grid Loader",
    version: "3.2.0",
  },
  {
    date: "Jan 29, 2026",
    description:
      "Magnetic Button, Notification Badge, Skeleton Loader, Animated Tabs, Animated Toggle, plus 6 new blocks including FAQ and Footer variants.",
    href: "/docs/guides/changelog",
    id: "3.1.0",
    title: "New Components & Blocks Expansion",
    version: "3.1.0",
  },
  {
    date: "Nov 5, 2025",
    description:
      "Complete monorepo restructure, Next.js 16, Fumadocs integration, Ultracite, Biome, and updated build system.",
    href: "/docs/guides/changelog",
    id: "3.0.0",
    title: "Monorepo Remake",
    version: "3.0.0",
  },
];
