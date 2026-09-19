import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import AIArtifact from "../index";

describe("AIArtifact", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <AIArtifact code="source" preview={<p>rendered</p>} title="utils.ts" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("names the artifact", () => {
    render(<AIArtifact preview={<p>rendered</p>} title="utils.ts" />);
    expect(screen.getByText("utils.ts")).toBeInTheDocument();
  });

  it("renders only the tabs it has content for", () => {
    render(<AIArtifact preview={<p>rendered</p>} title="t" />);
    expect(screen.queryAllByRole("tab")).toHaveLength(0);
  });

  it("shows both tabs when both panes exist", () => {
    render(<AIArtifact code="source" preview={<p>rendered</p>} title="t" />);
    expect(screen.getAllByRole("tab")).toHaveLength(2);
  });

  it("marks the active tab with aria-selected", () => {
    render(<AIArtifact code="source" preview={<p>rendered</p>} title="t" />);
    expect(screen.getByRole("tab", { name: "preview" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("swaps panes on tab press", () => {
    render(<AIArtifact code="source" preview={<p>rendered</p>} title="t" />);
    fireEvent.click(screen.getByRole("tab", { name: "code" }));
    expect(screen.getByRole("tab", { name: "code" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("hides the copy action without copyText", () => {
    render(<AIArtifact preview={<p>rendered</p>} title="t" />);
    expect(screen.queryByRole("button", { name: "Copy" })).toBeNull();
  });

  it("honours defaultPane", () => {
    render(
      <AIArtifact
        code="source"
        defaultPane="code"
        preview={<p>rendered</p>}
        title="t"
      />
    );
    expect(screen.getByRole("tab", { name: "code" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });
});
