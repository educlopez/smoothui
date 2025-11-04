import { createGenerator } from "fumadocs-typescript";
import { AutoTypeTable } from "fumadocs-typescript/ui";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import * as FilesComponents from "fumadocs-ui/components/files";
import * as TabsComponents from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import * as icons from "lucide-react";
import type { MDXComponents } from "mdx/types";

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
