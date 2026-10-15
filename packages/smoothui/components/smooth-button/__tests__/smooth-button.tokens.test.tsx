import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import SmoothButtonBase from "../smooth-button.base";
import SmoothButtonRadix from "../smooth-button.radix";

const twins = [
  ["Base", SmoothButtonBase],
  ["Radix", SmoothButtonRadix],
] as const;

const VARIANTS = [
  "default",
  "secondary",
  "destructive",
  "solid",
  "soft",
  "outline",
  "ghost",
  "link",
  "candy",
] as const;
const COLORS = [
  "accent",
  "neutral",
  "destructive",
  "blue",
  "amber",
  "green",
] as const;

const HEX = /#[0-9a-fA-F]{3,8}/;
const RGBA = /rgba?\(/;
const WHITE = /-white\b/;

const classesOf = (element: HTMLElement): string => element.className;

describe.each(twins)("SmoothButton %s tokens", (_name, SmoothButton) => {
  it("renders the destructive variant from tokens, not literals", () => {
    const { getByRole } = render(
      <SmoothButton variant="destructive">Delete</SmoothButton>
    );
    const classes = classesOf(getByRole("button"));
    // Reference first: the tokenised classes must exist.
    expect(classes).toContain("from-destructive-top");
    expect(classes).toContain("text-destructive-fg");
    expect(classes).toContain("var(--color-destructive-edge)");
    expect(classes).toContain("var(--color-btn-drop)");
    expect(classes).toContain("var(--color-btn-sheen)");
  });

  it("renders the candy variant edge from the on-brand token", () => {
    const { getByRole } = render(
      <SmoothButton variant="candy">Go</SmoothButton>
    );
    const classes = classesOf(getByRole("button"));
    expect(classes).toContain("border-on-brand/25");
    expect(classes).toContain("var(--color-on-brand)");
  });

  it.each(COLORS)("the %s color axis carries no literal colour", (color) => {
    const { getByRole } = render(
      <SmoothButton color={color} variant="solid">
        Go
      </SmoothButton>
    );
    expect(classesOf(getByRole("button"))).toContain("[--btn-fg:var(");
  });

  it("uses the on-brand and destructive foreground tokens for the fg axis", () => {
    const accent = render(
      <SmoothButton color="accent" variant="solid">
        A
      </SmoothButton>
    );
    expect(
      classesOf(accent.container.querySelector("button") as HTMLElement)
    ).toContain("[--btn-fg:var(--color-on-brand)]");
    const destructive = render(
      <SmoothButton color="destructive" variant="solid">
        D
      </SmoothButton>
    );
    const classes = classesOf(
      destructive.container.querySelector("button") as HTMLElement
    );
    expect(classes).toContain("[--btn-fg:var(--color-destructive-fg)]");
    expect(classes).toContain("[--btn-hover:var(--color-destructive-hover)]");
  });

  it.each(VARIANTS)(
    "the %s variant has no hex, rgba or -white token (with and without colour)",
    (variant) => {
      for (const color of [undefined, ...COLORS]) {
        const { getByRole, unmount } = render(
          <SmoothButton color={color} variant={variant}>
            Go
          </SmoothButton>
        );
        const classes = classesOf(getByRole("button"));
        expect(classes).not.toMatch(HEX);
        expect(classes).not.toMatch(RGBA);
        expect(classes).not.toMatch(WHITE);
        unmount();
      }
    }
  );
});
