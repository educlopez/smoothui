import { describe, expect, it, vi } from "vitest";
import { render, screen } from "../../../test-utils/render";
import userEvent from "@testing-library/user-event";
import Drawer from "../index";

describe("Drawer interactions", () => {
  it("renders trigger and opens on click", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Drawer
        title="Test Drawer"
        trigger={<button type="button">Open Drawer</button>}
        onOpenChange={onOpenChange}
      >
        <p>Drawer content</p>
      </Drawer>,
    );

    const trigger = screen.getByRole("button", { name: "Open Drawer" });
    await user.click(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("renders title and description when open", () => {
    render(
      <Drawer open title="Drawer Title" description="Drawer Description">
        <p>Content</p>
      </Drawer>,
    );

    expect(screen.getByText("Drawer Title")).toBeInTheDocument();
    expect(screen.getByText("Drawer Description")).toBeInTheDocument();
  });

  it("renders footer content when open", () => {
    render(
      <Drawer open title="Test" footer={<button type="button">Submit</button>}>
        <p>Content</p>
      </Drawer>,
    );

    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("renders children content", () => {
    render(
      <Drawer open title="Test">
        <p>Inner content here</p>
      </Drawer>,
    );

    expect(screen.getByText("Inner content here")).toBeInTheDocument();
  });
});
