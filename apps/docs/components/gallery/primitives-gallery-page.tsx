import {
  getGalleryPrimitives,
  getPrimitiveCategories,
} from "@docs/lib/gallery";
import { Suspense } from "react";

import { ComponentGallery } from "./component-gallery";

/**
 * Server wrapper for the primitives index gallery.
 * Reuses the component gallery chrome; posters are keyed by slug.
 */
export const PrimitivesGalleryPage = () => {
  const primitives = getGalleryPrimitives();
  const categories = getPrimitiveCategories();

  return (
    <Suspense fallback={<GallerySkeleton />}>
      <ComponentGallery categories={categories} components={primitives} />
    </Suspense>
  );
};

const GallerySkeleton = () => (
  <div className="space-y-6">
    <div className="h-10 animate-pulse rounded-lg bg-muted" />
    <div className="flex gap-2">
      {Array.from({ length: 4 }, (_, i) => (
        <div
          className="h-8 w-20 animate-pulse rounded-full bg-muted"
          key={`skeleton-pill-${i}`}
        />
      ))}
    </div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, i) => (
        <div
          className="h-[320px] animate-pulse rounded-lg bg-muted"
          key={`skeleton-card-${i}`}
        />
      ))}
    </div>
  </div>
);
