"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { Pin } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { KeyboardEvent, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_MAX_PINNED = 5;

/* -------------------------------------------------------------------------- */
/* Motion tokens                                                              */
/* -------------------------------------------------------------------------- */

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];
const INSTANT = { duration: 0 };
/** Entrance/exit of a brand-new row — restrained. */
const ENTER_SPRING = { bounce: 0.1, duration: 0.25, type: "spring" as const };
/** Leaving is the user's decision already made — get out of the way faster. */
const EXIT_TRANSITION = { duration: 0.15, ease: EASE_OUT };
/** The row launching into (or back out of) the pinned group — real overshoot. */
const LAUNCH_SPRING = { bounce: 0.3, duration: 0.4, type: "spring" as const };
/** The pin icon's own, snappier spring. */
const PIN_SPRING = { bounce: 0.32, duration: 0.2, type: "spring" as const };
/** Rows closing the gap settle one after the other instead of as a rigid block. */
const STAGGER_STEP = 0.025;
const MAX_STAGGER = 0.1;
/**
 * The landing pop, as a damped squash rather than an inflate. A row that grows
 * past 1 pushes outside the list's box, and the list almost always sits inside
 * a scroller — so the pop got sliced off exactly when it was biggest. Every
 * keyframe here stays at or below 1, so the row can never breach its own
 * bounds no matter how wide it is; the compression settles in two decaying
 * steps, which is how weight actually lands.
 */
const POP_SCALE = [1, 0.985, 0.997, 1];
const POP_TIMES = [0, 0.3, 0.62, 1];
const POP_DURATION = 0.34;
const POP_RESET_MS = 420;
const PINNED_ROTATION = 45;
/**
 * Rows never sit flush against the list's edge: 4px of padding keeps the
 * landing rebound, the launch spring's overshoot and the 4px focus ring
 * (2px ring + 2px offset) inside whatever clips this list.
 */
const ROW_HALO = "p-1";

export type PinnedListItem = {
  icon?: ReactNode;
  id: string;
  meta?: string;
  pinned?: boolean;
  title: string;
};

export type PinnedListProps = {
  className?: string;
  emptyPinnedMessage?: string;
  items: PinnedListItem[];
  /** Names the list for assistive technology. */
  label?: string;
  maxPinned?: number;
  onPinnedChange?: (ids: string[]) => void;
  pinnedIds?: string[];
  renderItem?: (item: PinnedListItem, isPinned: boolean) => ReactNode;
  showDivider?: boolean;
};

/* -------------------------------------------------------------------------- */
/* Row                                                                       */
/* -------------------------------------------------------------------------- */

type RowProps = {
  groupIndex: number;
  isFocused: boolean;
  isPinned: boolean;
  item: PinnedListItem;
  justPinned: boolean;
  onKeyDownRow: (event: KeyboardEvent<HTMLDivElement>, index: number) => void;
  onTogglePin: (id: string) => void;
  pinDisabled: boolean;
  registerRef: (id: string, el: HTMLDivElement | null) => void;
  renderItem?: (item: PinnedListItem, isPinned: boolean) => ReactNode;
  rowIndex: number;
  shouldReduceMotion: boolean;
};

const Row = ({
  groupIndex,
  isFocused,
  isPinned,
  item,
  justPinned,
  onKeyDownRow,
  onTogglePin,
  pinDisabled,
  registerRef,
  renderItem,
  rowIndex,
  shouldReduceMotion,
}: RowProps) => {
  // The row that was just acted on leads; the rows closing the gap trail it.
  const layoutDelay = isPinned
    ? 0
    : Math.min(groupIndex * STAGGER_STEP, MAX_STAGGER);

  return (
    <motion.li
      className="list-none"
      layout={shouldReduceMotion ? false : "position"}
      transition={
        shouldReduceMotion
          ? INSTANT
          : {
              default: ENTER_SPRING,
              layout: { ...LAUNCH_SPRING, delay: layoutDelay },
            }
      }
    >
      {/* The row itself is the control: it carries the roving tabindex, so
          Arrow/Home/End/P all reach a handler that is actually focused. */}
      <motion.div
        animate={
          justPinned && !shouldReduceMotion
            ? { scale: POP_SCALE }
            : { scale: 1 }
        }
        aria-disabled={pinDisabled || undefined}
        aria-label={`${isPinned ? "Unpin" : "Pin"} ${item.title}`}
        aria-pressed={isPinned}
        className={cn(
          "group relative flex items-center gap-3 rounded-xl border p-3 outline-none",
          "transition-[background-color,border-color,box-shadow] duration-200 ease-out",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          // Pinned rows are raised, not tinted: a solid surface lifted off the
          // list with a real shadow and a crisper edge, the way the rest of the
          // library marks a selected surface. Dark mode lifts with light
          // instead, because a shadow has nothing to fall on there.
          isPinned
            ? "border-foreground/15 bg-background shadow-black/[0.07] shadow-sm dark:border-foreground/20 dark:bg-foreground/[0.07] dark:shadow-none"
            : "border-foreground/[0.08] bg-transparent",
          pinDisabled
            ? "cursor-not-allowed opacity-60"
            : "cursor-pointer hover:border-foreground/20"
        )}
        initial={false}
        onClick={() => {
          if (!pinDisabled) {
            onTogglePin(item.id);
          }
        }}
        onKeyDown={(event) => onKeyDownRow(event, rowIndex)}
        ref={(el) => {
          registerRef(item.id, el);
        }}
        role="button"
        tabIndex={isFocused ? 0 : -1}
        transition={
          shouldReduceMotion
            ? INSTANT
            : { duration: POP_DURATION, ease: EASE_OUT, times: POP_TIMES }
        }
      >
        {/* The only piece of brand colour on the row: a short rail on the
            leading edge. It grows out of nothing on pin, so the state change
            is structural rather than a rectangle of fill appearing. */}
        <motion.span
          animate={{
            opacity: isPinned ? 1 : 0,
            scaleY: isPinned ? 1 : 0.2,
          }}
          aria-hidden="true"
          className="absolute top-1/2 left-0 h-5 w-[3px] rounded-r-full bg-brand"
          initial={false}
          style={{ y: "-50%" }}
          transition={shouldReduceMotion ? INSTANT : PIN_SPRING}
        />
        <div className="min-w-0 flex-1">
          {renderItem ? (
            renderItem(item, isPinned)
          ) : (
            <div className="flex items-center gap-2">
              {item.icon ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "shrink-0 transition-colors duration-200",
                    isPinned ? "text-foreground" : "text-foreground/45"
                  )}
                >
                  {item.icon}
                </span>
              ) : null}
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground text-sm">
                  {item.title}
                </p>
                {item.meta ? (
                  <p className="truncate text-muted-foreground text-xs">
                    {item.meta}
                  </p>
                ) : null}
              </div>
            </div>
          )}
        </div>
        <span
          aria-hidden="true"
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors duration-200",
            isPinned
              ? "text-brand"
              : "text-foreground/40 group-hover:bg-foreground/5 group-hover:text-foreground"
          )}
        >
          <motion.span
            animate={{ rotate: isPinned ? PINNED_ROTATION : 0 }}
            className="flex items-center justify-center"
            initial={false}
            transition={shouldReduceMotion ? INSTANT : PIN_SPRING}
          >
            <Pin className={cn("size-4", isPinned && "fill-current")} />
          </motion.span>
        </span>
      </motion.div>
    </motion.li>
  );
};

/* -------------------------------------------------------------------------- */
/* Root                                                                      */
/* -------------------------------------------------------------------------- */

const PinnedList = ({
  className,
  emptyPinnedMessage = "Pin an item to keep it at the top.",
  items,
  label = "Pinnable items",
  maxPinned = DEFAULT_MAX_PINNED,
  onPinnedChange,
  pinnedIds,
  renderItem,
  showDivider = true,
}: PinnedListProps) => {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const [internalPinned, setInternalPinned] = useState<string[]>(() =>
    items.filter((item) => item.pinned).map((item) => item.id)
  );
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [justPinnedId, setJustPinnedId] = useState<string | null>(null);
  const rowRefs = useRef(new Map<string, HTMLDivElement>());
  // A row that moves between the two groups is re-inserted in the DOM, which
  // can drop focus. Remember which row to hand focus back to after the move.
  const restoreFocusRef = useRef<string | null>(null);

  const isControlled = pinnedIds !== undefined;
  const pinned = isControlled ? pinnedIds : internalPinned;

  useEffect(() => {
    if (!justPinnedId) {
      return;
    }
    const timer = setTimeout(() => setJustPinnedId(null), POP_RESET_MS);
    return () => clearTimeout(timer);
  }, [justPinnedId]);

  const pinnedItems = useMemo(
    () => items.filter((item) => pinned.includes(item.id)),
    [items, pinned]
  );
  const unpinnedItems = useMemo(
    () => items.filter((item) => !pinned.includes(item.id)),
    [items, pinned]
  );
  const orderedItems = useMemo(
    () => [...pinnedItems, ...unpinnedItems],
    [pinnedItems, unpinnedItems]
  );

  // Exactly one row is tabbable at a time, and it is always a row that exists.
  const activeFocusId =
    focusedId && orderedItems.some((item) => item.id === focusedId)
      ? focusedId
      : (orderedItems[0]?.id ?? null);

  const registerRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) {
      rowRefs.current.set(id, el);
    } else {
      rowRefs.current.delete(id);
    }
  }, []);

  const setPinned = (next: string[]) => {
    if (!isControlled) {
      setInternalPinned(next);
    }
    onPinnedChange?.(next);
  };

  const togglePin = (id: string) => {
    // Keep focus on the row the user acted on, even though pinning moves it.
    if (rowRefs.current.get(id) === document.activeElement) {
      restoreFocusRef.current = id;
    }
    setFocusedId(id);

    if (pinned.includes(id)) {
      setJustPinnedId(null);
      setPinned(pinned.filter((pinnedId) => pinnedId !== id));
      return;
    }
    if (pinned.length >= maxPinned) {
      return;
    }
    setJustPinnedId(id);
    setPinned([...pinned, id]);
  };

  useEffect(() => {
    const id = restoreFocusRef.current;
    if (!id) {
      return;
    }
    restoreFocusRef.current = null;
    rowRefs.current.get(id)?.focus();
  });

  const focusRowAt = (index: number) => {
    const total = orderedItems.length;
    if (total === 0) {
      return;
    }
    const nextItem = orderedItems[((index % total) + total) % total];
    setFocusedId(nextItem.id);
    rowRefs.current.get(nextItem.id)?.focus();
  };

  const handleKeyDownRow = (
    event: KeyboardEvent<HTMLDivElement>,
    index: number
  ) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      focusRowAt(index + 1);
      return;
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      focusRowAt(index - 1);
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      focusRowAt(0);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      focusRowAt(orderedItems.length - 1);
      return;
    }
    if (
      event.key === "p" ||
      event.key === "P" ||
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      const item = orderedItems[index];
      if (item) {
        togglePin(item.id);
      }
    }
  };

  const pinDisabled = pinned.length >= maxPinned;
  const showEmptyPinned = pinnedItems.length === 0;
  const showSeparator =
    showDivider && pinnedItems.length > 0 && unpinnedItems.length > 0;

  return (
    <div className={cn("flex flex-col", className)}>
      {/* One list, not two: a pinned row is reordered inside its own parent
          instead of being torn out of one list and rebuilt in another. */}
      <ul aria-label={label} className={cn("flex flex-col gap-2", ROW_HALO)}>
        {/* popLayout takes the leaving placeholder out of flow on the first
            frame, so the rows above it move as one — and, because nothing is
            left waiting on a layout animation, its exit actually completes. */}
        <AnimatePresence initial={false} mode="popLayout">
          {showEmptyPinned ? (
            <motion.li
              animate={{ opacity: 1 }}
              className="list-none rounded-xl border border-foreground/15 border-dashed p-3 text-muted-foreground text-sm"
              exit={
                shouldReduceMotion
                  ? { opacity: 0, transition: INSTANT }
                  : { opacity: 0, transition: EXIT_TRANSITION }
              }
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              key="empty-pinned"
              transition={shouldReduceMotion ? INSTANT : ENTER_SPRING}
            >
              {emptyPinnedMessage}
            </motion.li>
          ) : null}
        </AnimatePresence>

        {pinnedItems.map((item, groupIndex) => (
          <Row
            groupIndex={groupIndex}
            isFocused={activeFocusId === item.id}
            isPinned
            item={item}
            justPinned={justPinnedId === item.id}
            key={item.id}
            onKeyDownRow={handleKeyDownRow}
            onTogglePin={togglePin}
            pinDisabled={false}
            registerRef={registerRef}
            renderItem={renderItem}
            rowIndex={groupIndex}
            shouldReduceMotion={shouldReduceMotion}
          />
        ))}

        {/* A hairline is below the threshold worth animating; it also keeps
            the exiting-child machinery off the one element in the list that
            has no content of its own. */}
        {showSeparator ? (
          <li
            aria-hidden="true"
            className="my-1 list-none border-foreground/10 border-t"
          />
        ) : null}

        {unpinnedItems.map((item, groupIndex) => (
          <Row
            groupIndex={groupIndex}
            isFocused={activeFocusId === item.id}
            isPinned={false}
            item={item}
            justPinned={false}
            key={item.id}
            onKeyDownRow={handleKeyDownRow}
            onTogglePin={togglePin}
            pinDisabled={pinDisabled}
            registerRef={registerRef}
            renderItem={renderItem}
            rowIndex={pinnedItems.length + groupIndex}
            shouldReduceMotion={shouldReduceMotion}
          />
        ))}
      </ul>
    </div>
  );
};

export default PinnedList;
