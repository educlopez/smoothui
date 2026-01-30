import { createGenerator } from "fumadocs-typescript";
import { AutoTypeTable } from "fumadocs-typescript/ui";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
// biome-ignore lint/performance/noNamespaceImport: namespace import needed for spreading
import * as FilesComponents from "fumadocs-ui/components/files";
// biome-ignore lint/performance/noNamespaceImport: namespace import needed for spreading
import * as TabsComponents from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
// biome-ignore lint/performance/noNamespaceImport: namespace import needed for spreading
import * as icons from "lucide-react";
import type { MDXComponents } from "mdx/types";
import { ChangelogEntry } from "./components/changelog-entry";

// Create the TypeScript generator for AutoTypeTable
// In production runtime (Vercel), tsconfig.json is not available,
// so we use a stub generator to avoid runtime errors

// Stub generator that matches the expected interface
const stubGenerator = {
  generateDocumentation: () => [],
  generateTypeTable: async () => [],
} as ReturnType<typeof createGenerator>;

// In Vercel runtime, tsconfig.json is not accessible, so always use stub
// In development/build, we can try to create the real generator
// Check for Vercel environment or if we're in production runtime
const isVercelRuntime =
  process.env.VERCEL === "1" ||
  (process.env.NODE_ENV === "production" &&
    typeof process.env.VERCEL_ENV !== "undefined");

let typeGenerator: ReturnType<typeof createGenerator>;

if (isVercelRuntime) {
  // In Vercel runtime, use stub generator directly to avoid tsconfig.json errors
  typeGenerator = stubGenerator;
} else {
  // In development/build, try to create the real generator
  try {
    typeGenerator = createGenerator();
  } catch {
    // If creation fails, fallback to stub generator
    typeGenerator = stubGenerator;
  }
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
