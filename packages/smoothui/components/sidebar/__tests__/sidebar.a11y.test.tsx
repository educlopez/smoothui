import { describe, expect, it } from "vitest";
import { render, screen } from "../../../test-utils/render";
import Sidebar, {
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "../index";

const renderMenu = () =>
  render(
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton active>Home</SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>Reports</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );

describe("Sidebar menu button states", () => {
  it("marks only the active item as the current page", () => {
    renderMenu();
    expect(
      screen.getByRole("button", { name: "Home" }).getAttribute("aria-current")
    ).toBe("page");
    expect(
      screen
        .getByRole("button", { name: "Reports" })
        .hasAttribute("aria-current")
    ).toBe(false);
  });

  it("has hover and focus-visible styling on every item", () => {
    renderMenu();
    for (const name of ["Home", "Reports"]) {
      const tokens = screen.getByRole("button", { name }).className.split(" ");
      expect(tokens.some((token) => token.startsWith("hover:"))).toBe(true);
      expect(tokens.some((token) => token.startsWith("focus-visible:"))).toBe(
        true
      );
    }
  });
});
