"use client";

import { cn } from "@repo/smoothui-utils";
import { Command as CommandPrimitive } from "cmdk";
import {
  CheckIcon,
  ChevronsUpDownIcon,
  LoaderIcon,
  SearchIcon,
} from "lucide-react";
import { useReducedMotion } from "motion/react";
import { Popover as PopoverPrimitive } from "radix-ui";
import {
  type ComponentProps,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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

/* ------------------------------------------------------------------ */
/*  Thin cmdk + radix wrappers (no @repo/shadcn-ui)                    */
/* ------------------------------------------------------------------ */

const Popover = ({
  ...props
}: ComponentProps<typeof PopoverPrimitive.Root>) => (
  <PopoverPrimitive.Root data-slot="popover" {...props} />
);

const PopoverTrigger = ({
  ...props
}: ComponentProps<typeof PopoverPrimitive.Trigger>) => (
  <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
);

const PopoverContent = ({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: ComponentProps<typeof PopoverPrimitive.Content>) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      align={align}
      className={cn(
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden data-[state=closed]:animate-out data-[state=open]:animate-in",
        className
      )}
      data-slot="popover-content"
      sideOffset={sideOffset}
      {...props}
    />
  </PopoverPrimitive.Portal>
);

const Command = ({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive>) => (
  <CommandPrimitive
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className
    )}
    data-slot="command"
    {...props}
  />
);

const CommandInput = ({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.Input>) => (
  <div
    className="flex h-9 items-center gap-2 border-b px-3"
    data-slot="command-input-wrapper"
  >
    <SearchIcon className="size-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      className={cn(
        "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:text-muted-foreground/60",
        className
      )}
      data-slot="command-input"
      {...props}
    />
  </div>
);

const CommandList = ({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.List>) => (
  <CommandPrimitive.List
    className={cn(
      "max-h-[300px] min-h-[7.5rem] scroll-py-1 overflow-y-auto overflow-x-hidden",
      className
    )}
    data-slot="command-list"
    {...props}
  />
);

const CommandEmpty = ({
  ...props
}: ComponentProps<typeof CommandPrimitive.Empty>) => (
  <CommandPrimitive.Empty
    className="py-6 text-center text-sm"
    data-slot="command-empty"
    {...props}
  />
);

const CommandGroup = ({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.Group>) => (
  <CommandPrimitive.Group
    className={cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:text-xs",
      className
    )}
    data-slot="command-group"
    {...props}
  />
);

const CommandItem = ({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.Item>) => (
  <CommandPrimitive.Item
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden data-[disabled=true]:pointer-events-none data-[selected=true]:bg-foreground/10 data-[disabled=true]:text-muted-foreground/60 data-[selected=true]:text-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
      className
    )}
    data-slot="command-item"
    {...props}
  />
);

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
  /** Prevents empty search results from re-triggering the initial `onSearch("")`. */
  const hasLoadedInitialRef = useRef(false);

  const displayOptions = onSearch ? asyncOptions : (staticOptions ?? []);

  /** Prefer full option lists so a filtered/async view cannot blank the trigger. */
  const selectedLabel = (() => {
    const pools = [staticOptions, asyncOptions, displayOptions].filter(
      (list): list is ComboboxOption[] => Boolean(list?.length)
    );
    for (const pool of pools) {
      const match = pool.find((opt) => opt.value === value);
      if (match) {
        return match.label;
      }
    }
  })();

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

  // Load initial async options once when the popover first opens
  useEffect(() => {
    if (!(open && onSearch) || hasLoadedInitialRef.current || loading) {
      return;
    }
    hasLoadedInitialRef.current = true;
    setLoading(true);
    onSearch("")
      .then((results) => {
        setAsyncOptions(results);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [open, onSearch, loading]);

  // Clean up debounce on unmount
  useEffect(
    () => () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    },
    []
  );

  const handleSelect = (selectedValue: string) => {
    const newValue = selectedValue === value ? "" : selectedValue;
    onValueChange?.(newValue);
    setQuery("");
    setOpen(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setQuery("");
    }
  };

  return (
    <Popover onOpenChange={handleOpenChange} open={open}>
      <PopoverTrigger asChild>
        <SmoothButton
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          className={cn(
            "h-9 w-full justify-between px-3 py-2 text-left font-normal hover:text-primary-foreground",
            !selectedLabel &&
              "text-muted-foreground hover:text-primary-foreground",
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
              !selectedLabel && "text-muted-foreground/70"
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
            onValueChange={handleSearch}
            placeholder={searchPlaceholder}
            value={query}
          />
          <CommandList className="relative">
            {loading ? (
              <div
                aria-busy="true"
                aria-live="polite"
                className="absolute inset-0 z-10 flex min-h-[7.5rem] items-center justify-center bg-popover/80"
              >
                <LoaderIcon className="size-4 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground text-sm">
                  Loading…
                </span>
              </div>
            ) : null}

            {!loading && <CommandEmpty>{emptyText}</CommandEmpty>}

            {!loading && displayOptions.length > 0 ? (
              <CommandGroup>
                {displayOptions.map((option) => (
                  <CommandItem
                    disabled={option.disabled}
                    key={option.value}
                    keywords={[option.label, option.value]}
                    onSelect={() => handleSelect(option.value)}
                    value={`${option.label} ${option.value}`}
                  >
                    <CheckIcon
                      className={cn(
                        "size-4 shrink-0",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
