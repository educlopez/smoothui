"use client";

import Skeleton from "@repo/smoothui/components/skeleton-loader";
import { Button } from "@repo/shadcn-ui/components/ui/button";
import { useState } from "react";

export default function SkeletonLoaderDemo() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="flex flex-col items-center gap-6">
      <Skeleton loading={loading} className="rounded-xl">
        <div className="w-[320px] overflow-hidden rounded-xl border bg-card">
          <img
            src="https://ik.imagekit.io/16u211libb/smoothui/surf.webp?tr=w-320,h-160"
            alt="Surf"
            className="h-40 w-full object-cover"
          />
          <div className="p-4">
            <div className="flex items-center gap-3">
              <img
                src="https://ik.imagekit.io/16u211libb/avatar-educalvolpz.jpeg?tr=w-48,h-48"
                alt="Avatar"
                className="size-12 rounded-full"
              />
              <div>
                <p className="font-semibold">Edu Calvo</p>
                <p className="text-muted-foreground text-sm">@educalvolpz</p>
              </div>
            </div>
            <p className="mt-3 text-muted-foreground text-sm">
              Exploring the mountains and capturing moments. Nature photographer
              based in Colorado.
            </p>
            <div className="mt-4 flex gap-2">
              <Button size="sm" className="flex-1">
                Follow
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                Message
              </Button>
            </div>
          </div>
        </div>
      </Skeleton>

      <Button variant="outline" onClick={() => setLoading(!loading)}>
        {loading ? "Show content" : "Show skeleton"}
      </Button>
    </div>
  );
}
