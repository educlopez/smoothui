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

  it("stays focusable without becoming a landmark when there is no filename", () => {
    const { container } = render(
      <CodeBlock code="const x = 1;" language="ts" />
    );
    expect(screen.queryByRole("region")).toBeNull();
    const scroller = container.querySelector("[tabindex='0']");
    expect(scroller).not.toBeNull();
    expect(scroller?.querySelector("pre")).not.toBeNull();
  });

  it("gives two blocks on a page distinct landmark names", async () => {
    const { container } = render(
      <>
        <CodeBlock code="a" filename="a.ts" language="ts" />
        <CodeBlock code="b" filename="b.ts" language="ts" />
        <CodeBlock code="c" language="ts" />
        <CodeBlock code="d" language="ts" />
      </>
    );
    const names = screen
      .getAllByRole("region")
      .map((el) => el.getAttribute("aria-label"));
    expect(names).toEqual(["a.ts code", "b.ts code"]);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("is also a region when only the height is capped", async () => {
    const { container } = render(
      <CodeBlock
        code="const x = 1;"
        filename="cap.ts"
        language="ts"
        maxHeight={120}
        wrap
      />
    );
    const region = screen.getByRole("region", { name: "cap.ts code" });
    expect(region.getAttribute("tabindex")).toBe("0");
    expect(await axe(container)).toHaveNoViolations();
  });

  it("is not a tab stop when nothing can scroll", () => {
    render(<CodeBlock code="const x = 1;" language="ts" wrap />);
    expect(screen.queryByRole("region")).toBeNull();
  });
});
