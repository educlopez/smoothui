import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import type { ComponentProps, ComponentType } from "react";
import { brandify } from "./brand-mark";

const DefaultLink = defaultMdxComponents.a as ComponentType<
  ComponentProps<"a">
>;

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const heading = (tag: HeadingTag) => {
  const Default = defaultMdxComponents[tag] as ComponentType<
    ComponentProps<HeadingTag>
  >;
  return (props: ComponentProps<HeadingTag>) => (
    <Default {...props}>{brandify(props.children)}</Default>
  );
};

/**
 * Running-text elements that give project names their mark. Spread after the
 * default components in every MDX renderer. `strong` and `em` stay intrinsic so
 * brandify can walk through them from the paragraph that holds them.
 */
export const brandMdxComponents = {
  a: (props) => (
    <DefaultLink {...props}>{brandify(props.children)}</DefaultLink>
  ),
  h1: heading("h1"),
  h2: heading("h2"),
  h3: heading("h3"),
  h4: heading("h4"),
  h5: heading("h5"),
  h6: heading("h6"),
  li: (props) => <li {...props}>{brandify(props.children)}</li>,
  p: (props) => <p {...props}>{brandify(props.children)}</p>,
  td: (props) => <td {...props}>{brandify(props.children)}</td>,
  th: (props) => <th {...props}>{brandify(props.children)}</th>,
} satisfies MDXComponents;
