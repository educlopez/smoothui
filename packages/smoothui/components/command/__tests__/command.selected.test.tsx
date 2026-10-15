import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it } from "vitest";
import { render, screen } from "../../../test-utils/render";
import Command, {
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../index";

beforeAll(() => {
  Element.prototype.scrollIntoView = () => undefined;
});

const BRAND_BG = /data-\[selected=true\]:bg-(brand|accent)/;

const renderCommand = () =>
  render(
    <Command>
      <CommandInput placeholder="Search" />
      <CommandList>
        <CommandGroup heading="Actions">
          <CommandItem>New file</CommandItem>
          <CommandItem>Open file</CommandItem>
          <CommandItem>Save file</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );

const selectedLabel = () =>
  document.querySelector('[cmdk-item][data-selected="true"]')?.textContent;

describe("Command selected item", () => {
  it("highlights the keyboard-selected item with a neutral background", () => {
    renderCommand();
    const item = screen.getByText("New file");
    const classes = item.className.split(" ");
    // Translucent, so the sliding hover highlight underneath stays visible
    // (the item sits above it at z-10).
    expect(classes).toContain("data-[selected=true]:bg-foreground/10");
    expect(classes).not.toContain("data-[selected=true]:bg-muted");
    expect(item.className).not.toMatch(BRAND_BG);
  });

  it("moves data-selected with ArrowDown", async () => {
    const user = userEvent.setup();
    renderCommand();
    const input = screen.getByPlaceholderText("Search");
    input.focus();
    expect(selectedLabel()).toBe("New file");
    await user.keyboard("{ArrowDown}");
    expect(selectedLabel()).toBe("Open file");
    await user.keyboard("{ArrowDown}");
    expect(selectedLabel()).toBe("Save file");
  });
});
