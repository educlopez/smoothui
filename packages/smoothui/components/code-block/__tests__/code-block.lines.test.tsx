import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import CodeBlock from "../index";

const lineElements = (container: HTMLElement) =>
  Array.from(container.querySelectorAll("pre code > div"));

describe("CodeBlock lines", () => {
  it("lets every line span the widest content when scrolling", () => {
    const { container } = render(
      <CodeBlock
        code={
          "const short = 1;\nconst aVeryLongLineThatForcesHorizontalScrolling = 2;"
        }
        highlightLines={[1]}
        language="ts"
      />
    );
    const lines = lineElements(container);
    expect(lines.length).toBe(2);
    for (const line of lines) {
      expect(line.classList.contains("min-w-full")).toBe(true);
      expect(line.classList.contains("w-max")).toBe(true);
    }
  });

  it("keeps lines at container width when wrapping", () => {
    const { container } = render(
      <CodeBlock code="const x = 1;" language="ts" wrap />
    );
    for (const line of lineElements(container)) {
      expect(line.classList.contains("w-max")).toBe(false);
    }
  });
});
