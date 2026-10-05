"use client";

import Skeleton from "@repo/smoothui/components/skeleton";

const FeaturesDemo = () => (
  <div className="flex w-full max-w-sm flex-col gap-4 p-8">
    <div className="flex items-center gap-3">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <Skeleton className="h-24 w-full rounded-lg" />
  </div>
);

const StaticDemo = () => (
  <div className="flex w-full max-w-sm flex-col gap-2 p-8">
    <Skeleton className="h-4 w-full" shimmer={false} />
    <Skeleton className="h-4 w-5/6" shimmer={false} />
    <Skeleton className="h-4 w-4/6" shimmer={false} />
  </div>
);

export const demoScenes = {
  Features: FeaturesDemo,
  Static: StaticDemo,
};

export default function SkeletonDemo() {
  return <FeaturesDemo />;
}
