import type {
  Folder,
  Item,
  Node,
  Root,
  Separator,
} from "fumadocs-core/page-tree";
import { createElement, Fragment, type ReactNode } from "react";
import {
  PRIMITIVE_CATEGORY_ORDER,
  PRIMITIVES_INVENTORY,
} from "./primitives-inventory";

export const PLANNED_ID_PREFIX = "planned:" as const;

const isPlannedId = (id: string | undefined): boolean =>
  Boolean(id?.startsWith(PLANNED_ID_PREFIX));

const SoonBadge = (): ReactNode =>
  createElement(
    "span",
    {
      className:
        "ml-auto inline-flex shrink-0 items-center rounded-full bg-fd-muted px-1.5 py-0.5 font-medium text-[10px] text-fd-muted-foreground leading-none",
    },
    "Soon"
  );

/** Title + Soon badge as siblings (no nested flex wrapper — keeps icon row intact). */
const plannedPageName = (title: string): ReactNode =>
  createElement(
    Fragment,
    null,
    title,
    createElement(SoonBadge, { key: "badge" })
  );

const plannedItem = (slug: string, title: string): Item => ({
  $id: `${PLANNED_ID_PREFIX}${slug}`,
  name: plannedPageName(title),
  // Non-routable placeholder — custom sidebar Item renders this as disabled.
  type: "page",
  url: `/docs/primitives#${slug}`,
});

const separatorName = (node: Separator): string =>
  typeof node.name === "string" ? node.name : "";

const pageSlug = (node: Item): string | undefined => {
  const parts = node.url.split("/").filter(Boolean);
  return parts.at(-1);
};

const isPrimitivesFolder = (folder: Folder): boolean => {
  if (folder.index?.url === "/docs/primitives") {
    return true;
  }

  return folder.children.some(
    (child) =>
      (child.type === "page" && child.url.startsWith("/docs/primitives")) ||
      (child.type === "folder" && isPrimitivesFolder(child))
  );
};

/**
 * Insert planned inventory rows under matching category separators, and append
 * any categories that do not exist yet (Navigation, Display, …).
 */
const injectIntoPrimitivesFolder = (folder: Folder): Folder => {
  const existingSlugs = new Set<string>();
  for (const child of folder.children) {
    if (child.type === "page") {
      const slug = pageSlug(child);
      if (slug && slug !== "primitives") {
        existingSlugs.add(slug);
      }
    }
  }

  const plannedByCategory = new Map<string, Item[]>();
  for (const item of PRIMITIVES_INVENTORY) {
    if (item.status !== "planned" || existingSlugs.has(item.slug)) {
      continue;
    }
    const list = plannedByCategory.get(item.category) ?? [];
    list.push(plannedItem(item.slug, item.title));
    plannedByCategory.set(item.category, list);
  }

  if (plannedByCategory.size === 0) {
    return folder;
  }

  const next: Node[] = [];
  const seenCategories = new Set<string>();
  let currentCategory: string | null = null;

  const flushPlanned = (category: string) => {
    const planned = plannedByCategory.get(category);
    if (!planned?.length) {
      return;
    }
    next.push(...planned);
    plannedByCategory.delete(category);
  };

  for (const child of folder.children) {
    if (child.type === "separator") {
      if (currentCategory) {
        flushPlanned(currentCategory);
      }
      const name = separatorName(child);
      currentCategory = name || null;
      if (currentCategory) {
        seenCategories.add(currentCategory);
      }
      next.push(child);
      continue;
    }

    next.push(child);
  }

  if (currentCategory) {
    flushPlanned(currentCategory);
  }

  for (const category of PRIMITIVE_CATEGORY_ORDER) {
    const remaining = plannedByCategory.get(category);
    if (!remaining?.length) {
      continue;
    }
    if (!seenCategories.has(category)) {
      next.push({ name: category, type: "separator" });
    }
    next.push(...remaining);
    plannedByCategory.delete(category);
  }

  return { ...folder, children: next };
};

const walk = (node: Node): Node => {
  if (node.type === "folder") {
    const children = node.children.map(walk);
    const folder = { ...node, children } as Folder;
    return isPrimitivesFolder(folder)
      ? injectIntoPrimitivesFolder(folder)
      : folder;
  }
  return node;
};

/** Merge planned Base UI catalog rows into the primitives sidebar tree. */
export const injectPlannedPrimitives = (tree: Root): Root => ({
  ...tree,
  children: tree.children.map(walk),
});

export const isPlannedSidebarItem = (item: Item): boolean =>
  isPlannedId(item.$id);
