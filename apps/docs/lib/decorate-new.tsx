import type { Folder, Node, Root } from "fumadocs-core/page-tree";
import { createElement } from "react";
import type { source } from "./source";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function isNew(date: Date): boolean {
  return Date.now() - date.getTime() < SEVEN_DAYS_MS;
}

function NewBadge() {
  return createElement(
    "span",
    {
      className:
        "ml-auto inline-flex shrink-0 items-center rounded-full bg-primary px-1.5 py-0.5 font-medium text-[10px] text-primary-foreground leading-none",
    },
    "New"
  );
}

function decorateNode(node: Node, newUrls: Set<string>): Node {
  if (node.type === "page" && newUrls.has(node.url)) {
    return {
      ...node,
      name: createElement(
        "span",
        { className: "flex w-full items-center gap-1" },
        node.name,
        createElement(NewBadge)
      ),
    };
  }

  if (node.type === "folder" && node.children) {
    return {
      ...node,
      children: node.children.map((child: Node) =>
        decorateNode(child, newUrls)
      ),
    } as Folder;
  }

  return node;
}

export function decorateNewPages(tree: Root, src: typeof source): Root {
  const newUrls = new Set<string>();

  for (const page of src.getPages()) {
    const data = page.data as { new?: Date };
    if (data.new instanceof Date && isNew(data.new)) {
      newUrls.add(page.url);
    }
  }

  if (newUrls.size === 0) {
    return tree;
  }

  return {
    ...tree,
    children: tree.children.map((child: Node) => decorateNode(child, newUrls)),
  };
}
