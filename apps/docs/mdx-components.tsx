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
export const typeGenerator: ReturnType<typeof createGenerator> =
  createGenerator();

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
