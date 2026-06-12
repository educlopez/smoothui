import Divider from "@docs/components/landing/divider";
import { ReactLogo } from "@docs/components/landing/logos/react-logo";
import { ShadcnLogo } from "@docs/components/landing/logos/shadcn-logo";
import { TailwindLogo } from "@docs/components/landing/logos/tailwind-logo";
import { SectionHeader } from "@docs/components/landing/section-header";
import { cn } from "@repo/shadcn-ui/lib/utils";
import InfiniteSlider from "@repo/smoothui/components/infinite-slider";
import Image from "next/image";

const lead = {
  title: "Smooth animations",
  description:
    "Every component ships with motion built in — powered by Motion and GSAP, tuned for spring physics, and fully reduced-motion aware.",
};

const cardBase =
  "group relative flex flex-col rounded-2xl border bg-primary/40 p-6 transition-colors hover:bg-primary";

const SHOWCASE_ROW_A = [
  "Siri Orb",
  "Dynamic Island",
  "Number Flow",
  "Apple Invites",
  "Scramble Hover",
];

const SHOWCASE_ROW_B = [
  "Wave Text",
  "Grid Loader",
  "Social Selector",
  "Image Metadata",
  "Power Off Slide",
];

const TOKEN_CHIPS = [
  "bg-brand",
  "rounded-2xl",
  "--radius",
  "oklch()",
  "text-balance",
  "@theme",
];

const REACT_SNIPPET = `export function Orb() {
  const ref = useRef(null)
  return <SiriOrb ref={ref} />
}`;

const Pill = ({ children }: { children: string }) => (
  <span className="flex shrink-0 items-center whitespace-nowrap rounded-full border border-border bg-background px-3 py-1.5 text-foreground/70 text-sm">
    {children}
  </span>
);

const CardHeading = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) => (
  <>
    <div className="flex items-center gap-2">
      <Icon className="size-4" />
      <h3 className="font-semibold text-foreground text-lg tracking-tight">
        {title}
      </h3>
    </div>
    <p className="mt-1.5 text-muted-foreground text-sm">{description}</p>
  </>
);

const WindowChrome = ({ label }: { label: string }) => (
  <div className="flex items-center gap-1.5 border-border border-b px-3 py-2">
    <span className="size-2 rounded-full bg-smooth-400" />
    <span className="size-2 rounded-full bg-smooth-400" />
    <span className="size-2 rounded-full bg-smooth-400" />
    <span className="ml-1.5 font-mono text-[10px] text-muted-foreground">
      {label}
    </span>
  </div>
);

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
        {/* Lead — live component marquee over a saturated blurred photo */}
        <div
          className={cn(
            cardBase,
            "relative overflow-hidden border-0 p-0 text-white md:col-span-2 lg:col-span-2 lg:row-span-2"
          )}
        >
          <Image
            alt=""
            aria-hidden
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, 420px"
            src="/scenes/why-choose.jpg"
            unoptimized
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/20" />
          <div className="relative flex flex-1 flex-col justify-center gap-3 py-12 [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
            <InfiniteSlider gap={12} speed={32}>
              {SHOWCASE_ROW_A.map((name) => (
                <Pill key={name}>{name}</Pill>
              ))}
            </InfiniteSlider>
            <InfiniteSlider gap={12} reverse speed={32}>
              {SHOWCASE_ROW_B.map((name) => (
                <Pill key={name}>{name}</Pill>
              ))}
            </InfiniteSlider>
          </div>
          <div className="relative p-6">
            <h3 className="mb-2 font-semibold text-xl tracking-tight drop-shadow-sm">
              {lead.title}
            </h3>
            <p className="max-w-md text-sm text-white/80">{lead.description}</p>
          </div>
        </div>

        {/* Modern React — a real code snippet */}
        <div className={cn(cardBase, "lg:col-span-2")}>
          <div className="mb-4 overflow-hidden rounded-lg border border-border bg-background">
            <WindowChrome label="orb.tsx" />
            <pre className="overflow-x-auto p-3 font-mono text-[11px] text-foreground/80 leading-relaxed">
              <code>{REACT_SNIPPET}</code>
            </pre>
          </div>
          <CardHeading
            description="Server Components, TypeScript and hooks throughout — built for React 19."
            icon={ReactLogo}
            title="Modern React"
          />
        </div>

        {/* Tailwind v4 — real token / utility chips */}
        <div className={cardBase}>
          <div className="mb-4 overflow-hidden rounded-lg border border-border bg-background">
            <WindowChrome label="globals.css" />
            <div className="flex flex-wrap gap-1.5 p-3">
              {TOKEN_CHIPS.map((token) => (
                <span
                  className="rounded-md border border-border bg-muted px-2 py-1 font-mono text-[10px] text-muted-foreground"
                  key={token}
                >
                  {token}
                </span>
              ))}
            </div>
          </div>
          <CardHeading
            description="The latest utility-first engine, with a unified token spine."
            icon={TailwindLogo}
            title="Tailwind CSS v4"
          />
        </div>

        {/* shadcn — the real install command */}
        <div className={cardBase}>
          <div className="mb-4 overflow-hidden rounded-lg border border-border bg-background">
            <WindowChrome label="Terminal" />
            <div className="overflow-x-auto p-3 font-mono text-[11px] leading-relaxed">
              <span className="select-none text-muted-foreground">$ </span>
              <span className="text-foreground/80">npx shadcn add </span>
              <span className="text-brand">@smoothui/siri-orb</span>
            </div>
          </div>
          <CardHeading
            description="Drops into any shadcn project — same patterns, one command."
            icon={ShadcnLogo}
            title="shadcn compatible"
          />
        </div>
      </div>
    </section>
  );
}
