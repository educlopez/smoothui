"use client";

import SmoothButton from "@repo/smoothui/components/smooth-button";
import type { UnlockStatus } from "@repo/smoothui/components/unlock-face-id";
import UnlockFaceId from "@repo/smoothui/components/unlock-face-id";
import { useCallback, useEffect, useRef, useState } from "react";

const SCAN_DURATION = 1700;
const GLYPH_SIZE = 176;

export default function UnlockFaceIdDemo() {
  const [status, setStatus] = useState<UnlockStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => clearTimer, [clearTimer]);

  const runScan = useCallback(
    (outcome: UnlockStatus) => {
      clearTimer();
      setStatus("scanning");
      timerRef.current = setTimeout(() => {
        setStatus(outcome);
      }, SCAN_DURATION);
    },
    [clearTimer]
  );

  const handleScan = useCallback(() => {
    if (status === "error") {
      clearTimer();
      setStatus("idle");
      return;
    }
    runScan("success");
  }, [clearTimer, runScan, status]);

  const handleReplay = useCallback(() => {
    clearTimer();
    setStatus("idle");
  }, [clearTimer]);

  return (
    <div className="flex h-[26rem] w-full flex-col items-center justify-center gap-10 px-6">
      <UnlockFaceId
        errorMessage="Face not recognized. Tap to try again."
        label={
          status === "error" ? "Retry Face ID scan" : "Scan your face to unlock"
        }
        onScan={handleScan}
        size={GLYPH_SIZE}
        status={status}
      />

      <div className="flex items-center gap-2">
        <SmoothButton
          onClick={handleReplay}
          shape="pill"
          size="xs"
          variant="outline"
        >
          Replay
        </SmoothButton>
        <SmoothButton
          color="destructive"
          onClick={() => runScan("error")}
          shape="pill"
          size="xs"
          variant="soft"
        >
          Simulate failure
        </SmoothButton>
      </div>
    </div>
  );
}
