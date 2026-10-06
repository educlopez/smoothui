import { expect, test } from "@playwright/test";

// Switching tabs must not move the tab list or anything around it. With a
// fading outgoing panel the old and new panels shared the flow for the whole
// fade, so the pair stacked, the block grew by a panel's height and the
// vertically centred list jumped.
test("switching tabs keeps the tab block in place", async ({ page }) => {
  await page.setViewportSize({ height: 500, width: 900 });
  await page.goto("/preview/tabs?embed=1");
  const list = page.getByRole("tablist");
  await expect(list).toBeVisible();
  await page.waitForTimeout(500);

  const tabs = page.getByRole("tab");
  const count = await tabs.count();
  expect(count).toBeGreaterThan(1);

  for (let index = 1; index < count; index += 1) {
    await page.evaluate(() => {
      const target = document.querySelector('[role="tablist"]');
      const root = target?.parentElement;
      const win = window as unknown as {
        __frames: number[][];
        __shift: number;
      };
      win.__frames = [];
      win.__shift = 0;
      new PerformanceObserver((entries) => {
        for (const entry of entries.getEntries()) {
          win.__shift += (entry as unknown as { value: number }).value;
        }
      }).observe({ type: "layout-shift" });
      const start = performance.now();
      const sample = () => {
        const box = root?.getBoundingClientRect();
        if (box) {
          win.__frames.push([box.top, box.height]);
        }
        if (performance.now() - start < 600) {
          requestAnimationFrame(sample);
        }
      };
      sample();
    });

    await tabs.nth(index).click();
    await page.waitForTimeout(800);

    const { frames, shift } = await page.evaluate(() => {
      const win = window as unknown as {
        __frames: number[][];
        __shift: number;
      };
      return { frames: win.__frames, shift: win.__shift };
    });

    const tops = frames.map(([top]) => top);
    const heights = frames.map(([, height]) => height);
    expect(Math.max(...tops) - Math.min(...tops)).toBeLessThan(0.5);
    expect(Math.max(...heights) - Math.min(...heights)).toBeLessThan(0.5);
    expect(shift).toBe(0);
    await expect(tabs.nth(index)).toHaveAttribute("aria-selected", "true");
  }
});
