"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@repo/shadcn-ui/components/ui/resizable";
import { cn } from "@repo/shadcn-ui/lib/utils";
import type { ElementRef, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

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
const REM_IN_PX = 16;
const BLOCK_PREVIEW_MIN_HEIGHT_PX = BLOCK_PREVIEW_MIN_HEIGHT_REM * REM_IN_PX;
const HEIGHT_MESSAGE_TYPE = "BLOCK_PREVIEW_HEIGHT";
const HEIGHT_REQUEST_MESSAGE_TYPE = "BLOCK_PREVIEW_HEIGHT_REQUEST";

type HeightMessage = {
  type?: unknown;
  blockId?: unknown;
  height?: unknown;
};

function extractHeightFromMessage(
  data: unknown,
  currentBlockId?: string
): number | null {
  if (!data || typeof data !== "object" || data === null) {
    return null;
  }

  const payload = data as HeightMessage;

  if (payload.type !== HEIGHT_MESSAGE_TYPE) {
    return null;
  }

  if (
    currentBlockId &&
    typeof payload.blockId === "string" &&
    payload.blockId !== currentBlockId
  ) {
    return null;
  }

  const height = Number(payload.height);

  if (!Number.isFinite(height) || height <= 0) {
    return null;
  }

  return height;
}

export const PreviewContent = ({
  children,
  type,
  blockPath,
  size = "desktop",
}: PreviewContentProps) => {
  const resizablePanelRef = useRef<ElementRef<typeof ResizablePanel>>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const blockIdRef = useRef<string | undefined>(blockPath);
  const [blockHeight, setBlockHeight] = useState<number>(
    BLOCK_PREVIEW_MIN_HEIGHT_PX
  );

  useEffect(() => {
    if (type !== "block") {
      return;
    }

    setBlockHeight(BLOCK_PREVIEW_MIN_HEIGHT_PX);
    blockIdRef.current = blockPath ?? undefined;
  }, [blockPath, type]);

  useEffect(() => {
    if (type !== "block") {
      return;
    }

    const percentage = SIZE_TO_PERCENT[size] ?? SIZE_TO_PERCENT.desktop;
    if (resizablePanelRef.current) {
      resizablePanelRef.current.resize(percentage);
    }

    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: HEIGHT_REQUEST_MESSAGE_TYPE,
          blockId: blockIdRef.current,
        },
        "*"
      );
    }
  }, [size, type]);

  useEffect(() => {
    if (type !== "block") {
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      const height = extractHeightFromMessage(event.data, blockIdRef.current);

      if (height === null) {
        return;
      }

      const nextHeight = Math.max(height, BLOCK_PREVIEW_MIN_HEIGHT_PX);

      setBlockHeight((previousHeight) =>
        Math.abs(previousHeight - nextHeight) < 1 ? previousHeight : nextHeight
      );
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [type]);

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
              className="w-full"
              loading="lazy"
              ref={iframeRef}
              src={iframeSrc}
              style={{
                backgroundColor: "hsl(var(--background))",
                border: 0,
                minHeight: `${IFRAME_MIN_HEIGHT_REM}rem`,
                height: `${Math.max(
                  blockHeight,
                  BLOCK_PREVIEW_MIN_HEIGHT_PX
                )}px`,
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
