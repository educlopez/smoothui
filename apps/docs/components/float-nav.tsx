"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { ColorPickerFloatNav } from "./color-picker-float-nav";

function ThemeSwitch() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    setTheme((savedTheme || systemTheme) as "light" | "dark");
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <button
      aria-label="Theme Switcher"
      className="float-trigger h-auto w-auto p-2!"
      onClick={toggleTheme}
      type="button"
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}

export function FloatNav() {
  return (
    <nav
      aria-label="Floating Navigation"
      className="-translate-x-1/2 fixed bottom-5 left-1/2 z-50 flex w-fit flex-row items-center justify-center whitespace-nowrap rounded-full border bg-background/70 px-1 py-1 text-foreground bg-blend-luminosity shadow-xs backdrop-blur-xl transition"
    >
      <div className="flex items-center">
        <ThemeSwitch />
        <ColorPickerFloatNav />
      </div>
    </nav>
  );
}
