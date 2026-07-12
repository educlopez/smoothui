"use client";

import {
  applyColorPalette,
  COLOR_STORAGE_KEY,
  persistColorPalette,
  resetColorPalette,
} from "@docs/app/lib/color-palette";
import { Button } from "@docs/components/smoothbutton";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  IconArrowRightFill24,
  IconCheckDoubleFill24,
  IconCheckFill24,
  IconCopy2Fill24,
  IconFloppyDiskFill24,
  IconRefresh2Fill24,
} from "nucleo-core-fill-24";
import { useEffect, useRef, useState } from "react";

const CLOSE_DELAY = 200;
const SAVE_MESSAGE_DURATION = 1200;
const COPY_MESSAGE_DURATION = 1200;

const themeInstallCommand = (paletteName: string) =>
  `npx shadcn@latest add https://smoothui.dev/r/theme-${paletteName.toLowerCase()}.json`;

const PALETTES = [
  {
    name: "Candy",
    candy: "oklch(0.72 0.2 352.53)",
    candySecondary: "oklch(0.66 0.21 354.31)",
  },
  {
    name: "Indigo",
    candy: "oklch(0.65 0.22 300.21)",
    candySecondary: "oklch(0.54 0.23 286.53)",
  },
  {
    name: "Blue",
    candy: "oklch(0.67 0.17 257.78)",
    candySecondary: "oklch(0.59 0.21 258.02)",
  },
  {
    name: "Red",
    candy: "oklch(0.67 0.21 24.28)",
    candySecondary: "oklch(0.62 0.25 28.23)",
  },
  {
    name: "Orange",
    candy: "oklch(0.75 0.17 47.65)",
    candySecondary: "oklch(0.68 0.21 40.59)",
  },
  {
    name: "Green",
    candy: "oklch(0.70 0.15 162.48)",
    candySecondary: "oklch(0.60 0.13 163.23)",
  },
];

export function ColorPickerFloatNav() {
  const [open, setOpen] = useState(false);
  const [candy, setCandy] = useState("");
  const [candySecondary, setCandySecondary] = useState("");
  const pickerRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const selectedPalette = PALETTES.find(
    (palette) =>
      palette.candy === candy && palette.candySecondary === candySecondary
  );

  async function handleCopyInstall() {
    if (!selectedPalette) {
      return;
    }
    await navigator.clipboard.writeText(
      themeInstallCommand(selectedPalette.name)
    );
    setCopied(true);
    setTimeout(() => setCopied(false), COPY_MESSAGE_DURATION);
  }

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
                            <IconCheckFill24 className="h-4 w-4 text-white" />
                          </span>
                        </motion.span>
                      )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>
            {selectedPalette && (
              <Button
                aria-label={`Copy install command for the ${selectedPalette.name} theme`}
                className="w-full font-mono text-xs"
                onClick={handleCopyInstall}
                size="sm"
                type="button"
                variant="candy"
              >
                {copied ? (
                  <>
                    <IconCheckDoubleFill24 className="h-3.5 w-3.5" /> Copied!
                  </>
                ) : (
                  <>
                    <IconCopy2Fill24 className="h-3.5 w-3.5" /> Install{" "}
                    {selectedPalette.name} theme
                  </>
                )}
              </Button>
            )}
            <div className="mt-2 flex justify-end gap-2">
              <Button
                aria-label="Reset to original colors"
                onClick={handleReset}
                size="sm"
                type="button"
                variant="outline"
              >
                <IconRefresh2Fill24 className="mr-1 h-4 w-4" />
                Reset
              </Button>
              <Button
                aria-label="Save colors to browser"
                onClick={handleSave}
                size="sm"
                type="button"
                variant="candy"
              >
                {saved ? (
                  <>
                    <IconCheckDoubleFill24 className="h-4 w-4" /> Saved!
                  </>
                ) : (
                  <>
                    <IconFloppyDiskFill24 className="h-4 w-4" /> Save
                  </>
                )}
              </Button>
            </div>
            <a
              className="mt-3 flex items-center gap-1 text-muted-foreground text-xs transition-colors hover:text-foreground"
              href="/themes"
            >
              Browse installable themes
              <IconArrowRightFill24 className="h-3 w-3" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
