import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it } from "vitest";
import { render, screen } from "../../../test-utils/render";
import Combobox from "../index";

beforeAll(() => {
  // cmdk scrolls the selected item into view; jsdom does not implement it.
  Element.prototype.scrollIntoView = () => undefined;
});

const OPTIONS = [
  { label: "Option A", value: "a" },
  { label: "Option B", value: "b" },
];

describe("Combobox uncontrolled", () => {
  it("shows the chosen label without a value prop", async () => {
    const user = userEvent.setup();
    render(<Combobox aria-label="Pick" options={OPTIONS} />);
    const trigger = screen.getByRole("combobox", { name: "Pick" });
    expect(trigger.textContent).toContain("Select an option");
    await user.click(trigger);
    await user.click(await screen.findByText("Option B"));
    expect(
      screen.getByRole("combobox", { name: "Pick" }).textContent
    ).toContain("Option B");
  });

  it("preselects defaultValue", () => {
    render(<Combobox aria-label="Pick" defaultValue="a" options={OPTIONS} />);
    expect(
      screen.getByRole("combobox", { name: "Pick" }).textContent
    ).toContain("Option A");
  });

  it("lets a controlled value win over the internal state", async () => {
    const user = userEvent.setup();
    render(<Combobox aria-label="Pick" options={OPTIONS} value="a" />);
    const trigger = screen.getByRole("combobox", { name: "Pick" });
    await user.click(trigger);
    await user.click(await screen.findByText("Option B"));
    expect(
      screen.getByRole("combobox", { name: "Pick" }).textContent
    ).toContain("Option A");
  });
});
