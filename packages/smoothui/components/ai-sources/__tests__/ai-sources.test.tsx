import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import AISources, { type AISource } from "../index";

const SOURCES: AISource[] = [
  { id: "1", title: "One", url: "https://a.example/x" },
  { id: "2", title: "Two", url: "https://b.example/y" },
  { id: "3", title: "Three", url: "https://c.example/z" },
  { id: "4", title: "Four", url: "https://d.example/w" },
];

describe("AISources", () => {
  it("starts collapsed, because provenance should be available not loud", () => {
    render(<AISources sources={SOURCES} />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    expect(screen.queryByRole("link", { name: /One/ })).toBeNull();
  });

  it("shows an overflow count for sources beyond the stack", () => {
    render(<AISources sources={SOURCES} />);
    expect(screen.getByText("+1")).toBeInTheDocument();
  });

  it("omits the overflow chip when everything fits", () => {
    render(<AISources sources={SOURCES.slice(0, 2)} />);
    expect(screen.queryByText(/^\+/)).toBeNull();
  });

  it("expands into one link per source", () => {
    render(<AISources sources={SOURCES} />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getAllByRole("link")).toHaveLength(4);
  });

  it("opens sources safely in a new tab", () => {
    render(<AISources defaultOpen sources={SOURCES.slice(0, 1)} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });

  it("falls back to the host when there is no snippet", () => {
    render(<AISources defaultOpen sources={SOURCES.slice(0, 1)} />);
    expect(screen.getByText("a.example")).toBeInTheDocument();
  });
});
