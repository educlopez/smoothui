import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "../../../test-utils/render";
import GooeyPopover from "../index";

const mockMatchMedia = (matches: boolean) => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
};

/** jsdom never computes layout, so scrollHeight is always 0. Stub it so the
 * content-measurement effect reports a real height and the GSAP animation
 * branches (which only run once contentHeight > 0) actually execute. */
const mockScrollHeight = (height: number) => {
  Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
    configurable: true,
    value: height,
  });
};

describe("GooeyPopover", () => {
  afterEach(() => {
    mockMatchMedia(false);
  });

  it("renders without throwing", () => {
    const { container } = render(<GooeyPopover>Open</GooeyPopover>);
    expect(container).toBeInTheDocument();
  });

  it("opens the dialog on trigger click and shows children", async () => {
    const user = userEvent.setup();
    render(<GooeyPopover>Popover content</GooeyPopover>);

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText("Popover content")).toBeInTheDocument();
  });

  it("closes the dialog when the trigger is clicked again", async () => {
    const user = userEvent.setup();
    render(<GooeyPopover>Popover content</GooeyPopover>);

    const trigger = screen.getByRole("button");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("calls onOpenChange and supports controlled isOpen", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <GooeyPopover isOpen={false} onOpenChange={onOpenChange}>
        Content
      </GooeyPopover>
    );

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    expect(onOpenChange).toHaveBeenCalledWith(true);
    // Controlled: state does not flip on its own without the prop changing.
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    rerender(
      <GooeyPopover isOpen onOpenChange={onOpenChange}>
        Content
      </GooeyPopover>
    );
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("closes on outside click", async () => {
    const user = userEvent.setup();
    render(<GooeyPopover>Popover content</GooeyPopover>);

    const trigger = screen.getByRole("button");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.click(document.body);

    await waitFor(() =>
      expect(trigger).toHaveAttribute("aria-expanded", "false")
    );
  });

  it("closes on Escape key when open", async () => {
    const user = userEvent.setup();
    render(<GooeyPopover>Popover content</GooeyPopover>);

    const trigger = screen.getByRole("button");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    fireEvent.keyDown(window, { key: "Escape" });

    await waitFor(() =>
      expect(trigger).toHaveAttribute("aria-expanded", "false")
    );
  });

  it("does not render the goo filter layer when prefers-reduced-motion is set", async () => {
    mockMatchMedia(true);
    const user = userEvent.setup();
    render(<GooeyPopover>Reduced motion content</GooeyPopover>);

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    // The goo filter layer is skipped entirely in reduced-motion mode.
    expect(document.querySelector("[style*='url(#']")).not.toBeInTheDocument();
  });

  it("animates the content panel open with GSAP once its height is measured", async () => {
    mockScrollHeight(120);
    const user = userEvent.setup();
    render(<GooeyPopover contentWidth={240}>Popover content</GooeyPopover>);

    await user.click(screen.getByRole("button"));

    const dialog = screen.getByRole("dialog");
    await waitFor(() => expect(dialog).toHaveStyle({ width: "240px" }), {
      timeout: 2000,
    });
  });

  it("applies the reduced-motion end state instantly once measured", async () => {
    mockMatchMedia(true);
    mockScrollHeight(120);
    const user = userEvent.setup();
    render(<GooeyPopover contentWidth={240}>Popover content</GooeyPopover>);

    await user.click(screen.getByRole("button"));

    const dialog = screen.getByRole("dialog");
    await waitFor(() => expect(dialog).toHaveStyle({ width: "240px" }));

    await user.click(screen.getByRole("button"));
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );
  });

  it("renders a custom trigger node", () => {
    render(
      <GooeyPopover trigger={<span>Custom Trigger</span>}>Content</GooeyPopover>
    );

    expect(screen.getByText("Custom Trigger")).toBeInTheDocument();
  });
});
