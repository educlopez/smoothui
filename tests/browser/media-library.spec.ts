import { expect, test } from "@playwright/test";

test("curated collection contains 95 searchable assets", async ({ page }) => {
  await page.goto("/media");
  await expect(page.locator("[data-media-card]")).toHaveCount(95);
  await page.getByRole("button", { exact: true, name: "People" }).click();
  await expect(page.locator("[data-media-card]")).toHaveCount(50);
  await page.getByRole("button", { exact: true, name: "Backgrounds" }).click();
  await expect(page.locator("[data-media-card]")).toHaveCount(12);
  await page.getByRole("button", { exact: true, name: "All" }).click();
  await page
    .getByRole("searchbox", { name: "Search images" })
    .fill("amber-violet");
  await expect(page.locator("[data-media-card]")).toHaveCount(1);
});

test("preview supports keyboard, copy outcomes and focus restoration", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: (text: string) => {
          (window as unknown as { copied: string }).copied = text;
          return Promise.resolve();
        },
      },
    });
  });
  await page.goto("/media");
  const trigger = page.getByRole("button", {
    exact: true,
    name: "Preview amber-violet",
  });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { exact: true, name: "Copy URL" }).click();
  await expect(dialog.getByRole("status")).toHaveText("Source URL copied.");
  expect(
    await page.evaluate(() => (window as unknown as { copied: string }).copied)
  ).toContain("/scenes/amber-violet.webp");
  await page.evaluate(() => {
    navigator.clipboard.writeText = () => Promise.reject(new Error("Denied"));
  });
  await dialog
    .getByRole("button", { exact: true, name: "Copy reference" })
    .click();
  await expect(dialog.getByRole("status")).toContainText("Could not copy");
  await expect(
    dialog.getByRole("button", { exact: true, name: "Copy URL" })
  ).toBeEnabled();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

for (const width of [390, 1440]) {
  test(`gallery and original preview fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ height: 1000, width });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/media");
    const cards = page.locator("[data-media-card]");
    await expect(cards).toHaveCount(95);
    await expect(cards.first().locator("img")).toHaveJSProperty(
      "complete",
      true
    );
    expect(
      await cards
        .first()
        .locator("img")
        .evaluate((image) => (image as HTMLImageElement).naturalWidth)
    ).toBeGreaterThan(0);
    await page.screenshot({ path: `/tmp/smoothui-media-${width}.png` });
    await page
      .getByRole("button", { exact: true, name: "Preview amber-violet" })
      .click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.locator("img")).toHaveCSS("object-fit", "contain");
    await expect
      .poll(() =>
        dialog
          .locator("img")
          .evaluate((image) => (image as HTMLImageElement).naturalWidth)
      )
      .toBeGreaterThan(0);
    const box = await dialog.boundingBox();
    expect(box?.width).toBeLessThanOrEqual(width);
    await dialog.screenshot({
      path: `/tmp/smoothui-media-preview-${width}.png`,
    });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth)
    ).toBeLessThanOrEqual(width);
  });
}

test("approved backgrounds are separate from the remaining collection", async ({
  page,
}) => {
  await page.goto("/media");
  await page
    .getByRole("button", { exact: true, name: "Approved abstracts" })
    .click();
  await expect(page.locator("[data-media-card]")).toHaveCount(12);
  await expect
    .poll(() =>
      page
        .locator("[data-media-card] img")
        .evaluateAll((images) =>
          images.every((image) => (image as HTMLImageElement).naturalWidth > 0)
        )
    )
    .toBe(true);
  await page
    .getByRole("button", { exact: true, name: "Preview amber-violet" })
    .click();
  await expect(
    page.getByRole("dialog").getByRole("link", { exact: true, name: "dock" })
  ).toHaveAttribute("href", "/docs/components/dock");
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { exact: true, name: "People, animals & objects" })
    .click();
  await expect(page.locator("[data-media-card]")).toHaveCount(83);
});

test("people filters preserve catalog labels and animal separation", async ({
  page,
}) => {
  await page.goto("/media");
  await page.getByRole("button", { exact: true, name: "People" }).click();
  for (const [name, count] of [
    ["Women", 26],
    ["Men", 20],
    ["Nonbinary", 4],
    ["Unspecified", 0],
  ] as const) {
    await page.getByRole("button", { exact: true, name }).click();
    await expect(page.locator("[data-media-card]")).toHaveCount(count);
  }
  await page.getByRole("button", { exact: true, name: "Animals" }).click();
  await expect(page.locator("[data-media-card]")).toHaveCount(18);
  await page
    .getByRole("button", { exact: true, name: "Preview maple-golden" })
    .click();
  await expect(page.getByRole("dialog")).toContainText(
    "Generated dog portrait"
  );
});

for (const demo of [
  "card-swipe-deck",
  "cursor-follow",
  "interactive-image-selector",
  "photo-stack",
  "hover-expand",
  "hover-image-list",
  "time-machine-stack",
]) {
  test(`${demo} renders imported cast imagery`, async ({ page }) => {
    await page.goto(`/preview/${demo}`);
    if (demo === "hover-image-list") {
      await page.getByRole("link").first().hover();
    }
    const image = page.locator('img[src*="troupe-"]').first();
    await expect(image).toBeAttached();
    await expect
      .poll(() =>
        image.evaluate((node) => (node as HTMLImageElement).naturalWidth)
      )
      .toBeGreaterThan(0);
  });
}

for (const width of [390, 1440]) {
  test(`generated products render in square demos and gallery crops at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ height: 1000, width });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/preview/product-card");
    for (const name of ["Ivory runner", "Ivory headphones"]) {
      const image = page.getByRole("img", { exact: true, name });
      await expect(image).toBeVisible();
      await expect
        .poll(() =>
          image.evaluate((node) => (node as HTMLImageElement).naturalWidth)
        )
        .toBeGreaterThan(0);
    }
    await page.screenshot({ path: `/tmp/smoothui-products-demo-${width}.png` });
    await page.goto("/media");
    await page.getByRole("button", { exact: true, name: "Products" }).click();
    const cards = page.locator("[data-media-card]");
    await expect(cards).toHaveCount(2);
    await expect
      .poll(() =>
        cards
          .locator("img")
          .evaluateAll((images) =>
            images.every((node) => (node as HTMLImageElement).naturalWidth > 0)
          )
      )
      .toBe(true);
    await page.screenshot({
      path: `/tmp/smoothui-products-gallery-${width}.png`,
    });
    await page
      .getByRole("button", { exact: true, name: "Preview headphones" })
      .click();
    await expect(page.getByRole("dialog").locator("img")).toHaveAttribute(
      "src",
      "https://ik.imagekit.io/16u211libb/smoothui/products/ivory-headphones.webp"
    );
  });
}

for (const width of [390, 1440]) {
  test(`Nymara artwork stays complete and foil controls work at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ height: 1000, width });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/preview/holographic-foil");
    const image = page.locator('img[src*="/cards/nymara.webp"]');
    await expect(image).toBeVisible();
    await expect
      .poll(() =>
        image.evaluate((node) => (node as HTMLImageElement).naturalWidth)
      )
      .toBeGreaterThan(0);
    await expect(image).toHaveCSS("object-fit", "contain");
    const bounds = await image.boundingBox();
    expect((bounds?.width ?? 0) / (bounds?.height ?? 1)).toBeCloseTo(
      896 / 1200,
      2
    );
    for (const name of [
      "Subtle",
      "Full holo",
      "Standard",
      "aurora",
      "gold",
      "oil",
      "prism",
    ]) {
      const control = page.getByRole("button", { exact: true, name });
      await control.click();
      await expect(control).toHaveAttribute("aria-pressed", "true");
    }
    await page.screenshot({ path: `/tmp/smoothui-nymara-foil-${width}.png` });
    await page.goto("/media");
    await page.getByRole("button", { exact: true, name: "Card art" }).click();
    await expect(page.locator("[data-media-card]")).toHaveCount(1);
    const thumbnail = page.locator("[data-media-card] img");
    await expect(thumbnail).toHaveCSS("object-fit", "contain");
    await expect
      .poll(() =>
        thumbnail.evaluate((node) => (node as HTMLImageElement).naturalWidth)
      )
      .toBeGreaterThan(0);
    await page.screenshot({
      path: `/tmp/smoothui-nymara-gallery-${width}.png`,
    });
    await page
      .getByRole("button", { exact: true, name: "Preview nymara" })
      .click();
    await expect(page.getByRole("dialog")).toContainText(
      "Nymara — Eclipse Guardian"
    );
    await expect(page.getByRole("dialog").locator("img")).toHaveCSS(
      "object-fit",
      "contain"
    );
  });
}
