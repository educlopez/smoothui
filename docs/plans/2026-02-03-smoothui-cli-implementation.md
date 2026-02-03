# SmoothUI CLI Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a standalone CLI (`npx smoothui add`) that installs SmoothUI components without requiring shadcn.

**Architecture:** Node.js CLI using @clack/prompts for UI, custom search-multiselect for interactive mode, fetches from existing registry API at smoothui.dev/r/.

**Tech Stack:** TypeScript, @clack/prompts, picocolors, Node.js built-in fetch (Node 18+)

**Design Doc:** `docs/plans/2026-02-03-smoothui-cli-design.md`

---

## Task 1: Project Setup & Dependencies

**Files:**
- Modify: `package.json`
- Modify: `tsup.config.ts`

**Step 1: Add CLI dependencies**

Add to `package.json` dependencies:
```json
{
  "dependencies": {
    "@clack/prompts": "^0.11.0",
    "picocolors": "^1.1.1"
  }
}
```

**Step 2: Update tsup config for multiple entry points**

Modify `tsup.config.ts`:
```typescript
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["scripts/index.ts"],
  outDir: "dist",
  sourcemap: false,
  minify: true,
  dts: true,
  format: ["esm"],
  target: "node18",
  banner: {
    js: "#!/usr/bin/env node",
  },
});
```

**Step 3: Install dependencies**

Run: `pnpm install`

**Step 4: Commit**

```bash
git add package.json tsup.config.ts pnpm-lock.yaml
git commit -m "chore: add CLI dependencies"
```

---

## Task 2: Types & Constants

**Files:**
- Create: `scripts/types.ts`
- Create: `scripts/constants.ts`

**Step 1: Create types file**

Create `scripts/types.ts`:
```typescript
export interface RegistryFile {
  path: string;
  content: string;
  type: "registry:ui" | "registry:style";
  target?: string;
}

export interface RegistryItem {
  $schema?: string;
  name: string;
  type: "registry:ui" | "registry:style";
  title?: string;
  description?: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  files: RegistryFile[];
  css?: Record<string, string>;
}

export interface Registry {
  name: string;
  homepage: string;
  items: RegistryItem[];
}

export interface TreeNode {
  component: RegistryItem;
  children: TreeNode[];
}

export interface ProjectConfig {
  componentPath: string;
  alias: string;
  packageManager: "npm" | "pnpm" | "yarn" | "bun";
}

export interface Category {
  name: string;
  components: string[];
}
```

**Step 2: Create constants file**

Create `scripts/constants.ts`:
```typescript
export const REGISTRY_URL = "https://smoothui.dev";

export const CATEGORIES: Record<string, string[]> = {
  "Basic UI": [
    "accordion",
    "animated-input",
    "animated-progress-bar",
    "animated-tabs",
    "animated-toggle",
    "basic-dropdown",
    "basic-modal",
    "basic-toast",
    "notification-badge",
    "searchable-dropdown",
    "skeleton-loader",
    "tweet-card",
  ],
  "Buttons": [
    "button-copy",
    "clip-corners-button",
    "dot-morph-button",
    "magnetic-button",
  ],
  "Text Effects": [
    "wave-text",
    "reveal-text",
    "typewriter-text",
    "scramble-hover",
    "scroll-reveal-paragraph",
  ],
  "AI": [
    "ai-branch",
    "ai-input",
  ],
  "Cards & Layouts": [
    "expandable-cards",
    "glow-hover-card",
    "scrollable-card-stack",
    "switchboard-card",
    "phototab",
    "job-listing-component",
  ],
  "Loaders & Effects": [
    "grid-loader",
    "siri-orb",
    "cursor-follow",
    "github-stars-animation",
  ],
  "Interactive": [
    "animated-o-t-p-input",
    "animated-tags",
    "app-download-stack",
    "apple-invites",
    "contribution-graph",
    "dynamic-island",
    "figma-comment",
    "image-metadata-preview",
    "infinite-slider",
    "interactive-image-selector",
    "number-flow",
    "power-off-slide",
    "price-flow",
    "rich-popover",
    "reviews-carousel",
    "social-selector",
    "user-account-avatar",
  ],
};

export const PATH_PATTERNS = [
  "src/components/ui",
  "components/ui",
  "src/components",
  "components",
  "app/components/ui",
];

export const LOCKFILES: { file: string; cmd: "bun" | "pnpm" | "yarn" | "npm" }[] = [
  { file: "bun.lockb", cmd: "bun" },
  { file: "pnpm-lock.yaml", cmd: "pnpm" },
  { file: "yarn.lock", cmd: "yarn" },
  { file: "package-lock.json", cmd: "npm" },
];

export const SYMBOLS = {
  active: "◆",
  done: "◇",
  selected: "●",
  unselected: "○",
  cursor: "❯",
  success: "✓",
  error: "✗",
  bar: "│",
} as const;
```

**Step 3: Commit**

```bash
git add scripts/types.ts scripts/constants.ts
git commit -m "feat(cli): add types and constants"
```

---

## Task 3: Color Utilities

**Files:**
- Create: `scripts/utils/colors.ts`

**Step 1: Create colors utility**

Create `scripts/utils/colors.ts`:
```typescript
import pc from "picocolors";
import { SYMBOLS } from "../constants.js";

export const S = SYMBOLS;

export const dim = pc.dim;
export const cyan = pc.cyan;
export const green = pc.green;
export const red = pc.red;
export const yellow = pc.yellow;
export const bold = pc.bold;
export const gray = pc.gray;

export function step(symbol: string, message: string): void {
  console.log(`${symbol}  ${message}`);
}

export function active(message: string): void {
  step(cyan(S.active), message);
}

export function done(message: string): void {
  step(dim(S.done), message);
}

export function success(message: string): void {
  step(green(S.success), message);
}

export function error(message: string): void {
  step(red(S.error), message);
}

export function bar(message = ""): void {
  console.log(`${dim(S.bar)}  ${message}`);
}

export function header(): void {
  console.log();
  active(bold("SmoothUI"));
  console.log();
}
```

**Step 2: Commit**

```bash
git add scripts/utils/colors.ts
git commit -m "feat(cli): add color utilities"
```

---

## Task 4: Detection Utilities

**Files:**
- Create: `scripts/utils/detect.ts`

**Step 1: Create detection utility**

Create `scripts/utils/detect.ts`:
```typescript
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { LOCKFILES, PATH_PATTERNS } from "../constants.js";
import type { ProjectConfig } from "../types.js";

export function detectPackageManager(): ProjectConfig["packageManager"] {
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
        const match = pkg.packageManager.match(/^(npm|pnpm|yarn|bun)@/);
        if (match) {
          return match[1] as ProjectConfig["packageManager"];
        }
      }
    } catch {
      // ignore parse errors
    }
  }

  return "npm";
}

export function detectComponentPath(): string | null {
  const cwd = process.cwd();

  for (const pattern of PATH_PATTERNS) {
    if (existsSync(join(cwd, pattern))) {
      return pattern;
    }
  }

  return null;
}

export function detectAlias(): string {
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
}

export function detectConfig(): ProjectConfig {
  return {
    componentPath: detectComponentPath() || "components/ui",
    alias: detectAlias(),
    packageManager: detectPackageManager(),
  };
}
```

**Step 2: Commit**

```bash
git add scripts/utils/detect.ts
git commit -m "feat(cli): add project detection utilities"
```

---

## Task 5: Registry Utilities

**Files:**
- Create: `scripts/utils/registry.ts`

**Step 1: Create registry utility**

Create `scripts/utils/registry.ts`:
```typescript
import { REGISTRY_URL } from "../constants.js";
import type { Registry, RegistryItem } from "../types.js";

const registryUrl = process.env.SMOOTHUI_REGISTRY_URL || REGISTRY_URL;

export async function fetchRegistry(): Promise<Registry> {
  const url = `${registryUrl}/r/registry.json`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch registry: ${response.status}`);
  }

  return response.json();
}

export async function fetchComponent(name: string): Promise<RegistryItem> {
  const url = `${registryUrl}/r/${name}.json`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Component "${name}" not found`);
  }

  return response.json();
}

export function extractNameFromUrl(url: string): string {
  // Extract "animated-border" from "https://smoothui.dev/r/animated-border.json"
  const match = url.match(/\/r\/([^/]+)\.json$/);
  return match ? match[1] : url;
}

export async function getAvailableComponents(): Promise<string[]> {
  const registry = await fetchRegistry();
  return registry.items.map((item) => item.name);
}
```

**Step 2: Commit**

```bash
git add scripts/utils/registry.ts
git commit -m "feat(cli): add registry utilities"
```

---

## Task 6: Dependency Tree Utilities

**Files:**
- Create: `scripts/utils/tree.ts`

**Step 1: Create tree utility**

Create `scripts/utils/tree.ts`:
```typescript
import type { RegistryItem, TreeNode } from "../types.js";
import { extractNameFromUrl, fetchComponent } from "./registry.js";
import { bar, dim, gray } from "./colors.js";

export async function resolveTree(
  name: string,
  resolved: Set<string> = new Set()
): Promise<TreeNode> {
  const component = await fetchComponent(name);
  resolved.add(name);

  const children: TreeNode[] = [];

  if (component.registryDependencies) {
    for (const depUrl of component.registryDependencies) {
      const depName = extractNameFromUrl(depUrl);

      // Skip if already resolved (avoid circular deps)
      if (resolved.has(depName)) {
        continue;
      }

      // Skip shadcn dependencies (they use ui.shadcn.com URLs)
      if (!depUrl.includes("smoothui.dev")) {
        continue;
      }

      const childNode = await resolveTree(depName, resolved);
      children.push(childNode);
    }
  }

  return { component, children };
}

export function flattenTree(node: TreeNode): RegistryItem[] {
  const items: RegistryItem[] = [node.component];

  for (const child of node.children) {
    items.push(...flattenTree(child));
  }

  return items;
}

export function collectNpmDeps(items: RegistryItem[]): {
  dependencies: string[];
  devDependencies: string[];
} {
  const deps = new Set<string>();
  const devDeps = new Set<string>();

  // Filter out common packages that users likely already have
  const skipDeps = new Set([
    "react",
    "react-dom",
    "next",
    "tailwindcss",
    "@types/react",
    "@types/react-dom",
    "@types/node",
    "typescript",
  ]);

  for (const item of items) {
    for (const dep of item.dependencies || []) {
      if (!skipDeps.has(dep)) {
        deps.add(dep);
      }
    }
    for (const dep of item.devDependencies || []) {
      if (!skipDeps.has(dep)) {
        devDeps.add(dep);
      }
    }
  }

  return {
    dependencies: [...deps],
    devDependencies: [...devDeps],
  };
}

export function printTree(node: TreeNode, prefix = "", isLast = true): void {
  const connector = isLast ? "└─" : "├─";
  bar(`${prefix}${connector} ${node.component.name}`);

  const newPrefix = prefix + (isLast ? "   " : "│  ");

  // Print npm dependencies
  const deps = [
    ...(node.component.dependencies || []),
  ].filter((d) => !["react", "react-dom", "next"].includes(d));

  if (deps.length > 0 && node.children.length === 0) {
    bar(`${newPrefix}└─ ${gray(`npm: ${deps.join(", ")}`)}`);
  }

  // Print children
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    const childIsLast = i === node.children.length - 1 && deps.length === 0;
    printTree(child, newPrefix, childIsLast);
  }

  if (deps.length > 0 && node.children.length > 0) {
    bar(`${newPrefix}└─ ${gray(`npm: ${deps.join(", ")}`)}`);
  }
}
```

**Step 2: Commit**

```bash
git add scripts/utils/tree.ts
git commit -m "feat(cli): add dependency tree utilities"
```

---

## Task 7: Install Utilities

**Files:**
- Create: `scripts/utils/install.ts`

**Step 1: Create install utility**

Create `scripts/utils/install.ts`:
```typescript
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import type { ProjectConfig, RegistryItem } from "../types.js";
import { done, error } from "./colors.js";

export function transformImports(content: string, alias: string): string {
  // Transform @/components/ui imports to use user's alias
  // e.g., @/components/ui/button -> {alias}/components/ui/button
  if (alias === "@") {
    return content;
  }

  return content.replace(
    /@\/components\//g,
    `${alias}/components/`
  );
}

export function fileExists(filePath: string): boolean {
  return existsSync(filePath);
}

export async function writeComponent(
  item: RegistryItem,
  config: ProjectConfig,
  overwriteAll: boolean,
  promptOverwrite: (filename: string) => Promise<"overwrite" | "skip" | "all">
): Promise<{ written: string[]; skipped: string[] }> {
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
}

export function installDependencies(
  deps: string[],
  packageManager: ProjectConfig["packageManager"]
): boolean {
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
}

export function getDiff(
  existingPath: string,
  newContent: string
): string | null {
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
}
```

**Step 2: Commit**

```bash
git add scripts/utils/install.ts
git commit -m "feat(cli): add install utilities"
```

---

## Task 8: Search Multiselect Prompt

**Files:**
- Create: `scripts/prompts/search-multiselect.ts`

**Step 1: Create custom search multiselect prompt**

Create `scripts/prompts/search-multiselect.ts`:
```typescript
import * as readline from "node:readline";
import pc from "picocolors";
import { SYMBOLS } from "../constants.js";

interface SearchItem {
  value: string;
  label: string;
  category?: string;
}

interface SearchMultiselectOptions {
  message: string;
  items: SearchItem[];
  maxVisible?: number;
}

export async function searchMultiselect(
  options: SearchMultiselectOptions
): Promise<string[] | null> {
  const { message, items, maxVisible = 10 } = options;

  return new Promise((resolve) => {
    const selected = new Set<string>();
    let searchQuery = "";
    let cursorIndex = 0;
    let scrollOffset = 0;

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // Enable raw mode for keypress detection
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    readline.emitKeypressEvents(process.stdin, rl);

    function getFilteredItems(): SearchItem[] {
      if (!searchQuery) {
        return items;
      }
      const query = searchQuery.toLowerCase();
      return items.filter(
        (item) =>
          item.label.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query)
      );
    }

    function render(): void {
      const filtered = getFilteredItems();

      // Clear previous output
      process.stdout.write("\x1b[2J\x1b[H");

      // Header
      console.log(`${pc.cyan(SYMBOLS.active)}  ${message}`);
      console.log(`${pc.dim(SYMBOLS.bar)}`);

      // Search input
      console.log(
        `${pc.dim(SYMBOLS.bar)}  Search: ${searchQuery}${pc.dim("▌")}`
      );
      console.log(`${pc.dim(SYMBOLS.bar)}`);

      // Group by category
      const byCategory = new Map<string, SearchItem[]>();
      for (const item of filtered) {
        const cat = item.category || "Other";
        if (!byCategory.has(cat)) {
          byCategory.set(cat, []);
        }
        byCategory.get(cat)!.push(item);
      }

      // Render items
      let visibleIndex = 0;
      const visibleStart = scrollOffset;
      const visibleEnd = scrollOffset + maxVisible;

      for (const [category, categoryItems] of byCategory) {
        if (visibleIndex >= visibleEnd) break;

        if (visibleIndex >= visibleStart) {
          console.log(`${pc.dim(SYMBOLS.bar)}  ${pc.bold(pc.dim(category))}`);
        }
        visibleIndex++;

        for (const item of categoryItems) {
          if (visibleIndex >= visibleEnd) break;

          if (visibleIndex >= visibleStart) {
            const isSelected = selected.has(item.value);
            const isCursor = visibleIndex - 1 === cursorIndex;
            const icon = isSelected
              ? pc.green(SYMBOLS.selected)
              : pc.dim(SYMBOLS.unselected);
            const cursor = isCursor ? pc.cyan(SYMBOLS.cursor) : " ";
            const label = isCursor ? pc.cyan(item.label) : item.label;

            console.log(`${pc.dim(SYMBOLS.bar)}  ${cursor} ${icon} ${label}`);
          }
          visibleIndex++;
        }
      }

      console.log(`${pc.dim(SYMBOLS.bar)}`);
      console.log(
        `${pc.dim(SYMBOLS.bar)}  ${pc.dim(
          `${selected.size} selected │ ↑↓ navigate │ space select │ enter confirm │ esc cancel`
        )}`
      );
    }

    function cleanup(): void {
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(false);
      }
      rl.close();
    }

    function onKeypress(str: string | undefined, key: readline.Key): void {
      const filtered = getFilteredItems();
      const totalItems = filtered.length;

      if (key.name === "escape" || (key.ctrl && key.name === "c")) {
        cleanup();
        resolve(null);
        return;
      }

      if (key.name === "return") {
        cleanup();
        resolve([...selected]);
        return;
      }

      if (key.name === "up") {
        cursorIndex = Math.max(0, cursorIndex - 1);
        if (cursorIndex < scrollOffset) {
          scrollOffset = cursorIndex;
        }
      } else if (key.name === "down") {
        cursorIndex = Math.min(totalItems - 1, cursorIndex + 1);
        if (cursorIndex >= scrollOffset + maxVisible) {
          scrollOffset = cursorIndex - maxVisible + 1;
        }
      } else if (key.name === "space") {
        const item = filtered[cursorIndex];
        if (item) {
          if (selected.has(item.value)) {
            selected.delete(item.value);
          } else {
            selected.add(item.value);
          }
        }
      } else if (key.name === "backspace") {
        searchQuery = searchQuery.slice(0, -1);
        cursorIndex = 0;
        scrollOffset = 0;
      } else if (str && str.length === 1 && !key.ctrl && !key.meta) {
        searchQuery += str;
        cursorIndex = 0;
        scrollOffset = 0;
      }

      render();
    }

    process.stdin.on("keypress", onKeypress);
    render();
  });
}
```

**Step 2: Commit**

```bash
git add scripts/prompts/search-multiselect.ts
git commit -m "feat(cli): add search multiselect prompt"
```

---

## Task 9: Add Command

**Files:**
- Create: `scripts/commands/add.ts`

**Step 1: Create add command**

Create `scripts/commands/add.ts`:
```typescript
import * as p from "@clack/prompts";
import { CATEGORIES } from "../constants.js";
import type { ProjectConfig, RegistryItem } from "../types.js";
import {
  active,
  bar,
  bold,
  cyan,
  dim,
  done,
  error,
  gray,
  green,
  header,
  success,
} from "../utils/colors.js";
import { detectConfig } from "../utils/detect.js";
import { installDependencies, writeComponent } from "../utils/install.js";
import { fetchComponent, getAvailableComponents } from "../utils/registry.js";
import {
  collectNpmDeps,
  flattenTree,
  printTree,
  resolveTree,
} from "../utils/tree.js";
import { searchMultiselect } from "../prompts/search-multiselect.js";

interface AddOptions {
  path?: string;
  force?: boolean;
}

export async function add(
  componentNames: string[],
  options: AddOptions
): Promise<void> {
  header();

  // Detect project configuration
  const config = detectConfig();

  if (options.path) {
    config.componentPath = options.path;
  }

  done(`Detected: ${config.componentPath}/ (${config.packageManager})`);
  console.log();

  // If no components specified, show interactive picker
  let selectedComponents = componentNames;

  if (selectedComponents.length === 0) {
    const availableComponents = await getAvailableComponents();

    // Build items with categories
    const items = availableComponents.map((name) => {
      let category = "Other";
      for (const [cat, components] of Object.entries(CATEGORIES)) {
        if (components.includes(name)) {
          category = cat;
          break;
        }
      }
      return { value: name, label: name, category };
    });

    const selected = await searchMultiselect({
      message: "Select components to install:",
      items,
    });

    if (!selected || selected.length === 0) {
      console.log();
      done("No components selected.");
      return;
    }

    selectedComponents = selected;
    done(`Selected: ${selectedComponents.join(", ")}`);
    console.log();
  }

  // Resolve dependency trees
  active("Resolving dependencies...");
  bar();

  const allComponents: RegistryItem[] = [];
  const seen = new Set<string>();

  for (const name of selectedComponents) {
    try {
      const tree = await resolveTree(name, seen);
      const flat = flattenTree(tree);

      for (const item of flat) {
        if (!seen.has(item.name)) {
          seen.add(item.name);
          allComponents.push(item);
        }
      }

      printTree(tree);
    } catch (err) {
      error(`Failed to resolve ${name}: ${(err as Error).message}`);
      return;
    }
  }

  bar();

  // Collect npm dependencies
  const { dependencies, devDependencies } = collectNpmDeps(allComponents);
  const allDeps = [...dependencies, ...devDependencies];

  // Confirm installation
  const totalComponents = allComponents.length;
  const totalDeps = allDeps.length;

  const confirmMessage =
    totalDeps > 0
      ? `Install ${totalComponents} component${totalComponents > 1 ? "s" : ""} + ${totalDeps} npm package${totalDeps > 1 ? "s" : ""}?`
      : `Install ${totalComponents} component${totalComponents > 1 ? "s" : ""}?`;

  const confirmed = await p.confirm({
    message: confirmMessage,
  });

  if (p.isCancel(confirmed) || !confirmed) {
    done("Installation cancelled.");
    return;
  }

  console.log();

  // Write components
  let overwriteAll = options.force || false;

  for (const item of allComponents) {
    const { written, skipped } = await writeComponent(
      item,
      config,
      overwriteAll,
      async (filename) => {
        const action = await p.select({
          message: `File exists: ${filename}`,
          options: [
            { value: "overwrite", label: "Overwrite" },
            { value: "skip", label: "Skip" },
            { value: "all", label: "Overwrite all" },
          ],
        });

        if (p.isCancel(action)) {
          return "skip";
        }

        if (action === "all") {
          overwriteAll = true;
        }

        return action as "overwrite" | "skip" | "all";
      }
    );

    for (const file of written) {
      done(`Written: ${config.componentPath}/${file}`);
    }

    for (const file of skipped) {
      done(`Skipped: ${file}`);
    }
  }

  // Install npm dependencies
  if (allDeps.length > 0) {
    const spinner = p.spinner();
    spinner.start(`Installing ${allDeps.join(", ")}`);

    const installed = installDependencies(allDeps, config.packageManager);

    if (installed) {
      spinner.stop(`Installed: ${allDeps.join(", ")}`);
    } else {
      spinner.stop(`Failed to install dependencies`);
      bar(`Run manually: ${config.packageManager} add ${allDeps.join(" ")}`);
    }
  }

  console.log();
  success(`Done! ${totalComponents} component${totalComponents > 1 ? "s" : ""} installed.`);
}
```

**Step 2: Commit**

```bash
git add scripts/commands/add.ts
git commit -m "feat(cli): add main add command"
```

---

## Task 10: List Command

**Files:**
- Create: `scripts/commands/list.ts`

**Step 1: Create list command**

Create `scripts/commands/list.ts`:
```typescript
import { CATEGORIES } from "../constants.js";
import { active, bar, bold, dim, done, header } from "../utils/colors.js";
import { getAvailableComponents } from "../utils/registry.js";

interface ListOptions {
  json?: boolean;
}

export async function list(options: ListOptions): Promise<void> {
  const components = await getAvailableComponents();

  if (options.json) {
    console.log(JSON.stringify(components, null, 2));
    return;
  }

  header();
  active(`Available components (${components.length})`);
  bar();

  // Group by category
  const byCategory = new Map<string, string[]>();

  for (const name of components) {
    let category = "Other";
    for (const [cat, catComponents] of Object.entries(CATEGORIES)) {
      if (catComponents.includes(name)) {
        category = cat;
        break;
      }
    }

    if (!byCategory.has(category)) {
      byCategory.set(category, []);
    }
    byCategory.get(category)!.push(name);
  }

  for (const [category, categoryComponents] of byCategory) {
    bar(bold(dim(category)));
    for (const name of categoryComponents.sort()) {
      bar(`  ${name}`);
    }
    bar();
  }

  done(`Use ${dim("npx smoothui add <component>")} to install`);
}
```

**Step 2: Commit**

```bash
git add scripts/commands/list.ts
git commit -m "feat(cli): add list command"
```

---

## Task 11: Main Entry Point

**Files:**
- Modify: `scripts/index.ts`

**Step 1: Update main entry point**

Replace `scripts/index.ts`:
```typescript
#!/usr/bin/env node

import { add } from "./commands/add.js";
import { list } from "./commands/list.js";
import { error, header } from "./utils/colors.js";

const args = process.argv.slice(2);
const command = args[0];

function printHelp(): void {
  header();
  console.log("Usage: npx smoothui <command> [options]");
  console.log();
  console.log("Commands:");
  console.log("  add [components...]   Add components to your project");
  console.log("  list                  List available components");
  console.log();
  console.log("Options:");
  console.log("  --path <path>         Custom component install path");
  console.log("  --force               Overwrite existing files without asking");
  console.log("  --json                Output as JSON (list command)");
  console.log("  --help                Show this help message");
  console.log();
  console.log("Examples:");
  console.log("  npx smoothui add siri-orb");
  console.log("  npx smoothui add siri-orb grid-loader");
  console.log("  npx smoothui add                         # Interactive mode");
  console.log("  npx smoothui list");
}

async function main(): Promise<void> {
  try {
    if (!command || command === "--help" || command === "-h") {
      printHelp();
      return;
    }

    if (command === "add") {
      const componentArgs: string[] = [];
      let path: string | undefined;
      let force = false;

      for (let i = 1; i < args.length; i++) {
        const arg = args[i];
        if (arg === "--path" && args[i + 1]) {
          path = args[i + 1];
          i++;
        } else if (arg === "--force" || arg === "-f") {
          force = true;
        } else if (!arg.startsWith("-")) {
          componentArgs.push(arg);
        }
      }

      await add(componentArgs, { path, force });
      return;
    }

    if (command === "list" || command === "ls") {
      const json = args.includes("--json");
      await list({ json });
      return;
    }

    error(`Unknown command: ${command}`);
    printHelp();
    process.exit(1);
  } catch (err) {
    error((err as Error).message);
    process.exit(1);
  }
}

main();
```

**Step 2: Commit**

```bash
git add scripts/index.ts
git commit -m "feat(cli): update main entry point with new commands"
```

---

## Task 12: Utils Index Export

**Files:**
- Create: `scripts/utils/index.ts`

**Step 1: Create utils index for cleaner imports**

Create `scripts/utils/index.ts`:
```typescript
export * from "./colors.js";
export * from "./detect.js";
export * from "./install.js";
export * from "./registry.js";
export * from "./tree.js";
```

**Step 2: Commit**

```bash
git add scripts/utils/index.ts
git commit -m "feat(cli): add utils index export"
```

---

## Task 13: Build & Test

**Step 1: Build the CLI**

Run: `pnpm build`

Expected: Build succeeds, `dist/index.js` is generated

**Step 2: Test help command**

Run: `node dist/index.js --help`

Expected: Shows help output with commands and options

**Step 3: Test list command**

Run: `node dist/index.js list`

Expected: Shows categorized list of components

**Step 4: Test add command (in a test project)**

Create a test Next.js project and run:
```bash
cd /tmp && npx create-next-app@latest test-smoothui --typescript --tailwind --app
cd test-smoothui
node /path/to/smoothui/dist/index.js add siri-orb
```

Expected:
- Detects project config
- Shows dependency tree
- Asks for confirmation
- Writes component file
- Installs npm dependencies

**Step 5: Commit any fixes**

If any bugs found during testing, fix and commit:
```bash
git add -A
git commit -m "fix(cli): address issues found during testing"
```

---

## Task 14: Documentation Update

**Files:**
- Modify: `README.md` or docs

**Step 1: Add CLI usage to documentation**

Add to project documentation:
```markdown
## Installation

### Using SmoothUI CLI (Recommended)

```bash
# Add specific components
npx smoothui add siri-orb
npx smoothui add siri-orb grid-loader animated-tabs

# Interactive mode - browse and select
npx smoothui add

# List available components
npx smoothui list
```

### Using shadcn CLI

```bash
npx shadcn@latest add https://smoothui.dev/r/siri-orb.json
```
```

**Step 2: Commit**

```bash
git add -A
git commit -m "docs: add CLI usage documentation"
```

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | Project setup & dependencies | package.json, tsup.config.ts |
| 2 | Types & constants | scripts/types.ts, scripts/constants.ts |
| 3 | Color utilities | scripts/utils/colors.ts |
| 4 | Detection utilities | scripts/utils/detect.ts |
| 5 | Registry utilities | scripts/utils/registry.ts |
| 6 | Dependency tree utilities | scripts/utils/tree.ts |
| 7 | Install utilities | scripts/utils/install.ts |
| 8 | Search multiselect prompt | scripts/prompts/search-multiselect.ts |
| 9 | Add command | scripts/commands/add.ts |
| 10 | List command | scripts/commands/list.ts |
| 11 | Main entry point | scripts/index.ts |
| 12 | Utils index export | scripts/utils/index.ts |
| 13 | Build & test | - |
| 14 | Documentation | README.md |

Total: 14 tasks, ~14 commits
