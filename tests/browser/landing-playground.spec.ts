import { expect, test } from "@playwright/test";

const PLAYGROUND_TITLE = /Playground/;

test.describe("mobile landing", () => {
  test.use({
    hasTouch: true,
    isMobile: true,
    viewport: { height: 844, width: 390 },
  });
  test("all twelve cards fit and expose their documentation arrows on touch", async ({
    page,
  }) => {
    await page.goto("/");
    const cards = page.locator("[data-showcase]");
    await expect(cards).toHaveCount(12);
    for (let index = 0; index < 12; index += 1) {
      const card = cards.nth(index);
      await card.scrollIntoViewIfNeeded();
      const arrow = card.locator(":scope > a");
      await expect(arrow).toHaveCSS("opacity", "1");
      const bounds = await card.boundingBox();
      expect(bounds?.x).toBeGreaterThanOrEqual(0);
      expect((bounds?.x ?? 0) + (bounds?.width ?? 0)).toBeLessThanOrEqual(390);
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth)
    ).toBeLessThanOrEqual(390);
  });
});

test("legacy themes URL preserves the shared preset in Playground", async ({
  page,
}) => {
  await page.goto("/themes?preset=s1.candy.16.20.mono.warm");
  await expect(page).toHaveURL("/playground?preset=s1.candy.16.20.mono.warm");
  await expect(page).toHaveTitle(PLAYGROUND_TITLE);
  await expect(
    page.getByRole("heading", { name: "SmoothUI Playground" })
  ).toBeAttached();
});

test("twelve live showcase cards have only corner documentation links", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const cards = page.locator("[data-showcase]");
  await expect(cards).toHaveCount(12);
  await expect(cards.locator("footer")).toHaveCount(0);
  const counter = page.locator('[data-showcase="number-flow"]');
  await counter.scrollIntoViewIfNeeded();
  await expect(counter.locator("output")).toHaveText("128");
  await counter.getByRole("button", { name: "Increase number" }).click();
  await expect(counter.locator("output")).toHaveText("129");
  const link = counter.getByRole("link", {
    name: "View Number Flow documentation",
  });
  await link.focus();
  await expect(link).toHaveCSS("opacity", "1");
  const bounds = await link.boundingBox();
  expect(bounds?.width).toBeGreaterThanOrEqual(40);
  expect(bounds?.height).toBeGreaterThanOrEqual(40);
});

test("photo tabs and checkbox remain keyboard operable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const photo = page.locator('[data-showcase="phototab"]');
  await photo.scrollIntoViewIfNeeded();
  const tab = photo.getByRole("tab").nth(1);
  await tab.focus();
  await page.keyboard.press("Enter");
  await expect(tab).toHaveAttribute("aria-selected", "true");
  const checkbox = page
    .locator('[data-showcase="checkbox"]')
    .getByRole("checkbox")
    .first();
  await checkbox.scrollIntoViewIfNeeded();
  await checkbox.focus();
  await page.keyboard.press("Space");
  await expect(checkbox).toBeChecked();
});

test("community logos continue cycling past five seconds with discreet accessible pause", async ({
  page,
}) => {
  await page.goto("/");
  const carousel = page.locator("[data-carousel-running]");
  await carousel.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await expect(carousel).toHaveAttribute("data-carousel-running", "true");
  const names = () =>
    carousel
      .locator("a:not([tabindex='-1'])")
      .evaluateAll((es) =>
        es.map((e) => e.getAttribute("aria-label")).join(",")
      );
  const first = await names();
  await page.waitForTimeout(5900);
  expect(await names()).not.toBe(first);
  await expect(carousel).toHaveAttribute("data-carousel-running", "true");
  const pause = carousel.getByRole("button", { name: "Pause logo animation" });
  const bounds = await pause.boundingBox();
  expect(bounds?.width).toBeLessThanOrEqual(1);
  await pause.focus();
  await page.keyboard.press("Enter");
  await expect(carousel).toHaveAttribute("data-carousel-running", "false");
  await expect(carousel.locator("a")).toHaveCount(7);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(carousel.locator("a")).toHaveCount(7);
});

test("intrinsic showcase demos remain horizontally centered", async ({
  page,
}) => {
  await page.setViewportSize({ height: 1000, width: 1440 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const [slug, selector] of [
    ["phototab", "[role=tablist]"],
    ["animated-toggle", "[role=switch]"],
    ["image-metadata-preview", "img"],
  ]) {
    const card = page.locator(`[data-showcase="${slug}"]`);
    await card.scrollIntoViewIfNeeded();
    const item = card.locator(selector).first();
    await expect(item).toBeVisible();
    const box = await card.boundingBox();
    const target = await item.boundingBox();
    expect(
      Math.abs(
        (box?.x ?? 0) +
          (box?.width ?? 0) / 2 -
          (target?.x ?? 0) -
          (target?.width ?? 0) / 2
      ),
      slug
    ).toBeLessThan(20);
  }
});

test("island visible pill and controls are vertically balanced", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const card = page.locator('[data-showcase="dynamic-island"]');
  await card.scrollIntoViewIfNeeded();
  const pill = card.getByText("Clear skies · 22°");
  await expect(pill).toBeVisible();
  const controls = card.getByRole("button", { exact: true, name: "idle" });
  const outer = await card.boundingBox();
  const top = await pill.boundingBox();
  const bottom = await controls.boundingBox();
  const visibleCenter =
    ((top?.y ?? 0) + (bottom?.y ?? 0) + (bottom?.height ?? 0)) / 2;
  expect(
    Math.abs(visibleCenter - (outer?.y ?? 0) - (outer?.height ?? 0) / 2)
  ).toBeLessThan(12);
});

for (const width of [390, 1440]) {
  test(`expanded previews stay inside content-driven frames at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ height: 900, width });
    await page.goto("/");
    const metadata = page.locator('[data-showcase="image-metadata-preview"]');
    await metadata.scrollIntoViewIfNeeded();
    await metadata
      .getByRole("button", { exact: true, name: "Open Metadata Preview" })
      .click();
    await expect(
      metadata.getByRole("button", { name: "Close metadata preview" })
    ).toBeVisible();
    await expect
      .poll(async () => {
        const card = await metadata.boundingBox();
        const img = await metadata.locator("img").boundingBox();
        return (img?.y ?? 0) - (card?.y ?? 0);
      })
      .toBeGreaterThanOrEqual(0);
    await metadata
      .getByRole("button", { name: "Close metadata preview" })
      .click();
    await expect(
      metadata.getByRole("button", {
        exact: true,
        name: "Open Metadata Preview",
      })
    ).toBeVisible();
    const avatar = page.locator('[data-showcase="user-account-avatar"]');
    await avatar.scrollIntoViewIfNeeded();
    await avatar.getByRole("button").first().click();
    const editProfile = avatar.getByRole("button", {
      exact: true,
      name: "Edit Profile",
    });
    await editProfile.scrollIntoViewIfNeeded();
    await editProfile.click({ force: width <= 480 });
    const dialog = avatar.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect
      .poll(async () => {
        const card = await avatar.boundingBox();
        const menu = await dialog.boundingBox();
        return (
          (card?.y ?? 0) +
          (card?.height ?? 0) -
          (menu?.y ?? 0) -
          (menu?.height ?? 0)
        );
      })
      .toBeGreaterThanOrEqual(0);
    await page.keyboard.press("Tab");
    await expect(avatar.getByLabel("Name", { exact: true })).toBeFocused();
    await avatar.getByLabel("Name", { exact: true }).fill("Jane Updated");
    await avatar.getByRole("button", { name: "Save Changes" }).click();
    await avatar
      .getByRole("button", { exact: true, name: "Edit Profile" })
      .click();
    await expect(avatar.getByLabel("Name", { exact: true })).toHaveValue(
      "Jane Updated"
    );
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(avatar.getByRole("button").first()).toBeFocused();
    const island = page.locator('[data-showcase="dynamic-island"]');
    await island.scrollIntoViewIfNeeded();
    for (const state of ["ring", "timer", "idle"]) {
      await island.getByRole("button", { exact: true, name: state }).click();
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth)
    ).toBeLessThanOrEqual(width);
  });
}

test("metadata preserves nonreduced moving-image expansion inside frame", async ({
  page,
}) => {
  await page.goto("/");
  const card = page.locator('[data-showcase="image-metadata-preview"]');
  await card.scrollIntoViewIfNeeded();
  const photo = card.locator("img").locator("..");
  await card
    .getByRole("button", { exact: true, name: "Open Metadata Preview" })
    .click();
  await expect
    .poll(() =>
      photo.evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).m42)
    )
    .toBeLessThan(-1);
  const mid = await photo.evaluate(
    (e) => new DOMMatrix(getComputedStyle(e).transform).m42
  );
  await page.waitForTimeout(350);
  const end = await photo.evaluate(
    (e) => new DOMMatrix(getComputedStyle(e).transform).m42
  );
  expect(end).toBeLessThanOrEqual(mid);
  const frame = await card.boundingBox();
  const image = await card.locator("img").boundingBox();
  expect(image.y).toBeGreaterThanOrEqual(frame.y);
  await card.getByRole("button", { name: "Close metadata preview" }).click();
  await expect
    .poll(() =>
      photo.evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).m42)
    )
    .toBe(0);
});

for (const width of [390, 1440]) {
  test(`landing section surfaces share canonical gutters at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ height: 1000, width });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const expectedLeft = Math.max(0, (width - 1280) / 2) + 32;
    const expectedWidth = Math.min(width, 1280) - 64;
    const headings = [
      "Built for AI-assisted development",
      "What they say about us",
      "Featured across the community",
      "From the blog",
    ];
    for (const name of headings) {
      const section = page
        .getByRole("heading", { exact: true, name })
        .locator("xpath=ancestor::section[1]");
      const surface = section.locator(".max-w-7xl").first();
      await surface.scrollIntoViewIfNeeded();
      const bounds = await surface.boundingBox();
      expect(bounds?.x, name).toBeCloseTo(expectedLeft, 0);
      expect(bounds?.width, name).toBeCloseTo(expectedWidth, 0);
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth)
    ).toBeLessThanOrEqual(width);
  });
}

for (const width of [390, 1440]) {
  test(`footer alignment and focused hero message at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ height: 1000, width });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toHaveText("React components.Made to move.");
    const hero = heading.locator("xpath=ancestor::section[1]");
    await expect(
      hero.getByRole("link", { name: "Browse components" })
    ).toHaveAttribute("href", "/docs/components");
    await hero.screenshot({ path: `/tmp/smoothui-hero-refined-${width}.png` });
    const expectedLeft = Math.max(0, (width - 1280) / 2) + 32;
    const expectedWidth = Math.min(width, 1280) - 64;
    const footerGrid = page.locator("footer .grid").first();
    await footerGrid.scrollIntoViewIfNeeded();
    const footerBounds = await footerGrid.boundingBox();
    expect(footerBounds?.x).toBeCloseTo(expectedLeft, 0);
    expect(footerBounds?.width).toBeCloseTo(expectedWidth, 0);
    await page
      .locator("footer.relative")
      .screenshot({ path: `/tmp/smoothui-footer-${width}.png` });
    const faq = page
      .getByRole("heading", { name: "Frequently Asked Questions" })
      .locator("xpath=ancestor::section[1]")
      .locator(".max-w-3xl");
    const faqBounds = await faq.boundingBox();
    expect(faqBounds?.width).toBeCloseTo(Math.min(768, expectedWidth), 0);
    expect(faqBounds?.x).toBeCloseTo(
      (width - Math.min(768, expectedWidth)) / 2,
      0
    );
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth)
    ).toBeLessThanOrEqual(width);
  });
}

for (const width of [390, 1440]) {
  test(`hero stage tabs stay in view at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ height: 1000, width });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const hero = page
      .getByRole("heading", { level: 1 })
      .locator("xpath=ancestor::section[1]");
    const tabs = hero.getByRole("tablist", { name: "Previews" });
    await expect(tabs.getByRole("tab", { name: "Landing" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(
      hero.getByRole("heading", {
        name: "Unlock growth with quieter analytics",
      })
    ).toBeVisible();
    await tabs.getByRole("tab", { name: "Dashboard" }).click();
    await expect(tabs.getByRole("tab", { name: "Dashboard" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(hero.getByRole("heading", { name: "Overview" })).toBeVisible();
    await expect(hero.getByText("Visitors")).toBeVisible();
    await tabs.getByRole("tab", { name: "Experiment" }).click();
    await expect(
      hero.getByRole("button", { name: "Maya Solis — next" })
    ).toBeVisible();
    const box = await tabs.boundingBox();
    if (!box) {
      throw new Error("Hero tabs have no bounds");
    }
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth)
    ).toBeLessThanOrEqual(width);
    await hero.screenshot({ path: `/tmp/smoothui-hero-stage-${width}.png` });
  });
}

for (const reducedMotion of ["reduce", "no-preference"] as const) {
  test(`number flow preserves layout and rolling carry with ${reducedMotion}`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion });
    await page.goto("/");
    const counter = page.locator('[data-showcase="number-flow"]');
    await counter.scrollIntoViewIfNeeded();
    const plus = counter.getByRole("button", { name: "Increase number" });
    await expect(counter.locator("output")).toHaveText("128");
    await plus.click();
    await expect(counter.locator("output")).toHaveText("129");
    await plus.click();
    await expect(counter.locator("output")).toHaveText("130");
    if (reducedMotion === "no-preference") {
      expect(
        await counter.evaluate(
          (element) =>
            element
              .getAnimations({ subtree: true })
              .filter((animation) => animation.playState === "running").length
        )
      ).toBeGreaterThan(0);
    }
    await counter.getByRole("button", { name: "Decrease number" }).click();
    await expect(counter.locator("output")).toHaveText("129");
    await page.waitForTimeout(350);
    for (const width of [390, 1440]) {
      await page.setViewportSize({ height: 1000, width });
      const centers = await plus.evaluate((button) => {
        const rect = button.getBoundingClientRect();
        const icon = button.querySelector("svg")?.getBoundingClientRect();
        return {
          x: icon ? icon.x + icon.width / 2 - rect.x - rect.width / 2 : 99,
          y: icon ? icon.y + icon.height / 2 - rect.y - rect.height / 2 : 99,
        };
      });
      expect(Math.abs(centers.x)).toBeLessThan(1);
      expect(Math.abs(centers.y)).toBeLessThan(1);
      await counter.screenshot({
        path: `/tmp/smoothui-numberflow-${width}-${reducedMotion}.png`,
      });
    }
  });
}
