// @ts-ignore
const fs = require("fs")
// @ts-ignore
const path = require("path")

// @ts-ignore
const baseDir = path.join(__dirname, "..", "..")
console.log("baseDir", baseDir)
const registryJsonPath = path.join(baseDir, "public", "index.json")

// Single output directory for all registry items
const registryOutputDir = path.join(baseDir, "public/r")

// Ensure output directory exists
if (!fs.existsSync(registryOutputDir)) {
  fs.mkdirSync(registryOutputDir, { recursive: true })
}

function getSourceContent(filePath: string): string {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`File does not exist: ${filePath}`)
      return ""
    }
    return fs.readFileSync(filePath, "utf-8")
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error)
    return ""
  }
}

function kebabToPascalCase(kebab: string): string {
  return kebab
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("")
}

function getSourceFilePath(file: any, baseDir: string): string {
  let sourceFilePath = ""

  if (file.type === "registry:ui") {
    const componentPath = file.path.replace("smoothui/", "")
    const pascalCaseName = kebabToPascalCase(componentPath)
    sourceFilePath = path.join(
      baseDir,
      "src",
      "components",
      "smoothui",
      "ui",
      `${pascalCaseName}.tsx`
    )
  } else if (file.type === "registry:block") {
    const examplePath = file.path.replace("examples/", "")
    const pascalCaseName = kebabToPascalCase(examplePath)
    sourceFilePath = path.join(
      baseDir,
      "src",
      "components",
      "smoothui",
      "examples",
      `${pascalCaseName}.tsx`
    )
  } else if (file.type === "registry:hook") {
    const hookPath = file.path.replace("hooks/", "")
    // For hooks, keep the original case as they might be different
    sourceFilePath = path.join(
      baseDir,
      "src",
      "components",
      "smoothui",
      "hooks",
      `${hookPath}.tsx`
    )
  } else if (file.type === "registry:lib") {
    const utilPath = file.path.replace("utils/", "")
    sourceFilePath = path.join(
      baseDir,
      "src",
      "components",
      "smoothui",
      "utils",
      `${utilPath}.ts`
    )
  }

  return sourceFilePath
}

function processRegistryItem(name: string, item: any) {
  const output: any = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name,
    type: item.type,
    dependencies: item.dependencies || [],
    files: [],
  }

  // Check if any files import the cn utility
  let needsCnUtility = false
  item.files.forEach((file: any) => {
    const sourceFilePath = getSourceFilePath(file, baseDir)
    if (sourceFilePath) {
      const content = getSourceContent(sourceFilePath)
      if (
        content &&
        (content.includes('import { cn } from "../utils/cn"') ||
          content.includes(
            'import { cn } from "@/components/smoothui/utils/cn"'
          ) ||
          content.includes('import { cn } from "../../utils/cn"'))
      ) {
        needsCnUtility = true
      }
    }
  })

  // Add cn utility dependencies if needed
  if (needsCnUtility) {
    // Add clsx and tailwind-merge to dependencies
    if (!output.dependencies.includes("clsx")) {
      output.dependencies.push("clsx")
    }
    if (!output.dependencies.includes("tailwind-merge")) {
      output.dependencies.push("tailwind-merge")
    }

    // Add the cn utility file
    const cnContent = getSourceContent(
      path.join(baseDir, "src", "components", "smoothui", "utils", "cn.ts")
    )
    if (cnContent) {
      output.files.push({
        path: "utils/cn.ts",
        content: cnContent,
        type: "registry:lib",
        target: "lib/utils/cn.ts",
      })
    }
  }

  // Add registry dependencies with namespace format if they exist
  if (item.registryDependencies && item.registryDependencies.length > 0) {
    output.registryDependencies = item.registryDependencies.map(
      (dep: string) => {
        // Convert old format to new namespace format
        const depName = dep.split("/").pop()
        return `@smoothui/${depName}`
      }
    )
  }

  // Add devDependencies if they exist
  if (item.devDependencies) {
    output.devDependencies = item.devDependencies
  }

  // Add tailwind config if it exists
  if (item.tailwind && Object.keys(item.tailwind.config || {}).length > 0) {
    output.tailwind = item.tailwind
  }

  // Process each file in the registry item
  item.files.forEach((file: any) => {
    let sourceFilePath: string = ""

    // Skip files from _helpers folder
    if (file.path.includes("_helpers")) {
      return
    }

    // Get the file name without prefix
    const fileName = file.path.split("/").pop()

    // Determine target path based on file type
    let targetPath = ""
    if (file.type === "registry:ui") {
      const componentPath = file.path.replace("smoothui/", "")
      const pascalCaseName = kebabToPascalCase(componentPath)
      console.log("componentPath", componentPath)
      sourceFilePath = path.join(
        baseDir,
        "src",
        "components",
        "smoothui",
        "ui",
        `${pascalCaseName}.tsx`
      )
      targetPath = `components/smoothui/ui/${fileName}.tsx`
    } else if (file.type === "registry:block") {
      const examplePath = file.path.replace("examples/", "")
      const pascalCaseName = kebabToPascalCase(examplePath)
      sourceFilePath = path.join(
        baseDir,
        "src",
        "components",
        "smoothui",
        "examples",
        `${pascalCaseName}.tsx`
      )
      targetPath = `components/smoothui/examples/${fileName}.tsx`
    } else if (file.type === "registry:hook") {
      const hookPath = file.path.replace("hooks/", "")
      sourceFilePath = path.join(
        baseDir,
        "src",
        "components",
        "smoothui",
        "hooks",
        `${hookPath}.tsx`
      )
      targetPath = `hooks/${fileName}.ts`
    } else if (file.type === "registry:lib") {
      const utilPath = file.path.replace("utils/", "")
      sourceFilePath = path.join(
        baseDir,
        "src",
        "components",
        "smoothui",
        "utils",
        `${utilPath}.ts`
      )
      targetPath = `lib/utils/${fileName}.ts`
    }

    if (sourceFilePath !== "") {
      const content = getSourceContent(sourceFilePath)
      if (content) {
        // Generate safe file path without leading slash
        const safePath = file.path.startsWith("/")
          ? file.path.slice(1)
          : file.path
        const pathWithExt =
          file.type === "registry:ui" || file.type === "registry:block"
            ? `${safePath}.tsx`
            : `${safePath}.ts`

        // Fix import paths for cn utility
        let processedContent = content
        if (needsCnUtility && file.type === "registry:ui") {
          // Replace various cn import paths with the absolute path using @/lib/utils alias
          processedContent = processedContent
            .replace(
              /import { cn } from "\.\.\/utils\/cn"/g,
              'import { cn } from "@/lib/utils/cn"'
            )
            .replace(
              /import { cn } from "@\/components\/smoothui\/utils\/cn"/g,
              'import { cn } from "@/lib/utils/cn"'
            )
            .replace(
              /import { cn } from "\.\.\/\.\.\/utils\/cn"/g,
              'import { cn } from "@/lib/utils/cn"'
            )
        }

        output.files.push({
          path: pathWithExt,
          content: processedContent,
          type: file.type,
          target: targetPath,
        })
      }
    }
  })

  return output
}

function extractCssVars(css: string, selector: string): Record<string, string> {
  // Extracts CSS variables from a block like :root or .dark
  const regex = new RegExp(`${selector}\\s*{([\\s\\S]*?)}\\s*`, "m")
  const match = css.match(regex)
  if (!match) return {}
  const vars: Record<string, string> = {}
  const lines = match[1].split("\n")
  for (const line of lines) {
    const varMatch = line.match(/--([\w-]+):\s*([^;]+);/)
    if (varMatch) {
      vars[varMatch[1]] = varMatch[2].trim()
    }
  }
  return vars
}

function buildThemeRegistryItem() {
  const cssPath = path.join(__dirname, "..", "app", "styles", "smoothui.css")
  const css = fs.readFileSync(cssPath, "utf-8")
  const lightVars = extractCssVars(css, ":root")
  const darkVars = extractCssVars(css, ".dark")
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "custom-theme",
    type: "registry:theme",
    cssVars: {
      light: lightVars,
      dark: darkVars,
    },
  }
}

function buildSourceFiles() {
  // Read the registry
  const registry = JSON.parse(fs.readFileSync(registryJsonPath, "utf-8"))

  // Process each item in the registry
  Object.entries(registry).forEach(([name, item]: [string, any]) => {
    const sourceFile = processRegistryItem(name, item)

    // Write all items to the registry directory
    const outputPath = path.join(registryOutputDir, `${name}.json`)
    fs.writeFileSync(outputPath, JSON.stringify(sourceFile, null, 2))
    console.log(`Generated source file for: ${name}`)
  })

  // Add custom theme registry item
  const themeItem = buildThemeRegistryItem()
  const themeOutputPath = path.join(registryOutputDir, "custom-theme.json")
  fs.writeFileSync(themeOutputPath, JSON.stringify(themeItem, null, 2))
  console.log("Generated custom theme registry file.")

  console.log("Source files generation completed.")
}

buildSourceFiles()
