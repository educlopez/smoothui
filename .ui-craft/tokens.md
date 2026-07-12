# SmoothUI — Token Spine

Audit + decisions for the design-token spine. Anchored to `brief.md`.
Created 2026-06-12. The project already has a Tailwind v4 `@theme inline` system
in `apps/docs/app/smoothui.css` + `global.css` — this **extends**, never replaces.

## Layer status (audit)

| Category | State | Source |
|---|---|---|
| Neutral ramp | ✅ rebuilt, perceptually uniform, WCAG AA (f1ce982) | `smoothui.css` `--color-smooth-*` |
| Accent (brand) | ✅ pink `oklch(0.72 0.2 352.53)` + secondary/light/lighter | `smoothui.css` `--color-brand*` |
| Semantic color | ✅ shadcn-style (background/foreground/muted/border/input/sidebar/chart) | `smoothui.css` `@theme inline` |
| Spacing | ✅ Tailwind v4 defaults — **no gap**, issue is uniform *usage* (py-24 everywhere) | Tailwind |
| Radius | ⚠️ `--radius` + sm/md/lg/xl exist, but applied uniformly (`rounded-xl` everywhere) | `smoothui.css` lines 48-51 |
| Type scale | ❌ no shared semantic roles; landing (Poppins) / docs prose / studio (13px) diverge; `prose h2` cliffs to 18px | ad-hoc |
| Shadows | ✅ `--shadow-custom`, `--shadow-custom-brand` (layered) | `global.css` |
| Motion | ❌ no duration/easing tokens; components hardcode (0.2-0.3s, cubic-beziers) | ad-hoc |
| Z-index | ⚠️ ad-hoc; not tokenized | — |

## Decisions

### Type scale (the unification core)

One scale, consumed by landing AND docs prose AND studio. Poppins = display,
Inter = body/UI, mono for code/values. Roles (apply consistently, stop ad-hoc sizes):

| Role | Size | Weight | Tracking | Use |
|---|---|---|---|---|
| display-xl | 60px (text-6xl) | 600 | -0.02em | hero headline |
| display-lg | 48px (text-5xl) | 600 | -0.02em | section headlines |
| heading | 30px (text-3xl) | 600 | -0.01em | page / prose h1 |
| subheading | 24px (text-2xl) | 600 | -0.01em | **prose h2 (fixes 18px cliff)** |
| title | 19px (text-lg/xl) | 600 | normal | prose h3, card titles |
| body | 16px (text-base) | 400 | normal | prose p, descriptions |
| label | 13px | 500 | normal | UI labels, studio inspector |
| eyebrow | 12-13px | 600 | 0.05em, uppercase | category labels (the ONE allowed uppercase) |

Prose heading scale in `global.css` is corrected to follow this (h2 → subheading,
not text-lg).

### Radius — vary by element (kill uniform `rounded-xl`)

| Token | px | Element |
|---|---|---|
| `--radius-sm` (calc -4) | ~6px | inputs, badges, segmented controls |
| `--radius-md` (calc -2) | ~8px | buttons, small panels, studio rows |
| `--radius-lg` (`--radius` 10px) | 10px | cards |
| `--radius-xl` (calc +4) | ~14px | modals, large panels, hero frame |
| `--radius-full` | pill | tags, avatars, the float nav |

Base `--radius` stays `0.625rem` (10px). Soft Modern = lean toward the larger end
for cards (`rounded-2xl`/14px) where it reads friendly, per brief visual direction.

### Motion tokens (new category)

Match the existing `.cursor/rules/animations.mdc` convention — don't invent new curves.

```css
--duration-fast: 0.15s;     /* color/opacity, hover */
--duration-normal: 0.25s;   /* standard UI: dropdowns, toggles */
--duration-slow: 0.4s;      /* modals, drawers, page-level */
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);       /* entering */
--ease-in-out: cubic-bezier(0.645, 0.045, 0.355, 1); /* moving */
```

Exit ≈ 75% of enter. Always honor `prefers-reduced-motion`. Spring bounce ≤ 0.1 for UI.

### Accent budget (brief P-color)

Brand pink: max 3-5 placements per above-the-fold viewport. Secondary uses drop
chroma (`--color-brand-light/lighter`). Today the pink appears in logo + sidebar
active + TOC active + eyebrows + CTA simultaneously — trim per viewport.

## Scope boundary

This spine doc + the additive **motion tokens** + the **prose type-scale fix** are
the token-phase deliverables. Applying the full type/radius scale across every
landing section and component is the **visual redesign phase** (next), done with
the browser in the loop.
