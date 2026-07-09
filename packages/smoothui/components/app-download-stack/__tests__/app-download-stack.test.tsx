import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "../../../test-utils/render";
import AppDownloadStack from "../index";

const apps = [
  { id: 1, name: "GitHub", icon: "https://example.com/github.png" },
  { id: 2, name: "Figma", icon: "https://example.com/figma.png" },
];

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
    const user = userEvent.setup();
    const onDownload = vi.fn();
    render(<AppDownloadStack apps={apps} onDownload={onDownload} />);

    await user.click(
      screen.getByRole("button", { name: "Expand app selection" })
    );
    await user.click(screen.getByRole("button", { name: /GitHub/ }));
    await user.click(screen.getByRole("button", { name: "Download Selected" }));

    expect(onDownload).toHaveBeenCalledWith([1]);
    await waitFor(() =>
      expect(screen.getByText("Downloading...")).toBeInTheDocument()
    );

    await waitFor(
      () => expect(screen.getByText("Download Complete!")).toBeInTheDocument(),
      { timeout: 4000 }
    );

    await waitFor(
      () =>
        expect(
          screen.getByRole("button", { name: "Expand app selection" })
        ).toBeInTheDocument(),
      { timeout: 2000 }
    );
  }, 10_000);

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
