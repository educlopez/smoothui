"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  DURATION_INSTANT,
  SPRING_DEFAULT,
  SPRING_SNAPPY,
} from "../../lib/animation";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CHEVRON_ROTATION = 180;
const DROPDOWN_OFFSET = 4;
const STAGGER_DELAY = 0.02;
const ITEM_HOVER_X = 2;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SelectOptionProps {
  /** Whether the option is disabled */
  disabled?: boolean;
  /** The display label for the option */
  label: string;
  /** The value of the option */
  value: string;
}

export interface SelectGroupOption {
  /** Label for the group */
  label: string;
  /** Options within this group */
  options: SelectOptionProps[];
}

export interface SelectProps {
  /** Accessible label for the select */
  "aria-label"?: string;
  /** ID of element that labels this select */
  "aria-labelledby"?: string;
  /** Additional CSS class names for the trigger */
  className?: string;
  /** Additional CSS class names for the content dropdown */
  contentClassName?: string;
  /** The default value (uncontrolled) */
  defaultValue?: string;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Grouped options */
  groups?: SelectGroupOption[];
  /** The name attribute for form submission */
  name?: string;
  /** Callback when the value changes */
  onValueChange?: (value: string) => void;
  /** Flat list of options */
  options?: SelectOptionProps[];
  /** Placeholder text when no value is selected */
  placeholder?: string;
  /** Whether the select is required */
  required?: boolean;
  /** The size of the trigger */
  size?: "sm" | "default";
  /** The controlled value of the select */
  value?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Select({
  value: controlledValue,
  defaultValue,
  onValueChange,
  placeholder = "Select an option",
  disabled = false,
  required = false,
  name,
  options,
  groups,
  className,
  contentClassName,
  size = "default",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: SelectProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  const selectedValue =
    controlledValue === undefined ? internalValue : controlledValue;

  // Flatten all options for keyboard navigation
  const allOptions: SelectOptionProps[] = (() => {
    const flat: SelectOptionProps[] = [];
    if (options) {
      for (const opt of options) {
        flat.push(opt);
      }
    }
    if (groups) {
      for (const group of groups) {
        for (const opt of group.options) {
          flat.push(opt);
        }
      }
    }
    return flat;
  })();

  const selectedLabel = allOptions.find(
    (opt) => opt.value === selectedValue
  )?.label;

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleSelect = useCallback(
    (opt: SelectOptionProps) => {
      if (opt.disabled) {
        return;
      }
      if (controlledValue === undefined) {
        setInternalValue(opt.value);
      }
      onValueChange?.(opt.value);
      setIsOpen(false);
      setFocusedIndex(-1);
      triggerRef.current?.focus();
    },
    [controlledValue, onValueChange]
  );

  const handleToggle = useCallback(() => {
    if (disabled) {
      return;
    }
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + DROPDOWN_OFFSET,
        left: rect.left,
        width: rect.width,
      });
    }
    setIsOpen((prev) => !prev);
    setFocusedIndex(-1);
  }, [disabled, isOpen]);

  // ---------------------------------------------------------------------------
  // Position updates on scroll/resize
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!(isOpen && triggerRef.current)) {
      return;
    }

    const updatePosition = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + DROPDOWN_OFFSET,
          left: rect.left,
          width: rect.width,
        });
      }
    };

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  // ---------------------------------------------------------------------------
  // Click outside to close
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(target) &&
        portalRef.current &&
        !portalRef.current.contains(target)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // ---------------------------------------------------------------------------
  // Keyboard navigation
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) {
        if (
          (event.key === "Enter" || event.key === " ") &&
          document.activeElement === triggerRef.current
        ) {
          event.preventDefault();
          handleToggle();
        }
        return;
      }

      if (event.key === "Escape") {
        setIsOpen(false);
        setFocusedIndex(-1);
        triggerRef.current?.focus();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        setFocusedIndex((prev) =>
          prev < allOptions.length - 1 ? prev + 1 : 0
        );
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setFocusedIndex((prev) =>
          prev > 0 ? prev - 1 : allOptions.length - 1
        );
      } else if (event.key === "Enter" && focusedIndex >= 0) {
        event.preventDefault();
        const opt = allOptions[focusedIndex];
        if (opt) {
          handleSelect(opt);
        }
      } else if (event.key === "Home") {
        event.preventDefault();
        setFocusedIndex(0);
      } else if (event.key === "End") {
        event.preventDefault();
        setFocusedIndex(allOptions.length - 1);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // biome-ignore lint/correctness/useExhaustiveDependencies: handlers stable via closure
  }, [isOpen, allOptions, focusedIndex, handleSelect, handleToggle]);

  // ---------------------------------------------------------------------------
  // Render helpers
  // ---------------------------------------------------------------------------

  /** Render a single option item with stagger animation */
  const renderItem = (opt: SelectOptionProps, globalIndex: number) => {
    const isSelected = opt.value === selectedValue;
    const isFocused = globalIndex === focusedIndex;

    return (
      <motion.div
        animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
        exit={
          shouldReduceMotion
            ? { opacity: 0, transition: { duration: 0 } }
            : { opacity: 0, x: -8 }
        }
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -8 }}
        key={opt.value}
        transition={
          shouldReduceMotion
            ? DURATION_INSTANT
            : {
                ...SPRING_SNAPPY,
                delay: globalIndex * STAGGER_DELAY,
              }
        }
        whileHover={shouldReduceMotion ? {} : { x: ITEM_HOVER_X }}
      >
        <button
          aria-selected={isSelected}
          className={cn(
            "relative flex w-full cursor-default select-none items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-left text-sm outline-hidden",
            "transition-colors",
            opt.disabled
              ? "pointer-events-none opacity-50"
              : "hover:bg-accent hover:text-white",
            isFocused && "bg-accent text-white",
            isSelected && "font-medium"
          )}
          disabled={opt.disabled}
          onClick={() => handleSelect(opt)}
          onMouseEnter={() => setFocusedIndex(globalIndex)}
          role="option"
          type="button"
        >
          <span className="flex-1 truncate">{opt.label}</span>

          {/* Animated checkmark */}
          <span className="absolute right-2 flex size-3.5 items-center justify-center">
            <AnimatePresence>
              {isSelected && (
                <motion.span
                  animate={shouldReduceMotion ? {} : { scale: 1, opacity: 1 }}
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0, transition: { duration: 0 } }
                      : { scale: 0, opacity: 0 }
                  }
                  initial={shouldReduceMotion ? {} : { scale: 0, opacity: 0 }}
                  transition={
                    shouldReduceMotion
                      ? DURATION_INSTANT
                      : {
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                          duration: 0.2,
                        }
                  }
                >
                  <Check className="size-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        </button>
      </motion.div>
    );
  };

  // Global index counter for stagger across groups
  let globalIndex = 0;

  // ---------------------------------------------------------------------------
  // Dropdown content (portalled)
  // ---------------------------------------------------------------------------

  const dropdownContent = (
    <AnimatePresence>
      {isOpen && (
        <div ref={portalRef}>
          <motion.div
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            className={cn(
              "fixed z-50 origin-top overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
              contentClassName
            )}
            exit={
              shouldReduceMotion
                ? { opacity: 0, transition: { duration: 0 } }
                : {
                    opacity: 0,
                    scale: 0.95,
                    y: -4,
                    transition: { duration: 0.15 },
                  }
            }
            initial={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 0, scale: 0.95, y: -4 }
            }
            role="listbox"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              width: `${position.width}px`,
            }}
            transition={shouldReduceMotion ? DURATION_INSTANT : SPRING_DEFAULT}
          >
            <div className="max-h-60 overflow-y-auto p-1">
              {/* Flat options */}
              {options &&
                options.length > 0 &&
                (() => {
                  const items = options.map((opt) => {
                    const idx = globalIndex;
                    globalIndex += 1;
                    return renderItem(opt, idx);
                  });
                  return items;
                })()}

              {/* Grouped options */}
              {groups &&
                groups.map((group, groupIdx) => {
                  const groupItems = group.options.map((opt) => {
                    const idx = globalIndex;
                    globalIndex += 1;
                    return renderItem(opt, idx);
                  });

                  return (
                    <div key={group.label}>
                      {groupIdx > 0 && (
                        <div className="pointer-events-none -mx-1 my-1 h-px bg-border" />
                      )}
                      <div className="px-2 py-1.5 text-muted-foreground text-xs">
                        {group.label}
                      </div>
                      {groupItems}
                    </div>
                  );
                })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  // ---------------------------------------------------------------------------
  // Main render
  // ---------------------------------------------------------------------------

  return (
    <>
      <div className="relative inline-block w-full" ref={wrapperRef}>
        {/* Hidden native input for form submission */}
        {name && (
          <input
            aria-hidden="true"
            name={name}
            required={required}
            tabIndex={-1}
            type="hidden"
            value={selectedValue}
          />
        )}

        <button
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-required={required || undefined}
          className={cn(
            "flex w-full items-center justify-between gap-2 whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground",
            size === "default" ? "h-9" : "h-8",
            className
          )}
          data-placeholder={!selectedLabel || undefined}
          disabled={disabled}
          onClick={handleToggle}
          ref={triggerRef}
          role="combobox"
          type="button"
        >
          <span
            className={cn(
              "line-clamp-1 flex items-center gap-2 text-left",
              !selectedLabel && "text-muted-foreground"
            )}
          >
            {selectedLabel ?? placeholder}
          </span>

          {/* Animated chevron */}
          <motion.div
            animate={{ rotate: isOpen ? CHEVRON_ROTATION : 0 }}
            className="shrink-0"
            transition={
              shouldReduceMotion
                ? DURATION_INSTANT
                : { type: "spring", duration: 0.25, bounce: 0.05 }
            }
          >
            <ChevronDown className="size-4 opacity-50" />
          </motion.div>
        </button>
      </div>

      {typeof window === "undefined"
        ? null
        : createPortal(dropdownContent, document.body)}
    </>
  );
}
