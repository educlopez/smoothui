import { spawnSync } from "node:child_process";
import {
  closeSync,
  constants,
  existsSync,
  fstatSync,
  ftruncateSync,
  lstatSync,
  mkdirSync,
  openSync,
  readFileSync,
  realpathSync,
  type Stats,
  writeFileSync,
} from "node:fs";
import {
  dirname,
  isAbsolute,
  join,
  parse,
  relative,
  resolve,
  sep,
} from "node:path";
import type { ProjectConfig, RegistryItem } from "../types.js";

export const transformImports = (content: string, alias: string): string => {
  // Transform @/components/ui imports to use user's alias
  // e.g., @/components/ui/button -> {alias}/components/ui/button
  if (alias === "@") {
    return content;
  }

  return content.replace(/@\/components\//g, `${alias}/components/`);
};

export const fileExists = (filePath: string): boolean => existsSync(filePath);

const throwUnsafeSymlink = (registryPath: string, diskPath: string): never => {
  throw new Error(
    `Invalid registry file path "${registryPath}": symbolic link is not allowed at ${diskPath}`
  );
};

const assertSingleLinkTarget = (
  status: Stats,
  registryPath: string,
  diskPath: string
): void => {
  if (status.nlink !== 1) {
    throw new Error(
      `Refused to write registry file "${registryPath}": target with multiple hard links is not allowed at ${diskPath}`
    );
  }
};

const isMissingPathError = (error: unknown): boolean =>
  error instanceof Error && "code" in error && error.code === "ENOENT";

const tryLstat = (diskPath: string): Stats | null => {
  try {
    return lstatSync(diskPath);
  } catch (error) {
    if (isMissingPathError(error)) {
      return null;
    }
    throw error;
  }
};

const assertDirectoryEntry = (
  status: Stats,
  diskPath: string,
  registryPath: string
): void => {
  if (status.isSymbolicLink()) {
    throwUnsafeSymlink(registryPath, diskPath);
  }
  if (!status.isDirectory()) {
    throw new Error(
      `Invalid registry file path "${registryPath}": expected a directory at ${diskPath}`
    );
  }
};

const ensureSafeDirectoryPath = (
  absoluteDirectory: string,
  registryPath: string
): void => {
  const { root } = parse(absoluteDirectory);
  let currentDirectory = root;
  const segments = relative(root, absoluteDirectory).split(sep).filter(Boolean);

  for (const segment of segments) {
    currentDirectory = join(currentDirectory, segment);
    let status = tryLstat(currentDirectory);
    if (status === null) {
      mkdirSync(currentDirectory);
      status = tryLstat(currentDirectory);
      if (status === null) {
        throw new Error(
          `Unable to create registry target directory at ${currentDirectory}`
        );
      }
    }
    assertDirectoryEntry(status, currentDirectory, registryPath);
  }
};

const assertCanonicalContainment = (
  targetRoot: string,
  targetDirectory: string,
  registryPath: string
): void => {
  const canonicalRoot = realpathSync(targetRoot);
  const canonicalDirectory = realpathSync(targetDirectory);
  const canonicalRelativePath = relative(canonicalRoot, canonicalDirectory);
  if (
    canonicalRelativePath.startsWith("..") ||
    isAbsolute(canonicalRelativePath)
  ) {
    throw new Error(
      `Invalid registry file path "${registryPath}": resolved directory escapes the component root`
    );
  }
};

const assertSafeTargetFile = (
  targetPath: string,
  registryPath: string
): boolean => {
  const status = tryLstat(targetPath);
  if (status === null) {
    return false;
  }
  if (status.isSymbolicLink()) {
    throwUnsafeSymlink(registryPath, targetPath);
  }
  if (!status.isFile()) {
    throw new Error(
      `Invalid registry file path "${registryPath}": expected a regular file at ${targetPath}`
    );
  }
  assertSingleLinkTarget(status, registryPath, targetPath);
  return true;
};

const assertSafeWriteTarget = (
  targetRoot: string,
  targetDirectory: string,
  targetPath: string,
  registryPath: string
): boolean => {
  ensureSafeDirectoryPath(targetRoot, registryPath);
  ensureSafeDirectoryPath(targetDirectory, registryPath);
  assertCanonicalContainment(targetRoot, targetDirectory, registryPath);
  return assertSafeTargetFile(targetPath, registryPath);
};

const assertOpenedTargetIsSafe = (
  descriptor: number,
  targetRoot: string,
  targetPath: string,
  registryPath: string
): void => {
  const pathStatus = tryLstat(targetPath);
  if (pathStatus === null) {
    throw new Error(
      `Refused to write registry file "${registryPath}": target changed while opening`
    );
  }
  if (pathStatus.isSymbolicLink()) {
    throwUnsafeSymlink(registryPath, targetPath);
  }
  if (!pathStatus.isFile()) {
    throw new Error(
      `Refused to write registry file "${registryPath}": opened target is not a regular file`
    );
  }
  assertSingleLinkTarget(pathStatus, registryPath, targetPath);

  const descriptorStatus = fstatSync(descriptor);
  assertSingleLinkTarget(descriptorStatus, registryPath, targetPath);
  if (
    descriptorStatus.dev !== pathStatus.dev ||
    descriptorStatus.ino !== pathStatus.ino
  ) {
    throw new Error(
      `Refused to write registry file "${registryPath}": target changed while opening`
    );
  }

  const canonicalRoot = realpathSync(targetRoot);
  const canonicalTarget = realpathSync(targetPath);
  const canonicalRelativePath = relative(canonicalRoot, canonicalTarget);
  if (
    canonicalRelativePath.startsWith("..") ||
    isAbsolute(canonicalRelativePath)
  ) {
    throw new Error(
      `Refused to write registry file "${registryPath}": opened target escapes the component root`
    );
  }
};

const writeTargetFile = (
  targetRoot: string,
  targetPath: string,
  registryPath: string,
  content: string,
  targetExists: boolean
): void => {
  const noFollowFlag =
    typeof constants.O_NOFOLLOW === "number" ? constants.O_NOFOLLOW : 0;
  // biome-ignore lint/suspicious/noBitwiseOperators: Node filesystem flags are bit masks.
  const createFlags = targetExists ? 0 : constants.O_CREAT | constants.O_EXCL;
  // biome-ignore lint/suspicious/noBitwiseOperators: Node filesystem flags are bit masks.
  const openFlags = constants.O_WRONLY | noFollowFlag | createFlags;
  const descriptor = openSync(targetPath, openFlags, 0o666);

  try {
    // On platforms without O_NOFOLLOW, opening is still non-destructive until
    // the descriptor and path identity have been compared. O_EXCL protects the
    // create case; existing files are truncated only after this validation.
    assertOpenedTargetIsSafe(descriptor, targetRoot, targetPath, registryPath);
    ftruncateSync(descriptor, 0);
    writeFileSync(descriptor, content, "utf-8");
  } finally {
    closeSync(descriptor);
  }
};

export const buildInstallCommand = (
  packages: string[],
  packageManager: ProjectConfig["packageManager"],
  development = false
): [string, ...string[]] => {
  const command = packageManager === "npm" ? "install" : "add";
  const developmentFlag = packageManager === "bun" ? "-d" : "-D";
  return development
    ? [packageManager, command, developmentFlag, ...packages]
    : [packageManager, command, ...packages];
};

export const writeComponent = async (
  item: RegistryItem,
  config: ProjectConfig,
  overwriteAll: boolean,
  promptOverwrite: (filename: string) => Promise<"overwrite" | "skip" | "all">
): Promise<{ written: string[]; skipped: string[] }> => {
  const written: string[] = [];
  const skipped: string[] = [];
  let shouldOverwriteAll = overwriteAll;
  const targetRoot = resolve(process.cwd(), config.componentPath);

  for (const file of item.files) {
    // Use target path if available, strip common prefixes like "components/"
    let filePath = file.target || file.path;
    if (filePath.startsWith("components/")) {
      filePath = filePath.slice("components/".length);
    }

    // Validate path to prevent directory traversal
    const targetPath = resolve(targetRoot, filePath);
    const relativePath = relative(targetRoot, targetPath);
    if (relativePath.startsWith("..") || isAbsolute(relativePath)) {
      throw new Error(`Invalid registry file path: ${filePath}`);
    }

    const targetDir = dirname(targetPath);

    // Create one segment at a time and reject symlinked ancestors. A lexical
    // containment check alone is insufficient because a registry path can
    // traverse an in-root symlink that points outside the component directory.
    const targetExists = assertSafeWriteTarget(
      targetRoot,
      targetDir,
      targetPath,
      filePath
    );

    // Check if file exists
    if (targetExists && !shouldOverwriteAll) {
      const action = await promptOverwrite(filePath);

      if (action === "skip") {
        skipped.push(filePath);
        continue;
      }

      if (action === "all") {
        shouldOverwriteAll = true;
      }
    }

    // Transform and write content
    const content = transformImports(file.content, config.alias);
    const targetStillExists = assertSafeWriteTarget(
      targetRoot,
      targetDir,
      targetPath,
      filePath
    );
    if (targetStillExists !== targetExists) {
      throw new Error(
        `Refused to write registry file "${filePath}": target changed during installation`
      );
    }
    writeTargetFile(targetRoot, targetPath, filePath, content, targetExists);
    written.push(filePath);
  }

  return { skipped, written };
};

export const installDependencies = (
  deps: string[],
  devDeps: string[],
  packageManager: ProjectConfig["packageManager"]
): boolean => {
  let success = true;

  // Install regular dependencies
  if (deps.length > 0) {
    const [cmd, ...args] = buildInstallCommand(deps, packageManager);
    const result = spawnSync(cmd, args, {
      stdio: "pipe",
    });

    if (result.status !== 0) {
      success = false;
    }
  }

  // Install dev dependencies
  if (devDeps.length > 0) {
    const [cmd, ...args] = buildInstallCommand(devDeps, packageManager, true);
    const result = spawnSync(cmd, args, {
      stdio: "pipe",
    });

    if (result.status !== 0) {
      success = false;
    }
  }

  return success;
};

export const getDiff = (
  existingPath: string,
  newContent: string
): string | null => {
  if (!existsSync(existingPath)) {
    return null;
  }

  const existing = readFileSync(existingPath, "utf-8");
  const existingLines = existing.split("\n");
  const newLines = newContent.split("\n");

  const diffs: string[] = [];
  const maxLines = Math.max(existingLines.length, newLines.length);

  for (let i = 0; i < maxLines; i++) {
    const oldLine = existingLines[i];
    const newLine = newLines[i];

    if (oldLine !== newLine) {
      if (oldLine !== undefined) {
        diffs.push(`- ${oldLine}`);
      }
      if (newLine !== undefined) {
        diffs.push(`+ ${newLine}`);
      }
    }
  }

  return diffs.length > 0 ? diffs.slice(0, 20).join("\n") : null;
};
