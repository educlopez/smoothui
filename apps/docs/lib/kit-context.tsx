"use client";

import {
  applyColorPalette,
  persistColorPalette,
} from "@docs/app/lib/color-palette";
import { THEME_PALETTES } from "@docs/lib/registry-themes";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";

const STORAGE_KEY = "smoothui-kit-v1";

export type KitItem = {
  /** Registry slug used in the install command (`@smoothui/<slug>`). */
  slug: string;
  title: string;
};

type State = KitItem[];

type Action =
  | { type: "hydrate"; items: State }
  | { type: "add"; item: KitItem }
  | { type: "addMany"; items: State }
  | { type: "remove"; slug: string }
  | { type: "removeMany"; slugs: string[] }
  | { type: "toggle"; item: KitItem }
  | { type: "clear" };

const mergeItems = (state: State, incoming: State): State => {
  const bySlug = new Map(state.map((i) => [i.slug, i]));
  for (const item of incoming) {
    if (!bySlug.has(item.slug)) {
      bySlug.set(item.slug, item);
    }
  }
  return [...bySlug.values()];
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "hydrate":
      return action.items;
    case "add":
      return mergeItems(state, [action.item]);
    case "addMany":
      return mergeItems(state, action.items);
    case "remove":
      return state.filter((i) => i.slug !== action.slug);
    case "removeMany": {
      const drop = new Set(action.slugs);
      return state.filter((i) => !drop.has(i.slug));
    }
    case "toggle":
      return state.some((i) => i.slug === action.item.slug)
        ? state.filter((i) => i.slug !== action.item.slug)
        : [...state, action.item];
    case "clear":
      return [];
    default:
      return state;
  }
};

const parse = (raw: string | null): State => {
  if (!raw) {
    return [];
  }
  try {
    const data = JSON.parse(raw);
    if (
      Array.isArray(data) &&
      data.every(
        (i) => typeof i?.slug === "string" && typeof i?.title === "string"
      )
    ) {
      return data;
    }
  } catch {
    // ignore malformed storage
  }
  return [];
};

/** "agent-avatar" -> "Agent Avatar" (fallback title for slugs without titles). */
export const prettify = (slug: string) =>
  slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

/** Parse a `?kit=slug-a,slug-b` query param into kit items. */
const parseKitParam = (search: string): State => {
  const param = new URLSearchParams(search).get("kit");
  if (!param) {
    return [];
  }
  const seen = new Set<string>();
  return param
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s) => /^[a-z0-9-]+$/.test(s) && !seen.has(s) && seen.add(s))
    .map((slug) => ({ slug, title: prettify(slug) }));
};

/** Apply a shared `?theme=<name>` by setting the site color palette. */
const applySharedTheme = (name: string | null) => {
  if (!name) {
    return;
  }
  const palette = THEME_PALETTES.find((p) => p.name === name.toLowerCase());
  if (palette) {
    applyColorPalette(palette.primary, palette.secondary);
    persistColorPalette(palette.primary, palette.secondary);
  }
};

type KitContextValue = {
  items: KitItem[];
  count: number;
  /** Latest human-readable change, for an `aria-live` announcer. */
  message: string;
  has: (slug: string) => boolean;
  add: (item: KitItem) => void;
  addMany: (items: KitItem[]) => void;
  remove: (slug: string) => void;
  removeMany: (slugs: string[]) => void;
  toggle: (item: KitItem) => void;
  clear: () => void;
};

const KitContext = createContext<KitContextValue | null>(null);

export function KitProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(reducer, []);
  const [message, setMessage] = useState("");
  // Gates the persist effect so it can't flush the empty initial state to
  // storage before hydration (from `?kit=` or localStorage) has landed.
  const [hasHydrated, setHasHydrated] = useState(false);

  // Hydrate after mount (SSR-safe). A `?kit=` link wins over stored state so
  // shared kits load as-is (applying the shared theme to the site palette);
  // then strip the params so edits aren't overwritten.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shared = parseKitParam(window.location.search);

    if (shared.length > 0) {
      dispatch({ type: "hydrate", items: shared });
      applySharedTheme(params.get("theme"));
      const url = new URL(window.location.href);
      url.searchParams.delete("kit");
      url.searchParams.delete("theme");
      window.history.replaceState({}, "", url);
    } else {
      dispatch({
        type: "hydrate",
        items: parse(localStorage.getItem(STORAGE_KEY)),
      });
    }
    setHasHydrated(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        dispatch({ type: "hydrate", items: parse(e.newValue) });
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Persist on every change, once hydration has landed (avoids overwriting
  // stored/shared items with the empty initial state on first mount).
  useEffect(() => {
    if (!hasHydrated) {
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hasHydrated]);

  const value = useMemo<KitContextValue>(
    () => ({
      items,
      count: items.length,
      message,
      has: (slug) => items.some((i) => i.slug === slug),
      add: (item) => {
        dispatch({ type: "add", item });
        setMessage(`${item.title} added to bundle`);
      },
      addMany: (next) => {
        dispatch({ type: "addMany", items: next });
        setMessage(
          next.length === 1
            ? `${next[0].title} added to bundle`
            : `${next.length} components added to bundle`
        );
      },
      remove: (slug) => {
        const removed = items.find((i) => i.slug === slug);
        dispatch({ type: "remove", slug });
        setMessage(
          removed
            ? `${removed.title} removed from bundle`
            : "Item removed from bundle"
        );
      },
      removeMany: (slugs) => {
        dispatch({ type: "removeMany", slugs });
        setMessage(
          slugs.length === 1
            ? "1 component removed from bundle"
            : `${slugs.length} components removed from bundle`
        );
      },
      toggle: (item) => {
        const exists = items.some((i) => i.slug === item.slug);
        dispatch({ type: "toggle", item });
        setMessage(
          exists
            ? `${item.title} removed from bundle`
            : `${item.title} added to bundle`
        );
      },
      clear: () => {
        dispatch({ type: "clear" });
        setMessage("Bundle cleared");
      },
    }),
    [items, message]
  );

  return <KitContext.Provider value={value}>{children}</KitContext.Provider>;
}

export function useKit() {
  const ctx = useContext(KitContext);
  if (!ctx) {
    throw new Error("useKit must be used within a KitProvider");
  }
  return ctx;
}
