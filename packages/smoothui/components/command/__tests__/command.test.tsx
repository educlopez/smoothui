import { beforeAll, describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render, screen } from "../../../test-utils/render";
import Command, {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../index";

beforeAll(() => {
  Element.prototype.scrollIntoView = () => undefined;
});

describe("Command", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <Command>
        <CommandInput placeholder="Search…" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem>New file</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders command items", () => {
    render(
      <Command>
        <CommandList>
          <CommandGroup>
            <CommandItem>Open settings</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    );
    expect(screen.getByText("Open settings")).toBeInTheDocument();
  });
});
