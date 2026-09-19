import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import AISuggestions from "../index";

const SUGGESTIONS = [
  { id: "a", label: "First" },
  { id: "b", label: "Second" },
  { id: "c", label: "Third" },
];

describe("AISuggestions", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <AISuggestions label="Follow-ups" suggestions={SUGGESTIONS} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders one button per suggestion inside a list", () => {
    const { container } = render(<AISuggestions suggestions={SUGGESTIONS} />);
    expect(container.querySelectorAll("li")).toHaveLength(3);
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });

  it("hands the whole suggestion back on select", () => {
    const onSelect = vi.fn();
    render(<AISuggestions onSelect={onSelect} suggestions={SUGGESTIONS} />);
    fireEvent.click(screen.getByRole("button", { name: "Second" }));
    expect(onSelect).toHaveBeenCalledWith(SUGGESTIONS[1]);
  });

  it("renders an optional label", () => {
    render(<AISuggestions label="Follow-ups" suggestions={SUGGESTIONS} />);
    expect(screen.getByText("Follow-ups")).toBeInTheDocument();
  });

  it("renders nothing but the list when empty", () => {
    const { container } = render(<AISuggestions suggestions={[]} />);
    expect(container.querySelectorAll("li")).toHaveLength(0);
  });
});
