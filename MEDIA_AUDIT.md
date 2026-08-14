# Media audit — what gets pulled into the repo

Every external URL referenced from demos, components and blocks, grouped by what
it *is* and what I propose doing with it. **Review the "Proposal" column before I
touch anything.** Written 2026-08-13.

Scope scanned: `apps/docs/examples`, `apps/docs/components`,
`packages/smoothui/components`, `packages/smoothui/blocks`, `packages/data`.

---

## A — Avatars · 18 URLs · 4 files · **replace with the Untitled UI set**

`i.pravatar.cc/128?img=NN`

| File | Notes |
|---|---|
| `examples/animated-avatar-group.tsx` | group stack |
| `examples/animated-list.tsx` | list rows |
| `examples/inline-testimonials.tsx` | testimonial faces |
| `examples/social-hover-card.tsx` | profile card |

Pravatar serves real photographs of real people from a fixed pool, hotlinked and
uncached. Straight swap for the local set (section E below).

## B — Generic photography · 63 URLs · 25 files · **biggest block, needs a curated set**

`picsum.photos/id/NNNN/W/H` and `picsum.photos/seed/NAME/W/H`

Canvas demos: `apple-invites`, `ascii-render`, `coverflow-carousel`, `glass-card`,
`holographic-foil`, `phototab`, `scrollable-card-stack`, `tilt-card`.

Docs examples: `card-swipe-deck`, `coverflow-carousel`, `cursor-image-trail`,
`dither-image`, `dock`, `glass-card`, `holographic-foil`, `hover-expand`,
`hover-image-list`, `image-generation-panel`, `orbital-image-wheel`,
`parallax-layers`, `scroll-image-reveal`, `scroll-progress`, `svg-clip-mask`,
`time-machine-stack`, `video-modal`.

Picsum is random Unsplash stock — it is why several demos look like a stock-photo
grab bag. Some calls pull 2400×1400 for a small tile.

**Proposal:** one curated set of ~20 images (Magnific-generated, coherent grade),
exported at the size each demo actually renders, reused across all 25 files.
Estimated weight as WebP: ~2–3 MB. This is the piece that needs your taste, not
just a download.

## Status: closed 2026-08-13

No demo references an external image host any more. Everything is on ImageKit
under `smoothui/`, reached through three dictionaries in `@smoothui/data`:
`./people` (144), `./app-icons` (59) and `./scenes` (20).

| Was | Count | Now |
|---|---|---|
| `i.pravatar.cc` | 18 | `smoothui/people/` |
| `parsefiles.back4app.com` | 8 | `smoothui/app-icons/` |
| `images.unsplash.com` | 2 | `smoothui/products/` |
| `picsum.photos` | 65 | `smoothui/scenes/` + `backgrounds/` |

Still open: the two videos (section F) and the ImageKit avatars listed in
section E that predate the `people` dictionary.

## Decisions taken 2026-08-13

- **Hosting: ImageKit, not the repo.** Everything goes under `smoothui/` on the
  existing account, so demos request the size they render (`?tr=w-128,f-auto`)
  and a 144-avatar library never lands in a `git clone`. Staged in
  `.media-staging/` (gitignored); `pnpm media:upload` pushes it.
- **App icons: real macOS icons** from macosicongallery.com, reused everywhere a
  demo shows apps — the dock especially. 60 downloaded at 512px.
- **Backgrounds and decoration:** the Super Visuals backgrounds library in Figma,
  replacing the picsum block. Pending access.

## C — Third-party app icons · **resolved: real macOS icons**

`parsefiles.back4app.com/JPaQ…/…_low_res_Arc_Browser.png` + 3 unnamed PNGs

| File |
|---|
| `examples/app-download-stack.tsx` |
| `packages/smoothui/components/app-download-stack/index.tsx` |

Replaced by 60 Apple app icons pulled from macosicongallery.com at 512px
(`cdn.jim-nielsen.com/macos/512/<slug>.png`), staged in
`.media-staging/app-icons/`. These are the recognisable ones — Safari, Photos,
Calendar, FaceTime, Terminal, System Settings, App Store, Podcasts, Reminders,
Preview, Pages, Numbers, Keynote, Final Cut, Logic Pro, Shortcuts, Weather,
Stocks, Time Machine, Books, Contacts, Find My, QuickTime, Voice Memos, plus the
utilities. Not on this page: Finder, Mail, Messages, Music, Maps, Notes, Xcode.

Note on rights, recorded rather than argued: these are Apple's copyrighted icons
and trademarks. Using them makes the dock look right, and icon galleries of this
kind are widely used for exactly that, but it is the same class of thing that
made the Arc icons worth flagging. Fine for demos on our own site; worth a second
look before any of it ends up in a component's shipped defaults via the registry.

## D — Product photography · 2 URLs · 1 file

`images.unsplash.com/photo-…?w=600&h=600&fit=crop` in `examples/product-card.tsx`.
Unsplash licence permits use; hotlinking is the problem. Download and localise.

## E — Your ImageKit account · 15 URLs · 7 files · **decide per case**

`ik.imagekit.io/16u211libb/…`

| Asset | Used in | Note |
|---|---|---|
| `avatar-educalvolpz.jpeg` (3 variants) | `figma-comment`, `user-account-avatar`, `interactive-avatar-tutorial` | your own face in shipped component demos — replace with a fictional person? |
| `smoothui/avatar-1..N.jpg` | `scrollable-card-stack`, `skeleton-loader`, `packages/…/index.ts` | replace with the Untitled UI set |
| `smoothui/girl-nature.webp` | demo imagery | fold into the curated set (B) |

A component library that 404s when a personal ImageKit account lapses is the
concern here, more than the images themselves.

## F — Video · 2 URLs · 2 files · **ask before localising**

| File | URL | Note |
|---|---|---|
| `examples/video-ambient.tsx` | `videos.pexels.com/…/1920_1080_30fps.mp4` | 1080p30 — likely 10–20 MB |
| `examples/video-modal.tsx` | `commondatastorage.googleapis.com/gtv-videos-bucket/…ForBiggerBlazes.mp4` | Google's public sample bucket |

Localising both adds real weight to the repo and to every `git clone`. Options:
re-encode short, small loops (say 4s, 720p, ~1 MB each); or keep these two as the
only sanctioned remote assets. **Your call — I have not assumed either.**

## G — `example.com` in tests · 23 URLs · 17 files · **leave alone**

All inside `*.test.tsx`. Never fetched — jsdom does not load images. Not a defect.

---

## The avatar library you downloaded

`~/Downloads/370++avatars+and+users+library+–+Untitled+UI.zip` — 31 MB, and it is
better than it looked:

- **144 unique people**, each already named by the filename (`Aysha Becker.webp`,
  `Nicolas Trevino.webp`), 640×640.
- Four variants each: JPEG (5.8 MB), WebP (2.8 MB), PNG transparent (19.1 MB),
  WebP transparent (4.6 MB).

**Proposal:** ship the plain **WebP** set only — 144 files, 2.8 MB — into
`apps/docs/public/people/`, plus the transparent WebP set only if a demo actually
needs cut-outs. Skip PNG entirely; 19 MB for no gain over WebP.

Then build `packages/data/people.ts`: 144 fictional personas derived from those
filenames, each with a stable id, name, avatar path, and the fields demos keep
re-inventing — handle, role, company, email, location, initials, a deterministic
accent colour. Every demo that needs a person draws from that one dictionary, so
"Aysha Becker" is the same person with the same face everywhere in the docs.
Licence check pending: I have not verified the Untitled UI terms allow
redistribution inside an open-source repo — worth confirming before it lands.

---

## Order I would go in

1. **A + E-avatars** — the people set. Self-contained, unblocks the dictionary.
2. **C** — decide: invented icons, or drop the component's branded look.
3. **D** — trivial, two files.
4. **B** — the curated photography. Needs your eye and a Magnific session.
5. **F** — only after you decide on repo weight.
