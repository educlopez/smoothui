import { nucleoIconsPlugin } from "@docs/lib/nucleo-icons-plugin";
import { type InferPageType, loader } from "fumadocs-core/source";
import { docs } from "@/.source/dynamic";

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: "/docs",
  plugins: [nucleoIconsPlugin()],
  source: docs.toFumadocsSource(),
});

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, "image.png"];

  return {
    segments,
    url: `/og/docs/${segments.join("/")}`,
  };
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText("processed");

  return `# ${page.data.title} (${page.url})

${processed}`;
}

export function getBlogPageImage(slug: string) {
  return {
    url: `/og/blog/${slug}/image.png`,
  };
}
