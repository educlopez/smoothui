import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "../../../test-utils/render";
import AppDownloadStack from "../index";

const apps = [
  { icon: "https://example.com/github.png", id: 1, name: "GitHub" },
  { icon: "https://example.com/figma.png", id: 2, name: "Figma" },
];

/** The component's own `setTimeout` gates, mirrored so the clock can skip them. */
const DOWNLOAD_DURATION_MS = 3000;
const RESET_DELAY_MS = 1000;

/** Upper bound on how many real frames a Motion transition is given to finish. */
const MAX_TRANSITION_FRAMES = 120;

/** Skips one of the component's faked `setTimeout` gates. */
const skipGate = (ms: number) => {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
};

const nextFrame = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });

/**
 * Waits on the animation frameloop rather than on `setTimeout`.
 *
 * `waitFor` polls with `setTimeout`, and RTL only advances a faked clock for
 * that poll when `jest` is a global — under Vitest it is not, so any `waitFor`
 * in a fake-timer test hangs until the suite kills it. Motion drives its
 * transitions off `requestAnimationFrame`, which is left real here, so stepping
 * frames waits for exactly the thing that has to happen and nothing else.
 */
const waitForElement = async (query: () => HTMLElement | null) => {
  for (let frame = 0; frame < MAX_TRANSITION_FRAMES; frame++) {
    const found = query();
    if (found) {
      return found;
    }
    await act(async () => {
      await nextFrame();
    });
  }
  throw new Error(
    `Element never appeared within ${MAX_TRANSITION_FRAMES} animation frames`
  );
};

/** Fully controlled wrapper mirroring real-world usage of selectedApps + onChange. */
const ControlledStack = ({
  onChangeSpy,
}: {
  onChangeSpy: (ids: number[]) => void;
}) => {
  const [selected, setSelected] = useState<number[]>([]);
  return (
    <AppDownloadStack
      apps={apps}
      isExpanded
      onChange={(ids: number[]) => {
        setSelected(ids);
        onChangeSpy(ids);
      }}
      selectedApps={selected}
    />
  );
};

describe("AppDownloadStack", () => {
  it("renders without throwing", () => {
    const { container } = render(<AppDownloadStack />);
    expect(container).toBeInTheDocument();
  });

  it("expands the app selector on trigger click", async () => {
    const user = userEvent.setup();
    render(<AppDownloadStack apps={apps} title="My Apps" />);

    await user.click(
      screen.getByRole("button", { name: "Expand app selection" })
    );

    expect(screen.getByText("My Apps")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /GitHub/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Figma/ })).toBeInTheDocument();
  });

  it("collapses the selector when the header is clicked again", async () => {
    const user = userEvent.setup();
    render(<AppDownloadStack apps={apps} title="My Apps" />);

    await user.click(
      screen.getByRole("button", { name: "Expand app selection" })
    );
    await user.click(screen.getByText("My Apps"));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Expand app selection" })
      ).toBeInTheDocument()
    );
  });

  it("toggles app selection cumulatively and calls onChange", async () => {
    const user = userEvent.setup();
    const onChangeSpy = vi.fn();
    render(<ControlledStack onChangeSpy={onChangeSpy} />);

    await user.click(screen.getByRole("button", { name: /GitHub/ }));
    expect(onChangeSpy).toHaveBeenLastCalledWith([1]);

    await user.click(screen.getByRole("button", { name: /Figma/ }));
    expect(onChangeSpy).toHaveBeenLastCalledWith([1, 2]);

    await user.click(screen.getByRole("button", { name: /GitHub/ }));
    expect(onChangeSpy).toHaveBeenLastCalledWith([2]);
  });

  it("disables the download button until an app is selected", async () => {
    const user = userEvent.setup();
    render(<AppDownloadStack apps={apps} />);

    await user.click(
      screen.getByRole("button", { name: "Expand app selection" })
    );

    expect(
      screen.getByRole("button", { name: "Download Selected" })
    ).toBeDisabled();

    await user.click(screen.getByRole("button", { name: /GitHub/ }));

    expect(
      screen.getByRole("button", { name: "Download Selected" })
    ).toBeEnabled();
  });

  it("runs the full download flow and calls onDownload, resetting after completion", async () => {
    // This test used to sleep through the flow in real time. The component gates
    // itself on two `setTimeout`s — 3000ms of simulated downloading, then 1000ms
    // before it resets — so `waitFor` spent four wall-clock seconds polling for
    // state that only a clock could produce. That is 80% of the default 5s
    // budget spent idle, which is why it needed a hand-written 10s timeout and
    // still sat one slow CI runner away from failing.
    //
    // Only `setTimeout` is faked. Motion's transitions stay on the real
    // frameloop, so the `AnimatePresence mode="wait"` handoffs between the three
    // labels play exactly as they did before — they were never the expensive
    // part, and driving them off a faked `requestAnimationFrame` proved brittle.
    // What is skipped is only the dead time between them.
    vi.useFakeTimers({ toFake: ["clearTimeout", "setTimeout"] });

    try {
      const onDownload = vi.fn();
      render(<AppDownloadStack apps={apps} onDownload={onDownload} />);

      // `fireEvent`, not `userEvent`, only because of the fake clock: RTL's
      // async wrapper drains its microtask queue behind a `setTimeout(0)` that
      // it only advances when `jest` is a global, so under Vitest's fake timers
      // every `await user.click(...)` deadlocks. These are plain button clicks
      // with no pointer sequence worth simulating, so nothing is lost — the
      // `userEvent` paths through this component are covered by the tests above.
      fireEvent.click(
        screen.getByRole("button", { name: "Expand app selection" })
      );
      await waitForElement(() =>
        screen.queryByRole("button", { name: /GitHub/ })
      );

      fireEvent.click(screen.getByRole("button", { name: /GitHub/ }));
      fireEvent.click(
        screen.getByRole("button", { name: "Download Selected" })
      );

      expect(onDownload).toHaveBeenCalledWith([1]);
      expect(
        await waitForElement(() => screen.queryByText("Downloading..."))
      ).toBeInTheDocument();

      // Past the download timeout the complete label takes over...
      skipGate(DOWNLOAD_DURATION_MS);
      expect(
        await waitForElement(() => screen.queryByText("Download Complete!"))
      ).toBeInTheDocument();

      // ...and past the reset delay the whole thing collapses back to its
      // trigger.
      skipGate(RESET_DELAY_MS);
      expect(
        await waitForElement(() =>
          screen.queryByRole("button", { name: "Expand app selection" })
        )
      ).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("supports controlled selectedApps and isExpanded", () => {
    const noSelection: number[] = [];
    render(
      <AppDownloadStack
        apps={apps}
        isExpanded
        onChange={vi.fn()}
        selectedApps={noSelection}
      />
    );

    expect(screen.getByRole("button", { name: /GitHub/ })).toBeInTheDocument();
    // Controlled + expanded: renders the selector panel directly, no toggle needed.
    expect(
      screen.getByRole("button", { name: "Download Selected" })
    ).toBeDisabled();
  });
});
