import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const EXPECTED_FILES = [
  "LICENSE",
  "README.md",
  "dist/index.js",
  "package.json",
] as const;
const EXPECTED_BIN = {
  smoothui: "dist/index.js",
  "smoothui-cli": "dist/index.js",
} as const;
const compareFileNames = (left: string, right: string): number => {
  if (left === right) {
    return 0;
  }
  return left < right ? -1 : 1;
};

interface NpmPackFile {
  mode?: number;
  path?: string;
}

interface NpmPackResult {
  filename?: string;
  files?: NpmPackFile[];
  integrity?: string;
  name?: string;
  shasum?: string;
  version?: string;
}

interface PackageJson {
  bin?: unknown;
  name?: unknown;
  version?: unknown;
}

export interface VerifyCliPackageOptions {
  artifactDirectory: string;
  expectedTag: string;
  packJsonPath: string;
  sourcePackageJsonPath: string;
}

export interface VerifiedCliPackage {
  files: string[];
  name: string;
  tarballPath: string;
  version: string;
}

const assertEqual = (
  actual: unknown,
  expected: unknown,
  message: string
): void => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `${message}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`
    );
  }
};

const readJson = <Value>(filePath: string): Value =>
  JSON.parse(readFileSync(filePath, "utf8")) as Value;

const runCli = (entryPath: string, argument: string): string =>
  execFileSync(process.execPath, [entryPath, argument], {
    encoding: "utf8",
    env: { ...process.env, NO_COLOR: "1" },
  }).trim();

export const verifyCliPackage = ({
  artifactDirectory,
  expectedTag,
  packJsonPath,
  sourcePackageJsonPath,
}: VerifyCliPackageOptions): VerifiedCliPackage => {
  const packResults = readJson<NpmPackResult[]>(packJsonPath);
  if (packResults.length !== 1) {
    throw new Error(
      `Expected one npm pack result, received ${packResults.length}.`
    );
  }

  const [packResult] = packResults;
  if (
    !(
      packResult?.name &&
      packResult.version &&
      packResult.filename &&
      packResult.integrity &&
      packResult.shasum
    )
  ) {
    throw new Error(
      "npm pack JSON is missing name, version, filename, or integrity metadata."
    );
  }

  const sourcePackage = readJson<PackageJson>(sourcePackageJsonPath);
  assertEqual(packResult.name, sourcePackage.name, "Package name mismatch");
  assertEqual(
    packResult.version,
    sourcePackage.version,
    "Package version mismatch"
  );
  assertEqual(
    expectedTag,
    `cli-v${packResult.version}`,
    "Release tag does not match package version"
  );

  if (path.basename(packResult.filename) !== packResult.filename) {
    throw new Error("npm pack reported an unsafe tarball filename.");
  }

  const files = (packResult.files ?? [])
    .map((file) => file.path)
    .filter((file): file is string => Boolean(file))
    .sort(compareFileNames);
  assertEqual(files, [...EXPECTED_FILES], "Unexpected npm package files");

  const executableEntry = packResult.files?.find(
    (file) => file.path === "dist/index.js"
  );
  if (executableEntry?.mode !== 0o755) {
    throw new Error("dist/index.js is not executable in the npm tarball.");
  }

  const tarballPath = path.resolve(artifactDirectory, packResult.filename);
  const tarball = readFileSync(tarballPath);
  assertEqual(
    createHash("sha1").update(tarball).digest("hex"),
    packResult.shasum,
    "Tarball shasum mismatch"
  );
  assertEqual(
    `sha512-${createHash("sha512").update(tarball).digest("base64")}`,
    packResult.integrity,
    "Tarball integrity mismatch"
  );

  const tarballFiles = execFileSync("tar", ["-tzf", tarballPath], {
    encoding: "utf8",
  })
    .trim()
    .split("\n")
    .sort(compareFileNames);
  assertEqual(
    tarballFiles,
    EXPECTED_FILES.map((file) => `package/${file}`).sort(compareFileNames),
    "Unexpected tarball files"
  );

  const extractionDirectory = mkdtempSync(
    path.join(tmpdir(), "smoothui-cli-verify-")
  );

  try {
    execFileSync("tar", ["-xzf", tarballPath, "-C", extractionDirectory]);
    const extractedPackageDirectory = path.join(extractionDirectory, "package");
    const extractedPackage = readJson<PackageJson>(
      path.join(extractedPackageDirectory, "package.json")
    );
    assertEqual(
      extractedPackage.name,
      packResult.name,
      "Tarball name mismatch"
    );
    assertEqual(
      extractedPackage.version,
      packResult.version,
      "Tarball version mismatch"
    );
    assertEqual(extractedPackage.bin, EXPECTED_BIN, "Tarball bin mismatch");

    const cliEntry = path.join(extractedPackageDirectory, "dist/index.js");
    const bundledVersion = runCli(cliEntry, "--version");
    assertEqual(
      bundledVersion,
      packResult.version,
      "Bundled CLI version is stale"
    );

    const helpOutput = runCli(cliEntry, "--help");
    if (!helpOutput.includes("Usage: npx smoothui <command> [options]")) {
      throw new Error("Packed CLI --help smoke test did not print usage.");
    }
  } finally {
    rmSync(extractionDirectory, { force: true, recursive: true });
  }

  return {
    files,
    name: packResult.name,
    tarballPath,
    version: packResult.version,
  };
};

const getArgument = (name: string): string => {
  const index = process.argv.indexOf(name);
  const value = process.argv[index + 1];
  if (index === -1 || !value) {
    throw new Error(`Missing required argument: ${name}`);
  }
  return value;
};

const isMainModule =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isMainModule) {
  const result = verifyCliPackage({
    artifactDirectory: getArgument("--artifact-dir"),
    expectedTag: getArgument("--expected-tag"),
    packJsonPath: getArgument("--pack-json"),
    sourcePackageJsonPath: getArgument("--source-package"),
  });
  process.stdout.write(`${JSON.stringify(result)}\n`);
}
