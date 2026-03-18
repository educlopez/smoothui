import {
  getBlockCatalog,
  getComponentCatalog,
} from "@docs/lib/component-catalog";

export const revalidate = false;

const formatComponentEntry = (c: {
  name: string;
  description: string;
  category: string;
  tags: readonly string[];
  complexity: string;
  installCommand: string;
}): string =>
  `- ${c.name}: ${c.description} [${c.category}] (${c.complexity}) — install: ${c.installCommand}`;

export async function GET() {
  const [components, blocks] = await Promise.all([
    getComponentCatalog(),
    getBlockCatalog(),
  ]);

  const parts = [
    "# SmoothUI",
    "",
    "> A collection of beautifully designed React components with smooth animations built with React, Tailwind CSS, and Motion.",
    "",
    "- Docs: https://smoothui.dev/docs",
    "- GitHub: https://github.com/educlopez/smoothui",
    "- Full docs for LLMs: https://smoothui.dev/llms-full.txt",
    "- Component JSON: https://smoothui.dev/llms-components.json",
    "",
    `## Components (${components.length})`,
    "",
    ...components.map(formatComponentEntry),
    "",
    `## Blocks (${blocks.length})`,
    "",
    ...blocks.map(formatComponentEntry),
  ].join("\n");

  return new Response(parts, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
