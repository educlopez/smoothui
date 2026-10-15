"use client";

/**
 * SmoothUI Scroll Area — Base UI twin (default).
 * Overlay scrollbar: thin at rest, widens on track hover; fades in while
 * hovering/scrolling (Fluid Functionalism scrollbar cues).
 */

import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import { cn } from "@repo/smoothui-utils";
import type { ComponentProps } from "react";

export interface ScrollAreaProps {
  /** Scrollable content */
  children?: React.ReactNode;
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
export type ScrollAreaContentProps = Omit<
  ComponentProps<typeof ScrollAreaPrimitive.Content>,
  "className"
> & { className?: string };
export type ScrollAreaScrollbarProps = Omit<
  ComponentProps<typeof ScrollAreaPrimitive.Scrollbar>,
  "className"
> & { className?: string };
export type ScrollAreaThumbProps = Omit<
  ComponentProps<typeof ScrollAreaPrimitive.Thumb>,
  "className"
> & { className?: string };
export type ScrollAreaCornerProps = Omit<
  ComponentProps<typeof ScrollAreaPrimitive.Corner>,
  "className"
> & { className?: string };

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
      "size-full overscroll-contain rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
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
  <ScrollAreaPrimitive.Content
    className={cn(className)}
    data-slot="scroll-area-content"
    {...props}
  />
);

export const ScrollAreaScrollbar = ({
  className,
  orientation = "vertical",
  ...props
}: ScrollAreaScrollbarProps) => (
  <ScrollAreaPrimitive.Scrollbar
    className={cn(
      "group/scrollbar pointer-events-none z-10 m-px flex touch-none select-none opacity-0 transition-opacity duration-150 data-hovering:pointer-events-auto data-scrolling:pointer-events-auto data-hovering:opacity-100 data-scrolling:opacity-100 data-scrolling:duration-0 motion-reduce:transition-none",
      orientation === "vertical" && "w-2.5 flex-col p-px",
      orientation === "horizontal" && "h-2.5 flex-row p-px",
      className
    )}
    data-slot="scroll-area-scrollbar"
    orientation={orientation}
    {...props}
  />
);

export const ScrollAreaThumb = ({
  className,
  ...props
}: ScrollAreaThumbProps) => (
  <ScrollAreaPrimitive.Thumb
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
 * SmoothUI Scroll Area — Base UI twin (default).
 * Convenience API; use the compound parts for custom layouts.
 */
export default function ScrollArea({
  children,
  className,
  horizontal = true,
  scrollFade = false,
  vertical = true,
  viewportClassName,
}: ScrollAreaProps) {
  return (
    <ScrollAreaRoot className={className}>
      <ScrollAreaViewport
        className={cn(scrollFadeClass(scrollFade), viewportClassName)}
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
  );
}
