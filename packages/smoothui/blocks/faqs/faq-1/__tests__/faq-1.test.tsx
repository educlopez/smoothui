import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render, screen } from "../../../../test-utils/render";
import Block from "../index";

const INSTALL_ANSWER = /You can install Smoothui using npm or yarn/;
const INSTALL_QUESTION = /How do I install Smoothui/;

describe("Faq1", () => {
  it("renders without throwing", () => {
    const { container } = render(<Block />);
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Block />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("keeps answers visible without a collapsible trigger", () => {
    render(<Block />);
    expect(screen.getByText(INSTALL_ANSWER)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: INSTALL_QUESTION })
    ).not.toBeInTheDocument();
  });
});
