import {
  getBlockCatalog,
  getComponentCatalog,
} from "@docs/lib/component-catalog";
import { getLLMText, source } from "@docs/lib/source";

// cached forever
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
  const [scanned, components, blocks] = await Promise.all([
    Promise.all(source.getPages().map(getLLMText)),
    getComponentCatalog(),
    getBlockCatalog(),
  ]);

  const catalogSection = [
    "# SmoothUI Component Catalog",
    "",
    `> For structured JSON data, see: https://smoothui.dev/llms-components.json`,
    "",
    `## Components (${components.length})`,
    "",
    ...components.map(formatComponentEntry),
    "",
    `## Blocks (${blocks.length})`,
    "",
    ...blocks.map(formatComponentEntry),
  ].join("\n");

  const parts = [catalogSection, "", "---", "", ...scanned];

  return new Response(parts.join("\n\n"));
}
