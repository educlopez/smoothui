# Oat illustrations

Spec for a later skill. Do not invent a second material.

Illustrations are HTML fragments, not pictures of an app. One fragment tells one story.

## Material

- Tray: `rounded-xl bg-muted`.
- Floating panel: white card (`bg-card`), `ring-1 ring-foreground/8` (or `ring-border-illustration` when that token is in scope), shadow at about 6.5% black (`shadow-sm` or `shadow-lg`). Radius 14px (`rounded-xl`) or 18px (`rounded-2xl`).
- Bottom mask around 65% so stacked cards fade out. Do not fill the cell edge to edge.
- Copy is one short line, or skeleton bars. No paragraphs, no data tables, no uppercase column headers.
- Icon tile: 24px, `rounded-md`, hairline ring, stroke about 1px.
- One tint per piece. That tint is brand pink or a single status color, never both, never a rainbow.
- Device frame only: `bg-background/85`, `border-foreground/10`, a long shadow (`shadow-2xl`). Do not use that shadow on product cards.

## Recipes

Pick one per vignette. Do not repeat a recipe twice on the same page.

1. Prompt — field plus a short suggestion list and a key hint.
2. Flow — a hub, chips with an icon tile, optional dashed connectors.
3. Steps — a status chip, dashed elbows, nested cards.
4. Stack — rounded cards in a pile, optional “add” row.
5. File — a corner fold, skeleton lines, a small badge.
6. Message — a rounded panel, an avatar ring, one reaction.
7. Split — a rounded panel divided into a few tiles.

## Rules

- Decorative root is `aria-hidden`. The real heading sits outside.
- Check light and dark. The ring has to stay visible on both.
- Motion is a short pulse or a caret. No spring overshoot.
- Do not put a colored stage behind the fragment. The tray is the muted surface.
