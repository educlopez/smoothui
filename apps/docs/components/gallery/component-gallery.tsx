"use client";

import type { GalleryComponentMeta } from "@docs/lib/gallery";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import {
  ComponentCard,
  POSTER_CHROME,
  POSTER_PLACEHOLDER,
} from "./component-card";
import { COMPONENT_SHOTS } from "./component-shots";
import { FilterBar } from "./filter-bar";
import { MasonryGrid } from "./masonry-grid";

export interface ComponentGalleryProps {
  categories: string[];
  components: GalleryComponentMeta[];
}

const FIRST_SCREEN = 4;

export const ComponentGallery = ({
  components,
  categories,
}: ComponentGalleryProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [activeCategory, setActiveCategory] = useState<string | null>(
    searchParams.get("category") ?? null
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");

  const syncUrl = useCallback(
    (category: string | null, query: string) => {
      const params = new URLSearchParams();
      if (category) {
        params.set("category", category);
      }
      if (query) {
        params.set("q", query);
      }
      const search = params.toString();
      router.replace(search ? `${pathname}?${search}` : pathname, {
        scroll: false,
      });
    },
    [router, pathname]
  );

  const handleCategoryChange = useCallback(
    (category: string | null) => {
      setActiveCategory(category);
      syncUrl(category, searchQuery);
    },
    [syncUrl, searchQuery]
  );

  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
      syncUrl(activeCategory, query);
    },
    [syncUrl, activeCategory]
  );

  const filteredComponents = useMemo(() => {
    let result = components;

    if (activeCategory) {
      result = result.filter((c) => c.category === activeCategory);
    }

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(lowerQuery) ||
          c.description.toLowerCase().includes(lowerQuery) ||
          c.slug.toLowerCase().includes(lowerQuery) ||
          c.category.toLowerCase().includes(lowerQuery)
      );
    }

    return result;
  }, [components, activeCategory, searchQuery]);

  const tiles = useMemo(
    () =>
      filteredComponents.map((component, index) => {
        const shot = COMPONENT_SHOTS[component.slug];

        return {
          frame: {
            chrome: POSTER_CHROME,
            height: shot?.height ?? POSTER_PLACEHOLDER.height,
            width: shot?.width ?? POSTER_PLACEHOLDER.width,
          },
          key: component.slug,
          node: (
            <ComponentCard
              component={component}
              priority={index < FIRST_SCREEN}
              shot={shot}
            />
          ),
        };
      }),
    [filteredComponents]
  );

  return (
    <div className="not-prose space-y-6">
      <FilterBar
        activeCategory={activeCategory}
        categories={categories}
        onCategoryChange={handleCategoryChange}
        onSearchChange={handleSearchChange}
        searchQuery={searchQuery}
      />

      <p aria-live="polite" className="text-muted-foreground text-sm">
        {filteredComponents.length}{" "}
        {filteredComponents.length === 1 ? "component" : "components"}
        {activeCategory ? ` in ${activeCategory}` : ""}
        {searchQuery ? ` matching "${searchQuery}"` : ""}
      </p>

      {filteredComponents.length > 0 ? (
        <MasonryGrid tiles={tiles} />
      ) : (
        <EmptyState
          hasFilters={Boolean(activeCategory || searchQuery)}
          onClearFilters={() => {
            setActiveCategory(null);
            setSearchQuery("");
            syncUrl(null, "");
          }}
        />
      )}
    </div>
  );
};

interface EmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

const EmptyState = ({ hasFilters, onClearFilters }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-border border-dashed py-16 text-center">
    <p className="font-medium text-foreground text-sm">No components found</p>
    <p className="mt-1 text-muted-foreground text-xs">
      {hasFilters
        ? "Try adjusting your filters or search query."
        : "No components are available yet."}
    </p>
    {hasFilters ? (
      <SmoothButton
        className="mt-4"
        onClick={onClearFilters}
        size="sm"
        variant="outline"
      >
        Clear filters
      </SmoothButton>
    ) : null}
  </div>
);
