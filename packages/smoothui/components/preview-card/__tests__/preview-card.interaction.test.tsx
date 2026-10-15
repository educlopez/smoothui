import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "../../../test-utils/render";
import PreviewCard from "../index";

describe("PreviewCard interactions", () => {
  it("opens on hover and calls onOpenChange", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <PreviewCard
        delay={0}
        onOpenChange={onOpenChange}
        trigger={<a href="/profile">@smoothui</a>}
      >
        <p>Profile details</p>
      </PreviewCard>
    );

    expect(screen.queryByText("Profile details")).toBeNull();
    await user.hover(screen.getByRole("link", { name: "@smoothui" }));

    expect(await screen.findByText("Profile details")).toBeInTheDocument();
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("opens on keyboard focus", async () => {
    const user = userEvent.setup();
    render(
      <PreviewCard delay={0} trigger={<a href="/profile">@smoothui</a>}>
        <p>Profile details</p>
      </PreviewCard>
    );

    await user.tab();
    await waitFor(() =>
      expect(screen.getByText("Profile details")).toBeInTheDocument()
    );
  });
});
