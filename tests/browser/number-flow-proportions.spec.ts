import { expect, test } from "@playwright/test";

for (const width of [390, 1440]) {
  test(`number flow matches documentation at ${width}`, async ({ page }) => {
    await page.setViewportSize({ height: 900, width });
    await page.goto("/preview/number-flow?embed=1");
    const docsButton = page.getByRole("button", { name: "Increase number" });
    const docsSize = await docsButton.boundingBox();
    await page.goto("/");
    const counter = page.locator('[data-showcase="number-flow"]');
    await counter.scrollIntoViewIfNeeded();
    await counter.screenshot({
      path: `/tmp/smoothui-number-flow-after-${width}.png`,
    });
    const increase = counter.getByRole("button", { name: "Increase number" });
    const decrease = counter.getByRole("button", { name: "Decrease number" });
    const buttonSize = await increase.boundingBox();
    expect(buttonSize?.height).toBe(docsSize?.height);
    const stack = await increase.locator("..").boundingBox();
    const digits = await counter
      .locator('[aria-hidden="true"]')
      .first()
      .boundingBox();
    expect(stack?.height).toBeLessThanOrEqual((digits?.height ?? 0) + 2);
    await expect(counter.locator("output")).toHaveText("128");
    await increase.click();
    await expect(counter.locator("output")).toHaveText("129");
    await decrease.click();
    await expect(counter.locator("output")).toHaveText("128");
  });
}
