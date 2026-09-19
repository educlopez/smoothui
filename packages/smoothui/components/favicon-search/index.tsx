"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { Search } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { KeyboardEvent, ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { SPRING_DEFAULT } from "../../lib/animation";

const DEFAULT_SKELETON_ROWS = 4;
const STAGGER_DELAY_S = 0.03;
const SKELETON_ROW_IDS = Array.from(
  { length: DEFAULT_SKELETON_ROWS },
  (_, index) => `skeleton-${index}`
);

export interface FaviconSearchResult {
  description?: string;
  favicon?: string;
  id: string;
  title: string;
  url: string;
}

export interface FaviconSearchProps {
  className?: string;
  emptyMessage?: string;
  groupLabel?: string;
  hotkey?: string;
  loading?: boolean;
  maxResults?: number;
  onSelect?: (result: FaviconSearchResult) => void;
  onValueChange?: (value: string) => void;
  results: FaviconSearchResult[];
  showShortcut?: boolean;
  value?: string;
}

const getFaviconSrc = (result: FaviconSearchResult): string | undefined => {
  if (result.favicon) {
    return result.favicon;
  }
  try {
    const host = new URL(result.url).hostname;
    return `https://www.google.com/s2/favicons?domain=${host}&sz=64`;
    // biome-ignore lint/suspicious/noEmptyBlockStatements: an invalid result.url intentionally falls through to the monogram tile
  } catch {}
};

const highlightMatch = (text: string, query: string): ReactNode => {
  if (!query) {
    return text;
  }
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) {
    return text;
  }
  const before = text.slice(0, index);
  const match = text.slice(index, index + query.length);
  const after = text.slice(index + query.length);
  return (
    <>
      {before}
      <mark className="rounded-sm bg-brand/20 text-foreground">{match}</mark>
      {after}
    </>
  );
};

interface FaviconTileProps {
  result: FaviconSearchResult;
}

const FaviconTile = ({ result }: FaviconTileProps) => {
  const [hasError, setHasError] = useState(false);
  const src = hasError ? undefined : getFaviconSrc(result);

  if (!src) {
    return (
      <span
        aria-hidden="true"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-muted font-semibold text-[10px] text-muted-foreground uppercase"
      >
        {result.title.charAt(0)}
      </span>
    );
  }

  return (
    <img
      alt=""
      aria-hidden="true"
      className="h-6 w-6 shrink-0 rounded"
      loading="lazy"
      onError={() => setHasError(true)}
      src={src}
    />
  );
};

export default function FaviconSearch({
  results,
  value: valueProp,
  onValueChange,
  onSelect,
  loading = false,
  emptyMessage = "No results found",
  groupLabel = "Search results",
  showShortcut = false,
  hotkey = "k",
  maxResults,
  className,
}: FaviconSearchProps) {
  const shouldReduceMotion = useReducedMotion();
  const uid = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState("");
  const value = isControlled ? (valueProp as string) : internalValue;

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const displayedResults =
    typeof maxResults === "number" ? results.slice(0, maxResults) : results;

  const listboxId = `${uid}-listbox`;
  const activeId =
    activeIndex >= 0 && displayedResults[activeIndex]
      ? `${uid}-option-${activeIndex}`
      : undefined;

  // biome-ignore lint/correctness/useExhaustiveDependencies: value/loading intentionally reset the highlighted index whenever the result set changes
  useEffect(() => {
    setActiveIndex(-1);
  }, [value, loading]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!showShortcut) {
      return;
    }
    const handleHotkey = (event: globalThis.KeyboardEvent) => {
      const isMeta = event.metaKey || event.ctrlKey;
      if (isMeta && event.key.toLowerCase() === hotkey.toLowerCase()) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleHotkey);
    return () => document.removeEventListener("keydown", handleHotkey);
  }, [showShortcut, hotkey]);

  const handleChange = (next: string) => {
    if (!isControlled) {
      setInternalValue(next);
    }
    onValueChange?.(next);
  };

  const handleSelect = (result: FaviconSearchResult) => {
    onSelect?.(result);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }
    if (!isOpen && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      setIsOpen(true);
      return;
    }
    if (displayedResults.length === 0) {
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % displayedResults.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex(
        (prev) => (prev - 1 + displayedResults.length) % displayedResults.length
      );
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      const result = displayedResults[activeIndex];
      if (result) {
        handleSelect(result);
      }
    }
  };

  const showPanel =
    isOpen && (loading || displayedResults.length > 0 || value.length > 0);

  const renderSkeletonRows = () =>
    SKELETON_ROW_IDS.map((rowId) => (
      <div
        aria-hidden="true"
        className="flex items-center gap-3 px-4 py-2"
        key={rowId}
      >
        <span
          className={cn(
            "h-6 w-6 shrink-0 rounded bg-muted",
            !shouldReduceMotion && "animate-pulse"
          )}
        />
        <span className="flex-1 space-y-1.5">
          <span
            className={cn(
              "block h-3 w-2/3 rounded bg-muted",
              !shouldReduceMotion && "animate-pulse"
            )}
          />
          <span
            className={cn(
              "block h-2.5 w-1/3 rounded bg-muted",
              !shouldReduceMotion && "animate-pulse"
            )}
          />
        </span>
      </div>
    ));

  const renderResultRow = (result: FaviconSearchResult, index: number) => {
    const isActive = index === activeIndex;
    return (
      <motion.div
        animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        aria-selected={isActive}
        exit={
          shouldReduceMotion
            ? { opacity: 0, transition: { duration: 0 } }
            : { opacity: 0 }
        }
        id={`${uid}-option-${index}`}
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
        key={result.id}
        role="option"
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { ...SPRING_DEFAULT, delay: index * STAGGER_DELAY_S }
        }
      >
        <button
          className={cn(
            "relative flex min-h-[44px] w-full items-center gap-3 px-4 text-left text-sm",
            !shouldReduceMotion && isActive && "text-foreground",
            shouldReduceMotion && isActive && "bg-muted"
          )}
          onClick={() => handleSelect(result)}
          onMouseEnter={() => setActiveIndex(index)}
          type="button"
        >
          {isActive && !shouldReduceMotion ? (
            <motion.span
              className="absolute inset-0 rounded-md bg-muted"
              layoutId={`${uid}-highlight`}
              transition={SPRING_DEFAULT}
            />
          ) : null}
          <span className="relative z-10">
            <FaviconTile result={result} />
          </span>
          <span className="relative z-10 min-w-0 flex-1">
            <span className="block truncate font-medium">
              {highlightMatch(result.title, value)}
            </span>
            {result.description ? (
              <span className="block truncate text-muted-foreground text-xs">
                {highlightMatch(result.description, value)}
              </span>
            ) : null}
          </span>
        </button>
      </motion.div>
    );
  };

  const renderPanelBody = () => {
    if (loading) {
      return renderSkeletonRows();
    }
    if (displayedResults.length > 0) {
      return (
        <AnimatePresence mode="popLayout">
          {displayedResults.map((result, index) =>
            renderResultRow(result, index)
          )}
        </AnimatePresence>
      );
    }
    return (
      <div className="px-4 py-8 text-center text-muted-foreground text-sm">
        {emptyMessage}
      </div>
    );
  };

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        />
        <input
          aria-activedescendant={activeId}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label="Search"
          className="min-h-[44px] w-full rounded-lg border bg-background pr-16 pl-9 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onChange={(event) => handleChange(event.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search…"
          ref={inputRef}
          role="combobox"
          type="text"
          value={value}
        />
        {showShortcut && value.length === 0 ? (
          <kbd className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            {`⌘${hotkey.toUpperCase()}`}
          </kbd>
        ) : null}
      </div>

      <p aria-live="polite" className="sr-only" role="status">
        {loading ? "Loading results…" : ""}
      </p>

      <AnimatePresence>
        {showPanel ? (
          <motion.div
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            className="absolute z-50 mt-2 w-full overflow-hidden rounded-lg border bg-background shadow-lg"
            exit={
              shouldReduceMotion
                ? { opacity: 0, transition: { duration: 0 } }
                : { opacity: 0, y: -4 }
            }
            initial={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -4 }
            }
            transition={shouldReduceMotion ? { duration: 0 } : SPRING_DEFAULT}
          >
            <div
              aria-busy={loading}
              aria-label={groupLabel}
              className="max-h-80 overflow-y-auto py-2"
              id={listboxId}
              role="listbox"
            >
              {renderPanelBody()}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
