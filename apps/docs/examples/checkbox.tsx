"use client";

import Checkbox from "@repo/smoothui/components/checkbox";
import { useState } from "react";

const CheckedDemo = () => {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex items-center gap-3">
        <Checkbox checked={checked} id="terms" onCheckedChange={setChecked} />
        <label
          className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="terms"
        >
          Accept terms and conditions
        </label>
      </div>
    </div>
  );
};

const IndeterminateDemo = () => {
  const [indeterminate, setIndeterminate] = useState(true);

  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex items-center gap-3">
        <Checkbox
          checked={false}
          id="indeterminate"
          indeterminate={indeterminate}
          onCheckedChange={() => setIndeterminate(false)}
        />
        <label
          className="font-medium text-sm leading-none"
          htmlFor="indeterminate"
        >
          Select all
        </label>
      </div>
    </div>
  );
};

const DisabledDemo = () => (
  <div className="flex items-center justify-center p-8">
    <div className="flex items-center gap-3">
      <Checkbox checked={false} disabled id="disabled" />
      <label
        className="font-medium text-sm leading-none opacity-50"
        htmlFor="disabled"
      >
        Disabled checkbox
      </label>
    </div>
  </div>
);

export const demoScenes = {
  Disabled: DisabledDemo,
  Features: CheckedDemo,
  Indeterminate: IndeterminateDemo,
};

export default function CheckboxDemo() {
  return <CheckedDemo />;
}
