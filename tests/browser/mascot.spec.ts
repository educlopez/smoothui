import { expect, type Locator, type Page, test } from "@playwright/test";

const SELECTED_CLI = /shadow-sm/;

function gazeX(gaze: Locator) {
  return gaze.evaluate(
    (element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).m41
  );
}

test("a mascot picks up hover when visibility tracking starts under the cursor", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const match = window.matchMedia.bind(window);
    window.matchMedia = (query) =>
      query === "(hover: hover) and (pointer: fine)"
        ? match("(pointer: none)")
        : match(query);
    const { observe } = IntersectionObserver.prototype;
    let unlocked = false;
    window.addEventListener("test:observe-mascots", () => {
      unlocked = true;
    });
    IntersectionObserver.prototype.observe = function observeVisible(target) {
      if (unlocked || !target.hasAttribute("data-mascot")) {
        observe.call(this, target);
        return;
      }
      document.documentElement.dataset.mascotObservationHeld = "true";
      window.addEventListener(
        "test:observe-mascots",
        () => observe.call(this, target),
        { once: true }
      );
    };
  });
  await page.goto("/");
  const link = page
    .locator('a[href="/"]')
    .filter({ has: page.locator("[data-mascot]"), visible: true })
    .first();
  const mark = link.locator("[data-mascot]");
  await expect(page.locator("html")).toHaveAttribute(
    "data-mascot-observation-held",
    "true"
  );
  await link.hover();
  await expect(mark).toHaveAttribute("data-expression", "neutral");
  await page.evaluate(() =>
    window.dispatchEvent(new Event("test:observe-mascots"))
  );
  await expect(mark).toHaveAttribute("data-expression", "curious");
});

test("SmoothUI looks toward a nearby cursor and settles when it moves away", async ({
  page,
}) => {
  await page.goto("/");
  const footer = page.locator("footer [data-mascot-surface]");
  const mark = footer.locator("[data-mascot]");
  const gaze = mark.locator("[data-mascot-gaze]");
  await mark.scrollIntoViewIfNeeded();
  await footer.hover();
  await expect(mark).toHaveAttribute("data-expression", "curious");
  const box = await mark.boundingBox();
  if (!box) {
    throw new Error("Missing footer mascot");
  }
  await page.mouse.move(box.x + 75, box.y + box.height / 2);
  await expect.poll(() => gazeX(gaze)).toBeGreaterThan(15);
  await page.mouse.move(box.x + 210, box.y + box.height / 2);
  await expect(mark).toHaveAttribute("data-expression", "neutral");
  await expect.poll(async () => Math.abs(await gazeX(gaze))).toBeLessThan(0.5);
});

test("the linked brand mark reacts to pressure without changing navigation", async ({
  page,
}) => {
  await page.goto("/");
  const link = page
    .locator('a[href="/"]')
    .filter({ has: page.locator("[data-mascot]"), visible: true })
    .first();
  const mark = link.locator("[data-mascot]");
  await link.hover();
  await expect(mark).toHaveAttribute("data-expression", "curious");
  await page.mouse.down();
  await expect(mark).toHaveAttribute("data-expression", "surprised");
  await page.evaluate(() => {
    for (const type of ["pointerup", "pointercancel"]) {
      window.dispatchEvent(
        new PointerEvent(type, { pointerId: 99, pointerType: "touch" })
      );
    }
  });
  await expect(mark).toHaveAttribute("data-expression", "surprised");
  await page.mouse.move(300, 150);
  await page.mouse.up();
  await expect(mark).toHaveAttribute("data-expression", "curious");
  await page.getByRole("link", { name: "Explore components" }).focus();
  await expect(mark).toHaveAttribute("data-expression", "neutral");
  await expect(link).toHaveAttribute("href", "/");
});

test("reduced motion keeps the ambient mascot still", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const mark = page.locator("footer [data-mascot-surface] [data-mascot]");
  await mark.hover();
  await expect(mark).toHaveAttribute("data-expression", "neutral");
  expect(await gazeX(mark.locator("[data-mascot-gaze]"))).toBe(0);
});

test("enabling reduced motion on the open page resets the mascot's gaze", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const footer = page.locator("footer [data-mascot-surface]");
  const mark = footer.locator("[data-mascot]");
  await mark.scrollIntoViewIfNeeded();
  await footer.hover();
  await expect(mark).toHaveAttribute("data-expression", "curious");
  const box = await mark.boundingBox();
  if (!box) {
    throw new Error("Missing footer mascot");
  }
  const gaze = mark.locator("[data-mascot-gaze]");
  await page.mouse.move(box.x + 75, box.y + box.height / 2);
  await expect.poll(() => gazeX(gaze)).toBeGreaterThan(15);
  await expect(mark).toHaveCSS("overflow", "visible");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(mark).toHaveAttribute("data-expression", "neutral");
  await expect.poll(async () => Math.abs(await gazeX(gaze))).toBeLessThan(0.5);
  await page.mouse.move(box.x + 80, box.y + box.height / 2);
  expect(await gazeX(gaze)).toBe(0);
});

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
  const footer = page.locator("footer.relative");
  const logo = footer
    .locator("span.font-allo-wordmark")
    .filter({ hasText: "SmoothUI" });
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
