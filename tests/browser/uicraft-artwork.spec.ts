import { expect, test } from "@playwright/test";

for (const width of [390, 1440]) {
  test(`blue UI Craft artwork preserves install controls at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ height: 1000, width });
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "clipboard", {
        value: {
          writeText: (text: string) => {
            (window as unknown as { copied: string }).copied = text;
            return Promise.resolve();
          },
        },
      });
    });
    await page.goto("/");
    const image = page.locator('[data-landing-background="uicraft"]');
    const card = image.locator("..");
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        image.evaluate((node) => (node as HTMLImageElement).naturalWidth)
      )
      .toBeGreaterThan(0);
    await expect(image).toHaveAttribute(
      "src",
      "https://ik.imagekit.io/16u211libb/smoothui/scenes/cobalt-pink.webp?tr=w-1280,f-auto"
    );
    await expect(card.locator('[data-artwork-pattern="contours"]')).toHaveCSS(
      "pointer-events",
      "none"
    );
    const panelBounds = await card.locator("[data-uicraft-copy]").boundingBox();
    const copyBounds = await card
      .getByRole("button", { name: "Copy install command" })
      .boundingBox();
    expect(copyBounds?.x).toBeGreaterThanOrEqual(panelBounds?.x ?? 0);
    expect((copyBounds?.x ?? 0) + (copyBounds?.width ?? 0)).toBeLessThanOrEqual(
      (panelBounds?.x ?? 0) + (panelBounds?.width ?? 0)
    );
    await card.getByRole("button", { exact: true, name: "brew" }).click();
    await page.getByRole("menuitem", { exact: true, name: "npx" }).click();
    await expect(card.locator("code")).toHaveText(
      "npx skills add educlopez/ui-craft"
    );
    await card.getByRole("button", { name: "Copy install command" }).click();
    await expect
      .poll(() =>
        page.evaluate(() => (window as unknown as { copied: string }).copied)
      )
      .toBe("npx skills add educlopez/ui-craft");
    await expect(
      card.getByRole("link", { name: "Explore UI Craft" })
    ).toHaveAttribute("href", "https://skills.smoothui.dev");
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth)
    ).toBeLessThanOrEqual(width);
    await card.screenshot({ path: `/tmp/smoothui-uicraft-blue-${width}.png` });
  });
}
