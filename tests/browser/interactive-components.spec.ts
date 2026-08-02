import { expect, test } from "@playwright/test";

const PROFILE_ITEM_NAME = /Profile/;

test("dialog traps keyboard focus and closes with Escape", async ({ page }) => {
  await page.goto("/preview/dialog");

  const trigger = page.getByRole("button", {
    exact: true,
    name: "Open Dialog",
  });
  await trigger.click();

  const dialog = page.getByRole("dialog", { name: "Dialog Title" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Got it" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    dialog.getByRole("button", { name: "Close dialog" })
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("button", { name: "Got it" })).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("dropdown supports arrow keys, Escape, and outside dismissal", async ({
  page,
}) => {
  await page.goto("/preview/dropdown-menu");

  const trigger = page.getByRole("button", { name: "Open Menu" });
  await trigger.focus();
  await page.keyboard.press("ArrowDown");

  const menu = page.getByRole("menu");
  await expect(menu).toBeVisible();
  await expect(
    page.getByRole("menuitem", { name: PROFILE_ITEM_NAME })
  ).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();

  await trigger.click();
  await expect(menu).toBeVisible();
  await page
    .getByText("Click outside the menu to close it.")
    .click({ force: true });
  await expect(menu).toBeHidden();
});
