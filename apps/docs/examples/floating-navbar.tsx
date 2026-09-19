"use client";

import type { FloatingNavbarItem } from "@repo/smoothui/components/floating-navbar";
import FloatingNavbar from "@repo/smoothui/components/floating-navbar";
import { Home, Layers, Settings, Sparkles } from "lucide-react";
import { useRef, useState } from "react";

const NAV_ITEMS: FloatingNavbarItem[] = [
  { icon: <Home className="size-4" />, id: "home", label: "Home" },
  { icon: <Layers className="size-4" />, id: "features", label: "Features" },
  {
    icon: <Sparkles className="size-4" />,
    id: "pricing",
    label: "Pricing",
  },
  {
    icon: <Settings className="size-4" />,
    id: "settings",
    label: "Settings",
  },
];

const SECTION_COUNT = 12;

export default function FloatingNavbarDemo() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState("home");

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <div className="relative h-80 overflow-hidden rounded-2xl border border-foreground/10 bg-muted/30">
        <FloatingNavbar
          activeId={activeId}
          containerRef={scrollRef}
          items={NAV_ITEMS}
          onActiveChange={setActiveId}
        />
        <div className="h-full overflow-y-auto" ref={scrollRef}>
          <div className="flex flex-col gap-4 px-6 pt-20 pb-10">
            {Array.from({ length: SECTION_COUNT }, (_, index) => (
              <div
                className="rounded-xl border border-foreground/10 bg-background p-4 text-muted-foreground text-sm"
                key={index}
              >
                Section {index + 1} — scroll down to see the navbar hide and
                shrink, scroll up to reveal it again.
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
