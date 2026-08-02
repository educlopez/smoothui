import {
  chmodSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

interface PackageJson {
  author?: unknown;
  bin?: unknown;
  bugs?: unknown;
  description?: unknown;
  engines?: unknown;
  homepage?: unknown;
  keywords?: unknown;
  license?: unknown;
  name?: unknown;
  repository?: unknown;
  type?: unknown;
  version?: unknown;
}

export const CLI_STAGE_DIRECTORY = ".release/cli-package";
const DISTRIBUTION_ENTRY = "dist/index.js";

const readPackageJson = (packageJsonPath: string): PackageJson =>
  JSON.parse(readFileSync(packageJsonPath, "utf8")) as PackageJson;

export const prepareCliPackage = (rootDirectory = process.cwd()): string => {
  const sourcePackageJson = readPackageJson(
    path.join(rootDirectory, "package.json")
  );
  const distributionEntry = path.join(rootDirectory, DISTRIBUTION_ENTRY);

  if (!existsSync(distributionEntry)) {
    throw new Error(
      `Missing ${DISTRIBUTION_ENTRY}; run "pnpm build:cli" before packaging.`
    );
  }

  const stageDirectory = path.join(rootDirectory, CLI_STAGE_DIRECTORY);
  rmSync(stageDirectory, { force: true, recursive: true });
  mkdirSync(path.join(stageDirectory, "dist"), { recursive: true });

  copyFileSync(
    distributionEntry,
    path.join(stageDirectory, DISTRIBUTION_ENTRY)
  );
  chmodSync(path.join(stageDirectory, DISTRIBUTION_ENTRY), 0o755);
  copyFileSync(
    path.join(rootDirectory, "README.npm.md"),
    path.join(stageDirectory, "README.md")
  );
  copyFileSync(
    path.join(rootDirectory, "LICENSE"),
    path.join(stageDirectory, "LICENSE")
  );

  const publishPackageJson = {
    author: sourcePackageJson.author,
    bin: sourcePackageJson.bin,
    bugs: sourcePackageJson.bugs,
    description: sourcePackageJson.description,
    engines: sourcePackageJson.engines,
    files: [DISTRIBUTION_ENTRY, "README.md", "LICENSE"],
    homepage: sourcePackageJson.homepage,
    keywords: sourcePackageJson.keywords,
    license: sourcePackageJson.license,
    name: sourcePackageJson.name,
    repository: sourcePackageJson.repository,
    type: sourcePackageJson.type,
    version: sourcePackageJson.version,
  };

  writeFileSync(
    path.join(stageDirectory, "package.json"),
    `${JSON.stringify(publishPackageJson, null, 2)}\n`
  );

  return stageDirectory;
};

const isMainModule =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isMainModule) {
  process.stdout.write(`${prepareCliPackage()}\n`);
}
