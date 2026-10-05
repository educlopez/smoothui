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

## Rolling back a bad release

Revert first, diagnose afterwards. Restoring what users get matters more than
understanding the cause, and the cause is easier to find once nothing is on
fire. Never force-push `main` or `develop`; undo with a revert PR.

| What broke | How to restore it |
| ---------- | ----------------- |
| Docs site | In Vercel, open Deployments and promote the previous production deployment. It is instant and needs no build. Then revert the offending commit on `main` so the next deploy does not bring it back. |
| Registry (`smoothui.dev/r`) | It is served by the docs deployment, so the same promote applies. The registry items are generated from `packages/`, so the lasting fix is a revert PR. |
| `smoothui-cli` on npm | A published version cannot be quietly removed. Point `latest` back at the last good version with `npm dist-tag add smoothui-cli@<good> latest`, mark the bad one with `npm deprecate smoothui-cli@<bad> "<reason>"`, then ship a fixed patch through the normal release flow. |

Steps for any of them:

1. Decide it is a rollback, not a fix-forward. If the cause is not obvious in
   a few minutes, roll back.
2. Restore the service using the table above.
3. Open a revert PR into `develop` and promote it to `main` as usual, so the
   branches match what is live.
4. Open an issue with what broke, how it was noticed and what would have
   caught it earlier.

