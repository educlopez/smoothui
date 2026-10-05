import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render, screen } from "../../../test-utils/render";
import CodeBlock from "../index";

describe("CodeBlock scroll region", () => {
  it("makes the horizontal scroll container focusable and named", async () => {
    const { container } = render(
      <CodeBlock code="const x = 1;" filename="app.ts" language="ts" />
    );
    const region = screen.getByRole("region", { name: "app.ts code" });
    expect(region.getAttribute("tabindex")).toBe("0");
    expect(region.querySelector("pre")).not.toBeNull();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("falls back to the language when there is no filename", () => {
    render(<CodeBlock code="const x = 1;" language="ts" />);
    expect(screen.getByRole("region", { name: "ts code" })).toBeInTheDocument();
  });

  it("is also a region when only the height is capped", async () => {
    const { container } = render(
      <CodeBlock code="const x = 1;" language="ts" maxHeight={120} wrap />
    );
    const region = screen.getByRole("region", { name: "ts code" });
    expect(region.getAttribute("tabindex")).toBe("0");
    expect(await axe(container)).toHaveNoViolations();
  });

  it("is not a tab stop when nothing can scroll", () => {
    render(<CodeBlock code="const x = 1;" language="ts" wrap />);
    expect(screen.queryByRole("region")).toBeNull();
  });
});
