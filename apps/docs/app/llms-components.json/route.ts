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
    baseUrl: "https://smoothui.dev",
    blocks: blocks.map((b) => ({
      animationType: b.animationType,
      blockType: b.blockType,
      category: b.category,
      complexity: b.complexity,
      components: b.components,
      dependencies: b.dependencies,
      description: b.description,
      displayName: b.displayName,
      docUrl: b.docUrl,
      hasReducedMotion: b.hasReducedMotion,
      installCommand: b.installCommand,
      name: b.name,
      registryUrl: b.registryUrl,
      tags: b.tags,
      useCases: b.useCases,
    })),
    components: components.map((c) => ({
      animationType: c.animationType,
      category: c.category,
      complexity: c.complexity,
      compositionHints: c.compositionHints,
      dependencies: c.dependencies,
      description: c.description,
      displayName: c.displayName,
      docUrl: c.docUrl,
      hasReducedMotion: c.hasReducedMotion,
      installCommand: c.installCommand,
      name: c.name,
      registryDependencies: c.registryDependencies,
      registryUrl: c.registryUrl,
      tags: c.tags,
      useCases: c.useCases,
    })),
    description:
      "SmoothUI — beautifully animated React components with Tailwind CSS and Motion",
    name: "smoothui",
    totalBlocks: blocks.length,
    totalComponents: components.length,
    version: "1.0.0",
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
