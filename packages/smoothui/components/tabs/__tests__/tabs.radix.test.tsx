import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "../../../test-utils/render";
import {
  TabsIndicator,
  TabsList,
  TabsPanel,
  TabsRoot,
  TabsTab,
} from "../tabs.radix";

describe("Tabs radix twin", () => {
  it("does not forward activateOnFocus to the tablist DOM", () => {
    render(
      <TabsRoot defaultValue="a">
        <TabsList activateOnFocus data-testid="tablist">
          <TabsTab value="a">Account</TabsTab>
          <TabsTab value="b">Billing</TabsTab>
          <TabsIndicator />
        </TabsList>
        <TabsPanel value="a">Account content</TabsPanel>
        <TabsPanel value="b">Billing content</TabsPanel>
      </TabsRoot>
    );

    const list = screen.getByTestId("tablist");
    expect(list).not.toHaveAttribute("activateOnFocus");
    expect(list).not.toHaveAttribute("activateonfocus");
  });

  it("measures the indicator when a value is selected after starting with none", async () => {
    const user = userEvent.setup();

    const Harness = () => {
      const [value, setValue] = useState<string | undefined>();
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
    expect(screen.getByTestId("indicator")).toHaveStyle({ opacity: "0" });

    await user.click(screen.getByRole("tab", { name: "One" }));
    await waitFor(() => {
      expect(screen.getByTestId("indicator")).toHaveStyle({ opacity: "1" });
    });
  });
});
