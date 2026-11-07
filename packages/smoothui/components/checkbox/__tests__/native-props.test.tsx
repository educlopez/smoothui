import { type ComponentType, createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "../../../test-utils/render";
import {
  Radio as RadioBase,
  RadioGroup as RadioGroupBase,
} from "../../radio-group/radio-group.base";
import {
  RadioGroup as RadioGroupRadix,
  Radio as RadioRadix,
} from "../../radio-group/radio-group.radix";
import Select from "../../select";
import SwitchBase from "../../switch/switch.base";
import SwitchRadix from "../../switch/switch.radix";
import ToggleBase from "../../toggle/toggle.base";
import ToggleRadix from "../../toggle/toggle.radix";
import CheckboxBase from "../checkbox.base";
import CheckboxRadix from "../checkbox.radix";

type NativeForwardingProps = {
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  "aria-label"?: string;
  "data-testid"?: string;
  onBlur?: () => void;
  ref?: React.Ref<HTMLButtonElement>;
};

const TWINS: [string, ComponentType<NativeForwardingProps>][] = [
  ["Checkbox (Base UI)", CheckboxBase],
  ["Checkbox (Radix)", CheckboxRadix],
  ["Switch (Base UI)", SwitchBase],
  ["Switch (Radix)", SwitchRadix],
  ["Toggle (Base UI)", ToggleBase],
  ["Toggle (Radix)", ToggleRadix],
];

// Form libraries (react-hook-form `register`) and field error wiring need the
// ref and the native attributes to land on the interactive element.
describe.each(TWINS)("%s forwards native props", (_name, Control) => {
  it("forwards ref, aria and data attributes, and focus handlers", () => {
    const ref = createRef<HTMLButtonElement>();
    const onBlur = vi.fn();
    render(
      <>
        <Control
          aria-describedby="hint"
          aria-invalid
          aria-label="Control"
          data-testid="control"
          onBlur={onBlur}
          ref={ref}
        />
        <p id="hint">Hint</p>
      </>
    );

    const control = screen.getByTestId("control");
    expect(control.tagName).toBe("BUTTON");
    expect(ref.current).toBe(control);
    expect(control).toHaveAttribute("aria-describedby", "hint");
    expect(control).toHaveAttribute("aria-invalid", "true");

    control.focus();
    control.blur();
    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});

describe.each([
  ["Base UI", RadioGroupBase, RadioBase],
  ["Radix", RadioGroupRadix, RadioRadix],
] as const)("RadioGroup (%s) forwards native props", (_name, Group, Item) => {
  it("forwards ref and aria to the group and to each radio", () => {
    const groupRef = createRef<HTMLDivElement>();
    const itemRef = createRef<HTMLButtonElement>();
    render(
      <Group aria-describedby="hint" aria-label="Plan" ref={groupRef}>
        <Item data-testid="radio" ref={itemRef} value="a">
          A
        </Item>
      </Group>
    );

    const group = screen.getByRole("radiogroup", { name: "Plan" });
    expect(groupRef.current).toBe(group);
    expect(group).toHaveAttribute("aria-describedby", "hint");
    expect(itemRef.current).toBe(screen.getByTestId("radio"));
  });
});

describe("Select forwards native props to its trigger", () => {
  it("forwards ref, aria attributes and onBlur", () => {
    const ref = createRef<HTMLButtonElement>();
    const onBlur = vi.fn();
    render(
      <Select
        aria-describedby="hint"
        aria-invalid
        aria-label="Fruit"
        onBlur={onBlur}
        options={[{ label: "Apple", value: "apple" }]}
        ref={ref}
      />
    );

    const trigger = screen.getByRole("combobox", { name: "Fruit" });
    expect(ref.current).toBe(trigger);
    expect(trigger).toHaveAttribute("aria-describedby", "hint");
    expect(trigger).toHaveAttribute("aria-invalid", "true");
    trigger.focus();
    trigger.blur();
    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});
