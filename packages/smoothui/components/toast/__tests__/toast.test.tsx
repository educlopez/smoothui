import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { act, render, screen } from "../../../test-utils/render";
import Toaster, { toast, useToastManager } from "../index";

const NO_REGION = { rules: { region: { enabled: false } } };

const Trigger = () => {
  const manager = useToastManager();
  return (
    <button
      onClick={() =>
        manager.add({
          description: "Your changes are live.",
          timeout: 0,
          title: "Saved",
        })
      }
      type="button"
    >
      Add toast
    </button>
  );
};

describe("Toast", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <Toaster>
        <button type="button">Hello</button>
      </Toaster>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(<Toaster />);
    expect(container).toBeInTheDocument();
  });

  it("shows a toast added via useToastManager", async () => {
    const user = userEvent.setup();
    render(
      <Toaster>
        <Trigger />
      </Toaster>
    );
    await user.click(screen.getByRole("button", { name: "Add toast" }));
    expect(await screen.findByText("Saved")).toBeInTheDocument();
    expect(screen.getByText("Your changes are live.")).toBeInTheDocument();
  });

  it("shows toasts from the imperative toast() helper and passes axe", async () => {
    const { baseElement } = render(<Toaster />);
    act(() => {
      toast({ timeout: 0, title: "Imperative", type: "success" });
    });
    expect(await screen.findByText("Imperative")).toBeInTheDocument();
    const results = await axe(baseElement, NO_REGION);
    expect(results).toHaveNoViolations();
  });
});
