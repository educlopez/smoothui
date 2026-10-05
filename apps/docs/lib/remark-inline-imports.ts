import {
  BLOCK_CATEGORY_COUNT,
  BLOCK_COUNT,
  COMPONENT_COUNT,
  PRIMITIVE_COUNT,
  TEMPLATE_COUNT,
} from "./generated/counts";

const counts: Record<string, number> = {
  BLOCK_CATEGORY_COUNT,
  BLOCK_COUNT,
  COMPONENT_COUNT,
  PRIMITIVE_COUNT,
  TEMPLATE_COUNT,
};

/**
 * The docs collection is compiled at runtime (`dynamic: true` in
 * `source.config.ts`), so an MDX file cannot `import` through the bundler's
 * aliases or pull in client components: the compiled output runs outside it.
 *
 * Two imports show up in the guides and both are resolved here instead of in
 * every file, which leaves the MDX readable as it was:
 * - `@docs/lib/generated/counts` becomes plain `const` declarations.
 * - the fumadocs accordion is dropped, the docs page passes it as a component.
 */
const COUNTS_SOURCE = "@docs/lib/generated/counts";
const PROVIDED_SOURCES = new Set(["fumadocs-ui/components/accordion"]);

interface EsmNode {
  data?: { estree?: { body: EstreeStatement[] } };
  type: string;
}

interface EstreeStatement {
  source?: { value?: unknown };
  specifiers?: { imported?: { name: string }; local: { name: string } }[];
  type: string;
}

const toConst = (local: string, value: number) => ({
  declarations: [
    {
      id: { name: local, type: "Identifier" },
      init: { raw: String(value), type: "Literal", value },
      type: "VariableDeclarator",
    },
  ],
  kind: "const",
  type: "VariableDeclaration",
});

const rewrite = (statement: EstreeStatement): EstreeStatement[] | null => {
  if (statement.type !== "ImportDeclaration") {
    return null;
  }

  const source = statement.source?.value;

  if (typeof source === "string" && PROVIDED_SOURCES.has(source)) {
    return [];
  }

  if (source !== COUNTS_SOURCE) {
    return null;
  }

  return (statement.specifiers ?? []).map(
    (specifier) =>
      toConst(
        specifier.local.name,
        counts[specifier.imported?.name ?? specifier.local.name]
      ) as unknown as EstreeStatement
  );
};

export function remarkInlineImports() {
  return (tree: { children: EsmNode[] }) => {
    tree.children = tree.children.filter((node) => {
      const estree = node.type === "mdxjsEsm" ? node.data?.estree : undefined;

      if (!estree) {
        return true;
      }

      estree.body = estree.body.flatMap(
        (statement) => rewrite(statement) ?? [statement]
      );

      return estree.body.length > 0;
    });
  };
}
