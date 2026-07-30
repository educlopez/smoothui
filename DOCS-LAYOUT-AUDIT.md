# Docs component-detail page layout audit — skiper-ui.com vs SmoothUI

Read-only research, no code changed. Reference site audited live via browser (Chrome MCP) on
`skiper-ui.com/v1/skiper106` (Smooth Caret Input), cross-checked against `skiper105` (Auto Scale
input) and the `/components` gallery index. Not a copy target — a factual inventory to inform
later decisions.

---

## Reference: skiper-ui.com

### 1. Page skeleton — two-column split

Real viewport observed: 1870×1143 (devicePixelRatio 2). All numbers below are real CSS px, taken
from computed styles / bounding rects via `getComputedStyle` + `getBoundingClientRect`, not
estimated from screenshots.

DOM/flex structure (not CSS Grid — a two-child flex row):

```html
<div class="flex h-full w-full flex-1 flex-col lg:flex-row lg:justify-end">
  <!-- child 1 in DOM order: PREVIEW (visually right) -->
  <div class="z-12 relative grid min-h-[100dvh] grid-cols-1 flex-col items-center
              justify-center p-2 transition-all duration-300 ease-in-out
              lg:flex w-full lg:w-1/2 lg:pl-0">
    ...live demo...
  </div>
  <!-- child 2 in DOM order: INFO PANEL (visually left) -->
  <div class="z-1 bg-background left-0 top-0 flex h-full flex-col justify-end
              rounded-2xl px-4 transition-all duration-300 ease-in-out
              lg:fixed lg:h-screen lg:w-1/2">
    <div class="relative h-full w-full lg:overflow-x-hidden lg:overflow-y-scroll">
      ...title, description, docs, code, props, credits...
    </div>
  </div>
</div>
```

Key numbers (at 1870px viewport):
- Split is exactly **50/50** (`lg:w-1/2` on both), breakpoint is Tailwind's default `lg` = **1024px**.
- **Info column**: `position: fixed; left:0; top:0; height:100vh; width:50%`. Its own inner div
  scrolls independently (`overflow-y-scroll`), `scrollHeight` was 8840px vs `clientHeight` 1143px
  on the sample page (~7.7 screens of content). Padding `px-4` (16px each side).
- **Preview column**: normal document flow, `min-h-[100dvh]`, `grid place-items-center` — always
  exactly one viewport tall, content vertically centered, `p-2` (8px) padding. Because it's the
  only element contributing to document height (the info panel is `fixed`, taken out of flow),
  the **page itself doesn't scroll** — `body`/`html` overflow stays `visible` but total document
  height ≈ one viewport. All scrolling lives inside the info column.
- No gap utility between columns and no visible divider/border; the two feel like independent
  panes because one is a flat-color card-ish surface and the other is fixed.
- z-index: preview column `z-12`, info panel `z-1` (info panel visually sits under/behind, its
  panel corners are rounded `rounded-2xl` even though it's edge-to-edge — decorative only).
- The breadcrumb row at the top of the info column (`Components · Free · Smooth Caret Input`) is
  **not sticky** — it scrolled away with the rest of the content when we forced `scrollTop`.
- **Default state on page load is collapsed**: the info column starts **hidden** and the preview
  column expands to fill the entire viewport ("full page preview" default). A single toggle button
  (top-right, see below) reveals the 50/50 split. This was true on both `skiper105` and `skiper106`
  — it's the template default, not a one-off.

### 2. Left column content model (in order, once expanded)

1. Sticky-feeling but actually just top-of-scroll breadcrumb: `Components · Free · {Title}` (small,
   muted, tight tracking).
2. Title, small-caps, wide letter-spacing, muted-ish weight label (`SMOOTH CARET INPUT`).
3. One-paragraph description, black/high-contrast text, ~18–20px, generous line-height.
4. `DEPENDENCIES` (small-caps section label) → row of pill badges (`dialkit`, `framer-motion`),
   each with a tiny icon; a copy icon sits next to the section label to copy all deps as an install
   line.
5. `INTERACTION TYPE` (small-caps label) → a plain list of literal UX affordances ("Type in the
   smooth input", "Watch the caret spring to each position", "Click to move the cursor", "Compare
   with the normal input below"), each row with a small icon (cursor/lasso-ish glyphs) and a
   hairline divider between rows. This is effectively a manual "how to try this demo" checklist.
6. `COPY BELOW CLI [ Shadcn CLI3.0 trusted registry ]` — section label with an inline trust badge,
   then a bordered pill bar: package-manager dropdown (pnpm/npm/yarn/bun) + the install command
   text + a copy icon, all in one row.
7. `HOW TO USE` — free prose, 1–2 paragraphs, with component names (`SmoothInput`, `Input`)
   rendered as subtly-styled inline references (not full links, closer to inline-code/emphasis).
8. Code example sections, each with its own small-caps label directly above a card: `BASIC USAGE`,
   `CONTROLLED`, `UNCONTROLLED`, `PASSWORD FIELD` (with 1-line explanatory prose above some),
   `STANDARD INPUT PROPS`. Each code block: flat gray rounded card, no line numbers, syntax
   highlighting, small copy icon top-right of the card.
9. `PROPS` table — **two-column only** (`PROPS` / `DESCRIPTION`), no visible Type or Default
   column. Prop names render as small gray pill/code chips; hairline row dividers; no outer table
   border. Repeated a second time under a second heading (`INPUT PROPS`) for the plain wrapper
   export — i.e. **one props table per exported symbol**, not one merged table.
10. `DEMO` — the raw usage snippet that matches the live preview.
11. `NOTES` — plain bullet list of implementation caveats (a11y disclaimers, "this is a playful
    experiment, not production-safe", reduced-motion behavior, etc.).
12. `DIALKIT SETUP` — product-specific integration note (their debug/tuning panel).
13. `SOURCE CODE` — a literal instructional line: "Click on the top right [inlined `</>` icon glyph]
    to view the source code." Reuses the actual toolbar icon inline in prose to teach the control.
14. `KEEP IN MIND` — a standing disclaimer paragraph (component is often a recreation of another
    site's effect, credit given where known).
15. `CONTACT` — inline mail icon + "Drop a dm" mailto link.
16. `LICENSE & USAGE` — 3-bullet plain-English license summary (free vs Pro attribution rules).
17. Hairline divider, then `PREVIOUS` / `NEXT` prev-next page nav (two columns, chevrons, muted
    label above the linked title) — this nav lives **inside the info column's max-width**, it does
    not span the full page width the way a fumadocs footer usually would.

No accordions, no tabs, no card borders anywhere in the info column — the whole thing is one long
scrollable single-column document, organized purely by small-caps section labels and generous
vertical whitespace. Density-wise: section label → ~24–32px gap → content → ~48–64px gap before
next label. That gap rhythm (not boxes) is what produces the "muy bien organizadita" feel.

### 3. Right column (preview) framing

- Solid flat background (light warm-gray in light mode), no dot/grid pattern observed on this
  component page.
- No visible border/shadow around the whole column; the demo elements themselves (the two input
  boxes) have their own subtle card look (soft off-white bg, rounded corners).
- A recurring micro-pattern: small-caps helper label ("TRY TYPING BELOW" / "TRY ENTERING A NUMBER"
  on skiper105) centered above the demo, connected to it by a thin 1px vertical line — a per-
  component call-to-action that's part of the template, not the component itself.
- No resizable divider, no device/viewport switcher (desktop/tablet/mobile) anywhere on the
  component page — unlike SmoothUI's own block preview, skiper-ui has no viewport toggle at all.
- Confirmed via a dedicated **isolated full-page preview route**: clicking "full page Preview"
  opens `/v1/preview/{slug}` in a new tab — literally just the demo, centered, with only a small
  floating bottom-right settings icon (their DialKit tuning panel) and nothing else. This looks
  like it exists for embedding/screenshotting/OG-image generation.
- Preview column does not scroll independently on this page (content fits in `min-h-100dvh`); for
  taller demos the column would presumably still center within one screen rather than scroll,
  since there's no `overflow` override on it — tall demos likely just get clipped or the component
  itself handles internal scrolling (not verified on a tall example).

### 4. Top-right controls (exact, all four)

Fixed pill cluster, top-right of the preview column, real coordinates `x≈1699–1839, y≈31`, each a
32×32 button in a shared rounded pill:

1. **"Show Info" / "Maximize View"** (contract-corners icon) — single stateful toggle. Label text
   flips depending on state: shows "Show Info" when the info panel is collapsed (clicking reveals
   the 50/50 split), shows "Maximize View" when split (clicking would presumably collapse back to
   full-page preview). This is the master control for section 1's default-collapsed behavior.
2. **"full page Preview"** (external-expand icon) — opens `/v1/preview/{slug}` in a **new tab**,
   the bare isolated demo described above. Distinct from #1: this leaves the docs page entirely.
3. **"Source Code"** (`</>` icon) — **replaces the entire info column's content in place** with a
   full-height syntax-highlighted source view (header: back-arrow + "Source Code" title + download
   icon + filename `skiper106.tsx` + copy icon). The preview column is untouched. Clicking the
   back-arrow restores the normal info content. This is the same real-estate as the description
   panel, not a separate tab/modal.
4. **"Command + K"** (⌘ icon) — opens a site-wide command palette (search modal, backdrop-dimmed,
   "Pages" list: Home/Account/Pricing/All Components/Login/Get started, footer hint
   "Go To Page ↵ / ⌘"). This is global site navigation/search, not component-specific.

Separately, top-**left** of the whole page: a **"Toggle Sidebar"** button that slides in a `fixed`,
`w-320px`, full-height `aside` listing every component in the catalog (numbered, with a highlighted
current item and `New` badges) — a persistent quick-jump nav, independent of the info/preview
toggle. It sits at `z-20`, above the preview (`z-12`) and info (`z-1`) columns.

No RTL toggle, no theme toggle, and no viewport-size switcher were found anywhere on the component
detail page itself (theme toggle exists at the site level, not per-component).

### 5. Responsive behaviour

Derived from Tailwind class inspection (no live narrow-viewport screenshot was obtainable — window
resize didn't affect the CDP-rendered viewport in this sandbox; class-based analysis is equivalent
information per the task's fallback instruction):
- Breakpoint: Tailwind default `lg` = **1024px**. Below it, every `lg:` qualifier drops: the outer
  flex container becomes `flex-col` (stacked), the info panel loses `fixed`/`h-screen`/`w-1/2` and
  becomes a normal full-width block, and the preview column drops `lg:flex`/`lg:w-1/2` back to
  `w-full`. So **stacked mobile**: preview first (full width, `min-h-100dvh`), info panel below it,
  full width, back in normal page scroll (no independent scroll container needed since it's no
  longer fixed-height).
- No separate tablet breakpoint was found for this layout (`sm`/`md` are not referenced in the
  classes captured) — it's a binary stacked/split behavior keyed on `lg` alone.

### 6. Motion

- Both the info panel and preview column carry `transition-all duration-300 ease-in-out` — the
  50/50 reveal, the full-page collapse, and (on skiper105/107) the sidebar drawer all animate over
  **300ms** with a plain ease-in-out (not a spring).
- The "Toggle Sidebar" drawer is a `fixed` aside translated off-canvas; toggling slides it via a
  transform, same 300ms family.
- Command palette open/close: backdrop dim, no further motion details captured (out of scope for a
  component-detail-page audit; it's a global site feature).
- Nothing sprung, no stagger, no page-transition observed between sibling component pages — clicking
  `PREVIOUS`/`NEXT` is a hard navigation (full page reload of the app shell), not an animated swap.

### 7. Typography and density

- Section labels: small-caps or tracked-out uppercase, muted color, small size (~11–12px), heavy
  letter-spacing — used as the *only* visual separator between blocks (no card borders, no
  background tints). This repetition of one label style at every section boundary, combined with
  generous (~48–64px) vertical gaps, is what reads as "organizadita" rather than any grid or box
  system.
- Body copy: comfortable size (~16–18px) with generous line-height for the lead description;
  slightly smaller for prose sections.
- Code blocks: flat gray card, no border, monospace, small copy affordance in the corner — visually
  quieter than a bordered/shadowed "terminal" card.
- Props table rows use hairline (1px, low-contrast) dividers only — no zebra striping, no outer
  border, no vertical rules between the two columns.

### 8. Clever ideas worth stealing vs. things that would not survive our constraints

**Genuinely clever, low-risk to adapt:**
- The isolated `/preview/{slug}` route (bare demo only) — cheap to add, useful for OG-image capture,
  embedding, or a "pop out" affordance, and orthogonal to Fumadocs/MDX.
- Reusing the literal toolbar icon glyph inline in prose ("Click the `</>` icon to view source") —
  a copy-writing trick, zero layout cost.
- One props table per exported symbol instead of one giant merged table when a component ships a
  companion export (their `Input` + `SmoothInput` pattern maps directly to cases where we export a
  primary component plus a small helper).
- The "Interaction type" checklist (a short, literal list of "do this to see it work") — cheap,
  MDX-writable content that would help our more experimental/stateful components (siri-orb states,
  ai-message hover reveal) without needing new components.
- Section-label-as-only-separator (no card chrome) is a legitimate density lever if we ever want a
  denser alternative view — but see risk below.

**Would not survive our constraints / not worth copying:**
- The whole page being a `fixed` 100vh, no-page-scroll app shell is a hard architectural commitment
  (it fights infinite/organic page length, footers, and Fumadocs' own scroll-based TOC highlighting
  which assumes the *page*, not a side-panel, scrolls). Adopting it wholesale would require ripping
  out Fumadocs' notebook layout, its TOC anchor-scroll, and our SEO footer's "spans the full grid"
  trick.
- Collapsing the info panel by default (full-page-preview-first) actively hides the description,
  install command, and props table on first load — bad for SEO/crawlability and for our AutoTypeTable
  content, which needs to be in the initial DOM/readable without a client-side toggle.
- Two-column props table (Prop/Description only, no Type/Default) is a regression from
  `AutoTypeTable`'s richer output (Type + Default columns) that we already generate for free from
  TypeScript — we'd be throwing away information users already get today.
- No bundle-size badge, no "New" sidebar badge equivalent surfaced on the detail page itself (only
  in the catalog/gallery), no registry/AutoTypeTable/MDX authoring constraints to reconcile — their
  content is hand-authored per page (no codegen), which is why their prop tables and code samples
  are simpler than ours; copying their simplicity would mean giving up our automation.

---

## SmoothUI today

- **Docs page route**: `apps/docs/app/docs/[...slug]/page.tsx` renders a single-column
  `DocsPage`/`DocsBody` (Fumadocs `fumadocs-ui/page`). Order of chrome: `BreadcrumbSchema` (SEO,
  invisible) → `DocsTitle` → `DocsDescription` → an action-button row (`LLMCopyButton`,
  `ViewOptions`, `OpenInV0Button`, `AddToKitButton`, `BundleSizeBadge`, `LastModified`) → then, only
  if `page.data.installer` is set, `<Preview>` followed by an `## Installation` heading and
  `<Installer>` → then the raw MDX body (whatever H2 sections the author wrote free-form).
- **Docs layout**: `apps/docs/app/docs/layout.tsx` uses `fumadocs-ui/layouts/notebook`
  (`DocsLayout`), `nav.mode: "top"`, non-collapsible sidebar, `tabMode: "navbar"`, plus our own
  `<FloatNav>` (bottom-center, site-global) and a `<DocsFooter>` that spans the full grid track.
- **The notebook grid** (`apps/docs/app/global.css` lines ~330–394): Fumadocs' 5-column
  `#nd-notebook-layout` grid is explicitly overridden with `grid-template-columns` `!important`
  rules per breakpoint: mobile (`<768px`) collapses gutters/sidebar to `0px`; `768–1279px` reserves
  `var(--fd-sidebar-col)` + `var(--fd-toc-width)`; **`≥1280px` hardcodes a 240px TOC column**
  (`grid-template-columns: 0px var(--fd-sidebar-col) 1fr 240px 0px !important`) so content width is
  identical whether or not a page has a TOC, except `full` pages which collapse the TOC column to
  `0px`. Sidebar width is also pinned to `240px` (`--fd-sidebar-width: 240px`). This is the exact
  "known rule pinning a 240px toc column at xl+" mentioned in the brief.
- **Preview component** — NOT a two-column split; it's a single boxed unit stacked in the normal
  MDX flow:
  - `apps/docs/components/preview/index.tsx` — server component; reads the example source file,
    resolves all local/shared/block imports recursively (for the "Code" tab), and renders
    `<PreviewShell>`.
  - `apps/docs/components/preview/shell.tsx` — a `Tabs` component with **3 tabs**: `Preview`
    (live render), `Example` (the demo file's source), `Code` (every resolved dependency file, only
    shown if any exist). Fixed height `h-[32rem]` for components, `h-auto min-h-[32rem]` for blocks.
    Blocks additionally get a desktop/tablet/mobile viewport `ToggleGroup` and an "open in new tab"
    link to `/blocks/preview/{path}` (an iframe'd isolated route — this is the closest analogue we
    already have to skiper's `/preview/{slug}`, but it's block-only today, not available for plain
    components).
  - `apps/docs/components/preview/content.tsx` — wraps children in a `ResizablePanelGroup` (mostly
    unused for components — `defaultSize="100%"`, a second 0%-width panel exists presumably for
    future use); blocks render inside an `<iframe>` whose height is driven by a
    `postMessage`-based height-sync protocol from the block itself.
  - No dedicated "info column" exists — description, dependencies, props, etc. all live in the
    normal MDX document flow below the preview box, authored freely per page.
- **MDX authoring surface today** (`apps/docs/content/docs/components/ai-message.mdx`,
  `siri-orb.mdx`): frontmatter (`title`, `description`, `icon`, `dependencies`, `installer`), then
  completely free-form `##` sections — essay-style rationale ("Why `from` and not `role`", "No
  voting on your own message"), a state-contract **table** hand-written in `siri-orb.mdx`, ad hoc
  code snippets, an `## Accessibility` section, and a final `## Props` section using
  `<AutoTypeTable path=".../index.tsx" name="XProps" />` (richer than skiper's table — includes
  Type/Default columns generated from the actual TS types, not hand-maintained).
- **Blocks vs components layout**: same `page.tsx` and same `<Preview type="block">`, but blocks
  get the viewport switcher, the iframe isolation route, and `h-auto` (grows to content) instead of
  a fixed `32rem` box; components are capped at a fixed height with internal scroll.
- **Bottom-center global controls** (`apps/docs/components/float-nav.tsx`): theme toggle, sound
  toggle, color picker, package-manager selector (`PmFloatNav`), "add to kit"/bundle button
  (`KitFloatNav`) — all site-wide, not per-component, floating pill, `fixed bottom-5`.
- **Sidebar quick-nav**: Fumadocs' own left sidebar (`collapsible: false`, `240px`) already plays
  the role of skiper's slide-in component list, but it's always-open (not a toggleable drawer) and
  lives outside the docs-page grid, not layered above the preview.

## Deltas / candidate moves

Priority order, effort tags S(mall)/M(edium)/L(arge):

1. **[S] Add an "Interaction type" checklist block, MDX-authorable.** New optional MDX component
   (e.g. `<InteractionSteps items={[...]} />`) rendered near the top of stateful/animated component
   pages (siri-orb states, ai-message hover reveal, dynamic-island-style demos). Buys: teaches users
   how to actually see the animation without touching the Preview code. Risk: none structural — pure
   addition, doesn't touch Fumadocs grid, MDX, registry, or AutoTypeTable. Main cost is writing the
   copy per component.

2. **[S] Isolated "pop out" preview route for plain components, not just blocks.** We already have
   `/blocks/preview/{path}` (iframe'd, used by the viewport switcher); extend the same mechanism to
   components too and surface an "open in new tab" icon on the `Preview` tab bar (mirrors skiper's
   `/preview/{slug}`). Buys: OG-image capture, embeddable demos, a natural "fullscreen" affordance.
   Risk: low — reuses existing height-postMessage plumbing in `content.tsx`; needs a components
   preview route analogous to `apps/docs/app/blocks/preview`.

3. **[M] Reuse the toolbar-icon-inline-in-prose trick + a "Notes"/"Keep in mind" MDX convention.**
   Standardize an MDX `<ComponentNotes items={[...]} />` block (bullet list) for a11y disclaimers,
   reduced-motion behavior, "recreation of X" credit lines — content we're already writing as
   prose in `## Accessibility`/ad hoc paragraphs (see `siri-orb.mdx`, `ai-message.mdx`) but not in a
   consistent, scannable shape. Buys: visual consistency + faster authoring (fill-in-the-blanks vs.
   free prose). Risk: none to Fumadocs/registry; risk is only that it competes with our existing
   free-form essay style (see "Do NOT copy" — we deliberately write more narrative docs than
   skiper does, and that's a stated strength, not a bug).

4. **[M] Section-label rhythm as an alternative/optional dense mode for the MDX body**, i.e. style
   `##`/`###` headings in docs content with the small-caps tracked-out treatment plus consistent
   vertical rhythm, instead of (or as an option alongside) our current default Fumadocs prose
   headings. Buys: a big chunk of the "organizadita" feel without touching layout structure at all
   — purely a `global.css` typographic change scoped to `#nd-page` prose. Risk: low but real — must
   check contrast/heading-hierarchy a11y rules (Ultracite) still hold, and that it doesn't collide
   with the existing `#nd-page h5`/`h6` rules already present in `global.css` (~line 320+).

5. **[L] A real two-column "always-visible preview" layout for component/block detail pages**,
   i.e. actually restructure `apps/docs/app/docs/[...slug]/page.tsx` + `layout.tsx` so the live
   `<Preview>` sticks (not `position: fixed`, but a `sticky` column within the existing Fumadocs
   grid) while the MDX body scrolls in the other column. Buys: the single biggest UX win from the
   reference (component is inspectable while reading). Risks are the largest in this list:
   - Fumadocs' `DocsLayout`/notebook grid, its TOC (`tableOfContent`), and its own scroll-based
     active-heading tracking all assume the *page* scrolls as one column — a sticky/split preview
     column needs to coexist with the TOC's IntersectionObserver logic, not fight it.
   - Our `global.css` already hardcodes the grid-template-columns for `#nd-notebook-layout`
     (5-column, TOC pinned at 240px) — a two-column *within* the content track is layerable on top
     without touching those rules, provided it's implemented as a Tailwind flex/grid split inside
     `<DocsBody>`, not by fighting the outer notebook grid.
   - Registry/AutoTypeTable/MDX authoring must be unaffected: the props table, install command, and
     bundle-size badge all need to remain server-rendered in the (now scrolling) info column exactly
     as today — this move only changes container geometry, not content source.
   - Recommend prototyping behind a feature flag on one component page first (e.g. `siri-orb`, which
     already has rich MDX content to stress-test scroll length) before rolling out site-wide.

## Do NOT copy

- The fixed, no-page-scroll, 100vh app-shell architecture — incompatible with Fumadocs' TOC/notebook
  layout without a significant rewrite, and actively fights our SEO footer's full-grid-width trick.
- Defaulting to a collapsed/full-page-preview state that hides the description, dependencies, and
  props table behind a client-side toggle on first load — bad for SEO, crawlers, and our
  AutoTypeTable content, which should be visible without interaction.
- The simplified two-column (Prop/Description only) props table — a regression from our
  `AutoTypeTable`-generated Type/Default columns.
- Their essay-free, checklist-only prose style wholesale — our `ai-message.mdx`/`siri-orb.mdx`
  rationale sections ("Why `from` and not `role`", the state-contract table) are a deliberate,
  differentiated strength; don't flatten them into skiper's terser bullet format.
- The site-wide Cmd+K command palette and the slide-in full-catalog sidebar drawer — both are
  global-navigation features, not component-detail-page concerns, and we already have Fumadocs
  search + a persistent (non-drawer) sidebar covering the same job.
- Hard-navigation Prev/Next (full reload, no animated transition) — not a regression to introduce;
  keep whatever transition behavior we already have, if any.
