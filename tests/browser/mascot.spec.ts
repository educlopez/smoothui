import { expect, type Page, test } from "@playwright/test";

const SELECTED_CLI = /shadow-sm/;

async function readyInstaller(page: Page) {
  // Existing contributor-tooltip hydration recovery can replace the docs tree.
  // Establish a hydrated CLI selection before testing a single copy action.
  await expect(async () => {
    const cli = page.getByRole("button", { exact: true, name: "shadcn CLI" });
    await cli.click();
    await expect(cli).toHaveClass(SELECTED_CLI);
  }).toPass();
}

test("footer brand mark is a static logo", async ({ page }) => {
  await page.goto("/");
  const footer = page.locator("footer");
  const logo = footer.getByText("SmoothUI", { exact: true });
  await logo.scrollIntoViewIfNeeded();
  await expect(logo).toBeVisible();
  await expect(footer.getByRole("button", { name: "SmoothUI" })).toHaveCount(0);
  await logo.click();
  await expect(page.getByText("You made it. Now make something.")).toHaveCount(
    0
  );
});

test("inline copy announces success without a mascot popup", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: () => Promise.resolve() },
    });
  });
  await page.goto("/docs/components/siri-orb");
  await readyInstaller(page);
  await page.getByRole("button", { exact: true, name: "Copy" }).click();
  await expect(
    page.getByRole("button", { exact: true, name: "Copied" })
  ).toBeVisible();
  await expect(page.getByText("Yours now. Make it your own.")).toBeHidden();
  await expect(
    page.getByRole("button", { exact: true, name: "Copy" })
  ).toBeEnabled();
});

test("copy failure never celebrates", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: () => Promise.reject(new Error("Denied")),
      },
    });
  });
  await page.goto("/docs/components/siri-orb");
  await readyInstaller(page);
  const copy = page.getByRole("button", { exact: true, name: "Copy" });
  await copy.click();
  const retry = page.getByRole("button", {
    exact: true,
    name: "Copy failed. Try again",
  });
  await expect(retry).toBeEnabled();
  await expect(
    page.getByRole("button", { exact: true, name: "Copied" })
  ).toHaveCount(0);
  await retry.click();
  await expect(retry).toBeEnabled();
});

test("changing command invalidates a pending clipboard result", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: () =>
          new Promise<void>((resolve) => {
            window.addEventListener("resolve-copy", () => resolve(), {
              once: true,
            });
          }),
      },
    });
  });
  await page.goto("/docs/components/siri-orb");
  await readyInstaller(page);
  await page.getByRole("button", { exact: true, name: "SmoothUI CLI" }).click();
  await page.getByRole("button", { exact: true, name: "Copy" }).click();
  await page.getByRole("button", { exact: true, name: "shadcn CLI" }).click();
  await page.evaluate(() => window.dispatchEvent(new Event("resolve-copy")));
  await expect(
    page.getByRole("button", { exact: true, name: "Copy" })
  ).toBeEnabled();
  await expect(page.getByText("Yours now. Make it your own.")).toBeHidden();
  await expect(
    page.getByRole("button", { exact: true, name: "Copied" })
  ).toHaveCount(0);
});
