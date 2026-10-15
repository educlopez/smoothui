import { describe, expect, it } from "vitest";
import { render, screen } from "../../../test-utils/render";
import NumberField from "../number-field.radix";

const WHITESPACE = /\s+/;

describe("NumberField (Radix) native spinners", () => {
  it("resets the native spin buttons on the input", () => {
    render(<NumberField defaultValue={3} label="Seats" />);
    const input = screen.getByLabelText("Seats");
    expect(input.getAttribute("type")).toBe("number");
    const classes = input.className.split(WHITESPACE);
    expect(classes).toContain("[appearance:textfield]");
    expect(classes).toContain("[&::-webkit-inner-spin-button]:appearance-none");
    expect(classes).toContain("[&::-webkit-outer-spin-button]:appearance-none");
  });
});
