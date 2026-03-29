"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@repo/shadcn-ui/lib/utils";
import SmoothButton from "../smooth-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/shadcn-ui/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@repo/shadcn-ui/components/ui/command";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CheckIcon, ChevronsUpDownIcon, LoaderIcon } from "lucide-react";
import { SPRING_DEFAULT, DURATION_INSTANT } from "../../lib/animation";

export interface ComboboxOption {
  /** The value of the option */
  value: string;
  /** The display label for the option */
  label: string;
  /** Whether the option is disabled */
  disabled?: boolean;
}

export interface ComboboxProps {
  /** The controlled selected value */
  value?: string;
  /** Callback when the selected value changes */
  onValueChange?: (value: string) => void;
  /** Static list of options (used when onSearch is not provided) */
  options?: ComboboxOption[];
  /** Async search callback — receives the query string, returns filtered options */
  onSearch?: (query: string) => Promise<ComboboxOption[]>;
  /** Debounce delay in ms for the onSearch callback */
  searchDebounce?: number;
  /** Placeholder text for the trigger button */
  placeholder?: string;
  /** Placeholder text for the search input */
  searchPlaceholder?: string;
  /** Text shown when no results match */
  emptyText?: string;
  /** Whether the combobox is disabled */
  disabled?: boolean;
  /** Additional CSS class names for the trigger button */
  className?: string;
  /** Additional CSS class names for the popover content */
  contentClassName?: string;
  /** Accessible label for the combobox */
  "aria-label"?: string;
  /** ID of element that labels this combobox */
  "aria-labelledby"?: string;
}

const MotionCommandItem = motion.create(CommandItem);

export default function Combobox({
  value,
  onValueChange,
  options: staticOptions,
  onSearch,
  searchDebounce = 300,
  placeholder = "Select an option…",
  searchPlaceholder = "Search…",
  emptyText = "No results found.",
  disabled = false,
  className,
  contentClassName,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: ComboboxProps) {
  const shouldReduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [asyncOptions, setAsyncOptions] = useState<ComboboxOption[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const displayOptions = onSearch ? asyncOptions : staticOptions ?? [];

  const selectedLabel = displayOptions.find(
    (opt) => opt.value === value,
  )?.label;

  const handleSearch = useCallback(
    (searchQuery: string) => {
      setQuery(searchQuery);

      if (!onSearch) return;

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(async () => {
        setLoading(true);
        try {
          const results = await onSearch(searchQuery);
          setAsyncOptions(results);
        } finally {
          setLoading(false);
        }
      }, searchDebounce);
    },
    [onSearch, searchDebounce],
  );

  // Load initial async options when popover opens
  useEffect(() => {
    if (open && onSearch && asyncOptions.length === 0 && !loading) {
      setLoading(true);
      onSearch("").then((results) => {
        setAsyncOptions(results);
        setLoading(false);
      });
    }
  }, [open, onSearch, asyncOptions.length, loading]);

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleSelect = (selectedValue: string) => {
    const newValue = selectedValue === value ? "" : selectedValue;
    onValueChange?.(newValue);
    setOpen(false);
  };

  const itemTransition = shouldReduceMotion ? DURATION_INSTANT : SPRING_DEFAULT;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <SmoothButton
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          disabled={disabled}
          className={cn(
            "h-9 w-full justify-between px-3 py-2 text-left font-normal [&:hover_*]:text-white",
            !selectedLabel && "text-muted-foreground",
            shouldReduceMotion && "!transition-none !duration-0",
            className,
          )}
        >
          <span
            className={cn(
              "truncate transition-colors",
              !selectedLabel && "text-muted-foreground",
            )}
          >
            {selectedLabel ?? placeholder}
          </span>
          <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50 transition-colors" />
        </SmoothButton>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-[var(--radix-popover-trigger-width)] p-0",
          shouldReduceMotion && "!animate-none !transition-none !duration-0",
          contentClassName,
        )}
        align="start"
      >
        <Command shouldFilter={!onSearch}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={query}
            onValueChange={handleSearch}
            className=""
          />
          <CommandList>
            <AnimatePresence>
              {loading && (
                <motion.div
                  className="flex items-center justify-center py-4"
                  initial={
                    shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }
                  }
                  animate={{ opacity: 1 }}
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0, transition: DURATION_INSTANT }
                      : { opacity: 0 }
                  }
                  transition={itemTransition}
                >
                  <LoaderIcon className="text-muted-foreground size-4 animate-spin" />
                  <span className="text-muted-foreground ml-2 text-sm">
                    Loading…
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {!loading && <CommandEmpty>{emptyText}</CommandEmpty>}

            {!loading && displayOptions.length > 0 && (
              <CommandGroup>
                {displayOptions.map((option, index) => (
                  <MotionCommandItem
                    key={option.value}
                    value={option.value}
                    keywords={[option.label]}
                    disabled={option.disabled}
                    onSelect={handleSelect}
                    initial={
                      shouldReduceMotion
                        ? { opacity: 1 }
                        : { opacity: 0, transform: "translateY(4px)" }
                    }
                    animate={{ opacity: 1, transform: "translateY(0px)" }}
                    transition={
                      shouldReduceMotion
                        ? DURATION_INSTANT
                        : {
                            ...SPRING_DEFAULT,
                            delay: index * 0.02,
                          }
                    }
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 size-4 shrink-0",
                        value === option.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {option.label}
                  </MotionCommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
