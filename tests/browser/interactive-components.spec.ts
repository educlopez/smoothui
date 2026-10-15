import { expect, test } from "@playwright/test";

const PROFILE_ITEM_NAME = /Profile/;

test("dialog traps keyboard focus and closes with Escape", async ({ page }) => {
  await page.goto("/preview/dialog");

  const trigger = page.getByRole("button", {
    exact: true,
    name: "Edit profile",
  });
  await trigger.click();

  const dialog = page.getByRole("dialog", { name: "Edit profile" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Save" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    dialog.getByRole("button", { name: "Close dialog" })
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("button", { name: "Save" })).toBeFocused();

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
  const profile = page.getByRole("menuitem", { name: PROFILE_ITEM_NAME });
  await expect
    .poll(async () =>
      profile.evaluate((node) => node === document.activeElement)
    )
    .toBe(true);

  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();

  await trigger.click();
  await expect(menu).toBeVisible();
  // Outside dismissal: click an empty corner of the page, away from the menu.
  await page.mouse.click(4, 4);
  await expect(menu).toBeHidden();
});
