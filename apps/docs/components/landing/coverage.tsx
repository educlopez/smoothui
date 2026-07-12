import Divider from "@docs/components/landing/divider";

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
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-medium text-[11px] text-muted-foreground uppercase tracking-[0.18em]">
          Featured across the community
        </h2>

        <blockquote className="mt-5 text-balance font-semibold font-title text-foreground text-xl tracking-tight md:text-2xl">
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

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {COVERAGE.map((item) => (
            <a
              className="font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
              href={item.url}
              key={item.label}
              rel="noopener noreferrer"
              target="_blank"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
