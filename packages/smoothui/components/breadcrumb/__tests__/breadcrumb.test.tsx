import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import Breadcrumb from "../index";

describe("Breadcrumb", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Docs", href: "/docs" },
          { label: "Current" },
        ]}
      />
    );
    expect(container).toBeInTheDocument();
  });
});
