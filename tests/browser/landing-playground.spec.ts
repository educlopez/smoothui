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
  await counter.getByRole("button", { name: "Increase value" }).click();
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

test("illustrated command copy failure is recoverable", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error("Denied")) },
    });
  });
  await page.goto("/");
  const copy = page.getByRole("button", {
    exact: true,
    name: "Copy example command",
  });
  await copy.click();
  await expect(page.getByText("Copy unavailable. Try again.")).toBeVisible();
  await expect(copy).toBeEnabled();
  await expect(
    page.getByRole("status").filter({ hasText: "Copy failed." })
  ).toBeAttached();
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
    ["animated-toggle", "div.flex.items-center.gap-8"],
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
    await avatar
      .getByRole("button", { exact: true, name: "Edit Profile" })
      .click();
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

test("Logo Clouds retains original SVG brands and paused continuous strip", async ({
  page,
}) => {
  await page.goto("/");
  const strip = page.locator("[data-logo-strip]");
  await strip.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  for (const brand of ["Canva", "Strava", "Descript"]) {
    await expect(strip.locator(`[data-logo-name="${brand}"]`)).toHaveCount(2);
  }
  const track = strip.locator(".w-max");
  const x = () =>
    track.evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).m41);
  const before = await x();
  await expect.poll(x).toBeLessThan(before);
  await strip.hover();
  await page.waitForTimeout(50);
  const paused = await x();
  await page.waitForTimeout(300);
  expect(await x()).toBeCloseTo(paused, 1);
  await page.mouse.move(0, 0);
  await expect.poll(x).toBeLessThan(paused);
});

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

for (const reducedMotion of ["reduce", "no-preference"] as const) {
  test(`crafted bento controls respond with ${reducedMotion} motion`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion });
    await page.goto("/");
    const settings = page.locator("[data-react-settings]");
    await settings.scrollIntoViewIfNeeded();
    const toggle = settings.getByRole("switch", { name: "Activity updates" });
    await toggle.focus();
    await page.keyboard.press("Space");
    await expect(toggle).toHaveAttribute("aria-checked", "false");
    await expect(settings.getByText("Notifications are paused")).toBeVisible();
    const token = page.locator("[data-token-preview]");
    await token.getByRole("button", { exact: true, name: "round" }).click();
    await expect(token.getByText("border-radius: 28px")).toBeVisible();
    const sample = token.getByRole("button", {
      exact: true,
      name: "Select item",
    });
    await expect(sample).toHaveCSS("border-radius", "28px");
    await sample.click();
    await expect(
      token.getByRole("button", { exact: true, name: "Selected" })
    ).toHaveAttribute("aria-pressed", "true");
    const query = page.getByRole("group", { name: "Example search query" });
    await query
      .getByRole("button", { exact: true, name: "interaction" })
      .click();
    await expect(
      query.getByRole("button", { exact: true, name: "interaction" })
    ).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.getByText("animated-toggle", { exact: true })
    ).toBeVisible();
    for (const width of [390, 1440]) {
      await page.setViewportSize({ height: 900, width });
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth)
      ).toBeLessThanOrEqual(width);
    }
  });
}

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
      "The system behind design taste",
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
    await expect(heading).toHaveText(
      "React components.Thoughtfully in motion."
    );
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
      .locator("footer.bg-muted\\/60")
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
