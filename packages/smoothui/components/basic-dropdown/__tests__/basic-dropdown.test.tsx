import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "../../../test-utils/render";
import BasicDropdown from "../index";

const items = [
  { id: "1", label: "Option 1" },
  { id: "2", label: "Option 2" },
  { id: "3", label: "Option 3" },
];

describe("BasicDropdown", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <BasicDropdown items={items} label="Select option" />
    );
    expect(container).toBeInTheDocument();
  });

  it("opens the dropdown list on trigger click", async () => {
    const user = userEvent.setup();
    render(<BasicDropdown items={items} label="Select option" />);

    const trigger = screen.getByRole("button", { name: "Select option" });
    await user.click(trigger);

    expect(
      screen.getByRole("list", { name: "Dropdown options" })
    ).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("selects an item on click, updates the trigger label, and calls onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <BasicDropdown items={items} label="Select option" onChange={onChange} />
    );

    await user.click(screen.getByRole("button", { name: "Select option" }));
    await user.click(screen.getByRole("button", { name: "Option 2" }));

    expect(onChange).toHaveBeenCalledWith(items[1]);
    expect(
      screen.getByRole("button", { name: "Select option: Option 2" })
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(
        screen.queryByRole("list", { name: "Dropdown options" })
      ).not.toBeInTheDocument()
    );
  });

  it("closes the dropdown on outside click", async () => {
    const user = userEvent.setup();
    render(<BasicDropdown items={items} label="Select option" />);

    await user.click(screen.getByRole("button", { name: "Select option" }));
    expect(
      screen.getByRole("list", { name: "Dropdown options" })
    ).toBeInTheDocument();

    await user.click(document.body);

    await waitFor(() =>
      expect(
        screen.queryByRole("list", { name: "Dropdown options" })
      ).not.toBeInTheDocument()
    );
  });

  it("opens on Enter when the trigger is focused", () => {
    render(<BasicDropdown items={items} label="Select option" />);

    const trigger = screen.getByRole("button", { name: "Select option" });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "Enter" });

    expect(
      screen.getByRole("list", { name: "Dropdown options" })
    ).toBeInTheDocument();
  });

  it("navigates with ArrowDown/ArrowUp and selects the focused item with Enter", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <BasicDropdown items={items} label="Select option" onChange={onChange} />
    );

    await user.click(screen.getByRole("button", { name: "Select option" }));
    fireEvent.keyDown(document, { key: "ArrowDown" });
    fireEvent.keyDown(document, { key: "ArrowDown" });
    fireEvent.keyDown(document, { key: "ArrowUp" });
    fireEvent.keyDown(document, { key: "Enter" });

    expect(onChange).toHaveBeenCalledWith(items[0]);
  });

  it("moves focus to first/last item with Home/End", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <BasicDropdown items={items} label="Select option" onChange={onChange} />
    );

    await user.click(screen.getByRole("button", { name: "Select option" }));
    fireEvent.keyDown(document, { key: "End" });
    fireEvent.keyDown(document, { key: "Enter" });

    expect(onChange).toHaveBeenCalledWith(items[2]);
  });

  it("closes on Escape and refocuses the trigger", async () => {
    const user = userEvent.setup();
    render(<BasicDropdown items={items} label="Select option" />);

    const trigger = screen.getByRole("button", { name: "Select option" });
    await user.click(trigger);

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() =>
      expect(
        screen.queryByRole("list", { name: "Dropdown options" })
      ).not.toBeInTheDocument()
    );
    expect(trigger).toHaveFocus();
  });
});
