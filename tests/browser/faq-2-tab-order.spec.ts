import { expect, test } from "@playwright/test";

test("faq-2 has a single tab stop per question", async ({ page }) => {
  await page.goto("/blocks/preview/faq-2");

  const questions = page.getByRole("button");
  await expect(questions).toHaveCount(6);

  await questions.nth(0).focus();
  await expect(questions.nth(0)).toBeFocused();

  await page.keyboard.press("Tab");
  await expect(questions.nth(1)).toBeFocused();
});
