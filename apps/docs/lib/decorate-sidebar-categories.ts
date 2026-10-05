import type { Folder, Node, Root, Separator } from "fumadocs-core/page-tree";
import { resolveIcon } from "./nucleo-icons-plugin";

/**
 * Lucide-style names (resolved via nucleo) for `---Category---` separators.
 * Leaf pages keep no sidebar icons — only these section labels carry a glyph.
 */
const CATEGORY_ICONS: Record<string, string> = {
  // Primitives
  Actions: "ToggleLeft",
  "AI & tooling": "Wand2",
  "AI · Agent": "Bot",
  "AI · Chat": "MessageSquare",
  "AI · Orbs": "Orbit",

  // Blocks / templates / community
  Blocks: "Zap",
  Button: "Square",
  Community: "Users",
  Concepts: "Lightbulb",
  Creative: "Paintbrush",
  "Data Viz": "ChartPie",
  Display: "LayoutGrid",
  Forms: "ListChecks",
  Frameworks: "AppWindow",

  // Guides
  "Get started": "Rocket",
  // Shared
  Guide: "BookOpen",
  Loaders: "LoaderCircle",
  "Media & Gallery": "Images",
  More: "RectangleEllipsis",
  Navigation: "Navigation",
  Others: "RectangleEllipsis",
  Overlays: "Layers",

  // Components
  Patterns: "Shapes",
  Pointer: "MousePointer",
  Reference: "FileText",
  Scroll: "PanelBottom",
  "SmoothUI & shadcn": "Box",
  "Surfaces & Shaders": "Sparkles",
  Templates: "PanelsTopLeft",
  Text: "Type",
  Transitions: "Blend",
};

const separatorLabel = (node: Separator): string =>
  typeof node.name === "string" ? node.name : "";

const decorateNode = (node: Node): Node => {
  if (node.type === "separator") {
    const label = separatorLabel(node);
    const iconName = CATEGORY_ICONS[label];
    if (!iconName || node.icon) {
      return node;
    }
    const icon = resolveIcon(iconName);
    return icon ? { ...node, icon } : node;
  }

  if (node.type === "folder") {
    return {
      ...node,
      children: node.children.map(decorateNode),
    } as Folder;
  }

  return node;
};

/** Attach category icons to `---Section---` separators in the docs page tree. */
export const decorateSidebarCategories = (tree: Root): Root => ({
  ...tree,
  children: tree.children.map(decorateNode),
});
