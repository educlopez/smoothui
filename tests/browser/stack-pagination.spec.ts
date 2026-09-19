import { expect, test } from "@playwright/test";

for (const reducedMotion of ["reduce", "no-preference"] as const) {
  test(`mobile stack pagination remains clickable: ${reducedMotion}`, async ({
    page,
  }) => {
    await page.setViewportSize({ height: 844, width: 390 });
    await page.emulateMedia({ reducedMotion });
    await page.goto("/preview/scrollable-card-stack?embed=1");
    const tabs = page.getByRole("tab");
    await expect(tabs).toHaveCount(4);
    for (const index of [3, 0, 1, 2, 3]) {
      // biome-ignore lint/performance/noAwaitInLoops: Sequential real-pointer regression across every card.
      await expect
        .poll(
          async () => {
            await tabs.nth(index).click();
            return tabs.nth(index).getAttribute("aria-selected");
          },
          { intervals: [350] }
        )
        .toBe("true");
    }
    const nav = await page.getByRole("tablist").boundingBox();
    const active = await page.locator('[data-active="true"]').boundingBox();
    expect(nav).not.toBeNull();
    expect(active).not.toBeNull();
    if (reducedMotion === "reduce") {
      expect((active?.y ?? 0) + (active?.height ?? 0)).toBeLessThan(
        nav?.y ?? 0
      );
    }
    await tabs.first().focus();
    await expect
      .poll(
        async () => {
          await page.keyboard.press("Enter");
          return tabs.first().getAttribute("aria-selected");
        },
        { intervals: [350] }
      )
      .toBe("true");
    await page.screenshot({
      path: `/tmp/smoothui-stack-pagination-${reducedMotion}-390.png`,
    });
  });
}
