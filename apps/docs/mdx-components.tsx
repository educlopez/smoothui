import { createGenerator } from "fumadocs-typescript";
import { AutoTypeTable } from "fumadocs-typescript/ui";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
// biome-ignore lint/correctness/noUnusedImports: namespace import needed for spreading
import * as FilesComponents from "fumadocs-ui/components/files";
// biome-ignore lint/correctness/noUnusedImports: namespace import needed for spreading
import * as TabsComponents from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
// biome-ignore lint/correctness/noUnusedImports: namespace import needed for spreading
import * as icons from "lucide-react";
import type { MDXComponents } from "mdx/types";
import { ChangelogEntry } from "./components/changelog-entry";

// Create the TypeScript generator for AutoTypeTable
// In production (Vercel), tsconfig.json might not be available at runtime,
// so we wrap in try-catch to gracefully fallback with a stub generator
let typeGenerator: ReturnType<typeof createGenerator>;

try {
  typeGenerator = createGenerator();
} catch {
  // If creation fails (e.g., tsconfig.json not found in Vercel),
  // create a minimal stub generator that implements the same interface
  // This allows the app to continue without TypeScript type generation features

  // Create a stub generator that matches the expected interface
  // The stub provides no-op implementations that return empty results
  typeGenerator = {
    generateDocumentation: () => [],
    generateTypeTable: async () => [],
  } as ReturnType<typeof createGenerator>;
}

export { typeGenerator };

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...(icons as unknown as MDXComponents),
    ...defaultMdxComponents,
    ...TabsComponents,
    ...FilesComponents,
    Accordion,
    Accordions,
    AutoTypeTable: (props) => (
      <AutoTypeTable {...props} generator={typeGenerator} />
    ),
    ChangelogEntry,
    // HTML `ref` attribute conflicts with `forwardRef`
    pre: ({ ref: _ref, ...props }) => (
      <CodeBlock {...props}>
        <Pre>{props.children}</Pre>
      </CodeBlock>
    ),
    ...components,
  } satisfies MDXComponents;
}

declare module "mdx/types.js" {
  // Augment the MDX types to make it understand React.
  // biome-ignore lint/style/noNamespace: JSX type augmentation requires namespace structure
  namespace JSX {
    type Element = React.JSX.Element;
    type ElementClass = React.JSX.ElementClass;
    type ElementType = React.JSX.ElementType;
    type IntrinsicElements = React.JSX.IntrinsicElements;
  }
}

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
