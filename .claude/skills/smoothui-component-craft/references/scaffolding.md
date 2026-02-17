# SmoothUI Component Scaffolding Templates

## Component index.tsx

```tsx
"use client";

import type { HTMLAttributes } from "react";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@repo/shadcn-ui/lib/utils";

export type ComponentNameProps = HTMLAttributes<HTMLDivElement> & {
  // Add component-specific props here
};

const ComponentName = ({ className, ...props }: ComponentNameProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn("", className)}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { type: "spring", duration: 0.25, bounce: 0.1 }
      }
      {...props}
    >
      {/* content */}
    </motion.div>
  );
};

export default ComponentName;
```

## Component package.json

```json
{
  "name": "@repo/COMPONENT-KEBAB",
  "description": "DESCRIPTION",
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

## Component tsconfig.json

```json
{
  "extends": "@repo/typescript-config/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@repo/*": ["../*"],
      "@/components/*": ["../shadcn-ui/components/*"],
      "@/lib/*": ["../shadcn-ui/lib/*"]
    },
    "strictNullChecks": true
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

## Example file (apps/docs/examples/COMPONENT-KEBAB.tsx)

```tsx
"use client";

import ComponentName from "@repo/smoothui/components/COMPONENT-KEBAB";

const ComponentNameDemo = () => (
  <div className="flex min-h-[300px] items-center justify-center">
    <ComponentName />
  </div>
);

export default ComponentNameDemo;
```

## Documentation MDX (apps/docs/content/docs/components/COMPONENT-KEBAB.mdx)

```mdx
---
title: Component Name
description: Brief description of the component.
icon: IconName
dependencies:
  - motion.dev
installer: COMPONENT-KEBAB
---

## Features

- Feature 1
- Feature 2
- Respects reduced motion preferences

## Props

<AutoTypeTable
  path="../../packages/smoothui/components/COMPONENT-KEBAB/index.tsx"
  name="ComponentNameProps"
/>
```

## Export line (packages/smoothui/components/index.ts)

```ts
export { default as ComponentName } from "./COMPONENT-KEBAB";
```

## meta.json entry

Add alphabetically within the appropriate section in `apps/docs/content/docs/components/meta.json`.
