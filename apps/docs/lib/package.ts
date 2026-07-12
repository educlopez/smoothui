import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import postcss, { type AtRule } from "postcss";
import postcssNested from "postcss-nested";
import { cache } from "react";
import type { RegistryItem } from "shadcn/schema";

// Regex patterns for detecting imports (hoisted for performance)
const SHADCN_IMPORT_REGEX = /@\/components\/ui\/([a-z-]+)/g;
const RELATIVE_IMPORT_REGEX = /from\s+["']\.\.\/([a-z-]+)["']/g;
const SMOOTHUI_IMPORT_REGEX = /@\/components\/smoothui\/([a-z0-9-]+)/g;
const SMOOTHUI_DATA_IMPORT_REGEX = /@\/lib\/smoothui-data/;

const REGISTRY_URL = "https://smoothui.dev/r";

// Workspace import specifiers must be rewritten to the paths where the
// registry installs files in user projects — raw @repo/* or @smoothui/*
// specifiers don't resolve outside this monorepo.
const WORKSPACE_IMPORT_REWRITES: ReadonlyArray<readonly [RegExp, string]> = [
  [/@repo\/shadcn-ui\/lib\/utils/g, "@/lib/utils"],
  [/@repo\/shadcn-ui\/components\/ui\//g, "@/components/ui/"],
  [/@repo\/smoothui\/components\//g, "@/components/smoothui/"],
  [/@smoothui\/data/g, "@/lib/smoothui-data"],
  // Components import shared animation constants via "../../lib/animation";
  // the registry installs that file at components/smoothui/lib/animation.ts.
  [/(?:\.\.\/)+lib\/animation/g, "@/components/smoothui/lib/animation"],
  // Blocks import the shared helpers barrel via "../../shared", which would
  // point outside the install dir (components/smoothui/<name>/) in user
  // projects.
  [/from\s+["'](?:\.\.\/)+shared["']/g, 'from "@/components/smoothui/shared"'],
];

const rewriteWorkspaceImports = (content: string): string => {
  let rewritten = content;
  for (const [pattern, replacement] of WORKSPACE_IMPORT_REWRITES) {
    rewritten = rewritten.replace(pattern, replacement);
  }
  return rewritten;
};

const toTitleCase = (name: string): string =>
  name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

// Workspace package name → registry item short name, when they differ
const WORKSPACE_DEP_ALIASES = new Map([["blocks-shared", "shared"]]);

// Cache filtered package names for repeated lookups
const FILTERED_PACKAGES = new Set([
  "shadcn-ui",
  "typescript-config",
  "patterns",
]);
const FILTERED_DEPS = new Set([
  "react",
  "react-dom",
  "@repo/shadcn-ui",
  "@smoothui/data",
]);
const FILTERED_DEV_DEPS = new Set([
  "@repo/typescript-config",
  "@types/react",
  "@types/react-dom",
  "typescript",
]);

const getAllPackagePaths = async (
  baseDir: string,
  currentPath = ""
): Promise<string[]> => {
  const fullPath = join(baseDir, currentPath);
  const entries = await readdir(fullPath, { withFileTypes: true });

  const packagePaths: string[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const entryPath = join(currentPath, entry.name);
    const entryFullPath = join(baseDir, entryPath);

    // Check if this directory has a package.json
    try {
      const packageJsonPath = join(entryFullPath, "package.json");
      await stat(packageJsonPath);
      packagePaths.push(entryPath);
    } catch {
      // No package.json, recurse into subdirectories
      const subPackages = await getAllPackagePaths(baseDir, entryPath);
      packagePaths.push(...subPackages);
    }
  }

  return packagePaths;
};

export const getAllPackageNames = async (): Promise<string[]> => {
  const packagesDir = join(process.cwd(), "..", "..", "packages");
  const packageDirectories = await readdir(packagesDir, {
    withFileTypes: true,
  });

  // Get top-level packages
  const topLevelPackageNames = packageDirectories
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .filter((name) => !FILTERED_PACKAGES.has(name));

  // Get nested packages in smoothui
  const smoothuiPath = join(packagesDir, "smoothui");
  let smoothuiPackages: string[] = [];
  try {
    smoothuiPackages = await getAllPackagePaths(smoothuiPath);
  } catch {
    // smoothui directory might not exist
  }

  // Combine all package names
  return [
    ...topLevelPackageNames,
    ...smoothuiPackages.map((path) => join("smoothui", path)),
  ];
};

// Use React.cache() for per-request deduplication
export const getAllPackageNameMapping = cache(
  async (): Promise<Map<string, string>> => {
    const fullNames = await getAllPackageNames();
    const mapping = new Map<string, string>();

    for (const fullName of fullNames) {
      const shortName = fullName.split("/").at(-1) || fullName;
      mapping.set(shortName, fullName);
    }

    return mapping;
  }
);

// Use React.cache() for per-request deduplication
export const getPackage = cache(async (packageName: string) => {
  const packageDir = join(process.cwd(), "..", "..", "packages", packageName);
  const packagePath = join(packageDir, "package.json");
  const packageJson = JSON.parse(await readFile(packagePath, "utf-8"));

  // Extract the actual package name from the path (e.g., "ai-branch" from "smoothui/components/ai-branch")
  const packageNameParts = packageName.split("/");
  const actualPackageName = packageNameParts.at(-1) || packageName;

  // Use Set for O(1) lookups instead of array includes
  const deps = packageJson.dependencies || {};
  const smoothuiDependencies = Object.keys(deps).filter(
    (dep) => dep.startsWith("@repo") && dep !== "@repo/shadcn-ui"
  );
  const smoothuiDepsSet = new Set(smoothuiDependencies);

  const dependencies = Object.keys(deps).filter(
    (dep) => !(FILTERED_DEPS.has(dep) || smoothuiDepsSet.has(dep))
  );

  const devDeps = packageJson.devDependencies || {};
  const devDependencies = Object.keys(devDeps).filter(
    (dep) => !FILTERED_DEV_DEPS.has(dep)
  );

  const isData = packageName === "data";
  const isSharedLib = packageName === "smoothui/blocks/shared";
  const isBlock = packageName.startsWith("smoothui/blocks/") && !isSharedLib;

  const packageFiles = await readdir(packageDir, { withFileTypes: true });
  const sourceFiles = packageFiles.filter(
    (file) =>
      file.isFile() &&
      !file.name.includes(".config.") &&
      (file.name.endsWith(".tsx") ||
        (file.name.endsWith(".ts") && !file.name.endsWith(".d.ts")))
  );

  const cssFiles = packageFiles.filter(
    (file) => file.isFile() && file.name.endsWith(".css")
  );

  let fileType: RegistryItem["type"] = "registry:ui";
  if (isData || packageName === "smoothui/lib") {
    fileType = "registry:lib";
  } else if (isBlock) {
    fileType = "registry:block";
  } else if (isSharedLib) {
    fileType = "registry:component";
  }

  const files: RegistryItem["files"] = [];

  for (const file of sourceFiles) {
    const filePath = join(packageDir, file.name);
    const content = await readFile(filePath, "utf-8");

    files.push({
      type: fileType,
      path: file.name,
      content: rewriteWorkspaceImports(content),
      target: isData
        ? `lib/smoothui-data/${file.name}`
        : `components/smoothui/${actualPackageName}/${file.name}`,
    });
  }

  // Detect shadcn-ui dependencies from @/components/ui imports
  const shadcnDependencies =
    files
      .map((f) => f.content)
      .join("\n")
      .match(SHADCN_IMPORT_REGEX)
      ?.map((path) => path.split("/").pop())
      .filter((name): name is string => !!name) || [];

  // Detect relative imports to other smoothui components/blocks
  const allContent = files.map((f) => f.content).join("\n");
  const relativeMatches = Array.from(
    allContent.matchAll(RELATIVE_IMPORT_REGEX)
  );
  const relativeImports = relativeMatches
    .map((match) => match[1])
    .filter((name): name is string => !!name);

  const registryDependencies = new Set<string>(shadcnDependencies);

  // Add smoothui dependencies from package.json
  for (const dep of smoothuiDependencies) {
    const raw = dep.replace("@repo/", "");
    const pkg = WORKSPACE_DEP_ALIASES.get(raw) ?? raw;

    if (pkg !== actualPackageName) {
      registryDependencies.add(`${REGISTRY_URL}/${pkg}.json`);
    }
  }

  // Add relative imports as registry dependencies
  for (const relativeImport of relativeImports) {
    registryDependencies.add(`${REGISTRY_URL}/${relativeImport}.json`);
  }

  // Add cross-item imports detected in the rewritten content
  // (@/components/smoothui/<name> covers components and the shared barrel)
  for (const match of allContent.matchAll(SMOOTHUI_IMPORT_REGEX)) {
    const name = match[1];
    if (name && name !== actualPackageName) {
      registryDependencies.add(`${REGISTRY_URL}/${name}.json`);
    }
  }

  if (!isData && SMOOTHUI_DATA_IMPORT_REGEX.test(allContent)) {
    registryDependencies.add(`${REGISTRY_URL}/data.json`);
  }

  const css: RegistryItem["css"] = {};

  for (const file of cssFiles) {
    const contents = await readFile(join(packageDir, file.name), "utf-8");

    // Process CSS with PostCSS to handle nested selectors
    const processed = await postcss([postcssNested]).process(contents, {
      from: undefined,
    });

    // Parse the processed CSS and convert to JSON structure
    const ast = postcss.parse(processed.css);

    ast.walkAtRules("layer", (atRule) => {
      const layerName = `@layer ${atRule.params}`;
      css[layerName] = {};

      // First pass: process non-media rules
      atRule.walkRules((rule) => {
        // Skip rules that are inside media queries
        if (
          rule.parent &&
          rule.parent.type === "atrule" &&
          (rule.parent as AtRule).name === "media"
        ) {
          return;
        }

        const selector = rule.selector;
        const ruleObj: Record<string, string> = {};

        // Process all declarations
        rule.walkDecls((decl) => {
          ruleObj[decl.prop] = decl.value;
        });

        if (Object.keys(ruleObj).length > 0) {
          css[layerName][selector] = ruleObj;
        }
      });

      // Second pass: process media query rules as top-level entries
      atRule.walkAtRules("media", (mediaRule) => {
        const mediaQuery = `@media ${mediaRule.params}`;

        // Create a top-level media query entry if it doesn't exist
        if (!css[layerName][mediaQuery]) {
          css[layerName][mediaQuery] = {};
        }

        mediaRule.walkRules((rule) => {
          const selector = rule.selector;
          const mediaObj: Record<string, string> = {};

          rule.walkDecls((decl) => {
            mediaObj[decl.prop] = decl.value;
          });

          if (Object.keys(mediaObj).length > 0) {
            // Store the selector inside the media query
            css[layerName][mediaQuery][selector] = mediaObj;
          }
        });
      });
    });
  }

  let type: RegistryItem["type"] = fileType;

  if (!files.length && Object.keys(css).length) {
    type = "registry:style";
  }

  const response: RegistryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: actualPackageName,
    type,
    title: toTitleCase(actualPackageName),
    description: packageJson.description,
    author: "Eduardo Calvo <educlopez93@gmail.com>",
    dependencies,
    devDependencies,
    registryDependencies: Array.from(registryDependencies),
    files,
    css,
  };

  return response;
});
