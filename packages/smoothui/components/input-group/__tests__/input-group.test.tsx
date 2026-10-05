import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render, screen } from "../../../test-utils/render";
import Input from "../../input";
import InputGroup, { InputGroupAddon, InputGroupText } from "../index";

describe("InputGroup", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>$</InputGroupText>
        </InputGroupAddon>
        <Input aria-label="Amount" placeholder="0.00" />
      </InputGroup>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("composes addon and input", () => {
    render(
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <Input aria-label="URL" />
        <InputGroupAddon align="end">
          <InputGroupText>.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    );
    expect(screen.getByRole("textbox", { name: "URL" })).toBeInTheDocument();
    expect(screen.getByText("https://")).toBeInTheDocument();
  });
});
