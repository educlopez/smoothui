import { expect, test } from "@playwright/test";

for (const width of [390, 1440]) {
  test(`landing uses approved decorative backgrounds at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ height: 1000, width });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    for (const [surface, id] of [
      ["features", "coral-cyan"],
      ["ai", "fuchsia-cobalt"],
      ["uicraft", "cobalt-pink"],
    ] as const) {
      const image = page.locator(`[data-landing-background="${surface}"]`);
      await image.scrollIntoViewIfNeeded();
      await expect(image).toHaveAttribute(
        "src",
        `https://ik.imagekit.io/16u211libb/smoothui/scenes/${id}.webp?tr=w-1280,f-auto`
      );
      await expect(image).toHaveAttribute("alt", "");
      await expect(image).toHaveAttribute("aria-hidden", "true");
      await expect
        .poll(() =>
          image.evaluate((node) => (node as HTMLImageElement).naturalWidth)
        )
        .toBeGreaterThan(0);
      await image
        .locator(surface === "uicraft" ? ".." : "../..")
        .screenshot({ path: `/tmp/smoothui-landing-${surface}-${width}.png` });
    }
    // Copy lives on an opaque neutral caption, separate from undimmed artwork.
    const contrasts = await page
      .locator("[data-lead-caption], [data-uicraft-copy]")
      .evaluateAll((copies) =>
        copies.map((copy) => {
          const canvas = document.createElement("canvas");
          canvas.width = 1;
          canvas.height = 1;
          const context = canvas.getContext("2d");
          const description = copy.querySelector("p");
          if (!(context && description)) {
            throw new Error("Missing contrast measurement context");
          }
          const luminance = (channels: Uint8ClampedArray) => {
            const linear = Array.from(channels.slice(0, 3), (channel) => {
              const value = channel / 255;
              return value <= 0.040_45
                ? value / 12.92
                : ((value + 0.055) / 1.055) ** 2.4;
            });
            return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
          };
          context.fillStyle = "white";
          context.fillRect(0, 0, 1, 1);
          context.fillStyle = getComputedStyle(copy).backgroundColor;
          context.fillRect(0, 0, 1, 1);
          const background = luminance(context.getImageData(0, 0, 1, 1).data);
          context.fillStyle = getComputedStyle(description).color;
          context.fillRect(0, 0, 1, 1);
          const foreground = luminance(context.getImageData(0, 0, 1, 1).data);
          return (
            (Math.max(foreground, background) + 0.05) /
            (Math.min(foreground, background) + 0.05)
          );
        })
      );
    expect(contrasts).toHaveLength(3);
    for (const contrast of contrasts) {
      expect(contrast).toBeGreaterThanOrEqual(4.5);
    }
    const testimonial = page
      .locator('[data-landing-background="testimonials"]:visible')
      .first();
    await testimonial.scrollIntoViewIfNeeded();
    await expect(testimonial).toHaveAttribute(
      "src",
      "https://ik.imagekit.io/16u211libb/smoothui/scenes/violet-tangerine.webp?tr=w-800,f-auto"
    );
    await expect
      .poll(() =>
        testimonial.evaluate((node) => (node as HTMLImageElement).naturalWidth)
      )
      .toBeGreaterThan(0);
    await testimonial.locator("..").screenshot({
      path: `/tmp/smoothui-landing-testimonial-first-${width}.png`,
    });
    await page
      .getByRole("button", { exact: true, name: "Next testimonials" })
      .click();
    await expect(testimonial).toHaveAttribute(
      "src",
      "https://ik.imagekit.io/16u211libb/smoothui/scenes/teal-apricot.webp?tr=w-800,f-auto"
    );
    await expect
      .poll(() =>
        testimonial.evaluate((node) => (node as HTMLImageElement).naturalWidth)
      )
      .toBeGreaterThan(0);
    await testimonial.locator("..").screenshot({
      path: `/tmp/smoothui-landing-testimonial-second-${width}.png`,
    });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth)
    ).toBeLessThanOrEqual(width);
  });
}
