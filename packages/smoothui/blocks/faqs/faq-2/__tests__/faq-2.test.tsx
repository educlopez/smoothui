import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render, screen } from "../../../../test-utils/render";
import Block from "../index";

describe("Faq2", () => {
  it("renders without throwing", () => {
    const { container } = render(<Block />);
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Block />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has a single tab stop per question", async () => {
    const user = userEvent.setup();
    render(<Block />);

    const questions = screen.getAllByRole("button");
    expect(questions.length).toBeGreaterThan(1);

    await user.tab();
    expect(questions[0]).toHaveFocus();

    await user.tab();
    expect(questions[1]).toHaveFocus();
  });
});
