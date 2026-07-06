"use client";

import { packageManagers } from "@docs/components/package-manager-tabs";
import { usePackageManager } from "@docs/hooks/use-package-manager";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export function PmFloatNav() {
  const [activePm, setActivePm] = usePackageManager();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const current = packageManagers.find((pm) => pm.id === activePm);
  const CurrentIcon = current?.icon;

  useEffect(() => {
    if (!open) {
      return;
    }
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        aria-label={`Package manager: ${activePm}`}
        className="float-trigger flex h-auto w-auto items-center gap-1.5 p-2!"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        {CurrentIcon && <CurrentIcon colored />}
        <span className="hidden font-medium text-sm sm:inline">{activePm}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            className="absolute bottom-12 left-1/2 z-50 flex min-w-[140px] -translate-x-1/2 flex-col gap-0.5 rounded-xl border bg-background p-1 shadow-2xl"
            exit={
              shouldReduceMotion
                ? { opacity: 0, transition: { duration: 0 } }
                : { opacity: 0, scale: 0.95, y: 12 }
            }
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.95, y: 12 }
            }
            role="menu"
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 300, damping: 30 }
            }
          >
            {packageManagers.map((pm) => {
              const Icon = pm.icon;
              const active = pm.id === activePm;
              return (
                <button
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-left font-medium text-sm transition-colors",
                    active
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  key={pm.id}
                  onClick={() => {
                    setActivePm(pm.id);
                    setOpen(false);
                  }}
                  role="menuitem"
                  type="button"
                >
                  <Icon colored={active} />
                  {pm.id}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
