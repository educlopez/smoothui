"use client";

import {
  applyColorPalette,
  COLOR_STORAGE_KEY,
  persistColorPalette,
  resetColorPalette,
} from "@docs/app/lib/color-palette";
import { Button } from "@repo/shadcn-ui/components/ui/button";
import { Check, CheckCheck, RotateCcw, Save } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const CLOSE_DELAY = 200;
const SAVE_MESSAGE_DURATION = 1200;

const PALETTES = [
  {
    name: "Candy",
    candy: "oklch(0.72 0.2 352.53)",
    candySecondary: "oklch(0.55 0.22 354.31)",
  },
  {
    name: "Indigo",
    candy: "oklch(0.62 0.25 300)",
    candySecondary: "oklch(0.48 0.28 295)",
  },
  {
    name: "Blue",
    candy: "oklch(0.68 0.15 250)",
    candySecondary: "oklch(0.52 0.18 255)",
  },
  {
    name: "Red",
    candy: "oklch(0.62 0.22 25)",
    candySecondary: "oklch(0.48 0.25 28)",
  },
  {
    name: "Orange",
    candy: "oklch(0.75 0.18 50)",
    candySecondary: "oklch(0.60 0.20 45)",
  },
  {
    name: "Green",
    candy: "oklch(0.65 0.17 165)",
    candySecondary: "oklch(0.50 0.15 165)",
  },
];

export function ColorPickerFloatNav() {
  const [open, setOpen] = useState(false);
  const [candy, setCandy] = useState("");
  const [candySecondary, setCandySecondary] = useState("");
  const pickerRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [saved, setSaved] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const savedColors = localStorage.getItem(COLOR_STORAGE_KEY);
    if (savedColors) {
      try {
        const parsed = JSON.parse(savedColors);
        setCandy(parsed.candy);
        setCandySecondary(parsed.candySecondary);
        applyColorPalette(parsed.candy, parsed.candySecondary);
        return;
      } catch {
        // Ignore
      }
    }

    const c = getComputedStyle(document.body)
      .getPropertyValue("--color-brand")
      .trim();
    const cs = getComputedStyle(document.body)
      .getPropertyValue("--color-brand-secondary")
      .trim();
    setCandy(c);
    setCandySecondary(cs);
    if (c && cs) {
      applyColorPalette(c, cs);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setShow(true);
    } else {
      const timeout = setTimeout(() => setShow(false), CLOSE_DELAY);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  function handleReset() {
    resetColorPalette();
    localStorage.removeItem(COLOR_STORAGE_KEY);

    const c = getComputedStyle(document.body)
      .getPropertyValue("--color-brand")
      .trim();
    const cs = getComputedStyle(document.body)
      .getPropertyValue("--color-brand-secondary")
      .trim();

    setCandy(c);
    setCandySecondary(cs);
  }

  function handleSave() {
    persistColorPalette(candy, candySecondary);
    setSaved(true);
    setTimeout(() => setSaved(false), SAVE_MESSAGE_DURATION);
  }

  return (
    <div className="float-trigger !p-2 relative" ref={pickerRef}>
      <button
        aria-label="Open color picker"
        className="flex h-5 w-5 cursor-pointer items-center gap-1 overflow-hidden rounded-sm border shadow-custom-brand transition-all duration-200"
        onClick={() => setOpen((v) => !v)}
        style={{
          background: `linear-gradient(90deg, ${candy} 60%, ${candySecondary} 100%)`,
        }}
        type="button"
      >
        <span
          className="h-full w-full"
          style={{
            background: `linear-gradient(135deg, ${candy} 60%, ${candySecondary} 100%)`,
          }}
        />
      </button>
      <AnimatePresence>
        {show && (
          <motion.div
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            aria-modal="true"
            className="absolute bottom-12 left-1/2 z-50 flex min-w-[220px] -translate-x-1/2 flex-col items-center rounded-xl border bg-background p-2 shadow-2xl"
            exit={
              shouldReduceMotion
                ? { opacity: 0, transition: { duration: 0 } }
                : { opacity: 0, scale: 0.95, y: 20 }
            }
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.95, y: 20 }
            }
            role="dialog"
            tabIndex={-1}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 300, damping: 30 }
            }
          >
            <div className="mb-2 flex flex-row gap-3">
              {PALETTES.map((palette) => (
                <motion.button
                  animate={(() => {
                    const isSelected =
                      palette.candy === candy &&
                      palette.candySecondary === candySecondary;
                    if (!isSelected) {
                      return { scale: 1 };
                    }
                    return shouldReduceMotion ? {} : { scale: 1.12 };
                  })()}
                  aria-label={`Select ${palette.name} palette`}
                  className={`relative h-8 w-8 rounded-md transition-all focus:outline-none ${palette.candy === candy && palette.candySecondary === candySecondary ? "cursor-not-allowed border shadow-custom-brand" : "cursor-pointer border border-transparent"}`}
                  key={palette.name}
                  onClick={() => {
                    setCandy(palette.candy);
                    setCandySecondary(palette.candySecondary);
                    applyColorPalette(palette.candy, palette.candySecondary);
                    persistColorPalette(palette.candy, palette.candySecondary);
                  }}
                  style={{
                    background: `linear-gradient(135deg, ${palette.candy} 60%, ${palette.candySecondary} 100%)`,
                  }}
                  type="button"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.08 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                >
                  <AnimatePresence>
                    {palette.candy === candy &&
                      palette.candySecondary === candySecondary && (
                        <motion.span
                          animate={
                            shouldReduceMotion
                              ? { opacity: 1 }
                              : { opacity: 1, scale: 1 }
                          }
                          className="absolute inset-0 flex items-center justify-center"
                          exit={
                            shouldReduceMotion
                              ? { opacity: 0, transition: { duration: 0 } }
                              : { opacity: 0, scale: 0.7 }
                          }
                          initial={
                            shouldReduceMotion
                              ? { opacity: 0 }
                              : { opacity: 0, scale: 0.7 }
                          }
                          transition={
                            shouldReduceMotion
                              ? { duration: 0 }
                              : { type: "spring", stiffness: 400, damping: 30 }
                          }
                        >
                          <span className="rounded-full bg-white/40 p-0.5">
                            <Check className="h-4 w-4 text-white" />
                          </span>
                        </motion.span>
                      )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>
            <div className="mt-2 flex justify-end gap-2">
              <Button
                aria-label="Reset to original colors"
                onClick={handleReset}
                size="sm"
                type="button"
                variant="outline"
              >
                <RotateCcw className="mr-1 h-4 w-4" />
                Reset
              </Button>
              <Button
                aria-label="Save colors to browser"
                onClick={handleSave}
                size="sm"
                type="button"
              >
                {saved ? (
                  <>
                    <CheckCheck className="h-4 w-4" /> Saved!
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Save
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
