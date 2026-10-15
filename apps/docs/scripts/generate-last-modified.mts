// Regenerates lib/generated/last-modified.json — git dates for docs pages.
// Read at request time so the serverless runtime never spawns `git`.
//
// Vercel builds still have git; the function runtime does not. Failures
// write an empty map so the site renders without a date instead of 500ing.
import { execFileSync } from "node:child_process";
import { readdir, stat, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";

const DOCS_ROOT = join(import.meta.dirname, "..");
const CONTENT_ROOT = join(DOCS_ROOT, "content", "docs");
const OUTPUT_PATH = join(DOCS_ROOT, "lib", "generated", "last-modified.json");

interface Manifest {
  generatedAt: string;
  /** `components/dock.mdx` → unix milliseconds */
  times: Record<string, number>;
}

const gitLogMs = (filePath: string): number | null => {
  try {
    const output = execFileSync(
      "git",
      ["log", "-1", "--format=%ct", "--", filePath],
      { cwd: join(DOCS_ROOT, "..", ".."), encoding: "utf-8" }
    ).trim();
    if (!output) {
      return null;
    }
    return Number(output) * 1000;
  } catch {
    return null;
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
  try {
    const files = await collectMdx(CONTENT_ROOT);
    for (const filePath of files) {
      const key = relative(CONTENT_ROOT, filePath).replaceAll("\\", "/");
      const time = gitLogMs(filePath);
      if (time) {
        times[key] = time;
        continue;
      }
      try {
        times[key] = (await stat(filePath)).mtimeMs;
      } catch {
        // Skip files we cannot date.
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
