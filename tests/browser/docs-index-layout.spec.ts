import { expect, test } from "@playwright/test";

const BLOCKS_CARD = /^Blocks/;
const comparison = 'a[href="/blog/best-react-animation-libraries"]';

for (const viewport of [
  { height: 900, width: 1440 },
  { height: 844, width: 390 },
]) {
  test.describe(`docs indexes at ${viewport.width}px`, () => {
    test.use({ viewport });

    test("the docs portal comes before the reading sections", async ({
      page,
    }) => {
      await page.goto("/docs");
      const main = page.getByRole("main");
      await expect(main).toHaveCount(1);
      const portal = main.getByRole("region", {
        name: "SmoothUI documentation",
      });
      await expect(portal.getByRole("link")).toHaveCount(3);
      await expect(
        portal.getByRole("link", { name: BLOCKS_CARD })
      ).toBeInViewport();
      await expect(
        main.getByRole("region", { name: "How to install" })
      ).toBeVisible();
      await expect(main.locator(comparison)).toHaveCount(1);
    });

    test("the blocks gallery fills the catalogue track above the reading copy", async ({
      page,
    }) => {
      await page.goto("/docs/blocks");
      const article = page.locator("#nd-page");
      const gallery = article.locator("ul.not-prose");
      const title = article.getByRole("heading", {
        level: 1,
        name: "UI Blocks",
      });
      await expect(title).toBeInViewport();
      await expect(gallery.getByRole("link")).toHaveCount(10);
      await expect(gallery.getByRole("link").first()).toBeInViewport();
      await expect(
        page.locator("[data-toc-popover], #nd-toc-popover")
      ).toHaveCount(0);

      const description = article.getByRole("region", {
        name: "Using SmoothUI blocks",
      });
      await expect(description.locator(comparison)).toHaveCount(1);
      const galleryBox = await gallery.boundingBox();
      const titleBox = await title.boundingBox();
      expect(galleryBox?.width).toBeCloseTo(titleBox?.width ?? 0, 0);
      await expect
        .poll(async () => {
          const grid = await gallery.boundingBox();
          const copy = await description.boundingBox();
          return grid && copy ? copy.y - (grid.y + grid.height) : -1;
        })
        .toBeGreaterThan(0);
    });
  });
}
