"use client";

import { isPlannedSidebarItem } from "@docs/lib/inject-planned-primitives";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { usePathname } from "fumadocs-core/framework";
import type * as PageTree from "fumadocs-core/page-tree";
import {
  SidebarItem,
  useFolderDepth,
} from "fumadocs-ui/components/sidebar/base";

/**
 * Mirror fumadocs-ui notebook `itemVariants` — custom `sidebar.components.Item`
 * bypasses the layout wrapper that normally applies these classes.
 */
const itemClassName =
  "relative flex flex-row items-center gap-2 rounded-lg p-2 text-start text-fd-muted-foreground wrap-anywhere [&_svg]:size-4 [&_svg]:shrink-0 transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 hover:transition-none data-[active=true]:bg-fd-primary/10 data-[active=true]:text-fd-primary data-[active=true]:hover:transition-colors";

const getItemOffset = (depth: number): string =>
  `calc(${2 + 3 * depth} * var(--spacing))`;

const normalize = (path: string): string =>
  path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;

const isActivePath = (href: string, pathname: string): boolean =>
  normalize(href) === normalize(pathname);

/**
 * Renders planned primitives as disabled “Soon” rows; everything else as a
 * normal fumadocs sidebar link (with notebook item styles restored).
 */
export const DocsSidebarItem = ({ item }: { item: PageTree.Item }) => {
  const pathname = usePathname();
  const depth = useFolderDepth();
  const style = { paddingInlineStart: getItemOffset(depth) };

  if (isPlannedSidebarItem(item)) {
    return (
      <span
        aria-disabled="true"
        className={cn(
          itemClassName,
          "w-full cursor-not-allowed opacity-55 hover:bg-transparent hover:text-fd-muted-foreground"
        )}
        style={style}
      >
        {item.name}
      </span>
    );
  }

  return (
    <SidebarItem
      active={isActivePath(item.url, pathname)}
      className={itemClassName}
      external={item.external}
      href={item.url}
      icon={item.icon}
      style={style}
    >
      {item.name}
    </SidebarItem>
  );
};
