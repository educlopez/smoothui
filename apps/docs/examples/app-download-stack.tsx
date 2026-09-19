"use client";

import AppDownloadStack, {
  type AppData,
} from "@repo/smoothui/components/app-download-stack";
import { appIconById } from "@smoothui/data/app-icons";
import { useEffect, useState } from "react";

// TODO: this demo was marked as not working before the icons were swapped. The
// icons render and nothing throws, but the download interaction is unverified.

// A creative-work starter set, so the stack reads as a considered bundle rather
// than four unrelated apps.
const demoApps: AppData[] = [
  "final-cut-pro-create-video",
  "logic-pro-make-music",
  "pixelmator-pro-edit-images",
  "motion-animate-effects",
  "compressor-encode-media",
]
  .map((id, index) => {
    const app = appIconById(id);
    return app
      ? { icon: `${app.src}?tr=w-128`, id: index + 1, name: app.name }
      : null;
  })
  .filter((app): app is AppData => app !== null);

const AppDownloadStackDemo = () => {
  const [selected, setSelected] = useState<number[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <>
      {notification ? (
        <div className="absolute top-4 right-4 z-50 rounded-lg border bg-background px-4 py-2 text-sm shadow-lg">
          {notification}
        </div>
      ) : null}
      <AppDownloadStack
        apps={demoApps}
        isExpanded={expanded}
        onChange={setSelected}
        onDownload={(selectedApps) =>
          setNotification(`Download apps: ${selectedApps.join(", ")}`)
        }
        onExpandChange={setExpanded}
        selectedApps={selected}
        title="Starter Mac"
      />
    </>
  );
};

export default AppDownloadStackDemo;
