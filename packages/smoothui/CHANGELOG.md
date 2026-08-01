# Changelog

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
