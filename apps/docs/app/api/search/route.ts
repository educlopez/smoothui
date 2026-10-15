import { source } from "@docs/lib/source";
import { createFromSource } from "fumadocs-core/search/server";

// Pages are compiled at runtime (see `dynamic: true` in source.config.ts), and
// the index needs every page's structured data. Indexing asks for all of them
// at once, which would run ~290 compilations in parallel and balloon memory, so
// they are queued one at a time.
let queue: Promise<unknown> = Promise.resolve();

const inQueue = <T>(task: () => Promise<T>): Promise<T> => {
  const result = queue.then(task);
  queue = result.catch(() => undefined);
  return result;
};

export const { GET } = createFromSource(source, {
  buildIndex(page) {
    return inQueue(async () => {
      const { structuredData } = await page.data.load();

      return {
        id: page.url,
        structuredData,
        title: page.data.title,
        url: page.url,
      };
    });
  },
  // https://docs.orama.com/docs/orama-js/supported-languages
  language: "english",
});
