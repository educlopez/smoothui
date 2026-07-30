import type { Folder, Node, Root } from "fumadocs-core/page-tree";

export type SectionNavItem = { name: string; url: string };
export type SectionNavGroup = { items: SectionNavItem[]; label?: string };

const isFolder = (node: Node): node is Folder => node.type === "folder";

const containsUrl = (node: Node, url: string): boolean => {
  if (node.type === "page") {
    return node.url === url;
  }
  if (isFolder(node)) {
    return (
      node.index?.url === url ||
      node.children.some((child) => containsUrl(child, url))
    );
  }
  return false;
};

const toText = (name: unknown): string =>
  typeof name === "string" ? name : String(name ?? "");

/**
 * The catalogue for the section a page belongs to, grouped the way the sidebar
 * groups it.
 *
 * Split pages hide the persistent sidebar, so the floating drawer needs the same
 * list. Reading it from the page tree rather than the filesystem means the drawer
 * and the sidebar can never disagree about order, labels or what exists.
 */
export const getSectionNav = (
  tree: Root,
  url: string
): { groups: SectionNavGroup[]; title: string } => {
  const section = tree.children.find(
    (node) => isFolder(node) && containsUrl(node, url)
  );

  if (!(section && isFolder(section))) {
    return { groups: [], title: "" };
  }

  const groups: SectionNavGroup[] = [];
  let current: SectionNavGroup = { items: [] };

  for (const child of section.children) {
    if (child.type === "separator") {
      // A separator starts a new group, which is exactly how the sidebar reads it.
      if (current.items.length > 0) {
        groups.push(current);
      }
      current = { items: [], label: toText(child.name) };
      continue;
    }

    if (child.type === "page") {
      current.items.push({ name: toText(child.name), url: child.url });
      continue;
    }

    if (isFolder(child) && child.index) {
      current.items.push({
        name: toText(child.index.name ?? child.name),
        url: child.index.url,
      });
    }
  }

  if (current.items.length > 0) {
    groups.push(current);
  }

  return { groups, title: toText(section.name) };
};
