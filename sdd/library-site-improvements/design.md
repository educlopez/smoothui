# Design: Library & Site Improvements

## Technical Approach

Leverage existing Fumadocs + shadcn registry infrastructure. All 4 phases are additive -- no existing APIs change. New components wrap shadcn primitives (already installed) with SmoothUI animation patterns. Testing bootstraps Vitest in the monorepo with Turbo integration.

## Architecture Decisions

| Decision | Choice | Alternative | Rationale |
|----------|--------|-------------|-----------|
| New component primitives | Wrap existing `@repo/shadcn-ui` (dialog, drawer, sheet, breadcrumb, pagination, checkbox, radio-group, select, form, context-menu, dropdown-menu) | Build from scratch with Radix directly | shadcn primitives already installed in `packages/shadcn-ui/components/ui/`; wrapping adds animation layer without reimplementing a11y |
| Test framework | Vitest + React Testing Library + axe-core | Jest | Vitest aligns with Vite/Turbo ecosystem; faster; native ESM support matching project's `"type": "module"` |
| Test file location | Co-located `__tests__/` dir per component | Centralized `/tests` dir | Matches component-as-package pattern; each component is self-contained with own `package.json` |
| Visual regression | Playwright screenshots in CI only | Chromatic/Percy | Zero cost; project already uses GitHub Actions; screenshots stored as artifacts |
| Component search | Client-side Fumadocs built-in search | Custom API route | Fumadocs already provides search infrastructure; `command.tsx` shadcn primitive available for UI |
| Getting Started location | `apps/docs/content/docs/guides/` (already exists with `installation.mdx`, `vite.mdx`, etc.) | New top-level section | Guides section exists and is linked from nav; add `getting-started.mdx` there |
| Shared animation constants | Extract to `packages/smoothui/lib/animation.ts` | Keep inline per component | 10+ components use identical spring config `{ type: "spring", duration: 0.25, bounce: 0.05 }` |
| TypeScript declarations | `tsup` with `--dts` flag (already a devDependency) | `tsc --emitDeclarationOnly` | tsup already in root devDeps; handles bundling + declarations in one pass |

## Data Flow

```
User installs component via CLI or shadcn add
        |
        v
Registry route (apps/docs/app/r/[component]/route.ts)
        |
        v
getPackage() reads component dir, detects deps
        |
        v
Returns RegistryItem JSON with files + deps
        |
        v
shadcn CLI writes files to user's project
```

New components auto-register in the registry -- no route changes needed. The `getPackage()` function in `apps/docs/lib/package.ts` dynamically discovers all packages with `package.json` under `packages/smoothui/`.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| **Phase 1: Documentation** | | |
| `apps/docs/content/docs/guides/getting-started.mdx` | Create | Installation + first component guide |
| `apps/docs/content/docs/guides/meta.json` | Modify | Add getting-started entry |
| `apps/docs/content/docs/components/meta.json` | Modify | Add new Phase 2 component entries in `---Form---` and `---Navigation---` sections |
| **Phase 2: Components (per component)** | | |
| `packages/smoothui/components/{name}/index.tsx` | Create | Component implementation wrapping shadcn primitive |
| `packages/smoothui/components/{name}/package.json` | Create | Deps: `@repo/shadcn-ui`, `motion`, `react` |
| `packages/smoothui/components/{name}/tsconfig.json` | Create | Extends `@repo/typescript-config/nextjs.json` |
| `packages/smoothui/components/index.ts` | Modify | Add export for each new component |
| `apps/docs/examples/{name}.tsx` | Create | Demo file per component |
| `apps/docs/content/docs/components/{name}.mdx` | Create | MDX docs per component |
| **Phase 3: Testing** | | |
| `packages/smoothui/vitest.config.ts` | Create | Vitest config with jsdom, React plugin |
| `packages/smoothui/package.json` | Modify | Add test script + vitest devDeps |
| `packages/smoothui/components/{name}/__tests__/{name}.test.tsx` | Create | Per-component tests |
| `packages/smoothui/test-utils/render.tsx` | Create | Shared render helper with providers |
| `.github/workflows/test.yml` | Create | CI pipeline running `pnpm test` |
| **Phase 4: DX** | | |
| `packages/smoothui/tsup.config.ts` | Create | Declaration generation config |
| `packages/smoothui/lib/animation.ts` | Create | Shared animation constants |

## Interfaces / Contracts

### Component template (Phase 2 pattern)

```tsx
"use client";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { ShadcnPrimitive } from "@repo/shadcn-ui/components/ui/{primitive}";
import { motion, useReducedMotion } from "motion/react";
import { SPRING_DEFAULT } from "../lib/animation";

export interface {Name}Props {
  // Component-specific props
  className?: string;
  children?: React.ReactNode;
}

export default function {Name}({ className, children, ...props }: {Name}Props) {
  const shouldReduceMotion = useReducedMotion();
  // Implementation wrapping shadcn primitive with motion
}
```

### Shared animation constants

```tsx
// packages/smoothui/lib/animation.ts
export const SPRING_DEFAULT = { type: "spring" as const, duration: 0.25, bounce: 0.05 };
export const SPRING_SNAPPY = { type: "spring" as const, duration: 0.2, bounce: 0 };
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const EASE_IN_OUT = [0.645, 0.045, 0.355, 1] as const;
```

### Component package.json template

```json
{
  "name": "@repo/{component-name}",
  "description": "{description}",
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
  },
  "smoothui": {
    "category": "{category}",
    "tags": [],
    "hasReducedMotion": true
  }
}
```

### MDX documentation template

```mdx
---
title: {Component Name}
description: {one-line description}
icon: {LucideIconName}
dependencies:
  - motion.dev
installer: {component-name}
---

<ComponentPreview name="{component-name}" />

## Features
- {feature list}

## Accessibility
### Keyboard Interactions
| Key | Action |
|-----|--------|

### ARIA Attributes
| Attribute | Element | Purpose |
|-----------|---------|---------|

### Reduced Motion
{description of reduced motion behavior}

## Props
<AutoTypeTable
  path="../../packages/smoothui/components/{component-name}/index.tsx"
  name="{ComponentName}Props"
/>
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Smoke | All 64+ components render without error | `render(<Component />)` + no console errors |
| A11y | All interactive components pass axe-core | `axe(container)` with no violations |
| Interaction | Form components, dialogs, dropdowns | `userEvent` for click/keyboard/focus |
| Animation | Reduced motion respected | Mock `useReducedMotion` return value, assert no transform |
| Visual | Key components look correct | Playwright screenshot comparison in CI |

### Vitest configuration

```ts
// packages/smoothui/vitest.config.ts
import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./test-utils/setup.ts"],
    include: ["components/**/__tests__/**/*.test.tsx"],
  },
});
```

## Migration / Rollout

No migration required. All changes are additive:
- Phase 1 adds MDX files to existing `guides/` and `components/` dirs
- Phase 2 adds new component packages (auto-discovered by registry)
- Phase 3 adds Vitest config and test files (Turbo `test` task already defined)
- Phase 4 adds build config for declarations

## Open Questions

- [ ] Should shared animation constants (`SPRING_DEFAULT` etc.) be a separate package or live in `packages/smoothui/lib/`?
- [ ] For Phase 2 form components: should validation integration target react-hook-form, or be agnostic?
- [ ] Visual regression baseline: store screenshots in repo or as CI artifacts only?
