import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import AnimatedTabs from "../index";

describe("AnimatedTabs", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <AnimatedTabs
        tabs={[
          { id: "tab1", label: "Tab 1" },
          { id: "tab2", label: "Tab 2" },
        ]}
      />
    );
    expect(container).toBeInTheDocument();
  });
});
