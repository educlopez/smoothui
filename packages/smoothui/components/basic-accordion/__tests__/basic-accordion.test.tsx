import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import BasicAccordion from "../index";

describe("BasicAccordion", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <BasicAccordion
        items={[
          { content: "Content 1", id: "1", title: "Section 1" },
          { content: "Content 2", id: "2", title: "Section 2" },
        ]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(
      <BasicAccordion
        items={[
          { content: "Content 1", id: "1", title: "Section 1" },
          { content: "Content 2", id: "2", title: "Section 2" },
        ]}
      />
    );
    expect(container).toBeInTheDocument();
  });
});
