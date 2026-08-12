import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import Breadcrumb from "../index";

describe("Breadcrumb", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <Breadcrumb
        items={[
          { href: "/", label: "Home" },
          { href: "/docs", label: "Docs" },
          { label: "Current" },
        ]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(
      <Breadcrumb
        items={[
          { href: "/", label: "Home" },
          { href: "/docs", label: "Docs" },
          { label: "Current" },
        ]}
      />
    );
    expect(container).toBeInTheDocument();
  });
});
