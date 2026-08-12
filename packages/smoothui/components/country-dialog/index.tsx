"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import { Check, Search, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

const ROW_HEIGHT = 40;
const LIST_MAX_HEIGHT = 288;
const OVERSCAN_ROWS = 4;
const VIRTUALIZE_THRESHOLD = 50;
const FOCUS_DELAY_MS = 100;
const REGIONAL_INDICATOR_OFFSET = 0x1_f1_e6;
const CHAR_CODE_A = "A".charCodeAt(0);
const DIACRITIC_REGEX = /[̀-ͯ]/g;
const ISO_CODE_REGEX = /^[A-Za-z]{2}$/;

export interface Country {
  code: string;
  dialCode?: string;
  flag?: string;
  group?: string;
  name: string;
}

export interface CountryDialogProps {
  className?: string;
  countries: Country[];
  emptyMessage?: string;
  groupBy?: boolean;
  onOpenChange: (open: boolean) => void;
  onValueChange: (code: string) => void;
  open: boolean;
  placeholder?: string;
  recent?: string[];
  trigger?: ReactNode;
  value?: string;
}

type Row =
  | { id: string; kind: "header"; label: string }
  | { country: Country; id: string; kind: "option" };

const normalize = (input: string) =>
  input.normalize("NFD").replace(DIACRITIC_REGEX, "").toLowerCase();

const matchesQuery = (country: Country, query: string) => {
  const normalizedQuery = normalize(query);
  return (
    normalize(country.name).includes(normalizedQuery) ||
    normalize(country.code).includes(normalizedQuery) ||
    (country.dialCode
      ? normalize(country.dialCode).includes(normalizedQuery)
      : false)
  );
};

const getFlagEmoji = (code: string): string | null => {
  if (!ISO_CODE_REGEX.test(code)) {
    return null;
  }
  const upper = code.toUpperCase();
  const first = REGIONAL_INDICATOR_OFFSET + (upper.charCodeAt(0) - CHAR_CODE_A);
  const second =
    REGIONAL_INDICATOR_OFFSET + (upper.charCodeAt(1) - CHAR_CODE_A);
  return String.fromCodePoint(first, second);
};

const buildRows = (
  countries: Country[],
  query: string,
  recent: string[] | undefined,
  groupBy: boolean
): Row[] => {
  const trimmedQuery = query.trim();
  const filtered = trimmedQuery
    ? countries.filter((country) => matchesQuery(country, trimmedQuery))
    : countries;

  const rows: Row[] = [];

  if (!trimmedQuery && recent && recent.length > 0) {
    const recentCountries = recent
      .map((code) => countries.find((country) => country.code === code))
      .filter((country): country is Country => Boolean(country));

    if (recentCountries.length > 0) {
      rows.push({ id: "header-recent", kind: "header", label: "Recent" });
      for (const country of recentCountries) {
        rows.push({
          country,
          id: `option-recent-${country.code}`,
          kind: "option",
        });
      }
    }
  }

  if (groupBy) {
    const groups = new Map<string, Country[]>();
    for (const country of filtered) {
      const groupLabel = country.group ?? "Other";
      const existing = groups.get(groupLabel);
      if (existing) {
        existing.push(country);
      } else {
        groups.set(groupLabel, [country]);
      }
    }

    for (const [groupLabel, groupCountries] of groups) {
      rows.push({
        id: `header-group-${groupLabel}`,
        kind: "header",
        label: groupLabel,
      });
      for (const country of groupCountries) {
        rows.push({
          country,
          id: `option-group-${groupLabel}-${country.code}`,
          kind: "option",
        });
      }
    }

    return rows;
  }

  if (rows.length > 0) {
    rows.push({ id: "header-all", kind: "header", label: "All countries" });
  }
  for (const country of filtered) {
    rows.push({ country, id: `option-all-${country.code}`, kind: "option" });
  }

  return rows;
};

const CountryOption = ({
  country,
  highlighted,
  id,
  onSelect,
  selected,
}: {
  country: Country;
  highlighted: boolean;
  id: string;
  onSelect: () => void;
  selected: boolean;
}) => {
  const emoji = country.flag ?? getFlagEmoji(country.code);

  return (
    // biome-ignore lint/a11y/useFocusableInteractive: DOM focus intentionally stays on the search input (role="combobox" + aria-activedescendant above), not on this option, per the WAI-ARIA APG "editable combobox with list autocomplete" pattern.
    <div
      aria-selected={selected}
      className={cn(
        "flex min-h-[40px] cursor-pointer items-center gap-3 px-3 text-sm transition-colors",
        highlighted && "bg-muted",
        selected && "font-medium text-brand"
      )}
      id={id}
      onClick={onSelect}
      onMouseDown={(event) => event.preventDefault()}
      role="option"
    >
      <span aria-hidden="true" className="w-6 shrink-0 text-center text-base">
        {emoji ?? country.code}
      </span>
      <span className="min-w-0 flex-1 truncate">{country.name}</span>
      {country.dialCode ? (
        <span className="shrink-0 text-muted-foreground text-xs">
          {country.dialCode}
        </span>
      ) : null}
      {selected ? (
        <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-brand" />
      ) : null}
    </div>
  );
};

const CountryDialog = ({
  countries,
  value,
  onValueChange,
  open,
  onOpenChange,
  trigger,
  placeholder = "Search countries...",
  recent,
  groupBy = false,
  emptyMessage = "No countries found",
  className = "",
}: CountryDialogProps) => {
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [mounted, setMounted] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  const listboxId = useId();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Focus the search field on open, restore focus to whatever opened the dialog on close.
  useEffect(() => {
    if (open) {
      previousActiveElementRef.current = document.activeElement as HTMLElement;
      const timeoutId = setTimeout(() => {
        searchInputRef.current?.focus();
      }, FOCUS_DELAY_MS);
      return () => clearTimeout(timeoutId);
    }
    previousActiveElementRef.current?.focus();
  }, [open]);

  // Escape closes the dialog; Tab is trapped within it while open.
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
        return;
      }

      if (event.key === "Tab" && dialogRef.current) {
        const focusableElements = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        );
        const [firstElement] = focusableElements;
        const lastElement = focusableElements.at(-1);

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement?.focus();
          }
        } else if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const rows = useMemo(
    () => buildRows(countries, query, recent, groupBy),
    [countries, query, recent, groupBy]
  );

  const optionRows = useMemo(
    () =>
      rows.filter(
        (row): row is Row & { kind: "option" } => row.kind === "option"
      ),
    [rows]
  );

  const clampedHighlightedIndex =
    optionRows.length === 0
      ? -1
      : Math.min(highlightedIndex, optionRows.length - 1);
  const activeId =
    clampedHighlightedIndex >= 0
      ? optionRows[clampedHighlightedIndex]?.id
      : undefined;

  // Keep the highlighted row scrolled into view, including inside the virtualized window.
  useEffect(() => {
    const container = listRef.current;
    const highlighted = optionRows[clampedHighlightedIndex];
    if (!(container && highlighted)) {
      return;
    }
    const rowIndex = rows.findIndex((row) => row.id === highlighted.id);
    if (rowIndex === -1) {
      return;
    }
    const rowTop = rowIndex * ROW_HEIGHT;
    const rowBottom = rowTop + ROW_HEIGHT;
    if (rowTop < container.scrollTop) {
      container.scrollTop = rowTop;
    } else if (rowBottom > container.scrollTop + container.clientHeight) {
      container.scrollTop = rowBottom - container.clientHeight;
    }
  }, [clampedHighlightedIndex, optionRows, rows]);

  const handleSelect = (country: Country) => {
    onValueChange(country.code);
    onOpenChange(false);
  };

  const handleInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (optionRows.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((index) =>
        Math.min(index + 1, optionRows.length - 1)
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Home") {
      event.preventDefault();
      setHighlightedIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setHighlightedIndex(optionRows.length - 1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const target = optionRows[clampedHighlightedIndex];
      if (target) {
        handleSelect(target.country);
      }
    }
  };

  const handleQueryChange = (nextQuery: string) => {
    setQuery(nextQuery);
    setHighlightedIndex(0);
  };

  const handleClearSearch = () => {
    handleQueryChange("");
    searchInputRef.current?.focus();
  };

  // Windowing is skipped for grouped results: section headers make slice-window
  // math for a flat list impractical, and grouped lists are expected to be shorter.
  const shouldVirtualize = !groupBy && rows.length > VIRTUALIZE_THRESHOLD;
  const visibleRowCount =
    Math.ceil(LIST_MAX_HEIGHT / ROW_HEIGHT) + OVERSCAN_ROWS * 2;
  const startIndex = shouldVirtualize
    ? Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN_ROWS)
    : 0;
  const endIndex = shouldVirtualize
    ? Math.min(rows.length, startIndex + visibleRowCount)
    : rows.length;
  const visibleRows = rows.slice(startIndex, endIndex);
  const topPadding = shouldVirtualize ? startIndex * ROW_HEIGHT : 0;
  const bottomPadding = shouldVirtualize
    ? (rows.length - endIndex) * ROW_HEIGHT
    : 0;

  const dialogContent = (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[80] bg-background/70 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            onClick={() => onOpenChange(false)}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          />
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto px-4 py-16 sm:p-16"
            exit={{ opacity: 0 }}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          >
            <motion.div
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, scale: 1, y: 0 }
              }
              aria-label="Select a country"
              aria-modal="true"
              className="relative w-full max-w-sm overflow-hidden rounded-xl border bg-primary shadow-xl"
              exit={
                shouldReduceMotion
                  ? { opacity: 0, transition: { duration: 0 } }
                  : {
                      opacity: 0,
                      scale: 0.97,
                      transition: { duration: 0.15 },
                      y: 8,
                    }
              }
              initial={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 0, scale: 0.97, y: 8 }
              }
              ref={dialogRef}
              role="dialog"
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : {
                      damping: 25,
                      duration: 0.25,
                      stiffness: 300,
                      type: "spring" as const,
                    }
              }
            >
              <div className="flex items-center gap-2 border-b p-3">
                <Search
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-muted-foreground"
                />
                <input
                  aria-activedescendant={activeId}
                  aria-autocomplete="list"
                  aria-controls={listboxId}
                  aria-expanded={open}
                  aria-label="Search countries"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  onChange={(event) => handleQueryChange(event.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder={placeholder}
                  ref={searchInputRef}
                  role="combobox"
                  type="text"
                  value={query}
                />
                {query ? (
                  <SmoothButton
                    aria-label="Clear search"
                    // Subordinate to the close control beside it — same hit
                    // area, visibly lighter glyph, so two X's never read as peers.
                    className="shrink-0 text-muted-foreground hover:text-foreground [&_svg]:size-3.5"
                    onClick={handleClearSearch}
                    shape="pill"
                    size="icon-sm"
                    variant="ghost"
                  >
                    <X aria-hidden="true" />
                  </SmoothButton>
                ) : null}
                <SmoothButton
                  aria-label="Close dialog"
                  className="shrink-0 text-muted-foreground hover:text-foreground"
                  onClick={() => onOpenChange(false)}
                  shape="pill"
                  size="icon-sm"
                  variant="ghost"
                >
                  <X aria-hidden="true" />
                </SmoothButton>
              </div>

              <div
                aria-label="Countries"
                className="overflow-y-auto py-1"
                id={listboxId}
                onScroll={(event) =>
                  setScrollTop(event.currentTarget.scrollTop)
                }
                ref={listRef}
                role="listbox"
                style={{ maxHeight: LIST_MAX_HEIGHT }}
              >
                {optionRows.length === 0 ? (
                  <p className="px-4 py-8 text-center text-muted-foreground text-sm">
                    {emptyMessage}
                  </p>
                ) : (
                  <>
                    {topPadding > 0 ? (
                      <div aria-hidden="true" style={{ height: topPadding }} />
                    ) : null}
                    {visibleRows.map((row) =>
                      row.kind === "header" ? (
                        <div
                          className="px-3 pt-3 pb-1 font-medium text-muted-foreground text-xs uppercase tracking-wide"
                          key={row.id}
                          role="presentation"
                        >
                          {row.label}
                        </div>
                      ) : (
                        <CountryOption
                          country={row.country}
                          highlighted={row.id === activeId}
                          id={row.id}
                          key={row.id}
                          onSelect={() => handleSelect(row.country)}
                          selected={value === row.country.code}
                        />
                      )
                    )}
                    {bottomPadding > 0 ? (
                      <div
                        aria-hidden="true"
                        style={{ height: bottomPadding }}
                      />
                    ) : null}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );

  return (
    <>
      <SmoothButton
        aria-expanded={open}
        aria-haspopup="dialog"
        className={className}
        onClick={() => onOpenChange(true)}
        variant="outline"
      >
        {trigger ?? "Select country"}
      </SmoothButton>
      {mounted ? createPortal(dialogContent, document.body) : null}
    </>
  );
};

export default CountryDialog;
