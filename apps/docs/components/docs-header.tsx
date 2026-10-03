"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { usePathname } from "fumadocs-core/framework";
import Link from "fumadocs-core/link";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { useNotebookLayout } from "fumadocs-ui/layouts/notebook";
import { isLayoutTabActive, type LayoutTab } from "fumadocs-ui/layouts/shared";
import { Languages, Sidebar } from "lucide-react";
import { type ComponentProps, useMemo } from "react";

/**
 * Single-row docs header: logo + section tabs + right actions (search, then
 * changelog furthest right among the pair). Drops fumadocs' second tabs strip.
 */
export function DocsHeader(props: ComponentProps<"header">) {
  const {
    slots,
    isNavTransparent,
    props: { tabMode, nav, tabs, sidebar },
  } = useNotebookLayout();
  const { open } = slots.sidebar?.useSidebar?.() ?? {};
  const navMode = nav?.mode ?? "auto";
  const sidebarCollapsible = sidebar.collapsible ?? true;
  const showLayoutTabs = tabMode === "navbar" && tabs.length > 0;

  if (nav?.component) {
    return nav.component;
  }

  return (
    <header
      id="nd-subnav"
      data-transparent={isNavTransparent && !open}
      {...props}
      className={cn(
        "sticky top-(--fd-docs-row-1) z-10 flex flex-col backdrop-blur-sm transition-colors [grid-area:header] layout:[--fd-header-height:--spacing(14)] data-[transparent=false]:bg-fd-background/80",
        props.className
      )}
    >
      <div
        className="relative flex h-14 gap-2 border-b px-4 md:px-6"
        data-header-body=""
      >
        <div
          className={cn(
            "relative z-10 flex shrink-0 items-center",
            navMode === "auto" &&
              "hidden max-md:flex has-data-[collapsed=true]:md:flex"
          )}
        >
          {sidebarCollapsible && slots.sidebar && navMode === "auto" ? (
            <slots.sidebar.collapseTrigger
              className={cn(
                buttonVariants({ color: "ghost", size: "icon-sm" }),
                "-ms-1.5 text-fd-muted-foreground data-[collapsed=false]:hidden max-md:hidden"
              )}
            >
              <Sidebar />
            </slots.sidebar.collapseTrigger>
          ) : null}
          {slots.navTitle ? (
            <slots.navTitle
              className={cn(
                "inline-flex items-center gap-2.5 font-semibold",
                navMode === "auto" && "md:hidden"
              )}
            />
          ) : null}
          {nav?.children}
        </div>

        {showLayoutTabs ? (
          <DocsHeaderTabs
            className="pointer-events-none absolute inset-x-0 top-0 bottom-0 z-0 mx-auto hidden max-w-fit items-center justify-center lg:flex"
            tabs={tabs}
          />
        ) : null}

        <div className="relative z-10 ms-auto flex shrink-0 items-center justify-end md:gap-2">
          <div className="flex items-center md:hidden">
            {slots.searchTrigger ? (
              <slots.searchTrigger.sm className="p-2" hideIfDisabled />
            ) : null}
            {slots.sidebar ? (
              <slots.sidebar.trigger
                className={cn(
                  buttonVariants({
                    className: "-me-1.5 p-2",
                    color: "ghost",
                    size: "icon-sm",
                  })
                )}
              >
                <Sidebar />
              </slots.sidebar.trigger>
            ) : null}
          </div>
          <div className="flex items-center gap-2 max-md:hidden">
            {slots.languageSelect ? (
              <slots.languageSelect.root>
                <Languages className="size-4.5 text-fd-muted-foreground" />
              </slots.languageSelect.root>
            ) : null}
            {slots.searchTrigger ? (
              <slots.searchTrigger.full
                className="my-auto w-48 max-w-[12rem]"
                hideIfDisabled
              />
            ) : null}
            {slots.themeSwitch ? <slots.themeSwitch /> : null}
            {sidebarCollapsible && slots.sidebar && navMode === "top" ? (
              <slots.sidebar.collapseTrigger
                className={cn(
                  buttonVariants({ color: "secondary", size: "icon-sm" }),
                  "-me-1.5 rounded-full text-fd-muted-foreground"
                )}
              >
                <Sidebar />
              </slots.sidebar.collapseTrigger>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

const DocsHeaderTabs = ({
  tabs,
  className,
  ...props
}: {
  tabs: LayoutTab[];
} & ComponentProps<"div">) => {
  const pathname = usePathname();
  const selectedIdx = useMemo(
    () => tabs.findLastIndex((option) => isLayoutTabActive(option, pathname)),
    [tabs, pathname]
  );

  return (
    <div
      className={cn("flex flex-row items-center gap-6", className)}
      data-header-tabs=""
      {...props}
    >
      {tabs.map((option, i) => {
        const {
          title,
          url,
          unlisted,
          props: { className: tabClassName, ...rest } = {},
        } = option;
        const isSelected = selectedIdx === i;
        return (
          <Link
            className={cn(
              "pointer-events-auto inline-flex items-center text-nowrap font-medium text-fd-muted-foreground text-sm transition-colors hover:text-fd-accent-foreground",
              unlisted && !isSelected && "hidden",
              isSelected && "text-fd-primary",
              tabClassName
            )}
            href={url}
            key={i}
            {...rest}
          >
            {title}
          </Link>
        );
      })}
    </div>
  );
};
