import { readFileSync } from "node:fs";
import path from "node:path";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { render, screen } from "../../../test-utils/render";
import Select from "../index";

const MIN_TEXT_CONTRAST = 4.5;
const THEME_CSS = path.resolve(
  import.meta.dirname,
  "../../../../../apps/docs/app/smoothui.css"
);

const BRAND_FILL = /text-white|bg-accent/;
const OKLCH_VALUE = /oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/;

/** Body of the first top-level rule that starts with `selector {`. */
const ruleBody = (css: string, selector: string): string => {
  const start = css.indexOf(`\n${selector} {`);
  if (start === -1) {
    throw new Error(`rule ${selector} not found`);
  }
  return css.slice(start, css.indexOf("\n}", start));
};

/** Relative luminance of an achromatic oklch token: Y equals L cubed. */
const neutralLuminance = (body: string, token: string): number => {
  const line = body
    .split("\n")
    .find((entry) => entry.trim().startsWith(`${token}:`));
  const match = line?.match(OKLCH_VALUE);
  if (!match) {
    throw new Error(`token ${token} is not a plain oklch value`);
  }
  const [, lightness, chroma] = match;
  if (Number(chroma) !== 0) {
    throw new Error(`token ${token} is not achromatic`);
  }
  return Number(lightness) ** 3;
};

const contrast = (a: number, b: number): number => {
  const [light, dark] = a > b ? [a, b] : [b, a];
  return (light + 0.05) / (dark + 0.05);
};

describe("Select option highlight contrast", () => {
  it("uses a neutral highlight instead of brand pink with white text", async () => {
    const user = userEvent.setup();
    render(
      <Select
        aria-label="Fruit"
        options={[
          { label: "Apple", value: "apple" },
          { label: "Banana", value: "banana" },
        ]}
      />
    );
    await user.click(screen.getByRole("combobox", { name: "Fruit" }));
    await user.keyboard("{ArrowDown}");
    const options = screen.getAllByRole("option");
    expect(options.length).toBe(2);
    for (const option of options) {
      expect(option.className).not.toMatch(BRAND_FILL);
    }
    expect(options[0]?.classList.contains("bg-muted")).toBe(true);
    expect(options[0]?.classList.contains("text-foreground")).toBe(true);
    expect(options[1]?.classList.contains("hover:bg-muted")).toBe(true);
  });

  it.each([
    [":root", "light"],
    [".dark", "dark"],
  ])("foreground on muted reaches 4.5:1 in %s (%s)", (selector) => {
    const css = readFileSync(THEME_CSS, "utf8");
    const body = ruleBody(css, selector);
    const ratio = contrast(
      neutralLuminance(body, "--color-foreground"),
      neutralLuminance(body, "--color-muted")
    );
    expect(ratio).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST);
  });
});
