import { expect, test } from "@playwright/test";

for (const width of [390, 1440]) {
  test(`UI Craft hero atmosphere preserves install controls at ${width}px`, async ({
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
    const section = page.locator('[data-landing-background="uicraft"]');
    const panel = page.locator("[data-uicraft-copy]");
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible();
    await expect(panel).toBeVisible();
    const panelBounds = await panel.boundingBox();
    const copyBounds = await panel
      .getByRole("button", { name: "Copy install command" })
      .boundingBox();
    expect(copyBounds?.x).toBeGreaterThanOrEqual(panelBounds?.x ?? 0);
    expect((copyBounds?.x ?? 0) + (copyBounds?.width ?? 0)).toBeLessThanOrEqual(
      (panelBounds?.x ?? 0) + (panelBounds?.width ?? 0)
    );
    await panel.getByRole("button", { exact: true, name: "brew" }).click();
    await page.getByRole("menuitem", { exact: true, name: "npx" }).click();
    await expect(panel.locator("code")).toHaveText(
      "npx skills add educlopez/ui-craft"
    );
    await panel.getByRole("button", { name: "Copy install command" }).click();
    await expect
      .poll(() =>
        page.evaluate(() => (window as unknown as { copied: string }).copied)
      )
      .toBe("npx skills add educlopez/ui-craft");
    await expect(
      panel.getByRole("link", { name: "Explore UI Craft" })
    ).toHaveAttribute("href", "https://skills.smoothui.dev");
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth)
    ).toBeLessThanOrEqual(width);
    await panel.screenshot({ path: `/tmp/smoothui-uicraft-hero-${width}.png` });
  });
}
