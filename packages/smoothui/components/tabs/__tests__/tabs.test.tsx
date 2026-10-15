import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render, screen } from "../../../test-utils/render";
import {
  TabsIndicator,
  TabsList,
  TabsPanel,
  TabsRoot,
  TabsTab,
} from "../index";

describe("Tabs", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <TabsRoot defaultValue="a">
        <TabsList variant="underline">
          <TabsTab value="a">Account</TabsTab>
          <TabsTab value="b">Settings</TabsTab>
          <TabsIndicator />
        </TabsList>
        <TabsPanel value="a">Account panel</TabsPanel>
        <TabsPanel value="b">Settings panel</TabsPanel>
      </TabsRoot>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    render(
      <TabsRoot defaultValue="a">
        <TabsList>
          <TabsTab value="a">One</TabsTab>
          <TabsIndicator />
        </TabsList>
        <TabsPanel value="a">Content</TabsPanel>
      </TabsRoot>
    );
    expect(screen.getByRole("tab", { name: "One" })).toBeInTheDocument();
  });
});
