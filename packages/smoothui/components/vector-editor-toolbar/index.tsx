"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type ComponentType,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

const LONG_PRESS_MS = 450;

/** Moving on screen: spring, no overshoot worth noticing on a 36px hop. */
const PILL_SPRING = { bounce: 0.1, duration: 0.25, type: "spring" as const };
/** Entering: strong ease-out. Exits are shorter, the decision is already made. */
const ENTER_TRANSITION = {
  duration: 0.22,
  ease: [0.23, 1, 0.32, 1] as [number, number, number, number],
};
const EXIT_TRANSITION = {
  duration: 0.14,
  ease: [0.23, 1, 0.32, 1] as [number, number, number, number],
};
const INSTANT = { duration: 0 };

const PANEL_SURFACE =
  "rounded-2xl border border-foreground/10 bg-background/80 shadow-[0px_0px_0.5px_0px_rgba(0,0,0,0.18),0px_8px_24px_-8px_rgba(0,0,0,0.28),0px_2px_6px_-2px_rgba(0,0,0,0.12)] backdrop-blur-xl";

const EDITABLE_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);

const isEditableTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  if (EDITABLE_TAGS.has(target.tagName)) {
    return true;
  }
  return target.isContentEditable;
};

const findOwnerTool = (
  tools: VectorTool[],
  id: string | undefined
): VectorTool | undefined => {
  if (!id) {
    return;
  }
  for (const tool of tools) {
    if (tool.id === id || tool.items?.some((item) => item.id === id)) {
      return tool;
    }
  }
};

export interface VectorToolItem {
  icon: ComponentType<{ className?: string }>;
  id: string;
  label: string;
  shortcut?: string;
}

export interface VectorTool extends VectorToolItem {
  items?: VectorToolItem[];
}

export interface VectorEditorToolbarProps {
  /** Controlled active tool id (matches a top-level tool id or a nested item id). */
  activeTool?: string;
  className?: string;
  /**
   * Renders the toolbar as a draggable panel pinned near the top of its nearest
   * positioned ancestor. The overlay itself is click-through, so only the panel
   * intercepts pointer events and whatever sits underneath stays interactive.
   */
  floating?: boolean;
  onToolChange?: (toolId: string) => void;
  orientation?: "horizontal" | "vertical";
  /**
   * Content for the contextual properties panel. It floats beside the toolbar
   * rather than sitting in its flow, so revealing it never moves the tools.
   */
  properties?: ReactNode;
  /** Enables single-key shortcuts bound on `document`. Defaults to true. */
  shortcutsEnabled?: boolean;
  tools: VectorTool[];
}

/** Bottom-right corner triangle marking a tool that hides more tools. */
const CornerTriangle = () => (
  <svg
    aria-hidden="true"
    className="size-1.5 fill-current"
    focusable="false"
    viewBox="0 0 6 6"
  >
    <path d="M6 0v6H0z" />
  </svg>
);

export default function VectorEditorToolbar({
  activeTool,
  className,
  floating = false,
  onToolChange,
  orientation = "horizontal",
  properties,
  shortcutsEnabled = true,
  tools,
}: VectorEditorToolbarProps) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const pillId = useId();
  const isHorizontal = orientation === "horizontal";

  const [internalActiveTool, setInternalActiveTool] = useState<
    string | undefined
  >(activeTool ?? tools[0]?.id);
  const resolvedActiveTool = activeTool ?? internalActiveTool;
  const activeOwner = findOwnerTool(tools, resolvedActiveTool) ?? tools[0];
  const activeOwnerId = activeOwner?.id;

  const [focusedToolId, setFocusedToolId] = useState(activeOwnerId ?? "");
  const [openFlyoutId, setOpenFlyoutId] = useState<string | null>(null);
  const [flyoutFocusedIndex, setFlyoutFocusedIndex] = useState(0);

  const boundsRef = useRef<HTMLDivElement>(null);
  const flyoutPanelRef = useRef<HTMLDivElement | null>(null);
  const toolButtonRefs = useRef(new Map<string, HTMLButtonElement>());
  const flyoutItemRefs = useRef(new Map<string, HTMLButtonElement>());
  const longPressTimerRef = useRef<number | null>(null);
  const longPressTriggeredRef = useRef(false);

  const selectTool = useCallback(
    (id: string) => {
      if (activeTool === undefined) {
        setInternalActiveTool(id);
      }
      onToolChange?.(id);
      setOpenFlyoutId(null);
    },
    [activeTool, onToolChange]
  );

  // Keep roving tabindex in sync with the resolved active tool.
  useEffect(() => {
    setFocusedToolId(activeOwnerId ?? "");
  }, [activeOwnerId]);

  // Close the open flyout when clicking outside its panel and trigger.
  useEffect(() => {
    if (!openFlyoutId) {
      return;
    }
    const handlePointerDown = (event: PointerEvent) => {
      const panel = flyoutPanelRef.current;
      const trigger = toolButtonRefs.current.get(openFlyoutId);
      const target = event.target as Node;
      if (panel?.contains(target) || trigger?.contains(target)) {
        return;
      }
      setOpenFlyoutId(null);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [openFlyoutId]);

  // Move focus onto the highlighted flyout item as the user navigates it.
  useEffect(() => {
    if (!openFlyoutId) {
      return;
    }
    const tool = tools.find((candidate) => candidate.id === openFlyoutId);
    const item = tool?.items?.[flyoutFocusedIndex];
    if (item) {
      flyoutItemRefs.current.get(item.id)?.focus();
    }
  }, [openFlyoutId, flyoutFocusedIndex, tools]);

  // Single-key shortcuts, ignored while typing in an editable field.
  useEffect(() => {
    if (!shortcutsEnabled) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) {
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      const key = event.key.toLowerCase();
      for (const tool of tools) {
        if (tool.shortcut?.toLowerCase() === key) {
          selectTool(tool.id);
          return;
        }
        for (const item of tool.items ?? []) {
          if (item.shortcut?.toLowerCase() === key) {
            selectTool(item.id);
            return;
          }
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [shortcutsEnabled, tools, selectTool]);

  useEffect(
    () => () => {
      if (longPressTimerRef.current !== null) {
        window.clearTimeout(longPressTimerRef.current);
      }
    },
    []
  );

  const clearLongPressTimer = () => {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const openFlyout = (toolId: string) => {
    setOpenFlyoutId(toolId);
    setFlyoutFocusedIndex(0);
  };

  const handleToolPointerDown = (tool: VectorTool) => {
    longPressTriggeredRef.current = false;
    if (!tool.items?.length) {
      return;
    }
    longPressTimerRef.current = window.setTimeout(() => {
      longPressTriggeredRef.current = true;
      openFlyout(tool.id);
    }, LONG_PRESS_MS);
  };

  const handleToolClick = (tool: VectorTool) => {
    if (longPressTriggeredRef.current) {
      longPressTriggeredRef.current = false;
      return;
    }
    // Clicking the tool that is already active reveals its variants, so the
    // flyout is reachable without knowing about long-press.
    if (tool.items?.length && tool.id === activeOwnerId) {
      openFlyout(tool.id);
      return;
    }
    selectTool(tool.id);
  };

  const handleCornerClick = (
    tool: VectorTool,
    event: ReactMouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    clearLongPressTimer();
    setOpenFlyoutId((previous) => (previous === tool.id ? null : tool.id));
    setFlyoutFocusedIndex(0);
  };

  const handleToolbarKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (openFlyoutId) {
      return;
    }
    const nextKey = isHorizontal ? "ArrowRight" : "ArrowDown";
    const prevKey = isHorizontal ? "ArrowLeft" : "ArrowUp";
    const openKey = isHorizontal ? "ArrowDown" : "ArrowRight";

    if (event.key === openKey) {
      const tool = tools.find((candidate) => candidate.id === focusedToolId);
      if (tool?.items?.length) {
        event.preventDefault();
        openFlyout(tool.id);
      }
      return;
    }

    if (event.key !== nextKey && event.key !== prevKey) {
      return;
    }
    event.preventDefault();
    const currentIndex = tools.findIndex(
      (candidate) => candidate.id === focusedToolId
    );
    const delta = event.key === nextKey ? 1 : -1;
    const nextIndex = (currentIndex + delta + tools.length) % tools.length;
    const nextTool = tools[nextIndex];
    if (!nextTool) {
      return;
    }
    setFocusedToolId(nextTool.id);
    toolButtonRefs.current.get(nextTool.id)?.focus();
  };

  const handleFlyoutKeyDown = (
    event: ReactKeyboardEvent<HTMLDivElement>,
    tool: VectorTool
  ) => {
    const items = tool.items ?? [];
    if (event.key === "Escape") {
      event.preventDefault();
      setOpenFlyoutId(null);
      toolButtonRefs.current.get(tool.id)?.focus();
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const delta = event.key === "ArrowDown" ? 1 : -1;
      setFlyoutFocusedIndex(
        (previous) => (previous + delta + items.length) % items.length
      );
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const item = items[flyoutFocusedIndex];
      if (item) {
        selectTool(item.id);
        toolButtonRefs.current.get(tool.id)?.focus();
      }
    }
  };

  const renderFlyout = (tool: VectorTool) => (
    <div
      className={cn(
        "absolute z-30",
        isHorizontal
          ? "top-full left-1/2 mt-2 -translate-x-1/2"
          : "top-0 left-full ml-2"
      )}
    >
      <AnimatePresence>
        {openFlyoutId === tool.id ? (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            aria-label={`${tool.label} options`}
            className={cn(
              "relative flex min-w-44 flex-col gap-0.5 p-1.5",
              PANEL_SURFACE
            )}
            exit={
              shouldReduceMotion
                ? { opacity: 0, transition: INSTANT }
                : { opacity: 0, scale: 0.98, transition: EXIT_TRANSITION }
            }
            initial={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96 }
            }
            onKeyDown={(event) => handleFlyoutKeyDown(event, tool)}
            ref={flyoutPanelRef}
            role="group"
            style={{
              transformOrigin: isHorizontal ? "top center" : "left center",
            }}
            transition={shouldReduceMotion ? INSTANT : ENTER_TRANSITION}
          >
            <span
              aria-hidden="true"
              className={cn(
                "absolute size-2 rotate-45 border-foreground/10 bg-background",
                isHorizontal
                  ? "-top-1 left-1/2 -translate-x-1/2 border-t border-l"
                  : "top-4 -left-1 border-b border-l"
              )}
            />
            {tool.items?.map((item, index) => {
              const ItemIcon = item.icon;
              const isItemActive = resolvedActiveTool === item.id;
              return (
                <button
                  aria-label={item.label}
                  aria-pressed={isItemActive}
                  className={cn(
                    "flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-foreground/70 text-sm transition-colors ease-out hover:bg-foreground/5 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-1",
                    isItemActive && "bg-foreground/10 text-foreground",
                    flyoutFocusedIndex === index && "bg-foreground/5"
                  )}
                  key={item.id}
                  onClick={() => {
                    selectTool(item.id);
                    toolButtonRefs.current.get(tool.id)?.focus();
                  }}
                  ref={(el) => {
                    if (el) {
                      flyoutItemRefs.current.set(item.id, el);
                    } else {
                      flyoutItemRefs.current.delete(item.id);
                    }
                  }}
                  tabIndex={-1}
                  type="button"
                >
                  <ItemIcon className="size-4 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.shortcut ? (
                    <span className="font-medium text-[10px] text-foreground/40 uppercase tabular-nums">
                      {item.shortcut}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );

  const toolbarPanel = (
    <div className="relative">
      <div
        aria-label="Vector editor tools"
        aria-orientation={orientation}
        className={cn(
          "flex items-center gap-1 p-1.5",
          PANEL_SURFACE,
          isHorizontal ? "flex-row" : "flex-col"
        )}
        onKeyDown={handleToolbarKeyDown}
        role="toolbar"
      >
        {tools.map((tool) => {
          const isActive = tool.id === activeOwnerId;
          const activeItem = tool.items?.find(
            (item) => item.id === resolvedActiveTool
          );
          // Figma-style: the cell adopts the icon of the variant last used.
          const Icon = (isActive && activeItem?.icon) || tool.icon;
          const isFocusable = tool.id === focusedToolId;
          const hasItems = Boolean(tool.items?.length);
          const isFlyoutOpen = openFlyoutId === tool.id;
          const label = (isActive && activeItem?.label) || tool.label;

          return (
            <div className="relative size-9 shrink-0" key={tool.id}>
              {isActive ? (
                <motion.span
                  className="absolute inset-0 rounded-xl bg-foreground/10"
                  layoutId={`vector-editor-toolbar-pill-${pillId}`}
                  transition={shouldReduceMotion ? INSTANT : PILL_SPRING}
                />
              ) : null}
              <button
                aria-expanded={hasItems ? isFlyoutOpen : undefined}
                aria-haspopup={hasItems ? "menu" : undefined}
                aria-label={label}
                aria-pressed={isActive}
                className={cn(
                  "absolute inset-0 flex cursor-pointer items-center justify-center rounded-xl text-foreground/60",
                  "transition-[color,transform] duration-150 ease-out active:scale-[0.92]",
                  "hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2",
                  "motion-reduce:transition-none motion-reduce:active:scale-100",
                  isActive && "text-foreground"
                )}
                onClick={() => handleToolClick(tool)}
                onPointerCancel={clearLongPressTimer}
                onPointerDown={() => handleToolPointerDown(tool)}
                onPointerLeave={clearLongPressTimer}
                onPointerUp={clearLongPressTimer}
                ref={(el) => {
                  if (el) {
                    toolButtonRefs.current.set(tool.id, el);
                  } else {
                    toolButtonRefs.current.delete(tool.id);
                  }
                }}
                tabIndex={isFocusable ? 0 : -1}
                title={
                  tool.shortcut
                    ? `${label} (${tool.shortcut.toUpperCase()})`
                    : label
                }
                type="button"
              >
                <Icon className="size-4" />
              </button>
              {hasItems ? (
                <button
                  aria-label={`${tool.label} options`}
                  className={cn(
                    "absolute right-0 bottom-0 flex size-3.5 cursor-pointer items-end justify-end rounded-br-xl pr-[3px] pb-[3px]",
                    "text-foreground/25 transition-colors ease-out hover:text-foreground/70",
                    isActive && "text-foreground/45"
                  )}
                  onClick={(event) => handleCornerClick(tool, event)}
                  tabIndex={-1}
                  type="button"
                >
                  <CornerTriangle />
                </button>
              ) : null}
              {hasItems ? renderFlyout(tool) : null}
            </div>
          );
        })}
      </div>

      <div
        className={cn(
          "absolute z-20",
          // Vertical flyouts already own the right-hand side, so the properties
          // panel goes below the toolbar in both orientations.
          isHorizontal
            ? "top-full left-1/2 mt-1.5 -translate-x-1/2"
            : "top-full left-0 mt-1.5"
        )}
      >
        <AnimatePresence>
          {properties ? (
            <motion.div
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={cn("w-max p-2", PANEL_SURFACE)}
              exit={
                shouldReduceMotion
                  ? { opacity: 0, transition: INSTANT }
                  : {
                      opacity: 0,
                      scale: 0.98,
                      transition: EXIT_TRANSITION,
                      y: -4,
                    }
              }
              initial={
                shouldReduceMotion
                  ? { opacity: 1, scale: 1, y: 0 }
                  : { opacity: 0, scale: 0.98, y: -4 }
              }
              style={{
                transformOrigin: isHorizontal ? "top center" : "top left",
              }}
              transition={shouldReduceMotion ? INSTANT : ENTER_TRANSITION}
            >
              {properties}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );

  if (!floating) {
    return (
      <div className={cn("relative", className)} ref={boundsRef}>
        {toolbarPanel}
      </div>
    );
  }

  return (
    <div
      className={cn("pointer-events-none absolute inset-0", className)}
      ref={boundsRef}
    >
      <div className="absolute inset-x-0 top-4 flex justify-center">
        <motion.div
          className="pointer-events-auto"
          drag
          dragConstraints={boundsRef}
          dragElastic={0}
          dragMomentum={false}
          style={{ touchAction: "none" }}
        >
          {toolbarPanel}
        </motion.div>
      </div>
    </div>
  );
}
