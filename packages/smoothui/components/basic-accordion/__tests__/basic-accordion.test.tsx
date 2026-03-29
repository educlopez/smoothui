import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import BasicAccordion from "../index";

describe("BasicAccordion", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <BasicAccordion
        items={[
          { id: "1", title: "Section 1", content: "Content 1" },
          { id: "2", title: "Section 2", content: "Content 2" },
        ]}
      />
    );
    expect(container).toBeInTheDocument();
  });
});
