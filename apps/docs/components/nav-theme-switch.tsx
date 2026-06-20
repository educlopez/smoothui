"use client";

import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { useTheme } from "next-themes";
import { IconMoonFill24, IconSunFill24 } from "nucleo-core-fill-24";

export function NavThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      aria-label="Toggle theme"
      className={buttonVariants({
        color: "ghost",
        size: "icon-sm",
        className: "text-fd-muted-foreground",
      })}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      type="button"
    >
      {resolvedTheme === "dark" ? (
        <IconSunFill24 size={18} />
      ) : (
        <IconMoonFill24 size={18} />
      )}
    </button>
  );
}
