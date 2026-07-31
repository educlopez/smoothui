import {
  rehypeCodeDefaultOptions,
  remarkSteps,
} from "fumadocs-core/mdx-plugins";
import { remarkTypeScriptToJavaScript } from "fumadocs-docgen/remark-ts2js";
import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from "fumadocs-mdx/config";
import jsonSchema from "fumadocs-mdx/plugins/json-schema";
import lastModified from "fumadocs-mdx/plugins/last-modified";
import { transformerTwoslash } from "fumadocs-twoslash";
import { createFileSystemTypesCache } from "fumadocs-twoslash/cache-fs";
import { remarkAutoTypeTable } from "fumadocs-typescript";
import type { ElementContent } from "hast";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { z } from "zod";
import { substituteCounts } from "./lib/count-tokens";
import { smoothuiDark, smoothuiLight } from "./lib/themes";

export const docs = defineDocs({
  docs: {
    postprocess: {
      includeProcessedMarkdown: true,
    },
    schema: frontmatterSchema.extend({
      contributor: z
        .object({
          avatar: z.string().optional(),
          name: z.string(),
          url: z.string().optional(),
        })
        .optional(),
      dependencies: z.array(z.string()).optional(),
      /**
       * `{{components}}`, `{{blocks}}`, `{{blockCategories}}` and
       * `{{templates}}` resolve to the generated counts. Frontmatter is parsed
       * before any JS runs, so a description cannot import the constant the way
       * the body can — and this is the text search engines show.
       */
      description: z.string().transform(substituteCounts).optional(),
      installer: z.string().optional(),
      new: z.coerce.date().optional(),
      references: z.array(z.string()).optional(),
      /**
       * Opt into the split layout: MDX scrolls on the left, the live preview
       * sticks on the right. Temporary — it exists so the layout can be judged on
       * one page before it becomes the default for every component and block.
       */
      splitPreview: z.boolean().optional(),
    }),
  },
  meta: {
    schema: metaSchema.extend({
      description: z.string().optional(),
    }),
  },
});

export const blog = defineDocs({
  dir: "content/blog",
  docs: {
    postprocess: {
      includeProcessedMarkdown: true,
    },
    schema: frontmatterSchema.extend({
      author: z.string().optional(),
      date: z.string(),
      description: z.string().transform(substituteCounts).optional(),
      image: z.string().optional(),
    }),
  },
});

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      inline: "tailing-curly-colon",
      langs: ["ts", "js", "html", "tsx", "mdx", "css"],
      lazy: true,
      themes: {
        dark: smoothuiDark,
        light: smoothuiLight,
      },
      transformers: [
        ...(rehypeCodeDefaultOptions.transformers ?? []),
        transformerTwoslash({
          typesCache:
            process.env.NODE_ENV === "production"
              ? undefined // Disable filesystem cache in production (Vercel)
              : createFileSystemTypesCache(),
        }),
        {
          code(hast) {
            function replace(node: ElementContent): void {
              if (node.type === "text") {
                node.value = node.value.replace("[\\!code", "[!code");
              } else if ("children" in node) {
                for (const child of node.children) {
                  replace(child);
                }
              }
            }

            replace(hast);
            return hast;
          },
          name: "@shikijs/transformers:remove-notation-escape",
        },
      ],
    },
    rehypePlugins: (v) => [rehypeKatex, ...v],
    remarkCodeTabOptions: {
      parseMdx: true,
    },
    remarkNpmOptions: {
      persist: {
        id: "package-manager",
      },
    },
    remarkPlugins: [
      remarkSteps,
      remarkMath,
      remarkAutoTypeTable,
      remarkTypeScriptToJavaScript,
    ],
  },
  plugins: [
    jsonSchema({
      insert: true,
    }),
    lastModified(),
  ],
});
