import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render, screen } from "../../../test-utils/render";
import {
  CollapsiblePanel,
  CollapsibleRoot,
  CollapsibleTrigger,
} from "../index";

describe("Collapsible", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <CollapsibleRoot defaultOpen>
        <CollapsibleTrigger>Details</CollapsibleTrigger>
        <CollapsiblePanel>
          <div className="px-3 py-2">Hidden until closed</div>
        </CollapsiblePanel>
      </CollapsibleRoot>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    render(
      <CollapsibleRoot>
        <CollapsibleTrigger>More</CollapsibleTrigger>
        <CollapsiblePanel>
          <div>Content</div>
        </CollapsiblePanel>
      </CollapsibleRoot>
    );
    expect(screen.getByRole("button", { name: /More/i })).toBeInTheDocument();
  });
});
