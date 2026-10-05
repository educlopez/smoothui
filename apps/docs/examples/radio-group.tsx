"use client";

import { Radio, RadioGroup } from "@repo/smoothui/components/radio-group";
import { useState } from "react";

export default function RadioGroupDemo() {
  const [value, setValue] = useState("comfortable");

  return (
    <div className="flex w-full max-w-xs items-center justify-center p-8">
      <RadioGroup onValueChange={setValue} value={value}>
        <Radio id="compact" value="compact">
          Compact
        </Radio>
        <Radio id="comfortable" value="comfortable">
          Comfortable
        </Radio>
        <Radio id="spacious" value="spacious">
          Spacious
        </Radio>
      </RadioGroup>
    </div>
  );
}
