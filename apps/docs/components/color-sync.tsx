"use client";

import { useEffect } from "react";

import {
  applyColorPalette,
  COLOR_STORAGE_KEY,
  resetColorPalette,
} from "@/app/lib/color-palette";

type StoredPalette = {
  candy?: string;
  candySecondary?: string;
};

function applyFromStorageValue(value: string | null) {
  if (!value) {
    resetColorPalette();
    return;
  }

  try {
    const parsed = JSON.parse(value) as StoredPalette;

    if (parsed.candy && parsed.candySecondary) {
      applyColorPalette(parsed.candy, parsed.candySecondary);
    }
  } catch {
    resetColorPalette();
  }
}

export function ColorSync() {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    applyFromStorageValue(
      window.localStorage.getItem(COLOR_STORAGE_KEY)
    );

    function handleStorage(event: StorageEvent) {
      if (event.key === COLOR_STORAGE_KEY) {
        applyFromStorageValue(event.newValue);
      }
    }

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return null;
}


