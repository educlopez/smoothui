import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render, screen, waitFor } from "../../../test-utils/render";
import Sidebar, {
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "../index";

describe("Sidebar", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton active>Home</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarTrigger />
      </SidebarProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("toggles collapsed state", async () => {
    const user = userEvent.setup();
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>Nav</SidebarContent>
        </Sidebar>
        <SidebarTrigger />
      </SidebarProvider>
    );
    const aside = screen.getByRole("complementary", { name: "Sidebar" });
    expect(aside).not.toHaveAttribute("data-collapsed");
    await user.click(screen.getByRole("button", { name: "Collapse sidebar" }));
    expect(aside).toHaveAttribute("data-collapsed", "true");
  });

  it("keeps menu labels accessible when collapsed", async () => {
    const user = userEvent.setup();
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton icon={<span aria-hidden>⌂</span>}>
                  Overview
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarTrigger />
      </SidebarProvider>
    );

    await user.click(screen.getByRole("button", { name: "Collapse sidebar" }));
    expect(
      screen.getByRole("button", { name: "Overview" })
    ).toBeInTheDocument();
    // The label now fades with the width and turns sr-only once the fade ends.
    await waitFor(() =>
      expect(screen.getByText("Overview")).toHaveClass("sr-only")
    );
  });

  it("fades the label in on expand instead of popping it in", async () => {
    const user = userEvent.setup();
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton icon={<span aria-hidden>x</span>}>
                  Overview
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarTrigger />
      </SidebarProvider>
    );

    await user.click(screen.getByRole("button", { name: "Collapse sidebar" }));
    await waitFor(() =>
      expect(screen.getByText("Overview")).toHaveClass("sr-only")
    );
    await user.click(screen.getByRole("button", { name: "Expand sidebar" }));
    // First frame after expand: visible layout but still transparent.
    expect(screen.getByText("Overview")).toHaveClass("opacity-0");
    expect(screen.getByText("Overview")).toHaveClass("transition-opacity");
    await waitFor(() =>
      expect(screen.getByText("Overview")).not.toHaveClass("opacity-0")
    );
  });
});
