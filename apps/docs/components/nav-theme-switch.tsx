"use client";

import { useTheme } from "next-themes";
import { IconMoonFill24, IconSunFill24 } from "nucleo-core-fill-24";

export function NavThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      aria-label="Toggle theme"
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-fd-accent"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
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
