"use client";

import SmoothButton from "@repo/smoothui/components/smooth-button";
import Toaster, { toast } from "@repo/smoothui/components/toast";

const SAVE_DELAY_MS = 1400;

const FeaturesDemo = () => (
  <Toaster>
    <div className="flex flex-wrap items-center justify-center gap-3 p-8">
      <SmoothButton
        onClick={() =>
          toast({
            description: "Your changes are live.",
            title: "Saved",
          })
        }
        type="button"
        variant="outline"
      >
        Show toast
      </SmoothButton>
      <SmoothButton
        onClick={() =>
          toast.error("Upload failed", {
            description: "The file is larger than 10 MB.",
          })
        }
        type="button"
        variant="outline"
      >
        Error
      </SmoothButton>
      <SmoothButton
        onClick={() =>
          toast.promise(
            new Promise<void>((resolve) => setTimeout(resolve, SAVE_DELAY_MS)),
            {
              error: "Could not save",
              loading: "Saving…",
              success: "Saved",
            }
          )
        }
        type="button"
        variant="outline"
      >
        Promise
      </SmoothButton>
    </div>
  </Toaster>
);

export const demoScenes = {
  Features: FeaturesDemo,
};

export default function ToastDemo() {
  return <FeaturesDemo />;
}
