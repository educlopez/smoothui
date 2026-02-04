"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "smoothui-package-manager";
const DEFAULT_PM = "pnpm";

export type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

export const usePackageManager = () => {
  const [packageManager, setPackageManagerState] =
    useState<PackageManager>(DEFAULT_PM);

  // Initialize from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as PackageManager | null;
    if (stored && ["pnpm", "npm", "yarn", "bun"].includes(stored)) {
      setPackageManagerState(stored);
    }
  }, []);

  // Listen for changes from other components/tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const newPm = e.newValue as PackageManager;
        if (["pnpm", "npm", "yarn", "bun"].includes(newPm)) {
          setPackageManagerState(newPm);
        }
      }
    };

    // Custom event for same-tab synchronization
    const handleCustomEvent = (e: CustomEvent<PackageManager>) => {
      setPackageManagerState(e.detail);
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(
      "package-manager-change",
      handleCustomEvent as EventListener
    );

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(
        "package-manager-change",
        handleCustomEvent as EventListener
      );
    };
  }, []);

  const setPackageManager = useCallback((pm: PackageManager) => {
    setPackageManagerState(pm);
    localStorage.setItem(STORAGE_KEY, pm);

    // Dispatch custom event for same-tab synchronization
    window.dispatchEvent(
      new CustomEvent("package-manager-change", { detail: pm })
    );
  }, []);

  return [packageManager, setPackageManager] as const;
};
