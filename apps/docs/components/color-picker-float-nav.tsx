"use client";

import { Button } from "@repo/shadcn-ui/components/ui/button";
import { Check, CheckCheck, RotateCcw, Save } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const OKLCH_REGEX = /oklch\(([^)]+)\)/;
const MAX_LIGHTNESS = 1.0;
const LIGHT_ADJUSTMENT = 0.1;
const LIGHTER_ADJUSTMENT = 0.2;
const CHROMA_LIGHT_ADJUSTMENT = 0.05;
const CHROMA_LIGHTER_ADJUSTMENT = 0.1;
const OPACITY_LIGHT = 0.7;
const OPACITY_LIGHTER = 0.5;
const CLOSE_DELAY = 200;
const SAVE_MESSAGE_DURATION = 1200;

// Helper to update shadow when secondary color changes
function updateShadowCustomCandy(candySecondary: string) {
  document.body.style.setProperty(
    "--shadow-custom-brand",
    `0px 1px 2px #0006, 0px 0px 0px 1px ${candySecondary}, inset 0px .75px 0px #fff3`
  );
}

// Helper to generate light and lighter variations of a color
function generateColorVariations(baseColor: string) {
  if (baseColor.startsWith("oklch")) {
    const lightColor = baseColor.replace(OKLCH_REGEX, (_match, values) => {
      const parts = values.split(" ");
      const lightness = Math.min(
        Number.parseFloat(parts[0]) + LIGHT_ADJUSTMENT,
        MAX_LIGHTNESS
      );
      const chroma = Math.max(
        Number.parseFloat(parts[1]) - CHROMA_LIGHT_ADJUSTMENT,
        0
      );
      const hue = parts[2];
      return `oklch(${lightness} ${chroma} ${hue})`;
    });

    const lighterColor = baseColor.replace(OKLCH_REGEX, (_match, values) => {
      const parts = values.split(" ");
      const lightness = Math.min(
        Number.parseFloat(parts[0]) + LIGHTER_ADJUSTMENT,
        MAX_LIGHTNESS
      );
      const chroma = Math.max(
        Number.parseFloat(parts[1]) - CHROMA_LIGHTER_ADJUSTMENT,
        0
      );
      const hue = parts[2];
      return `oklch(${lightness} ${chroma} ${hue})`;
    });

    return { lightColor, lighterColor };
  }

  // Fallback to opacity-based approach
  const lightColor = baseColor
    .replace(")", ` / ${OPACITY_LIGHT})`)
    .replace("oklch", "oklch");
  const lighterColor = baseColor
    .replace(")", ` / ${OPACITY_LIGHTER})`)
    .replace("oklch", "oklch");

  return { lightColor, lighterColor };
}

function generateColorPalette(primaryColor: string, secondaryColor: string) {
  const primaryVariations = generateColorVariations(primaryColor);
  const secondaryVariations = generateColorVariations(secondaryColor);

  return {
    primary: primaryColor,
    primaryLight: primaryVariations.lightColor,
    primaryLighter: primaryVariations.lighterColor,
    secondary: secondaryColor,
    secondaryLight: secondaryVariations.lightColor,
    secondaryLighter: secondaryVariations.lighterColor,
  };
}

const PALETTES = [
  {
    name: "Candy",
    candy: "oklch(0.72 0.2 352.53)",
    candySecondary: "oklch(0.66 0.21 354.31)",
  },
  {
    name: "Indigo",
    candy: "#A764FF",
    candySecondary: "#6E48EC",
  },
  {
    name: "Blue",
    candy: "#4B94FD",
    candySecondary: "#1477F6",
  },
  {
    name: "Red",
    candy: "#FD4B4E",
    candySecondary: "#F61418",
  },
  {
    name: "Orange",
    candy: "#FF8743",
    candySecondary: "#FF5C00",
  },
  {
    name: "Green",
    candy: "#10B981",
    candySecondary: "#059669",
  },
];

export function ColorPickerFloatNav() {
  const [open, setOpen] = useState(false);
  const [candy, setCandy] = useState("");
  const [candySecondary, setCandySecondary] = useState("");
  const pickerRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedColors = localStorage.getItem("smoothui-colors");
    if (savedColors) {
      try {
        const parsed = JSON.parse(savedColors);
        setCandy(parsed.candy);
        setCandySecondary(parsed.candySecondary);
        document.body.style.setProperty("--color-brand", parsed.candy);
        document.body.style.setProperty(
          "--color-brand-secondary",
          parsed.candySecondary
        );

        const palette = generateColorPalette(
          parsed.candy,
          parsed.candySecondary
        );
        document.body.style.setProperty("--color-brand", palette.primary);
        document.body.style.setProperty("--color-fd-primary", palette.primary);
        document.body.style.setProperty(
          "--color-brand-light",
          palette.primaryLight
        );
        document.body.style.setProperty(
          "--color-brand-lighter",
          palette.primaryLighter
        );
        document.body.style.setProperty(
          "--color-brand-secondary",
          palette.secondary
        );

        updateShadowCustomCandy(parsed.candySecondary);
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
    updateShadowCustomCandy(cs);
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
    document.body.style.removeProperty("--color-brand");
    document.body.style.removeProperty("--color-fd-primary");
    document.body.style.removeProperty("--color-brand-secondary");
    document.body.style.removeProperty("--color-brand-light");
    document.body.style.removeProperty("--color-brand-lighter");
    document.body.style.removeProperty("--shadow-custom-brand");

    localStorage.removeItem("smoothui-colors");

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
    localStorage.setItem(
      "smoothui-colors",
      JSON.stringify({ candy, candySecondary })
    );
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
            animate={{ opacity: 1, scale: 1, y: 0 }}
            aria-modal="true"
            className="-translate-x-1/2 absolute bottom-12 left-1/2 z-50 flex min-w-[220px] flex-col items-center rounded-xl border bg-background p-2 shadow-2xl"
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            role="dialog"
            tabIndex={-1}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="mb-2 flex flex-row gap-3">
              {PALETTES.map((palette) => (
                <motion.button
                  animate={
                    palette.candy === candy &&
                    palette.candySecondary === candySecondary
                      ? { scale: 1.12 }
                      : { scale: 1 }
                  }
                  aria-label={`Select ${palette.name} palette`}
                  className={`relative h-8 w-8 rounded-md transition-all focus:outline-none ${palette.candy === candy && palette.candySecondary === candySecondary ? "cursor-not-allowed border shadow-custom-brand" : "cursor-pointer border border-transparent"}`}
                  key={palette.name}
                  onClick={() => {
                    setCandy(palette.candy);
                    setCandySecondary(palette.candySecondary);
                    document.body.style.setProperty(
                      "--color-brand",
                      palette.candy
                    );
                    document.body.style.setProperty(
                      "--color-brand-secondary",
                      palette.candySecondary
                    );

                    const colorPalette = generateColorPalette(
                      palette.candy,
                      palette.candySecondary
                    );
                    document.body.style.setProperty(
                      "--color-brand",
                      colorPalette.primary
                    );
                    document.body.style.setProperty(
                      "--color-fd-primary",
                      colorPalette.primary
                    );
                    document.body.style.setProperty(
                      "--color-brand-light",
                      colorPalette.primaryLight
                    );
                    document.body.style.setProperty(
                      "--color-brand-lighter",
                      colorPalette.primaryLighter
                    );
                    document.body.style.setProperty(
                      "--color-brand-secondary",
                      colorPalette.secondary
                    );

                    updateShadowCustomCandy(palette.candySecondary);
                  }}
                  style={{
                    background: `linear-gradient(135deg, ${palette.candy} 60%, ${palette.candySecondary} 100%)`,
                  }}
                  type="button"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <AnimatePresence>
                    {palette.candy === candy &&
                      palette.candySecondary === candySecondary && (
                        <motion.span
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center"
                          exit={{ opacity: 0, scale: 0.7 }}
                          initial={{ opacity: 0, scale: 0.7 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                          }}
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
