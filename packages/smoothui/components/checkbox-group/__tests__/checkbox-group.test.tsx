import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render, screen } from "../../../test-utils/render";
import {
  CheckboxGroup as RadixCheckboxGroup,
  CheckboxGroupItem as RadixCheckboxGroupItem,
} from "../checkbox-group.radix";
import { CheckboxGroup, CheckboxGroupItem } from "../index";

const FRUITS = ["fuji", "gala", "granny"];

describe("CheckboxGroup", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <CheckboxGroup allValues={FRUITS} aria-label="Apples" defaultValue={[]}>
        <CheckboxGroupItem parent>All apples</CheckboxGroupItem>
        <CheckboxGroupItem value="fuji">Fuji</CheckboxGroupItem>
        <CheckboxGroupItem value="gala">Gala</CheckboxGroupItem>
        <CheckboxGroupItem value="granny">Granny Smith</CheckboxGroupItem>
      </CheckboxGroup>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders labelled items", () => {
    render(
      <CheckboxGroup allValues={FRUITS} defaultValue={["fuji"]}>
        <CheckboxGroupItem parent>All apples</CheckboxGroupItem>
        <CheckboxGroupItem value="fuji">Fuji</CheckboxGroupItem>
      </CheckboxGroup>
    );
    expect(screen.getByText("All apples")).toBeInTheDocument();
    expect(screen.getByText("Fuji")).toBeInTheDocument();
  });
});

describe("CheckboxGroup (Radix-parity twin)", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <RadixCheckboxGroup
        allValues={FRUITS}
        aria-label="Apples"
        defaultValue={[]}
      >
        <RadixCheckboxGroupItem parent>All apples</RadixCheckboxGroupItem>
        <RadixCheckboxGroupItem value="fuji">Fuji</RadixCheckboxGroupItem>
      </RadixCheckboxGroup>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("parent toggles all values", async () => {
    const user = userEvent.setup();
    render(
      <RadixCheckboxGroup allValues={FRUITS} defaultValue={[]}>
        <RadixCheckboxGroupItem parent>All apples</RadixCheckboxGroupItem>
        <RadixCheckboxGroupItem value="fuji">Fuji</RadixCheckboxGroupItem>
        <RadixCheckboxGroupItem value="gala">Gala</RadixCheckboxGroupItem>
        <RadixCheckboxGroupItem value="granny">Granny</RadixCheckboxGroupItem>
      </RadixCheckboxGroup>
    );

    await user.click(screen.getByRole("checkbox", { name: "All apples" }));
    const boxes = screen.getAllByRole("checkbox");
    for (const box of boxes) {
      expect(box).toHaveAttribute("data-state", "checked");
    }
  });
});
