---
name: smoothui-component-craft
description: Create, improve, fix, or review SmoothUI components with production-quality animations, accessibility, and performance. Orchestrates interface-craft, web-design-guidelines, rams, and vercel-react-best-practices skills for high-quality output. Use when the user wants to build a new component, add a variant, improve an existing component, fix a component bug, or review component quality in the SmoothUI project. Triggers on "create component", "build component", "new component", "add component", "improve component", "fix component", "review component", "add variant", "refactor component", or any component work in the smoothui monorepo.
---

# SmoothUI Component Craft

Orchestrate multiple quality skills through a strict phased workflow to produce polished, accessible, performant SmoothUI components.

## Strict Workflow

Every component task follows these phases in order. Do not skip phases.

### Phase 1: Brainstorm & Research

**Invoke `superpowers:brainstorming` first** to explore intent, requirements, and design before any code.

During brainstorming:
- Clarify what the component does and its interaction patterns
- Identify animation requirements (enter, exit, hover, state transitions)
- Decide Motion vs GSAP (prefer Motion unless complex morphing/timelines needed)
- Identify controlled/uncontrolled state needs
- List variants and props

After brainstorming, research existing components in `packages/smoothui/components/` for similar patterns to follow.

### Phase 2: Design with Interface Craft

**Invoke `interface-craft`** to design the animation and interaction layer:
- Define animation stages and sequencing
- Plan spring configurations (duration: 0.25, bounce: ≤0.1 for UI)
- Design hover/focus/active states
- Plan layout animations if needed

Output: animation spec with concrete Motion/GSAP values.

### Phase 3: Implement

Read scaffolding templates from [references/scaffolding.md](references/scaffolding.md) for file templates.

Create all required files:

1. **Component** — `packages/smoothui/components/[name]/index.tsx`
   - `"use client"` directive if interactive
   - Export types as `[ComponentName]Props`
   - Use `cn()` from `@repo/shadcn-ui/lib/utils`
   - Import `useReducedMotion` from `motion/react`

2. **package.json** — `packages/smoothui/components/[name]/package.json`
   - Use `workspace:*` for internal deps

3. **tsconfig.json** — `packages/smoothui/components/[name]/tsconfig.json`

4. **Export** — Add to `packages/smoothui/components/index.ts`

5. **Example** — `apps/docs/examples/[name].tsx`
   - Default export named `[ComponentName]Demo`
   - Show all variants

6. **Docs** — `apps/docs/content/docs/components/[name].mdx`
   - Frontmatter: title, description, icon, dependencies, installer
   - Use `<AutoTypeTable>` for props

7. **Navigation** — Add to `apps/docs/content/docs/components/meta.json` alphabetically in correct section

#### Animation Requirements (non-negotiable)

- Import and use `useReducedMotion` from `motion/react`
- When `shouldReduceMotion` is true: instant transitions (`duration: 0`) or static state
- Only animate `transform` and `opacity`
- Spring: `{ type: "spring", duration: 0.25, bounce: 0.1 }`
- Enter easing: `cubic-bezier(.23, 1, .32, 1)`
- Move easing: `cubic-bezier(0.645, 0.045, 0.355, 1)`
- Never use string easing like `"easeInOut"`
- Hover animations: detect hover-capable devices with `matchMedia("(hover: hover) and (pointer: fine)")`

#### Accessibility Requirements (non-negotiable)

- Semantic HTML (`<button>`, `<nav>`, not `<div>` with roles)
- ARIA attributes (`aria-label`, `aria-expanded`, `role`, etc.)
- Keyboard navigation (arrow keys, Enter, Escape as appropriate)
- Proper `tabIndex` management (never positive values)
- Alt text for images
- Color contrast compliance

### Phase 4: Quality Review

Run all three review skills in sequence:

1. **Invoke `vercel-react-best-practices`** — Check React/Next.js performance patterns
2. **Invoke `web-design-guidelines`** — Check Web Interface Guidelines compliance
3. **Invoke `rams`** — Run accessibility and visual design review

Fix all issues found before considering the component complete.

### Phase 5: Verify

- Run `pnpm check` from project root to verify linting
- Run `pnpm build` to verify the build passes
- Start dev server and visually verify in browser if possible

## Improving Existing Components

For improvement tasks, skip Phase 1 brainstorming if the change is small (e.g., "add a variant"). Otherwise follow full workflow.

Always:
1. Read the existing component first
2. Identify what's missing (reduced motion? keyboard nav? hover detection?)
3. Apply changes
4. Run Phase 4 review skills
5. Run Phase 5 verification

## Quick Reference: File Paths

| File | Path |
|------|------|
| Components | `packages/smoothui/components/[name]/` |
| Component index | `packages/smoothui/components/index.ts` |
| Examples | `apps/docs/examples/[name].tsx` |
| Docs | `apps/docs/content/docs/components/[name].mdx` |
| Nav config | `apps/docs/content/docs/components/meta.json` |
