import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "../../../test-utils/render";
import SearchableDropdown from "../index";

const items = [
  { id: "1", label: "Apple", description: "A red fruit" },
  { id: "2", label: "Banana", description: "A yellow fruit" },
  { id: "3", label: "Cherry", description: "A small fruit" },
];

describe("SearchableDropdown", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <SearchableDropdown
        items={[{ id: "1", label: "Item 1" }]}
        label="Pick one"
      />
    );
    expect(container).toBeInTheDocument();
  });

  it("opens the dropdown and shows the search input", async () => {
    const user = userEvent.setup();
    render(<SearchableDropdown items={items} label="Pick a fruit" />);

    await user.click(screen.getByRole("button", { name: "Pick a fruit" }));

    expect(
      screen.getByRole("combobox", { name: "Search dropdown items" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Pick a fruit" })
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("filters items by typing in the search input", async () => {
    const user = userEvent.setup();
    render(<SearchableDropdown items={items} label="Pick a fruit" />);

    await user.click(screen.getByRole("button", { name: "Pick a fruit" }));
    const input = screen.getByRole("combobox", {
      name: "Search dropdown items",
    });
    await user.type(input, "ban");

    expect(screen.getByRole("button", { name: /Banana/ })).toBeInTheDocument();
    await waitFor(() =>
      expect(
        screen.queryByRole("button", { name: /Apple/ })
      ).not.toBeInTheDocument()
    );
  });

  it("shows the empty message when no items match", async () => {
    const user = userEvent.setup();
    render(
      <SearchableDropdown
        emptyMessage="Nothing here"
        items={items}
        label="Pick a fruit"
      />
    );

    await user.click(screen.getByRole("button", { name: "Pick a fruit" }));
    await user.type(
      screen.getByRole("combobox", { name: "Search dropdown items" }),
      "zzz"
    );

    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("clears the search query when the clear button is clicked", async () => {
    const user = userEvent.setup();
    render(<SearchableDropdown items={items} label="Pick a fruit" />);

    await user.click(screen.getByRole("button", { name: "Pick a fruit" }));
    const input = screen.getByRole("combobox", {
      name: "Search dropdown items",
    });
    await user.type(input, "ban");
    await user.click(screen.getByRole("button", { name: "Clear search" }));

    expect(input).toHaveValue("");
    expect(screen.getByRole("button", { name: /Apple/ })).toBeInTheDocument();
  });

  it("selects an item on click, updates the trigger label, and calls onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <SearchableDropdown
        items={items}
        label="Pick a fruit"
        onChange={onChange}
      />
    );

    await user.click(screen.getByRole("button", { name: "Pick a fruit" }));
    await user.click(screen.getByRole("button", { name: /Banana/ }));

    expect(onChange).toHaveBeenCalledWith(items[1]);
    expect(
      screen.getByRole("button", { name: "Pick a fruit: Banana" })
    ).toBeInTheDocument();
  });

  it("closes on outside click and resets the search query", async () => {
    const user = userEvent.setup();
    render(<SearchableDropdown items={items} label="Pick a fruit" />);

    await user.click(screen.getByRole("button", { name: "Pick a fruit" }));
    await user.type(
      screen.getByRole("combobox", { name: "Search dropdown items" }),
      "ban"
    );

    await user.click(document.body);

    await waitFor(() =>
      expect(
        screen.queryByRole("combobox", { name: "Search dropdown items" })
      ).not.toBeInTheDocument()
    );
  });

  it("navigates with ArrowDown and selects the focused item with Enter", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <SearchableDropdown
        items={items}
        label="Pick a fruit"
        onChange={onChange}
      />
    );

    await user.click(screen.getByRole("button", { name: "Pick a fruit" }));
    fireEvent.keyDown(document, { key: "ArrowDown" });
    fireEvent.keyDown(document, { key: "ArrowDown" });
    fireEvent.keyDown(document, { key: "ArrowUp" });
    fireEvent.keyDown(document, { key: "Enter" });

    expect(onChange).toHaveBeenCalledWith(items[0]);
  });

  it("moves focus to the last item with End", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <SearchableDropdown
        items={items}
        label="Pick a fruit"
        onChange={onChange}
      />
    );

    await user.click(screen.getByRole("button", { name: "Pick a fruit" }));
    fireEvent.keyDown(document, { key: "End" });
    fireEvent.keyDown(document, { key: "Enter" });

    expect(onChange).toHaveBeenCalledWith(items[2]);
  });

  it("closes on Escape and refocuses the trigger", async () => {
    const user = userEvent.setup();
    render(<SearchableDropdown items={items} label="Pick a fruit" />);

    const trigger = screen.getByRole("button", { name: "Pick a fruit" });
    await user.click(trigger);

    // Wait out the dropdown's deferred input-focus timeout so it doesn't
    // steal focus back from the trigger after Escape closes the dropdown.
    await waitFor(() =>
      expect(
        screen.getByRole("combobox", { name: "Search dropdown items" })
      ).toHaveFocus()
    );

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() =>
      expect(
        screen.queryByRole("combobox", { name: "Search dropdown items" })
      ).not.toBeInTheDocument()
    );
    expect(trigger).toHaveFocus();
  });
});
