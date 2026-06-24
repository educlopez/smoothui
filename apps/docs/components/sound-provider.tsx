"use client";

import { useReducedMotion } from "motion/react";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useSound from "use-sound";

type SoundContextValue = {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
  /** True on touch / coarse-pointer devices, where UI sound is suppressed. */
  suppressed: boolean;
};

const SoundContext = createContext<SoundContextValue>({
  enabled: false,
  setEnabled: () => {
    // no-op default
  },
  suppressed: false,
});

const STORAGE_KEY = "sui-sound";

export function SoundProvider({ children }: { children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion();
  const [enabled, setEnabledState] = useState(false);
  const [suppressed, setSuppressed] = useState(false);

  useEffect(() => {
    // Suppress on coarse pointers (mobile/tablet): the OS ducks media to play
    // the cue, which is jarring. Reduced-motion is the default-off proxy.
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse) {
      setSuppressed(true);
      return;
    }
    if (shouldReduceMotion) {
      return; // stays off by default, but the user can still opt in
    }
    try {
      if (localStorage.getItem(STORAGE_KEY) === "on") {
        setEnabledState(true);
      }
    } catch {
      // ignore
    }
  }, [shouldReduceMotion]);

  const setEnabled = useCallback((value: boolean) => {
    setEnabledState(value);
    try {
      localStorage.setItem(STORAGE_KEY, value ? "on" : "off");
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(
    () => ({ enabled: enabled && !suppressed, setEnabled, suppressed }),
    [enabled, suppressed, setEnabled]
  );

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  );
}

export function useSoundToggle() {
  return useContext(SoundContext);
}

type PlayFn = (options?: { forceSoundEnabled?: boolean }) => void;

/** Returns a play() bound to the global sound preference, throttled so a single
 * interaction can't double-fire (e.g. a label + its input both emitting click). */
export function useUiSound(src: string, volume = 0.5): PlayFn {
  const { enabled } = useContext(SoundContext);
  const [rawPlay] = useSound(src, { soundEnabled: enabled, volume });
  const lastPlayedRef = useRef(0);

  return useCallback<PlayFn>(
    (options) => {
      const now = performance.now();
      if (now - lastPlayedRef.current < 70) {
        return;
      }
      lastPlayedRef.current = now;
      (rawPlay as PlayFn)(options);
    },
    [rawPlay]
  );
}
