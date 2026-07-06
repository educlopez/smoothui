import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "../../../test-utils/render";
import Select from "../index";

const options = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

const groups = [
  {
    label: "Citrus",
    options: [
      { value: "lemon", label: "Lemon" },
      { value: "lime", label: "Lime" },
    ],
  },
  {
    label: "Berries",
    options: [{ value: "grape", label: "Grape", disabled: true }],
  },
];

describe("Select interactions", () => {
  it("renders with placeholder text", () => {
    render(
      <Select
        aria-label="Fruit select"
        options={options}
        placeholder="Pick a fruit"
      />
    );

    expect(screen.getByText("Pick a fruit")).toBeInTheDocument();
  });

  it("renders trigger as a combobox", () => {
    render(<Select aria-label="Fruit select" options={options} />);

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("shows selected value text", () => {
    render(
      <Select aria-label="Fruit select" options={options} value="cherry" />
    );

    expect(screen.getByText("Cherry")).toBeInTheDocument();
  });

  it("disables the trigger when disabled prop is set", () => {
    render(<Select aria-label="Fruit select" disabled options={options} />);

    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("sets aria-label on the trigger", () => {
    render(<Select aria-label="Choose fruit" options={options} />);

    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-label",
      "Choose fruit"
    );
  });

  it("sets aria-expanded to false when closed", () => {
    render(<Select aria-label="Closed select" options={options} />);

    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });

  it("opens the listbox on trigger click", async () => {
    const user = userEvent.setup();
    render(<Select aria-label="Fruit select" options={options} />);

    await user.click(screen.getByRole("combobox"));

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });

  it("does not open when disabled", async () => {
    const user = userEvent.setup();
    render(<Select aria-label="Fruit select" disabled options={options} />);

    await user.click(screen.getByRole("combobox"));

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("selects an option on click, updates label, and calls onValueChange", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Select
        aria-label="Fruit select"
        onValueChange={onValueChange}
        options={options}
      />
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "Banana" }));

    expect(onValueChange).toHaveBeenCalledWith("banana");
    expect(screen.getByRole("combobox")).toHaveTextContent("Banana");
    await waitFor(() =>
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
    );
  });

  it("does not select a disabled option", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Select
        aria-label="Fruit select"
        groups={groups}
        onValueChange={onValueChange}
      />
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "Grape" }));

    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("renders grouped options and selects from a group", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Select
        aria-label="Fruit select"
        groups={groups}
        onValueChange={onValueChange}
      />
    );

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByText("Citrus")).toBeInTheDocument();
    expect(screen.getByText("Berries")).toBeInTheDocument();

    await user.click(screen.getByRole("option", { name: "Lime" }));
    expect(onValueChange).toHaveBeenCalledWith("lime");
  });

  it("does not update displayed label when controlled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Select
        aria-label="Fruit select"
        onValueChange={onValueChange}
        options={options}
        value="apple"
      />
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "Cherry" }));

    expect(onValueChange).toHaveBeenCalledWith("cherry");
    expect(screen.getByRole("combobox")).toHaveTextContent("Apple");
  });

  it("closes the listbox on outside click", async () => {
    const user = userEvent.setup();
    render(<Select aria-label="Fruit select" options={options} />);

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.click(document.body);
    await waitFor(() =>
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
    );
  });

  it("opens on Enter when trigger is focused", () => {
    render(<Select aria-label="Fruit select" options={options} />);

    const trigger = screen.getByRole("combobox");
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "Enter" });

    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("navigates with ArrowDown/ArrowUp and selects the focused option with Enter", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Select
        aria-label="Fruit select"
        onValueChange={onValueChange}
        options={options}
      />
    );

    await user.click(screen.getByRole("combobox"));
    fireEvent.keyDown(document, { key: "ArrowDown" });
    fireEvent.keyDown(document, { key: "ArrowDown" });
    fireEvent.keyDown(document, { key: "ArrowUp" });
    fireEvent.keyDown(document, { key: "Enter" });

    expect(onValueChange).toHaveBeenCalledWith("apple");
  });

  it("moves focus to first/last option with Home/End", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Select
        aria-label="Fruit select"
        onValueChange={onValueChange}
        options={options}
      />
    );

    await user.click(screen.getByRole("combobox"));
    fireEvent.keyDown(document, { key: "End" });
    fireEvent.keyDown(document, { key: "Enter" });

    expect(onValueChange).toHaveBeenCalledWith("cherry");
  });

  it("closes the listbox on Escape and refocuses the trigger", async () => {
    const user = userEvent.setup();
    render(<Select aria-label="Fruit select" options={options} />);

    const trigger = screen.getByRole("combobox");
    await user.click(trigger);
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() =>
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
    );
    expect(trigger).toHaveFocus();
  });
});
