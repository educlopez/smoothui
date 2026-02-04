import type { RegistryItem, TreeNode } from "../types.js";
import { bar, gray } from "./colors.js";
import { extractNameFromUrl, fetchComponent } from "./registry.js";

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
  const deps = [...(node.component.dependencies || [])].filter(
    (d) => !["react", "react-dom", "next"].includes(d)
  );

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
