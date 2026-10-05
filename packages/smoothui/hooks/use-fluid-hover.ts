"use client";

import {
  type Dispatch,
  type RefObject,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export interface ItemRect {
  height: number;
  left: number;
  top: number;
  width: number;
}

export interface UseFluidHoverOptions {
  /**
   * Which direction to resolve the nearest item along.
   * - `"y"` — vertical lists (default)
   * - `"x"` — horizontal strips
   * - `"xy"` — 2-D grids (Euclidean distance to center)
   */
  axis?: "x" | "y" | "xy";
  /**
   * Route clicks that land in gaps/padding to the lit item.
   * Pass `false` to leave empty space inert, or `{ maxDistance }` to limit.
   */
  gapClick?: boolean | { maxDistance?: number };
  /**
   * Skip an item without unregistering it (e.g. collapsed sub-tree).
   * Consulted per mouse move — keep it cheap.
   */
  isItemDisabled?: (element: HTMLElement) => boolean;
}

export interface UseFluidHoverReturn {
  activeIndex: number | null;
  handlers: {
    onClick: (e: React.MouseEvent) => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onMouseMove: (e: React.MouseEvent) => void;
  };
  isMeasured: boolean;
  itemRects: ItemRect[];
  measureItems: () => void;
  registerItem: (index: number, element: HTMLElement | null) => void;
  remeasure: () => void;
  sessionRef: RefObject<number>;
  setActiveIndex: Dispatch<SetStateAction<number | null>>;
}

export interface PickNearestInput {
  axis: "x" | "y" | "xy";
  border: { x: number; y: number };
  containerRect: { height: number; left: number; top: number; width: number };
  isDisabled?: (index: number) => boolean;
  layoutSize: { height: number; width: number };
  point: { x: number; y: number };
  rects: readonly (ItemRect | undefined)[];
  scroll: { x: number; y: number };
}

/**
 * Nearest-item rule: an item the pointer is inside wins; otherwise the item
 * whose center is nearest does. Ties keep the first item.
 */
export const pickNearest = ({
  axis,
  point,
  rects,
  containerRect,
  scroll,
  border,
  layoutSize,
  isDisabled,
}: PickNearestInput): number | null => {
  const scaleX =
    layoutSize.width > 0 ? containerRect.width / layoutSize.width : 1;
  const scaleY =
    layoutSize.height > 0 ? containerRect.height / layoutSize.height : 1;
  let closestIndex: number | null = null;
  let closestDistance = Number.POSITIVE_INFINITY;
  let containingIndex: number | null = null;

  for (let index = 0; index < rects.length; index++) {
    const r = rects[index];
    if (!r) {
      continue;
    }
    if (isDisabled?.(index)) {
      continue;
    }

    if (axis === "xy") {
      const left = containerRect.left + (border.x + r.left - scroll.x) * scaleX;
      const top = containerRect.top + (border.y + r.top - scroll.y) * scaleY;
      const width = r.width * scaleX;
      const height = r.height * scaleY;
      if (
        point.x >= left &&
        point.x <= left + width &&
        point.y >= top &&
        point.y <= top + height
      ) {
        containingIndex = index;
      }
      const distance = Math.hypot(
        point.x - (left + width / 2),
        point.y - (top + height / 2)
      );
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
      continue;
    }

    const horizontal = axis === "x";
    const mousePos = horizontal ? point.x : point.y;
    const scale = horizontal ? scaleX : scaleY;
    const itemStart =
      (horizontal ? containerRect.left : containerRect.top) +
      ((horizontal ? border.x : border.y) +
        (horizontal ? r.left : r.top) -
        (horizontal ? scroll.x : scroll.y)) *
        scale;
    const itemSize = (horizontal ? r.width : r.height) * scale;
    if (mousePos >= itemStart && mousePos <= itemStart + itemSize) {
      containingIndex = index;
    }
    const distance = Math.abs(mousePos - (itemStart + itemSize / 2));
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  }

  return containingIndex ?? closestIndex;
};

/** Set on the highlighted item (boolean attribute). */
export const ACTIVE_ATTR = "data-fluid-hover-active";
/** Set on the container: the highlighted index, or absent. */
export const ACTIVE_INDEX_ATTR = "data-fluid-hover-active-index";

const ACTIVATOR_SELECTOR =
  "a[href], button, [role='menuitem'], [role='menuitemradio'], [role='menuitemcheckbox'], [role='option'], [role='radio'], [role='checkbox'], [role='tab'], [role='link'], [role='button']";

const resolveActivator = (element: HTMLElement): HTMLElement => {
  if (element.matches(ACTIVATOR_SELECTOR) || element.hasAttribute("tabindex")) {
    return element;
  }
  return element.querySelector<HTMLElement>(ACTIVATOR_SELECTOR) ?? element;
};

const MEASUREMENT_ATTEMPTS = 3;

/**
 * Tracks the nearest list/strip/grid item under the cursor so a single
 * highlight can glide between rows instead of blinking on `:hover`.
 */
export const useFluidHover = (
  containerRef: RefObject<HTMLElement | null>,
  options: UseFluidHoverOptions = {}
): UseFluidHoverReturn => {
  const { axis = "y", isItemDisabled, gapClick = true } = options;
  const gapClickMaxDistance =
    typeof gapClick === "object"
      ? (gapClick.maxDistance ?? Number.POSITIVE_INFINITY)
      : Number.POSITIVE_INFINITY;

  const itemsRef = useRef(new Map<number, HTMLElement>());
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeIndexRef = useRef<number | null>(null);
  activeIndexRef.current = activeIndex;

  useEffect(() => {
    const container = containerRef.current;
    if (activeIndex === null) {
      container?.removeAttribute(ACTIVE_INDEX_ATTR);
    } else {
      container?.setAttribute(ACTIVE_INDEX_ATTR, String(activeIndex));
    }
    const active =
      activeIndex === null ? undefined : itemsRef.current.get(activeIndex);
    active?.setAttribute(ACTIVE_ATTR, "");
    return () => {
      active?.removeAttribute(ACTIVE_ATTR);
      if (activeIndex !== null) {
        itemsRef.current.get(activeIndex)?.removeAttribute(ACTIVE_ATTR);
      }
    };
  }, [activeIndex, containerRef]);

  const [itemRects, setItemRects] = useState<ItemRect[]>([]);
  const [isMeasured, setIsMeasured] = useState(false);
  const itemRectsRef = useRef<ItemRect[]>([]);
  const sessionRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const remeasureRafIdRef = useRef<number | null>(null);

  const runMeasurement = useCallback(() => {
    const container = containerRef.current;
    if (!container) {
      return false;
    }
    const rects: ItemRect[] = [];
    let everyItemHasLayout = true;

    for (const [index, element] of itemsRef.current) {
      const hasLayoutBox =
        element.offsetParent !== null ||
        element.offsetWidth > 0 ||
        element.offsetHeight > 0;
      if (!hasLayoutBox) {
        everyItemHasLayout = false;
        continue;
      }

      let top = element.offsetTop;
      let left = element.offsetLeft;
      let ancestor = element.offsetParent as HTMLElement | null;
      while (
        ancestor &&
        ancestor !== container &&
        container.contains(ancestor)
      ) {
        top += ancestor.offsetTop + ancestor.clientTop;
        left += ancestor.offsetLeft + ancestor.clientLeft;
        ancestor = ancestor.offsetParent as HTMLElement | null;
      }
      rects[index] = {
        height: element.offsetHeight,
        left,
        top,
        width: element.offsetWidth,
      };
    }

    if (!everyItemHasLayout) {
      return false;
    }

    const prev = itemRectsRef.current;
    let changed = prev.length !== rects.length;
    for (let i = 0; !changed && i < rects.length; i++) {
      const p = prev[i];
      const r = rects[i];
      if (p === r) {
        continue;
      }
      changed =
        !(p && r) ||
        p.top !== r.top ||
        p.left !== r.left ||
        p.width !== r.width ||
        p.height !== r.height;
    }
    if (changed) {
      itemRectsRef.current = rects;
      setItemRects(rects);
    }
    return true;
  }, [containerRef]);

  const measureItems = useCallback(() => {
    runMeasurement();
  }, [runMeasurement]);

  const scheduleMeasurement = useCallback(
    (attemptsLeft: number) => {
      if (remeasureRafIdRef.current !== null) {
        cancelAnimationFrame(remeasureRafIdRef.current);
      }
      remeasureRafIdRef.current = requestAnimationFrame(() => {
        remeasureRafIdRef.current = null;
        if (runMeasurement()) {
          setIsMeasured(true);
        } else if (attemptsLeft > 1) {
          scheduleMeasurement(attemptsLeft - 1);
        }
      });
    },
    [runMeasurement]
  );

  const remeasure = useCallback(() => {
    setIsMeasured(false);
    scheduleMeasurement(MEASUREMENT_ATTEMPTS);
  }, [scheduleMeasurement]);

  const itemRoRef = useRef<ResizeObserver | null>(null);
  const getItemRo = useCallback(() => {
    if (itemRoRef.current === null && typeof ResizeObserver !== "undefined") {
      itemRoRef.current = new ResizeObserver(() =>
        scheduleMeasurement(MEASUREMENT_ATTEMPTS)
      );
    }
    return itemRoRef.current;
  }, [scheduleMeasurement]);

  const registerItem = useCallback(
    (index: number, element: HTMLElement | null) => {
      if (element) {
        itemsRef.current.set(index, element);
        getItemRo()?.observe(element);
        if (index === activeIndexRef.current) {
          element.setAttribute(ACTIVE_ATTR, "");
        }
      } else {
        const previous = itemsRef.current.get(index);
        if (previous) {
          itemRoRef.current?.unobserve(previous);
        }
        previous?.removeAttribute(ACTIVE_ATTR);
        itemsRef.current.delete(index);
        if (index === activeIndexRef.current) {
          setActiveIndex((current) =>
            current === index && !itemsRef.current.has(index) ? null : current
          );
        }
      }
      remeasure();
    },
    [remeasure, getItemRo]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }

      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        const container = containerRef.current;
        if (!container) {
          return;
        }
        setActiveIndex(
          pickNearest({
            axis,
            border: { x: container.clientLeft, y: container.clientTop },
            containerRect: container.getBoundingClientRect(),
            isDisabled: isItemDisabled
              ? (index) => {
                  const el = itemsRef.current.get(index);
                  return Boolean(el && isItemDisabled(el));
                }
              : undefined,
            layoutSize: {
              height: container.offsetHeight,
              width: container.offsetWidth,
            },
            point: { x: mouseX, y: mouseY },
            rects: itemRectsRef.current,
            scroll: { x: container.scrollLeft, y: container.scrollTop },
          })
        );
      });
    },
    [axis, containerRef, isItemDisabled]
  );

  const handleMouseEnter = useCallback(() => {
    sessionRef.current += 1;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    setActiveIndex(null);
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) {
        return;
      }
      for (const element of itemsRef.current.values()) {
        if (element.contains(target)) {
          return;
        }
      }
      if (!target.isConnected) {
        return;
      }
      const control = (target as Element).closest?.(
        "input, textarea, select, button, a, summary, [contenteditable], [role='textbox'], [role='searchbox'], [role='button']"
      );
      if (control) {
        return;
      }
      if (gapClick === false) {
        return;
      }
      const index = activeIndexRef.current;
      if (index === null) {
        return;
      }
      const element = itemsRef.current.get(index);
      if (!element || isItemDisabled?.(element)) {
        return;
      }
      if (gapClickMaxDistance !== Number.POSITIVE_INFINITY) {
        const r = element.getBoundingClientRect();
        const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
        const dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
        if (Math.hypot(dx, dy) > gapClickMaxDistance) {
          return;
        }
      }
      resolveActivator(element).click();
    },
    [isItemDisabled, gapClick, gapClickMaxDistance]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") {
      return;
    }
    const ro = new ResizeObserver(() =>
      scheduleMeasurement(MEASUREMENT_ATTEMPTS)
    );
    ro.observe(container);
    return () => ro.disconnect();
  }, [containerRef, scheduleMeasurement]);

  useEffect(
    () => () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (remeasureRafIdRef.current !== null) {
        cancelAnimationFrame(remeasureRafIdRef.current);
      }
      itemRoRef.current?.disconnect();
      itemRoRef.current = null;
    },
    []
  );

  return {
    activeIndex,
    handlers: {
      onClick: handleClick,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onMouseMove: handleMouseMove,
    },
    isMeasured,
    itemRects,
    measureItems,
    registerItem,
    remeasure,
    sessionRef,
    setActiveIndex,
  };
};

/**
 * Registers an item with its fluid-hover list for as long as it is mounted.
 */
export const useRegisterFluidHoverItem = (
  registerItem:
    | ((index: number, element: HTMLElement | null) => void)
    | undefined,
  index: number | undefined,
  ref: RefObject<HTMLElement | null>
) => {
  useEffect(() => {
    if (!registerItem || index === undefined) {
      return;
    }
    registerItem(index, ref.current);
    return () => registerItem(index, null);
  }, [index, registerItem, ref]);
};
