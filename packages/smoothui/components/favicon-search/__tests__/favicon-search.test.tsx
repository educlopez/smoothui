import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "../../../test-utils/render";
import FaviconSearch, { type FaviconSearchResult } from "../index";

const results: FaviconSearchResult[] = [
  {
    description: "Deploy web apps",
    id: "1",
    title: "Vercel",
    url: "https://vercel.com",
  },
  {
    id: "2",
    title: "Versent",
    url: "https://versent.com.au",
  },
];

describe("FaviconSearch", () => {
  it("renders without throwing", () => {
    const { container } = render(<FaviconSearch results={results} />);
    expect(container).toBeInTheDocument();
  });
});

describe("FaviconSearch interactions", () => {
  it("opens the panel and highlights the typed substring, forwarding onValueChange", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<FaviconSearch onValueChange={onValueChange} results={results} />);
    const input = screen.getByRole("combobox");

    await user.type(input, "Ver");

    expect(onValueChange).toHaveBeenLastCalledWith("Ver");
    expect(input).toHaveAttribute("aria-expanded", "true");
    const marks = document.querySelectorAll("mark");
    expect(marks.length).toBeGreaterThan(0);
    for (const mark of marks) {
      expect(mark).toHaveTextContent("Ver");
    }
  });

  it("moves aria-activedescendant through the options with Arrow Down/Up", async () => {
    const user = userEvent.setup();
    render(<FaviconSearch results={results} />);
    const input = screen.getByRole("combobox");

    await user.click(input);
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(2);

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input).toHaveAttribute("aria-activedescendant", options[0].id);
    expect(options[0]).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input).toHaveAttribute("aria-activedescendant", options[1].id);

    // Wraps back to the first option.
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input).toHaveAttribute("aria-activedescendant", options[0].id);

    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(input).toHaveAttribute("aria-activedescendant", options[1].id);
  });

  it("selects the highlighted option on Enter and closes the panel", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<FaviconSearch onSelect={onSelect} results={results} />);
    const input = screen.getByRole("combobox");

    await user.click(input);
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onSelect).toHaveBeenCalledWith(results[0]);
    expect(input).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the panel on Escape", async () => {
    const user = userEvent.setup();
    render(<FaviconSearch results={results} />);
    const input = screen.getByRole("combobox");

    await user.click(input);
    expect(input).toHaveAttribute("aria-expanded", "true");

    fireEvent.keyDown(input, { key: "Escape" });
    expect(input).toHaveAttribute("aria-expanded", "false");
  });

  it("falls back to a monogram tile when the favicon image fails to load", async () => {
    const user = userEvent.setup();
    render(
      <FaviconSearch
        results={[{ id: "z", title: "Zephyr", url: "https://zephyr.dev" }]}
      />
    );
    const input = screen.getByRole("combobox");

    await user.click(input);
    const img = document.querySelector("img");
    expect(img).toBeTruthy();

    if (img) {
      fireEvent.error(img);
    }

    expect(document.querySelector("img")).toBeNull();
    expect(screen.getByText("Z")).toBeInTheDocument();
  });

  it("renders the empty message when there are no results", async () => {
    const user = userEvent.setup();
    render(
      <FaviconSearch emptyMessage="Nothing here" results={[]} value="xyz" />
    );
    const input = screen.getByRole("combobox");

    await user.click(input);

    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });
});
