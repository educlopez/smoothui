"use client";

import { useEffect } from "react";

type BlockHeightSyncProps = {
  blockId: string;
};

const MESSAGE_TYPE = "BLOCK_PREVIEW_HEIGHT";
const REQUEST_MESSAGE_TYPE = "BLOCK_PREVIEW_HEIGHT_REQUEST";

export function BlockHeightSync({ blockId }: BlockHeightSyncProps) {
  useEffect(() => {
    if (typeof window === "undefined" || !window.parent) {
      return;
    }

    const target = document.body;

    if (!target) {
      return;
    }

    const postHeight = () => {
      const height = Math.max(
        target.scrollHeight,
        target.offsetHeight,
        target.clientHeight
      );

      window.parent.postMessage(
        {
          type: MESSAGE_TYPE,
          blockId,
          height,
        },
        "*"
      );
    };

    postHeight();

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            postHeight();
          })
        : null;

    resizeObserver?.observe(target);

    const handleLoad = () => {
      postHeight();
    };

    window.addEventListener("load", handleLoad);

    const handleMessage = (event: MessageEvent) => {
      if (
        !event.data ||
        typeof event.data !== "object" ||
        event.data === null
      ) {
        return;
      }

      if (
        event.data.type === REQUEST_MESSAGE_TYPE &&
        (!event.data.blockId || event.data.blockId === blockId)
      ) {
        postHeight();
      }
    };

    window.addEventListener("message", handleMessage);

    const handleMutation =
      typeof MutationObserver !== "undefined"
        ? new MutationObserver(() => {
            postHeight();
          })
        : null;

    handleMutation?.observe(target, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => {
      resizeObserver?.disconnect();
      handleMutation?.disconnect();
      window.removeEventListener("load", handleLoad);
      window.removeEventListener("message", handleMessage);
    };
  }, [blockId]);

  return null;
}


