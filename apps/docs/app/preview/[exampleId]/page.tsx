import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { ColorSync } from "@docs/components/color-sync";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

/**
 * The bare demo, on its own page.
 *
 * Blocks already had `/blocks/preview/{id}` for the iframe the viewport switcher
 * drives. This is the same idea for anything in `examples/`, reachable directly:
 * a component on a page of its own, with no docs chrome around it. Useful as the
 * "pop out" target, for screenshots, and for OG images.
 *
 * `?embed=1` drops the page background so the docs' dotted frame shows through
 * the iframe. Opened directly the page stays opaque — a transparent document in a
 * browser tab just falls back to white, which would break dark mode.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const TSX_EXTENSION_REGEX = /\.tsx$/;

const TRANSPARENT_PAGE_CSS =
  "html,body{background:transparent !important;color-scheme:normal}";

export default async function ExamplePreviewPage({
  params,
  searchParams,
}: PageProps<"/preview/[exampleId]">) {
  const { exampleId } = await params;
  const { embed } = await searchParams;
  const isEmbedded = embed === "1";

  try {
    const Example = await import(`@docs/examples/${exampleId}.tsx`).then(
      (mod) => mod.default
    );

    // Shared helpers live in `examples/` too and export nothing by default;
    // rendering `undefined` would crash the route instead of 404ing.
    if (typeof Example !== "function") {
      notFound();
    }

    return (
      <div
        className={`flex min-h-dvh w-full items-center justify-center p-4 text-foreground ${
          isEmbedded ? "bg-transparent" : "bg-background"
        }`}
      >
        {isEmbedded && (
          // biome-ignore lint/security/noDangerouslySetInnerHtml: a static, local stylesheet with no interpolation
          <style dangerouslySetInnerHTML={{ __html: TRANSPARENT_PAGE_CSS }} />
        )}
        <ColorSync />
        <Example />
      </div>
    );
  } catch {
    notFound();
  }
}

export async function generateStaticParams() {
  try {
    const files = await readdir(join(process.cwd(), "examples"));

    return files
      .filter((file) => file.endsWith(".tsx"))
      .map((file) => ({ exampleId: file.replace(TSX_EXTENSION_REGEX, "") }));
  } catch {
    return [];
  }
}
