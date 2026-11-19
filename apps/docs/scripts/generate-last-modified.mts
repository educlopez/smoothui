// Regenerates lib/generated/last-modified.json — git dates for docs pages.
// Read at request time so the serverless runtime never spawns `git`.
//
// Vercel builds still have git; the function runtime does not. Failures
// write an empty map so the site renders without a date instead of 500ing.
//
// Vercel clones shallowly. In a shallow clone every file last touched before
// the clone boundary reports the boundary commit as its last change, so most
// pages would share one fake date. Dates that resolve to a boundary commit
// fall back to the committed manifest, or are left out. The same goes for
// files git cannot date: a file's mtime on a build machine is checkout time.
import { execFileSync } from "node:child_process";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";

const DOCS_ROOT = join(import.meta.dirname, "..");
const CONTENT_ROOT = join(DOCS_ROOT, "content", "docs");
const OUTPUT_PATH = join(DOCS_ROOT, "lib", "generated", "last-modified.json");

interface Manifest {
  generatedAt: string;
  /** `components/dock.mdx` → unix milliseconds */
  times: Record<string, number>;
}

const REPO_ROOT = join(DOCS_ROOT, "..", "..");
const WHITESPACE = /\s+/;

const git = (args: string[]): string =>
  execFileSync("git", args, { cwd: REPO_ROOT, encoding: "utf-8" }).trim();

/** Commits at the edge of a shallow clone; empty for a full clone. */
const shallowBoundaries = async (): Promise<Set<string>> => {
  try {
    if (git(["rev-parse", "--is-shallow-repository"]) !== "true") {
      return new Set();
    }
    const shallowFile = resolve(
      REPO_ROOT,
      git(["rev-parse", "--git-path", "shallow"])
    );
    const hashes = (await readFile(shallowFile, "utf-8")).split(WHITESPACE);
    return new Set(hashes.filter(Boolean));
  } catch {
    return new Set();
  }
};

const gitLog = (filePath: string): { hash: string; ms: number } | null => {
  try {
    const output = git(["log", "-1", "--format=%H %ct", "--", filePath]);
    if (!output) {
      return null;
    }
    const [hash, seconds] = output.split(" ");
    return { hash, ms: Number(seconds) * 1000 };
  } catch {
    return null;
  }
};

const readPrevious = async (): Promise<Record<string, number>> => {
  try {
    const manifest = JSON.parse(
      await readFile(OUTPUT_PATH, "utf-8")
    ) as Manifest;
    return manifest.times ?? {};
  } catch {
    return {};
  }
};

const collectMdx = async (dir: string): Promise<string[]> => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectMdx(fullPath)));
    } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
      files.push(fullPath);
    }
  }
  return files;
};

const main = async () => {
  const times: Record<string, number> = {};
  const previous = await readPrevious();
  const boundaries = await shallowBoundaries();
  try {
    const files = await collectMdx(CONTENT_ROOT);
    for (const filePath of files) {
      const key = relative(CONTENT_ROOT, filePath).replaceAll("\\", "/");
      const log = gitLog(filePath);
      if (log && !boundaries.has(log.hash)) {
        times[key] = log.ms;
        continue;
      }
      // Unreliable or missing git date: keep the committed one, else omit.
      const fallback = previous[key];
      if (fallback) {
        times[key] = fallback;
      }
    }
  } catch {
    // Keep going with whatever we collected.
  }

  const manifest: Manifest = {
    generatedAt: new Date().toISOString(),
    times,
  };

  await writeFile(OUTPUT_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
};

await main();
