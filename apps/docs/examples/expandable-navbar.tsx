"use client";

import type { ExpandableNavbarItem } from "@repo/smoothui/components/expandable-navbar";
import ExpandableNavbar from "@repo/smoothui/components/expandable-navbar";
import { ArrowRight, Layers, Palette, Sparkles } from "lucide-react";

const PRODUCT_LINKS = [
  { description: "Buttons, inputs, and form controls", label: "Components" },
  { description: "Ready-made page sections", label: "Blocks" },
  { description: "Reusable animation hooks", label: "Hooks" },
];

const RESOURCE_LINKS = [
  { description: "Guides and API references", label: "Documentation" },
  { description: "Live component playground", label: "Showcase" },
  { description: "Release notes and updates", label: "Changelog" },
];

const NAV_ITEMS: ExpandableNavbarItem[] = [
  {
    id: "product",
    label: "Product",
    panel: (
      <div className="grid grid-cols-3 gap-3">
        {PRODUCT_LINKS.map((link) => (
          <div className="flex flex-col gap-1" key={link.label}>
            <span className="flex items-center gap-1.5 font-medium text-foreground text-sm">
              <Layers aria-hidden="true" className="size-4 text-brand" />
              {link.label}
            </span>
            <span className="text-muted-foreground text-xs">
              {link.description}
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "resources",
    label: "Resources",
    panel: (
      <div className="grid grid-cols-3 gap-3">
        {RESOURCE_LINKS.map((link) => (
          <div className="flex flex-col gap-1" key={link.label}>
            <span className="flex items-center gap-1.5 font-medium text-foreground text-sm">
              <Sparkles aria-hidden="true" className="size-4 text-brand" />
              {link.label}
            </span>
            <span className="text-muted-foreground text-xs">
              {link.description}
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "pricing",
    label: "Pricing",
    panel: (
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1.5 font-medium text-foreground text-sm">
            <Palette aria-hidden="true" className="size-4 text-brand" />
            Simple, transparent pricing
          </span>
          <span className="text-muted-foreground text-xs">
            Free for personal projects. Upgrade any time.
          </span>
        </div>
        <span className="flex items-center gap-1 font-medium text-brand text-sm">
          View plans
          <ArrowRight aria-hidden="true" className="size-3.5" />
        </span>
      </div>
    ),
  },
];

export default function ExpandableNavbarDemo() {
  return (
    <div className="flex w-full justify-center px-4 py-16">
      <ExpandableNavbar items={NAV_ITEMS} width={480} />
    </div>
  );
}
