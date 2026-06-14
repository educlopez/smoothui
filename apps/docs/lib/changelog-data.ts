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
    id: "3.5.0",
    version: "3.5.0",
    title: "Theme Studio, Installable Themes & Accessibility",
    description:
      "New Theme Studio with live previews for all 70 demos. Six installable registry themes. 100% prefers-reduced-motion compliance across all blocks.",
    date: "Jun 11, 2026",
    href: "/docs/guides/changelog",
  },
  {
    id: "3.4.0",
    version: "3.4.0",
    title: "AI-First Developer Experience",
    description:
      "REST API with 6 endpoints, OpenAPI 3.1 spec, llms-full.txt, Book and Exposure Slider components, and per-component accessibility docs.",
    date: "Mar 7, 2026",
    href: "/docs/guides/changelog",
  },
  {
    id: "3.3.0",
    version: "3.3.0",
    title: "New Components & Enhancements",
    description:
      "Gooey Popover, Agent Avatar, Animated Avatar Group, Animated Tooltip, and Scrubber components. Enhanced Grid Loader and Vercel OSS badge.",
    date: "Feb 21, 2026",
    href: "/docs/guides/changelog",
  },
  {
    id: "3.2.0",
    version: "3.2.0",
    title: "CLI & Grid Loader",
    description:
      "Standalone SmoothUI CLI with ASCII header, Grid Loader with 65 preset patterns, and interactive tutorial blog section.",
    date: "Feb 6, 2026",
    href: "/docs/guides/changelog",
  },
  {
    id: "3.1.0",
    version: "3.1.0",
    title: "New Components & Blocks Expansion",
    description:
      "Magnetic Button, Notification Badge, Skeleton Loader, Animated Tabs, Animated Toggle, plus 6 new blocks including FAQ and Footer variants.",
    date: "Jan 29, 2026",
    href: "/docs/guides/changelog",
  },
  {
    id: "3.0.0",
    version: "3.0.0",
    title: "Monorepo Remake",
    description:
      "Complete monorepo restructure, Next.js 16, Fumadocs integration, Ultracite, Biome, and updated build system.",
    date: "Nov 5, 2025",
    href: "/docs/guides/changelog",
  },
];
