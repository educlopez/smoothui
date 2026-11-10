# AGENTS.md

The single guide for agents and contributors working in this repository. `CLAUDE.md` imports this file; edit this one.

## Project

SmoothUI is a library of animated React components, blocks and templates, built with React 19, Tailwind CSS 4 and Motion 12, and installed through a shadcn-compatible registry.

```
smoothui/
├── apps/docs/              Next.js 16 docs site (Fumadocs), registry routes, examples
├── packages/smoothui/
│   ├── components/         One folder per component (kebab-case)
│   ├── blocks/             Page sections; shared helpers in blocks/shared
│   ├── templates/          Full surfaces (chat-template)
│   └── lib/animation.ts    Shared springs, easings and durations
├── packages/smoothui-utils/  `cn()` and other utilities
├── packages/shadcn-ui/     shadcn/ui components
├── packages/data/          Shared data (`@smoothui/data`)
└── packages/cli/           smoothui CLI
```

Stack: Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS 4, Motion 12 (`motion/react`), Fumadocs, Turborepo 2, pnpm 11, TypeScript 5, Ultracite (Biome).

## Commands

```bash
pnpm install
pnpm dev                    # all dev servers (docs on :3000)
pnpm build                  # runs tests first (see turbo.json)
pnpm check / pnpm fix       # Ultracite lint / autofix
pnpm test                   # risk suite + turbo test
pnpm test:risk              # registry, tokens and docs tests (fast)
pnpm capture:posters --force --only <slug>
```

`pnpm` comes from corepack (`packageManager` in package.json). If it is not on PATH, the husky pre-commit hook fails: run `npm install -g corepack@latest && corepack enable`. Install corepack from npm even when Node bundles it: Node 25 and later ship without it (`corepack: command not found`). If npm fails with `EEXIST`, a global pnpm or Yarn owns that binary: check `npm ls -g --depth=0` and `npm uninstall -g pnpm` (or `yarn`) before retrying. Node is 24.15 or later (`.nvmrc`); Node 25 is not supported.

Next 16 has breaking changes from older versions. Read `apps/docs/node_modules/next/dist/docs/` before writing Next-specific code.

## Design system

Tokens live in `apps/docs/app/smoothui.css` and ship to installers through the registry (`apps/docs/lib/registry-tokens.ts` and `registry-themes.ts`). A test (`apps/docs/lib/__tests__/registry-themes.test.ts`) keeps the two in sync; change both or it fails.

### Colour

Never hardcode a colour (hex, `rgb()`, `zinc-*`, `emerald-*`…) in a component or block. Use a token. If no token fits, add one to both files above instead of inlining a value.

| Need | Use | Notes |
|---|---|---|
| Page canvas | `bg-background` | smooth-50 |
| Raised surface (card, panel) | `bg-card` | white in light, 0.21 in dark |
| Floating surface (popover, menu, select, combobox, command, preview card, toast, tooltip) | `overlay-surface bg-popover text-popover-foreground` | Inverted grey panel in both modes. The utility re-scopes the roles inside it (muted, accent, border, input, inks) and owns the shadow, so do not add `shadow-*` |
| Soft neutral wash, selected row, chip | `bg-primary` + `text-primary-foreground` | **Not shadcn's ink.** `primary` is SmoothUI's light grey surface |
| Quieter surface / hover wash | `bg-muted`, `bg-secondary` | |
| Body text / secondary text | `text-foreground` / `text-muted-foreground` | |
| Brand accent | `bg-brand` + `text-on-brand` | White on pink is about 3:1 by brand decision; use it for large or bold text only |
| Destructive | `bg-destructive` + `text-destructive-fg` | foreground flips to dark ink in dark mode |
| Status | `bg-success`, `bg-warning`, `bg-info` + matching `-foreground` | for badges, alerts, toasts, status dots |
| Neutral ramp | `smooth-50` … `smooth-1000` | 50 is lightest in light mode and darkest in dark mode |
| Divider | `border-border` | decorative, subtle |
| Form control edge | `border-input` or `border-foreground/25` | the two are equal |

Text on any fill needs 4.5:1. The rule of thumb in oklch: white text needs the fill at L ≤ 0.56; above that, use dark ink.

### Shape and state

- Radius follows `--radius`: `rounded-sm` … `rounded-3xl` all track the Theme Studio slider. Avoid arbitrary `rounded-[…]`.
- Focus: add the `focus-ring` utility (3px ring at 80%) to every interactive element, with `outline-none`. Never set `outline-0` / `outline-none` without a replacement. Inside an `overflow-hidden` parent, use an inset ring (`focus-visible:ring-inset`).
- Transitions on controls: the `state-transition` utility, not `transition-all`.
- Hidden-but-mounted interactive UI (opacity 0, off-screen) gets `inert`.

### Forms

- Text inputs are `text-base md:text-sm`. Below 16px, iOS zooms the page on focus.
- Form controls forward `ref` and native attributes (`aria-describedby`, `aria-invalid`, `onBlur`, `data-*`) to the interactive element, so react-hook-form and field errors work. Type them as own props plus `Omit<ComponentPropsWithRef<"button" | "input">, …>`.
- Controlled and uncontrolled: always update internal state, then call the listener. Never `if (onChange) onChange() else setInternal()`: a consumer who only listens gets a frozen component.
- Email fields: `type="email"`, `autoComplete="email"`, `name`, `required`. Async submits show a pending state and announce the result with `role="status"`.

### Icons and copy

- No emoji or pictographic characters anywhere (UI strings, code, comments, commits). Use `lucide-react` icons. Icons that carry meaning get an accessible name; decorative ones get `aria-hidden="true"`.
- Icon-only buttons need `aria-label`. Hit areas are at least 40px on touch (use a pseudo-element if the visual is smaller).
- Spell the brand **SmoothUI**.

## Animation

Rules for every animated component. `packages/smoothui/lib/animation.ts` holds the shared values; use them instead of local numbers.

1. Import `useReducedMotion` from `motion/react` and, when it is true, drop movement and make transitions instant (`DURATION_INSTANT`).
2. Animate `transform` and `opacity` only. Not `width`, `height`, `top`, `left` or `margin`; use `scale` with a `transform-origin` instead.
3. Durations: 0.2–0.3s for UI, 0.4s max for complex motion, 1s max for decorative loops.
4. Easing: `EASE_OUT` for entering, `EASE_IN_OUT` for moving, `EASE_LINEAR` for continuous loops. Never string easings (`"easeInOut"`, `"linear"`).
5. Springs: `SPRING_DEFAULT` / `SPRING_SNAPPY`, or `{ type: "spring", duration, bounce }` with an explicit `duration`. Bounce ≤ 0.1 for UI and form controls; 0.2–0.3 only for playful drag.
6. Do not enter from `scale: 0`; start at 0.95 or above.
7. Gate hover-only motion on `(hover: hover) and (pointer: fine)`. Tailwind `hover:` already does this.
8. Do not fade in section headings or primary content on scroll; it delays the content people came for.

See `ANIMATION_IMPROVEMENTS.md` for worked examples.

## Components

Each component in `packages/smoothui/components/<name>/`:

- `index.tsx` with `"use client"` when it uses hooks; default export in PascalCase.
- Exported `<Name>Props` type (documented by `AutoTypeTable`).
- `package.json` (internal deps as `workspace:*`) and `tsconfig.json` extending `@repo/typescript-config/nextjs.json`.
- Class names merged with `cn()` from `@repo/smoothui-utils`, never template literals, so consumer overrides win.
- `className` passthrough on the root; spread remaining props on the root for primitives and form controls.
- React 19: `ref` is a prop. No `forwardRef`.
- Interactive elements are `<button>`/`<a>`, never a clickable `<div>`.

### Adding a component (all steps required)

1. Create `packages/smoothui/components/<name>/` (`index.tsx`, `package.json`, `tsconfig.json`).
2. Export it from `packages/smoothui/components/index.ts`.
3. Add the example `apps/docs/examples/<name>.tsx` (default export `<Name>Demo`).
4. Add the doc `apps/docs/content/docs/components/<name>.mdx` (frontmatter: `title`, `description`, `icon`, `dependencies`, `installer`; `AutoTypeTable` for props; Usage and Accessibility sections).
5. Register it in `apps/docs/content/docs/components/meta.json`, alphabetically.
6. Capture the poster (see below) and check it in the dev server.

## Registry

- Routes: `apps/docs/app/r/`. Packaging: `apps/docs/lib/package.ts`.
- Installs run `npx shadcn@latest add @smoothui/<name>`; items auto-bundle their deps and the `tokens` item when they use SmoothUI tokens.
- `pnpm --filter docs exec tsx scripts/verify-registry.mts` checks leaks, schema, sibling imports and token coverage.
- Assets referenced by blocks must ship with the item. A `/brand/...` path only exists on smoothui.dev.

## Code style (Ultracite / Biome)

Run `pnpm fix` before committing. Beyond what Biome catches:

- TypeScript without `any`; prefer `unknown` and narrowing over assertions. `export type` for types.
- Arrow functions, `const`, `for…of`, optional chaining, template literals, destructuring.
- Top-level regex literals; no `console.log`, `debugger` or `alert`.
- Hooks at the top level with complete dependency arrays; stable keys, not array indices.
- Semantic HTML first; ARIA only where HTML has no equivalent. No positive `tabIndex`.
- `rel="noopener"` with `target="_blank"`. No `dangerouslySetInnerHTML` unless unavoidable.

## Testing

- Library tests: `packages/smoothui/**/__tests__/` (Vitest + Testing Library + vitest-axe).
- Docs and registry tests: `apps/docs/lib/__tests__/`, `scripts/*.test.ts` (risk suite).
- Browser smoke: `tests/browser/`. `docs-mobile.spec.ts` is flaky in CI; rerun the failed job before investigating.
- No `.only` / `.skip` in committed code; assertions inside `it()`.

## Git

- Integration branch is `develop`; `main` receives `develop` at release time.
- Conventional Commits in English (`feat:`, `fix:`, `docs:`…).

<!-- friction-log:agents -->

## Friction log

Contributor and agent papercuts in this repository live as GitHub issues
labeled `friction`, not as files in the tree. A daily Cursor Cloud Agent
investigates them.

When you hit a papercut you cannot — or should not — fix inside the current
change, file it before you forget:

```bash
gh issue create --repo educlopez/smoothui --title "Friction: …" --label friction --body-file -
```

Full policy and the investigator contract:
[`docs/contributing/friction-log.md`](docs/contributing/friction-log.md).
Harnesses that load skills on demand read the same policy from
`.claude/skills/friction-log/SKILL.md` or
`.cursor/skills/friction-log/SKILL.md`.

## Component index posters

The `/docs/components` index uses static WebP posters, not the live example. Updating a component is not done until its poster matches the example.

When you add a component or change `apps/docs/examples/<slug>.tsx`, recapture that slug before you finish. Follow `.agents/skills/capture-component-posters/SKILL.md` (Claude and Cursor load the same skill through `.claude/skills/capture-component-posters` and `.cursor/skills/capture-component-posters`).

```bash
export PLAYWRIGHT_BROWSERS_PATH="$HOME/Library/Caches/ms-playwright"
pnpm capture:posters --force --only <slug>
```

Run that outside the sandbox. Do not hand-edit `apps/docs/components/gallery/component-shots.ts`.
