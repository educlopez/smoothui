"use client";

import Checkbox from "@repo/smoothui/components/checkbox";
import { useState } from "react";

export default function CheckboxDemo() {
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(true);

  return (
    <div className="flex w-full max-w-xs flex-col gap-6 p-8">
      <div className="flex items-center gap-3">
        <Checkbox checked={checked} id="terms" onCheckedChange={setChecked} />
        <label
          className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="terms"
        >
          Accept terms and conditions
        </label>
      </div>

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
          Select all (indeterminate)
        </label>
      </div>

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
}
