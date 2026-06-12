---
name: smoothui
description: Install and use SmoothUI — animated React components and blocks built with Tailwind CSS v4 and Motion, distributed through a shadcn-compatible registry. Use when adding animated UI components, page blocks, or SmoothUI themes to a project.
---

# SmoothUI

SmoothUI is a registry of animated React components (buttons, inputs, cards, AI chat primitives) and page blocks (heroes, pricing, testimonials, FAQs, CTAs) built with React 19, Tailwind CSS v4, and Motion (Framer Motion). Docs: https://smoothui.dev

## Installing components

Every item installs through the shadcn CLI. Browse names at https://smoothui.dev/doc or fetch the machine-readable index at https://smoothui.dev/r/registry.json

```bash
# Single component
npx shadcn@latest add https://smoothui.dev/r/smooth-button.json

# Page block (brings its dependencies automatically)
npx shadcn@latest add https://smoothui.dev/r/pricing-1.json
```

To enable the short `@smoothui/<name>` syntax, add the namespace to `components.json`:

```json
{
  "registries": {
    "@smoothui": "https://smoothui.dev/r/{name}.json"
  }
}
```

Then: `npx shadcn@latest add @smoothui/smooth-button`

## Where files land

- Components and blocks: `components/smoothui/<name>/`
- Shared block helpers: `components/smoothui/shared/`
- Animation constants: `components/smoothui/lib/animation.ts`
- Demo data helpers: `lib/smoothui-data/`

Imports inside installed files use the `@/` alias and resolve out of the box in any shadcn-initialized project.

## Themes

SmoothUI ships installable color themes (light + dark, standard shadcn CSS variables, compatible with Radix UI and Base UI projects):

```bash
npx shadcn@latest add https://smoothui.dev/r/theme-candy.json
# Also: theme-indigo, theme-blue, theme-red, theme-orange, theme-green
```

## Animation conventions (follow when extending SmoothUI components)

- Animate only `transform` and `opacity`; durations 0.2–0.3s for UI.
- Spring animations: `{ type: "spring", duration: 0.25, bounce: 0.1 }`; bounce above 0.1 only for playful or drag interactions.
- Easing: `cubic-bezier` values, never string easing like `"easeInOut"`. Entering elements: `cubic-bezier(.23, 1, .32, 1)`.
- Accessibility is mandatory: import `useReducedMotion` from `motion/react`, and disable or reduce animations when it returns true.
- Hover-driven animation needs hover-capable device detection: `window.matchMedia("(hover: hover) and (pointer: fine)")`.

## AI-friendly endpoints

- `https://smoothui.dev/llms.txt` — index for LLMs
- `https://smoothui.dev/llms-full.txt` — full documentation dump
- `https://smoothui.dev/llms-components.json` — structured component metadata
