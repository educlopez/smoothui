import {
  getBlockCatalog,
  getComponentCatalog,
} from "@docs/lib/component-catalog";

export const revalidate = false;

export async function GET() {
  const [components, blocks] = await Promise.all([
    getComponentCatalog(),
    getBlockCatalog(),
  ]);

  const payload = {
    $schema: "https://smoothui.dev/schemas/llms-components.json",
    name: "smoothui",
    version: "1.0.0",
    description:
      "SmoothUI — beautifully animated React components with Tailwind CSS and Motion",
    baseUrl: "https://smoothui.dev",
    totalComponents: components.length,
    totalBlocks: blocks.length,
    components: components.map((c) => ({
      name: c.name,
      displayName: c.displayName,
      description: c.description,
      category: c.category,
      tags: c.tags,
      complexity: c.complexity,
      animationType: c.animationType,
      useCases: c.useCases,
      compositionHints: c.compositionHints,
      hasReducedMotion: c.hasReducedMotion,
      dependencies: c.dependencies,
      registryDependencies: c.registryDependencies,
      installCommand: c.installCommand,
      docUrl: c.docUrl,
      registryUrl: c.registryUrl,
    })),
    blocks: blocks.map((b) => ({
      name: b.name,
      displayName: b.displayName,
      description: b.description,
      blockType: b.blockType,
      components: b.components,
      category: b.category,
      tags: b.tags,
      complexity: b.complexity,
      animationType: b.animationType,
      useCases: b.useCases,
      hasReducedMotion: b.hasReducedMotion,
      dependencies: b.dependencies,
      installCommand: b.installCommand,
      docUrl: b.docUrl,
      registryUrl: b.registryUrl,
    })),
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
