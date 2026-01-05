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

Follow strict animation rules defined in `.cursor/rules/animations.mdc`:

1. **Performance**: Only animate `transform` and `opacity` when possible
2. **Duration**: Keep animations fast (0.2-0.3s typically, max 1s)
3. **Easing**:
   - Use `ease-out` for entering elements (e.g., `cubic-bezier(.23, 1, .32, 1)`)
   - Use `ease-in-out` for moving elements
   - Avoid `ease-in` as it feels slow
4. **Accessibility**: Always respect `prefers-reduced-motion`
5. **Spring Animations**: Default to spring animations with Motion, avoid bouncy springs except for drag gestures
6. **Hardware Acceleration**: Use `transform` property, not `x`/`y` when using Motion
7. **Origin-Aware**: Set `transform-origin` based on trigger position

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
3. **Follow Ultracite rules** - Accessibility and code quality standards
4. **Use workspace references** - Always use `workspace:*` for internal packages
5. **Keep components self-contained** - Each component should have minimal dependencies
6. **Export all types** - Required for automatic documentation generation
7. **Test in docs site** - Verify components work in the dev environment before committing
