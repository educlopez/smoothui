# SmoothUI — Inspiration Backlog (2026-08-10)

Sources analysed: `beam/metal/image.jakubantalik.com`, `amicro.vercel.app`, `skiper-ui.com` (70 comps), `arlan.me/vault` (24), `rareui.com` (11), `ui.unlumen.com` (55).

Rule: **no 1:1 clones.** Each entry lists the concept seen + the SmoothUI twist that makes it ours. Everything already in `packages/smoothui/components` (130 dirs) was filtered out.

---

## Where the gaps actually are

SmoothUI is already deep in: text animation (28), page/shader transitions (15), AI surfaces (20), primitives. It is **empty** in:

1. **Material/surface shaders** (metal, holo, emboss, progressive blur) — Jakub + Arlan own this space, we have zero.
2. **Micro-loaders** — amicro ships ~100, we ship 3.
3. **Dither data-viz** — amicro invented a niche nobody in the shadcn ecosystem covers.
4. **Navigation** — no dock, no floating navbar, no sidebar family.
5. **Media/gallery** — no tilt, no coverflow, no hover-reveal image list.

---

## Tier 1 — build first (differentiating + own search intent)

| Name | Concept from | SmoothUI twist |
|---|---|---|
| `liquid-metal` | metal.jakubantalik | Metal shader as a **wrapper** (text, icons, borders), not a hero blob. Reuse our shader-transition WebGL runtime. |
| `border-beam` | beam.jakubantalik | Beam that traces **any** radius incl. squircle; multi-beam, conic + reactive-to-focus states. |
| `progressive-blur` | skiper41 | Directional progressive blur primitive (top/bottom/radial) + `mask-image` fallback, reduced-motion safe. |
| `dither-charts` (family) | amicro | 8 variants (donut, line, gauge, funnel, heatmap, stacked, bubbles, storage) under **one** component with `variant` prop. Ordered-dither via canvas, no chart lib. |
| `motion-loader` (family) | amicro | ~12 loaders (orbit, newton-cradle, pendulum, hourglass, morph-ring, square-snake, comet, radar, cube-flip) as `variant` on one component. Avoids 12 dirs. |
| `dock` | unlumen | macOS magnify dock with pointer-proximity spring; ours also supports vertical + touch fallback. |
| `tilt-card` | unlumen | 3D pointer tilt + glare, driven by our spring config, `useReducedMotion` locks to flat. |
| `gooey-filter` | skiper64 / unlumen | SVG goo as a *primitive* (`<GooeyFilter>`) any children can opt into — we only have `gooey-popover`. |
| `squircle` | arlan / skiper63 | Apple corner smoothing as util + component, CSS `corner-shape` with SVG fallback. |
| `folder` | rareui | Folder that opens and fans its files; ours doubles as a real file-drop target. |
| `coverflow-carousel` | skiper47/49, amicro | Perspective carousel + inverted mode, keyboard + drag, no swiper dep. |
| `hover-expand` | skiper52/53, unlumen | Horizontal **and** vertical accordion gallery in one component. |
| `cursor-image-trail` | skiper18, unlumen | Trail with velocity-based decay; images recycled from a pool (no DOM thrash). |
| `hover-image-list` | unlumen | Portfolio list rows revealing images at the cursor — pairs with our `reveal-text`. |
| `gravity-letters` | rareui | Physics letters that fall and pile; ours re-forms the word on hover-out. |
| `duration-picker` | rareui | Real utility: scrubbing + keyboard + `Intl` formatting. |
| `file-tree` | unlumen | Animated expand/collapse tree with height-auto morph. |
| `code-block` | rareui | Animated code block with copy, line highlight, and typing-in mode. |
| `page-preloader` (family) | skiper7–11 | Words / stairs / pixel / curtain variants — natural companion to our 15 page transitions. |
| `emoji-reaction` | rareui | Burst reactions with spring pop and count roll-up. |

## Tier 2 — strong, second wave

- `holographic-foil` (arlan holo/chroma-glow) — iridescent card, pointer-driven hue shift.
- `emboss-surface` (arlan emboss) — realistic bevel/plaster material primitive.
- `dither-image` (arlan color-depth) — ordered-dither any image, adjustable depth.
- `ascii-render` (skiper14) — wrap any node/video into ASCII canvas.
- `aurora-curtain` / `pixel-flow-field` / `gravity-stars` (unlumen backgrounds) — 3 shader backgrounds.
- `floating-navbar`, `expandable-navbar`, `gooey-navbar` (unlumen, skiper46/57).
- `proximity-sidebar` + `bounce-sidebar` (rareui) — cursor-proximity magnification.
- `morph-icon` set (unlumen icons) — sidebar/list/compact/cards path morphs.
- `time-machine-stack` (amicro) — depth stack of panels.
- `orbital-image-wheel` (unlumen).
- `glass-card` (amicro) — liquid-glass surface.
- `card-swipe-deck` (skiper48) — gesture stack with throw physics.
- `scroll-image-reveal` (skiper32–34) — mask + rotation on scroll.
- `parallax-layers` (skiper29/30/55).
- `svg-clip-mask` (skiper66).
- `video-modal` (skiper67) + `video-ambient` (unlumen) — ambient glow sampled from frames.
- `image-generation-panel` (image.jakubantalik) — prompt → shimmer → progressive reveal. Slots into our AI family.
- `text-morph` (amicro), `rolling-text` (skiper27), `perspective-text-3d` (skiper28), `kinetic-type` (arlan).
- `scroll-progress` (rareui) + `svg-draw-on-scroll` (skiper19).
- `mac-terminal` (amicro), `breakpoint-indicator` (skiper65) — cheap dev-tool wins.

## Tier 3 — product-surface set (higher effort, high share value)

- `swap-panel` (skiper22 Aave) and `wallet-card` (skiper21 Family).
- `country-dialog` (skiper20) — search + flags + virtualised list.
- `auth-form` (skiper56 Devouring Details) — progressive-detail sign-in.
- `questionnaire` (unlumen) — multi-step survey with shared-axis transitions (reuses ours).
- `animated-number-input` (skiper68), `music-toggle` (skiper25), `theme-toggle` variants (skiper4/26).
- `favicon-search` (unlumen), `pinned-list` / `animated-list` (unlumen), `inline-testimonials` (unlumen).
- `unlock-face-id` (amicro Apple micro-interactions).
- `drawing-cursor` (skiper59), `magnetic-field` (amicro physics).
- `vector-editor-toolbar` (arlan) — sibling of our `figma-comment`.
- `ransom-note` (arlan), `arcade-pixel` / `pixel-brushes` (arlan).

---

## Explicitly skipped (we already have it)

dynamic-island, number-flow, github contribution graph, OTP input, siri-orb/fluid-orb, gooey popover, magnetic button, scramble/typewriter/text-shimmer, card stack scroll, infinite slider, expandable cards, AI chat surfaces, most page transitions.

---

## Phase 2 — per-component microsites (Jakub's play)

`beam.` / `metal.` / `image.jakubantalik.com` are **one component = one domain = one landing**. That is what shares on X, not a docs page.

Recommendation: don't do it for 130 components. Do it for Tier 1 only, as routes not subdomains — `smoothui.dev/x/liquid-metal` — with: full-bleed live demo above the fold, one-line install, source, and OG video. Docs page stays canonical; the showcase route carries its own title/description/OG and links back. Revisit after the first 5 Tier-1 components ship.
