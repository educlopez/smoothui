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

Capture is light theme, `colorScheme: "light"`, viewport 560×1400, device scale 2. It waits 1200ms so entrance animations that start at `opacity: 0` are not blank. A demo that still renders nothing becomes a labeled frame, not a live card. Fix the demo when that happens, then recapture that slug with `--force`.

## Check

```bash
./node_modules/.bin/vitest run --config vitest.risk.config.ts scripts/component-posters.test.ts
```

The test fails if a component slug has no WebP or no import in `component-shots.ts`. Blocks and templates keep their own covers. Do not change their measurement path.
