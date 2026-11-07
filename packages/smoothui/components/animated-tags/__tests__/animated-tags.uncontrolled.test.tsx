import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "../../../test-utils/render";
import AnimatedTags from "../index";

// Passing only `onChange` (to listen, not to control) used to freeze the
// component: the handler replaced the internal state update instead of
// running alongside it.
const SELECTED_AREA = ".rounded-xl";

const isSelected = (tag: string): boolean =>
  screen.getByText(tag).closest(SELECTED_AREA) !== null;

describe("AnimatedTags with a listener but no controlled value", () => {
  it("still updates its own selection and reports it", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<AnimatedTags initialTags={["react"]} onChange={onChange} />);

    expect(isSelected("react")).toBe(false);

    await user.click(screen.getByText("react"));

    expect(onChange).toHaveBeenCalledWith(["react"]);
    expect(isSelected("react")).toBe(true);
  });

  it("leaves the selection to the parent when controlled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <AnimatedTags
        initialTags={["react"]}
        onChange={onChange}
        selectedTags={[]}
      />
    );

    await user.click(screen.getByText("react"));

    expect(onChange).toHaveBeenCalledWith(["react"]);
    expect(isSelected("react")).toBe(false);
  });
});
