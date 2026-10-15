import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { render, screen } from "../../../test-utils/render";
import ScrollArea from "../index";
import RadixScrollArea from "../scroll-area.radix";

const LONG_TEXT = Array.from({ length: 12 }, (_, i) => `Line ${i + 1}`).join(
  "\n"
);

beforeEach(() => {
  // Base UI ScrollArea viewport probes Web Animations; jsdom lacks it.
  Element.prototype.getAnimations = vi.fn(() => []);
});

afterEach(() => {
  // biome-ignore lint/performance/noDelete: restore jsdom default
  delete (Element.prototype as { getAnimations?: unknown }).getAnimations;
});

describe("ScrollArea", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <ScrollArea className="h-32 w-48">
        <p>{LONG_TEXT}</p>
      </ScrollArea>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders children inside the content slot", () => {
    render(
      <ScrollArea className="h-32 w-48">
        <p>Scrollable copy</p>
      </ScrollArea>
    );
    expect(screen.getByText("Scrollable copy")).toBeInTheDocument();
    expect(
      document.querySelector("[data-slot='scroll-area']")
    ).toBeInTheDocument();
  });
});

describe("ScrollArea (Radix twin)", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <RadixScrollArea className="h-32 w-48">
        <p>{LONG_TEXT}</p>
      </RadixScrollArea>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders children", () => {
    render(
      <RadixScrollArea className="h-32 w-48" vertical>
        <p>Radix scroll</p>
      </RadixScrollArea>
    );
    expect(screen.getByText("Radix scroll")).toBeInTheDocument();
  });
});
