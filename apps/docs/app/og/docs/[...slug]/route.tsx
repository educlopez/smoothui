import type { InferPageType } from "fumadocs-core/source";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { getPageImage, source } from "../../../../lib/source";
import { getImageResponseOptions, generate as MetadataImage } from "./generate";

export const revalidate = false;

type RouteParams = {
  params: Promise<{ slug: string[] }>;
};

export async function GET(_req: Request, { params }: RouteParams) {
  const { slug } = await params;
  const page = source.getPage(slug.slice(0, -1));

  if (!page) {
    notFound();
  }

  return new ImageResponse(
    <MetadataImage
      description={page.data.description}
      title={page.data.title}
    />,
    getImageResponseOptions()
  );
}

export function generateStaticParams(): { slug: string[] }[] {
  return source.getPages().map((page: InferPageType<typeof source>) => ({
    slug: getPageImage(page).segments,
  }));
}
