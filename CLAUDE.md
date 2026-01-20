# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SmoothUI is a collection of beautifully designed React components with smooth animations built using React, Tailwind CSS, and Motion (Framer Motion). The project uses a monorepo structure powered by Turborepo and pnpm workspaces, and provides a shadcn-compatible component registry system.

## Monorepo Structure

```
smoothui/
├── apps/
│   ├── docs/          # Next.js documentation site (main app)
│   └── showcase/      # Component showcase
├── packages/
│   ├── smoothui/      # Main component library
│   │   ├── components/    # Individual UI components
│   │   ├── blocks/        # Pre-built page sections
│   │   ├── hooks/         # Reusable hooks
│   │   ├── utils/         # Utility functions
│   │   └── lib/           # Shared libraries
│   ├── shadcn-ui/     # shadcn/ui components
│   ├── data/          # Shared data structures
│   └── typescript-config/ # Shared TypeScript configs
```

## Development Commands

### Install Dependencies
```bash
pnpm install
```

### Development
```bash
# Start all dev servers (uses Turbo)
pnpm dev

# Start docs site only
cd apps/docs && pnpm dev
```

### Building
```bash
# Build all packages (runs tests first)
pnpm build

# Build specific workspace
turbo build --filter=docs
```

### Code Quality
```bash
# Check code quality (uses Ultracite for linting)
pnpm check

# Auto-fix linting issues
pnpm fix

# Run tests
pnpm test
```

### Dependency Management
```bash
# Update dependencies
pnpm bump-deps

# Update shadcn components
pnpm bump-ui
```

## Component Architecture

### Component Structure

Each component in `packages/smoothui/components/[component-name]/`:
- Uses `kebab-case` for directory names
- Exports default component in `PascalCase`
- Must include `package.json`, `tsconfig.json`, and `index.tsx`
- Should use `"use client"` directive if using React hooks or interactivity
- Must export TypeScript types with `[ComponentName]Props` naming convention

### Key Conventions

1. **Imports**: Use workspace aliases
   - `@repo/shadcn-ui` for shadcn components
   - `@repo/shadcn-ui/lib/utils` for utilities like `cn()`
   - `@smoothui/data` for shared data

2. **Styling**: Always use `cn()` utility from `@repo/shadcn-ui/lib/utils` for conditional classes

3. **Exports**: Components are centralized in `packages/smoothui/components/index.ts`

4. **Types**: Export all prop types for automatic documentation generation via `AutoTypeTable`

### Animation Guidelines (Critical)

Follow strict animation rules defined in `.cursor/rules/animations.mdc` and see `ANIMATION_IMPROVEMENTS.md` for detailed improvements:

1. **Performance**: Only animate `transform` and `opacity` when possible
2. **Duration**: Keep animations fast (0.2-0.3s typically, max 0.4s for complex, max 1s for decorative)
3. **Easing**:
   - Use `ease-out` for entering elements: `cubic-bezier(.23, 1, .32, 1)`
   - Use `ease-in-out` for moving elements: `cubic-bezier(0.645, 0.045, 0.355, 1)`
   - Use `ease` for hover/color transitions: `ease` (built-in CSS)
   - **NEVER** use string easing like `"easeInOut"` - use proper `cubic-bezier` values
   - Avoid `ease-in` as it feels slow
4. **Accessibility**: 
   - **MUST** import and use `useReducedMotion` from `motion/react`
   - **MUST** check `shouldReduceMotion` before applying animations
   - **MUST** disable animations instantly when `shouldReduceMotion` is true
   - See pattern below for implementation
5. **Spring Animations**: 
   - Default to spring animations with Motion
   - Use bounce ≤ 0.1 for UI elements (only 0.2-0.3 for playful/drag interactions)
   - Always include explicit `duration: 0.25` for consistency
6. **Hardware Acceleration**: Use `transform` property, not `x`/`y` when using Motion
7. **Origin-Aware**: Set `transform-origin` based on trigger position
8. **Touch Devices**: For hover-based animations, detect hover-capable devices:
   ```tsx
   const [isHoverDevice, setIsHoverDevice] = useState(false);
   useEffect(() => {
     const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
     setIsHoverDevice(mediaQuery.matches);
     // ... handle change events
   }, []);
   ```

#### Required Animation Pattern

**Every animated component MUST follow this pattern:**

```tsx
import { motion, useReducedMotion } from "motion/react";

function MyComponent() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={
        shouldReduceMotion
          ? { opacity: 1 } // Minimal or no animation
          : { opacity: 1, scale: 1, y: 0 } // Full animation
      }
      initial={
        shouldReduceMotion
          ? { opacity: 1 }
          : { opacity: 0, scale: 0.95, y: 10 }
      }
      exit={
        shouldReduceMotion
          ? { opacity: 0, transition: { duration: 0 } }
          : { opacity: 0, scale: 0.95, y: 10 }
      }
      transition={
        shouldReduceMotion
          ? { duration: 0 } // Instant
          : { type: "spring", duration: 0.25, bounce: 0.1 }
      }
    >
      {/* content */}
    </motion.div>
  );
}
```

#### Animation Checklist for New Components

When adding animations, ensure:

- [ ] Import `useReducedMotion` from `motion/react`
- [ ] Check `shouldReduceMotion` before applying animations
- [ ] Use durations between 0.2-0.25s (max 0.3s for standard UI, 0.4s for complex)
- [ ] Use proper `cubic-bezier` values, never string easing like `"easeInOut"`
- [ ] Add hover device detection for hover-based animations
- [ ] Keep bounce values ≤ 0.1 for UI animations
- [ ] Only animate `transform` and `opacity`
- [ ] Test with `prefers-reduced-motion` enabled
- [ ] Add explicit spring duration (e.g., `duration: 0.25`)

See `ANIMATION_IMPROVEMENTS.md` for complete examples and all improved components.

### Accessibility Requirements

Follow Ultracite rules (`.cursor/rules/ultracite.mdc`):
- Always include ARIA attributes where appropriate
- Ensure interactive elements are keyboard accessible
- Use semantic HTML elements
- Include alt text for images
- Respect `prefers-reduced-motion` in animations
- Don't use positive `tabIndex` values
- Ensure proper color contrast

## Adding New Components

### Complete Workflow Checklist

**CRITICAL: Follow ALL steps below. Missing any step will result in an incomplete implementation.**

1. **Create Component Structure** in `packages/smoothui/components/[component-name]/`:
   - `index.tsx` - Component implementation
   - `package.json` - Dependencies (use workspace references)
   - `tsconfig.json` - TypeScript config extending `@repo/typescript-config/nextjs.json`

2. **Export Component** in `packages/smoothui/components/index.ts`:
   ```ts
   export { default as ComponentName } from "./component-name";
   ```

3. **Create Example** in `apps/docs/examples/[component-name].tsx`:
   - Must be a default export named `[ComponentName]Demo`
   - Show different variations/use cases
   - Use `"use client"` directive if interactive

4. **Create Documentation** in `apps/docs/content/docs/components/[component-name].mdx`:
   - Include frontmatter with: `title`, `description`, `icon`, `dependencies`, `installer`
   - Use `AutoTypeTable` component to auto-generate props documentation
   - Document features and usage examples

5. **Register in Navigation** - Add to `apps/docs/content/docs/components/meta.json` in appropriate section (alphabetically sorted)

### Quick Checklist
- [ ] Component files created (`index.tsx`, `package.json`, `tsconfig.json`)
- [ ] Component exported in `packages/smoothui/components/index.ts`
- [ ] Example file created in `apps/docs/examples/[component-name].tsx`
- [ ] Documentation file created in `apps/docs/content/docs/components/[component-name].mdx`
- [ ] Added to `apps/docs/content/docs/components/meta.json`
- [ ] Tested component in dev environment

## Registry System

SmoothUI provides a shadcn-compatible registry at `https://smoothui.dev/r/{name}.json`:

- Registry routes are in `apps/docs/app/r/`
- Package generation logic is in `apps/docs/lib/package.ts`
- Components auto-bundle dependencies and utilities
- Users install via: `npx shadcn@latest add @smoothui/component-name`

## Technology Stack

- **Framework**: Next.js 16 with App Router and Turbopack
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Animations**: Motion (Framer Motion) 12
- **Package Manager**: pnpm 10
- **Monorepo Tool**: Turborepo 2
- **Documentation**: Fumadocs
- **Type Checking**: TypeScript 5
- **Linting**: Ultracite (Biome-based)

## Code Style

- Use **arrow functions** over function expressions
- Use **TypeScript** - no `any` types, prefer explicit types
- Use **functional components** - no class components
- Use **const** for all variables unless reassignment needed
- Use **template literals** over string concatenation
- Use **object/array destructuring** where appropriate
- Export types using `export type`
- Use `for-of` instead of `Array.forEach`
- Don't use `console.log` in production code
- Use `===` instead of `==`

## Documentation Site (apps/docs)

Built with Next.js and Fumadocs:
- Route handlers in `app/api/` and `app/r/`
- Content in `content/docs/` as MDX files
- Examples in `examples/` directory
- Component type introspection via fumadocs-typescript

## Testing

The build process includes test running - builds depend on passing tests (see `turbo.json`).

## Important Notes

1. **Never commit sensitive data** - No API keys, tokens, or credentials
2. **Respect animation guidelines** - Performance and accessibility are critical
   - See `ANIMATION_IMPROVEMENTS.md` for complete animation standards
   - All new animated components MUST include `useReducedMotion` support
3. **Follow Ultracite rules** - Accessibility and code quality standards
4. **Use workspace references** - Always use `workspace:*` for internal packages
5. **Keep components self-contained** - Each component should have minimal dependencies
6. **Export all types** - Required for automatic documentation generation
7. **Test in docs site** - Verify components work in the dev environment before committing
8. **Animation improvements** - When improving existing components:
   - Add `useReducedMotion` support if missing
   - Optimize durations to 0.2-0.25s range
   - Replace string easing with `cubic-bezier` values
   - Add hover device detection for hover animations
   - Update `ANIMATION_IMPROVEMENTS.md` with changes
