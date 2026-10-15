import { expect, type Page, test } from "@playwright/test";

const ARIA_CONTROLS_VALUE = /.+/;
const INDICATOR_TOLERANCE_PX = 2;

const assertIndicatorMatchesActiveTab = async (page: Page) => {
  const tab = page.locator('[role="tab"][aria-selected="true"]');
  const indicator = page.locator('[data-slot="tabs-indicator"]');

  await expect(tab).toBeVisible();
  await expect
    .poll(async () => {
      const tabBox = await tab.boundingBox();
      const indicatorBox = await indicator.boundingBox();
      if (!(tabBox && indicatorBox)) {
        return false;
      }
      const xOk = Math.abs(indicatorBox.x - tabBox.x) < INDICATOR_TOLERANCE_PX;
      const widthOk =
        Math.abs(indicatorBox.width - tabBox.width) < INDICATOR_TOLERANCE_PX;
      const bottomOk =
        Math.abs(
          indicatorBox.y + indicatorBox.height - (tabBox.y + tabBox.height)
        ) < INDICATOR_TOLERANCE_PX;
      return xOk && widthOk && bottomOk;
    })
    .toBe(true);
};

test("faq-4 category tabs move with arrow keys and set aria-controls", async ({
  page,
}) => {
  await page.goto("/blocks/preview/faq-4");

  const tabs = page.getByRole("tab");
  await expect(tabs).toHaveCount(3);

  const first = tabs.nth(0);
  const second = tabs.nth(1);
  await first.focus();
  await expect(first).toHaveAttribute("aria-selected", "true");
  await expect(first).toHaveAttribute("aria-controls", ARIA_CONTROLS_VALUE);

  await page.keyboard.press("ArrowRight");
  await expect(second).toHaveAttribute("aria-selected", "true");
  await expect(second).toBeFocused();
  await expect(second).toHaveAttribute("aria-controls", ARIA_CONTROLS_VALUE);
});

test("faq-4 indicator follows the active tab after switch and resize", async ({
  page,
}) => {
  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto("/blocks/preview/faq-4");

  const tabs = page.getByRole("tab");
  await expect(tabs).toHaveCount(3);

  const tabBoxes = await Promise.all(
    [0, 1, 2].map((index) => tabs.nth(index).boundingBox())
  );
  const ys = tabBoxes.map((box) => box?.y ?? Number.NaN);
  expect(Math.max(...ys) - Math.min(...ys)).toBeLessThan(4);

  await assertIndicatorMatchesActiveTab(page);

  await tabs.nth(1).click();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await assertIndicatorMatchesActiveTab(page);

  await tabs.nth(2).click();
  await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
  await assertIndicatorMatchesActiveTab(page);

  await page.setViewportSize({ height: 900, width: 1440 });
  await assertIndicatorMatchesActiveTab(page);

  await page.setViewportSize({ height: 844, width: 390 });
  await assertIndicatorMatchesActiveTab(page);
});

test("faq-4 tabpanel is not in the tab order", async ({ page }) => {
  await page.goto("/blocks/preview/faq-4");

  const panel = page.getByRole("tabpanel");
  await expect(panel).toBeVisible();
  await expect(panel).not.toHaveAttribute("tabindex", "0");
});

test("faq-4 first tab is fully visible and the row scrolls at 320px", async ({
  page,
}) => {
  await page.setViewportSize({ height: 844, width: 320 });
  await page.goto("/blocks/preview/faq-4");

  const first = page.getByRole("tab").nth(0);
  const list = page.getByRole("tablist");
  await expect(first).toBeVisible();

  const tabBox = await first.boundingBox();
  const listBox = await list.boundingBox();
  if (!(tabBox && listBox)) {
    throw new Error("expected the first tab and tablist to have boxes");
  }
  expect(tabBox.x).toBeGreaterThanOrEqual(listBox.x - 1);
  expect(tabBox.x + tabBox.width).toBeLessThanOrEqual(
    listBox.x + listBox.width + 1
  );

  const scrollable = await list.evaluate(
    (el) => el.scrollWidth > el.clientWidth + 1
  );
  expect(scrollable).toBe(true);

  await list.evaluate((el) => {
    el.scrollLeft = el.scrollWidth;
  });
  const scrolled = await list.evaluate((el) => el.scrollLeft > 0);
  expect(scrolled).toBe(true);
});
