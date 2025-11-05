import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import postcss, { type AtRule } from "postcss";
import postcssNested from "postcss-nested";
import type { RegistryItem } from "shadcn/schema";

// Regex patterns for detecting imports
const SHADCN_IMPORT_REGEX = /@\/components\/ui\/([a-z-]+)/g;
const RELATIVE_IMPORT_REGEX = /from\s+["']\.\.\/([a-z-]+)["']/g;

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
    .filter(
      (name) => !["shadcn-ui", "typescript-config", "patterns"].includes(name)
    );

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

export const getAllPackageNameMapping = async (): Promise<
  Map<string, string>
> => {
  const fullNames = await getAllPackageNames();
  const mapping = new Map<string, string>();

  for (const fullName of fullNames) {
    const shortName = fullName.split("/").at(-1) || fullName;
    mapping.set(shortName, fullName);
  }

  return mapping;
};

export const getPackage = async (packageName: string) => {
  const packageDir = join(process.cwd(), "..", "..", "packages", packageName);
  const packagePath = join(packageDir, "package.json");
  const packageJson = JSON.parse(await readFile(packagePath, "utf-8"));

  // Extract the actual package name from the path (e.g., "ai-branch" from "smoothui/components/ai-branch")
  const packageNameParts = packageName.split("/");
  const actualPackageName = packageNameParts.at(-1) || packageName;

  const smoothuiDependencies = Object.keys(
    packageJson.dependencies || {}
  ).filter((dep) => dep.startsWith("@repo") && dep !== "@repo/shadcn-ui");

  const dependencies = Object.keys(packageJson.dependencies || {}).filter(
    (dep) =>
      ![
        "react",
        "react-dom",
        "@repo/shadcn-ui",
        ...smoothuiDependencies,
      ].includes(dep)
  );

  const devDependencies = Object.keys(packageJson.devDependencies || {}).filter(
    (dep) =>
      ![
        "@repo/typescript-config",
        "@types/react",
        "@types/react-dom",
        "typescript",
      ].includes(dep)
  );

  const packageFiles = await readdir(packageDir, { withFileTypes: true });
  const tsxFiles = packageFiles.filter(
    (file) => file.isFile() && file.name.endsWith(".tsx")
  );

  const cssFiles = packageFiles.filter(
    (file) => file.isFile() && file.name.endsWith(".css")
  );

  const files: RegistryItem["files"] = [];

  for (const file of tsxFiles) {
    const filePath = join(packageDir, file.name);
    const content = await readFile(filePath, "utf-8");

    files.push({
      type: "registry:ui",
      path: file.name,
      content,
      target: `components/smoothui/${actualPackageName}/${file.name}`,
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

  const registryDependencies = [...shadcnDependencies];

  // Add smoothui dependencies from package.json
  for (const dep of smoothuiDependencies) {
    const pkg = dep.replace("@repo/", "");

    registryDependencies.push(`https://smoothui.dev/r/${pkg}.json`);
  }

  // Add relative imports as registry dependencies
  for (const relativeImport of relativeImports) {
    registryDependencies.push(`https://smoothui.dev/r/${relativeImport}.json`);
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

  let type: RegistryItem["type"] = "registry:ui";

  if (!Object.keys(files).length && Object.keys(css).length) {
    type = "registry:style";
  }

  const response: RegistryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: actualPackageName,
    type,
    title: actualPackageName,
    description: packageJson.description,
    author: "Eduardo Calvo <educlopez93@gmail.com>",
    dependencies,
    devDependencies,
    registryDependencies,
    files,
    css,
  };

  return response;
};
