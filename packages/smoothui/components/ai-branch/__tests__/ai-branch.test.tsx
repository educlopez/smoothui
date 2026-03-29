import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import AiBranch from "../index";

describe("AiBranch", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <AiBranch
        branches={[
          {
            id: "1",
            userMessage: "Hello",
            aiResponse: "Hi there",
            timestamp: new Date(),
            isActive: true,
          },
        ]}
        onBranchSelect={() => {}}
      />
    );
    expect(container).toBeInTheDocument();
  });
});
