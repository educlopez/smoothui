import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { ColorSync } from "@docs/components/color-sync";
import { BlockHeightSync } from "@docs/components/preview/block-height-sync";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const TSX_EXTENSION_REGEX = /\.tsx$/;

interface PageProps {
  params: Promise<{
    blockId: string;
  }>;
}

export default async function BlockPreviewPage({ params }: PageProps) {
  const { blockId } = await params;

  try {
    const BlockExample = await import(`@docs/examples/${blockId}.tsx`).then(
      (mod) => mod.default
    );

    if (typeof BlockExample !== "function") {
      notFound();
    }

    return (
      <div className="flex min-h-screen w-full flex-col bg-background p-0 text-foreground">
        {/* The dev overlay is a fixed element in the corner of this page, so it
            lands inside any screenshot taken of a block — including the cover art
            on the blocks index. It does not exist in production, so hiding it
            costs nothing there. */}
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static rule, no user input */}
        <style
          dangerouslySetInnerHTML={{ __html: "nextjs-portal{display:none}" }}
        />
        <ColorSync />
        <BlockHeightSync blockId={blockId} />
        <BlockExample />
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
