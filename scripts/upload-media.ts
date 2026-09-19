/**
 * Uploads the staged demo media to ImageKit under `smoothui/`.
 *
 * Media lives on ImageKit rather than in the repo so demos can ask for the size
 * they actually render (`?tr=w-128,f-auto`) instead of shipping one fixed export
 * per use, and so a 144-avatar library does not land in every `git clone`.
 *
 * Source of truth is `.media-staging/` (gitignored). Re-running is safe:
 * `useUniqueFileName` is off and `overwriteFile` is on, so a file keeps its URL
 * across uploads and nothing accumulates duplicate suffixes.
 *
 * Usage:
 *   IMAGEKIT_PRIVATE_KEY=... pnpm media:upload            # everything
 *   IMAGEKIT_PRIVATE_KEY=... pnpm media:upload people     # one folder
 *   IMAGEKIT_PRIVATE_KEY=... pnpm media:upload --dry-run
 */

import { readFileSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { basename, join } from "node:path";

/**
 * The key lives in the docs app's gitignored env file, which is where the rest
 * of the ImageKit config already is. Read it directly so the script works
 * without exporting anything into the shell, where it would land in history.
 */
const ENV_FILE = "apps/docs/.env.local";
const KEY_LINE = /^IMAGEKIT_PRIVATE_KEY\s*=\s*"?([^"\n\r]+)"?/m;

const readPrivateKey = (): string | undefined => {
  if (process.env.IMAGEKIT_PRIVATE_KEY) {
    return process.env.IMAGEKIT_PRIVATE_KEY;
  }
  try {
    const match = readFileSync(ENV_FILE, "utf8").match(KEY_LINE);
    return match?.[1]?.trim();
  } catch {
    // No env file at that path; the caller reports the missing key.
  }
};

const UPLOAD_ENDPOINT = "https://upload.imagekit.io/api/v1/files/upload";
const STAGING_ROOT = ".media-staging";
const REMOTE_ROOT = "smoothui";
/** ImageKit rate-limits bursts; a small pool keeps well under it. */
const CONCURRENCY = 6;

interface UploadResult {
  error?: string;
  name: string;
  url?: string;
}

const privateKey = readPrivateKey();
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const onlyFolders = args.filter((arg) => !arg.startsWith("--"));

if (!(privateKey || dryRun)) {
  process.stderr.write(
    `IMAGEKIT_PRIVATE_KEY not found in the environment or ${ENV_FILE}.\n` +
      "Get it from the ImageKit dashboard under Developer options > API keys.\n" +
      "The env file is gitignored; never commit the key.\n"
  );
  process.exit(1);
}

// Basic auth: the private key is the username and the password is empty.
const authHeader = `Basic ${Buffer.from(`${privateKey}:`).toString("base64")}`;

const uploadOne = async (
  localPath: string,
  folder: string
): Promise<UploadResult> => {
  const name = basename(localPath);
  if (dryRun) {
    return { name, url: `${REMOTE_ROOT}/${folder}/${name}` };
  }

  const body = new FormData();
  body.append("file", new Blob([await readFile(localPath)]), name);
  body.append("fileName", name);
  body.append("folder", `${REMOTE_ROOT}/${folder}`);
  // Keep the URL stable across re-runs instead of appending a random suffix.
  body.append("useUniqueFileName", "false");
  body.append("overwriteFile", "true");

  const response = await fetch(UPLOAD_ENDPOINT, {
    body,
    headers: { Authorization: authHeader },
    method: "POST",
  });

  if (!response.ok) {
    return { error: `${response.status} ${await response.text()}`, name };
  }
  const json = (await response.json()) as { url: string };
  return { name, url: json.url };
};

/** Runs `task` over `items` with a bounded pool, preserving input order. */
const pooled = async <T, R>(
  items: T[],
  limit: number,
  task: (item: T) => Promise<R>
): Promise<R[]> => {
  const results = new Array<R>(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, () =>
    (async () => {
      while (cursor < items.length) {
        const index = cursor;
        cursor += 1;
        results[index] = await task(items[index]);
      }
    })()
  );
  await Promise.all(workers);
  return results;
};

const main = async () => {
  const folders = (await readdir(STAGING_ROOT, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => onlyFolders.length === 0 || onlyFolders.includes(name));

  if (folders.length === 0) {
    process.stderr.write(`Nothing to upload under ${STAGING_ROOT}/\n`);
    process.exit(1);
  }

  let failures = 0;

  for (const folder of folders) {
    const dir = join(STAGING_ROOT, folder);
    const files = (await readdir(dir)).filter((name) => !name.startsWith("."));
    process.stdout.write(
      `${dryRun ? "[dry-run] " : ""}${folder}: ${files.length} files\n`
    );

    const results = await pooled(files, CONCURRENCY, (name) =>
      uploadOne(join(dir, name), folder)
    );

    for (const result of results) {
      if (result.error) {
        failures += 1;
        process.stderr.write(`  FAIL ${result.name} — ${result.error}\n`);
      }
    }
    process.stdout.write(
      `  ${results.length - failures} uploaded to ${REMOTE_ROOT}/${folder}/\n`
    );
  }

  if (failures > 0) {
    process.exit(1);
  }
};

await main();
