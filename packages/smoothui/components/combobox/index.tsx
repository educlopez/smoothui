"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@repo/shadcn-ui/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/shadcn-ui/components/ui/popover";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { CheckIcon, ChevronsUpDownIcon, LoaderIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { DURATION_INSTANT, SPRING_DEFAULT } from "../../lib/animation";
import SmoothButton from "../smooth-button";

export interface ComboboxOption {
  /** Whether the option is disabled */
  disabled?: boolean;
  /** The display label for the option */
  label: string;
  /** The value of the option */
  value: string;
}

export interface ComboboxProps {
  /** Accessible label for the combobox */
  "aria-label"?: string;
  /** ID of element that labels this combobox */
  "aria-labelledby"?: string;
  /** Additional CSS class names for the trigger button */
  className?: string;
  /** Additional CSS class names for the popover content */
  contentClassName?: string;
  /** Whether the combobox is disabled */
  disabled?: boolean;
  /** Text shown when no results match */
  emptyText?: string;
  /** Async search callback — receives the query string, returns filtered options */
  onSearch?: (query: string) => Promise<ComboboxOption[]>;
  /** Callback when the selected value changes */
  onValueChange?: (value: string) => void;
  /** Static list of options (used when onSearch is not provided) */
  options?: ComboboxOption[];
  /** Placeholder text for the trigger button */
  placeholder?: string;
  /** Debounce delay in ms for the onSearch callback */
  searchDebounce?: number;
  /** Placeholder text for the search input */
  searchPlaceholder?: string;
  /** The controlled selected value */
  value?: string;
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

  const displayOptions = onSearch ? asyncOptions : (staticOptions ?? []);

  const selectedLabel = displayOptions.find(
    (opt) => opt.value === value
  )?.label;

  const handleSearch = useCallback(
    (searchQuery: string) => {
      setQuery(searchQuery);

      if (!onSearch) {
        return;
      }

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
    [onSearch, searchDebounce]
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
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <SmoothButton
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          className={cn(
            "h-9 w-full justify-between px-3 py-2 text-left font-normal [&:hover_*]:text-white",
            !selectedLabel && "text-muted-foreground",
            shouldReduceMotion && "!transition-none !duration-0",
            className
          )}
          disabled={disabled}
          role="combobox"
          type="button"
          variant="outline"
        >
          <span
            className={cn(
              "truncate transition-colors",
              !selectedLabel && "text-muted-foreground"
            )}
          >
            {selectedLabel ?? placeholder}
          </span>
          <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50 transition-colors" />
        </SmoothButton>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn(
          "w-[var(--radix-popover-trigger-width)] p-0",
          shouldReduceMotion && "!animate-none !transition-none !duration-0",
          contentClassName
        )}
      >
        <Command shouldFilter={!onSearch}>
          <CommandInput
            className=""
            onValueChange={handleSearch}
            placeholder={searchPlaceholder}
            value={query}
          />
          <CommandList>
            <AnimatePresence>
              {loading && (
                <motion.div
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center py-4"
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0, transition: DURATION_INSTANT }
                      : { opacity: 0 }
                  }
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                  transition={itemTransition}
                >
                  <LoaderIcon className="size-4 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground text-sm">
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
                    animate={{ opacity: 1, transform: "translateY(0px)" }}
                    disabled={option.disabled}
                    initial={
                      shouldReduceMotion
                        ? { opacity: 1 }
                        : { opacity: 0, transform: "translateY(4px)" }
                    }
                    key={option.value}
                    keywords={[option.label]}
                    onSelect={handleSelect}
                    transition={
                      shouldReduceMotion
                        ? DURATION_INSTANT
                        : {
                            ...SPRING_DEFAULT,
                            delay: index * 0.02,
                          }
                    }
                    value={option.value}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 size-4 shrink-0",
                        value === option.value ? "opacity-100" : "opacity-0"
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
