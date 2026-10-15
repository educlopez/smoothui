---
name: capture-component-posters
description: >
  Recapture SmoothUI component-index posters. Use when a component is added
  or its example changes, when a poster is missing, blank, or stale, or when
  the user asks to refresh, regenerate, or recapture component covers, shots,
  or the gallery manifest.
---

# Capture component posters

The `/docs/components` index is static WebP posters. Live demos stay on each component page and on the landing slideshow. Do not mount a live demo on the index, including as a fallback when a poster is missing.

Do not hand-edit `apps/docs/components/gallery/component-shots.ts`. The capture script rewrites it.

## When to capture

- A new slug landed in `apps/docs/content/docs/components/meta.json` and has `apps/docs/examples/<slug>.tsx`. Capture that slug. Existing WebPs are skipped.
- An example's look changed. Recapture only that slug with `--force`.
- Recapture every poster only when crop, theme, or viewport settings change, or when the user asks for a full refresh.

## Run

From the repo root. `cwebp` must be on `PATH`. Playwright Chromium must already be installed.

```bash
export PLAYWRIGHT_BROWSERS_PATH="$HOME/Library/Caches/ms-playwright"

# missing posters only, then rewrite the manifest
pnpm capture:posters

# one or more slugs, comma-separated
pnpm capture:posters --only accordion,tweet-card

# replace posters that already exist
pnpm capture:posters --force --only tweet-card
```

Run that outside the sandbox. `tsx` needs its IPC pipes, and an empty `PLAYWRIGHT_BROWSERS_PATH` makes Chromium look in the wrong cache.

The script uses `http://localhost:3000` unless `DOCS_URL` is set. If the docs server is already up, it is left running. If it is down, the script starts `pnpm --filter docs dev` and stops only the server it started.

Capture is light theme, `colorScheme: "light"`, viewport 768×900, device scale 2. 768px is the width of a card column: a 1280px viewport makes full-bleed demos into strips that turn illegible when the card scales them down. It waits 1200ms so entrance animations that start at `opacity: 0` are not blank. Opacity-0 nodes are still measured, because that is the animation, not an empty demo. The screenshot is transparent. After the shot, the script trims to the painted pixels and adds an even 16px margin. `cwebp` encodes at quality 86 with full alpha. A slug fails only when the painted box is under 8px. A short control, such as a checkbox row, is still a poster. The previous file is kept on failure. Fix the demo, then recapture with `--force`. Do not write a text label in place of the component.

The card shows the bitmap at capture size (file pixels ÷ 2). Shots narrower than 168px scale up to 168px so an icon is readable. Wider shots only shrink to fit the card. Do not set the poster image to `w-full`.

## Check

```bash
./node_modules/.bin/vitest run --config vitest.risk.config.ts scripts/component-posters.test.ts
```

The test fails if a component slug has no WebP or no import in `component-shots.ts`. Blocks and templates keep their own covers. Do not change their measurement path.
