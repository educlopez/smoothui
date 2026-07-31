"use client";

import { Button } from "@repo/shadcn-ui/components/ui/button";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { SquareArrowOutUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { TEMPLATE_SHOTS } from "./template-shots";

export type TemplateShowcaseProps = {
  /** Registry name; also the id of the isolated preview route. */
  installer: string;
};

/**
 * The top of a template page: try it, then take it.
 *
 * A template is a whole surface rather than a part, so what sells it is seeing
 * it running and seeing what it looks like — not its source. Reading a chat app's
 * source to decide whether you want it is the wrong order.
 */
export const TemplateShowcase = ({ installer }: TemplateShowcaseProps) => {
  const shots = TEMPLATE_SHOTS[installer] ?? [];

  return (
    <div className="not-prose">
      {/* Live preview only: the row above already carries Add to bundle, and
          two of the same button a centimetre apart is a coin toss, not a
          choice. */}
      <Button asChild size="sm">
        <Link href={`/blocks/preview/${installer}`} target="_blank">
          Live preview
          <SquareArrowOutUpRight aria-hidden="true" size={14} />
        </Link>
      </Button>

      {shots.length > 0 && (
        <div className="mt-8 flex flex-col gap-4">
          {shots.map((shot) => (
            <figure
              className={cn(
                "overflow-hidden rounded-xl border bg-card",
                // A phone shot at full bleed would be a tower; it sits at the
                // width it was taken at instead.
                shot.narrow && "mx-auto w-full max-w-sm"
              )}
              key={shot.alt}
            >
              <Image
                alt={shot.alt}
                className="w-full"
                placeholder="blur"
                sizes={
                  shot.narrow
                    ? "(min-width: 640px) 24rem, 100vw"
                    : "(min-width: 1024px) 60rem, 100vw"
                }
                src={shot.image}
              />
            </figure>
          ))}
        </div>
      )}
    </div>
  );
};
