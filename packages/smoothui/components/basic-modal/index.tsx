"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useOnClickOutside } from "usehooks-ts";

export interface BasicModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  title?: string;
}

const modalSizes = {
  full: "max-w-4xl",
  lg: "max-w-lg",
  md: "max-w-md",
  sm: "max-w-sm",
  xl: "max-w-xl",
};

export default function BasicModal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: BasicModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(
    null
  ) as React.RefObject<HTMLDivElement>;
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  useOnClickOutside(modalRef, () => onClose());
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const titleId = title
    ? `modal-title-${Math.random().toString(36).substring(2, 9)}`
    : undefined;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Focus management: Save previous focus and restore on close
  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = document.activeElement as HTMLElement;
      // Focus the close button or first focusable element when modal opens
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    } else if (previousActiveElementRef.current) {
      // Restore focus when modal closes
      previousActiveElementRef.current.focus();
    }
  }, [isOpen]);

  // Close on Escape key press and focus trap
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      // Focus trap: keep focus within modal
      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        );
        const [firstElement] = focusableElements;
        const lastElement = focusableElements.at(-1);

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else if (document.activeElement === lastElement) {
          // Tab
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Note: Body scroll locking is handled by the overlay and modal positioning
  // No need to manually set body overflow as it can conflict with other components

  const modalContent = (
    <AnimatePresence>
      {isOpen ? (
        <>
          {/* Backdrop */}
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[80] bg-background/70 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            onClick={(e) => {
              if (e.target === overlayRef.current) {
                onClose();
              }
            }}
            ref={overlayRef}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          />

          {/* Modal */}
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto px-4 py-6 sm:p-0"
            exit={{ opacity: 0 }}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          >
            <motion.div
              animate={shouldReduceMotion ? {} : { opacity: 1, scale: 1, y: 0 }}
              aria-labelledby={titleId}
              aria-modal="true"
              className={`${modalSizes[size]} relative mx-auto w-full rounded-xl border bg-primary p-4 shadow-xl sm:p-6`}
              exit={
                shouldReduceMotion
                  ? { opacity: 0, transition: { duration: 0 } }
                  : {
                      opacity: 0,
                      scale: 0.95,
                      transition: { duration: 0.15 },
                      y: 10,
                    }
              }
              initial={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 0, scale: 0.95, y: 10 }
              }
              ref={modalRef}
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
              {/* Header */}
              <div className="mb-4 flex items-center justify-between">
                {title ? (
                  <h3 className="font-medium text-xl leading-6" id={titleId}>
                    {title}
                  </h3>
                ) : null}
                <motion.button
                  aria-label="Close modal"
                  className="ml-auto min-h-[44px] min-w-[44px] cursor-pointer rounded-full p-2 transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  onClick={onClose}
                  ref={closeButtonRef}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                  type="button"
                  whileHover={shouldReduceMotion ? {} : { rotate: 90 }}
                >
                  <X aria-hidden="true" className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="relative">{children}</div>
            </motion.div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );

  if (!mounted) {
    return null;
  }

  return createPortal(modalContent, document.body);
}
