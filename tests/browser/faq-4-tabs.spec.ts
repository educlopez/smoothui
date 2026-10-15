import { expect, test } from "@playwright/test";

const ARIA_CONTROLS_VALUE = /.+/;

test("faq-4 category tabs move with arrow keys and set aria-controls", async ({
  page,
}) => {
  await page.goto("/blocks/preview/faq-4");

  const tabs = page.getByRole("tab");
  await expect(tabs).toHaveCount(3);

  const first = tabs.nth(0);
  const second = tabs.nth(1);
  await expect(first).toHaveAttribute("aria-controls", ARIA_CONTROLS_VALUE);
  await expect(second).toHaveAttribute("aria-controls", ARIA_CONTROLS_VALUE);

  await first.focus();
  await expect(first).toHaveAttribute("aria-selected", "true");

  await page.keyboard.press("ArrowRight");
  await expect(second).toHaveAttribute("aria-selected", "true");
  await expect(second).toBeFocused();
  await expect(second).toHaveAttribute("aria-controls", ARIA_CONTROLS_VALUE);
});
