export const DS_STORAGE_KEY = "smoothui-ds";

export type DesignSystem = "oat" | "legacy";

export const applyDesignSystem = (system: DesignSystem): void => {
  if (typeof document === "undefined") {
    return;
  }
  if (system === "legacy") {
    delete document.documentElement.dataset.ds;
    return;
  }
  document.documentElement.dataset.ds = "oat";
};

export const persistDesignSystem = (system: DesignSystem): void => {
  localStorage.setItem(DS_STORAGE_KEY, system);
};

export const readDesignSystem = (): DesignSystem => {
  if (typeof localStorage === "undefined") {
    return "oat";
  }
  return localStorage.getItem(DS_STORAGE_KEY) === "legacy" ? "legacy" : "oat";
};
