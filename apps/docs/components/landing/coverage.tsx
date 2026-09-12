import Divider from "@docs/components/landing/divider";
import { CoverageCarousel } from "./coverage-carousel";

const MARKS: Record<string, { src: string; wide?: boolean; invert?: boolean }> =
  {
    "All Shadcn": { src: "/community-marks/all-shadcn.png" },
    "Built At Lightspeed": {
      invert: false,
      src: "/community-marks/builtatlightspeed.png",
    },
    "DEV.to": { src: "/community-marks/dev.png" },
    Peerlist: { src: "/community-marks/peerlist.png", wide: true },
    "Shadcn Templates": {
      src: "/community-marks/shadcn-templates.svg",
      wide: true,
    },
    Tailkits: { src: "/community-marks/tailkits.svg", wide: true },
    "Tailwind Resources": {
      src: "/community-marks/tailwind-resources.svg",
      wide: true,
    },
  };

// Real, verified external mentions — coverage + directory listings. Not testimonials
// (those stay X-only) and not "featured in" listicles we aren't actually in.
const COVERAGE: { label: string; url: string }[] = [
  {
    label: "Peerlist",
    url: "https://peerlist.io/saxenashikhil/articles/smoothui-a-beautiful-motiondriven-ui-library-for-react-devel",
  },
  {
    label: "DEV.to",
    url: "https://dev.to/jqueryscript/smoothui-40-animated-react-components-with-motion-8e5",
  },
  { label: "Tailkits", url: "https://tailkits.com/components/smoothui/" },
  { label: "All Shadcn", url: "https://allshadcn.com/blocks/smoothui/" },
  {
    label: "Tailwind Resources",
    url: "https://www.tailwindresources.com/theme/educlopez-smoothui/",
  },
  {
    label: "Shadcn Templates",
    url: "https://shadcntemplates.com/theme/educlopez-smoothui",
  },
  {
    label: "Built At Lightspeed",
    url: "https://www.builtatlightspeed.com/theme/educlopez-smoothui",
  },
];

export function Coverage() {
  return (
    <section className="relative bg-background px-8 py-20 transition">
      <Divider />
      <div className="mx-auto w-full max-w-7xl text-center">
        <h2 className="font-medium text-[11px] text-muted-foreground uppercase tracking-[0.18em]">
          Featured across the community
        </h2>

        <blockquote className="mx-auto mt-5 max-w-3xl text-balance font-semibold font-title text-foreground text-xl tracking-tight md:text-2xl">
          &ldquo;SmoothUI is a game-changer for frontend developers looking for
          polished UI components with motion-powered interactivity.&rdquo;
        </blockquote>

        <a
          className="mt-3 inline-block text-muted-foreground text-sm transition-colors hover:text-brand"
          href={COVERAGE[0].url}
          rel="noopener noreferrer"
          target="_blank"
        >
          — Shikhil Saxena, Peerlist
        </a>

        <CoverageCarousel
          items={COVERAGE.map((item) => ({ ...item, ...MARKS[item.label] }))}
        />
      </div>
    </section>
  );
}
