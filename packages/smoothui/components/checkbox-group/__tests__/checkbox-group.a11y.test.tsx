import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render, screen } from "../../../test-utils/render";
import {
  CheckboxGroup as RadixCheckboxGroup,
  CheckboxGroupItem as RadixCheckboxGroupItem,
} from "../checkbox-group.radix";
import { CheckboxGroup, CheckboxGroupItem } from "../index";

const FRUITS = ["fuji", "gala"];
const STATE_TEXT = /^(Checked|Indeterminate)$/;

describe.each([
  ["Base", CheckboxGroup, CheckboxGroupItem],
  ["Radix", RadixCheckboxGroup, RadixCheckboxGroupItem],
] as const)("CheckboxGroup (%s) a11y", (_name, Group, Item) => {
  it("exposes no SVG title and keeps accessible names clean", async () => {
    const { container } = render(
      <Group allValues={FRUITS} aria-label="Apples" defaultValue={["fuji"]}>
        <Item parent>All apples</Item>
        <Item value="fuji">Fuji</Item>
        <Item value="gala">Gala</Item>
      </Group>
    );
    expect(container.querySelector("svg title")).toBeNull();
    for (const svg of container.querySelectorAll("svg")) {
      expect(svg.getAttribute("aria-hidden")).toBe("true");
    }
    expect(screen.getByRole("checkbox", { name: "Fuji" })).toBeInTheDocument();
    expect(screen.queryByText(STATE_TEXT)).toBeNull();
    expect(await axe(container)).toHaveNoViolations();
  });
});
