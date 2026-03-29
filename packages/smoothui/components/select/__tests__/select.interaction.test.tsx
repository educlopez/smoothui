import { describe, expect, it, vi } from "vitest";
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
        options={options}
        placeholder="Pick a fruit"
        aria-label="Fruit select"
      />,
    );

    expect(screen.getByText("Pick a fruit")).toBeInTheDocument();
  });

  it("renders trigger as a combobox", () => {
    render(
      <Select
        options={options}
        aria-label="Fruit select"
      />,
    );

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("shows selected value text", () => {
    render(
      <Select
        options={options}
        value="cherry"
        aria-label="Fruit select"
      />,
    );

    expect(screen.getByText("Cherry")).toBeInTheDocument();
  });

  it("disables the trigger when disabled prop is set", () => {
    render(
      <Select
        options={options}
        disabled
        aria-label="Fruit select"
      />,
    );

    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("sets aria-label on the trigger", () => {
    render(
      <Select
        options={options}
        aria-label="Choose fruit"
      />,
    );

    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-label",
      "Choose fruit",
    );
  });

  it("sets aria-expanded to false when closed", () => {
    render(
      <Select
        options={options}
        aria-label="Closed select"
      />,
    );

    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  // Note: Radix Select dropdown open/select tests are skipped in jsdom
  // because the content renders in a portal and requires pointer events
  // that jsdom cannot simulate. These behaviors are better tested in e2e.
});
