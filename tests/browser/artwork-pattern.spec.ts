import { expect, test } from "@playwright/test";

for (const width of [390, 1440]) {
  test(`optional pattern stays behind interactive UI at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ height: 1000, width });
    await page.goto("/");
    const stage = page.locator('[data-vivid-stage="features"]');
    const pattern = stage.locator('[data-artwork-pattern="squares"]');
    await stage.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        stage
          .locator("img")
          .evaluate((image) => (image as HTMLImageElement).naturalWidth)
      )
      .toBeGreaterThan(0);
    await expect(pattern).toBeVisible();
    await expect(pattern).toHaveCSS("pointer-events", "none");
    await expect(pattern).toHaveAttribute("aria-hidden", "true");
    await expect(
      page.locator('[data-vivid-stage="ai"] [data-artwork-pattern]')
    ).toHaveCount(1);
    const link = stage
      .locator("..")
      .getByRole("link", { name: "Smooth animations" });
    await link.focus();
    await expect(link).toBeFocused();
    await stage
      .locator("..")
      .screenshot({ path: `/tmp/smoothui-pattern-features-${width}.png` });
    const ai = page.locator('[data-vivid-stage="ai"]');
    await ai.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        ai
          .locator("img")
          .evaluate((image) => (image as HTMLImageElement).naturalWidth)
      )
      .toBeGreaterThan(0);
    await expect(ai.locator('[data-artwork-pattern="contours"]')).toHaveCSS(
      "pointer-events",
      "none"
    );
    await expect(ai.getByText("AI agents, meet your components")).toBeVisible();
    await ai
      .locator("..")
      .screenshot({ path: `/tmp/smoothui-pattern-ai-contours-${width}.png` });
  });
}
