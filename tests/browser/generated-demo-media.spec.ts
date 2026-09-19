import { expect, test } from "@playwright/test";

for (const width of [390, 1440]) {
  test(`generated blog and avatar media at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ height: 1000, width });
    await page.goto("/blog");
    const cover = page
      .locator('img[src*="smoothui%2Fscenes"], img[src*="smoothui/scenes"]')
      .first();
    await expect(cover).toBeVisible();
    await expect(cover).toHaveJSProperty("complete", true);
    await page.screenshot({
      fullPage: true,
      path: `/tmp/smoothui-blog-generated-${width}.png`,
    });
    await page.goto("/preview/animated-avatar-group");
    const portraits = page.locator('img[src*="troupe-people"]');
    await expect(portraits.first()).toBeVisible();
    expect(
      await page
        .locator(
          'img[src*="smoothui/people/"],img[src*="smoothui%2Fpeople%2F"]'
        )
        .count()
    ).toBe(0);
    await portraits.first().scrollIntoViewIfNeeded();
    await page.screenshot({
      path: `/tmp/smoothui-avatar-group-generated-${width}.png`,
    });
  });
}

for (const demo of [
  "animated-list",
  "user-account-avatar",
  "wallet-card",
  "figma-comment",
  "inline-testimonials",
]) {
  test(`${demo} renders owned Troupe portraits`, async ({ page }) => {
    await page.goto(`/preview/${demo}`);
    const portrait = page.locator('img[src*="troupe-people"]').first();
    await expect(portrait).toBeVisible();
    await expect(portrait).toHaveJSProperty("complete", true);
    expect(await page.locator('img[src*="smoothui/people/"]').count()).toBe(0);
  });
}

test("social hover reveals its generated profile portrait", async ({
  page,
}) => {
  await page.goto("/preview/social-hover-card");
  await page.locator('[aria-haspopup="dialog"]').hover();
  await expect(page.locator('img[src*="troupe-people"]').first()).toBeVisible();
});

for (const block of [
  "header-3",
  "team-1",
  "team-2",
  "testimonials-1",
  "testimonials-2",
  "testimonials-3",
]) {
  test(`${block} uses generated demo people`, async ({ page }) => {
    await page.goto(`/blocks/preview/${block}`);
    await expect(
      page.locator('img[src*="troupe-people"]').first()
    ).toBeVisible();
    expect(await page.locator('img[src*="smoothui/people/"]').count()).toBe(0);
  });
}

for (const width of [390, 1440]) {
  for (const demo of ["phototab", "apple-invites", "expandable-cards"]) {
    test(`${demo} semantic images at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ height: 1000, width });
      await page.goto(`/preview/${demo}`);
      const images = page.locator(
        demo === "phototab" ? 'img[src*="landscapes"]' : 'img[src*="events"]'
      );
      await expect(images.first()).toBeVisible();
      await expect(images.first()).toHaveJSProperty("complete", true);
      if (demo === "phototab") {
        for (const name of ["Sea", "Forest", "Mountains"]) {
          // biome-ignore lint/performance/noAwaitInLoops: Tabs must be activated sequentially.
          await page.getByRole("tab", { exact: true, name }).click();
          await expect(
            page.getByRole("img", { exact: true, name })
          ).toBeVisible();
        }
      }
      await page.screenshot({
        path: `/tmp/smoothui-semantic-${demo}-${width}.png`,
      });
    });
  }
}
