import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { prepareCliPackage } from "./prepare-cli-package.mjs";

const rootDirectory = process.cwd();
const releaseDirectory = path.join(rootDirectory, ".release");
const artifactDirectory = path.join(releaseDirectory, "artifacts");
const packJsonPath = path.join(releaseDirectory, "cli-pack.json");

const stageDirectory = prepareCliPackage(rootDirectory);
rmSync(artifactDirectory, { force: true, recursive: true });
mkdirSync(artifactDirectory, { recursive: true });

const packJson = execFileSync(
  "npm",
  [
    "pack",
    "--json",
    "--ignore-scripts",
    "--pack-destination",
    artifactDirectory,
    stageDirectory,
  ],
  { cwd: rootDirectory, encoding: "utf8" }
);

writeFileSync(packJsonPath, packJson);

const [packResult] = JSON.parse(packJson) as [{ filename?: string }];
if (!packResult?.filename) {
  throw new Error("npm pack did not report a tarball filename.");
}

process.stdout.write(`${path.join(artifactDirectory, packResult.filename)}\n`);
