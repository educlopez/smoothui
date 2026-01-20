"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const ROTATION_ANGLE_OPEN = 180;
const DROPDOWN_OFFSET = 4;

export type DropdownItem = {
  id: string | number;
  label: string;
  icon?: React.ReactNode;
};

export type BasicDropdownProps = {
  label: string;
  items: DropdownItem[];
  onChange?: (item: DropdownItem) => void;
  className?: string;
};

export default function BasicDropdown({
  label,
  items,
  onChange,
  className = "",
}: BasicDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DropdownItem | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const shouldReduceMotion = useReducedMotion();

  const handleItemSelect = (item: DropdownItem) => {
    setSelectedItem(item);
    setIsOpen(false);
    onChange?.(item);
  };

  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + DROPDOWN_OFFSET,
        left: rect.left,
        width: rect.width,
      });
    }
    setIsOpen(!isOpen);
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
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation
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
        setFocusedIndex(-1);
        buttonRef.current?.focus();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        setFocusedIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
      } else if (event.key === "Enter" && focusedIndex >= 0) {
        event.preventDefault();
        const item = items[focusedIndex];
        if (item) {
          handleItemSelect(item);
        }
      } else if (event.key === "Home") {
        event.preventDefault();
        setFocusedIndex(0);
      } else if (event.key === "End") {
        event.preventDefault();
        setFocusedIndex(items.length - 1);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, items, focusedIndex]);

  // Reset focused index when items change
  useEffect(() => {
    setFocusedIndex(-1);
  }, [items.length]);

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
            className="fixed z-50 origin-top rounded-lg border bg-background shadow-lg"
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
                : { type: "spring", bounce: 0.1, duration: 0.25 }
            }
          >
            <ul
              id="dropdown-items"
              role="listbox"
              aria-label="Dropdown options"
              className="py-2"
            >
              {items.map((item, index) => (
                <motion.li
                  animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
                  className="block"
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0, transition: { duration: 0 } }
                      : { opacity: 0, x: -10 }
                  }
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
                  key={item.id}
                  role="option"
                  aria-selected={selectedItem?.id === item.id || index === focusedIndex}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 300, damping: 30, duration: 0.2 }
                  }
                  whileHover={shouldReduceMotion ? {} : { x: 5 }}
                >
                  <button
                    aria-label={item.label}
                    className={`flex w-full items-center px-4 py-2 text-left text-sm transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-h-[44px] ${
                      selectedItem?.id === item.id
                        ? "font-medium text-brand"
                        : ""
                    } ${index === focusedIndex ? "bg-muted" : ""}`}
                    onClick={() => handleItemSelect(item)}
                    onMouseEnter={() => setFocusedIndex(index)}
                    type="button"
                  >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.label}

                    {selectedItem?.id === item.id && (
                      <motion.span
                        animate={shouldReduceMotion ? {} : { scale: 1 }}
                        className="ml-auto"
                        initial={shouldReduceMotion ? {} : { scale: 0 }}
                        transition={
                          shouldReduceMotion
                            ? { duration: 0 }
                            : {
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
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
              ))}
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
          id="dropdown-button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={selectedItem ? `${label}: ${selectedItem.label}` : label}
          className="flex w-full items-center justify-between gap-2 rounded-lg border bg-background px-4 py-2 text-left transition-colors hover:bg-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-h-[44px]"
          onClick={handleToggle}
          ref={buttonRef}
          type="button"
        >
          <span className="block truncate">
            {selectedItem ? selectedItem.label : label}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? ROTATION_ANGLE_OPEN : 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </button>
      </div>
      {typeof window !== "undefined"
        ? createPortal(dropdownContent, document.body)
        : null}
    </>
  );
}
