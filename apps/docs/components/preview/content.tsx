"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@repo/shadcn-ui/components/ui/resizable";
import { cn } from "@repo/shadcn-ui/lib/utils";
import type { ElementRef, ReactNode } from "react";
import { useEffect, useMemo, useRef } from "react";

type PreviewContentProps = {
  children: ReactNode;
  type: "component" | "block";
  blockPath?: string;
  size?: PreviewSize;
};

export type PreviewSize = "desktop" | "tablet" | "mobile";

const SIZE_TO_PERCENT: Record<PreviewSize, number> = {
  desktop: 100,
  tablet: 60,
  mobile: 30,
};

const BLOCK_PREVIEW_MIN_HEIGHT_REM = 32;
const COMPONENT_PANEL_MIN_SIZE = 40;
const BLOCK_PANEL_MIN_SIZE = 30;
const IFRAME_MIN_HEIGHT_REM = 32;
const IFRAME_HEIGHT_PX = 920;

export const PreviewContent = ({
  children,
  type,
  blockPath,
  size = "desktop",
}: PreviewContentProps) => {
  const resizablePanelRef = useRef<ElementRef<typeof ResizablePanel>>(null);

  useEffect(() => {
    if (type !== "block") {
      return;
    }

    const percentage = SIZE_TO_PERCENT[size] ?? SIZE_TO_PERCENT.desktop;
    if (resizablePanelRef.current) {
      resizablePanelRef.current.resize(percentage);
    }
  }, [size, type]);

  const iframeSrc = useMemo(() => {
    if (type !== "block" || !blockPath) {
      return null;
    }

    return `/blocks/preview/${blockPath}`;
  }, [blockPath, type]);

  return (
    <div
      className={cn(
        "flex",
        "h-full",
        "w-full",
        "flex-col",
        type === "component"
          ? "size-full"
          : `h-auto min-h-[${BLOCK_PREVIEW_MIN_HEIGHT_REM}rem]`
      )}
    >
      <ResizablePanelGroup
        className={cn(
          "flex-1",
          type === "component" ? "size-full" : "h-auto w-full"
        )}
        direction="horizontal"
      >
        <ResizablePanel
          className={cn(
            "bg-background",
            "not-fumadocs-codeblock",
            "not-prose",
            "peer",
            type === "component"
              ? cn("overflow-hidden!", "size-full")
              : cn(
                  "h-auto",
                  "overflow-hidden!",
                  "w-full",
                  `min-h-[${BLOCK_PREVIEW_MIN_HEIGHT_REM}rem]`
                )
          )}
          defaultSize={100}
          maxSize={100}
          minSize={
            type === "block" ? BLOCK_PANEL_MIN_SIZE : COMPONENT_PANEL_MIN_SIZE
          }
          ref={type === "block" ? resizablePanelRef : undefined}
        >
          {type === "block" && iframeSrc ? (
            <iframe
              className="h-full w-full"
              height={IFRAME_HEIGHT_PX}
              loading="lazy"
              src={iframeSrc}
              style={{
                backgroundColor: "hsl(var(--background))",
                border: 0,
                minHeight: `${IFRAME_MIN_HEIGHT_REM}rem`,
              }}
              title={`${blockPath ?? "block"} preview`}
            />
          ) : (
            children
          )}
        </ResizablePanel>
        <ResizableHandle
          className="peer-data-[panel-size=100.0]:w-0"
          withHandle
        />
        <ResizablePanel
          className={cn("bg-background", "border-none")}
          defaultSize={0}
          maxSize={70}
          minSize={0}
        />
      </ResizablePanelGroup>
    </div>
  );
};
