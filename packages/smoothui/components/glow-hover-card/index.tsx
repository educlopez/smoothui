"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { motion } from "motion/react";
import {
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  type Ref,
  cloneElement,
  useEffect,
  useRef,
  useState,
} from "react";

export type GlowHoverTheme = {
  hue: number;
  saturation: number;
  lightness: number;
};

export type GlowHoverItem = {
  id: string;
  element: ReactElement;
  theme?: GlowHoverTheme;
};

export type GlowHoverProps = {
  items: GlowHoverItem[];
  className?: string;
  maskSize?: number;
  glowIntensity?: number;
};

// Legacy types for backward compatibility
export type GlowHoverCardTheme = GlowHoverTheme;
export type GlowHoverCardItem = GlowHoverItem;
export type GlowHoverCardsProps = GlowHoverProps;

export default function GlowHover({
  items,
  className = "",
  maskSize = 400,
  glowIntensity = 0.15,
}: GlowHoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const overlayItemRefs = useRef<(HTMLElement | null)[]>([]);
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
    opacity: number;
  }>({ x: 0, y: 0, opacity: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || prefersReducedMotion) return;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      // Use clientX/clientY for viewport coordinates, then subtract container position
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setMousePosition({
        x,
        y,
        opacity: 1,
      });
    };

    const handlePointerLeave = () => {
      setMousePosition((prev) => ({ ...prev, opacity: 0 }));
    };

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [prefersReducedMotion]);

  // Sync overlay card sizes and positions with original cards
  useEffect(() => {
    if (prefersReducedMotion || !overlayRef.current || !containerRef.current) return;

    const syncCards = () => {
      const container = containerRef.current;
      const overlay = overlayRef.current;
      if (!container || !overlay) return;

      itemRefs.current.forEach((itemEl, index) => {
        const overlayItemEl = overlayItemRefs.current[index];
        if (!itemEl || !overlayItemEl) return;

        const itemRect = itemEl.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Calculate position relative to container
        const left = itemRect.left - containerRect.left;
        const top = itemRect.top - containerRect.top;

        overlayItemEl.style.position = "absolute";
        overlayItemEl.style.left = `${left}px`;
        overlayItemEl.style.top = `${top}px`;
        overlayItemEl.style.width = `${itemRect.width}px`;
        overlayItemEl.style.height = `${itemRect.height}px`;
      });
    };

    const observers: ResizeObserver[] = [];
    const mutationObserver = new MutationObserver(syncCards);

    // Sync on resize
    itemRefs.current.forEach((itemEl) => {
      if (!itemEl) return;

      const observer = new ResizeObserver(() => {
        syncCards();
      });

      observer.observe(itemEl);
      observers.push(observer);
    });

    // Sync on DOM mutations
    if (containerRef.current) {
      mutationObserver.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    // Initial sync
    syncCards();

    // Sync on scroll and resize
    window.addEventListener("scroll", syncCards, { passive: true });
    window.addEventListener("resize", syncCards);

    return () => {
      observers.forEach((observer) => observer.disconnect());
      mutationObserver.disconnect();
      window.removeEventListener("scroll", syncCards);
      window.removeEventListener("resize", syncCards);
    };
  }, [items, prefersReducedMotion]);

  // Apply glow effect styles to an element
  const applyGlowStyles = (
    element: ReactElement,
    theme?: GlowHoverTheme,
    isOverlay = false
  ): ReactElement => {
    if (!isOverlay) return element;

    const props = element.props as { style?: CSSProperties; className?: string };
    const existingStyle = props.style || {};
    const existingClassName = props.className || "";

    let glowStyles: CSSProperties;

    if (theme) {
      // Use theme HSL colors
      const hsl = `${theme.hue}, ${theme.saturation}%, ${theme.lightness}%`;
      glowStyles = {
        borderColor: `hsla(${hsl}, 1)`,
        boxShadow: `0 0 0 1px inset hsl(${hsl}), 0 0 20px hsla(${hsl}, ${glowIntensity})`,
        backgroundColor: `hsla(${hsl}, ${glowIntensity})`,
      };
    } else {
      // Use brand color from CSS variable (OKLCH format supports / opacity)
      const brandColor = "var(--color-brand)";
      // OKLCH format: oklch(L C H / opacity)
      const brandWithOpacity = `color-mix(in oklch, ${brandColor}, transparent ${(1 - glowIntensity) * 100}%)`;
      glowStyles = {
        borderColor: brandColor,
        boxShadow: `0 0 0 1px inset ${brandColor}, 0 0 20px ${brandWithOpacity}`,
        backgroundColor: brandWithOpacity,
      };
    }

    // Merge with existing styles
    const mergedStyle = {
      ...existingStyle,
      ...glowStyles,
    };

    return cloneElement(
      element,
      {
        ...props,
        style: mergedStyle,
        className: cn(existingClassName, "glow-overlay-item"),
      } as any
    );
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      style={prefersReducedMotion ? undefined : { willChange: "contents" }}
    >
      {/* Original Items */}
      <div className="contents">
        {items.map((item, index) => {
          return cloneElement(
            item.element,
            {
              key: item.id,
              ref: (el: HTMLElement | null) => {
                itemRefs.current[index] = el;
                // Preserve existing ref if any
                const elementProps = item.element.props as { ref?: Ref<HTMLElement> };
                const existingRef = elementProps?.ref;
                if (typeof existingRef === "function") {
                  existingRef(el);
                } else if (existingRef && typeof existingRef === "object") {
                  (existingRef as { current: HTMLElement | null }).current = el;
                }
              },
            } as any
          );
        })}
      </div>

      {/* Overlay with Glow Effect */}
      {!prefersReducedMotion && (
        <div
          ref={overlayRef}
          className="absolute inset-0 pointer-events-none select-none"
          style={{
            opacity: mousePosition.opacity,
            maskImage: `radial-gradient(${maskSize}px ${maskSize}px at ${mousePosition.x}px ${mousePosition.y}px, #000 1%, transparent 50%)`,
            WebkitMaskImage: `radial-gradient(${maskSize}px ${maskSize}px at ${mousePosition.x}px ${mousePosition.y}px, #000 1%, transparent 50%)`,
            transition:
              "opacity 400ms ease, mask-image 400ms ease, -webkit-mask-image 400ms ease",
            willChange: "mask-image, opacity",
          }}
          aria-hidden="true"
        >
          {items.map((item, index) => {
            const glowElement = applyGlowStyles(item.element, item.theme, true);
            return cloneElement(
              glowElement,
              {
                key: item.id,
                ref: (el: HTMLElement | null) => {
                  overlayItemRefs.current[index] = el;
                },
              } as any
            );
          })}
        </div>
      )}
    </div>
  );
}

// Legacy export for backward compatibility
export function GlowHoverCards(props: GlowHoverCardsProps) {
  return <GlowHover {...props} />;
}

