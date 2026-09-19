import { expect, test } from "@playwright/test";

for (const width of [390, 1440]) {
  test(`compact installer copy at ${width}`, async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.setViewportSize({ height: 900, width });
    await page.emulateMedia({
      colorScheme: width === 1440 ? "dark" : "light",
      reducedMotion: "reduce",
    });
    await page.goto("/docs/components/number-flow");
    const installer = page
      .locator("div.rounded-lg.border")
      .filter({
        has: page.getByRole("button", { exact: true, name: "SmoothUI CLI" }),
      })
      .first();
    await installer
      .getByRole("button", { exact: true, name: "SmoothUI CLI" })
      .click();
    const copy = installer.getByRole("button", { exact: true, name: "Copy" });
    await copy.focus();
    await expect(copy).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(
      installer.getByRole("button", { exact: true, name: "Copied" })
    ).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      "npx smoothui-cli add number-flow"
    );
    await expect(copy).toBeVisible();
    await installer
      .getByRole("button", { exact: true, name: "shadcn CLI" })
      .click();
    await installer.getByRole("button", { exact: true, name: "pnpm" }).click();
    await copy.click();
    await expect(
      installer.getByRole("button", { exact: true, name: "Copied" })
    ).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      "pnpm dlx shadcn add @smoothui/number-flow"
    );
    const backgrounds = await installer.locator("div.pr-14").evaluate((row) => {
      const figure = row.querySelector("figure");
      return {
        code: figure ? getComputedStyle(figure).backgroundColor : null,
        row: getComputedStyle(row).backgroundColor,
      };
    });
    expect(backgrounds.row).toBe(backgrounds.code);
    await installer.screenshot({
      path: `/tmp/smoothui-installer-copy-${width}.png`,
    });
    await expect(
      installer.getByRole("button", { exact: true, name: "Copy command" })
    ).toHaveCount(0);
  });
}
