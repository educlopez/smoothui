# SmoothUI primitives

SmoothUI owns its primitive layer. We no longer treat `packages/shadcn-ui` as the
source of truth for published components — that package is docs chrome only until
the site migrates off it.

## Goals

- **Base literally:** [Base UI](https://base-ui.com) (`@base-ui/react`) is the
  headless foundation — own thin, simple primitives, not a parallel design system
- **Job of a primitive:** small building blocks that **components**, **blocks**,
  and **templates** compose — not feature-rich app chrome
- **Headless alternate:** Radix (`radix-ui`) when the consumer’s `components.json`
  `style` is not `base-*`
- **Product layer:** Motion microinteractions + Oat tokens on top of Base parts
- **Install:** `npx shadcn add @smoothui/<name>` — no shadcn `dialog` /
  `button` registry dependency for owned primitives

## Research before shipping (contributors only — not end-user docs)

Before implementing or rewriting a primitive:

1. Read the matching [Base UI](https://base-ui.com/react/components) page —
   parts, a11y, keyboard, form hooks. That is the contract we wrap.
2. Optionally skim [Astryx](https://astryx.atmeta.com/components) for compound
   naming / list / sheet patterns when they clarify the author API (e.g. Field
   Status, Checkbox List, Bottom Sheet). Do not copy Astryx wholesale.
3. For Wave 2+ display/feedback compounds, [Delphi System](https://build.delphi.ai/system)
   is a strong visual/API reference (Badge, Empty, Alert, Command, FilterChip) —
   product-styled, not a headless twin target.
4. Keep the public API small. Prefer Base’s part tree + SmoothUI motion over
   inventing a third abstraction.

Inventory: `apps/docs/lib/primitives-inventory.ts` (`baseUi` + optional `astryx`).
Gallery + sidebar list the full catalog; planned rows are disabled “Soon”.

## Inventory status

Source of truth: `PRIMITIVES_INVENTORY`. Counts below stay in sync with that file
and `/docs/primitives/*.mdx`.

### Available (shipped)

| Primitive | Slug | Base UI | Astryx refs |
|---|---|---|---|
| Smooth Button | `smooth-button` | Button | Button, Icon Button, Button Group |
| Toggle | `toggle` | Toggle | Toggle Button |
| Toggle Group | `toggle-group` | Toggle Group | Toggle Button Group, Segmented Control |
| Toolbar | `toolbar` | Toolbar | Toolbar |
| Checkbox | `checkbox` | Checkbox | Checkbox, Indicator, Input |
| Checkbox Group | `checkbox-group` | Checkbox Group | Checkbox List |
| Radio Group | `radio-group` | Radio Group | Radio, Radio List |
| Select | `select` | Select | Selector, Multi Selector |
| Combobox | `combobox` | Combobox, Autocomplete | Typeahead |
| Input | `input` | Input | Text Input, Input Group |
| Number Field | `number-field` | Number Field | Number Input |
| OTP Field | `otp-field` | OTP Field | Tokenizer |
| Slider | `slider` | Slider | Slider |
| Switch | `switch` | Switch | Switch |
| Field | `field` | Field, Fieldset, Form | Field, Field Label, Field Status |
| Dialog | `dialog` | Dialog, Alert Dialog | Dialog, Alert Dialog |
| Dropdown Menu | `dropdown-menu` | Menu | Dropdown Menu* |
| Context Menu | `context-menu` | Context Menu | Context Menu |
| Drawer | `drawer` | Drawer | Bottom Sheet |
| Popover | `popover` | Popover | Popover |
| Preview Card | `preview-card` | Preview Card | Hover Card |
| Tooltip | `tooltip` | Tooltip | Tooltip |
| Toast | `toast` | Toast | Toast, Banner |
| Accordion | `accordion` | Accordion | Collapsible, Collapsible Group |
| Collapsible | `collapsible` | Collapsible | Collapsible |
| Tabs | `tabs` | Tabs | Tabs, Tab, Segmented Control |
| Menubar | `menubar` | Menubar | Top Nav Menu, Nav Heading Menu |
| Navigation Menu | `navigation-menu` | Navigation Menu | Top Nav, Side Nav, Breadcrumbs |
| Avatar | `avatar` | Avatar | Avatar, Avatar Group, Avatar Status Dot |
| Progress | `progress` | Progress | Progress Bar, Spinner |
| Meter | `meter` | Meter | Status Dot, Indicator |
| Scroll Area | `scroll-area` | Scroll Area | Scrollable Area |
| Separator | `separator` | Separator | Divider |

### Planned (gallery disabled)

None — Wave 1 Base twins and Wave 2 compounds are `available`.

Wave 2 shipped: Badge (+ StatusDot), Skeleton, Spinner, Empty, Alert, Textarea,
Input Group, Kbd, Command, Breadcrumb, Pagination, Code Block (promoted),
Calendar, Sidebar. Avatar Group compounds live on Avatar.

## File layout per dual primitive

```
packages/smoothui/components/<slug>/
  index.tsx           # re-exports the Base (default) implementation
  <slug>.base.tsx     # Base UI + Motion
  <slug>.radix.tsx    # Radix + Motion (same SmoothUI props)
  package.json        # lists both @base-ui/react and radix-ui when dual
  __tests__/          # a11y + interaction (vitest + vitest-axe)
```

The monorepo always runs the Base export. The registry picks which file to ship
based on the consumer's style (see below).

Field-like compounds that have no Radix twin (Base Field only) may ship a single
`index.tsx` — document that on the MDX page. Current Base-only primitives:
Field, Input (Radix has no Input), Toast (Radix Toast has no manager API).

`context-menu` is Radix-only: it ships a single `index.tsx` on `radix-ui` and has
no Base twin. Base UI's Context Menu would only duplicate the same API, and the
convenience props (`items`, `className`) are identical, so a twin adds a file to
maintain without changing what consumers get. Add `context-menu.base.tsx` and
`context-menu.radix.tsx` behind `index.tsx` if a Base-only install ever needs it.

## Microinteraction contract

All owned primitives must:

1. Import `useReducedMotion` from `motion/react` and honor it (instant /
   opacity-only when reduced).
2. Prefer springs from `@/components/smoothui/lib/animation` (or
   `../../lib/animation` in-repo): `SPRING_DEFAULT`, `SPRING_SNAPPY`,
   `DURATION_INSTANT`, overlay presets `OVERLAY_ENTER` / `OVERLAY_EXIT`, and
   press presets `PRESS_SCALE` / `PRESS_TRANSITION`.
3. Animate only `transform` and `opacity` when possible.
4. Keep UI bounce ≤ 0.1 and duration ≈ 0.2–0.25s (max 0.4s for complex overlays).
5. Keep focus-visible rings and keyboard behavior from the headless library —
   do not restyle focus away.

## Shared utilities and tokens

Primitives take their colour and their repeated class recipes from one place,
never from literals:

- `focus-ring` (and `focus-ring-within` for a wrapper whose focusable child is
  nested, such as the slider thumb) is the 3px focus ring on form controls. It
  is a Tailwind v4 `@utility` in `apps/docs/app/smoothui.css`, mirrored in the
  shipped tokens item (`apps/docs/lib/registry-tokens.ts`) so an install of a
  single primitive carries it. The ring is the ring token at 80%: at 50% it
  measured 1.9:1 (light) and 2.4:1 (dark) over the page, under the 3:1
  non-text floor.
- `state-transition` is the shared colour, border and shadow transition for
  stateful controls (150ms, ease-out, off with reduced motion).
- Foreground and surface tokens: `on-brand`, `destructive-fg`,
  `destructive-hover`, `destructive-top`, `destructive-edge`, `btn-drop`,
  `btn-sheen`, `thumb`. A guard test (`scripts/primitives-hardcoded-colors.test.ts`)
  fails on a hex, `rgb(`, `bg-white`, `text-white` or `border-white` in any
  primitive source.
- White text on the brand pink is about 3:1. That pairing is a deliberate brand
  decision: `on-brand` is pinned to white and the ratio is pinned in
  `scripts/primitives-tokens.test.ts`, not held to an AA target. Change the
  brand or `on-brand` and that test fails until the decision is revisited.

Looping animations (skeleton shimmer, spinner, indeterminate progress, the
status pulse) share one preset, `LOOP` and `useLoopInView` in
`packages/smoothui/lib/animation.ts`: `repeat` forever with an explicit
`repeatDelay`, `will-change-transform`, and a pause while the element is off
screen. Reduced motion renders no loop.

## Selection color

One rule for the colour that marks a selected state:

- Controls whose selection is a mark on a surface (`checkbox`,
  `checkbox-group`) fill with the foreground token (`bg-foreground`, check in
  `text-background`). Brand is not used: the check glyph sits on the fill and
  white over the brand pink is about 3:1, under the 3:1 floor for UI glyphs.
- Controls whose selection is the "on" state of a track, dot or range
  (`radio-group`, `switch`, `slider`) use the brand token (`border-brand`,
  `bg-brand`).
- `select` options are a list: the selected row is marked by weight and its
  check icon, and the highlighted row is neutral (`bg-muted text-foreground`).
  A brand or `bg-accent` row fill is not used.

`scripts/primitives-selection-color.test.ts` lists the token each component
uses and asserts it equals this rule.

## Test contract

Every shipped primitive needs at least:

- Render smoke test
- `vitest-axe` a11y pass on the primary state
- Interaction coverage for the main keyboard / pointer path when the control is
  interactive (open/close, toggle, select)

Run from `packages/smoothui`:

```bash
pnpm exec vitest run components/<slug>
```

After a cohort lands, run the full shipped set before asking for review.

## Headless mapping (Radix → Base)

| Concern | Radix | Base UI |
|---|---|---|
| Composition | `asChild` + Slot | `render` prop |
| Checkbox root | `Checkbox.Root` (`radix-ui`) | `Checkbox.Root` (`@base-ui/react/checkbox`) |
| Checkbox indicator | `Checkbox.Indicator` | `Checkbox.Indicator` |
| Dialog root | `Dialog.Root` | `Dialog.Root` |
| Dialog portal/overlay | `Portal` / `Overlay` | `Portal` / `Backdrop` |
| Dialog content | `Content` | `Popup` |
| Menu | `DropdownMenu.*` | `Menu.*` |
| Radio | `RadioGroup.*` | `Radio.*` / `RadioGroup.*` |
| Open state | `open` / `onOpenChange` | `open` / `onOpenChange` (same) |

SmoothUI public props stay stable across twins. Divergences that cannot map are
documented on the component page — never silently different.

## Registry / install story

| URL | Behavior |
|---|---|
| `https://smoothui.dev/r/{name}.json` | **Base** twin (product default) |
| `https://smoothui.dev/r/{style}/{name}.json` | Style-aware: `base-*` → Base files; anything else (`radix-*`, `new-york`, …) → Radix files |

Consumers configure:

```json
{
  "style": "base-nova",
  "registries": {
    "@smoothui": "https://smoothui.dev/r/{style}/{name}.json"
  }
}
```

Prefer Base for new projects. Docs live under `/docs/primitives`.

Owned primitives emit `@base-ui/react` or `radix-ui` in `dependencies` — they do
**not** emit shadcn `registryDependencies` for `button` / `dialog` / etc.

## Utils

`cn` lives in `@repo/smoothui-utils` (`packages/smoothui-utils`). Published
components rewrite it to `@/lib/utils` (or ship a tiny `utils.ts`) so consumers
do not need `@repo/shadcn-ui`.

## Downstream impact (components / blocks / templates)

Owned primitives are the shared base. As each catalog row ships, migrate:

1. **SmoothUI components** that still import `@repo/shadcn-ui/components/ui/*`
   for the same control (dialog, checkbox, …) → `@repo/smoothui/components/<slug>`
   or the published `@smoothui/<slug>` install path.
2. **Blocks & templates** that embed those controls → same swap, so Motion +
   Base/Radix twins stay consistent with the docs gallery.
3. Do not leave parallel shadcn copies of an owned primitive in new work.

Track migrations in the PR that marks the inventory row `available`.

## Exit path for `packages/shadcn-ui`

1. SmoothUI components stop importing `@repo/shadcn-ui/components/ui/*`.
2. SmoothUI components stop importing `@repo/shadcn-ui/lib/utils`.
3. Docs site may keep the package for Fumadocs chrome.
4. `pnpm bump-ui` only refreshes docs chrome — never SmoothUI primitives.
