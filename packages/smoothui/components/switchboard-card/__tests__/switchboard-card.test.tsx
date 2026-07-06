import { act, fireEvent } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "../../../test-utils/render";
import SwitchboardCard from "../index";

describe("SwitchboardCard", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <SwitchboardCard subtitle="Subtitle" title="Test" />
    );
    expect(container).toBeInTheDocument();
  });

  it("renders title and subtitle text", () => {
    const { getByText } = render(
      <SwitchboardCard subtitle="My subtitle" title="My title" />
    );
    expect(getByText("My title")).toBeInTheDocument();
    expect(getByText("My subtitle")).toBeInTheDocument();
  });

  it("lights up cells from a flat grid pattern", () => {
    const { container } = render(
      <SwitchboardCard
        columns={3}
        gridPattern={[1, 0, 0, 0, 1, 0]}
        rows={2}
        subtitle="Subtitle"
        title="Test"
      />
    );
    const highLights = container.querySelectorAll('[data-state="high"]');
    expect(highLights).toHaveLength(2);
  });

  it("lights up cells from a 2D grid pattern", () => {
    const { container } = render(
      <SwitchboardCard
        columns={2}
        gridPattern={[
          [1, 0],
          [0, 1],
        ]}
        rows={2}
        subtitle="Subtitle"
        title="Test"
      />
    );
    const highLights = container.querySelectorAll('[data-state="high"]');
    expect(highLights).toHaveLength(2);
  });

  it("renders as a link when href is provided", () => {
    const { getByRole } = render(
      <SwitchboardCard href="/next" subtitle="Subtitle" title="Test" />
    );
    const link = getByRole("link", { name: "Test" });
    expect(link).toHaveAttribute("href", "/next");
  });

  it("renders as a button and calls onButtonClick when clicked", () => {
    const onButtonClick = vi.fn();
    const { getByRole } = render(
      <SwitchboardCard
        onButtonClick={onButtonClick}
        subtitle="Subtitle"
        title="Test"
      />
    );
    const button = getByRole("button", { name: "Test" });
    fireEvent.click(button);
    expect(onButtonClick).toHaveBeenCalledTimes(1);
  });

  it("applies the next variant styling", () => {
    const { container } = render(
      <SwitchboardCard subtitle="Subtitle" title="Test" variant="next" />
    );
    expect(container.querySelector('[data-variant="next"]')).not.toBeNull();
  });

  describe("randomLights animation", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.spyOn(Math, "random").mockReturnValue(0);
    });

    afterEach(() => {
      vi.useRealTimers();
      vi.restoreAllMocks();
    });

    it("animates lights over time when randomLights is enabled", () => {
      const { container } = render(
        <SwitchboardCard
          columns={4}
          randomLights
          rows={2}
          subtitle="Subtitle"
          title="Test"
        />
      );

      const offLights = container.querySelectorAll('[data-state="off"]');
      expect(offLights.length).toBe(8);

      fireEvent.click(container); // no-op interaction, ensures no crash before timers
      act(() => {
        vi.advanceTimersByTime(200);
      });

      const mediumLights = container.querySelectorAll('[data-state="medium"]');
      expect(mediumLights.length).toBeGreaterThan(0);
    });
  });
});
