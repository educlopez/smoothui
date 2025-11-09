import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { ColorSync } from "@docs/components/color-sync";
import { BlockHeightSync } from "@docs/components/preview/block-height-sync";
import { notFound } from "next/navigation";

const TSX_EXTENSION_REGEX = /\.tsx$/;

type PageProps = {
  params: Promise<{
    blockId: string;
  }>;
};

export default async function BlockPreviewPage({ params }: PageProps) {
  const { blockId } = await params;

  try {
    const BlockExample = await import(`@docs/examples/${blockId}.tsx`).then(
      (mod) => mod.default
    );

    return (
      <div className="flex min-h-screen w-full flex-col bg-background p-0 text-foreground">
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
