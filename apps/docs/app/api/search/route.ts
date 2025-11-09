import { createFromSource } from "fumadocs-core/search/server";
import { source } from "@docs/lib/source";

export const { GET } = createFromSource(source, {
  // https://docs.orama.com/docs/orama-js/supported-languages
  language: "english",
});
