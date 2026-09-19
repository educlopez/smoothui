# Approved abstract collection

Four Magnific generations approved on 2026-09-19. The downloaded PNG originals
are retained locally in the gitignored `.media-staging/magnific-originals/`.
The approved exports are WebP quality 88 (method 6), preserving source dimensions,
served from `https://ik.imagekit.io/16u211libb/smoothui/scenes/`.

| Catalog ID / filename | Magnific generation ID | Main uses |
| --- | --- | --- |
| `amber-violet.webp` | `rg61Ic3xtc` | Dock wallpaper, SVG mask, coverflow, cursor trail, orbital wheel |
| `cobalt-pink.webp` | `KL45BDMkqp` | Glass-card artwork, SVG mask, coverflow, cursor trail, orbital wheel |
| `coral-lavender.webp` | `Xmbd3WOBfo` | Landing metadata preview, scroll article, coverflow, cursor trail, orbital wheel |
| `cyan-tangerine.webp` | `fHla0cqCDY` | Glass-card background, coverflow, cursor trail, orbital wheel |

## Expanded collection

The final gallery has **95 unique assets**: 12 backgrounds, 8 landscapes, 4 events, 50 people, 18 animals,
1 card artwork and 2 products. Eight additional generations are documented in
`media-provenance/expanded-backgrounds.json`, including generation IDs, original
PNG hashes and 1376 × 768 source dimensions.

All former Abstract, Scenes and Backgrounds assets are retired from the active
collection. `packages/data/scenes.ts` exposes only canonical approved backgrounds;
its compatibility aliases keep older demo references working without serving old
artwork. The gallery lists each unique background once, under **Backgrounds**.
No remote originals were overwritten. The pre-expansion registry and three old
background URLs are retained in `media-provenance/` for rollback.

## Generated people and animals

Imported from the local **Troupe** project (`troupe/assets/people/` and
`troupe/assets/animals/`), not from external avatar providers. Troupe's
`SOURCES.md` records these Magnific generations as owned output approved for
redistribution. All 68 originals remain untouched in Troupe. WebP exports retain
1024 × 1024 dimensions at quality 88, method 6, totaling 7,692,908 bytes, and live
in new ImageKit folders `smoothui/troupe-people/` and `smoothui/troupe-animals/`.

`packages/data/cast.ts` contains 50 people and 18 animals. Gender is copied from
Troupe's source catalog: 26 female, 20 male, 4 nonbinary. No label is inferred
from appearance. The five pre-existing editorial portraits are fully retired from the active
catalog and all demos, including cursor-follow, interactive-image-selector,
card-swipe-deck and the features block. Their original URLs remain only in the
archived pre-expansion registry for rollback. Animal species and names also come directly
from source metadata. `media-provenance/troupe-import.json` records source
labels and SHA-256 hashes of every original PNG.

The `/media` gallery separates Backgrounds, People, Animals, Card art and
Products. Its usage map in `apps/docs/lib/media-catalog.ts` lists direct demo
references, combining canvas and docs variants into one destination. Keep this
map synchronized when changing demo imagery. Portraits and animals appear in
photo-stack, hover-expand, hover-image-list, ASCII, dither, time-machine-stack and
scroll-image-reveal demos; the approved Nymara card now replaces the original tarot artwork.

### Rollback

The original asset URLs still exist remotely. Restore the archived scene registry
and the URLs from `media-provenance/backgrounds-before-expansion.json`, then
restore the relevant demo references and gallery categories. Do not upload the
archived originals over the new canonical artwork.


## Generated products

The two product IDs remain `sneaker` and `headphones`, but their old JPEGs are
retired from active usage. New unbranded ivory products share the blurred,
saturated, grain-rich background treatment. `packages/data/products.ts` is the
single source for both gallery and product-card demo URLs, alt text and names.
The demo now labels the actual items **Ivory runner** and **Ivory headphones**,
not a brand claim or perfume.

- Sneaker: Magnific generation `mExmSWqhJQ`, `ivory-sneaker.webp`.
- Headphones: Magnific generation `ks9kZ5r16B`, `ivory-headphones.webp`.

Both Nano Banana 2 Fast generations retain 1024 × 1024 dimensions in WebP quality
88, method 6 (161,410 bytes total). Full PNGs remain in local gitignored staging.
`media-provenance/generated-products.json` records source hashes, generation URLs,
dimensions and retired URLs. New filenames were uploaded without overwriting or
deleting the original JPEGs. The gallery count remains **83**.


## Nymara collectible card

**Nymara — Eclipse Guardian** replaces the old `moon-tarot` artwork everywhere:
the gallery plus docs and canvas HolographicFoil demos. Canonical ID `nymara`
resolves through `sceneById`; the retired ID is no longer active.

Magnific generation `w4YJhQq7EI` is retained at its full **896 × 1200** source
size (approximately 3:4), exported as `cards/nymara.webp`, quality 92, method 6,
149,116 bytes. The full frame, border and printed text are preserved: demos use
intrinsic image height and width-only ImageKit transforms; gallery thumbnails and
full previews use `object-contain`, with no thumbnail hover zoom for card art.
The original foil component, interactive tilt, intensity/pattern controls and
canvas idle sheen are unchanged.

`media-provenance/nymara-card.json` records generation URL, original PNG hash,
dimensions, export settings and retired source URL. Original files remain intact;
no remote artwork was overwritten or deleted. Gallery count remains **83**.


## Landing decorative backgrounds

`apps/docs/lib/landing-backgrounds.ts` selects canonical approved abstracts for
all photographic section backdrops. No new files were generated or uploaded:

| Retired decorative source | Approved replacement | Surface |
| --- | --- | --- |
| `/scenes/why-choose.webp` | `coral-cyan` | Features lead bento |
| `/scenes/ai-mcp.webp` | `fuchsia-cobalt` | AI/MCP lead bento |
| `/scenes/skill-meadow.webp` | `cobalt-pink` | UI Craft CTA (`landingBackgrounds.uicraft`) |
| `/scenes/testimonial-1.jpg` | `violet-tangerine` | First testimonial feature |
| `/scenes/testimonial-2.jpg` | `teal-apricot` | Second testimonial feature |

The metadata showcase is a separate landscape subject, shared through its demo fixture.
Decorative images keep empty alt text and `aria-hidden`; their content is the
section copy, not a subject. Existing component behavior, hero procedural material, meaningful portraits,
logos, demo subjects and editorial blog covers are unchanged. The Features text
region now sits on a dedicated opaque neutral caption, separate from the vivid
art stage. Features and AI lead cards have no black artwork scrims; both caption
descriptions meet 4.5:1 contrast without dimming their backgrounds. Original local backgrounds remain on disk for rollback.
The media gallery derives these landing usage links directly from the shared map.

## Generated demo identities and blog artwork

All fictional demo/block avatar consumers now draw from the 50 canonical Troupe people through `packages/data/people.ts`. Source names, roles and portraits stay together.144former fictional IDs are lookup-only compatibility aliases to complete canonical identities, never additional gallery entries. Contact/company fields are explicit sample data (`example.com`, Demo Studio); real founder/author and real landing testimonial identities remain unchanged. Original stock data is recoverable from Git history (local backup `.media-staging/retired/people-before-troupe.ts`).

`apps/docs/lib/blog-artwork.ts` deliberately distributes 12 approved generated backgrounds across 15 blog posts. Both PostCover and article structured data resolve the same canonical artwork; original editorial files/frontmatter remain available for rollback but are not rendered for these posts.

## Semantic landscape and event scenes

Seven newly generated subject images complement the abstract backgrounds: `alpine-dawn`, `tidal-cove`, `emerald-forest`, `sunrise-yoga`, `supper-club`, `dawn-patrol`, `open-air-cinema`. Phototab icons and Mountains/Sea/Forest labels match the three landscapes. AppleInvites and ExpandableCards share four events and canonical generated hosts; locations describe fictional settings rather than claiming real venues. All seven are new non-overwriting ImageKit files. `media-provenance/semantic-scenes.json` records creation IDs, dimensions, source hashes and conversion; originals remain in `.media-staging/magnific-originals`. Gallery is now 90 unique assets (Landscapes and Events are independent subject categories, not retired stock scenes).

## Stack and metadata landscape expansion

Five additional generated landscapes replace abstract demo subjects: `volcanic-coast`, `terracotta-dunes`, `emerald-terraces`, `glacial-lagoon` in ScrollableCardStack (four docs cards, first three in its unchanged auto-advancing canvas); `turquoise-canyon` in both metadata previews. Real Eduardo identity/profile links remain unchanged. Metadata explicitly identifies AI generation and links the Magnific creation, not a real photographer. The decorative landing map now contains five abstracts; the metadata subject is a separate shared fixture. Gallery total: 95 unique assets. `media-provenance/stack-metadata-landscapes.json` records originals, hashes, dimensions and non-overwriting uploads.

UI Craft now uses the blue-dominant `cobalt-pink` background with the optional subtle contour layer beneath a neutral content panel. Install selection/copy behavior is unchanged; neutral tokens provide contrast without dimming the artwork. This reuses an existing approved asset, so the gallery stays at 95 images.
