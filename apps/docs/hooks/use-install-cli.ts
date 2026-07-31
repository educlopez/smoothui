"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "smoothui-install-cli";
const CHANGE_EVENT = "install-cli-change";
const DEFAULT_CLI = "smoothui";

export type InstallCli = "smoothui" | "shadcn";

const isInstallCli = (value: string): value is InstallCli =>
  value === "smoothui" || value === "shadcn";

/**
 * Which CLI the install commands are written for, shared across the docs.
 *
 * The choice used to be local state inside `Installer`, so a block's toolbar and
 * a component's install tabs could disagree about how you install things — two
 * surfaces, two answers to the same question. Stored the same way as the package
 * manager preference, and synchronised across tabs and across every instance on
 * the page.
 */
export const useInstallCli = () => {
  const [cli, setCliState] = useState<InstallCli>(DEFAULT_CLI);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && isInstallCli(stored)) {
      setCliState(stored);
    }
  }, []);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (
        event.key === STORAGE_KEY &&
        event.newValue &&
        isInstallCli(event.newValue)
      ) {
        setCliState(event.newValue);
      }
    };

    const handleCustomEvent = (event: CustomEvent<InstallCli>) => {
      setCliState(event.detail);
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(CHANGE_EVENT, handleCustomEvent as EventListener);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(
        CHANGE_EVENT,
        handleCustomEvent as EventListener
      );
    };
  }, []);

  const setCli = useCallback((next: InstallCli) => {
    setCliState(next);
    localStorage.setItem(STORAGE_KEY, next);
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: next }));
  }, []);

  return [cli, setCli] as const;
};
