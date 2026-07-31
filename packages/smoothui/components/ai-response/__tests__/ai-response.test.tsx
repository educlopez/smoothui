import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import AIResponse from "../index";

const CITATIONS = [
  {
    id: "1",
    index: 1,
    title: "Attention Is All You Need",
    url: "https://a.example",
  },
  {
    id: "2",
    index: 2,
    title: "Efficient Transformers",
    url: "https://b.example",
  },
];

describe("AIResponse", () => {
  it("renders the text", () => {
    render(<AIResponse text="Hello there" />);
    expect(screen.getByText(/Hello/)).toBeInTheDocument();
  });

  it("turns [n] markers into links even when punctuation is glued on", () => {
    // "compute [1]," used to fail: the marker only matched a whole token.
    render(
      <AIResponse
        citations={CITATIONS}
        text="Scales with compute [1], though."
      />
    );
    const link = screen.getByRole("link", { name: "1" });
    expect(link).toHaveAttribute("href", "https://a.example");
    expect(link).toHaveAttribute("title", "Attention Is All You Need");
  });

  it("leaves markers as text when no citation matches", () => {
    const { container } = render(<AIResponse text="Unmatched [9] marker." />);
    expect(container.querySelectorAll("a")).toHaveLength(0);
    expect(container.textContent).toContain("[9]");
  });

  it("opens citations safely in a new tab", () => {
    render(<AIResponse citations={CITATIONS} text="See [2]." />);
    const link = screen.getByRole("link", { name: "2" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });

  it("keeps growing text in one paragraph", () => {
    const { container, rerender } = render(<AIResponse text="One" />);
    rerender(<AIResponse text="One two three" />);
    expect(container.querySelectorAll("p")).toHaveLength(1);
    expect(container.textContent).toContain("three");
  });
});
