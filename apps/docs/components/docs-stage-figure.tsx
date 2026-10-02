"use client";

import { McpDrawing } from "@docs/components/illustrations/ai-drawings";
import {
  InstallDrawing,
  MotionDrawing,
  ReactDrawing,
  TokensDrawing,
} from "@docs/components/illustrations/feature-drawings";
import { ComponentsDrawing } from "@docs/components/illustrations/section-drawings";
import { ArtworkPattern } from "@docs/components/landing/artwork-pattern";
import { sceneSrc } from "@docs/examples/shared/demo-fixtures";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { landscapes, sceneById } from "@smoothui/data/scenes";
import Image from "next/image";
import type { ReactNode } from "react";

const STAGE_IMAGE_CLASS =
  "scale-110 object-cover blur-lg saturate-[2] motion-safe:transition-transform motion-safe:duration-300";

const ILLUSTRATIONS = {
  components: ComponentsDrawing,
  install: InstallDrawing,
  mcp: McpDrawing,
  motion: MotionDrawing,
  react: ReactDrawing,
  tokens: TokensDrawing,
} as const;

export type DocsStageIllustration = keyof typeof ILLUSTRATIONS;

interface DocsStageFigureProps {
  caption: ReactNode;
  className?: string;
  /** Small ink drawing that sits on the vivid stage. */
  illustration: DocsStageIllustration;
  /** Catalog landscape id. */
  scene?: string;
  title: string;
}

function landscapeSrc(id: string) {
  const asset = sceneById(id);
  if (!(asset && landscapes.some((entry) => entry.id === id))) {
    throw new Error(`DocsStageFigure requires a catalog landscape: ${id}`);
  }
  return sceneSrc(asset.id, "w-1280");
}

/**
 * Landing-style lead figure: illustration on a vivid stage, caption below.
 * Use once per page when a visual earns its place — not as a generic callout box.
 */
export function DocsStageFigure({
  caption,
  className,
  illustration,
  scene = "turquoise-canyon",
  title,
}: DocsStageFigureProps) {
  const src = landscapeSrc(scene);
  const Drawing = ILLUSTRATIONS[illustration];

  return (
    <div
      className={cn(
        "not-prose my-8 overflow-hidden rounded-2xl border bg-primary/40",
        className
      )}
    >
      <div className="relative flex min-h-56 items-center justify-center overflow-hidden sm:min-h-64">
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
        <div className="relative z-10 flex w-full items-center justify-center p-6">
          <Drawing active />
        </div>
      </div>
      <div className="border-t bg-background p-5 sm:p-6">
        <p className="m-0 font-semibold text-foreground text-sm tracking-tight">
          {title}
        </p>
        <div className="mt-1.5 text-muted-foreground text-sm leading-relaxed [&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_p]:m-0">
          {caption}
        </div>
      </div>
    </div>
  );
}
