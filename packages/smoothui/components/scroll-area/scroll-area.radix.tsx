"use client";

/**
 * SmoothUI Scroll Area — Radix twin.
 * Overlay scrollbar with hover/scroll fade + thin→wide thumb
 * (Fluid Functionalism scrollbar cues). Touch-primary devices fall back
 * to native overflow scrolling.
 */

import { cn } from "@repo/smoothui-utils";
import { ScrollArea as ScrollAreaPrimitive } from "radix-ui";
import {
  type ComponentProps,
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export interface ScrollAreaProps {
  /** Scrollable content */
  children?: ReactNode;
  /** Optional CSS class names for the root */
  className?: string;
  /** Show a horizontal scrollbar when content overflows (default true) */
  horizontal?: boolean;
  /** Fade content at scroll edges via mask (default false) */
  scrollFade?: boolean | "x" | "y";
  /** Show a vertical scrollbar when content overflows (default true) */
  vertical?: boolean;
  /** Optional CSS class names for the viewport */
  viewportClassName?: string;
}

export type ScrollAreaRootProps = Omit<
  ComponentProps<typeof ScrollAreaPrimitive.Root>,
  "className"
> & { className?: string };
export type ScrollAreaViewportProps = Omit<
  ComponentProps<typeof ScrollAreaPrimitive.Viewport>,
  "className"
> & { className?: string };
/** Plain content wrapper — Radix has no Content part; kept for API parity with Base. */
export type ScrollAreaContentProps = ComponentProps<"div">;
export type ScrollAreaScrollbarProps = Omit<
  ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  "className"
> & { className?: string };
export type ScrollAreaThumbProps = Omit<
  ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaThumb>,
  "className"
> & { className?: string };
export type ScrollAreaCornerProps = Omit<
  ComponentProps<typeof ScrollAreaPrimitive.Corner>,
  "className"
> & { className?: string };

const SCROLL_LINGER_MS = 600;

const TouchPrimaryContext = createContext(false);
const ScrollbarVisibleContext = createContext(true);

const useIsTouchPrimary = () => {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    const update = () => setIsTouch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isTouch;
};

export const ScrollAreaRoot = ({
  className,
  ...props
}: ScrollAreaRootProps) => (
  <ScrollAreaPrimitive.Root
    className={cn("relative overflow-hidden", className)}
    data-slot="scroll-area"
    {...props}
  />
);

export const ScrollAreaViewport = ({
  className,
  ...props
}: ScrollAreaViewportProps) => (
  <ScrollAreaPrimitive.Viewport
    className={cn(
      "size-full rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
      className
    )}
    data-slot="scroll-area-viewport"
    {...props}
  />
);

export const ScrollAreaContent = ({
  className,
  ...props
}: ScrollAreaContentProps) => (
  <div className={cn(className)} data-slot="scroll-area-content" {...props} />
);

export const ScrollAreaScrollbar = ({
  className,
  orientation = "vertical",
  ...props
}: ScrollAreaScrollbarProps) => {
  const isTouch = useContext(TouchPrimaryContext);
  const visible = useContext(ScrollbarVisibleContext);

  if (isTouch) {
    return null;
  }

  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      className={cn(
        "group/scrollbar pointer-events-none z-20 flex touch-none select-none opacity-0 transition-opacity delay-160 duration-120 ease-out data-[visible]:pointer-events-auto data-[visible]:opacity-100 data-[visible]:delay-0 data-[visible]:duration-160",
        orientation === "vertical" && "h-full w-2.5",
        orientation === "horizontal" && "h-2.5 w-full flex-col",
        className
      )}
      data-slot="scroll-area-scrollbar"
      data-visible={visible ? "" : undefined}
      orientation={orientation}
      {...props}
    />
  );
};

export const ScrollAreaThumb = ({
  className,
  ...props
}: ScrollAreaThumbProps) => (
  <ScrollAreaPrimitive.ScrollAreaThumb
    className={cn(
      "relative flex-1 rounded-full bg-foreground/20 transition-[background-color,width,height] duration-160 ease-in-out before:absolute before:top-1/2 before:left-1/2 before:size-full before:min-h-11 before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2 group-hover/scrollbar:bg-foreground/35 group-active/scrollbar:bg-foreground/45",
      "[[data-orientation=vertical]_&]:mx-auto [[data-orientation=vertical]_&]:my-1 [[data-orientation=vertical]_&]:w-1 [[data-orientation=vertical]_&]:-translate-x-0.5 [[data-orientation=vertical]_&]:group-hover/scrollbar:w-1.5",
      "[[data-orientation=horizontal]_&]:mx-1 [[data-orientation=horizontal]_&]:my-auto [[data-orientation=horizontal]_&]:h-1 [[data-orientation=horizontal]_&]:-translate-y-0.5 [[data-orientation=horizontal]_&]:group-hover/scrollbar:h-1.5",
      className
    )}
    data-slot="scroll-area-thumb"
    {...props}
  />
);

export const ScrollAreaCorner = ({
  className,
  ...props
}: ScrollAreaCornerProps) => (
  <ScrollAreaPrimitive.Corner
    className={cn(className)}
    data-slot="scroll-area-corner"
    {...props}
  />
);

const scrollFadeClass = (scrollFade: ScrollAreaProps["scrollFade"]) => {
  if (!scrollFade) {
    return;
  }
  if (scrollFade === "x") {
    return "scroll-fade-x";
  }
  return "scroll-fade";
};

/**
 * SmoothUI Scroll Area — Radix twin.
 * Same public props as the Base UI twin; headless via `radix-ui` ScrollArea.
 */
export default function ScrollArea({
  children,
  className,
  horizontal = true,
  scrollFade = false,
  vertical = true,
  viewportClassName,
}: ScrollAreaProps) {
  const isTouch = useIsTouchPrimary();
  const [hovering, setHovering] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
    },
    []
  );

  const handleScroll = () => {
    setScrolling(true);
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }
    scrollTimerRef.current = setTimeout(
      () => setScrolling(false),
      SCROLL_LINGER_MS
    );
  };

  if (isTouch) {
    return (
      <div
        aria-roledescription="scroll area"
        className={cn("relative overflow-hidden", className)}
        data-slot="scroll-area"
        role="group"
      >
        <div
          className={cn(
            "size-full rounded-[inherit]",
            vertical && !horizontal && "overflow-y-auto",
            horizontal && !vertical && "overflow-x-auto",
            vertical && horizontal && "overflow-auto",
            scrollFadeClass(scrollFade),
            viewportClassName
          )}
          data-slot="scroll-area-viewport"
          // Scrollable viewport must be keyboard-focusable (ARIA APG).
          // biome-ignore lint/a11y/noNoninteractiveTabindex: intentional focus target for overflow scroll
          tabIndex={0}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <TouchPrimaryContext.Provider value={false}>
      <ScrollbarVisibleContext.Provider value={hovering || scrolling}>
        <ScrollAreaRoot
          className={className}
          onPointerEnter={() => setHovering(true)}
          onPointerLeave={() => setHovering(false)}
          type="always"
        >
          <ScrollAreaViewport
            className={cn(scrollFadeClass(scrollFade), viewportClassName)}
            onScroll={handleScroll}
          >
            <ScrollAreaContent>{children}</ScrollAreaContent>
          </ScrollAreaViewport>
          {vertical ? (
            <ScrollAreaScrollbar orientation="vertical">
              <ScrollAreaThumb />
            </ScrollAreaScrollbar>
          ) : null}
          {horizontal ? (
            <ScrollAreaScrollbar orientation="horizontal">
              <ScrollAreaThumb />
            </ScrollAreaScrollbar>
          ) : null}
          {vertical && horizontal ? <ScrollAreaCorner /> : null}
        </ScrollAreaRoot>
      </ScrollbarVisibleContext.Provider>
    </TouchPrimaryContext.Provider>
  );
}
