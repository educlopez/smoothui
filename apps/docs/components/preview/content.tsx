"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@repo/shadcn-ui/components/ui/resizable";
import { cn } from "@repo/shadcn-ui/lib/utils";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

interface PreviewContentProps {
  blockPath?: string;
  children: ReactNode;
  size?: PreviewSize;
  type: "component" | "block";
}

export type PreviewSize = "desktop" | "tablet" | "mobile";

const PANEL1_SIZE: Record<PreviewSize, number> = {
  desktop: 100,
  tablet: 62,
  mobile: 35,
};

const BLOCK_PREVIEW_MIN_HEIGHT_REM = 32;
const IFRAME_MIN_HEIGHT_REM = 32;
const REM_IN_PX = 16;
const BLOCK_PREVIEW_MIN_HEIGHT_PX = BLOCK_PREVIEW_MIN_HEIGHT_REM * REM_IN_PX;
const HEIGHT_MESSAGE_TYPE = "BLOCK_PREVIEW_HEIGHT";
const HEIGHT_REQUEST_MESSAGE_TYPE = "BLOCK_PREVIEW_HEIGHT_REQUEST";

interface HeightMessage {
  blockId?: unknown;
  height?: unknown;
  type?: unknown;
}

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

  const panel1Size = PANEL1_SIZE[size] ?? PANEL1_SIZE.desktop;
  const panel2Size = 100 - panel1Size;
  const isDesktop = size === "desktop";

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
        defaultLayout={{
          "preview-panel": panel1Size,
          "spacer-panel": panel2Size,
        }}
        key={size}
        orientation="horizontal"
      >
        <ResizablePanel
          className={cn(
            "bg-background",
            "not-fumadocs-codeblock",
            "not-prose",
            type === "component"
              ? "overflow-hidden!"
              : cn(
                  "h-auto",
                  "overflow-hidden!",
                  `min-h-[${BLOCK_PREVIEW_MIN_HEIGHT_REM}rem]`
                )
          )}
          id="preview-panel"
          minSize="45%"
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
            <div className="h-full w-full overflow-hidden">{children}</div>
          )}
        </ResizablePanel>
        <ResizableHandle
          className={isDesktop ? "hidden" : undefined}
          withHandle
        />
        <ResizablePanel
          className={cn("bg-background", "border-none")}
          id="spacer-panel"
          minSize={0}
        />
      </ResizablePanelGroup>
    </div>
  );
};
