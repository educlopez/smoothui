"use client";

import { useSoundToggle, useUiSound } from "@docs/components/sound-provider";
import { ColorPickerFloatNav } from "./color-picker-float-nav";
import { KitFloatNav } from "./kit-float-nav";
import { PmFloatNav } from "./pm-float-nav";

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
      className="float-trigger grid size-9! cursor-pointer place-items-center p-0!"
      onClick={toggle}
      type="button"
    >
      <svg
        aria-hidden="true"
        fill="none"
        height="16"
        viewBox="0 0 24 24"
        width="16"
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
      className="fixed bottom-4 left-1/2 z-50 flex w-fit max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-row items-center justify-center whitespace-nowrap rounded-full border border-foreground/10 bg-background/75 px-1 py-1 text-foreground shadow-sm backdrop-blur-xl"
    >
      <div className="flex items-center gap-0.5">
        <SoundToggle />
        <ColorPickerFloatNav />
        <div aria-hidden className="mx-0.5 h-4 w-px bg-foreground/15" />
        <PmFloatNav />
        <KitFloatNav />
      </div>
    </nav>
  );
}
