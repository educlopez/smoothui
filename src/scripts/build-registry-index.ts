// @ts-ignore
const fs = require("fs")
// @ts-ignore
const path = require("path")

// @ts-ignore
const baseDir = path.join(__dirname, "..", "components", "smoothui")
const componentsDir = path.join(baseDir, "ui")
const examplesDir = path.join(baseDir, "examples")
const hooksDir = path.join(baseDir, "hooks")
const utilsDir = path.join(baseDir, "utils")

type RegistryType =
  | "registry:ui"
  | "registry:block"
  | "registry:hook"
  | "registry:lib"

interface RegistryFile {
  path: string
  type: RegistryType
}

interface RegistryItem {
  name: string
  type: RegistryType
  files: RegistryFile[]
  registryDependencies?: string[]
  dependencies?: string[]
  component?: string
  devDependencies?: string[]
  tailwind?: string
}

function findHookImports(sourceCode: string): string[] {
  // This will match lines such as:
  //   import useDetectBrowser from "@/hooks/use-detect-browser"
  //   import { useScreenSize } from "@/hooks/use-screen-size"
  //   import useDebounce, { useSomethingElse } from "@/hooks/use-debounce"
  const hookImportRegex = /import\s+[^'"]+\s+from\s+['"]@\/hooks\/([^'"]+)['"]/g
  const hooks: string[] = []
  let match

  while ((match = hookImportRegex.exec(sourceCode)) !== null) {
    // e.g. "use-detect-browser" from "@/hooks/use-detect-browser"
    const hookName = match[1].replace(/\.(ts|tsx)$/, "")
    hooks.push(hookName)
  }

  return hooks
}

function findComponentImports(sourceCode: string): string[] {
  // Match static imports from @/components/smoothui/ui or @/components/smoothui/examples
  const componentImportRegex =
    /import\s+([^'"]+?)\s+from\s+['"]@\/components\/smoothui\/(ui|examples)\/([^'"]+)['"]/g
  const components: string[] = []
  let match

  while ((match = componentImportRegex.exec(sourceCode)) !== null) {
    const [_, importStatement, type, componentPath] = match

    // Handle the path for all imports from this line
    const basePath = componentPath
      .replace(/\.(ts|tsx)$/, "")
      .replace(/([A-Z])/g, "-$1")
      .toLowerCase()
      .replace(/^-/, "")

    // Add the path once
    components.push(`smoothui/${basePath}`)
  }

  // Collect dynamic imports as well
  components.push(...findDynamicComponentImports(sourceCode))

  // Remove duplicates
  return Array.from(new Set(components))
}

// ---------------------------------------------------------------------------

function findDynamicComponentImports(sourceCode: string): string[] {
  const dynamicImportRegex =
    /dynamic\(\s*\(\)\s*=>\s*import\(\s*['"]@\/components\/smoothui\/(ui|examples)\/([^'"]+)['"]\s*\)/g
  const dynComponents: string[] = []
  let match

  while ((match = dynamicImportRegex.exec(sourceCode)) !== null) {
    const [_, type, componentPath] = match
    const componentName = componentPath
      .replace(/\.(ts|tsx)$/, "")
      .replace(/([A-Z])/g, "-$1")
      .toLowerCase()
      .replace(/^-/, "")
    dynComponents.push(`smoothui/${componentName}`)
  }

  return dynComponents
}

// ---------------------------------------------------------------------------

function findExternalDependencies(sourceCode: string): string[] {
  // Match all imports that:
  // - Don't start with react or next (ignore react, react-dom, next, etc)
  // - Don't start with ./ or ../
  // - Include @radix-ui imports
  const externalImportRegex =
    /from\s+['"](@radix-ui\/[^'"]+|[^'"@\./][^'"]+)['"]/g
  const dependencies = new Set<string>()
  let match

  while ((match = externalImportRegex.exec(sourceCode)) !== null) {
    const [_, importPath] = match
    // Get the package name (everything before any / character)
    const packageName = importPath.split("/").slice(0, 2).join("/")
    console.log("importPath", importPath) // Log the full import path
    console.log("packageName", packageName) // Log the package name
    // Skip react-related and next-related packages
    if (!packageName.startsWith("react") && !packageName.startsWith("next")) {
      dependencies.add(importPath) // Add the full import path
    }
  }

  return Array.from(dependencies)
}

function findUtilImports(sourceCode: string): string[] {
  // Match imports from @/utils/
  const utilImportRegex =
    /import\s+{?[^}]*}?\s+from\s+['"]@\/utils\/([^'"]+)['"]/g
  const utils: string[] = []
  let match

  while ((match = utilImportRegex.exec(sourceCode)) !== null) {
    const utilPath = match[1].replace(/\.(ts|tsx)$/, "")
    utils.push(utilPath)
  }

  return utils
}

function getAdditionalConfig(filePath: string): any {
  const dir = path.dirname(filePath)
  const baseName = path.basename(filePath, path.extname(filePath))
  const configPath = path.join(dir, `${baseName}.json`)

  if (fs.existsSync(configPath)) {
    try {
      return JSON.parse(fs.readFileSync(configPath, "utf-8"))
    } catch (error) {
      console.warn(`Error reading config for ${baseName}:`, error)
    }
  }
  return null
}

function generateRegistryItem(
  filePath: string,
  type: "ui" | "example" | "hook" | "util",
  allHooks: Record<string, string>
  // @ts-ignore
): RegistryItem | null {
  // Get the relative path from the components or examples directory
  const baseDirectory =
    type === "hook"
      ? hooksDir
      : type === "example"
        ? examplesDir
        : componentsDir

  const relativePath = path.relative(baseDirectory, filePath)
  const sourceCode = fs.readFileSync(filePath, "utf-8")

  const name = path
    .basename(filePath, path.extname(filePath))
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase()
    .replace(/^-/, "")

  // Construct the import path with the correct directory structure
  const basePath =
    type === "hook"
      ? "@/hooks/"
      : type === "example"
        ? "@/components/smoothui/examples/"
        : "@/components/smoothui/ui/"
  const importPath = `${basePath}${relativePath}`.replace(/\\/g, "/")
  const importPathWithoutExt = importPath.replace(/\.tsx?$/, "")

  const getSimplifiedPath = (
    originalPath: string,
    itemType: "ui" | "example" | "hook" | "util"
  ) => {
    // Get the relative path from the base directory
    const relativePath = path
      .relative(
        itemType === "hook"
          ? hooksDir
          : itemType === "example"
            ? examplesDir
            : itemType === "util"
              ? utilsDir
              : componentsDir,
        originalPath
      )
      .replace(/\\/g, "/")

    // Remove the file extension
    const pathWithoutExt = relativePath.replace(/\.(ts|tsx)$/, "")

    switch (itemType) {
      case "hook":
        return `hooks/${pathWithoutExt}`
      case "example":
        return `examples/${pathWithoutExt}`
      case "ui":
        return `smoothui/${pathWithoutExt}`
      case "util":
        return `utils/${pathWithoutExt}`
    }
  }

  const files: RegistryFile[] = [
    {
      path: getSimplifiedPath(filePath, type),
      type:
        type === "hook"
          ? "registry:hook"
          : type === "example"
            ? "registry:block"
            : type === "util"
              ? "registry:lib"
              : "registry:ui",
    },
  ]

  // ADD the discovered hooks
  if (type !== "hook") {
    // Now we capture all the hooks we find (including default imports)
    const usedHooks = findHookImports(sourceCode)
    usedHooks.forEach((hookName) => {
      files.push({
        path: `hooks/${hookName}`,
        type: "registry:hook",
      })
    })
  }

  // Find component dependencies
  const componentDeps = findComponentImports(sourceCode)
  const externalDeps = new Set(findExternalDependencies(sourceCode))

  // If this is an example (demo), add the original component files to the files array
  if (type === "example" && componentDeps.length > 0) {
    componentDeps.forEach((dep) => {
      // Only add if not already present in files
      if (!files.some((f) => f.path === dep)) {
        files.push({
          path: dep,
          type: "registry:ui",
        })
      }
    })
  }

  // Patch: Replace 'motion/react' with 'motion' in dependencies
  if (externalDeps.has("motion/react")) {
    externalDeps.delete("motion/react")
    externalDeps.add("motion")
  }

  // Handle utils dependencies
  const utilDeps = findUtilImports(sourceCode)
  if (utilDeps.length > 0) {
    // Add utils to files
    utilDeps.forEach((utilPath) => {
      files.push({
        path: `utils/${utilPath}`,
        type: "registry:lib",
      })

      // Add dependencies from utils
      const utilFilePath = path.join(utilsDir, `${utilPath}.ts`)
      if (fs.existsSync(utilFilePath)) {
        const utilCode = fs.readFileSync(utilFilePath, "utf-8")
        const utilExternalDeps = findExternalDependencies(utilCode)
        utilExternalDeps.forEach((dep) => externalDeps.add(dep))
      }
    })
  }

  // If this is not a hook, add dependencies from hook dependencies
  if (type !== "hook") {
    const usedHooks = findHookImports(sourceCode)
    usedHooks.forEach((hookName) => {
      const hookPath = path.join(hooksDir, `${hookName}.ts`)
      if (fs.existsSync(hookPath)) {
        const hookCode = fs.readFileSync(hookPath, "utf-8")
        const hookDeps = findExternalDependencies(hookCode)
        hookDeps.forEach((dep) => externalDeps.add(dep))
      }
    })
  }

  const additionalConfig = getAdditionalConfig(filePath)

  // Add additional dependencies if they exist
  if (additionalConfig?.additionalDependencies) {
    additionalConfig.additionalDependencies.forEach((dep: string) => {
      externalDeps.add(dep)
    })
  }

  const item: RegistryItem = {
    name,
    type:
      type === "hook"
        ? "registry:hook"
        : type === "example"
          ? "registry:block"
          : type === "util"
            ? "registry:lib"
            : "registry:ui",
    files,
    ...(componentDeps.length > 0 && {
      registryDependencies: componentDeps,
    }),
    ...(externalDeps.size > 0 || additionalConfig?.devDependencies
      ? {
          dependencies: [
            ...Array.from(externalDeps),
            ...(additionalConfig?.devDependencies || []),
          ],
        }
      : null),
    ...(additionalConfig?.tailwind && {
      tailwind: additionalConfig.tailwind,
    }),
    ...(type !== "hook" &&
      type !== "util" && {
        component: `React.lazy(\n      () => import('${importPathWithoutExt}') \n)`,
      }),
  }

  return item
}

function buildHooksMap(): Record<string, string> {
  const hooksMap: Record<string, string> = {}

  function traverseHooks(dir: string) {
    const files = fs.readdirSync(dir)

    files.forEach((file: any) => {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)

      if (stat.isDirectory()) {
        traverseHooks(filePath)
      } else if (file.match(/\.(ts|tsx)$/)) {
        const hookName = path.basename(file, path.extname(file))
        hooksMap[hookName] = `hooks/${hookName}` // Simplified hook path
      }
    })
  }

  traverseHooks(hooksDir)
  return hooksMap
}

const hooksMap = buildHooksMap()

function traverseDirectory(
  dir: string,
  type: "ui" | "example" | "hook" | "util"
): Record<string, RegistryItem> {
  const registry: Record<string, RegistryItem> = {}

  function traverse(currentDir: string) {
    const files = fs.readdirSync(currentDir)

    files.forEach((file: string) => {
      const filePath = path.join(currentDir, file)
      const stat = fs.statSync(filePath)

      // Skip _helpers folder in utils
      if (type === "util" && file === "_helpers") {
        return
      }

      if (stat.isDirectory()) {
        traverse(filePath)
      } else if (file.match(/\.(tsx|ts)$/)) {
        const item = generateRegistryItem(filePath, type, hooksMap)
        if (item) {
          registry[item.name] = item
        }
      }
    })
  }

  traverse(dir)
  return registry
}

// Generate both registries
const smoothui = traverseDirectory(componentsDir, "ui")
const example = traverseDirectory(examplesDir, "example")
const hooks = traverseDirectory(hooksDir, "hook")
const utils = traverseDirectory(utilsDir, "util")

// Generate the final index.ts content
const content = `import * as React from "react";
import { Registry } from "@/app/doc/schema";

// This file is generated automatically. Do not edit it manually.

const smoothui: Registry = ${JSON.stringify(smoothui, null, 2)};

const example: Registry = ${JSON.stringify(example, null, 2)};

const hooks: Registry = ${JSON.stringify(hooks, null, 2)};

const utils: Registry = ${JSON.stringify(utils, null, 2)};

export const registry = {
  ...smoothui,
  ...example,
  ...hooks,
  ...utils,
};
`

// Replace double quotes with single quotes and fix the React.lazy imports
const formattedContent = content
  .replace(/"component": "(.*?)"/g, "component: $1")
  .replace(/\\n/g, "\n")
  .replace(/\s+\)/g, ")")
  .replace(/"\{/g, "{")
  .replace(/\}"/g, "}")
  .replace(/\\"/g, '"')

// Write the file
fs.writeFileSync(path.join(baseDir, "index.ts"), formattedContent)
console.log("Registry file generated successfully!")

// Create a clean version of the registry for JSON
function createCleanRegistry(registry: any) {
  const cleanRegistry = { ...registry }

  // Remove React.lazy components from all entries
  Object.values(cleanRegistry).forEach((item: any) => {
    if (item.component) {
      delete item.component
    }
  })

  return cleanRegistry
}

// Generate and write the index.json file
const cleanRegistry = {
  ...createCleanRegistry(smoothui),
  ...createCleanRegistry(example),
  ...createCleanRegistry(hooks),
  ...createCleanRegistry(utils),
}

const jsonOutputDir = path.join(__dirname, "..", "..", "public")
if (!fs.existsSync(jsonOutputDir)) {
  fs.mkdirSync(jsonOutputDir, { recursive: true })
}

fs.writeFileSync(
  path.join(jsonOutputDir, "index.json"),
  JSON.stringify(cleanRegistry, null, 2)
)

console.log("Registry files generated successfully!")
