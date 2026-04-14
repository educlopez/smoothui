import { describe, expect, it } from "vitest";
import { render, screen } from "../../../test-utils/render";
import Select from "../index";

const options = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
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

  // Note: Radix Select dropdown open/select tests are skipped in jsdom
  // because the content renders in a portal and requires pointer events
  // that jsdom cannot simulate. These behaviors are better tested in e2e.
});
