import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parse } from "yaml";

const FORBIDDEN_RESOLUTION_KEYS = new Set([
  "directory",
  "git",
  "repo",
  "tarball",
]);
const FORBIDDEN_RESOLUTION_TYPES = new Set(["directory", "git", "tarball"]);
const GIT_SOURCE = /^(?:git(?:\+(?:file|https?|ssh))?|ssh):\/\/|^git@/i;
const INSECURE_URL = /(^|\s|["'])http:\/\//i;

interface Finding {
  path: string;
  reason: string;
}

const inspectResolution = (
  resolution: unknown,
  path: string,
  findings: Finding[]
): void => {
  if (typeof resolution === "string") {
    if (GIT_SOURCE.test(resolution)) {
      findings.push({
        path,
        reason: "uses an exotic git/tarball/directory resolution",
      });
    }
    if (INSECURE_URL.test(resolution)) {
      findings.push({ path, reason: "uses insecure http://" });
    }
    return;
  }

  if (!(resolution && typeof resolution === "object")) {
    return;
  }

  for (const [key, value] of Object.entries(resolution)) {
    const valuePath = `${path}.${key}`;
    const isForbiddenType =
      key === "type" &&
      typeof value === "string" &&
      FORBIDDEN_RESOLUTION_TYPES.has(value.toLowerCase());
    const isGitSource = typeof value === "string" && GIT_SOURCE.test(value);
    if (FORBIDDEN_RESOLUTION_KEYS.has(key) || isForbiddenType || isGitSource) {
      findings.push({
        path: valuePath,
        reason: "uses an exotic git/tarball/directory resolution",
      });
    }
    if (typeof value === "string" && INSECURE_URL.test(value)) {
      findings.push({ path: valuePath, reason: "uses insecure http://" });
    }
  }
};

const walk = (value: unknown, path: string, findings: Finding[]): void => {
  if (Array.isArray(value)) {
    for (const [index, entry] of value.entries()) {
      walk(entry, `${path}[${index}]`, findings);
    }
    return;
  }

  if (!(value && typeof value === "object")) {
    return;
  }

  for (const [key, entry] of Object.entries(value)) {
    const entryPath = path ? `${path}.${key}` : key;
    if (key === "resolution") {
      inspectResolution(entry, entryPath, findings);
    }
    walk(entry, entryPath, findings);
  }
};

export const validateLockfile = (source: string): Finding[] => {
  const parsed: unknown = parse(source);
  const findings: Finding[] = [];
  walk(parsed, "", findings);
  return findings;
};

const runCli = (): void => {
  const lockfile = resolve(process.argv[2] ?? "pnpm-lock.yaml");

  try {
    const findings = validateLockfile(readFileSync(lockfile, "utf8"));
    if (findings.length > 0) {
      for (const finding of findings) {
        console.error(`${finding.path}: ${finding.reason}`);
      }
      process.exitCode = 1;
    } else {
      console.log(
        `${lockfile} OK: registry-only, HTTPS, no git/tarball/directory resolutions.`
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Unable to validate ${lockfile}: ${message}`);
    process.exitCode = 1;
  }
};

const [, invokedPath] = process.argv;
if (
  invokedPath &&
  import.meta.url === pathToFileURL(resolve(invokedPath)).href
) {
  runCli();
}
