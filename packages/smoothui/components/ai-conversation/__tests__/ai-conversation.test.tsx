import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import AIConversation from "../index";

describe("AIConversation", () => {
  it("renders its children", () => {
    const { container } = render(
      <AIConversation>
        <p>message</p>
      </AIConversation>
    );
    expect(container.textContent).toContain("message");
  });

  it("starts pinned, so no jump-to-latest pill is offered", () => {
    const { container } = render(
      <AIConversation>
        <p>message</p>
      </AIConversation>
    );
    expect(container.querySelector('[aria-label="Jump to latest"]')).toBeNull();
  });

  it("contains its own overscroll so the page behind never moves", () => {
    const { container } = render(
      <AIConversation>
        <p>message</p>
      </AIConversation>
    );
    const viewport = container.querySelector(".overflow-y-auto");
    expect(viewport?.className).toContain("overscroll-contain");
  });

  it("survives a growing contentKey", () => {
    const { container, rerender } = render(
      <AIConversation contentKey={1}>
        <p>a</p>
      </AIConversation>
    );
    rerender(
      <AIConversation contentKey={2}>
        <p>a</p>
        <p>b</p>
      </AIConversation>
    );
    expect(container.textContent).toContain("b");
  });
});
