import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "../../../test-utils/render";
import Drawer from "../index";

describe("Drawer uncontrolled", () => {
  it("opens from its trigger without an open prop and closes again", async () => {
    const user = userEvent.setup();
    render(
      <Drawer
        title="Settings"
        trigger={<button type="button">Open drawer</button>}
      >
        <p>Body</p>
      </Drawer>
    );
    expect(screen.queryByText("Settings")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Open drawer" }));
    expect(await screen.findByText("Settings")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByText("Settings")).toBeNull(), {
      timeout: 3000,
    });
  });

  it("starts open with defaultOpen", async () => {
    render(
      <Drawer defaultOpen title="Preset">
        <p>Body</p>
      </Drawer>
    );
    expect(await screen.findByText("Preset")).toBeInTheDocument();
  });

  it("still follows open when controlled", () => {
    const { rerender } = render(
      <Drawer open title="Controlled">
        <p>Body</p>
      </Drawer>
    );
    expect(screen.getByText("Controlled")).toBeInTheDocument();
    rerender(
      <Drawer open={false} title="Controlled">
        <p>Body</p>
      </Drawer>
    );
    expect(screen.queryByText("Controlled")).toBeNull();
  });
});
