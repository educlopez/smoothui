import { expect, test } from "@playwright/test";

test.describe("docs mobile", () => {
  test.use({
    hasTouch: true,
    isMobile: true,
    viewport: { height: 844, width: 390 },
  });

  test("dock preview stays inside its iframe at 390px", async ({ page }) => {
    await page.goto("/docs/components/dock");
    const iframe = page.locator('iframe[title="Dock preview"]');
    await expect(async () => {
      await expect(iframe).toBeVisible();
      const dock = iframe
        .contentFrame()
        .getByRole("navigation", { name: "Application dock" });
      await expect(dock).toBeVisible();
      const frame = await iframe.boundingBox();
      const bar = await dock.boundingBox();
      if (!(frame && bar)) {
        throw new Error("Dock or iframe has no box");
      }
      const left = bar.x - frame.x;
      const right = frame.x + frame.width - (bar.x + bar.width);
      expect(Math.min(left, right)).toBeGreaterThanOrEqual(0);
      await iframe.screenshot({
        path: "/opt/cursor/artifacts/screenshots/dock-iframe-390.png",
      });
    }).toPass();
  });

  test("floating navigation hides while the mobile sidebar is open", async ({
    page,
  }) => {
    await page.goto("/docs/components/dock");
    const floatNav = page.getByRole("navigation", {
      name: "Floating Navigation",
    });
    await expect(floatNav).toBeVisible();
    const openSidebar = page.getByRole("button", { name: "Open Sidebar" });
    await expect(openSidebar).toBeEnabled();
    const sidebar = page.locator("#nd-sidebar-mobile");
    await expect(sidebar).toBeAttached();
    // Contributor tooltip hydration can regenerate the docs tree and drop a
    // click that lands before recovery. Re-click only while closed.
    await expect(async () => {
      if ((await sidebar.getAttribute("data-state")) !== "open") {
        await openSidebar.click();
      }
      await expect(sidebar).toHaveAttribute("data-state", "open");
    }).toPass();
    await expect(sidebar).toBeVisible();
    await sidebar
      .getByRole("link", { name: "Visit Sparkbites" })
      .scrollIntoViewIfNeeded();
    await expect(floatNav).toBeHidden();
    await page.screenshot({
      path: "/opt/cursor/artifacts/screenshots/docs-sidebar-390.png",
    });
  });
});
