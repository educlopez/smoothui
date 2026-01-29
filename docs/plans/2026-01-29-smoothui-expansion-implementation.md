# SmoothUI Expansion Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add 7 new components and 6 new blocks to SmoothUI with "wow effect" animations.

**Architecture:** Each component/block is a self-contained package with index.tsx, package.json, and tsconfig.json. All use Motion for animations with mandatory `useReducedMotion` support. Components export TypeScript props types for auto-documentation.

**Tech Stack:** React 19, Motion (Framer Motion), Tailwind CSS 4, TypeScript 5

---

## Phase 1: Foundation Components

### Task 1: Animated Tabs Component

**Files:**
- Create: `packages/smoothui/components/animated-tabs/index.tsx`
- Create: `packages/smoothui/components/animated-tabs/package.json`
- Create: `packages/smoothui/components/animated-tabs/tsconfig.json`
- Modify: `packages/smoothui/components/index.ts`
- Create: `apps/docs/examples/animated-tabs.tsx`
- Create: `apps/docs/content/docs/components/animated-tabs.mdx`
- Modify: `apps/docs/content/docs/components/meta.json`

**Step 1: Create package.json**

```json
{
  "name": "@repo/animated-tabs",
  "description": "Animated tabs component with sliding indicator",
  "version": "0.0.0",
  "private": true,
  "dependencies": {
    "@repo/shadcn-ui": "workspace:*",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "motion": "^11.15.0"
  },
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "@types/react": "^19.2.2",
    "@types/react-dom": "^19.2.1",
    "typescript": "^5.9.3"
  }
}
```

**Step 2: Create tsconfig.json**

```json
{
  "extends": "@repo/typescript-config/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@repo/*": ["../*"],
      "@/components/*": ["../shadcn-ui/components/*"],
      "@/lib/*": ["../shadcn-ui/lib/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

**Step 3: Create component index.tsx**

```tsx
"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { type ReactNode, useState } from "react";

export type AnimatedTabsProps = {
  tabs: { id: string; label: string; icon?: ReactNode }[];
  activeTab?: string;
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: "underline" | "pill" | "segment";
  layoutId?: string;
  className?: string;
};

const SPRING_CONFIG = {
  type: "spring" as const,
  duration: 0.25,
  bounce: 0.05,
};

export default function AnimatedTabs({
  tabs,
  activeTab: controlledActiveTab,
  defaultTab,
  onChange,
  variant = "underline",
  layoutId = "animated-tabs-indicator",
  className,
}: AnimatedTabsProps) {
  const shouldReduceMotion = useReducedMotion();
  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultTab || tabs[0]?.id
  );

  const activeTab = controlledActiveTab ?? internalActiveTab;

  const handleTabClick = (tabId: string) => {
    if (!controlledActiveTab) {
      setInternalActiveTab(tabId);
    }
    onChange?.(tabId);
  };

  return (
    <div
      className={cn(
        "inline-flex",
        variant === "segment" &&
          "rounded-lg border border-border bg-muted p-1",
        variant === "underline" && "border-b border-border",
        className
      )}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            aria-selected={isActive}
            className={cn(
              "relative px-4 py-2 text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              variant === "underline" && [
                "pb-3",
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              ],
              variant === "pill" && [
                "rounded-full",
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              ],
              variant === "segment" && [
                "rounded-md",
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              ]
            )}
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            role="tab"
            type="button"
          >
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon}
              {tab.label}
            </span>

            {isActive && (
              <motion.span
                className={cn(
                  "absolute",
                  variant === "underline" &&
                    "bottom-0 left-0 right-0 h-0.5 bg-foreground",
                  variant === "pill" &&
                    "inset-0 rounded-full bg-muted",
                  variant === "segment" &&
                    "inset-0 rounded-md bg-background shadow-sm"
                )}
                layoutId={layoutId}
                style={{ zIndex: 0 }}
                transition={shouldReduceMotion ? { duration: 0 } : SPRING_CONFIG}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
```

**Step 4: Export component in index.ts**

Add to `packages/smoothui/components/index.ts` (alphabetically after `AnimatedTags`):

```ts
export { default as AnimatedTabs } from "./animated-tabs";
```

**Step 5: Create example file**

Create `apps/docs/examples/animated-tabs.tsx`:

```tsx
"use client";

import AnimatedTabs from "@repo/smoothui/components/animated-tabs";
import { BarChart3, Home, Settings, User } from "lucide-react";
import { useState } from "react";

export default function AnimatedTabsDemo() {
  const [activeTab, setActiveTab] = useState("home");

  const tabs = [
    { id: "home", label: "Home", icon: <Home className="h-4 w-4" /> },
    { id: "analytics", label: "Analytics", icon: <BarChart3 className="h-4 w-4" /> },
    { id: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
    { id: "settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-2 text-sm text-muted-foreground">Underline (default)</p>
        <AnimatedTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={tabs}
          variant="underline"
        />
      </div>

      <div>
        <p className="mb-2 text-sm text-muted-foreground">Pill</p>
        <AnimatedTabs
          activeTab={activeTab}
          layoutId="pill-tabs"
          onChange={setActiveTab}
          tabs={tabs}
          variant="pill"
        />
      </div>

      <div>
        <p className="mb-2 text-sm text-muted-foreground">Segment</p>
        <AnimatedTabs
          activeTab={activeTab}
          layoutId="segment-tabs"
          onChange={setActiveTab}
          tabs={tabs}
          variant="segment"
        />
      </div>
    </div>
  );
}
```

**Step 6: Create documentation MDX**

Create `apps/docs/content/docs/components/animated-tabs.mdx`:

```mdx
---
title: Animated Tabs
description: Tab navigation with a smooth sliding indicator that follows the active tab.
icon: LayoutList
dependencies:
  - motion.dev
installer: animated-tabs
---

## Features

- Three variants: underline, pill, and segment
- Smooth sliding indicator animation
- Controlled and uncontrolled modes
- Support for icons in tabs
- Keyboard accessible with ARIA attributes
- Reduced motion support

## Props

<AutoTypeTable
  path="../../packages/smoothui/components/animated-tabs/index.tsx"
  name="AnimatedTabsProps"
/>
```

**Step 7: Add to meta.json**

Add `"animated-tabs"` to `apps/docs/content/docs/components/meta.json` in the "---Basic UI ---" section after "animated-progress-bar":

```json
"animated-tabs",
```

**Step 8: Run dev server to verify**

```bash
pnpm dev
```

Navigate to `http://localhost:3000/docs/components/animated-tabs` and verify all variants work.

**Step 9: Commit**

```bash
git add packages/smoothui/components/animated-tabs apps/docs/examples/animated-tabs.tsx apps/docs/content/docs/components/animated-tabs.mdx apps/docs/content/docs/components/meta.json packages/smoothui/components/index.ts
git commit -m "feat(components): add animated-tabs with underline, pill, segment variants"
```

---

### Task 2: Skeleton Loader Component

**Files:**
- Create: `packages/smoothui/components/skeleton-loader/index.tsx`
- Create: `packages/smoothui/components/skeleton-loader/package.json`
- Create: `packages/smoothui/components/skeleton-loader/tsconfig.json`
- Modify: `packages/smoothui/components/index.ts`
- Create: `apps/docs/examples/skeleton-loader.tsx`
- Create: `apps/docs/content/docs/components/skeleton-loader.mdx`
- Modify: `apps/docs/content/docs/components/meta.json`

**Step 1: Create package.json**

```json
{
  "name": "@repo/skeleton-loader",
  "description": "Animated skeleton loading placeholders",
  "version": "0.0.0",
  "private": true,
  "dependencies": {
    "@repo/shadcn-ui": "workspace:*",
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  },
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "@types/react": "^19.2.2",
    "@types/react-dom": "^19.2.1",
    "typescript": "^5.9.3"
  }
}
```

**Step 2: Create tsconfig.json**

```json
{
  "extends": "@repo/typescript-config/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@repo/*": ["../*"],
      "@/components/*": ["../shadcn-ui/components/*"],
      "@/lib/*": ["../shadcn-ui/lib/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

**Step 3: Create component index.tsx**

```tsx
"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";

export type SkeletonLoaderProps = {
  variant?: "shimmer" | "pulse" | "wave";
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
};

export type SkeletonTextProps = {
  lines?: number;
  lastLineWidth?: string;
  className?: string;
};

export type SkeletonAvatarProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

export type SkeletonCardProps = {
  showAvatar?: boolean;
  showImage?: boolean;
  className?: string;
};

const shimmerStyles = `
  @keyframes skeleton-shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

const pulseStyles = `
  @keyframes skeleton-pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 1; }
  }
`;

const waveStyles = `
  @keyframes skeleton-wave {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

export default function SkeletonLoader({
  variant = "shimmer",
  width,
  height = 20,
  borderRadius = 4,
  className,
}: SkeletonLoaderProps) {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <>
      <style>
        {shimmerStyles}
        {pulseStyles}
        {waveStyles}
      </style>
      <div
        className={cn(
          "relative overflow-hidden bg-muted",
          prefersReducedMotion && "animate-none",
          className
        )}
        style={{
          width: typeof width === "number" ? `${width}px` : width,
          height: typeof height === "number" ? `${height}px` : height,
          borderRadius:
            typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius,
          ...(variant === "shimmer" &&
            !prefersReducedMotion && {
              background:
                "linear-gradient(90deg, hsl(var(--muted)) 25%, hsl(var(--muted-foreground) / 0.1) 50%, hsl(var(--muted)) 75%)",
              backgroundSize: "200% 100%",
              animation: "skeleton-shimmer 1.5s ease-in-out infinite",
            }),
          ...(variant === "pulse" &&
            !prefersReducedMotion && {
              animation: "skeleton-pulse 1.5s ease-in-out infinite",
            }),
        }}
      >
        {variant === "wave" && !prefersReducedMotion && (
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-muted-foreground/10 to-transparent"
            style={{
              animation: "skeleton-wave 1.5s ease-in-out infinite",
            }}
          />
        )}
      </div>
    </>
  );
}

export function SkeletonText({
  lines = 3,
  lastLineWidth = "60%",
  className,
}: SkeletonTextProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLoader
          height={16}
          key={i}
          width={i === lines - 1 ? lastLineWidth : "100%"}
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = "md", className }: SkeletonAvatarProps) {
  const sizeMap = { sm: 32, md: 40, lg: 56 };
  const px = sizeMap[size];

  return (
    <SkeletonLoader
      borderRadius="50%"
      className={className}
      height={px}
      width={px}
    />
  );
}

export function SkeletonCard({
  showAvatar = true,
  showImage = false,
  className,
}: SkeletonCardProps) {
  return (
    <div className={cn("space-y-4 rounded-lg border p-4", className)}>
      {showImage && (
        <SkeletonLoader borderRadius={8} height={160} width="100%" />
      )}
      <div className="flex items-center gap-3">
        {showAvatar && <SkeletonAvatar size="md" />}
        <div className="flex-1 space-y-2">
          <SkeletonLoader height={16} width="40%" />
          <SkeletonLoader height={14} width="60%" />
        </div>
      </div>
      <SkeletonText lastLineWidth="80%" lines={2} />
    </div>
  );
}
```

**Step 4: Export component in index.ts**

Add to `packages/smoothui/components/index.ts` (alphabetically):

```ts
export {
  default as SkeletonLoader,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonText,
} from "./skeleton-loader";
```

**Step 5: Create example file**

Create `apps/docs/examples/skeleton-loader.tsx`:

```tsx
"use client";

import SkeletonLoader, {
  SkeletonAvatar,
  SkeletonCard,
  SkeletonText,
} from "@repo/smoothui/components/skeleton-loader";

export default function SkeletonLoaderDemo() {
  return (
    <div className="space-y-8">
      <div>
        <p className="mb-2 text-sm text-muted-foreground">Variants</p>
        <div className="space-y-4">
          <div>
            <p className="mb-1 text-xs text-muted-foreground">Shimmer (default)</p>
            <SkeletonLoader height={40} variant="shimmer" width={200} />
          </div>
          <div>
            <p className="mb-1 text-xs text-muted-foreground">Pulse</p>
            <SkeletonLoader height={40} variant="pulse" width={200} />
          </div>
          <div>
            <p className="mb-1 text-xs text-muted-foreground">Wave</p>
            <SkeletonLoader height={40} variant="wave" width={200} />
          </div>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm text-muted-foreground">Presets</p>
        <div className="flex items-start gap-8">
          <div>
            <p className="mb-1 text-xs text-muted-foreground">Avatar</p>
            <div className="flex gap-2">
              <SkeletonAvatar size="sm" />
              <SkeletonAvatar size="md" />
              <SkeletonAvatar size="lg" />
            </div>
          </div>
          <div className="flex-1">
            <p className="mb-1 text-xs text-muted-foreground">Text</p>
            <SkeletonText lastLineWidth="50%" lines={3} />
          </div>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm text-muted-foreground">Card Preset</p>
        <div className="max-w-sm">
          <SkeletonCard showAvatar showImage />
        </div>
      </div>
    </div>
  );
}
```

**Step 6: Create documentation MDX**

Create `apps/docs/content/docs/components/skeleton-loader.mdx`:

```mdx
---
title: Skeleton Loader
description: Animated placeholder that indicates content is loading with shimmer, pulse, or wave effects.
icon: Loader
dependencies: []
installer: skeleton-loader
---

## Features

- Three animation variants: shimmer, pulse, wave
- CSS-based animations for optimal performance
- Composable presets: SkeletonText, SkeletonAvatar, SkeletonCard
- Reduced motion support (static when prefers-reduced-motion)
- Fully customizable dimensions and border radius

## Props

<AutoTypeTable
  path="../../packages/smoothui/components/skeleton-loader/index.tsx"
  name="SkeletonLoaderProps"
/>

### SkeletonText Props

<AutoTypeTable
  path="../../packages/smoothui/components/skeleton-loader/index.tsx"
  name="SkeletonTextProps"
/>

### SkeletonAvatar Props

<AutoTypeTable
  path="../../packages/smoothui/components/skeleton-loader/index.tsx"
  name="SkeletonAvatarProps"
/>

### SkeletonCard Props

<AutoTypeTable
  path="../../packages/smoothui/components/skeleton-loader/index.tsx"
  name="SkeletonCardProps"
/>
```

**Step 7: Add to meta.json**

Add `"skeleton-loader"` to `apps/docs/content/docs/components/meta.json` in the "---Basic UI ---" section.

**Step 8: Run dev server to verify**

```bash
pnpm dev
```

**Step 9: Commit**

```bash
git add packages/smoothui/components/skeleton-loader apps/docs/examples/skeleton-loader.tsx apps/docs/content/docs/components/skeleton-loader.mdx apps/docs/content/docs/components/meta.json packages/smoothui/components/index.ts
git commit -m "feat(components): add skeleton-loader with shimmer, pulse, wave variants"
```

---

### Task 3: Notification Badge Component

**Files:**
- Create: `packages/smoothui/components/notification-badge/index.tsx`
- Create: `packages/smoothui/components/notification-badge/package.json`
- Create: `packages/smoothui/components/notification-badge/tsconfig.json`
- Modify: `packages/smoothui/components/index.ts`
- Create: `apps/docs/examples/notification-badge.tsx`
- Create: `apps/docs/content/docs/components/notification-badge.mdx`
- Modify: `apps/docs/content/docs/components/meta.json`

**Step 1: Create package.json**

```json
{
  "name": "@repo/notification-badge",
  "description": "Animated notification badge with count and status variants",
  "version": "0.0.0",
  "private": true,
  "dependencies": {
    "@repo/shadcn-ui": "workspace:*",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "motion": "^11.15.0"
  },
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "@types/react": "^19.2.2",
    "@types/react-dom": "^19.2.1",
    "typescript": "^5.9.3"
  }
}
```

**Step 2: Create tsconfig.json**

(Same as previous tasks)

**Step 3: Create component index.tsx**

```tsx
"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ReactNode } from "react";

export type NotificationBadgeProps = {
  variant?: "dot" | "count" | "status";
  count?: number;
  max?: number;
  status?: "online" | "offline" | "busy" | "away";
  showZero?: boolean;
  ping?: boolean;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  children?: ReactNode;
  className?: string;
};

const SPRING_CONFIG = {
  type: "spring" as const,
  duration: 0.25,
  bounce: 0.1,
};

const statusColors = {
  online: "bg-green-500",
  offline: "bg-gray-400",
  busy: "bg-red-500",
  away: "bg-yellow-500",
};

const positionStyles = {
  "top-right": "-top-1 -right-1",
  "top-left": "-top-1 -left-1",
  "bottom-right": "-bottom-1 -right-1",
  "bottom-left": "-bottom-1 -left-1",
};

export default function NotificationBadge({
  variant = "dot",
  count = 0,
  max = 99,
  status = "online",
  showZero = false,
  ping = false,
  position = "top-right",
  children,
  className,
}: NotificationBadgeProps) {
  const shouldReduceMotion = useReducedMotion();

  const displayCount = count > max ? `${max}+` : count.toString();
  const shouldShow =
    variant === "status" ||
    variant === "dot" ||
    (variant === "count" && (count > 0 || showZero));

  const badge = (
    <AnimatePresence>
      {shouldShow && (
        <motion.span
          animate={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 1, scale: 1 }
          }
          className={cn(
            "absolute flex items-center justify-center",
            positionStyles[position],
            variant === "dot" && "h-2.5 w-2.5 rounded-full bg-red-500",
            variant === "count" &&
              "min-w-[1.25rem] rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-medium text-white",
            variant === "status" && [
              "h-3 w-3 rounded-full",
              statusColors[status],
            ],
            className
          )}
          exit={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0, transition: { duration: 0.15 } }
          }
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0 }}
          key="badge"
          transition={shouldReduceMotion ? { duration: 0 } : SPRING_CONFIG}
        >
          {variant === "count" && displayCount}

          {ping && !shouldReduceMotion && (variant === "dot" || variant === "status") && (
            <span
              className={cn(
                "absolute inset-0 animate-ping rounded-full opacity-75",
                variant === "dot" && "bg-red-500",
                variant === "status" && statusColors[status]
              )}
            />
          )}
        </motion.span>
      )}
    </AnimatePresence>
  );

  if (!children) {
    return badge;
  }

  return (
    <span className="relative inline-flex">
      {children}
      {badge}
    </span>
  );
}
```

**Step 4: Export component in index.ts**

Add to `packages/smoothui/components/index.ts`:

```ts
export { default as NotificationBadge } from "./notification-badge";
```

**Step 5: Create example file**

Create `apps/docs/examples/notification-badge.tsx`:

```tsx
"use client";

import NotificationBadge from "@repo/smoothui/components/notification-badge";
import { Bell, Mail, MessageSquare, User } from "lucide-react";
import { useState } from "react";

export default function NotificationBadgeDemo() {
  const [count, setCount] = useState(5);

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-4 text-sm text-muted-foreground">Variants</p>
        <div className="flex items-center gap-8">
          <div className="text-center">
            <NotificationBadge ping variant="dot">
              <Bell className="h-6 w-6" />
            </NotificationBadge>
            <p className="mt-2 text-xs text-muted-foreground">Dot</p>
          </div>

          <div className="text-center">
            <NotificationBadge count={count} variant="count">
              <Mail className="h-6 w-6" />
            </NotificationBadge>
            <p className="mt-2 text-xs text-muted-foreground">Count</p>
          </div>

          <div className="text-center">
            <NotificationBadge status="online" variant="status">
              <User className="h-6 w-6" />
            </NotificationBadge>
            <p className="mt-2 text-xs text-muted-foreground">Status</p>
          </div>
        </div>
      </div>

      <div>
        <p className="mb-4 text-sm text-muted-foreground">Status Colors</p>
        <div className="flex items-center gap-6">
          {(["online", "away", "busy", "offline"] as const).map((s) => (
            <div className="text-center" key={s}>
              <NotificationBadge ping={s === "online"} status={s} variant="status">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <User className="h-5 w-5" />
                </div>
              </NotificationBadge>
              <p className="mt-2 text-xs text-muted-foreground capitalize">{s}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-4 text-sm text-muted-foreground">Interactive Count</p>
        <div className="flex items-center gap-4">
          <NotificationBadge count={count} max={99} variant="count">
            <MessageSquare className="h-6 w-6" />
          </NotificationBadge>
          <button
            className="rounded border px-3 py-1 text-sm"
            onClick={() => setCount((c) => c + 1)}
          >
            Add
          </button>
          <button
            className="rounded border px-3 py-1 text-sm"
            onClick={() => setCount((c) => Math.max(0, c - 1))}
          >
            Remove
          </button>
          <button
            className="rounded border px-3 py-1 text-sm"
            onClick={() => setCount(100)}
          >
            Set 100
          </button>
        </div>
      </div>
    </div>
  );
}
```

**Step 6: Create documentation MDX**

Create `apps/docs/content/docs/components/notification-badge.mdx`:

```mdx
---
title: Notification Badge
description: Animated badge for showing counts, status indicators, or notification dots.
icon: Bell
dependencies:
  - motion.dev
installer: notification-badge
---

## Features

- Three variants: dot, count, and status
- Animated count changes with scale pop
- Ping animation for attention-grabbing alerts
- Status colors: online, offline, busy, away
- Flexible positioning (4 corners)
- Wrap any element as children
- Reduced motion support

## Props

<AutoTypeTable
  path="../../packages/smoothui/components/notification-badge/index.tsx"
  name="NotificationBadgeProps"
/>
```

**Step 7: Add to meta.json**

Add `"notification-badge"` to `apps/docs/content/docs/components/meta.json` in the "---Basic UI ---" section.

**Step 8: Run dev server to verify**

```bash
pnpm dev
```

**Step 9: Commit**

```bash
git add packages/smoothui/components/notification-badge apps/docs/examples/notification-badge.tsx apps/docs/content/docs/components/notification-badge.mdx apps/docs/content/docs/components/meta.json packages/smoothui/components/index.ts
git commit -m "feat(components): add notification-badge with dot, count, status variants"
```

---

## Phase 2: Interactive Components

### Task 4: Magnetic Button Component

**Files:**
- Create: `packages/smoothui/components/magnetic-button/index.tsx`
- Create: `packages/smoothui/components/magnetic-button/package.json`
- Create: `packages/smoothui/components/magnetic-button/tsconfig.json`
- Modify: `packages/smoothui/components/index.ts`
- Create: `apps/docs/examples/magnetic-button.tsx`
- Create: `apps/docs/content/docs/components/magnetic-button.mdx`
- Modify: `apps/docs/content/docs/components/meta.json`

**Step 1: Create package.json**

```json
{
  "name": "@repo/magnetic-button",
  "description": "Button that subtly follows the cursor with magnetic effect",
  "version": "0.0.0",
  "private": true,
  "dependencies": {
    "@repo/shadcn-ui": "workspace:*",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "motion": "^11.15.0"
  },
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "@types/react": "^19.2.2",
    "@types/react-dom": "^19.2.1",
    "typescript": "^5.9.3"
  }
}
```

**Step 2: Create tsconfig.json**

(Same as previous tasks)

**Step 3: Create component index.tsx**

```tsx
"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { motion, useReducedMotion, useSpring } from "motion/react";
import {
  type ButtonHTMLAttributes,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

export type MagneticButtonProps = {
  children: ReactNode;
  strength?: number;
  radius?: number;
  springConfig?: { duration?: number; bounce?: number };
  disabled?: boolean;
  asChild?: boolean;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function MagneticButton({
  children,
  strength = 0.3,
  radius = 150,
  springConfig = { duration: 0.4, bounce: 0.1 },
  disabled = false,
  className,
  ...props
}: MagneticButtonProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const [isHoverDevice, setIsHoverDevice] = useState(false);

  const x = useSpring(0, { ...springConfig, bounce: springConfig.bounce ?? 0.1 });
  const y = useSpring(0, { ...springConfig, bounce: springConfig.bounce ?? 0.1 });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsHoverDevice(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsHoverDevice(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || shouldReduceMotion || disabled || !isHoverDevice) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < radius) {
      x.set(distX * strength);
      y.set(distY * strength);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const isDisabled = disabled || shouldReduceMotion || !isHoverDevice;

  return (
    <div
      className="inline-block"
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <motion.button
        className={cn(
          "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        disabled={disabled}
        ref={ref}
        style={isDisabled ? {} : { x, y }}
        {...props}
      >
        {children}
      </motion.button>
    </div>
  );
}
```

**Step 4: Export component in index.ts**

Add to `packages/smoothui/components/index.ts`:

```ts
export { default as MagneticButton } from "./magnetic-button";
```

**Step 5: Create example file**

Create `apps/docs/examples/magnetic-button.tsx`:

```tsx
"use client";

import MagneticButton from "@repo/smoothui/components/magnetic-button";

export default function MagneticButtonDemo() {
  return (
    <div className="space-y-8">
      <div>
        <p className="mb-4 text-sm text-muted-foreground">
          Move your cursor near the buttons (hover devices only)
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <MagneticButton>Default Strength</MagneticButton>
          <MagneticButton strength={0.5}>Strong (0.5)</MagneticButton>
          <MagneticButton strength={0.15}>Subtle (0.15)</MagneticButton>
        </div>
      </div>

      <div>
        <p className="mb-4 text-sm text-muted-foreground">Custom Radius</p>
        <div className="flex flex-wrap items-center gap-4">
          <MagneticButton radius={100}>Small Radius</MagneticButton>
          <MagneticButton radius={200}>Large Radius</MagneticButton>
        </div>
      </div>

      <div>
        <p className="mb-4 text-sm text-muted-foreground">Disabled State</p>
        <MagneticButton disabled>Disabled</MagneticButton>
      </div>
    </div>
  );
}
```

**Step 6: Create documentation MDX**

Create `apps/docs/content/docs/components/magnetic-button.mdx`:

```mdx
---
title: Magnetic Button
description: Button that subtly follows the cursor when hovering nearby, creating a magnetic pull effect.
icon: Magnet
dependencies:
  - motion.dev
installer: magnetic-button
---

## Features

- Smooth magnetic cursor-following effect
- Configurable strength and activation radius
- Spring physics for natural movement
- Automatically disabled on touch devices
- Reduced motion support
- Works with any button content

## Props

<AutoTypeTable
  path="../../packages/smoothui/components/magnetic-button/index.tsx"
  name="MagneticButtonProps"
/>
```

**Step 7: Add to meta.json**

Add `"magnetic-button"` to `apps/docs/content/docs/components/meta.json` in the "---Button---" section.

**Step 8: Run dev server to verify**

```bash
pnpm dev
```

**Step 9: Commit**

```bash
git add packages/smoothui/components/magnetic-button apps/docs/examples/magnetic-button.tsx apps/docs/content/docs/components/magnetic-button.mdx apps/docs/content/docs/components/meta.json packages/smoothui/components/index.ts
git commit -m "feat(components): add magnetic-button with cursor-following effect"
```

---

### Task 5: Animated Toggle Component

**Files:**
- Create: `packages/smoothui/components/animated-toggle/index.tsx`
- Create: `packages/smoothui/components/animated-toggle/package.json`
- Create: `packages/smoothui/components/animated-toggle/tsconfig.json`
- Modify: `packages/smoothui/components/index.ts`
- Create: `apps/docs/examples/animated-toggle.tsx`
- Create: `apps/docs/content/docs/components/animated-toggle.mdx`
- Modify: `apps/docs/content/docs/components/meta.json`

**Step 1: Create package.json**

```json
{
  "name": "@repo/animated-toggle",
  "description": "Animated toggle switch with morph and icon variants",
  "version": "0.0.0",
  "private": true,
  "dependencies": {
    "@repo/shadcn-ui": "workspace:*",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "motion": "^11.15.0"
  },
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "@types/react": "^19.2.2",
    "@types/react-dom": "^19.2.1",
    "typescript": "^5.9.3"
  }
}
```

**Step 2: Create tsconfig.json**

(Same as previous tasks)

**Step 3: Create component index.tsx**

```tsx
"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { type ReactNode, useState } from "react";

export type AnimatedToggleProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  variant?: "default" | "morph" | "icon";
  icons?: { on: ReactNode; off: ReactNode };
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  label?: string;
  className?: string;
};

const SPRING_CONFIG = {
  type: "spring" as const,
  duration: 0.25,
  bounce: 0.1,
};

const sizes = {
  sm: { track: "h-5 w-9", thumb: "h-4 w-4", translate: 16 },
  md: { track: "h-6 w-11", thumb: "h-5 w-5", translate: 20 },
  lg: { track: "h-7 w-[52px]", thumb: "h-6 w-6", translate: 24 },
};

export default function AnimatedToggle({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  variant = "default",
  icons,
  size = "md",
  disabled = false,
  label,
  className,
}: AnimatedToggleProps) {
  const shouldReduceMotion = useReducedMotion();
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  const isChecked = controlledChecked ?? internalChecked;
  const sizeConfig = sizes[size];

  const handleToggle = () => {
    if (disabled) return;

    const newValue = !isChecked;
    if (controlledChecked === undefined) {
      setInternalChecked(newValue);
    }
    onChange?.(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <button
        aria-checked={isChecked}
        aria-label={label}
        className={cn(
          "relative inline-flex shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          sizeConfig.track,
          isChecked ? "bg-primary" : "bg-muted",
          disabled && "cursor-not-allowed opacity-50"
        )}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        role="switch"
        type="button"
      >
        <motion.span
          animate={{
            x: isChecked ? sizeConfig.translate : 0,
            borderRadius: variant === "morph" && !shouldReduceMotion
              ? isChecked ? "50%" : "30%"
              : "50%",
          }}
          className={cn(
            "flex items-center justify-center bg-background shadow-sm",
            sizeConfig.thumb
          )}
          initial={false}
          style={{ borderRadius: "50%" }}
          transition={shouldReduceMotion ? { duration: 0 } : SPRING_CONFIG}
        >
          {variant === "icon" && icons && (
            <motion.span
              animate={{ opacity: 1, scale: 1 }}
              className="text-muted-foreground"
              initial={{ opacity: 0, scale: 0.8 }}
              key={isChecked ? "on" : "off"}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.15 }}
            >
              {isChecked ? icons.on : icons.off}
            </motion.span>
          )}
        </motion.span>
      </button>
      {label && (
        <span className="text-sm text-foreground">{label}</span>
      )}
    </div>
  );
}
```

**Step 4: Export component in index.ts**

Add to `packages/smoothui/components/index.ts`:

```ts
export { default as AnimatedToggle } from "./animated-toggle";
```

**Step 5: Create example file**

Create `apps/docs/examples/animated-toggle.tsx`:

```tsx
"use client";

import AnimatedToggle from "@repo/smoothui/components/animated-toggle";
import { Check, Moon, Sun, X } from "lucide-react";
import { useState } from "react";

export default function AnimatedToggleDemo() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-4 text-sm text-muted-foreground">Variants</p>
        <div className="flex flex-col gap-4">
          <AnimatedToggle
            checked={checked}
            label="Default"
            onChange={setChecked}
            variant="default"
          />
          <AnimatedToggle
            checked={checked}
            label="Morph"
            onChange={setChecked}
            variant="morph"
          />
          <AnimatedToggle
            checked={checked}
            icons={{
              on: <Sun className="h-3 w-3" />,
              off: <Moon className="h-3 w-3" />,
            }}
            label="Icon (Sun/Moon)"
            onChange={setChecked}
            variant="icon"
          />
          <AnimatedToggle
            checked={checked}
            icons={{
              on: <Check className="h-3 w-3 text-green-500" />,
              off: <X className="h-3 w-3 text-red-500" />,
            }}
            label="Icon (Check/X)"
            onChange={setChecked}
            variant="icon"
          />
        </div>
      </div>

      <div>
        <p className="mb-4 text-sm text-muted-foreground">Sizes</p>
        <div className="flex items-center gap-6">
          <AnimatedToggle checked={checked} onChange={setChecked} size="sm" />
          <AnimatedToggle checked={checked} onChange={setChecked} size="md" />
          <AnimatedToggle checked={checked} onChange={setChecked} size="lg" />
        </div>
      </div>

      <div>
        <p className="mb-4 text-sm text-muted-foreground">Disabled</p>
        <div className="flex items-center gap-4">
          <AnimatedToggle defaultChecked={false} disabled label="Disabled Off" />
          <AnimatedToggle defaultChecked disabled label="Disabled On" />
        </div>
      </div>
    </div>
  );
}
```

**Step 6: Create documentation MDX**

Create `apps/docs/content/docs/components/animated-toggle.mdx`:

```mdx
---
title: Animated Toggle
description: On/off switch with satisfying morph animations and icon transitions.
icon: ToggleLeft
dependencies:
  - motion.dev
installer: animated-toggle
---

## Features

- Three variants: default, morph, and icon
- Smooth thumb movement with spring physics
- Morph variant changes thumb shape during travel
- Icon variant supports custom on/off icons
- Three sizes: sm, md, lg
- Controlled and uncontrolled modes
- Keyboard accessible (Space/Enter)
- Reduced motion support

## Props

<AutoTypeTable
  path="../../packages/smoothui/components/animated-toggle/index.tsx"
  name="AnimatedToggleProps"
/>
```

**Step 7: Add to meta.json**

Add `"animated-toggle"` to `apps/docs/content/docs/components/meta.json` in the "---Basic UI ---" section.

**Step 8: Run dev server to verify**

```bash
pnpm dev
```

**Step 9: Commit**

```bash
git add packages/smoothui/components/animated-toggle apps/docs/examples/animated-toggle.tsx apps/docs/content/docs/components/animated-toggle.mdx apps/docs/content/docs/components/meta.json packages/smoothui/components/index.ts
git commit -m "feat(components): add animated-toggle with morph and icon variants"
```

---

### Task 6: Comparison Slider Component

**Files:**
- Create: `packages/smoothui/components/comparison-slider/index.tsx`
- Create: `packages/smoothui/components/comparison-slider/package.json`
- Create: `packages/smoothui/components/comparison-slider/tsconfig.json`
- Modify: `packages/smoothui/components/index.ts`
- Create: `apps/docs/examples/comparison-slider.tsx`
- Create: `apps/docs/content/docs/components/comparison-slider.mdx`
- Modify: `apps/docs/content/docs/components/meta.json`

**Step 1: Create package.json**

```json
{
  "name": "@repo/comparison-slider",
  "description": "Before/after image comparison with draggable divider",
  "version": "0.0.0",
  "private": true,
  "dependencies": {
    "@repo/shadcn-ui": "workspace:*",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "motion": "^11.15.0"
  },
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "@types/react": "^19.2.2",
    "@types/react-dom": "^19.2.1",
    "typescript": "^5.9.3"
  }
}
```

**Step 2: Create tsconfig.json**

(Same as previous tasks)

**Step 3: Create component index.tsx**

```tsx
"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { motion, useReducedMotion, useSpring } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

export type ComparisonSliderProps = {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  initialPosition?: number;
  orientation?: "horizontal" | "vertical";
  showLabels?: boolean;
  dividerColor?: string;
  className?: string;
};

export default function ComparisonSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
  initialPosition = 50,
  orientation = "horizontal",
  showLabels = true,
  dividerColor = "white",
  className,
}: ComparisonSliderProps) {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(shouldReduceMotion ? initialPosition : 0);

  const springPosition = useSpring(position, {
    duration: 0.3,
    bounce: 0,
  });

  useEffect(() => {
    if (!shouldReduceMotion) {
      const timer = setTimeout(() => {
        setPosition(initialPosition);
        springPosition.set(initialPosition);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [initialPosition, shouldReduceMotion, springPosition]);

  const updatePosition = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      let newPosition: number;

      if (orientation === "horizontal") {
        newPosition = ((clientX - rect.left) / rect.width) * 100;
      } else {
        newPosition = ((clientY - rect.top) / rect.height) * 100;
      }

      newPosition = Math.max(0, Math.min(100, newPosition));
      setPosition(newPosition);
      springPosition.set(newPosition);
    },
    [orientation, springPosition]
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updatePosition(e.clientX, e.clientY);
  };

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging) return;
      updatePosition(e.clientX, e.clientY);
    },
    [isDragging, updatePosition]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
      return () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
      };
    }
  }, [isDragging, handlePointerMove, handlePointerUp]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const step = 5;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const newPos = Math.max(0, position - step);
      setPosition(newPos);
      springPosition.set(newPos);
    } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const newPos = Math.min(100, position + step);
      setPosition(newPos);
      springPosition.set(newPos);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    updatePosition(e.clientX, e.clientY);
  };

  const isHorizontal = orientation === "horizontal";
  const displayPosition = shouldReduceMotion ? position : springPosition;

  return (
    <div
      className={cn(
        "relative select-none overflow-hidden rounded-lg",
        className
      )}
      onClick={handleClick}
      ref={containerRef}
    >
      {/* After Image (bottom layer) */}
      <img
        alt={afterLabel}
        className="block h-full w-full object-cover"
        draggable={false}
        src={afterImage}
      />

      {/* Before Image (clipped layer) */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        style={{
          clipPath: isHorizontal
            ? `inset(0 ${100 - (displayPosition as unknown as number)}% 0 0)`
            : `inset(0 0 ${100 - (displayPosition as unknown as number)}% 0)`,
        }}
      >
        <img
          alt={beforeLabel}
          className="block h-full w-full object-cover"
          draggable={false}
          src={beforeImage}
        />
      </motion.div>

      {/* Divider */}
      <motion.div
        aria-label="Image comparison slider"
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={Math.round(position)}
        className={cn(
          "absolute cursor-ew-resize",
          isHorizontal
            ? "top-0 bottom-0 w-1 -translate-x-1/2"
            : "left-0 right-0 h-1 -translate-y-1/2 cursor-ns-resize"
        )}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        role="slider"
        style={{
          backgroundColor: dividerColor,
          ...(isHorizontal
            ? { left: `${displayPosition}%` }
            : { top: `${displayPosition}%` }),
        }}
        tabIndex={0}
      >
        {/* Handle */}
        <div
          className={cn(
            "absolute flex items-center justify-center rounded-full bg-white shadow-lg",
            isHorizontal
              ? "left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2"
              : "left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2"
          )}
        >
          <svg
            className={cn(
              "h-5 w-5 text-gray-600",
              !isHorizontal && "rotate-90"
            )}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M18 8L22 12L18 16" />
            <path d="M6 8L2 12L6 16" />
          </svg>
        </div>
      </motion.div>

      {/* Labels */}
      {showLabels && (
        <>
          <span
            className="absolute top-4 left-4 rounded bg-black/50 px-2 py-1 text-sm text-white"
            style={{
              opacity: position > 10 ? 1 : 0,
              transition: "opacity 0.2s",
            }}
          >
            {beforeLabel}
          </span>
          <span
            className="absolute top-4 right-4 rounded bg-black/50 px-2 py-1 text-sm text-white"
            style={{
              opacity: position < 90 ? 1 : 0,
              transition: "opacity 0.2s",
            }}
          >
            {afterLabel}
          </span>
        </>
      )}
    </div>
  );
}
```

**Step 4: Export component in index.ts**

Add to `packages/smoothui/components/index.ts`:

```ts
export { default as ComparisonSlider } from "./comparison-slider";
```

**Step 5: Create example file**

Create `apps/docs/examples/comparison-slider.tsx`:

```tsx
"use client";

import ComparisonSlider from "@repo/smoothui/components/comparison-slider";

export default function ComparisonSliderDemo() {
  return (
    <div className="space-y-8">
      <div>
        <p className="mb-4 text-sm text-muted-foreground">Horizontal (default)</p>
        <div className="max-w-lg">
          <ComparisonSlider
            afterImage="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&h=400&fit=crop&sat=-100"
            beforeImage="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&h=400&fit=crop"
            className="aspect-[3/2]"
          />
        </div>
      </div>

      <div>
        <p className="mb-4 text-sm text-muted-foreground">Vertical</p>
        <div className="max-w-lg">
          <ComparisonSlider
            afterImage="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&sat=-100"
            beforeImage="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"
            className="aspect-[3/2]"
            orientation="vertical"
          />
        </div>
      </div>

      <div>
        <p className="mb-4 text-sm text-muted-foreground">Custom Initial Position</p>
        <div className="max-w-lg">
          <ComparisonSlider
            afterImage="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop&sat=-100"
            afterLabel="Desaturated"
            beforeImage="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop"
            beforeLabel="Original"
            className="aspect-[3/2]"
            initialPosition={25}
          />
        </div>
      </div>
    </div>
  );
}
```

**Step 6: Create documentation MDX**

Create `apps/docs/content/docs/components/comparison-slider.mdx`:

```mdx
---
title: Comparison Slider
description: Before/after image comparison with a draggable divider for showcasing transformations.
icon: SplitSquareHorizontal
dependencies:
  - motion.dev
installer: comparison-slider
---

## Features

- Draggable divider for comparing two images
- Horizontal and vertical orientations
- Animated initial reveal
- Click anywhere to jump to position
- Keyboard navigation (arrow keys)
- Touch and mouse support
- Customizable labels
- Reduced motion support

## Props

<AutoTypeTable
  path="../../packages/smoothui/components/comparison-slider/index.tsx"
  name="ComparisonSliderProps"
/>
```

**Step 7: Add to meta.json**

Add `"comparison-slider"` to `apps/docs/content/docs/components/meta.json` in the "---Others---" section.

**Step 8: Run dev server to verify**

```bash
pnpm dev
```

**Step 9: Commit**

```bash
git add packages/smoothui/components/comparison-slider apps/docs/examples/comparison-slider.tsx apps/docs/content/docs/components/comparison-slider.mdx apps/docs/content/docs/components/meta.json packages/smoothui/components/index.ts
git commit -m "feat(components): add comparison-slider for before/after image reveals"
```

---

### Task 7: Animated Checkbox Component

**Files:**
- Create: `packages/smoothui/components/animated-checkbox/index.tsx`
- Create: `packages/smoothui/components/animated-checkbox/package.json`
- Create: `packages/smoothui/components/animated-checkbox/tsconfig.json`
- Modify: `packages/smoothui/components/index.ts`
- Create: `apps/docs/examples/animated-checkbox.tsx`
- Create: `apps/docs/content/docs/components/animated-checkbox.mdx`
- Modify: `apps/docs/content/docs/components/meta.json`

**Step 1: Create package.json**

```json
{
  "name": "@repo/animated-checkbox",
  "description": "Checkbox with satisfying check animation variants",
  "version": "0.0.0",
  "private": true,
  "dependencies": {
    "@repo/shadcn-ui": "workspace:*",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "motion": "^11.15.0"
  },
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "@types/react": "^19.2.2",
    "@types/react-dom": "^19.2.1",
    "typescript": "^5.9.3"
  }
}
```

**Step 2: Create tsconfig.json**

(Same as previous tasks)

**Step 3: Create component index.tsx**

```tsx
"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { type ReactNode, useId, useState } from "react";

export type AnimatedCheckboxProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  variant?: "draw" | "pop" | "morph";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  indeterminate?: boolean;
  label?: ReactNode;
  className?: string;
};

const sizes = {
  sm: { box: 16, stroke: 1.5 },
  md: { box: 20, stroke: 2 },
  lg: { box: 24, stroke: 2.5 },
};

export default function AnimatedCheckbox({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  variant = "draw",
  size = "md",
  disabled = false,
  indeterminate = false,
  label,
  className,
}: AnimatedCheckboxProps) {
  const shouldReduceMotion = useReducedMotion();
  const id = useId();
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  const isChecked = controlledChecked ?? internalChecked;
  const sizeConfig = sizes[size];

  const handleChange = () => {
    if (disabled) return;

    const newValue = !isChecked;
    if (controlledChecked === undefined) {
      setInternalChecked(newValue);
    }
    onChange?.(newValue);
  };

  const checkVariants = {
    draw: {
      initial: { pathLength: 0, opacity: 0 },
      checked: { pathLength: 1, opacity: 1 },
      transition: { duration: 0.2, ease: "easeOut" },
    },
    pop: {
      initial: { scale: 0, opacity: 0 },
      checked: { scale: 1, opacity: 1 },
      transition: { type: "spring", duration: 0.25, bounce: 0.15 },
    },
    morph: {
      initial: { scale: 0.8, opacity: 0 },
      checked: { scale: 1, opacity: 1 },
      transition: { duration: 0.15 },
    },
  };

  const currentVariant = checkVariants[variant];

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <div className="relative">
        <input
          aria-checked={indeterminate ? "mixed" : isChecked}
          checked={isChecked}
          className="sr-only"
          disabled={disabled}
          id={id}
          onChange={handleChange}
          type="checkbox"
        />
        <label
          className={cn(
            "flex cursor-pointer items-center justify-center rounded border-2 transition-colors",
            isChecked || indeterminate
              ? "border-primary bg-primary"
              : "border-muted-foreground/30 bg-background",
            disabled && "cursor-not-allowed opacity-50",
            "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
          )}
          htmlFor={id}
          style={{
            width: sizeConfig.box,
            height: sizeConfig.box,
          }}
        >
          {variant === "morph" && (
            <motion.div
              animate={
                shouldReduceMotion
                  ? { scale: isChecked ? 1 : 0 }
                  : { scale: isChecked ? 1 : 0 }
              }
              className="absolute inset-0 rounded-sm bg-primary"
              initial={{ scale: 0 }}
              transition={
                shouldReduceMotion ? { duration: 0 } : { duration: 0.15 }
              }
            />
          )}

          <svg
            fill="none"
            height={sizeConfig.box - 4}
            viewBox="0 0 24 24"
            width={sizeConfig.box - 4}
          >
            {indeterminate ? (
              <motion.line
                animate={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : { pathLength: 1, opacity: 1 }
                }
                initial={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { pathLength: 0, opacity: 0 }
                }
                stroke="white"
                strokeLinecap="round"
                strokeWidth={sizeConfig.stroke}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.2 }
                }
                x1={6}
                x2={18}
                y1={12}
                y2={12}
              />
            ) : (
              <motion.path
                animate={
                  shouldReduceMotion
                    ? { opacity: isChecked ? 1 : 0 }
                    : isChecked
                    ? currentVariant.checked
                    : currentVariant.initial
                }
                d="M5 12l5 5L19 7"
                initial={currentVariant.initial}
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={sizeConfig.stroke}
                transition={
                  shouldReduceMotion ? { duration: 0 } : currentVariant.transition
                }
              />
            )}
          </svg>
        </label>
      </div>

      {label && (
        <label
          className={cn(
            "cursor-pointer text-sm text-foreground",
            disabled && "cursor-not-allowed opacity-50"
          )}
          htmlFor={id}
        >
          {label}
        </label>
      )}
    </div>
  );
}
```

**Step 4: Export component in index.ts**

Add to `packages/smoothui/components/index.ts`:

```ts
export { default as AnimatedCheckbox } from "./animated-checkbox";
```

**Step 5: Create example file**

Create `apps/docs/examples/animated-checkbox.tsx`:

```tsx
"use client";

import AnimatedCheckbox from "@repo/smoothui/components/animated-checkbox";
import { useState } from "react";

export default function AnimatedCheckboxDemo() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-4 text-sm text-muted-foreground">Variants</p>
        <div className="flex flex-col gap-4">
          <AnimatedCheckbox
            checked={checked}
            label="Draw (default) - checkmark draws in"
            onChange={setChecked}
            variant="draw"
          />
          <AnimatedCheckbox
            checked={checked}
            label="Pop - checkmark pops with bounce"
            onChange={setChecked}
            variant="pop"
          />
          <AnimatedCheckbox
            checked={checked}
            label="Morph - background fills first"
            onChange={setChecked}
            variant="morph"
          />
        </div>
      </div>

      <div>
        <p className="mb-4 text-sm text-muted-foreground">Sizes</p>
        <div className="flex items-center gap-6">
          <AnimatedCheckbox checked={checked} label="Small" onChange={setChecked} size="sm" />
          <AnimatedCheckbox checked={checked} label="Medium" onChange={setChecked} size="md" />
          <AnimatedCheckbox checked={checked} label="Large" onChange={setChecked} size="lg" />
        </div>
      </div>

      <div>
        <p className="mb-4 text-sm text-muted-foreground">States</p>
        <div className="flex flex-col gap-4">
          <AnimatedCheckbox indeterminate label="Indeterminate" />
          <AnimatedCheckbox defaultChecked disabled label="Disabled (checked)" />
          <AnimatedCheckbox disabled label="Disabled (unchecked)" />
        </div>
      </div>
    </div>
  );
}
```

**Step 6: Create documentation MDX**

Create `apps/docs/content/docs/components/animated-checkbox.mdx`:

```mdx
---
title: Animated Checkbox
description: Checkbox with satisfying check animation - the checkmark draws, pops, or morphs in.
icon: CheckSquare
dependencies:
  - motion.dev
installer: animated-checkbox
---

## Features

- Three animation variants: draw, pop, morph
- Draw variant strokes in the checkmark
- Pop variant bounces the checkmark
- Morph variant fills background first
- Three sizes: sm, md, lg
- Indeterminate state support
- Controlled and uncontrolled modes
- Accessible with hidden native input
- Reduced motion support

## Props

<AutoTypeTable
  path="../../packages/smoothui/components/animated-checkbox/index.tsx"
  name="AnimatedCheckboxProps"
/>
```

**Step 7: Add to meta.json**

Add `"animated-checkbox"` to `apps/docs/content/docs/components/meta.json` in the "---Basic UI ---" section.

**Step 8: Run dev server to verify**

```bash
pnpm dev
```

**Step 9: Commit**

```bash
git add packages/smoothui/components/animated-checkbox apps/docs/examples/animated-checkbox.tsx apps/docs/content/docs/components/animated-checkbox.mdx apps/docs/content/docs/components/meta.json packages/smoothui/components/index.ts
git commit -m "feat(components): add animated-checkbox with draw, pop, morph variants"
```

---

## Phase 3: Blocks

### Task 8: FAQ-3 Searchable Block

**Files:**
- Create: `packages/smoothui/blocks/faq-3/index.tsx`
- Create: `packages/smoothui/blocks/faq-3/package.json`
- Create: `packages/smoothui/blocks/faq-3/tsconfig.json`
- Modify: `apps/docs/content/docs/blocks/faqs.mdx`
- Create: `apps/docs/examples/faq-3.tsx`

**Step 1: Create package.json**

```json
{
  "name": "@repo/faq-3",
  "description": "Searchable FAQ section with filter animations",
  "version": "0.0.0",
  "private": true,
  "dependencies": {
    "@repo/shadcn-ui": "workspace:*",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "lucide-react": "^0.548.0",
    "motion": "^11.15.0"
  },
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "@types/react": "^19.2.2",
    "@types/react-dom": "^19.2.1",
    "typescript": "^5.9.3"
  }
}
```

**Step 2: Create tsconfig.json**

```json
{
  "extends": "@repo/typescript-config/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@repo/*": ["../*"],
      "@/components/*": ["../shadcn-ui/components/*"],
      "@/lib/*": ["../shadcn-ui/lib/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

**Step 3: Create block index.tsx**

```tsx
"use client";

import { ChevronDown, Search } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";

export type FaqSearchableProps = {
  title?: string;
  description?: string;
  searchPlaceholder?: string;
  noResultsText?: string;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
};

const SPRING_CONFIG = {
  type: "spring" as const,
  duration: 0.25,
  bounce: 0.05,
};

export function FaqSearchable({
  title = "Frequently Asked Questions",
  description = "Find answers to common questions about our product and services.",
  searchPlaceholder = "Search questions...",
  noResultsText = "No questions found. Try a different search or contact support.",
  faqs = [
    {
      question: "How do I get started with SmoothUI?",
      answer: "Install via npm or yarn with `npx shadcn@latest add @smoothui/component-name`. Components are designed to work with your existing React and Tailwind setup.",
    },
    {
      question: "Is SmoothUI free to use?",
      answer: "Yes! SmoothUI is completely free and open source under the MIT license. You can use it in personal and commercial projects.",
    },
    {
      question: "What are the system requirements?",
      answer: "SmoothUI requires React 18+ and Tailwind CSS 3+. It works with all modern browsers and supports both JavaScript and TypeScript projects.",
    },
    {
      question: "Can I customize the animations?",
      answer: "Absolutely! All animations use Framer Motion and respect the prefers-reduced-motion media query. You can customize timing, easing, and effects.",
    },
    {
      question: "How do I report bugs or request features?",
      answer: "Open an issue on our GitHub repository. We actively monitor and respond to community feedback.",
    },
    {
      question: "Do you offer enterprise support?",
      answer: "Yes, we offer premium support packages for enterprise teams. Contact us for custom solutions and priority assistance.",
    },
  ],
}: FaqSearchableProps) {
  const shouldReduceMotion = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return faqs;

    const query = searchQuery.toLowerCase();
    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
    );
  }, [faqs, searchQuery]);

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-12 text-center">
          <h2 className="font-semibold text-4xl text-foreground">{title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{description}</p>
        </div>

        {/* Search Input */}
        <div className="relative mb-8">
          <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            className="w-full rounded-lg border border-border bg-background py-3 pr-4 pl-12 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            type="text"
            value={searchQuery}
          />
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.length === 0 ? (
              <motion.p
                animate={{ opacity: 1, y: 0 }}
                className="py-8 text-center text-muted-foreground"
                exit={{ opacity: 0, y: -10 }}
                initial={{ opacity: 0, y: 10 }}
                key="no-results"
                transition={shouldReduceMotion ? { duration: 0 } : SPRING_CONFIG}
              >
                {noResultsText}
              </motion.p>
            ) : (
              filteredFaqs.map((faq, index) => {
                const originalIndex = faqs.indexOf(faq);
                const isOpen = openIndex === originalIndex;

                return (
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg border border-border bg-card"
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    initial={{ opacity: 0, y: 10 }}
                    key={faq.question}
                    layout={!shouldReduceMotion}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { ...SPRING_CONFIG, delay: index * 0.05 }
                    }
                  >
                    <button
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between px-6 py-4 text-left"
                      onClick={() =>
                        setOpenIndex(isOpen ? null : originalIndex)
                      }
                      type="button"
                    >
                      <span className="font-medium text-foreground">
                        {faq.question}
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={
                          shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }
                        }
                      >
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      </motion.span>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          initial={{ height: 0, opacity: 0 }}
                          transition={
                            shouldReduceMotion
                              ? { duration: 0 }
                              : { duration: 0.2 }
                          }
                        >
                          <div className="px-6 pb-4 text-muted-foreground">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default FaqSearchable;
```

**Step 4: Create example file**

Create `apps/docs/examples/faq-3.tsx`:

```tsx
"use client";

import Faq3 from "@repo/smoothui/blocks/faq-3";

const Example = () => (
  <div className="h-full w-full">
    <Faq3 />
  </div>
);

export default Example;
```

**Step 5: Update faqs.mdx**

Add to `apps/docs/content/docs/blocks/faqs.mdx` after FAQ-2 section:

```mdx
## FAQ Searchable

A searchable FAQ section with real-time filtering and animated results.

<Preview path="faq-3" type="block" className="not-prose" />

### Installation

<Installer packageName="faq-3" />
```

**Step 6: Run dev server to verify**

```bash
pnpm dev
```

**Step 7: Commit**

```bash
git add packages/smoothui/blocks/faq-3 apps/docs/examples/faq-3.tsx apps/docs/content/docs/blocks/faqs.mdx
git commit -m "feat(blocks): add faq-3 searchable FAQ with filter animations"
```

---

### Task 9: FAQ-4 Categorized Block

Follow the same pattern as Task 8, creating:
- `packages/smoothui/blocks/faq-4/index.tsx` - Categorized FAQ with tabs
- `packages/smoothui/blocks/faq-4/package.json`
- `packages/smoothui/blocks/faq-4/tsconfig.json`
- `apps/docs/examples/faq-4.tsx`
- Update `apps/docs/content/docs/blocks/faqs.mdx`

The component should use animated tabs to switch between FAQ categories.

**Commit message:** `feat(blocks): add faq-4 categorized FAQ with tab navigation`

---

### Task 10: Footer-3 Mega Footer Block

Follow the same pattern, creating:
- `packages/smoothui/blocks/footer-3/index.tsx` - Mega footer with 4-5 columns, newsletter, social links
- `packages/smoothui/blocks/footer-3/package.json`
- `packages/smoothui/blocks/footer-3/tsconfig.json`
- `apps/docs/examples/footer-3.tsx`
- Update `apps/docs/content/docs/blocks/footer.mdx`

**Commit message:** `feat(blocks): add footer-3 mega footer with newsletter signup`

---

### Task 11: Footer-4 Minimal Footer Block

Follow the same pattern, creating:
- `packages/smoothui/blocks/footer-4/index.tsx` - Minimal single-row footer
- `packages/smoothui/blocks/footer-4/package.json`
- `packages/smoothui/blocks/footer-4/tsconfig.json`
- `apps/docs/examples/footer-4.tsx`
- Update `apps/docs/content/docs/blocks/footer.mdx`

**Commit message:** `feat(blocks): add footer-4 minimal single-row footer`

---

### Task 12: Logo-Cloud-3 Infinite Marquee Block

Follow the same pattern, creating:
- `packages/smoothui/blocks/logo-cloud-3/index.tsx` - Infinite scrolling logo marquee
- `packages/smoothui/blocks/logo-cloud-3/package.json`
- `packages/smoothui/blocks/logo-cloud-3/tsconfig.json`
- `apps/docs/examples/logo-cloud-3.tsx`
- Update `apps/docs/content/docs/blocks/logo-clouds.mdx`

Use CSS animations for the infinite scroll (performant), pause on hover.

**Commit message:** `feat(blocks): add logo-cloud-3 infinite marquee with pause on hover`

---

### Task 13: Logo-Cloud-4 Interactive Grid Block

Follow the same pattern, creating:
- `packages/smoothui/blocks/logo-cloud-4/index.tsx` - Interactive grid with grayscale→color hover
- `packages/smoothui/blocks/logo-cloud-4/package.json`
- `packages/smoothui/blocks/logo-cloud-4/tsconfig.json`
- `apps/docs/examples/logo-cloud-4.tsx`
- Update `apps/docs/content/docs/blocks/logo-clouds.mdx`

Logos are grayscale by default, colorize and lift on hover with tooltip showing company name.

**Commit message:** `feat(blocks): add logo-cloud-4 interactive grid with hover effects`

---

## Final Verification

### Task 14: Full Build and Test

**Step 1: Run full build**

```bash
pnpm build
```

Ensure no TypeScript errors or build failures.

**Step 2: Run code quality checks**

```bash
pnpm check
```

Fix any linting issues with `pnpm fix`.

**Step 3: Test all new components in browser**

Navigate to each component/block documentation page and verify:
- Animations work correctly
- Reduced motion is respected
- All variants function properly
- Mobile/touch behavior is correct

**Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final cleanup and verification for SmoothUI expansion"
```

---

## Summary

**Total Tasks:** 14
**Components Added:** 7 (animated-tabs, skeleton-loader, notification-badge, magnetic-button, animated-toggle, comparison-slider, animated-checkbox)
**Blocks Added:** 6 (faq-3, faq-4, footer-3, footer-4, logo-cloud-3, logo-cloud-4)

**Files Created per Component/Block:**
- `index.tsx` - Main implementation
- `package.json` - Dependencies
- `tsconfig.json` - TypeScript config
- Example file in `apps/docs/examples/`
- Documentation MDX (components only)
- Update to navigation meta.json
