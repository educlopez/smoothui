import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    blockId: string;
  }>;
};

export default async function BlockPreviewPage({ params }: PageProps) {
  const { blockId } = await params;

  try {
    const BlockExample = await import(
      `../../../../examples/${blockId}.tsx`
    ).then((mod) => mod.default);

    return (
      <div className="flex min-h-screen w-full flex-col bg-background p-0 text-foreground">
        <BlockExample />
      </div>
    );
  } catch (error) {
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
        blockId: file.replace(/\.tsx$/, ""),
      }));
  } catch {
    return [];
  }
}

