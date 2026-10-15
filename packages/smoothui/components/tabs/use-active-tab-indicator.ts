"use client";

import {
  type CSSProperties,
  createContext,
  useContext,
  useLayoutEffect,
  useState,
} from "react";

type IndicatorVariant = "underline" | "pill" | "segment";

interface ActiveTabBox {
  height: number;
  left: number;
  top: number;
  width: number;
}

const ACTIVE_TAB_SELECTOR =
  '[data-slot="tabs-tab"][aria-selected="true"], [data-slot="tabs-tab"][data-active], [data-slot="tabs-tab"][data-state="active"]';

const UNDERLINE_THICKNESS_PX = 2;

export const TabsMeasureValueContext = createContext<unknown>(undefined);

const boxesEqual = (a: ActiveTabBox | null, b: ActiveTabBox | null) => {
  if (a === b) {
    return true;
  }
  if (!(a && b)) {
    return false;
  }
  return (
    a.left === b.left &&
    a.top === b.top &&
    a.width === b.width &&
    a.height === b.height
  );
};

const readActiveTabBox = (list: HTMLElement): ActiveTabBox | null => {
  const tab = list.querySelector<HTMLElement>(ACTIVE_TAB_SELECTOR);
  if (!tab) {
    return null;
  }
  return {
    height: tab.offsetHeight,
    left: tab.offsetLeft,
    top: tab.offsetTop,
    width: tab.offsetWidth,
  };
};

/**
 * Tracks the active tab's layout box (`offsetLeft` / `offsetTop` /
 * `offsetWidth` / `offsetHeight`) and refreshes on mount, value change,
 * resize, and scroll so the indicator cannot stay invisible or drift.
 */
export const useActiveTabIndicatorBox = (): {
  box: ActiveTabBox | null;
  ref: (node: HTMLElement | null) => void;
} => {
  const value = useContext(TabsMeasureValueContext);
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [box, setBox] = useState<ActiveTabBox | null>(null);

  useLayoutEffect(() => {
    if (!node) {
      setBox((prev) => (prev === null ? prev : null));
      return;
    }

    const list = node.closest<HTMLElement>('[role="tablist"]');
    if (!list) {
      return;
    }

    const measure = () => {
      const next = readActiveTabBox(list);
      setBox((prev) => {
        if ((value === null || value === undefined) && next === null) {
          return prev === null ? prev : null;
        }
        return boxesEqual(prev, next) ? prev : next;
      });
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(list);
    for (const tab of list.querySelectorAll("[data-slot='tabs-tab']")) {
      resizeObserver.observe(tab);
    }

    const mutationObserver = new MutationObserver(measure);
    mutationObserver.observe(list, {
      attributeFilter: ["aria-selected", "data-active", "data-state"],
      attributes: true,
      subtree: true,
    });

    list.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      list.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [node, value]);

  return { box, ref: setNode };
};

export const activeTabIndicatorStyle = (
  variant: IndicatorVariant,
  box: ActiveTabBox | null
): CSSProperties => {
  if (!box) {
    return { opacity: 0 };
  }
  const isUnderline = variant === "underline";
  const y = isUnderline
    ? box.top + box.height - UNDERLINE_THICKNESS_PX
    : box.top;
  return {
    height: isUnderline ? UNDERLINE_THICKNESS_PX : box.height,
    opacity: 1,
    transform: `translate(${box.left}px, ${y}px)`,
    width: box.width,
  };
};

export const composeIndicatorStyle = <State>(
  measured: CSSProperties,
  style?: CSSProperties | ((state: State) => CSSProperties | undefined)
): CSSProperties | ((state: State) => CSSProperties) => {
  if (typeof style === "function") {
    return (state: State) => ({ ...measured, ...style(state) });
  }
  return { ...measured, ...style };
};
