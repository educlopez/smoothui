const DS_STORAGE_KEY = "smoothui-ds";

/** Oat is the only docs look. Drop a saved Original choice so it cannot return. */
export const applyOat = (): void => {
  if (typeof document === "undefined") {
    return;
  }
  document.documentElement.dataset.ds = "oat";
  try {
    localStorage.removeItem(DS_STORAGE_KEY);
  } catch {
    // Storage can be blocked; the attribute still paints Oat.
  }
};
