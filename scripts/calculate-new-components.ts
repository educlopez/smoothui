import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

/**
 * Records when each component doc first appeared, so the sidebar can badge new
 * components without anyone remembering to write a date in frontmatter.
 *
 * Git is the source of truth, but it is read *here* and committed as JSON rather
 * than read at build time: Vercel shallow-clones, so `git log` on a build machine
 * cannot see when a file was added. The committed manifest is what ships.
 */

type AddedManifest = {
  /** Docs slug (`components/ai-tool-call`) → ISO date the page first appeared. */
  added: Record<string, string>;
  generatedAt: string;
};

const REPO_ROOT = join(import.meta.dirname, "..");
const DOCS_CONTENT_DIR = join(
  REPO_ROOT,
  "apps",
  "docs",
  "content",
  "docs",
  "components"
);
const OUTPUT_PATH = join(
  REPO_ROOT,
  "apps",
  "docs",
  "lib",
  "generated",
  "component-added.json"
);

/**
 * A shallow clone answers every `git log` with silence, which would stamp the
 * whole catalogue as new. Better to refuse than to publish that.
 */
const MISSING_DATE_RATIO_LIMIT = 0.5;

/**
 * Entries older than this are reused from the previous manifest instead of being
 * asked about again.
 *
 * The date a file was added cannot change, so re-running `git log` over the whole
 * catalogue is wasted work — and it is what made this too slow to put in a commit
 * hook. Recent entries are still re-resolved, because a doc stamped "today" while
 * untracked should pick up its real commit date once it lands.
 */
const RESOLVED_ENTRY_TTL_DAYS = 14;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const FORCE = process.argv.includes("--force");
const MDX_EXTENSION = /\.mdx$/;

const git = (args: string[]): string =>
  execFileSync("git", args, { cwd: REPO_ROOT, encoding: "utf-8" }).trim();

const toSlug = (docPath: string): string =>
  `components/${docPath.split("/").at(-1)?.replace(MDX_EXTENSION, "")}`;

const getDocPaths = (): string[] =>
  readdirSync(DOCS_CONTENT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
    .map((entry) => join(DOCS_CONTENT_DIR, entry.name))
    .sort();

/**
 * The date the file was first added, following renames.
 *
 * `--follow` is what makes a rename stay old: `morph-surface.mdx` was
 * `ai-input.mdx`, and renaming a component does not make it new.
 */
const gitAddedDate = (repoPath: string): string | null => {
  try {
    const output = git([
      "log",
      "--diff-filter=A",
      "--follow",
      "--format=%aI",
      "-1",
      "--",
      repoPath,
    ]);
    return output === "" ? null : output;
  } catch {
    return null;
  }
};

const getAddedDate = (
  absolutePath: string,
  stagedRenames: Map<string, string>
): string | null => {
  const repoPath = relative(REPO_ROOT, absolutePath);
  const direct = gitAddedDate(repoPath);
  if (direct) {
    return direct;
  }

  // Still uncommitted under this name — if it got here by a staged rename, the
  // component's real age lives under its old path.
  const previousPath = stagedRenames.get(repoPath);
  return previousPath ? gitAddedDate(previousPath) : null;
};

/**
 * Staged renames, new path → old path.
 *
 * A rename has no history under its new name until it is committed, so without
 * this a `git mv` would badge an old component as brand new for as long as the
 * move sits in the index.
 */
const getStagedRenames = (): Map<string, string> => {
  const renames = new Map<string, string>();
  try {
    const output = git([
      "diff",
      "--cached",
      "--diff-filter=R",
      "--name-status",
    ]);
    for (const line of output.split("\n")) {
      const [status, from, to] = line.split("\t");
      if (status?.startsWith("R") && from && to) {
        renames.set(to, from);
      }
    }
  } catch {
    // No index, or not a repo — the caller falls back to today's date.
  }
  return renames;
};

const isShallow = (): boolean => {
  try {
    return git(["rev-parse", "--is-shallow-repository"]) === "true";
  } catch {
    return false;
  }
};

const readPreviousManifest = (): Record<string, string> => {
  if (FORCE || !existsSync(OUTPUT_PATH)) {
    return {};
  }
  try {
    const parsed = JSON.parse(
      readFileSync(OUTPUT_PATH, "utf-8")
    ) as Partial<AddedManifest>;
    return parsed.added ?? {};
  } catch {
    return {};
  }
};

const isSettled = (isoDate: string, nowMs: number): boolean => {
  const parsed = Date.parse(isoDate);
  if (Number.isNaN(parsed)) {
    return false;
  }
  return nowMs - parsed > RESOLVED_ENTRY_TTL_DAYS * MS_PER_DAY;
};

const main = (): void => {
  if (isShallow()) {
    process.stderr.write(
      "Refusing to run in a shallow clone: git cannot see when files were added.\nRun `git fetch --unshallow` first.\n"
    );
    process.exit(1);
  }

  const docPaths = getDocPaths();
  const previous = readPreviousManifest();
  const added: Record<string, string> = {};
  const untracked: string[] = [];
  const now = new Date().toISOString();
  const nowMs = Date.parse(now);

  // Only ask git about entries that could still change. Everything else is
  // carried over, which is what keeps this fast enough for a commit hook.
  const needsResolving = docPaths.filter((docPath) => {
    const slug = toSlug(docPath);
    const existing = previous[slug];
    return !(existing && isSettled(existing, nowMs));
  });

  const stagedRenames =
    needsResolving.length > 0 ? getStagedRenames() : new Map<string, string>();

  for (const docPath of docPaths) {
    const slug = toSlug(docPath);

    if (!needsResolving.includes(docPath)) {
      added[slug] = previous[slug] as string;
      continue;
    }

    const date = getAddedDate(docPath, stagedRenames);
    if (date) {
      added[slug] = date;
      continue;
    }

    // No commit added it yet, so it is being written right now. Stamping today
    // means a component is badged from the moment it is authored, not only once
    // it has been committed.
    added[slug] = now;
    untracked.push(slug);
  }

  const missingRatio = docPaths.length ? untracked.length / docPaths.length : 0;
  if (missingRatio > MISSING_DATE_RATIO_LIMIT) {
    process.stderr.write(
      `Refusing to write: ${untracked.length} of ${docPaths.length} docs have no add commit.\nThat usually means truncated git history rather than a very productive afternoon.\n`
    );
    process.exit(1);
  }

  const manifest: AddedManifest = { added, generatedAt: now };
  writeFileSync(OUTPUT_PATH, `${JSON.stringify(manifest, null, 2)}\n`);

  process.stdout.write(
    `Wrote ${Object.keys(added).length} entries to ${relative(REPO_ROOT, OUTPUT_PATH)}\n`
  );
  if (untracked.length > 0) {
    process.stdout.write(
      `Stamped as added today (no commit yet): ${untracked.join(", ")}\n`
    );
  }
};

main();
