import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { ColorSync } from "@docs/components/color-sync";
import { BlockHeightSync } from "@docs/components/preview/block-height-sync";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
};

const TSX_EXTENSION_REGEX = /\.tsx$/;

interface PageProps {
  params: Promise<{
    blockId: string;
  }>;
  searchParams: Promise<{
    poster?: string;
  }>;
}

const TRANSPARENT_PAGE_CSS =
  "html,body{background:transparent !important;color-scheme:normal}";

export default async function BlockPreviewPage({
  params,
  searchParams,
}: PageProps) {
  const { blockId } = await params;
  const { poster } = await searchParams;
  const isPoster = poster === "1";

  try {
    const BlockExample = await import(`@docs/examples/${blockId}.tsx`).then(
      (mod) => mod.default
    );

    if (typeof BlockExample !== "function") {
      notFound();
    }

    return (
      <div
        className={`flex min-h-screen w-full flex-col p-0 text-foreground ${
          isPoster ? "bg-transparent" : "bg-background"
        }`}
      >
        {/* The dev overlay is a fixed element in the corner of this page, so it
            lands inside any screenshot taken of a block — including the cover art
            on the blocks index. It does not exist in production, so hiding it
            costs nothing there. */}
        {/* A text child rather than `dangerouslySetInnerHTML`: React accepts one
            for `<style>`, and there is nothing to sanitise in a constant. */}
        <style>
          {isPoster
            ? `nextjs-portal{display:none}${TRANSPARENT_PAGE_CSS}`
            : "nextjs-portal{display:none}"}
        </style>
        <ColorSync />
        <BlockHeightSync blockId={blockId} />
        {/* Poster capture measures this node. A plain wrapper, so the live
            preview iframe is unchanged. */}
        <div className="w-full" id="poster-root">
          <BlockExample />
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}

export async function generateStaticParams() {
  try {
    const examplesDir = join(process.cwd(), "examples");
    const files = await readdir(examplesDir);

    return files
      .filter((file) => file.endsWith(".tsx"))
      .map((file) => ({
        blockId: file.replace(TSX_EXTENSION_REGEX, ""),
      }));
  } catch {
    return [];
  }
}
