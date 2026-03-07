# Contributing to SmoothUI

Thank you for your interest in contributing to SmoothUI! This guide covers everything you need to get started.

## Prerequisites

- **Node.js** >= 18
- **pnpm** 10 (install via `corepack enable && corepack prepare pnpm@10 --activate`, or see [pnpm.io/installation](https://pnpm.io/installation))
- **Git**

## Getting Started

1. **Fork and clone** the repository:

   ```bash
   git clone https://github.com/<your-username>/smoothui.git
   cd smoothui
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Start the dev server**:

   ```bash
   pnpm dev
   ```

   This runs Turborepo and starts all workspace dev servers. Open [http://localhost:3000](http://localhost:3000) to view the docs site.

## Project Structure

SmoothUI is a monorepo powered by **Turborepo** and **pnpm workspaces**:

```
smoothui/
├── apps/
│   ├── docs/              # Next.js documentation site (main app)
│   │   ├── content/docs/  # MDX documentation files
│   │   ├── examples/      # Component demo files
│   │   └── app/r/         # shadcn-compatible registry routes
│   └── showcase/          # Component showcase app
├── packages/
│   ├── smoothui/          # Main component library
│   │   └── components/    # Individual UI components
│   ├── shadcn-ui/         # shadcn/ui base components
│   ├── data/              # Shared data structures
│   └── typescript-config/ # Shared TypeScript configs
├── turbo.json             # Turborepo pipeline config
└── package.json           # Root scripts and workspace config
```

## Adding New Components

Every new component requires **five steps**. Missing any step will result in an incomplete implementation.

### Step 1: Create the component

Create a directory at `packages/smoothui/components/<component-name>/` with three files:

**`index.tsx`** -- the component implementation:

```tsx
"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";

export type MyComponentProps = {
  className?: string;
  // ...
};

const MyComponent = ({ className, ...props }: MyComponentProps) => {
  return <div className={cn("...", className)} {...props} />;
};

export default MyComponent;
```

**`package.json`** -- dependencies (use `workspace:*` for internal packages):

```json
{
  "name": "@repo/my-component",
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

**`tsconfig.json`**:

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

Use `kebab-case` for directory names, `PascalCase` for the default export, and `"use client"` if the component uses hooks or interactivity.

### Step 2: Export the component

Add your component to `packages/smoothui/components/index.ts`:

```ts
export { default as MyComponent } from "./my-component";
```

### Step 3: Create an example

Create `apps/docs/examples/my-component.tsx`:

```tsx
"use client";

import MyComponent from "@/packages/smoothui/components/my-component";

const MyComponentDemo = () => {
  return <MyComponent />;
};

export default MyComponentDemo;
```

The file must have a default export named `[ComponentName]Demo`.

### Step 4: Create documentation

Create `apps/docs/content/docs/components/my-component.mdx`:

```mdx
---
title: My Component
description: A short description of what the component does.
icon: IconName
dependencies:
  - motion.dev
installer: my-component
---

## Features

- Feature 1
- Feature 2

## Props

<AutoTypeTable
  path="../../packages/smoothui/components/my-component/index.tsx"
  name="MyComponentProps"
/>
```

Export all prop types so `AutoTypeTable` can generate documentation automatically.

### Step 5: Register in navigation

Add your component to `apps/docs/content/docs/components/meta.json` in the appropriate section, keeping entries **alphabetically sorted** within each group.

## Code Style

- **Arrow functions** over function declarations
- **TypeScript** everywhere -- no `any` types
- **Functional components** only -- no class components
- **`cn()` utility** from `@repo/shadcn-ui/lib/utils` for conditional class merging
- **`const`** by default; `let` only when reassignment is needed
- **Template literals** over string concatenation
- **Destructuring** for object and array parameters
- **`for...of`** instead of `.forEach()`
- **No `console.log`** in production code
- **Strict equality** (`===`) always

### Linting and Formatting

The project uses **Ultracite** (powered by Biome) for linting and formatting:

```bash
# Check for issues
pnpm check

# Auto-fix issues
pnpm fix
```

Run `pnpm check` before submitting a PR. Most issues are auto-fixable with `pnpm fix`.

## Animation Guidelines

SmoothUI uses **Motion** (Framer Motion) for animations. Follow these rules:

### Required: Reduced Motion Support

Every animated component **must** respect `prefers-reduced-motion`. Import and use `useReducedMotion`:

```tsx
import { motion, useReducedMotion } from "motion/react";

const MyAnimatedComponent = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { type: "spring", duration: 0.25, bounce: 0.1 }
      }
    />
  );
};
```

### Key Rules

- **Performance**: Only animate `transform` and `opacity` when possible
- **Duration**: 0.2-0.25s for standard UI, max 0.4s for complex animations
- **Springs**: Default to spring animations with `bounce <= 0.1` and explicit `duration: 0.25`
- **Easing**: Use `cubic-bezier` values, never string easing like `"easeInOut"`
  - Enter: `cubic-bezier(.23, 1, .32, 1)`
  - Move: `cubic-bezier(0.645, 0.045, 0.355, 1)`
- **Hover animations**: Detect hover-capable devices before applying hover effects
- **Hardware acceleration**: Use `transform` property, not `x`/`y` directly

## Development Commands

| Command | Description |
|---------|-------------|
| `pnpm install` | Install all dependencies |
| `pnpm dev` | Start all dev servers (Turborepo) |
| `pnpm build` | Build all packages (runs tests first) |
| `pnpm check` | Lint and format check (Ultracite) |
| `pnpm fix` | Auto-fix lint and format issues |
| `pnpm test` | Run tests across workspaces |
| `pnpm clean` | Remove all `node_modules` |
| `pnpm bump-deps` | Update dependencies |
| `pnpm bump-ui` | Update shadcn/ui components |

## Pull Request Process

1. **Create a feature branch** from `main`:

   ```bash
   git checkout -b feat/my-component
   ```

   Use prefixes: `feat/`, `fix/`, `docs/`, `refactor/`, `chore/`.

2. **Make your changes** following the guidelines above.

3. **Run checks** before committing:

   ```bash
   pnpm check
   pnpm build
   ```

4. **Commit with Conventional Commits** format:

   ```bash
   git commit -m "feat: add my-component with spring animations"
   git commit -m "fix: correct hover detection in tooltip"
   git commit -m "docs: update contributing guide"
   ```

   Common prefixes: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `chore:`, `test:`.

5. **Push and open a PR** against `main`. Include:
   - A clear description of the change
   - Screenshots or screen recordings for visual components
   - A note on how you tested the component

6. **Address review feedback** and ensure CI passes.

## Registry System

SmoothUI provides a **shadcn-compatible registry** at `https://smoothui.dev/r/{name}.json`. Users install components via:

```bash
npx shadcn@latest add https://smoothui.dev/r/{name}.json
```

When you add a new component, the registry automatically picks it up from the component package structure. No extra configuration is needed.

## Questions?

If you have questions, feel free to [open an issue](https://github.com/educlopez/smoothui/issues) on GitHub.
