import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { render, screen } from "../../../test-utils/render";
import {
  TabsIndicator,
  TabsList,
  TabsPanel,
  TabsRoot,
  TabsTab,
} from "../index";

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
});
