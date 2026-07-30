# SmoothUI — Design System Audit (structural)

Date: 2026-06-12 · Scope: token layer, contrast, typography, landing/docs/studio divergence.
Read-only inventory. No visual changes. Feeds the macro redesign on `develop`.

## TL;DR

The DS is **mostly tokenized** (very little hardcode) — good foundation. The pain is
**not** scattered hex values; it's **two structural defects in the token layer itself**:

1. The neutral ramp is non-uniform → borders and muted text are near-invisible (WCAG fails).
2. There are **multiple competing token namespaces** for the same concept (3 border tokens).

Fix the token layer and the "weak contrast / inconsistent UI" complaint largely resolves
across landing, docs and studio at once, because they all consume these tokens.

---

## 1. Token sources

| File | Role |
|---|---|
| `apps/docs/app/smoothui.css` | `--color-smooth-*` neutral ramp, brand, shadcn-style semantic tokens, radius |
| `apps/docs/app/global.css` | fumadocs preset, legacy tokens (`--bt-gray`, `--text-primary`…), shadows, prose type scale, `.frame-box` |
| `apps/docs/app/fonts.ts` | Inter (`--font-inter`, body) + Poppins (`--font-poppins`, title) via next/font/google |

Hardcode scan: arbitrary `*-[#hex]` utilities = **3** total; inline `rgb/hsl` in TSX = 17
(mostly OG-image routes + installer chrome, not UI surfaces). Tokenization is healthy.

---

## 2. CRITICAL — neutral ramp is non-uniform

Light-mode oklch L per stop:

```
50   100  200  300  400  500  600  | 700 |  800   900   950   1000
.99  .98  .96  .95  .93  .91  .89  | .83 |  .65   .62   .54   .20
└──────── 8 stops in ΔL 0.16 ───────┘ cliff  └─ mid-tones underpopulated ─┘ huge drop
```

- Stops 50→600 are crammed into the bright zone (ΔL 0.10 across 7 steps).
- A **cliff** at 700→800 (ΔL 0.18 in one step).
- The useful mid-tone range (L 0.40–0.60) — exactly where readable borders and
  secondary text live — is **underrepresented**.

Consequence: any token that maps to a "light gray" stop (border, input) is almost the
same luminance as the background, and "muted" text picks a stop that's still too light.

## 3. CRITICAL — WCAG contrast failures (computed on real values)

Light mode, bg = `smooth-50`:

| Token | Maps to | Contrast | Requirement | Verdict |
|---|---|---|---|---|
| `--color-border` | smooth-500 | **1.27:1** | 3.0 (non-text) | ❌ invisible |
| `--color-input` | smooth-600 | **1.35:1** | 3.0 (non-text) | ❌ invisible |
| `--color-muted-foreground` | smooth-800 | **3.14:1** | 4.5 (body) | ❌ fails body |
| `--color-foreground` | smooth-1000 | 17.59:1 | 4.5 | ✅ |

Borders at 1.27:1 are the root of "the UI looks flat / low contrast". Muted text at
3.14:1 fails AA for normal-size copy.

## 4. HIGH — competing token namespaces (inconsistency)

Same concept, multiple sources with **different values**:

- **Borders — three of them:**
  - `--color-border` = `smooth-500` (the `border-border` utility)
  - `--border` = `smooth-300` (legacy, different value)
  - global base layer also sets `border-color: var(--color-gray-200, currentColor)` on `*,::before,…`
  → three answers to "what is a border". Pick one.
- **Legacy ad-hoc tokens**: `--text-primary`, `--text-quaternary`, `--bt-gray`,
  `--color-contrast-higher/highest` — used only by shimmer/shadow utilities, parallel to
  the shadcn-style set. Candidates for consolidation or namespacing.
- `@theme inline` self-referential aliases (`--color-brand: var(--color-brand)`): works
  (real value lives in `:root`) but is fragile and confusing to read.

## 5. MEDIUM — typography scale

- Two families only (Inter body / Poppins title) — fine, keep.
- Docs `prose` heading scale (global.css) compresses fast: h1 `text-3xl`, **h2 `text-lg` (18px)**,
  h3 `text-base`, h4 `text-sm`. An h2 at 18px is small for a section heading and collapses
  the visual hierarchy. No fluid/`clamp()` scale.
- Landing sections use `--font-title` independently; no shared type-scale token set → risk of
  landing vs docs drift. No spacing scale tokens (rhythm is per-component).

## 6. Landing composition (for the redesign)

`apps/docs/app/(home)/page.tsx` → Hero · ComponentsSlideshow · Features · AISection ·
SkillsSection · BlockCategories · WhatTheySay · FAQ · Footer.
Landing components live under `apps/docs/components/landing/` (only `navbar/` and `logos/`
are subfoldered; the rest are flat files).

Note: branch `refactor/landing-visual-polish` is a **stale divergent branch** (142 files,
deletes `pnpm-workspace.yaml` + `release-please-config.json`, rewrites the lockfile) — NOT a
usable base. Ignore it.

---

## Recommended fix order (foundation → surface)

1. **Rebuild the neutral ramp** with uniform perceptual spacing (even ΔL across stops),
   keeping 50/1000 endpoints. Re-derive border/input/muted to hit WCAG (border/input ≥3:1,
   muted-fg ≥4.5:1). This is the single highest-leverage change.
2. **Unify border tokens** to one source; remove/namespace legacy `--text-*`, `--bt-gray`.
3. **Define a shared type + spacing scale** (tokens) consumed by both landing and docs prose;
   fix the h2 cliff.
4. Only then iterate **visual** surface (landing hero → sections), with the browser open
   between steps.

Steps 1–3 are mechanical, measurable, low-risk, and benefit registry consumers too
(themes inherit the ramp). Step 4 is the design-heavy phase.
