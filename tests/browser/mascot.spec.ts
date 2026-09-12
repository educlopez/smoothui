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

test("mascot reactions stay local and reduced motion remains static", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const companion = page.getByRole("button", { exact: true, name: "Say hi" });
  await companion.scrollIntoViewIfNeeded();
  const mascot = companion.locator("svg");
  await expect(mascot).toHaveAttribute("data-expression", "neutral");
  await page.locator("body").click({ position: { x: 2, y: 2 } });
  await expect(mascot).toHaveAttribute("data-expression", "neutral");
  await companion.focus();
  await page.keyboard.press("Enter");
  await expect(mascot).toHaveAttribute("data-expression", "happy");
  await expect(mascot).toHaveCSS("transform", "none");
  await page.getByRole("button", { exact: true, name: "Dismiss" }).click();
  await expect(companion).toBeFocused();
  await expect(page.getByText("You made it. Now make something.")).toBeHidden();
});

test("copy success celebrates and Escape restores the trigger", async ({
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
  const copy = page.getByRole("button", { exact: true, name: "Copy command" });
  await copy.click();
  const copied = page.getByRole("button", {
    exact: true,
    name: "Command copied",
  });
  await expect(copied.locator("svg")).toHaveAttribute(
    "data-expression",
    "happy"
  );
  await expect(
    page.getByRole("status").filter({ hasText: "Command copied to clipboard." })
  ).toBeAttached();
  await page.getByRole("button", { exact: true, name: "Dismiss" }).focus();
  await page.keyboard.press("Escape");
  await expect(copied).toBeFocused();
  await expect(page.getByText("Yours now. Make it your own.")).toBeHidden();
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
  const copy = page.getByRole("button", { exact: true, name: "Copy command" });
  await copy.click();
  await expect(
    page.getByText(
      "Clipboard unavailable. Select the command below to copy it manually."
    )
  ).toBeVisible();
  await expect(page.getByText("Yours now. Make it your own.")).toBeHidden();
  await expect(copy.locator("svg")).not.toHaveAttribute(
    "data-expression",
    "happy"
  );
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
  await page.getByRole("button", { exact: true, name: "Copy command" }).click();
  await page.getByRole("button", { exact: true, name: "shadcn CLI" }).click();
  await page.evaluate(() => window.dispatchEvent(new Event("resolve-copy")));
  await expect(
    page.getByRole("button", { exact: true, name: "Copy command" })
  ).toBeEnabled();
  await expect(page.getByText("Yours now. Make it your own.")).toBeHidden();
  await expect(
    page.getByRole("button", { exact: true, name: "Command copied" })
  ).toHaveCount(0);
});
