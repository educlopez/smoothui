import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import TimeMachineStack, { type TimeMachineStackItem } from "../index";

const items: TimeMachineStackItem[] = [
  { content: <div>Panel one</div>, id: "1" },
  { content: <div>Panel two</div>, id: "2" },
];

describe("TimeMachineStack", () => {
  it("renders without throwing", () => {
    const { container } = render(<TimeMachineStack items={items} />);
    expect(container).toBeInTheDocument();
  });

  it("renders with a controlled index", () => {
    const { container } = render(<TimeMachineStack index={1} items={items} />);
    expect(container).toBeInTheDocument();
  });
});
