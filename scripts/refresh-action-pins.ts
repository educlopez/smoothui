// Reports (and optionally rewrites) the commit SHAs that GitHub Actions are
// pinned to across .github/workflows.
//
// Pinning a commit is what makes a moved tag harmless, but it also means nothing
// updates on its own. Dependabot is the usual answer and is deliberately not
// used here: it was turned off in this repo on purpose, and reintroducing it for
// five actions that move a few times a year is not a trade worth making.
//
// So updating is a deliberate act instead:
//
//   pnpm actions:check    what has moved, and what the latest release is
//   pnpm actions:update   rewrite the pins to the tags they already track
//
// `update` follows the tag each pin already carries — it never jumps you to a
// new major. Moving from v4 to v7 is a decision, so it stays manual.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const WORKFLOWS = join(import.meta.dirname, "../.github/workflows");
const API = "https://api.github.com";

// `uses: owner/repo@<40-hex> # v4` — only already-pinned entries.
const PINNED = /uses: ([\w.-]+\/[\w.-]+)@([0-9a-f]{40}) # (\S+)/g;
// `uses: owner/repo@v4` — entries still on a mutable tag.
const TAGGED = /uses: ([\w.-]+\/[\w.-]+)@(?![0-9a-f]{40})(\S+)/g;

interface Pin {
  action: string;
  sha: string;
  tag: string;
}
interface Occurrence extends Pin {
  file: string;
}

const headers: Record<string, string> = {
  accept: "application/vnd.github+json",
};
if (process.env.GITHUB_TOKEN) {
  headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

const api = async <T>(path: string): Promise<T | null> => {
  const response = await fetch(`${API}${path}`, { headers });
  return response.ok ? ((await response.json()) as T) : null;
};

/** Commit a tag points at, dereferencing annotated tags. */
const resolveTag = async (
  action: string,
  tag: string
): Promise<string | null> => {
  const ref = await api<{ object: { sha: string; type: string } }>(
    `/repos/${action}/git/ref/tags/${tag}`
  );
  if (!ref) {
    return null;
  }
  if (ref.object.type !== "tag") {
    return ref.object.sha;
  }
  const annotated = await api<{ object: { sha: string } }>(
    `/repos/${action}/git/tags/${ref.object.sha}`
  );
  return annotated?.object.sha ?? null;
};

const latestRelease = async (action: string): Promise<string> => {
  const release = await api<{ tag_name: string }>(
    `/repos/${action}/releases/latest`
  );
  return release?.tag_name ?? "?";
};

const workflowFiles = (): string[] =>
  readdirSync(WORKFLOWS)
    .filter((name) => name.endsWith(".yml") || name.endsWith(".yaml"))
    .map((name) => join(WORKFLOWS, name));

const main = async () => {
  const write = process.argv.includes("--write");
  const files = workflowFiles();

  // Every occurrence is kept, not one per action@tag: the same action can be
  // pinned to different commits in different files, and deduping hides exactly
  // the drift this is looking for.
  const occurrences: Occurrence[] = [];
  const unpinned = new Set<string>();

  for (const file of files) {
    const source = readFileSync(file, "utf8");
    for (const [, action, sha, tag] of source.matchAll(PINNED)) {
      occurrences.push({ action, file, sha, tag });
    }
    for (const [, action, tag] of source.matchAll(TAGGED)) {
      unpinned.add(`${action}@${tag}`);
    }
  }

  if (unpinned.size > 0) {
    console.log("Not pinned to a commit:");
    for (const entry of [...unpinned].sort()) {
      console.log(`  ${entry}`);
    }
    console.log("");
  }

  let moved = 0;

  // One API round trip per action@tag, however many files reference it.
  const targets = [
    ...new Map(
      occurrences.map((entry) => [`${entry.action}@${entry.tag}`, entry])
    ).values(),
  ];

  const resolved = await Promise.all(
    targets.map(async (pin) => ({
      current: await resolveTag(pin.action, pin.tag),
      latest: await latestRelease(pin.action),
      pin,
    }))
  );

  for (const { pin, current, latest } of resolved) {
    const behind =
      latest !== pin.tag && latest !== "?" ? `  (latest ${latest})` : "";

    if (!current) {
      console.log(`?  ${pin.action}@${pin.tag} — could not resolve${behind}`);
      continue;
    }
    const stale = occurrences.filter(
      (entry) =>
        entry.action === pin.action &&
        entry.tag === pin.tag &&
        entry.sha !== current
    );

    if (stale.length === 0) {
      console.log(`ok ${pin.action}@${pin.tag}${behind}`);
      continue;
    }

    moved += stale.length;
    for (const entry of new Map(
      stale.map((item) => [item.sha, item])
    ).values()) {
      console.log(
        `MOVED ${pin.action}@${pin.tag}: ${entry.sha.slice(0, 7)} -> ${current.slice(0, 7)}${behind}`
      );
    }

    if (write) {
      for (const entry of stale) {
        const source = readFileSync(entry.file, "utf8");
        writeFileSync(
          entry.file,
          source.replaceAll(
            `${entry.action}@${entry.sha} # ${entry.tag}`,
            `${entry.action}@${current} # ${entry.tag}`
          )
        );
      }
    }
  }

  if (moved === 0) {
    console.log("\nAll pins current.");
    return;
  }
  if (write) {
    console.log(`\nRewrote ${moved} pin(s). Review the diff.`);
    return;
  }
  console.log(`\n${moved} pin(s) behind their tag. Run with --write.`);
  process.exitCode = 1;
};

await main();
