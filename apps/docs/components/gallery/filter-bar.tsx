"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { Search, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

export type FilterBarProps = {
  categories: string[];
  activeCategory: string | null;
  searchQuery: string;
  onCategoryChange: (category: string | null) => void;
  onSearchChange: (query: string) => void;
};

const DEBOUNCE_MS = 200;

export const FilterBar = ({
  categories,
  activeCategory,
  searchQuery,
  onCategoryChange,
  onSearchChange,
}: FilterBarProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync external searchQuery changes back to local state
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleSearchInput = useCallback(
    (value: string) => {
      setLocalSearch(value);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        onSearchChange(value);
      }, DEBOUNCE_MS);
    },
    [onSearchChange]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const clearSearch = useCallback(() => {
    setLocalSearch("");
    onSearchChange("");
    inputRef.current?.focus();
  }, [onSearchChange]);

  const allCategories = [{ label: "All", value: null }, ...categories.map((c) => ({ label: c, value: c }))];

  return (
    <div className="flex flex-col gap-4">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          aria-label="Search components"
          className={cn(
            "h-10 w-full rounded-lg border border-border bg-background pl-10 pr-10 text-sm text-foreground",
            "placeholder:text-muted-foreground",
            "focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
            "transition-colors"
          )}
          onChange={(e) => handleSearchInput(e.target.value)}
          placeholder="Search components..."
          type="text"
          value={localSearch}
        />
        {localSearch && (
          <button
            aria-label="Clear search"
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={clearSearch}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category pills */}
      <div
        aria-label="Filter by category"
        className="flex flex-wrap gap-2"
        role="group"
      >
        {allCategories.map(({ label, value }) => {
          const isActive = activeCategory === value;

          return (
            <motion.button
              aria-pressed={isActive}
              className={cn(
                "relative rounded-full border px-3 py-1.5 font-medium text-sm transition-colors",
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
              )}
              key={label}
              onClick={() => onCategoryChange(value)}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { type: "spring", duration: 0.25, bounce: 0.1 }
              }
              type="button"
              whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
            >
              {label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
