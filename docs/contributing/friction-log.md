# Friction log

Contributor and agent papercuts while working in this repository live as GitHub
issues labeled `friction`. They are not files in the tree.

This is not a product feature request. File those as ordinary issues. This page
is for developing `educlopez/smoothui`: confusing docs, a command that needs a secret
handshake, a type that lies, a test that only fails locally.

The policy lives here. Agents load
[`.cursor/skills/friction-log/SKILL.md`](../../.cursor/skills/friction-log/SKILL.md)
when they hit friction or when they are the daily investigator.

Canonical tooling: [`educlopez/friction-log`](https://github.com/educlopez/friction-log).

## File an entry

Search open `friction` issues first. Comment on a match instead of opening a
duplicate.

Title: `Friction: <what hurt>`.

Label: `friction`.

Use the [Friction issue form](../../.github/ISSUE_TEMPLATE/friction.yml) or:

```bash
gh issue create --repo educlopez/smoothui --title "Friction: …" --label friction --body-file -
```

Write one issue per papercut. Include what you were doing, the unexpected cost,
the workaround, and enough reproduction to investigate without the original
session. Omit secrets, tokens, and unrelated private content.

Do not commit a `.agents/friction-log/` or `docs/friction-log/` directory.
GitHub is the log.

## Daily investigation

The `Friction log` GitHub Action runs daily at 04:00 UTC. It uses
`educlopez/friction-log@v1` to list open `friction` issues and, when any are
eligible and `CURSOR_API_KEY` is set, spawn one Cursor Cloud Agent on
`educlopez/smoothui` `main`.

The investigator chooses one outcome per issue:

| Outcome       | What happens                                                                                       |
| ------------- | -------------------------------------------------------------------------------------------------- |
| Already fixed | Closes the issue with the evidence.                                                                |
| Invalid       | Closes the issue (not repo friction, duplicate, or not actionable).                                |
| Skip          | Comments a recommended fix and marks the issue skipped until @educlopez replies.                   |
| Fix           | Opens a PR. Low and medium risk may squash-merge after green CI. High risk stays ready-for-review. |

A skip comment includes `<!-- friction-log:skipped -->`. Later daily runs ignore
that issue until @educlopez comments (approve the recommendation, close it, or
give a different approach).

## Operator controls

| Command / control                        | Purpose                                 |
| ---------------------------------------- | --------------------------------------- |
| `npx github:educlopez/friction-log scan` | Read-only eligibility scan. No agent.   |
| Repo variable `FRICTION_LOG_PAUSED=true` | Kill switch: scan, but do not spawn.    |
| Actions → Friction log → Run workflow    | Manual sweep (`dry_run`, `force`).      |

Create the `friction` label (color `#D4A017`) if it does not exist. Add a
repository secret `CURSOR_API_KEY` (Cursor Dashboard → API Keys) so the daily
job can spawn an investigator. Without that secret the Action still scans and
exits successfully.
