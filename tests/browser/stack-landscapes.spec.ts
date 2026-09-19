import { expect, test } from "@playwright/test";

for (const width of [390, 1440]) {
  test(`stack and metadata landscapes at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ height: 1000, width });
    await page.goto("/preview/scrollable-card-stack");
    await expect(page.getByRole("tab")).toHaveCount(4);
    for (const [index, id] of [
      "volcanic-coast",
      "terracotta-dunes",
      "emerald-terraces",
      "glacial-lagoon",
    ].entries()) {
      // Pagination intentionally ignores clicks during its short scroll lock.
      // biome-ignore lint/performance/noAwaitInLoops: Exercise each card in sequence.
      await expect
        .poll(
          async () => {
            await page.getByRole("tab").nth(index).click();
            return page
              .getByRole("tab")
              .nth(index)
              .getAttribute("aria-selected");
          },
          { intervals: [350], timeout: 5000 }
        )
        .toBe("true");
      const image = page.locator(`img[src*="${id}.webp"]`);
      await expect(image).toBeVisible();
      await expect(image).toHaveJSProperty("complete", true);
    }
    await expect
      .poll(
        async () => {
          await page.getByRole("tab").first().click();
          return page.getByRole("tab").first().getAttribute("aria-selected");
        },
        { intervals: [350], timeout: 5000 }
      )
      .toBe("true");
    // Let the existing200mscard transform settle before capturing.
    await page.waitForTimeout(350);
    await page.screenshot({
      path: `/tmp/smoothui-stack-landscapes-${width}.png`,
    });
    await page.goto("/preview/image-metadata-preview");
    const image = page.locator('img[src*="turquoise-canyon.webp"]');
    await expect(image).toBeVisible();
    await expect(image).toHaveJSProperty("complete", true);
    await page.screenshot({
      path: `/tmp/smoothui-metadata-landscape-${width}.png`,
    });
    await page.goto("/");
    const metadata = page.locator('[data-showcase="image-metadata-preview"]');
    await metadata.scrollIntoViewIfNeeded();
    await expect(
      metadata.locator('img[src*="turquoise-canyon.webp"]')
    ).toBeVisible();
    await metadata.screenshot({
      path: `/tmp/smoothui-landing-metadata-landscape-${width}.png`,
    });
  });
}
