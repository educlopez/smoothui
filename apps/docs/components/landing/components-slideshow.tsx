import Divider from "@docs/components/landing/divider";
import { InstallCopyButton } from "@docs/components/landing/install-copy-button";
import { SectionHeader } from "@docs/components/landing/section-header";
import { Button } from "@docs/components/smoothbutton";
import { cn } from "@repo/shadcn-ui/lib/utils";
import dynamic from "next/dynamic";
import Link from "next/link";
import { createElement } from "react";

// Lazy-load example components to reduce initial bundle size
const AnimatedTags = dynamic(() => import("@docs/examples/animated-tags"));
const DynamicIsland = dynamic(() => import("@docs/examples/dynamic-island"));
const ImageMetadataPreview = dynamic(
  () => import("@docs/examples/image-metadata-preview")
);
const NumberFlow = dynamic(() => import("@docs/examples/number-flow"));
const Phototab = dynamic(() => import("@docs/examples/phototab"));
const PowerOffSlide = dynamic(() => import("@docs/examples/power-off-slide"));
const ScrollableCardStack = dynamic(
  () => import("@docs/examples/scrollable-card-stack")
);
const SocialSelector = dynamic(() => import("@docs/examples/social-selector"));
const UserAccountAvatar = dynamic(
  () => import("@docs/examples/user-account-avatar")
);

type ShowcaseItem = {
  component: React.ComponentType;
  name: string;
  slug: string;
  /** Extra grid span classes for the bento layout. */
  span?: string;
};

// Rows are arranged so each md row sums to 3 columns.
const SHOWCASE_COMPONENTS: ShowcaseItem[] = [
  {
    name: "Dynamic Island",
    slug: "dynamic-island",
    component: DynamicIsland,
    span: "md:col-span-2",
  },
  { name: "Number Flow", slug: "number-flow", component: NumberFlow },
  { name: "Phototab", slug: "phototab", component: Phototab },
  {
    name: "Social Selector",
    slug: "social-selector",
    component: SocialSelector,
  },
  {
    name: "User Account Avatar",
    slug: "user-account-avatar",
    component: UserAccountAvatar,
  },
  {
    name: "Scrollable Card Stack",
    slug: "scrollable-card-stack",
    component: ScrollableCardStack,
    span: "md:col-span-2",
  },
  {
    name: "Power Off Slide",
    slug: "power-off-slide",
    component: PowerOffSlide,
  },
  { name: "Animated Tags", slug: "animated-tags", component: AnimatedTags },
  {
    name: "Image Metadata Preview",
    slug: "image-metadata-preview",
    component: ImageMetadataPreview,
    span: "md:col-span-2",
  },
];

export function ComponentsSlideshow() {
  return (
    <section className="relative bg-background px-8 py-24 transition">
      <Divider />
      <SectionHeader
        description="Real components from the registry — preview the motion, then install with one command."
        title="Components showcase"
      />
      <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3">
        {SHOWCASE_COMPONENTS.map(({ name, slug, component, span }) => (
          <div
            className={cn(
              "group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card",
              span
            )}
            key={slug}
          >
            <div className="frame-box flex h-[280px] items-center justify-center overflow-hidden p-6">
              <div className="relative z-10 flex h-full w-full items-center justify-center">
                {createElement(component)}
              </div>
            </div>
            <footer className="flex items-center justify-between gap-2 border-border/60 border-t px-4 py-2.5">
              <Link
                className="truncate font-medium text-foreground text-sm transition-colors hover:text-brand"
                href={`/docs/components/${slug}`}
              >
                {name}
              </Link>
              <InstallCopyButton slug={slug} />
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
