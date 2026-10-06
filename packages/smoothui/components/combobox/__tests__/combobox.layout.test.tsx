import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it } from "vitest";
import { render, screen } from "../../../test-utils/render";
import Combobox from "../index";

beforeAll(() => {
  // cmdk scrolls the selected item into view; jsdom does not implement it.
  Element.prototype.scrollIntoView = () => undefined;
});

const HEIGHT_TOKEN = /^h-\S+$/;

const heightTokens = (el: Element) =>
  el.className.split(" ").filter((token) => HEIGHT_TOKEN.test(token));

describe("Combobox search row layout", () => {
  it("gives the wrapper and the input the same height token", async () => {
    const user = userEvent.setup();
    render(
      <Combobox
        aria-label="Pick"
        options={[{ label: "Option A", value: "a" }]}
      />
    );
    await user.click(screen.getByRole("combobox", { name: "Pick" }));
    const wrapper = document.querySelector(
      '[data-slot="command-input-wrapper"]'
    );
    const input = document.querySelector('[data-slot="command-input"]');
    expect(wrapper).not.toBeNull();
    expect(input).not.toBeNull();
    const wrapperHeights = heightTokens(wrapper as Element);
    expect(wrapperHeights.length).toBe(1);
    expect(heightTokens(input as Element)).toEqual(wrapperHeights);
  });
});
