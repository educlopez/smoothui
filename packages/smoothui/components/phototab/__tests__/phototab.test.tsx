import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import Phototab from "../index";

describe("Phototab", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <Phototab
        tabs={[
          { name: "Tab 1", icon: <span>icon</span>, image: "/test.jpg" },
        ]}
      />
    );
    expect(container).toBeInTheDocument();
  });
});
