"use client";

import { ChevronDown, Search, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

const ROTATION_ANGLE_OPEN = 180;

export interface SearchableDropdownItem {
  id: string | number;
  label: string;
  icon?: React.ReactNode;
  description?: string;
}

export interface SearchableDropdownProps {
  label: string;
  items: SearchableDropdownItem[];
  onChange?: (item: SearchableDropdownItem) => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
}

export default function SearchableDropdown({
  label,
  items,
  onChange,
  placeholder = "Search...",
  emptyMessage = "No results found",
  className = "",
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] =
    useState<SearchableDropdownItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const shouldReduceMotion = useReducedMotion();

  const filteredItems = useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      return items;
    }

    // Cache lowercase query to avoid repeated calls
    const query = trimmedQuery.toLowerCase();
    const itemsLength = items.length;
    const results: typeof items = [];

    // Early exit optimization: use for loop instead of filter for better performance
    for (let i = 0; i < itemsLength; i++) {
      const item = items[i];
      const label = item.label.toLowerCase();
      const description = item.description?.toLowerCase();

      if (label.includes(query) || description?.includes(query)) {
        results.push(item);
      }
    }

    return results;
  }, [items, searchQuery]);

  const handleItemSelect = (item: SearchableDropdownItem) => {
    setSelectedItem(item);
    setIsOpen(false);
    setSearchQuery("");
    onChange?.(item);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    inputRef.current?.focus();
  };

  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
    setIsOpen(!isOpen);
    if (isOpen) {
      setSearchQuery("");
    } else {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // Update position on scroll/resize when open
  useEffect(() => {
    if (!(isOpen && buttonRef.current)) {
      return;
    }

    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + 4,
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        portalRef.current &&
        !portalRef.current.contains(target)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation with arrow keys, enter, and escape
  const [focusedIndex, setFocusedIndex] = useState(-1);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) {
        // Open dropdown on Enter or Space when button is focused
        if (
          (event.key === "Enter" || event.key === " ") &&
          document.activeElement === buttonRef.current
        ) {
          event.preventDefault();
          handleToggle();
        }
        return;
      }

      if (event.key === "Escape") {
        setIsOpen(false);
        setSearchQuery("");
        setFocusedIndex(-1);
        buttonRef.current?.focus();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        setFocusedIndex((prev) =>
          prev < filteredItems.length - 1 ? prev + 1 : 0
        );
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setFocusedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredItems.length - 1
        );
      } else if (event.key === "Enter" && focusedIndex >= 0) {
        event.preventDefault();
        const item = filteredItems[focusedIndex];
        if (item) {
          handleItemSelect(item);
        }
      } else if (event.key === "Home") {
        event.preventDefault();
        setFocusedIndex(0);
      } else if (event.key === "End") {
        event.preventDefault();
        setFocusedIndex(filteredItems.length - 1);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // biome-ignore lint/correctness/useExhaustiveDependencies: Handlers are stable via closure
  }, [isOpen, filteredItems, focusedIndex, handleItemSelect, handleToggle]);

  // Reset focused index when items change
  useEffect(() => {
    setFocusedIndex(-1);
  }, []);

  const dropdownContent = (
    <AnimatePresence>
      {isOpen && (
        <div ref={portalRef}>
          <motion.div
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 1, y: 0, scaleY: 1 }
            }
            className="fixed z-50 origin-top overflow-hidden rounded-lg border bg-background/95 shadow-lg backdrop-blur-md"
            exit={
              shouldReduceMotion
                ? { opacity: 0, transition: { duration: 0 } }
                : {
                    opacity: 0,
                    y: -10,
                    scaleY: 0.8,
                    transition: { duration: 0.15 },
                  }
            }
            initial={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 0, y: -10, scaleY: 0.8 }
            }
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              width: `${position.width}px`,
            }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : {
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                    mass: 0.8,
                    duration: 0.25,
                  }
            }
          >
            {/* Search Input */}
            <div className="relative border-b p-2">
              <motion.div
                animate={
                  shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }
                }
                className="relative"
                initial={
                  shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -10 }
                }
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : {
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                        delay: 0.05,
                        duration: 0.2,
                      }
                }
              >
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  aria-autocomplete="list"
                  aria-controls="dropdown-items"
                  aria-expanded={isOpen}
                  aria-label="Search dropdown items"
                  className="w-full rounded-md border bg-transparent py-2 pr-8 pl-9 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setFocusedIndex(-1);
                  }}
                  placeholder={placeholder}
                  ref={inputRef}
                  role="combobox"
                  type="text"
                  value={searchQuery}
                />
                <AnimatePresence>
                  {searchQuery && (
                    <motion.button
                      animate={{ opacity: 1 }}
                      aria-label="Clear search"
                      className="absolute top-1/2 right-2 min-h-[44px] min-w-[44px] -translate-y-1/2 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      exit={{ opacity: 0 }}
                      initial={{ opacity: 0 }}
                      onClick={handleClearSearch}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                      type="button"
                    >
                      <X aria-hidden="true" className="h-4 w-4" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Items List */}
            <ul
              aria-label="Dropdown options"
              className="max-h-60 overflow-y-auto py-2"
              id="dropdown-items"
            >
              <AnimatePresence mode="popLayout">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, index) => (
                    <motion.li
                      animate={
                        shouldReduceMotion
                          ? { opacity: 1 }
                          : { opacity: 1, x: 0, filter: "blur(0px)" }
                      }
                      aria-selected={
                        selectedItem?.id === item.id || index === focusedIndex
                      }
                      className="block"
                      exit={
                        shouldReduceMotion
                          ? { opacity: 0, transition: { duration: 0 } }
                          : { opacity: 0, x: -10, filter: "blur(4px)" }
                      }
                      initial={
                        shouldReduceMotion
                          ? { opacity: 1 }
                          : { opacity: 0, x: -10, filter: "blur(4px)" }
                      }
                      key={item.id}
                      layout
                      role="option"
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : {
                              type: "spring",
                              stiffness: 400,
                              damping: 28,
                              mass: 0.6,
                              delay: index * 0.02,
                              duration: 0.2,
                            }
                      }
                    >
                      <button
                        aria-label={`${item.label}${item.description ? `, ${item.description}` : ""}`}
                        className={`flex min-h-[44px] w-full items-center px-4 py-2 text-left text-sm transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                          selectedItem?.id === item.id
                            ? "font-medium text-brand"
                            : ""
                        } ${index === focusedIndex ? "bg-muted" : ""}`}
                        onClick={() => handleItemSelect(item)}
                        onMouseEnter={() => setFocusedIndex(index)}
                        type="button"
                      >
                        {item.icon && (
                          <span className="mr-3 shrink-0">{item.icon}</span>
                        )}
                        <div className="min-w-0 flex-1">
                          <span className="block truncate">{item.label}</span>
                          {item.description && (
                            <span className="block truncate text-muted-foreground text-xs">
                              {item.description}
                            </span>
                          )}
                        </div>

                        {selectedItem?.id === item.id && (
                          <motion.span
                            animate={shouldReduceMotion ? {} : { scale: 1 }}
                            className="ml-2 shrink-0"
                            initial={shouldReduceMotion ? {} : { scale: 0 }}
                            transition={
                              shouldReduceMotion
                                ? { duration: 0 }
                                : {
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 25,
                                    mass: 0.5,
                                    duration: 0.2,
                                  }
                            }
                          >
                            <svg
                              className="h-4 w-4 text-brand"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <title>Selected</title>
                              <path
                                d="M5 13l4 4L19 7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                              />
                            </svg>
                          </motion.span>
                        )}
                      </button>
                    </motion.li>
                  ))
                ) : (
                  <motion.li
                    animate={{ opacity: 1 }}
                    className="px-4 py-8 text-center text-muted-foreground text-sm"
                    initial={
                      shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }
                    }
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : {
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                            duration: 0.2,
                          }
                    }
                  >
                    {emptyMessage}
                  </motion.li>
                )}
              </AnimatePresence>
            </ul>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div className={`relative inline-block ${className}`} ref={dropdownRef}>
        <button
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label={selectedItem ? `${label}: ${selectedItem.label}` : label}
          className="flex min-h-[44px] w-full items-center justify-between gap-2 rounded-lg border bg-background px-4 py-2 text-left transition-colors hover:bg-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          id="dropdown-button"
          onClick={handleToggle}
          ref={buttonRef}
          type="button"
        >
          <span className="block truncate">
            {selectedItem ? selectedItem.label : label}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? ROTATION_ANGLE_OPEN : 0 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : {
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                    duration: 0.2,
                  }
            }
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </button>
      </div>
      {typeof window !== "undefined" &&
        createPortal(dropdownContent, document.body)}
    </>
  );
}
