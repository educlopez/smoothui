import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render, screen } from "../../../test-utils/render";
import Menubar, {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "../index";
import RadixMenubar, {
  MenubarContent as RadixMenubarContent,
  MenubarItem as RadixMenubarItem,
  MenubarMenu as RadixMenubarMenu,
  MenubarTrigger as RadixMenubarTrigger,
} from "../menubar.radix";

describe("Menubar", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("exposes menubar semantics", () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Copy</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    expect(screen.getByRole("menubar")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Edit" })).toBeInTheDocument();
  });
});

describe("Menubar (Radix twin)", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <RadixMenubar>
        <RadixMenubarMenu>
          <RadixMenubarTrigger>File</RadixMenubarTrigger>
          <RadixMenubarContent>
            <RadixMenubarItem>New</RadixMenubarItem>
          </RadixMenubarContent>
        </RadixMenubarMenu>
      </RadixMenubar>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
