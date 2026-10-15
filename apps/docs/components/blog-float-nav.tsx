"use client";

import { useSearchContext } from "fumadocs-ui/contexts/search";
import { useTheme } from "next-themes";
import {
  IconMagnifierFill24,
  IconMoonFill24,
  IconSunFill24,
} from "nucleo-core-fill-24";
import { ColorPickerFloatNav } from "./color-picker-float-nav";

function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <button
      aria-label="Theme Switcher"
      className="float-trigger grid size-9! cursor-pointer place-items-center p-0!"
      onClick={toggleTheme}
      type="button"
    >
      {resolvedTheme === "dark" ? (
        <IconSunFill24 size={16} />
      ) : (
        <IconMoonFill24 size={16} />
      )}
    </button>
  );
}

function SearchButton() {
  const { setOpenSearch } = useSearchContext();

  return (
    <button
      aria-label="Search"
      className="float-trigger grid size-9! cursor-pointer place-items-center p-0!"
      onClick={() => setOpenSearch(true)}
      type="button"
    >
      <IconMagnifierFill24 size={16} />
    </button>
  );
}

export function BlogFloatNav() {
  return (
    <nav
      aria-label="Floating Navigation"
      className="fixed bottom-4 left-1/2 z-50 flex w-fit -translate-x-1/2 flex-row items-center justify-center whitespace-nowrap rounded-full border border-foreground/10 bg-background/75 px-1 py-1 text-foreground shadow-sm backdrop-blur-xl"
    >
      <div className="flex items-center gap-0.5">
        <SearchButton />
        <ThemeSwitch />
        <ColorPickerFloatNav />
      </div>
    </nav>
  );
}
