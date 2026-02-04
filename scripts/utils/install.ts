import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import type { ProjectConfig, RegistryItem } from "../types.js";

export const transformImports = (content: string, alias: string): string => {
  // Transform @/components/ui imports to use user's alias
  // e.g., @/components/ui/button -> {alias}/components/ui/button
  if (alias === "@") {
    return content;
  }

  return content.replace(/@\/components\//g, `${alias}/components/`);
};

export const fileExists = (filePath: string): boolean => {
  return existsSync(filePath);
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

    // Ensure directory exists
    if (!existsSync(targetDir)) {
      mkdirSync(targetDir, { recursive: true });
    }

    // Check if file exists
    if (existsSync(targetPath) && !shouldOverwriteAll) {
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
    writeFileSync(targetPath, content, "utf-8");
    written.push(filePath);
  }

  return { written, skipped };
};

export const installDependencies = (
  deps: string[],
  devDeps: string[],
  packageManager: ProjectConfig["packageManager"]
): boolean => {
  let success = true;

  // Install regular dependencies
  if (deps.length > 0) {
    const commands: Record<typeof packageManager, string[]> = {
      npm: ["npm", "install", ...deps],
      pnpm: ["pnpm", "add", ...deps],
      yarn: ["yarn", "add", ...deps],
      bun: ["bun", "add", ...deps],
    };

    const [cmd, ...args] = commands[packageManager];
    const result = spawnSync(cmd, args, {
      stdio: "pipe",
    });

    if (result.status !== 0) {
      success = false;
    }
  }

  // Install dev dependencies
  if (devDeps.length > 0) {
    const devCommands: Record<typeof packageManager, string[]> = {
      npm: ["npm", "install", "-D", ...devDeps],
      pnpm: ["pnpm", "add", "-D", ...devDeps],
      yarn: ["yarn", "add", "-D", ...devDeps],
      bun: ["bun", "add", "-d", ...devDeps],
    };

    const [cmd, ...args] = devCommands[packageManager];
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
