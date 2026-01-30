"use client";

import { Button } from "@repo/shadcn-ui/components/ui/button";
import Skeleton from "@repo/smoothui/components/skeleton-loader";
import Image from "next/image";
import { useState } from "react";

export default function SkeletonLoaderDemo() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="flex flex-col items-center gap-6">
      <Skeleton className="rounded-xl" loading={loading}>
        <div className="w-[320px] overflow-hidden rounded-xl border bg-card">
          <Image
            alt="Surf"
            className="h-40 w-full object-cover"
            height={160}
            src="https://ik.imagekit.io/16u211libb/smoothui/surf.webp?tr=w-320,h-160"
            width={320}
          />
          <div className="p-4">
            <div className="flex items-center gap-3">
              <Image
                alt="Avatar"
                className="size-12 rounded-full"
                height={48}
                src="https://ik.imagekit.io/16u211libb/avatar-educalvolpz.jpeg?tr=w-48,h-48"
                width={48}
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
              <Button className="flex-1" size="sm">
                Follow
              </Button>
              <Button className="flex-1" size="sm" variant="outline">
                Message
              </Button>
            </div>
          </div>
        </div>
      </Skeleton>

      <Button onClick={() => setLoading(!loading)} variant="outline">
        {loading ? "Show content" : "Show skeleton"}
      </Button>
    </div>
  );
}
