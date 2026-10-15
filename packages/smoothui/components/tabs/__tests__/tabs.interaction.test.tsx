import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "../../../test-utils/render";
import {
  TabsIndicator,
  TabsList,
  TabsPanel,
  TabsRoot,
  TabsTab,
} from "../index";
import { composeIndicatorStyle } from "../use-active-tab-indicator";

describe("Tabs interactions", () => {
  it("switches panel on tab click", async () => {
    const user = userEvent.setup();

    render(
      <TabsRoot defaultValue="a">
        <TabsList variant="pill">
          <TabsTab value="a">Account</TabsTab>
          <TabsTab value="b">Billing</TabsTab>
          <TabsIndicator />
        </TabsList>
        <TabsPanel value="a">Account content</TabsPanel>
        <TabsPanel value="b">Billing content</TabsPanel>
      </TabsRoot>
    );

    expect(screen.getByText("Account content")).toBeVisible();
    await user.click(screen.getByRole("tab", { name: "Billing" }));
    expect(screen.getByText("Billing content")).toBeVisible();
  });

  it("measures the indicator when a value is selected after starting with none", async () => {
    const user = userEvent.setup();

    const Harness = () => {
      const [value, setValue] = useState<string | null>(null);
      return (
        <TabsRoot onValueChange={setValue} value={value}>
          <TabsList>
            <TabsTab value="a">One</TabsTab>
            <TabsIndicator data-testid="indicator" />
          </TabsList>
          <TabsPanel value="a">Content</TabsPanel>
        </TabsRoot>
      );
    };

    render(<Harness />);
    expect(screen.queryByTestId("indicator")).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "One" }));
    const indicator = await screen.findByTestId("indicator");
    await waitFor(() => {
      expect(indicator).toHaveStyle({ opacity: "1" });
    });
  });

  it("composes a function-form style instead of dropping it", () => {
    const styleFn = vi.fn(() => ({ color: "rgb(12, 34, 56)" }));

    render(
      <TabsRoot defaultValue="a">
        <TabsList>
          <TabsTab value="a">One</TabsTab>
          <TabsIndicator data-testid="indicator" style={styleFn} />
        </TabsList>
        <TabsPanel value="a">Content</TabsPanel>
      </TabsRoot>
    );

    expect(styleFn).toHaveBeenCalled();
    expect(screen.getByTestId("indicator")).toHaveStyle({
      color: "rgb(12, 34, 56)",
    });
  });

  it("composeIndicatorStyle merges function-form style onto measured styles", () => {
    const measured = { opacity: 1, width: 40 };
    const composed = composeIndicatorStyle(measured, () => ({
      color: "rgb(1, 2, 3)",
    }));
    expect(typeof composed).toBe("function");
    if (typeof composed !== "function") {
      throw new Error("expected a style function");
    }
    expect(composed({})).toEqual({
      color: "rgb(1, 2, 3)",
      opacity: 1,
      width: 40,
    });
  });
});
