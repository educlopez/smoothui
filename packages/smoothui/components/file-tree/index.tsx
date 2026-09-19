"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { ChevronRight, File, Folder, FolderOpen } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import {
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type FileTreeItem = {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileTreeItem[];
  icon?: ReactNode;
  badge?: ReactNode;
};

export type FileTreeProps = {
  /** Additional CSS classes */
  className?: string;
  /** Ids expanded by default (uncontrolled) */
  defaultExpanded?: string[];
  /** Controlled list of expanded folder ids */
  expanded?: string[];
  /** Indentation per level, in pixels */
  indent?: number;
  /** Recursive tree data */
  items: FileTreeItem[];
  /** Called when the expanded set changes */
  onExpandedChange?: (expanded: string[]) => void;
  /** Called when the selected item changes */
  onSelectedChange?: (id: string) => void;
  /** Controlled selected item id */
  selected?: string;
  /** Draw vertical guide lines connecting nested levels */
  showLines?: boolean;
};

const DEFAULT_INDENT = 16;
const ROTATE_OPEN = 90;
const ROTATE_CLOSED = 0;
const TYPEAHEAD_PATTERN = /^[a-z0-9]$/i;

type FlatNode = {
  item: FileTreeItem;
  level: number;
  parentId: string | null;
};

const flattenVisible = (
  nodes: FileTreeItem[],
  expandedSet: Set<string>,
  level: number,
  parentId: string | null
): FlatNode[] => {
  const result: FlatNode[] = [];
  for (const node of nodes) {
    result.push({ item: node, level, parentId });
    if (
      node.type === "folder" &&
      node.children &&
      node.children.length > 0 &&
      expandedSet.has(node.id)
    ) {
      result.push(
        ...flattenVisible(node.children, expandedSet, level + 1, node.id)
      );
    }
  }
  return result;
};

type FileTreeRowProps = {
  expandedSet: Set<string>;
  focusedId: string | undefined;
  indent: number;
  level: number;
  node: FileTreeItem;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>, id: string) => void;
  onSelect: (id: string) => void;
  onToggle: (id: string, force?: boolean) => void;
  registerRef: (id: string, el: HTMLDivElement | null) => void;
  selectedId: string | undefined;
  shouldReduceMotion: boolean;
  showLines: boolean;
};

const FileTreeRow = ({
  node,
  level,
  indent,
  showLines,
  expandedSet,
  selectedId,
  focusedId,
  shouldReduceMotion,
  onToggle,
  onSelect,
  onKeyDown,
  registerRef,
}: FileTreeRowProps) => {
  const isFolder = node.type === "folder";
  const hasChildren = isFolder && Boolean(node.children?.length);
  const isOpen = hasChildren && expandedSet.has(node.id);
  const isSelected = selectedId === node.id;
  const isFocused = focusedId === node.id;
  const contentRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(isOpen);
  const [height, setHeight] = useState<number | "auto">(isOpen ? "auto" : 0);

  useLayoutEffect(() => {
    if (!hasChildren) {
      return;
    }
    if (wasOpenRef.current === isOpen) {
      return;
    }
    wasOpenRef.current = isOpen;
    const el = contentRef.current;
    if (!el) {
      return;
    }

    if (isOpen) {
      setHeight(el.scrollHeight);
      return;
    }

    setHeight(el.scrollHeight);
    const raf = requestAnimationFrame(() => setHeight(0));
    return () => cancelAnimationFrame(raf);
  }, [isOpen, hasChildren]);

  const defaultIcon = isFolder ? (
    isOpen ? (
      <FolderOpen className="text-brand" size={16} />
    ) : (
      <Folder className="text-brand" size={16} />
    )
  ) : (
    <File
      className={isSelected ? "text-foreground" : "text-muted-foreground"}
      size={16}
    />
  );

  return (
    <div role="none">
      <div
        aria-expanded={isFolder ? isOpen : undefined}
        aria-level={level}
        aria-selected={isSelected}
        className={cn(
          "flex cursor-pointer select-none items-center gap-1.5 rounded-md px-1.5 py-1 outline-none",
          "transition-[background-color,box-shadow] duration-150 ease-out",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          // A left rail would sit exactly on the indentation guide, so the
          // selected row lifts instead: a solid surface with a hairline edge
          // and a shallow shadow, reading along the whole row. Dark mode lifts
          // with light, because a shadow has nothing to fall on there.
          isSelected
            ? "bg-background shadow-[0_0_0_1px_rgb(0_0_0/0.08),0_1px_2px_-1px_rgb(0_0_0/0.10)] dark:bg-foreground/[0.07] dark:shadow-[0_0_0_1px_rgb(255_255_255/0.10)]"
            : "hover:bg-foreground/[0.04]"
        )}
        onClick={() => {
          onSelect(node.id);
          if (isFolder) {
            onToggle(node.id);
          }
        }}
        onKeyDown={(event) => onKeyDown(event, node.id)}
        ref={(el) => registerRef(node.id, el)}
        role="treeitem"
        style={{ paddingLeft: level * indent }}
        tabIndex={isFocused ? 0 : -1}
      >
        <span className="flex h-4 w-4 shrink-0 items-center justify-center">
          {isFolder && (
            <motion.span
              animate={{ rotate: isOpen ? ROTATE_OPEN : ROTATE_CLOSED }}
              className="flex"
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { bounce: 0.1, duration: 0.25, type: "spring" }
              }
            >
              <ChevronRight size={14} />
            </motion.span>
          )}
        </span>
        <span className="flex shrink-0 items-center">
          {node.icon ?? defaultIcon}
        </span>
        <span
          className={cn(
            "flex-1 truncate text-foreground text-sm",
            isSelected && "font-medium"
          )}
        >
          {node.name}
        </span>
        {node.badge ? (
          <span className="ml-auto shrink-0 text-muted-foreground text-xs">
            {node.badge}
          </span>
        ) : null}
      </div>

      {hasChildren ? (
        // The subtree stays mounted so the height can animate, which would
        // otherwise leave collapsed children exposed as reachable `treeitem`s:
        // `height: 0` hides them visually but not from assistive tech, so a
        // screen reader walking the DOM meets rows the widget considers hidden.
        // `aria-hidden` + `inert` take them out of both the a11y tree and the
        // tab order while collapsed, without giving up the animation.
        <motion.div
          animate={{ height }}
          aria-hidden={isOpen ? undefined : "true"}
          inert={isOpen ? undefined : true}
          initial={false}
          onAnimationComplete={() => {
            if (isOpen) {
              setHeight("auto");
            }
          }}
          style={{ overflow: "hidden" }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.25, ease: [0.645, 0.045, 0.355, 1] }
          }
        >
          <div
            className={cn(
              "relative",
              showLines &&
                "before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-border before:content-['']"
            )}
            ref={contentRef}
            role="group"
            style={{ marginLeft: (level - 1) * indent + indent / 2 }}
          >
            {node.children?.map((child) => (
              <FileTreeRow
                expandedSet={expandedSet}
                focusedId={focusedId}
                indent={indent}
                key={child.id}
                level={level + 1}
                node={child}
                onKeyDown={onKeyDown}
                onSelect={onSelect}
                onToggle={onToggle}
                registerRef={registerRef}
                selectedId={selectedId}
                shouldReduceMotion={shouldReduceMotion}
                showLines={showLines}
              />
            ))}
          </div>
        </motion.div>
      ) : null}
    </div>
  );
};

const FileTree = ({
  items,
  defaultExpanded,
  expanded: expandedProp,
  onExpandedChange,
  selected: selectedProp,
  onSelectedChange,
  indent = DEFAULT_INDENT,
  showLines = false,
  className,
}: FileTreeProps) => {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const isExpandedControlled = expandedProp !== undefined;
  const [internalExpanded, setInternalExpanded] = useState<string[]>(
    defaultExpanded ?? []
  );
  const expandedList = isExpandedControlled ? expandedProp : internalExpanded;
  const expandedSet = useMemo(() => new Set(expandedList), [expandedList]);

  const isSelectedControlled = selectedProp !== undefined;
  const [internalSelected, setInternalSelected] = useState<string | undefined>(
    undefined
  );
  const selectedId = isSelectedControlled ? selectedProp : internalSelected;

  const flatList = useMemo(
    () => flattenVisible(items, expandedSet, 1, null),
    [items, expandedSet]
  );
  const [focusedId, setFocusedId] = useState<string | undefined>(undefined);
  const activeFocusId = focusedId ?? selectedId ?? flatList[0]?.item.id;

  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const registerRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) {
      itemRefs.current.set(id, el);
    } else {
      itemRefs.current.delete(id);
    }
  }, []);
  const focusItem = useCallback((id: string | undefined) => {
    if (id) {
      itemRefs.current.get(id)?.focus();
    }
  }, []);

  const setExpandedList = useCallback(
    (next: string[]) => {
      if (!isExpandedControlled) {
        setInternalExpanded(next);
      }
      onExpandedChange?.(next);
    },
    [isExpandedControlled, onExpandedChange]
  );

  const toggleExpanded = useCallback(
    (id: string, force?: boolean) => {
      const isOpen = expandedSet.has(id);
      const shouldOpen = force ?? !isOpen;
      if (shouldOpen === isOpen) {
        return;
      }
      setExpandedList(
        shouldOpen
          ? [...expandedList, id]
          : expandedList.filter((existing) => existing !== id)
      );
    },
    [expandedSet, expandedList, setExpandedList]
  );

  const handleSelect = useCallback(
    (id: string) => {
      if (!isSelectedControlled) {
        setInternalSelected(id);
      }
      onSelectedChange?.(id);
      setFocusedId(id);
    },
    [isSelectedControlled, onSelectedChange]
  );

  const flatIndexById = useMemo(() => {
    const map = new Map<string, number>();
    for (const [index, entry] of flatList.entries()) {
      map.set(entry.item.id, index);
    }
    return map;
  }, [flatList]);

  const moveFocusTo = useCallback(
    (id: string | undefined) => {
      if (!id) {
        return;
      }
      setFocusedId(id);
      focusItem(id);
    },
    [focusItem]
  );

  const typeahead = useCallback(
    (letter: string, fromIndex: number) => {
      const lower = letter.toLowerCase();
      const count = flatList.length;
      for (let offset = 1; offset <= count; offset++) {
        const index = (fromIndex + offset) % count;
        if (flatList[index].item.name.toLowerCase().startsWith(lower)) {
          moveFocusTo(flatList[index].item.id);
          return;
        }
      }
    },
    [flatList, moveFocusTo]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>, id: string) => {
      const index = flatIndexById.get(id);
      if (index === undefined) {
        return;
      }
      const entry = flatList[index];
      const node = entry.item;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          moveFocusTo(flatList[index + 1]?.item.id);
          break;
        case "ArrowUp":
          event.preventDefault();
          moveFocusTo(flatList[index - 1]?.item.id);
          break;
        case "ArrowRight":
          event.preventDefault();
          if (node.type === "folder") {
            if (expandedSet.has(node.id)) {
              const next = flatList[index + 1];
              if (next && next.parentId === node.id) {
                moveFocusTo(next.item.id);
              }
            } else {
              toggleExpanded(node.id, true);
            }
          }
          break;
        case "ArrowLeft":
          event.preventDefault();
          if (node.type === "folder" && expandedSet.has(node.id)) {
            toggleExpanded(node.id, false);
          } else if (entry.parentId) {
            moveFocusTo(entry.parentId);
          }
          break;
        case "Home":
          event.preventDefault();
          moveFocusTo(flatList[0]?.item.id);
          break;
        case "End":
          event.preventDefault();
          moveFocusTo(flatList.at(-1)?.item.id);
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          handleSelect(node.id);
          break;
        default:
          if (TYPEAHEAD_PATTERN.test(event.key)) {
            event.preventDefault();
            typeahead(event.key, index);
          }
          break;
      }
    },
    [
      flatIndexById,
      flatList,
      expandedSet,
      toggleExpanded,
      moveFocusTo,
      handleSelect,
      typeahead,
    ]
  );

  return (
    <div className={cn("select-none text-sm", className)} role="tree">
      {items.map((node) => (
        <FileTreeRow
          expandedSet={expandedSet}
          focusedId={activeFocusId}
          indent={indent}
          key={node.id}
          level={1}
          node={node}
          onKeyDown={handleKeyDown}
          onSelect={handleSelect}
          onToggle={toggleExpanded}
          registerRef={registerRef}
          selectedId={selectedId}
          shouldReduceMotion={shouldReduceMotion}
          showLines={showLines}
        />
      ))}
    </div>
  );
};

export default FileTree;
