# Releasing

## Branches

| Branch    | Role                                                                 |
| --------- | -------------------------------------------------------------------- |
| `develop` | Integration. Feature branches merge here. Releases are prepared here. |
| `main`    | Released code. `release-please` watches this branch and nothing else. |

Both branches are protected: Build, Lint, Test, Typecheck, Browser Smoke,
Lockfile Audit and gitleaks must pass, and neither accepts a force push or a
deletion. `main` additionally requires a branch to be up to date with its base
before merging; `develop` does not, so day-to-day work is not spent rebasing.

## The flow

1. Branch from `develop`. Open a PR back into `develop`. CI runs on both
   `main` and `develop` targets, so this is gated.
2. When `develop` holds a set of changes worth shipping, open a PR from
   `develop` into `main`.
3. Merging that PR triggers `release-please` on `main`, which opens (or
   updates) its own release PR with the version bump and changelog.
4. Merging the release PR cuts the tag, the GitHub release, and — for
   `packages/cli` — publishes to npm through OIDC.

## Why step 2 is not automated

A workflow can open the `develop → main` PR, but a pull request created with
the default `GITHUB_TOKEN` does not trigger other workflows. CI would never
run on it, and because `main` requires those exact checks the PR could never
be merged — the automation would deadlock against the branch protection.

Automating it properly needs a PAT or a GitHub App token, which is a real
secret to own and rotate for something that happens a handful of times a
month. Until that trade is worth making, open it by hand:

```bash
gh pr create --base main --head develop \
  --title "chore: promote develop to main" \
  --body "Cuts a release from the work currently on develop."
```

Created from your own token, CI runs normally.

## Conventional commits drive the changelog

`release-please` reads commit messages, and squash-merging makes the **PR
title** the commit message. So the PR title is what lands in the release
notes — make it describe the most significant change in the PR, not the
smallest. `feat:` and `fix:` are user-visible; `chore:`, `ci:`, `test:`,
`style:` and `build:` are hidden from the changelog by
`release-please-config.json`.
