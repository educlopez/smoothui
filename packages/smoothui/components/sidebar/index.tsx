"use client";

import { cn } from "@repo/smoothui-utils";
import { type HTMLMotionProps, motion, useReducedMotion } from "motion/react";
import {
  type ComponentProps,
  createContext,
  type ReactNode,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  type UseFluidHoverReturn,
  useFluidHover,
  useRegisterFluidHoverItem,
} from "../../hooks/use-fluid-hover";
import { spring } from "../../lib/springs";
import { FluidHoverHighlight } from "../fluid-hover-highlight";

type SidebarContextValue = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggle: () => void;
};

type FluidHoverListContextValue = {
  claimIndex: () => number;
  registerItem: UseFluidHoverReturn["registerItem"];
};

const SidebarContext = createContext<SidebarContextValue | null>(null);
const FluidHoverListContext = createContext<FluidHoverListContextValue | null>(
  null
);

export const useSidebar = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return ctx;
};

export interface SidebarProviderProps {
  children?: ReactNode;
  /** Controlled collapsed state */
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export interface SidebarProps extends ComponentProps<"aside"> {
  children?: ReactNode;
}

export interface SidebarHeaderProps extends ComponentProps<"div"> {
  children?: ReactNode;
}

export interface SidebarContentProps extends ComponentProps<"div"> {
  children?: ReactNode;
}

export interface SidebarFooterProps extends ComponentProps<"div"> {
  children?: ReactNode;
}

export interface SidebarMenuProps extends ComponentProps<"ul"> {
  children?: ReactNode;
}

export interface SidebarMenuItemProps extends ComponentProps<"li"> {
  children?: ReactNode;
}

export interface SidebarMenuButtonProps extends ComponentProps<"button"> {
  active?: boolean;
  children?: ReactNode;
  /** Leading icon — required for a usable collapsed (icon-rail) state */
  icon?: ReactNode;
}

export interface SidebarLabelProps extends ComponentProps<"span"> {
  children?: ReactNode;
}

export interface SidebarTriggerProps extends ComponentProps<"button"> {
  children?: ReactNode;
}

/** Label fade duration; matches the `duration-200` class on the label. */
const LABEL_FADE_MS = 200;
const EXPANDED_WIDTH = 240;
const COLLAPSED_WIDTH = 56;

export const SidebarProvider = ({
  children,
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
}: SidebarProviderProps) => {
  const [uncontrolled, setUncontrolled] = useState(defaultCollapsed);
  const isControlled = collapsedProp !== undefined;
  const collapsed = isControlled ? collapsedProp : uncontrolled;

  const setCollapsed = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setUncontrolled(next);
      }
      onCollapsedChange?.(next);
    },
    [isControlled, onCollapsedChange]
  );

  const value = useMemo(
    () => ({
      collapsed,
      setCollapsed,
      toggle: () => setCollapsed(!collapsed),
    }),
    [collapsed, setCollapsed]
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};

/**
 * SmoothUI Sidebar — lean collapsible app rail. SmoothUI-owned.
 * Delphi Sidebar / Astryx Side Nav are visual refs — not a full shadcn port.
 */
export default function Sidebar({
  children,
  className,
  ...props
}: SidebarProps) {
  const { collapsed } = useSidebar();
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.aside
      animate={{
        width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
      }}
      aria-label="Sidebar"
      className={cn(
        "flex h-full shrink-0 flex-col overflow-hidden border-foreground/10 border-r bg-background",
        className
      )}
      data-collapsed={collapsed || undefined}
      data-slot="sidebar"
      initial={false}
      transition={shouldReduceMotion ? { duration: 0 } : spring.moderate}
      {...(props as Omit<HTMLMotionProps<"aside">, "ref">)}
    >
      {children}
    </motion.aside>
  );
}

export const SidebarHeader = ({
  children,
  className,
  ...props
}: SidebarHeaderProps) => {
  const { collapsed } = useSidebar();

  return (
    <div
      className={cn(
        "flex h-12 shrink-0 items-center gap-2 px-3",
        collapsed && "justify-center px-2",
        className
      )}
      data-slot="sidebar-header"
      {...props}
    >
      {children}
    </div>
  );
};

export const SidebarContent = ({
  children,
  className,
  ...props
}: SidebarContentProps) => (
  <div
    className={cn(
      "scroll-fade flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-2",
      className
    )}
    data-slot="sidebar-content"
    {...props}
  >
    {children}
  </div>
);

export const SidebarFooter = ({
  children,
  className,
  ...props
}: SidebarFooterProps) => (
  <div
    className={cn(
      "mt-auto flex shrink-0 flex-col gap-1 border-foreground/10 border-t p-2",
      className
    )}
    data-slot="sidebar-footer"
    {...props}
  >
    {children}
  </div>
);

/**
 * Menu list with Fluid Functionalism nearest-item hover.
 * Highlight glides between rows instead of blinking on `:hover`.
 */
export const SidebarMenu = ({
  children,
  className,
  ...props
}: SidebarMenuProps) => {
  const containerRef = useRef<HTMLUListElement>(null);
  const hover = useFluidHover(containerRef as RefObject<HTMLElement | null>);
  const nextIndexRef = useRef(0);

  const claimIndex = useCallback(() => {
    const index = nextIndexRef.current;
    nextIndexRef.current += 1;
    return index;
  }, []);

  const listCtx = useMemo(
    () => ({
      claimIndex,
      registerItem: hover.registerItem,
    }),
    [claimIndex, hover.registerItem]
  );

  return (
    <FluidHoverListContext.Provider value={listCtx}>
      <ul
        className={cn("relative flex flex-col gap-0.5", className)}
        data-slot="sidebar-menu"
        ref={containerRef}
        {...hover.handlers}
        {...props}
      >
        <FluidHoverHighlight
          className="z-0 rounded-md bg-foreground/5"
          hover={hover}
        />
        {children}
      </ul>
    </FluidHoverListContext.Provider>
  );
};

export const SidebarMenuItem = ({
  children,
  className,
  ...props
}: SidebarMenuItemProps) => {
  const list = useContext(FluidHoverListContext);
  const itemRef = useRef<HTMLLIElement>(null);
  const [index] = useState(() => list?.claimIndex() ?? 0);

  useRegisterFluidHoverItem(
    list?.registerItem,
    list ? index : undefined,
    itemRef
  );

  return (
    <li
      className={cn("relative z-10 list-none", className)}
      data-slot="sidebar-menu-item"
      ref={itemRef}
      {...props}
    >
      {children}
    </li>
  );
};

/**
 * Text that hides when the sidebar collapses. It fades out with the width and
 * only then becomes `sr-only`, so it stays readable to assistive tech and does
 * not pop out while the rail is still narrowing.
 */
export const SidebarLabel = ({
  children,
  className,
  ...props
}: SidebarLabelProps) => {
  const { collapsed } = useSidebar();
  const shouldReduceMotion = useReducedMotion();
  const [fadedOut, setFadedOut] = useState(collapsed);
  const [wasCollapsed, setWasCollapsed] = useState(collapsed);
  // On expand the label starts transparent and fades in while the rail widens.
  const [entering, setEntering] = useState(false);

  if (wasCollapsed !== collapsed) {
    setWasCollapsed(collapsed);
    setEntering(!(collapsed || shouldReduceMotion));
  }

  useEffect(() => {
    if (!entering) {
      return;
    }
    // Two frames so the transparent state is painted before it is cleared.
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setEntering(false));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [entering]);

  useEffect(() => {
    if (!collapsed) {
      setFadedOut(false);
      return;
    }
    const timer = setTimeout(() => setFadedOut(true), LABEL_FADE_MS);
    return () => clearTimeout(timer);
  }, [collapsed]);

  const hidden = collapsed && (shouldReduceMotion || fadedOut);

  return (
    <span
      className={cn(
        hidden ? "sr-only" : "truncate",
        !shouldReduceMotion &&
          "transition-opacity duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]",
        ((collapsed && !hidden) || entering) && "opacity-0",
        className
      )}
      data-slot="sidebar-label"
      {...props}
    >
      {children}
    </span>
  );
};

export const SidebarMenuButton = ({
  "aria-label": ariaLabel,
  active = false,
  children,
  className,
  icon,
  ...props
}: SidebarMenuButtonProps) => {
  const { collapsed } = useSidebar();
  const textLabel =
    typeof children === "string" || typeof children === "number"
      ? String(children)
      : undefined;

  return (
    <button
      aria-current={active ? "page" : undefined}
      aria-label={ariaLabel ?? (collapsed ? textLabel : undefined)}
      className={cn(
        "ease flex h-9 w-full items-center gap-2 rounded-md px-2.5 text-left text-sm outline-none transition-colors duration-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
        active
          ? "bg-foreground/10 font-medium text-foreground"
          : "text-muted-foreground",
        collapsed && "justify-center px-0",
        className
      )}
      data-active={active || undefined}
      data-slot="sidebar-menu-button"
      type="button"
      {...props}
    >
      {icon ? (
        <span
          aria-hidden
          className="flex size-4 shrink-0 items-center justify-center [&_svg]:size-4"
          data-slot="sidebar-menu-icon"
        >
          {icon}
        </span>
      ) : null}
      {children === null || children === undefined ? null : (
        <SidebarLabel>{children}</SidebarLabel>
      )}
    </button>
  );
};

export const SidebarTrigger = ({
  children,
  className,
  onClick,
  ...props
}: SidebarTriggerProps) => {
  const { collapsed, toggle } = useSidebar();

  return (
    <button
      aria-expanded={!collapsed}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground text-sm hover:bg-foreground/5 hover:text-foreground",
        className
      )}
      data-slot="sidebar-trigger"
      onClick={(event) => {
        toggle();
        onClick?.(event);
      }}
      type="button"
      {...props}
    >
      {children ?? (collapsed ? "»" : "«")}
    </button>
  );
};
