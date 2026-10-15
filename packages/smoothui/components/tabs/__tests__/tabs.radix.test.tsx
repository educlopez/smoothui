import { describe, expect, it } from "vitest";
import { render, screen } from "../../../test-utils/render";
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
});
