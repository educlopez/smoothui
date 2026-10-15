"use client";

import { ArtworkPattern } from "@docs/components/landing/artwork-pattern";
import { sceneSrc } from "@docs/examples/shared/demo-fixtures";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { landscapes, sceneById } from "@smoothui/data/scenes";
import Image from "next/image";
import type { ReactNode } from "react";

const STAGE_IMAGE_CLASS =
  "scale-110 object-cover blur-lg saturate-[2] motion-safe:transition-transform motion-safe:duration-300";

interface DocsStagePanelProps {
  children: ReactNode;
  className?: string;
  /** Catalog landscape id — same vivid stages as the landing. */
  scene?: string;
  title?: string;
}

function landscapeSrc(id: string) {
  const asset = sceneById(id);
  if (!(asset && landscapes.some((entry) => entry.id === id))) {
    throw new Error(`DocsStagePanel requires a catalog landscape: ${id}`);
  }
  return sceneSrc(asset.id, "w-1280");
}

/**
 * Landing-style vivid stage with an opaque content card on top —
 * for “start here” callouts and structured docs panels.
 */
export function DocsStagePanel({
  children,
  className,
  scene = "turquoise-canyon",
  title,
}: DocsStagePanelProps) {
  const src = landscapeSrc(scene);

  return (
    <div
      className={cn(
        "not-prose relative my-8 overflow-hidden rounded-2xl border",
        className
      )}
    >
      <Image
        alt=""
        aria-hidden
        className={`absolute inset-0 size-full ${STAGE_IMAGE_CLASS}`}
        draggable={false}
        fill
        sizes="(max-width: 1024px) 100vw, 720px"
        src={src}
        unoptimized
      />
      <ArtworkPattern variant="squares" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-black/15"
      />

      <div className="relative z-10 m-3 rounded-xl border border-border bg-background p-5 shadow-lg sm:m-4 sm:p-6">
        {title ? (
          <p className="m-0 mb-3 font-semibold text-foreground text-sm tracking-tight">
            {title}
          </p>
        ) : null}
        <div className="text-muted-foreground text-sm leading-relaxed [&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:m-0 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5">
          {children}
        </div>
      </div>
    </div>
  );
}
