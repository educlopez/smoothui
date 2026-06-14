"use client";

import { useTheme } from "next-themes";
import { IconMoonFill24, IconSunFill24 } from "nucleo-core-fill-24";
import { ColorPickerFloatNav } from "./color-picker-float-nav";

function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <button
      aria-label="Theme Switcher"
      className="float-trigger h-auto w-auto p-2!"
      onClick={toggleTheme}
      type="button"
    >
      {resolvedTheme === "dark" ? (
        <IconSunFill24 size={20} />
      ) : (
        <IconMoonFill24 size={20} />
      )}
    </button>
  );
}

export function FloatNav() {
  return (
    <nav
      aria-label="Floating Navigation"
      className="fixed bottom-5 left-1/2 z-50 flex w-fit -translate-x-1/2 flex-row items-center justify-center whitespace-nowrap rounded-full border bg-background/70 px-1 py-1 text-foreground bg-blend-luminosity shadow-xs backdrop-blur-xl transition"
    >
      <div className="flex items-center">
        <ThemeSwitch />
        <ColorPickerFloatNav />
      </div>
    </nav>
  );
}
