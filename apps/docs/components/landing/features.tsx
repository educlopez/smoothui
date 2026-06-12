import Divider from "@docs/components/landing/divider";
import { ReactLogo } from "@docs/components/landing/logos/react-logo";
import { ShadcnLogo } from "@docs/components/landing/logos/shadcn-logo";
import { TailwindLogo } from "@docs/components/landing/logos/tailwind-logo";
import { SectionHeader } from "@docs/components/landing/section-header";
import { cn } from "@repo/shadcn-ui/lib/utils";
import GridLoader from "@repo/smoothui/components/grid-loader";

type Feature = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const lead = {
  title: "Smooth animations",
  description:
    "Every component ships with motion built in — powered by Motion and GSAP, tuned for spring physics, and fully reduced-motion aware.",
};

const supporting: Feature[] = [
  {
    title: "Modern React",
    description:
      "Server Components, TypeScript and hooks throughout — built for React 19.",
    icon: ReactLogo,
  },
  {
    title: "Tailwind CSS v4",
    description: "The latest utility-first engine, with a unified token spine.",
    icon: TailwindLogo,
  },
  {
    title: "shadcn compatible",
    description: "Drops into any shadcn project — same patterns, one command.",
    icon: ShadcnLogo,
  },
];

const cardBase =
  "group relative flex flex-col rounded-2xl border bg-primary/40 p-6 transition-colors hover:bg-primary";

const iconBadge =
  "flex size-9 items-center justify-center rounded-full border border-brand/40 bg-background text-brand";

export function Features() {
  return (
    <section className="relative bg-background px-8 py-24 transition">
      <Divider />
      <SectionHeader
        description="Built on the foundations you already love, with the polish you've been wishing for."
        eyebrow="Why SmoothUI"
        title={
          <>
            Why choose Smooth<span className="text-brand">UI</span>?
          </>
        }
      />
      <div className="mt-16 grid w-full gap-4 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
        {/* Lead cell — large, showing a real SmoothUI component in motion */}
        <div
          className={cn(
            cardBase,
            "overflow-hidden p-0 md:col-span-2 lg:col-span-2 lg:row-span-2"
          )}
        >
          <div className="frame-box relative flex flex-1 items-center justify-center rounded-t-2xl border-0 px-6 py-12">
            <div className="pointer-events-none absolute top-1/2 left-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/15 blur-3xl" />
            <GridLoader
              color="var(--color-foreground)"
              mode="sequence"
              sequence={["breathing", "diamond", "cross", "sparkle", "corners"]}
              size={132}
              speed="normal"
            />
          </div>
          <div className="p-6">
            <h3 className="mb-2 font-semibold text-foreground text-xl tracking-tight">
              {lead.title}
            </h3>
            <p className="max-w-md text-muted-foreground">{lead.description}</p>
          </div>
        </div>

        {/* Supporting cells — varied placement around the lead */}
        {supporting.map((feature, index) => (
          <div
            className={cn(cardBase, index === 0 && "lg:col-span-2")}
            key={feature.title}
          >
            <div className={cn(iconBadge, "mb-4")}>
              <feature.icon className="size-4" />
            </div>
            <h3 className="mb-1.5 font-semibold text-foreground text-lg tracking-tight">
              {feature.title}
            </h3>
            <p className="text-muted-foreground text-sm">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
