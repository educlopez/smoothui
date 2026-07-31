import { AddToKitButton } from "@docs/components/add-to-kit-button";
import { GalleryPreview } from "@docs/components/gallery/gallery-preview";
import Divider from "@docs/components/landing/divider";
import { InstallCopyButton } from "@docs/components/landing/install-copy-button";
import { SectionHeader } from "@docs/components/landing/section-header";
import { Button } from "@docs/components/smoothbutton";
import Link from "next/link";

type ShowcaseItem = {
  name: string;
  slug: string;
};

const SHOWCASE_COMPONENTS: ShowcaseItem[] = [
  { name: "Dynamic Island", slug: "dynamic-island" },
  { name: "Number Flow", slug: "number-flow" },
  { name: "Phototab", slug: "phototab" },
  { name: "Social Selector", slug: "social-selector" },
  { name: "User Account Avatar", slug: "user-account-avatar" },
  { name: "Scrollable Card Stack", slug: "scrollable-card-stack" },
  { name: "Power Off Slide", slug: "power-off-slide" },
  { name: "Animated Tags", slug: "animated-tags" },
  { name: "Image Metadata Preview", slug: "image-metadata-preview" },
];

export function ComponentsSlideshow() {
  return (
    <section className="relative bg-background px-8 py-24 transition">
      <Divider />
      <SectionHeader
        description="Real components from the registry — preview the motion, then install with one command."
        title="Components showcase"
      />
      {/* The same masonry the docs galleries use: each preview is as tall as its
          demo, so the hand-tuned column spans this section needed to avoid
          cropping are no longer necessary. GalleryPreview also defers each demo
          until it scrolls into view. */}
      <div className="mt-16 columns-1 gap-4 md:columns-2 lg:columns-3">
        {SHOWCASE_COMPONENTS.map(({ name, slug }) => (
          <div
            className="group relative mb-4 break-inside-avoid overflow-hidden rounded-xl border border-border bg-card"
            key={slug}
          >
            <div className="relative">
              <GalleryPreview slug={slug} title={name} />
              {/* Stretched over the preview, not wrapping it: demos contain
                  their own links, and an anchor inside an anchor will not
                  hydrate. */}
              <Link
                aria-label={`View ${name}`}
                className="absolute inset-0 z-10"
                href={`/docs/components/${slug}`}
              />
            </div>
            <footer className="flex items-center justify-between gap-2 border-border/60 border-t px-4 py-2.5">
              <Link
                className="truncate font-medium text-foreground text-sm transition-colors hover:text-brand"
                href={`/docs/components/${slug}`}
              >
                {name}
              </Link>
              <div className="flex shrink-0 items-center gap-1.5">
                <AddToKitButton size="xs" slug={slug} title={name} />
                <InstallCopyButton slug={slug} />
              </div>
            </footer>
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
