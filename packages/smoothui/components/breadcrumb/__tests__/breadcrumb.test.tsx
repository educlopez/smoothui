import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import Breadcrumb from "../index";

describe("Breadcrumb", () => {
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
