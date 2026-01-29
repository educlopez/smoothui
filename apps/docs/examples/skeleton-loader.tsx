"use client";

import SkeletonLoader, {
  SkeletonAvatar,
  SkeletonCard,
  SkeletonText,
} from "@repo/smoothui/components/skeleton-loader";

export default function SkeletonLoaderDemo() {
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="space-y-4">
        <h3 className="font-medium text-foreground text-sm">
          Animation Variants
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <p className="text-muted-foreground text-xs">Shimmer</p>
            <SkeletonLoader
              borderRadius={8}
              className="w-full"
              height={80}
              variant="shimmer"
            />
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground text-xs">Pulse</p>
            <SkeletonLoader
              borderRadius={8}
              className="w-full"
              height={80}
              variant="pulse"
            />
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground text-xs">Wave</p>
            <SkeletonLoader
              borderRadius={8}
              className="w-full"
              height={80}
              variant="wave"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-foreground text-sm">SkeletonText</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <p className="text-muted-foreground text-xs">3 lines (default)</p>
            <SkeletonText />
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground text-xs">
              5 lines, custom last line
            </p>
            <SkeletonText lastLineWidth="40%" lines={5} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-foreground text-sm">SkeletonAvatar</h3>
        <div className="flex items-center gap-4">
          <div className="space-y-2 text-center">
            <SkeletonAvatar size="sm" />
            <p className="text-muted-foreground text-xs">Small</p>
          </div>
          <div className="space-y-2 text-center">
            <SkeletonAvatar size="md" />
            <p className="text-muted-foreground text-xs">Medium</p>
          </div>
          <div className="space-y-2 text-center">
            <SkeletonAvatar size="lg" />
            <p className="text-muted-foreground text-xs">Large</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-foreground text-sm">SkeletonCard</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <p className="text-muted-foreground text-xs">Full card</p>
            <SkeletonCard />
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground text-xs">
              No image, pulse variant
            </p>
            <SkeletonCard showImage={false} variant="pulse" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-foreground text-sm">
          Custom Composition
        </h3>
        <div className="flex items-center gap-4 rounded-lg border p-4">
          <SkeletonAvatar size="lg" variant="wave" />
          <div className="flex-1">
            <SkeletonText lastLineWidth="50%" lines={2} variant="wave" />
          </div>
        </div>
      </div>
    </div>
  );
}
