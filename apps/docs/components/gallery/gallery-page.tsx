import { getCategories, getGalleryComponents } from "@docs/lib/gallery";
import { Suspense } from "react";

import { ComponentGallery } from "./component-gallery";

/**
 * Server component wrapper that fetches gallery data and passes it
 * to the client-side ComponentGallery. Used as an MDX component.
 * Suspense boundary is required for useSearchParams in the client component.
 */
export const GalleryPage = () => {
  const components = getGalleryComponents();
  const categories = getCategories();

  return (
    <Suspense fallback={<GallerySkeleton />}>
      <ComponentGallery categories={categories} components={components} />
    </Suspense>
  );
};

const GallerySkeleton = () => (
  <div className="space-y-6">
    {/* Search skeleton */}
    <div className="h-10 animate-pulse rounded-lg bg-muted" />
    {/* Filter pills skeleton */}
    <div className="flex gap-2">
      {Array.from({ length: 6 }, (_, i) => (
        <div
          className="h-8 w-20 animate-pulse rounded-full bg-muted"
          key={`skeleton-pill-${i}`}
        />
      ))}
    </div>
    {/* Grid skeleton */}
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }, (_, i) => (
        <div
          className="h-[320px] animate-pulse rounded-lg bg-muted"
          key={`skeleton-card-${i}`}
        />
      ))}
    </div>
  </div>
);
