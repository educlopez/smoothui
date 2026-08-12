import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import Dock from "../index";

describe("Dock", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <Dock
        items={[
          { icon: <span>A</span>, id: "one", label: "One" },
          { active: true, icon: <span>B</span>, id: "two", label: "Two" },
          { icon: <span>C</span>, id: "three", label: "Three" },
        ]}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it("renders vertically with labels shown", () => {
    const { container } = render(
      <Dock
        items={[
          { icon: <span>A</span>, id: "one", label: "One" },
          { icon: <span>B</span>, id: "two", label: "Two" },
        ]}
        orientation="vertical"
        showLabels
      />
    );
    expect(container).toBeInTheDocument();
  });
});
