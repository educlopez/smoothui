import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import CodeBlock from "../index";

describe("CodeBlock", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <CodeBlock code="const x = 1;" language="ts" />
    );
    expect(container).toBeInTheDocument();
  });

  it("renders with typing animation and highlighted lines", () => {
    const { container } = render(
      <CodeBlock
        code={"const x = 1;\nconst y = 2;"}
        highlightLines={[1]}
        language="tsx"
        typing
      />
    );
    expect(container).toBeInTheDocument();
  });
});
