# Demo quality backlog

The components are good; a lot of the demos undersell them. Two surfaces are
affected — the landing canvas (`apps/docs/examples/canvas/*`) and the docs
examples (`apps/docs/examples/*`) — and the same three problems recur in both.

Nothing here is started. Written 2026-08-13.

---

## 1. Effects demoed on nothing

A shader rendered into an empty rounded rectangle reads as a static, dull
square. The effect is the product, but a viewer needs a subject to see it *on*.

`examples/canvas/liquid-metal.tsx` is the clearest case: a 300×190 chrome slab,
no content, and because it is a slow shader it looks frozen at a glance. Same
shape of problem:

| Demo | Currently | Should be |
|---|---|---|
| `liquid-metal` | bare chrome slab | metal as a **surface under real content** — a logotype, a card face, a product shot |
| `aurora-curtain` | dark rect + bands | sky behind something — skyline silhouette, a card, type |
| `gravity-stars` | dark rect + dots | starfield behind a subject, or with constellation lines forming a shape |
| `morph-surface` | dock cropped out of its own stage with hardcoded offsets | give it a real stage, or a wider tile |
| `motion-loader`, `siri-orb`, `ai-orb-face` | orb on empty ground | orb in a plausible UI fragment (a prompt bar, a call sheet) |
| `holographic-foil` | foil rect | foil **on a card** — ticket, trading card, membership pass |

Same audit is pending across the docs examples, which have the same tendency.

**Rule to apply:** a demo whose subject is a material or a light must put that
material on an object. No naked rectangles.

## 2. Real-looking photography

Placeholder greys and abstract gradients are why several demos look cheap.

- Use **Magnific (MCP)** to generate the imagery — product shots, scenery, card
  art, album covers — sized to the demo and consistent in grade across a demo
  set, so a carousel does not look like a stock-photo grab bag.
- One shared, curated set reused across demos beats a different look per file.
- Land them as **AVIF/WebP** at the exact rendered size; several demos currently
  pull 600×600 for a 120px slot.

## 3. Avatars must look like people, and must be local

Where a demo shows users, the avatars should read as real photographs of
plausible fictional people (generated, not real individuals). Consistent
lighting and crop across a group, or an avatar stack looks assembled from
scraps.

**Hard rule: download into the repo. Never reference an external URL.**

Current state — **30 demo files hotlink images**:

| Host | Problem |
|---|---|
| `parsefiles.back4app.com` | third-party mirror of Arc Browser assets; provenance and licensing unclear, and it can vanish or change under us |
| `images.unsplash.com` | hotlinked with query-string transforms; no local control, and it breaks offline and in CI |
| `ik.imagekit.io/16u211libb` | your personal ImageKit account; a component library should not depend on it |

Every one of these becomes a file under `apps/docs/public/` (and, for demos that
ship in the registry, an asset the registry can carry). Worth a lint rule
afterwards so a hotlink cannot come back in.

## 4. Feed components with components

Recurring note from review rounds: where a demo needs a button, use SmoothUI's
own `Button`; where it needs an input, reuse the AI prompt component. Demos are
also the best argument that the pieces compose.

---

## Order of work

1. Bring the images in-repo and kill the hotlinks — this is also a supply-chain
   and reliability fix, not only cosmetic.
2. Generate the shared photography and avatar sets with Magnific.
3. Rework the "effect on nothing" demos, canvas first (that is the landing).
4. Sweep the docs examples with the same three rules.
