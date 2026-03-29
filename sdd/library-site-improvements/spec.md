# Specification: Library & Site Improvements

## Phase 1 — Documentation

### Requirement: Getting Started Guide

The docs site MUST provide a Getting Started page at `/docs/guides/getting-started` covering installation (`pnpm add`/`npx shadcn`), project setup (Next.js/Vite), and rendering a first component.

#### Scenario: New user follows guide

- GIVEN a developer visits the Getting Started page
- WHEN they follow the installation steps in a fresh Next.js project
- THEN they can render a SmoothUI component without errors

### Requirement: Per-Component API Reference

Every exported component MUST have an MDX docs page with an `AutoTypeTable` rendering all exported props.

#### Scenario: Component props are documented

- GIVEN any component listed in `packages/smoothui/components/index.ts`
- WHEN a user visits its docs page
- THEN all exported `*Props` types are displayed with name, type, default, and description

### Requirement: Accessibility Matrix

The docs site SHOULD include an accessibility reference page listing each interactive component's keyboard support, ARIA roles, and screen reader behavior.

#### Scenario: Matrix lists keyboard interactions

- GIVEN the a11y matrix page
- WHEN a user looks up "basic-modal"
- THEN they see: Escape closes, Tab traps focus, role=dialog, aria-labelledby present

### Requirement: Component Search

The docs site MUST support text search/filter on the components listing page. Results MUST update as the user types.

#### Scenario: Filtering components

- GIVEN the components index page with search input
- WHEN a user types "toast"
- THEN only components with "toast" in name or description are shown

---

## Phase 2 — Essential Components

All new components MUST follow existing conventions:
- Directory at `packages/smoothui/components/{kebab-name}/` with `index.tsx`, `package.json`, `tsconfig.json`
- `"use client"` directive
- Export `default` function and `{PascalName}Props` type
- Use `useReducedMotion` from `motion/react`; disable animations when true
- Spring animations with `duration: 0.25`, `bounce <= 0.1`
- Keyboard navigation and ARIA attributes per WAI-ARIA patterns
- Focus management (trap where applicable, restore on dismiss)

### Requirement: Drawer Component

The system MUST provide a Drawer that slides from a configurable side (top/right/bottom/left). MUST support controlled open/close, backdrop click dismiss, Escape key dismiss, and focus trap.

#### Scenario: Drawer opens from bottom

- GIVEN a closed Drawer with `side="bottom"`
- WHEN the trigger is activated
- THEN the Drawer slides up from viewport bottom with spring animation
- AND focus moves to first focusable element inside

### Requirement: Dialog Component

The system MUST provide a Dialog (modal) and AlertDialog variant. MUST support title, description, close button, focus trap, Escape dismiss, and `role="dialog"` / `role="alertdialog"`.

#### Scenario: AlertDialog requires explicit action

- GIVEN an open AlertDialog
- WHEN the user presses Escape
- THEN the dialog does NOT close (requires confirm/cancel button)

### Requirement: Breadcrumb Component

The system MUST provide a Breadcrumb with ordered `<nav aria-label="Breadcrumb">` and `<ol>` markup. Last item MUST have `aria-current="page"`.

#### Scenario: Renders navigation path

- GIVEN breadcrumb items `["Home", "Docs", "Button"]`
- WHEN rendered
- THEN an ordered list with 3 items and separator icons is displayed
- AND the last item is not a link and has `aria-current="page"`

### Requirement: Pagination Component

The system MUST provide a Pagination with previous/next buttons, page numbers, and ellipsis for large ranges. MUST support controlled `page` and `onPageChange`.

#### Scenario: Large page count shows ellipsis

- GIVEN `totalPages=20`, `currentPage=10`
- WHEN rendered
- THEN pages 1, ..., 9, 10, 11, ..., 20 are shown

### Requirement: Menu Component

The system MUST provide composable Dropdown Menu and Context Menu components. MUST support nested submenus, keyboard arrow navigation, and `role="menu"` / `role="menuitem"`.

#### Scenario: Keyboard navigation through menu

- GIVEN an open dropdown menu with 4 items
- WHEN user presses ArrowDown 3 times then Enter
- THEN the 3rd item receives focus and is activated

### Requirement: Checkbox Component

The system MUST provide a Checkbox with `checked`, `indeterminate`, and `onChange` props. MUST use native `<input type="checkbox">` or equivalent ARIA.

#### Scenario: Indeterminate state

- GIVEN a Checkbox with `indeterminate={true}`
- WHEN rendered
- THEN `aria-checked="mixed"` is set and visual indicator shows indeterminate

### Requirement: Radio Component

The system MUST provide a RadioGroup with Radio items. MUST support arrow key navigation between options within the group, per WAI-ARIA radio pattern.

#### Scenario: Arrow key cycles through options

- GIVEN a RadioGroup with 3 options, first selected
- WHEN user presses ArrowDown twice
- THEN the third option becomes selected and focused

### Requirement: Select Component

The system MUST provide a Select dropdown. MUST support single selection, keyboard navigation, `aria-expanded`, `role="listbox"`, and typeahead character matching.

#### Scenario: Typeahead selects matching option

- GIVEN an open Select with options ["Apple", "Banana", "Cherry"]
- WHEN user types "b"
- THEN "Banana" receives focus

### Requirement: Combobox Component

The system MUST provide a Combobox (Select + text filter). MUST support async option loading via a callback and display a loading indicator.

#### Scenario: Async filtering

- GIVEN a Combobox with `onSearch` async callback
- WHEN user types "react"
- THEN a loading spinner appears, then filtered results display

### Requirement: Form Component

The system MUST provide a Form wrapper that integrates with validation libraries (react-hook-form or similar). MUST surface field-level errors with `aria-describedby` linking error messages.

#### Scenario: Validation error display

- GIVEN a Form with a required email field left empty
- WHEN user submits
- THEN an error message appears below the field
- AND `aria-describedby` on the input references the error element
- AND `aria-invalid="true"` is set on the input

---

## Phase 3 — Testing

### Requirement: Vitest Configuration

The project MUST have a Vitest config at the monorepo root (or per-package) that can run all component tests via `pnpm test`.

#### Scenario: Test runner executes

- GIVEN Vitest is configured
- WHEN `pnpm test` runs
- THEN all test suites in `packages/smoothui/` execute and report results

### Requirement: Smoke Render Tests

Every exported component (64 existing + new) MUST have at least one test verifying it renders without throwing.

#### Scenario: Component renders

- GIVEN any component from `index.ts` exports
- WHEN rendered with minimal required props via React Testing Library
- THEN no errors are thrown and the component mounts to DOM

### Requirement: Accessibility Tests

All interactive components MUST pass axe-core automated accessibility checks with zero violations at "critical" and "serious" levels.

#### Scenario: axe audit passes

- GIVEN a rendered interactive component (e.g., Dialog, Select)
- WHEN axe-core runs against the container
- THEN zero critical or serious violations are reported

### Requirement: CI Pipeline

The project MUST have a GitHub Actions workflow that runs tests on every PR targeting `main`.

#### Scenario: PR triggers tests

- GIVEN a PR is opened against `main`
- WHEN the CI workflow runs
- THEN lint, type-check, and test jobs execute
- AND the PR status is blocked if any job fails

---

## Phase 4 — Developer Experience

### Requirement: TypeScript Declarations

The build process MUST generate `.d.ts` files for all exported components, types, hooks, and utils.

#### Scenario: Declarations are consumable

- GIVEN a consuming project installs `@smoothui/component`
- WHEN they import a component in TypeScript strict mode
- THEN full type information is available without additional `@types` packages

### Requirement: Integration Guides

The docs MUST include setup guides for Next.js, Vite, and Remix covering installation, Tailwind config, and motion setup.

#### Scenario: Vite guide works end-to-end

- GIVEN a developer follows the Vite integration guide
- WHEN they complete all steps in a fresh Vite + React project
- THEN a SmoothUI animated component renders correctly with animations

### Requirement: Component Playground

The docs site SHOULD provide an interactive playground where users MAY edit component props and see live preview.

#### Scenario: Prop editing updates preview

- GIVEN the playground page for a Button component
- WHEN user changes a prop value in the editor panel
- THEN the preview re-renders immediately reflecting the change
