# Component API Documentation Template

**Internal reference — not published to the docs site.**

Use this template when creating MDX documentation for new SmoothUI components. Copy the structure below into `apps/docs/content/docs/components/{component-name}.mdx` and fill in the details.

---

## Template

```mdx
---
title: Component Name
description: One-line description of what the component does and its key animation feature.
icon: LucideIconName
dependencies:
  - motion.dev
installer: component-name
---

<ComponentPreview name="component-name" />

## Features

- Feature one (e.g., controlled open/close props)
- Feature two (e.g., keyboard navigation)
- Feature three (e.g., customizable via className)
- Spring-based animations with reduced motion support

## Accessibility

### Keyboard Interactions

| Key | Description |
|-----|-------------|
| `Enter` | Activates the component |
| `Space` | Activates the component |
| `Escape` | Closes/dismisses the component |
| `Tab` | Moves focus to next focusable element |
| `Shift + Tab` | Moves focus to previous focusable element |
| `Arrow Down` | Moves to next item (for list-based components) |
| `Arrow Up` | Moves to previous item (for list-based components) |

### ARIA Attributes

| Attribute | Element | Purpose |
|-----------|---------|---------|
| `role="dialog"` | Container | Identifies the element role |
| `aria-modal="true"` | Container | Indicates modal behavior |
| `aria-labelledby` | Container | References the title element |
| `aria-label` | Interactive element | Provides accessible name |
| `aria-expanded` | Trigger | Indicates open/closed state |
| `aria-hidden="true"` | Decorative element | Hides from screen readers |

### Screen Reader

- Describe what happens when the component opens (focus management)
- Describe how content is announced
- Describe what happens on close (focus restoration)

### Reduced Motion

This component respects the `prefers-reduced-motion` media query via `useReducedMotion` from Motion. When reduced motion is preferred, [describe which animations are disabled and how the component behaves instead].

## Props

<AutoTypeTable
  path="../../packages/smoothui/components/{component-name}/index.tsx"
  name="{ComponentName}Props"
/>
```

---

## Guidelines

1. **Frontmatter fields**:
   - `title`: PascalCase component name with spaces (e.g., "Basic Modal")
   - `description`: One sentence, starts with what it is, mentions key animation
   - `icon`: Any valid [Lucide icon name](https://lucide.dev/icons)
   - `dependencies`: List external deps (motion.dev, lucide.dev, usehooks.com, etc.)
   - `installer`: kebab-case component directory name (used by shadcn CLI)

2. **ComponentPreview**: Uses the example file at `apps/docs/examples/{component-name}.tsx`. The example must be a default export named `{ComponentName}Demo`.

3. **AutoTypeTable**: The `path` is relative to the MDX file location. The `name` must match the exact exported TypeScript type (usually `{ComponentName}Props`).

4. **Keyboard table**: Only include keys that the component actually handles. Remove irrelevant rows.

5. **ARIA table**: Only include attributes that are actually present in the component implementation.

6. **Reduced Motion section**: Be specific about which animations are affected. Don't use generic descriptions.

7. **Don't forget** to add the component to `apps/docs/content/docs/components/meta.json` in the appropriate section (alphabetically sorted within the section).
