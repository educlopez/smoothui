"use client";

import { GalleryPreview } from "@docs/components/gallery/gallery-preview";
import Divider from "@docs/components/landing/divider";
import { SectionHeader } from "@docs/components/landing/section-header";
import { Button } from "@docs/components/smoothbutton";
import Link from "next/link";
import { ShowcaseDemo } from "./showcase-demo";

interface ShowcaseItem {
  name: string;
  slug: string;
}

const SHOWCASE_COMPONENTS: ShowcaseItem[] = [
  { name: "Dynamic Island", slug: "dynamic-island" },
  { name: "Number Flow", slug: "number-flow" },
  { name: "Phototab", slug: "phototab" },
  { name: "Social Selector", slug: "social-selector" },
  { name: "User Account Avatar", slug: "user-account-avatar" },
  { name: "Scrollable Card Stack", slug: "scrollable-card-stack" },
  { name: "Checkbox", slug: "checkbox" },
  { name: "Animated Tags", slug: "animated-tags" },
  { name: "Image Metadata Preview", slug: "image-metadata-preview" },
  { name: "Animated Tabs", slug: "animated-tabs" },
  { name: "Animated Toggle", slug: "animated-toggle" },
  { name: "Exposure Slider", slug: "exposure-slider" },
];

const INTERACTIVE_DEMOS = new Set([
  "dynamic-island",
  "user-account-avatar",
  "number-flow",
  "image-metadata-preview",
  "checkbox",
]);

export function ComponentsSlideshow() {
  return (
    <section className="relative bg-background px-8 py-24 transition">
      <Divider />
      <SectionHeader
        description="Real components from the registry — preview the motion, then install with one command."
        title="Components showcase"
      />
      <div className="mt-16 columns-1 gap-4 md:columns-2 lg:columns-3">
        {SHOWCASE_COMPONENTS.map(({ name, slug }) => (
          <div
            className="group relative mb-4 break-inside-avoid rounded-xl border border-border bg-card focus-within:z-20 hover:z-20"
            data-showcase={slug}
            key={slug}
          >
            <GalleryPreview interactive slug={slug} title={name}>
              {INTERACTIVE_DEMOS.has(slug) ? (
                <ShowcaseDemo slug={slug} />
              ) : null}
            </GalleryPreview>
            <Link
              aria-label={`View ${name} documentation`}
              className="absolute top-2 right-2 z-30 flex size-11 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition-opacity hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 [@media(hover:hover)_and_(pointer:fine)]:opacity-0 [@media(hover:hover)_and_(pointer:fine)]:group-focus-within:opacity-100 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100"
              href={`/docs/components/${slug}`}
            >
              <svg
                aria-hidden="true"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path d="M7 17 17 7M7 7h10v10" />
              </svg>
            </Link>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-8 flex justify-center">
        <Button asChild size="lg" variant="candy">
          <Link href="/docs/components">
            <span className="flex items-center gap-1">
              <span>View all components</span>
            </span>
            <svg
              aria-hidden="true"
              className="-mx-1.5 size-5 shrink-0 text-white/72"
              fill="none"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.333 13.333 11.667 10 8.333 6.667"
                stroke="currentColor"
                strokeLinecap="square"
                strokeWidth="1.25"
              />
            </svg>
          </Link>
        </Button>
      </div>
    </section>
  );
}
