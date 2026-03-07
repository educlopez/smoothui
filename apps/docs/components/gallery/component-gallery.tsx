"use client";

import type { GalleryComponentMeta } from "@docs/lib/gallery";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import { ComponentCard } from "./component-card";
import { FilterBar } from "./filter-bar";

export type ComponentGalleryProps = {
  components: GalleryComponentMeta[];
  categories: string[];
};

export const ComponentGallery = ({
  components,
  categories,
}: ComponentGalleryProps) => {
  const shouldReduceMotion = useReducedMotion();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [activeCategory, setActiveCategory] = useState<string | null>(
    searchParams.get("category") ?? null
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("q") ?? ""
  );

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

  return (
    <div className="not-prose space-y-6">
      <FilterBar
        activeCategory={activeCategory}
        categories={categories}
        onCategoryChange={handleCategoryChange}
        onSearchChange={handleSearchChange}
        searchQuery={searchQuery}
      />

      {/* Results count */}
      <p className="text-muted-foreground text-sm" aria-live="polite">
        {filteredComponents.length}{" "}
        {filteredComponents.length === 1 ? "component" : "components"}
        {activeCategory ? ` in ${activeCategory}` : ""}
        {searchQuery ? ` matching "${searchQuery}"` : ""}
      </p>

      {/* Grid */}
      {filteredComponents.length > 0 ? (
        <div
          className={cn(
            "grid gap-4",
            "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          )}
          role="list"
        >
          <AnimatePresence mode="popLayout">
            {filteredComponents.map((component) => (
              <motion.div
                key={component.slug}
                layout={!shouldReduceMotion}
                exit={
                  shouldReduceMotion
                    ? { opacity: 0, transition: { duration: 0 } }
                    : {
                        opacity: 0,
                        scale: 0.95,
                        transition: { duration: 0.15 },
                      }
                }
                role="listitem"
              >
                <ComponentCard component={component} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
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

type EmptyStateProps = {
  hasFilters: boolean;
  onClearFilters: () => void;
};

const EmptyState = ({ hasFilters, onClearFilters }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
    <p className="font-medium text-foreground text-sm">No components found</p>
    <p className="mt-1 text-muted-foreground text-xs">
      {hasFilters
        ? "Try adjusting your filters or search query."
        : "No components are available yet."}
    </p>
    {hasFilters && (
      <button
        className="mt-4 rounded-md border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted"
        onClick={onClearFilters}
        type="button"
      >
        Clear filters
      </button>
    )}
  </div>
);
