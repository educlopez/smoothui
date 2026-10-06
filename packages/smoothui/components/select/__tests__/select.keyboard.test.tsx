import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render, screen, waitFor } from "../../../test-utils/render";
import Select from "../index";

const options = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
];

describe("Select keyboard and aria-activedescendant", () => {
  it("points aria-activedescendant at the focused option", async () => {
    const user = userEvent.setup();
    render(<Select aria-label="Fruit" options={options} />);
    const trigger = screen.getByRole("combobox", { name: "Fruit" });
    trigger.focus();
    expect(trigger.hasAttribute("aria-activedescendant")).toBe(false);

    await user.keyboard("{Enter}");
    expect(await screen.findByRole("listbox")).toBeInTheDocument();
    await user.keyboard("{ArrowDown}{ArrowDown}");

    const activeId = trigger.getAttribute("aria-activedescendant");
    expect(activeId).toBeTruthy();
    const active = document.getElementById(activeId as string);
    expect(active).not.toBeNull();
    expect(active?.getAttribute("role")).toBe("option");
    expect(active?.textContent).toBe("Banana");
    expect(trigger.getAttribute("aria-controls")).toBe(
      screen.getByRole("listbox").id
    );
  });

  it("gives every option a unique id", async () => {
    const user = userEvent.setup();
    render(<Select aria-label="Fruit" options={options} />);
    await user.click(screen.getByRole("combobox", { name: "Fruit" }));
    const ids = screen.getAllByRole("option").map((option) => option.id);
    expect(ids.every(Boolean)).toBe(true);
    expect(new Set(ids).size).toBe(options.length);
  });

  it("selects with Enter and closes with Escape", async () => {
    const user = userEvent.setup();
    render(<Select aria-label="Fruit" options={options} />);
    const trigger = screen.getByRole("combobox", { name: "Fruit" });
    trigger.focus();
    await user.keyboard("{Enter}");
    await user.keyboard("{ArrowDown}{Enter}");
    expect(trigger.textContent).toContain("Apple");
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());

    await user.keyboard("{Enter}");
    expect(await screen.findByRole("listbox")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
    expect(trigger.hasAttribute("aria-activedescendant")).toBe(false);
  });

  it("has no accessibility violations while open with an active option", async () => {
    const user = userEvent.setup();
    const { baseElement } = render(
      <Select aria-label="Fruit" options={options} />
    );
    screen.getByRole("combobox", { name: "Fruit" }).focus();
    await user.keyboard("{Enter}{ArrowDown}");
    await screen.findByRole("listbox");
    // The landmark rule is about whole pages, not a portalled widget fragment.
    expect(
      await axe(baseElement, { rules: { region: { enabled: false } } })
    ).toHaveNoViolations();
  });
});
