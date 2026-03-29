# Proposal: Library & Site Improvements

## Intent

SmoothUI has strong animation quality and 64 components, but adoption is blocked by: (1) missing documentation beyond component listings, (2) absence of essential form/layout components needed for production apps, and (3) zero test coverage creating contributor risk. These improvements position SmoothUI as a serious alternative to Radix/shadcn for animated component needs.

## Scope

### In Scope (Phased)

**Phase 1 — Documentation Foundation (S, 1-2 weeks)**
- Getting Started guide with installation, setup, and first component
- Per-component API reference pages using existing AutoTypeTable infrastructure
- Component search/filter on docs site
- Fix app-download-stack TODO bug

**Phase 2 — Essential Components (L, 3-5 weeks)**
- Drawer/Sheet component
- Dialog/AlertDialog component
- Breadcrumb, Pagination
- Checkbox, Radio, Select/Combobox
- Form wrapper with validation integration
- Context Menu / Dropdown Menu (composable)

**Phase 3 — Testing Infrastructure (M, 2-3 weeks)**
- Vitest setup for unit tests across packages
- Component rendering tests (React Testing Library)
- Accessibility audit tests (axe-core)
- Visual regression baseline with Playwright
- CI integration via GitHub Actions

**Phase 4 — Developer Experience (S, 1-2 weeks)**
- TypeScript declaration generation (.d.ts)
- Component playground/sandbox in docs
- Integration guides (Next.js, Vite, Remix)

### Out of Scope
- Data Table (complex, separate initiative)
- Theming system overhaul
- Mobile/React Native support
- Component versioning/changelog automation
- Performance benchmarking suite

## Approach

1. **Phase 1 first** — Documentation unblocks all other phases by making existing components discoverable and usable. Leverage Fumadocs infrastructure already in place.
2. **Phase 2 components** follow SmoothUI's existing patterns: `packages/smoothui/components/{name}/`, with `index.tsx` + `package.json` + `tsconfig.json`. Each new component gets animation treatment consistent with CLAUDE.md guidelines (spring defaults, `useReducedMotion`, proper easing).
3. **Phase 3 testing** uses Vitest (aligns with Vite/Turbo ecosystem). Start with smoke tests for all 64 existing components, then add interaction tests for new Phase 2 components.
4. **Phase 4 DX** builds on the testing + docs foundation.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `apps/docs/content/docs/` | Modified | New guides, enhanced component docs |
| `apps/docs/content/docs/components/meta.json` | Modified | New component entries |
| `packages/smoothui/components/` | New | ~10 new component directories |
| `packages/smoothui/components/index.ts` | Modified | New component exports |
| `apps/docs/examples/` | New | Example files for new components |
| Root `package.json` / `turbo.json` | Modified | Test scripts, Vitest config |
| `.github/workflows/` | New | CI pipeline for tests |
| `packages/smoothui/components/app-download-stack/` | Modified | TODO bug fix |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Phase 2 scope creep (each component is complex) | High | Strict MVP per component; no compound variants in v1 |
| Animation quality regression in new components | Medium | Enforce CLAUDE.md animation checklist in PR review |
| Testing setup delays from monorepo complexity | Medium | Start with single package (smoothui), expand later |
| Documentation goes stale as components evolve | Medium | AutoTypeTable auto-generates props; minimize manual docs |
| Breaking changes to existing component APIs | Low | Phase 2 adds new components only; existing APIs untouched |

## Rollback Plan

Each phase is independently deployable and revertible:
- **Phase 1**: Docs changes are additive MDX files — delete to revert
- **Phase 2**: New components are isolated directories — remove dir + export to revert
- **Phase 3**: Test infra is additive config — remove Vitest config and test files
- **Phase 4**: DX improvements are additive tooling — remove configs to revert

No existing component behavior is modified in any phase.

## Dependencies

- Fumadocs (already integrated) for documentation features
- Vitest + React Testing Library + Playwright for Phase 3
- No external API or service dependencies

## Success Criteria

- [ ] Getting Started guide published and linked from homepage
- [ ] All 64 existing components have API reference docs with AutoTypeTable
- [ ] 10 new essential components shipped with full docs + examples
- [ ] >80% of components have at least smoke-render tests
- [ ] Accessibility tests pass for all interactive components
- [ ] CI pipeline runs tests on every PR
- [ ] TypeScript declarations generated for all exported components
- [ ] app-download-stack TODO bug resolved

## Effort Summary

| Phase | Size | Timeline | Priority |
|-------|------|----------|----------|
| 1. Documentation | S | 1-2 weeks | P0 (unblocks adoption) |
| 2. Essential Components | L | 3-5 weeks | P0 (unblocks B2B) |
| 3. Testing | M | 2-3 weeks | P1 (unblocks contributions) |
| 4. Developer Experience | S | 1-2 weeks | P2 (quality of life) |

**Total estimate: 7-12 weeks** across all phases, parallelizable after Phase 1.
