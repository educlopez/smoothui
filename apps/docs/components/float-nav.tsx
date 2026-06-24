"use client";

import { useSoundToggle, useUiSound } from "@docs/components/sound-provider";
import { useTheme } from "next-themes";
import { IconMoonFill24, IconSunFill24 } from "nucleo-core-fill-24";
import { ColorPickerFloatNav } from "./color-picker-float-nav";

function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();
  const playToggle = useUiSound("/sounds/toggle_on.wav", 0.4);

  const toggleTheme = () => {
    playToggle();
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

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

function SoundToggle() {
  const { enabled, setEnabled, suppressed } = useSoundToggle();
  const playOn = useUiSound("/sounds/toggle_on.wav", 0.4);

  // Coarse-pointer devices duck media to play cues — hide the control there.
  if (suppressed) {
    return null;
  }

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    if (next) {
      playOn({ forceSoundEnabled: true });
    }
  };

  return (
    <button
      aria-label={enabled ? "Mute interface sounds" : "Enable interface sounds"}
      aria-pressed={enabled}
      className="float-trigger h-auto w-auto p-2!"
      onClick={toggle}
      type="button"
    >
      <svg
        aria-hidden="true"
        fill="none"
        height="20"
        viewBox="0 0 24 24"
        width="20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11 5 6 9H3v6h3l5 4V5Z"
          fill="currentColor"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        {enabled ? (
          <path
            d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
          />
        ) : (
          <path
            d="m16 9 5 6m0-6-5 6"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
          />
        )}
      </svg>
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
        <SoundToggle />
        <ColorPickerFloatNav />
      </div>
    </nav>
  );
}
