# SmoothUI — Design Brief

Surface: the SmoothUI public site (landing + docs + Theme Studio at smoothui.dev).
Scoped to the marketing/docs surface, not the installed components themselves.
Created 2026-06-12. Append-mostly — date every change, never delete principles.

## 1. Product purpose

The place where React developers and AI agents discover, preview live, and
install animated shadcn-compatible components in one command.

## 2. Primary user

A React developer already using shadcn/ui, evaluating components on a desktop,
who wants to preview the motion, then `npx shadcn add` and ship in minutes — and
the AI coding agents that install on their behalf. Both are first-class.

## 3. Principles (conflict-resolution order — higher wins)

1. **Show the component, not the chrome.** The live demos are the product; site
   UI retreats so the preview is the loudest thing on screen. Decoration loses to
   the demo every time.
2. **Installable beats impressive.** The install command is never more than one
   click from the preview. Optimize for "copy and ship", not for browsing.
3. **Machine-readable is a first-class surface.** Anything a human can find
   (component, props, install), an agent can fetch as structured data. No
   human-only affordance for core discovery.
4. **Motion proves the point, never decorates.** Animation demonstrates a
   component's behavior; site chrome animates only to communicate state or space,
   and always honors `prefers-reduced-motion`.
5. **One signature, applied everywhere.** The dotted-frame motif and the brand
   pink are the identity; consistency across landing, docs and studio beats
   per-page novelty.

> Override example: if the dotted-frame motif (P5) competes with a component
> preview for attention (P1), P1 wins — the frame retreats.

## 4. Success metric

A developer lands on a component page and has the install command copied (or the
code panel open) within ~15 seconds — and an agent can resolve the same
component's install JSON in a single request.

## 5. Out of scope

- Does not persist user state server-side — Theme Studio presets are URL-encoded, not accounts.
- Does not re-explain shadcn basics — links out rather than duplicating shadcn's docs.
- Does not gate core component discovery behind JS-only interactions.
- Does not blur the free/Pro line — Pro content lives on pro.smoothui.dev.
- Does not become a generic theming playground — the studio themes SmoothUI's own surface.

## Visual direction (durable decisions, 2026-06-12)

- **Style: Soft Modern, refined.** Evolve the current look — rounded cards, soft
  layered shadows (ambient + direct, no heavy glow), generous whitespace, neutrals
  with a subtle tint. Polish and consistency over reinvention.
- **Accent: brand pink, kept.** `oklch(0.72 0.2 352.53)`. Budget it to 3–5
  placements per above-the-fold viewport; lower chroma on secondary uses.
- **Signature: the dotted frame** (`.frame-box`) is the recurring motif.
- **Type: Poppins display / Inter body** — keep, but unify into a shared type
  scale consumed by landing AND docs prose (today they diverge).
- **Audience: humans + machines equally** — keep the AI-native surface
  (llms.txt, skill, structured endpoints) first-class alongside the visual design.
