import { cn } from "@repo/shadcn-ui/lib/utils";
import Link from "next/link";
import { SECTION_DRAWINGS, type SectionDrawingId } from "./section-drawings";

const SECTIONS: {
  id: SectionDrawingId;
  title: string;
  description: string;
  href: string;
}[] = [
  {
    description: "Motion-ready primitives you drop into any React app.",
    href: "/docs/components",
    id: "components",
    title: "Components",
  },
  {
    description: "Pre-built page sections — heroes, pricing, FAQs.",
    href: "/docs/blocks",
    id: "blocks",
    title: "Blocks",
  },
  {
    description: "Full starter pages you can ship and restyle.",
    href: "/docs/templates",
    id: "templates",
    title: "Templates",
  },
];

const cardBase =
  "group relative flex h-full flex-col rounded-2xl border bg-primary/40 p-6 transition-colors hover:bg-primary";

/**
 * Browse strip — same bento card shell as Features / AI secondary cards.
 */
export function ExploreSectionCards() {
  return (
    <div className="grid w-full @2xl:grid-cols-3 grid-cols-1 gap-4">
      {SECTIONS.map((section) => {
        const Drawing = SECTION_DRAWINGS[section.id];
        return (
          <div className={cardBase} key={section.id}>
            <div
              aria-hidden="true"
              className="relative mb-5 flex min-h-40 items-center justify-center"
            >
              <Drawing />
            </div>
            <h3 className="font-semibold text-foreground text-lg tracking-tight">
              <Link
                className="rounded after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-ring focus-visible:after:outline-offset-2"
                href={section.href}
              >
                {section.title}
              </Link>
            </h3>
            <p
              className={cn(
                "mt-1.5 text-muted-foreground text-sm leading-relaxed"
              )}
            >
              {section.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
