import { expect, test } from "@playwright/test";

for (const width of [390, 1440]) {
  test(`editorial covers at ${width}`, async ({ page }) => {
    await page.setViewportSize({ height: 1000, width });
    for (const slug of [
      "building-animated-tabs",
      "building-magnetic-button",
      "introducing-ui-craft",
    ]) {
      await page.goto(`/blog/${slug}`);
      const cover = page.locator("[data-blog-cover]").first();
      await cover.scrollIntoViewIfNeeded();
      await expect(cover).toBeVisible();
      await cover
        .locator("..")
        .locator("img")
        .evaluate((image: HTMLImageElement) => image.decode());
      await cover
        .locator("..")
        .screenshot({ path: `/tmp/smoothui-blog-${slug}-${width}.png` });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth
        )
      ).toBe(true);
    }
    await page.goto("/");
    const landingCover = page.locator("[data-blog-cover]").first();
    await landingCover.scrollIntoViewIfNeeded();
    await expect(landingCover).toBeVisible();
    await landingCover
      .locator("..")
      .locator("img")
      .evaluate((image: HTMLImageElement) => image.decode());
    await landingCover
      .locator("..")
      .screenshot({ path: `/tmp/smoothui-blog-landing-${width}.png` });
    await page.goto("/blog");
    await expect(page.locator("[data-blog-cover]")).toHaveCount(15);
    await page.screenshot({
      fullPage: true,
      path: `/tmp/smoothui-blog-listing-${width}.png`,
    });
  });
}
