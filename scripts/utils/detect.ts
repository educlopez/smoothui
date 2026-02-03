import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { LOCKFILES, PATH_PATTERNS } from "../constants.js";
import type { ProjectConfig } from "../types.js";

const PACKAGE_MANAGER_REGEX = /^(npm|pnpm|yarn|bun)@/;

export const detectPackageManager = (): ProjectConfig["packageManager"] => {
  const cwd = process.cwd();

  for (const { file, cmd } of LOCKFILES) {
    if (existsSync(join(cwd, file))) {
      return cmd;
    }
  }

  // Check packageManager field in package.json
  const pkgPath = join(cwd, "package.json");
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
      if (pkg.packageManager) {
        const match = pkg.packageManager.match(PACKAGE_MANAGER_REGEX);
        if (match) {
          return match[1] as ProjectConfig["packageManager"];
        }
      }
    } catch {
      // ignore parse errors
    }
  }

  return "npm";
};

export const detectComponentPath = (): string | null => {
  const cwd = process.cwd();

  for (const pattern of PATH_PATTERNS) {
    if (existsSync(join(cwd, pattern))) {
      return pattern;
    }
  }

  return null;
};

export const detectAlias = (): string => {
  const cwd = process.cwd();
  const configFiles = ["tsconfig.json", "jsconfig.json"];

  for (const configFile of configFiles) {
    const configPath = join(cwd, configFile);
    if (existsSync(configPath)) {
      try {
        const content = readFileSync(configPath, "utf-8");
        // Remove comments for JSON parsing
        const cleaned = content.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "");
        const config = JSON.parse(cleaned);

        const paths = config.compilerOptions?.paths;
        if (paths) {
          // Look for common alias patterns
          for (const [alias, targets] of Object.entries(paths)) {
            if (alias.endsWith("/*") && Array.isArray(targets)) {
              // Return the alias prefix (e.g., "@" from "@/*")
              return alias.slice(0, -2);
            }
          }
        }
      } catch {
        // ignore parse errors
      }
    }
  }

  return "@"; // Default alias
};

export const detectConfig = (): ProjectConfig => ({
  componentPath: detectComponentPath() || "components/ui",
  alias: detectAlias(),
  packageManager: detectPackageManager(),
});
