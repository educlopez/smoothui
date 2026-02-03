import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
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

  for (const file of item.files) {
    const targetPath = join(process.cwd(), config.componentPath, file.path);
    const targetDir = dirname(targetPath);

    // Ensure directory exists
    if (!existsSync(targetDir)) {
      mkdirSync(targetDir, { recursive: true });
    }

    // Check if file exists
    if (existsSync(targetPath) && !shouldOverwriteAll) {
      const action = await promptOverwrite(file.path);

      if (action === "skip") {
        skipped.push(file.path);
        continue;
      }

      if (action === "all") {
        shouldOverwriteAll = true;
      }
    }

    // Transform and write content
    const content = transformImports(file.content, config.alias);
    writeFileSync(targetPath, content, "utf-8");
    written.push(file.path);
  }

  return { written, skipped };
};

export const installDependencies = (
  deps: string[],
  packageManager: ProjectConfig["packageManager"]
): boolean => {
  if (deps.length === 0) {
    return true;
  }

  const commands: Record<typeof packageManager, string[]> = {
    npm: ["npm", "install", ...deps],
    pnpm: ["pnpm", "add", ...deps],
    yarn: ["yarn", "add", ...deps],
    bun: ["bun", "add", ...deps],
  };

  const [cmd, ...args] = commands[packageManager];

  const result = spawnSync(cmd, args, {
    stdio: "pipe",
    shell: true,
  });

  return result.status === 0;
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
