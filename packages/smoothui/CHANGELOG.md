# Changelog

## [3.9.1](https://github.com/educlopez/smoothui/compare/v3.8.0...v3.9.1) (2026-09-24)

### Performance

* render the component index from static posters ([2efe424](https://github.com/educlopez/smoothui/commit/2efe424a1008af1e2118ba184600cf36ec7bedb0))

### Bug Fixes

* prefer live column-width demos in gallery masonry cards ([738de237](https://github.com/educlopez/smoothui/commit/738de237))

## [3.9.0](https://github.com/educlopez/smoothui/compare/v3.8.0...v3.9.0) (2026-09-20)


### Features

* **docs:** Sapira reading/masonry UX, theme drawer, and landing illustrations ([d8f10aa](https://github.com/educlopez/smoothui/commit/d8f10aa5197af6258f9eb6869d617b0aef021f7a))


### Bug Fixes

* make landing NumberFlow showcase update reliably under masonry ([21fd6af](https://github.com/educlopez/smoothui/commit/21fd6afc55f2950ae43a1743db23aa0d5f76dbc8))
* prevent NumberFlow controlled increments from racing on rapid clicks ([6fe7893](https://github.com/educlopez/smoothui/commit/6fe7893e0ee084e452e068c078951177c7ee1b95))

## [3.8.0](https://github.com/educlopez/smoothui/compare/v3.7.1...v3.8.0) (2026-09-19)

### Component library

- Added 67 components with registry entries, documentation and examples, including self-sizing documentation previews.
- Expanded accessibility checks across the library with axe, keyboard and reduced-motion coverage.
- Completed the shared media dictionary migration across components, blocks and templates, removing inconsistent demo asset references.
- Fixed Number Flow's animation lifecycle cleanup and reduced-motion behavior. Its homepage controls now match the documentation proportions without changing the initial example value.
- Fixed Scrollable Card Stack pagination on mobile under reduced motion: cards retain static centering and navigation sits above the card layers. Normal animations and keyboard interaction remain available.
- Hardened the shared copy control: rejected clipboard writes allow retry without false success, pending results are ignored after unmount, and timers are cleaned up. The default loading indicator respects reduced motion.
- Improved event-card text contrast, image alternative text, responsive metadata previews and consistency between demo names and portraits.

### Documentation site and product experience

These are site/product updates, not claims that every asset or page is distributed in an npm package.

#### Landing and Playground

- Added a draggable component canvas and refined live showcase interactions, responsive layouts, navigation and documentation links.
- Consolidated theme exploration in the Playground while preserving shared preset URLs and the legacy themes route.
- Refined the hero, Features, AI workflow and UI Craft section with vivid generated backgrounds and neutral interactive UI panels.
- Added opt-in square and organic contour textures to selected artwork. Patterns remain decorative, non-interactive and disabled by default; other backgrounds remain unpatterned.
- Moved feature captions onto readable dedicated surfaces instead of dimming entire images.
- Replaced the oversized installer mascot copy prompt with the compact shared copy component, integrated beside the command with matching light/dark surfaces. The footer mascot remains.

#### Original media

- Added a searchable gallery of **95 unique active assets**: 12 abstract backgrounds, 8 landscapes, 4 event images, 50 people, 18 animals, 2 products and 1 fantasy card.
- Replaced legacy portraits with the generated Troupe cast, preserving source-provided identity/gender metadata and internal compatibility aliases without duplicate gallery entries.
- Added ivory sneaker and headphones product imagery and the original Nymara fantasy card, preserving its complete card composition.
- Added semantic mountain, sea, forest and event imagery for Photo Tabs, Apple Invites and Expandable Cards, plus distinct landscapes for Scrollable Card Stack and Image Metadata Preview.
- Centralized artwork selection and documented provenance and rollback references; updated misleading image titles, alternative text and sample metadata.

#### Editorial covers and changelog

- Added topic-specific editorial covers for all **15 blog posts**, combining approved backgrounds, optional subtle patterns, frosted cards and neutral UI illustrations. Covers appear in landing cards, the blog index and article heroes.
- Social metadata and structured data retain valid canonical background image URLs; composed social images are **not** included.
- Updated the manually maintained platform changelog and notification feed. Package release notes remain separate and are generated through the existing release-please flow; no new changelog automation was added.

### Security and engineering

- Updated the documentation framework to **Next.js 16.3.3** and its image processor to **Sharp 0.35.4**.
- Raised affected transitive dependency security floors within their existing majors, including Hono/node-server, qs, fast-uri, js-yaml, Browserslist/baseline data, selector-parser and NanoID 3.
- Aligned Vitest and coverage tooling to **4.1.11** across the workspace.
- At verification time, full and production `pnpm audit` reports contained **zero known advisories**. This describes the audited dependency graph, not a guarantee against undiscovered vulnerabilities.
- Added regression coverage for media catalogs, artwork variants, image layouts, clipboard success/failure/races, Number Flow lifecycle/proportions and reduced-motion stack pagination.
- Validated the integration with 81 browser smoke tests, workspace typechecks, copy lifecycle tests, the component/risk suites and a production build.

### Source references

- [Component expansion](https://github.com/educlopez/smoothui/commit/d4cf30eb)
- [Accessibility audit](https://github.com/educlopez/smoothui/commit/6ea67276)
- [Component canvas and shared media dictionary](https://github.com/educlopez/smoothui/commit/c85e7ff6)
- [Media dictionary completion](https://github.com/educlopez/smoothui/commit/d7cf1940)
- [Landing consolidation](https://github.com/educlopez/smoothui/commit/e66ddc50)
- [Original media and platform changelog](https://github.com/educlopez/smoothui/commit/0e351131)
- [Security dependencies and stack navigation](https://github.com/educlopez/smoothui/commit/520c1272)
- [Inline copy lifecycle and browser coverage](https://github.com/educlopez/smoothui/commit/5646e82e)

## [3.7.1](https://github.com/educlopez/smoothui/compare/v3.7.0...v3.7.1) (2026-08-02)


### Bug Fixes

* **ci:** harden supply-chain checks ([0f75904](https://github.com/educlopez/smoothui/commit/0f759047eb3cb20860d1a4b374322390b3c8a467))
* **ci:** secure pre-install validation ([a961592](https://github.com/educlopez/smoothui/commit/a961592dfdca8bc54abf7990410d7b44b8f0ce7e))

## [3.7.0](https://github.com/educlopez/smoothui/compare/v3.6.0...v3.7.0) (2026-08-01)


### Features

* **blocks:** use brand logo PNGs in the hero header ([c3ec403](https://github.com/educlopez/smoothui/commit/c3ec4039fb6a946fe172896f27d449be34bae4b1))
* **registry:** ship SmoothUI design tokens as an installable item ([793bb11](https://github.com/educlopez/smoothui/commit/793bb1129f22079c09ec9aeac18f037a84ac15c9))


### Bug Fixes

* **blocks:** correct the @repo/* tsconfig paths mapping ([38dcbaa](https://github.com/educlopez/smoothui/commit/38dcbaab2c1486ce5d1f3500a01115287dbe2693))
* **blocks:** correct the @repo/* tsconfig paths mapping ([23acc9c](https://github.com/educlopez/smoothui/commit/23acc9c2c74700078a10153b22997075f1288276))
* **brand:** correct SmoothUI wordmark casing and add PNG brand assets ([f804186](https://github.com/educlopez/smoothui/commit/f804186b79e0bc27fc03e443cff12369145de89c))
* **components:** replace colour tokens that resolve to nothing ([0d7be54](https://github.com/educlopez/smoothui/commit/0d7be545c9e97cc4f046759c4f88d734c8405365))
* **smoothui:** make Dynamic Island content readable in light mode ([f950e07](https://github.com/educlopez/smoothui/commit/f950e07fc184c1dcb52221c1a6d55fd3067c2a84))
* **smoothui:** make Dynamic Island content readable in light mode ([414f301](https://github.com/educlopez/smoothui/commit/414f301a50b432be0f7d55e45e44b4f0535da021))

## [3.6.0](https://github.com/educlopez/smoothui/compare/v3.5.0...v3.6.0) (2026-07-31)


### Features

* **docs:** rebuild how components, blocks and templates are presented ([ec48807](https://github.com/educlopez/smoothui/commit/ec488079952f04e1bf90e000f28e706add7d50d8))
* **docs:** split preview layout, templates section and AI component expansion ([cefd728](https://github.com/educlopez/smoothui/commit/cefd7285acdd4184da3f777824d4450d230de528))
* **templates:** sell the template, and make it work on a phone ([9851bc1](https://github.com/educlopez/smoothui/commit/9851bc1befe862a7fc010b85fab06f0dfd6b0a52))


### Bug Fixes

* **smoothui:** annotate createStubGl return type to avoid non-portable inference (TS2742) ([a395d5b](https://github.com/educlopez/smoothui/commit/a395d5b704651ac73ebc5a0de5eb0e65bb5d2923))
* **ui:** visible ink and working cursors across components and blocks ([19f957d](https://github.com/educlopez/smoothui/commit/19f957d0928390eeb6a3dc49310ec4c0feb86621))

## [3.5.0](https://github.com/educlopez/smoothui/compare/v3.4.1...v3.5.0) (2026-07-12)


### Features

* add shader transition components ([b5fe33e](https://github.com/educlopez/smoothui/commit/b5fe33e494a5d28468b064c7c7ddad8783fdebc0))
* **components:** add 23 text animation components from animate-text catalog ([9908c53](https://github.com/educlopez/smoothui/commit/9908c537f2d50a91f3df08a306f1282c246fa629))
* **components:** add PhotoStack draggable photo deck ([7b1add3](https://github.com/educlopez/smoothui/commit/7b1add339e55d82c4e5ebe898eb262b70547c949))
* **components:** add ShineText literal light-sweep text effect ([245f96d](https://github.com/educlopez/smoothui/commit/245f96d7afe3aab7727bae0c71465daa12f54bf9))
* **components:** rename Akella transitions to ShaderReveal and close registry gaps ([27f7cea](https://github.com/educlopez/smoothui/commit/27f7ceaa8f24b2f21357741ac6455d7386de0221))
* design tokens, UI redesign, install bundle and text animation components ([ac56a98](https://github.com/educlopez/smoothui/commit/ac56a98d9a220528f646aefffd7a1c3f920e15ea))
* registry hardening, installable themes, Theme Studio, a11y & tests ([f53845b](https://github.com/educlopez/smoothui/commit/f53845bfd3823227804dddc483eb90db1aecd716))
* **smooth-button:** rework into a decoupled design-system button ([3caa80c](https://github.com/educlopez/smoothui/commit/3caa80c50db70e3dbf32926c56211c55fa653e89))


### Bug Fixes

* **basic-accordion:** keep a stable width by not unmounting collapsed content ([09a1137](https://github.com/educlopez/smoothui/commit/09a11371236aa07ed6abbe2e2735545fd85c1176))
* **blocks:** respect prefers-reduced-motion across all animated blocks ([74d0ce1](https://github.com/educlopez/smoothui/commit/74d0ce107c6beead5be92ed9b8b281c8c47a3ff3))
* **components:** add missing "use client" directive to scramble-hover ([246e0a2](https://github.com/educlopez/smoothui/commit/246e0a203300cf1287cd6fe5c3aff43255b901eb))
* **components:** disable native image dragging across the library ([119157f](https://github.com/educlopez/smoothui/commit/119157f89f7dba34d046e7ca7153c3d102403ac7))
* **components:** remove forced min-h-screen from number-flow root ([4e4531e](https://github.com/educlopez/smoothui/commit/4e4531ee5689656605948a609f219bcd7b8ebdff))
* **deps:** bump vitest to ^4.1.0 (GHSA-5xrq-8626-4rwp) ([#85](https://github.com/educlopez/smoothui/issues/85)) ([25eafd3](https://github.com/educlopez/smoothui/commit/25eafd3b321db91fa87c3aec13cc74b87264e585))
* **docs:** center blog post layout and fix AnimatedInput hydration mismatch ([15b137f](https://github.com/educlopez/smoothui/commit/15b137f409c3cdccec1b3497f2926a21bdb52961))
* **registry:** rewrite workspace imports in served registry content ([b73ac1d](https://github.com/educlopez/smoothui/commit/b73ac1d4bc6d89cf654f909d8a2a101d4e2e6c1b))


### Code Refactoring

* **landing:** unify CTAs on the design-system button ([44d3740](https://github.com/educlopez/smoothui/commit/44d37407edaa829d4a37498dfe4de6d69b82e40b))

## [3.4.1](https://github.com/educlopez/smoothui/compare/v3.4.0...v3.4.1) (2026-06-01)


### Bug Fixes

* **tweet-card:** guard against tweets with missing entity arrays ([#80](https://github.com/educlopez/smoothui/issues/80)) ([6928c0f](https://github.com/educlopez/smoothui/commit/6928c0f61daf04690ae0b57f5ef739f475b382e8))
