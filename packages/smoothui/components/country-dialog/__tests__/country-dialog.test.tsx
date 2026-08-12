import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "../../../test-utils/render";
import CountryDialog, { type Country, type CountryDialogProps } from "../index";

const countries: Country[] = [
  { code: "ES", dialCode: "+34", group: "Europe", name: "Spain" },
  { code: "US", dialCode: "+1", group: "Americas", name: "United States" },
];

const countriesWithDiacritic: Country[] = [
  { code: "CX", name: "Café Republic" },
  { code: "US", name: "United States" },
];

type HarnessProps = Partial<
  Pick<CountryDialogProps, "countries" | "recent" | "groupBy">
> & {
  onOpenChange?: (open: boolean) => void;
  onValueChange?: (code: string) => void;
};

const CountryDialogHarness = ({
  countries: countryList = countries,
  onOpenChange,
  onValueChange,
  ...rest
}: HarnessProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | undefined>();
  return (
    <CountryDialog
      countries={countryList}
      onOpenChange={(next) => {
        setOpen(next);
        onOpenChange?.(next);
      }}
      onValueChange={(code) => {
        setValue(code);
        onValueChange?.(code);
      }}
      open={open}
      value={value}
      {...rest}
    />
  );
};

describe("CountryDialog", () => {
  it("renders without throwing when closed", () => {
    const { container } = render(
      <CountryDialog
        countries={countries}
        onOpenChange={vi.fn()}
        onValueChange={vi.fn()}
        open={false}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it("renders the open dialog variant without throwing", () => {
    const { container } = render(
      <CountryDialog
        countries={countries}
        groupBy
        onOpenChange={vi.fn()}
        onValueChange={vi.fn()}
        open
        recent={["US"]}
      />
    );
    expect(container).toBeInTheDocument();
  });
});

describe("CountryDialog interactions", () => {
  it("opens on trigger click, closes on Escape, and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<CountryDialogHarness onOpenChange={onOpenChange} />);

    const trigger = screen.getByRole("button", { name: "Select country" });
    await user.click(trigger);

    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    const searchInput = screen.getByRole("combobox");
    await waitFor(() => expect(searchInput).toHaveFocus());

    await user.keyboard("{Escape}");

    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("filters countries by name, diacritic-insensitively", async () => {
    const user = userEvent.setup();
    render(<CountryDialogHarness countries={countriesWithDiacritic} />);

    await user.click(screen.getByRole("button", { name: "Select country" }));
    const searchInput = screen.getByRole("combobox");
    await waitFor(() => expect(searchInput).toHaveFocus());

    await user.type(searchInput, "cafe");

    expect(screen.getByText("Café Republic")).toBeInTheDocument();
    expect(screen.queryByText("United States")).not.toBeInTheDocument();
  });

  it("moves the highlighted option with Arrow Down/Up, Home and End", async () => {
    const user = userEvent.setup();
    render(<CountryDialogHarness />);

    await user.click(screen.getByRole("button", { name: "Select country" }));
    const searchInput = screen.getByRole("combobox");
    await waitFor(() => expect(searchInput).toHaveFocus());

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(2);
    expect(searchInput).toHaveAttribute("aria-activedescendant", options[0].id);

    fireEvent.keyDown(searchInput, { key: "ArrowDown" });
    expect(searchInput).toHaveAttribute("aria-activedescendant", options[1].id);

    fireEvent.keyDown(searchInput, { key: "Home" });
    expect(searchInput).toHaveAttribute("aria-activedescendant", options[0].id);

    fireEvent.keyDown(searchInput, { key: "End" });
    expect(searchInput).toHaveAttribute("aria-activedescendant", options[1].id);

    fireEvent.keyDown(searchInput, { key: "ArrowUp" });
    expect(searchInput).toHaveAttribute("aria-activedescendant", options[0].id);
  });

  it("selects the highlighted option with Enter and closes the dialog", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <CountryDialogHarness
        onOpenChange={onOpenChange}
        onValueChange={onValueChange}
      />
    );

    await user.click(screen.getByRole("button", { name: "Select country" }));
    const searchInput = screen.getByRole("combobox");
    await waitFor(() => expect(searchInput).toHaveFocus());

    fireEvent.keyDown(searchInput, { key: "ArrowDown" });
    fireEvent.keyDown(searchInput, { key: "Enter" });

    expect(onValueChange).toHaveBeenCalledWith("US");
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });
});
