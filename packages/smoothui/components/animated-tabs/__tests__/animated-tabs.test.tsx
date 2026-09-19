import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import AnimatedTabs from "../index";

describe("AnimatedTabs", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <AnimatedTabs
        tabs={[
          { id: "tab1", label: "Tab 1" },
          { id: "tab2", label: "Tab 2" },
        ]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

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
